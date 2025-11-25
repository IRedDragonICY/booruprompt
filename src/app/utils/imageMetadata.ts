export interface ImageMetadata {
    positivePrompt?: string;
    negativePrompt?: string;
    parameters?: Record<string, string>;
    
    // Basic Info
    width?: number;
    height?: number;
    bitDepth?: number;
    colorType?: string;
    compression?: string;
    filter?: string;
    interlace?: string;
    
    // Raw Metadata
    raw?: Record<string, string>;
    
    // ComfyUI
    comfy?: {
        prompt?: any;
        workflow?: any;
    };

    // General EXIF
    exif?: Record<string, string>;

    // ICC Profile
    icc?: Record<string, string>;

    error?: string;
}

export const MAX_IMAGE_SIZE_BYTES = 50 * 1024 * 1024; // Increased limit

const COLOR_TYPES: Record<number, string> = {
    0: 'Grayscale',
    2: 'RGB',
    3: 'Indexed',
    4: 'Grayscale with Alpha',
    6: 'RGB with Alpha'
};

const INTERLACE_METHODS: Record<number, string> = {
    0: 'Noninterlaced',
    1: 'Adam7'
};

export async function extractImageMetadata(file: File): Promise<ImageMetadata> {
    if (!file.type.startsWith('image/')) return { error: "Invalid file type." };
    if (file.size > MAX_IMAGE_SIZE_BYTES) return { error: `File too large (max ${MAX_IMAGE_SIZE_BYTES / 1024 / 1024}MB).` };

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (!e.target?.result || !(e.target.result instanceof ArrayBuffer)) return resolve({ error: "Could not read file." });
            const buffer = e.target.result;
            const view = new DataView(buffer);
            const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];
            let isPng = true;
            for (let i = 0; i < pngSignature.length; i++) {
                if (view.getUint8(i) !== pngSignature[i]) {
                    isPng = false;
                    break;
                }
            }

            // Check for JPEG (FF D8 FF)
            const isJpeg = view.getUint8(0) === 0xFF && view.getUint8(1) === 0xD8;

            if (isJpeg) {
                const metadata = extractJpegMetadata(buffer);
                processMetadata(metadata);
                return resolve(metadata);
            }

            if (isPng) {
                const metadata: ImageMetadata = { raw: {} };
                let offset = 8;

                try {
                    while (offset < view.byteLength) {
                        if (offset + 8 > view.byteLength) break;
                        const length = view.getUint32(offset, false);
                        offset += 4;
                        const type = String.fromCharCode(view.getUint8(offset), view.getUint8(offset + 1), view.getUint8(offset + 2), view.getUint8(offset + 3));
                        offset += 4;

                        if (type === 'IHDR') {
                            metadata.width = view.getUint32(offset, false);
                            metadata.height = view.getUint32(offset + 4, false);
                            metadata.bitDepth = view.getUint8(offset + 8);
                            metadata.colorType = COLOR_TYPES[view.getUint8(offset + 9)] || `Unknown (${view.getUint8(offset + 9)})`;
                            metadata.compression = view.getUint8(offset + 10) === 0 ? 'Deflate/Inflate' : `Unknown (${view.getUint8(offset + 10)})`;
                            metadata.filter = view.getUint8(offset + 11) === 0 ? 'Adaptive' : `Unknown (${view.getUint8(offset + 11)})`;
                            metadata.interlace = INTERLACE_METHODS[view.getUint8(offset + 12)] || `Unknown (${view.getUint8(offset + 12)})`;
                        } else if (type === 'tEXt') {
                            const chunkData = new Uint8Array(buffer, offset, length);
                            const zeroIndex = chunkData.indexOf(0);
                            if (zeroIndex > 0) {
                                const keyword = new TextDecoder("iso-8859-1").decode(chunkData.slice(0, zeroIndex));
                                const text = new TextDecoder("utf-8").decode(chunkData.slice(zeroIndex + 1));
                                if (metadata.raw) metadata.raw[keyword] = text;
                            }
                        } else if (type === 'IEND') {
                            break;
                        }
                        
                        offset += length + 4; // Skip data + CRC
                    }
                } catch (err) {
                    return resolve({ error: `Error parsing PNG: ${(err as Error).message}` });
                }

                // Process extracted metadata
                processMetadata(metadata);
                
                resolve(metadata);
            } else {
                // For non-PNG files, we currently don't support metadata extraction
                // but we return empty metadata so the image can still be displayed
                resolve({});
            }
        };
        reader.onerror = () => resolve({ error: "Failed to read file." });
        reader.readAsArrayBuffer(file);
    });
}

function processMetadata(metadata: ImageMetadata) {
    if (!metadata.raw) return;

    // 1. Try A1111 'parameters'
    if (metadata.raw['parameters']) {
        parseA1111Parameters(metadata.raw['parameters'], metadata);
    }

    // 2. Try ComfyUI 'prompt' and 'workflow'
    if (metadata.raw['prompt'] || metadata.raw['workflow']) {
        parseComfyUIMetadata(metadata);
    }
}

function parseA1111Parameters(text: string, metadata: ImageMetadata) {
    try {
        const lines = text.trim().split('\n');
        let posLines: string[] = [];
        let negPrompt = '';
        const params: Record<string, string> = {};
        let paramStr = '';
        let negIdx = -1;

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().startsWith('Negative prompt:')) {
                negIdx = i;
                break;
            }
        }

        if (negIdx !== -1) {
            posLines = lines.slice(0, negIdx).map(l => l.trim()).filter(Boolean);
            negPrompt = lines[negIdx].substring('Negative prompt:'.length).trim();
            paramStr = lines.slice(negIdx + 1).map(l => l.trim()).filter(Boolean).join(' ');
        } else {
            const lastIdx = lines.length - 1;
            const lastLine = lastIdx >= 0 ? lines[lastIdx].trim() : '';
            const keywords = ["Steps:", "Sampler:", "CFG scale:", "Seed:", "Size:", "Model hash:", "Model:", "Lora hashes:", "Version:"];
            let looksLikeParams = false;
            if (lastLine.includes(':') && lastLine.includes(',')) {
                looksLikeParams = keywords.some(k => lastLine.includes(k));
            }
            
            if (looksLikeParams) {
                paramStr = lastLine;
                posLines = lines.slice(0, lastIdx).map(l => l.trim()).filter(Boolean);
            } else {
                posLines = lines.map(l => l.trim()).filter(Boolean);
            }
        }

        metadata.positivePrompt = posLines.join('\n').trim();

        if (paramStr) {
            const pairs = paramStr.split(/,\s*(?=[a-zA-Z0-9\s\-_.'"]+:)/);
            for (const pair of pairs) {
                const sepIdx = pair.indexOf(':');
                if (sepIdx > 0) {
                    const key = pair.substring(0, sepIdx).trim();
                    const val = pair.substring(sepIdx + 1).trim();
                    if (key) params[key] = val;
                }
            }
        }

        // Handle mixed negative prompt in params or trailing lines
        const negParts = negPrompt.split(', ');
        let finalNegPrompt = negPrompt;
        
        // Sometimes negative prompt spills into what we thought was params if parsing failed, 
        // but the logic above is standard A1111.
        
        metadata.negativePrompt = finalNegPrompt || undefined;
        metadata.parameters = Object.keys(params).length > 0 ? params : undefined;

    } catch (e) {
        console.error("Error parsing A1111 parameters", e);
    }
}

function parseComfyUIMetadata(metadata: ImageMetadata) {
    try {
        metadata.comfy = {};
        
        if (metadata.raw && metadata.raw['prompt']) {
            metadata.comfy.prompt = JSON.parse(metadata.raw['prompt']);
        }
        if (metadata.raw && metadata.raw['workflow']) {
            metadata.comfy.workflow = JSON.parse(metadata.raw['workflow']);
        }

        // If we haven't found prompts from A1111, try to extract from ComfyUI
        if (!metadata.positivePrompt && metadata.comfy.prompt) {
            extractComfyPrompts(metadata.comfy.prompt, metadata);
        }
    } catch (e) {
        console.error("Error parsing ComfyUI metadata", e);
    }
}

function extractComfyPrompts(promptJson: any, metadata: ImageMetadata) {
    // Strategy: Find KSampler nodes, look at their 'positive' and 'negative' inputs.
    // Then trace those inputs to CLIPTextEncode nodes.
    // Also find CheckpointLoader for model name and EmptyLatentImage for size.
    
    try {
        let kSamplerNode = null;
        let checkpointNode = null;
        let latentNode = null;
        let vaeNode = null;
        let upscaleNode = null;

        for (const key in promptJson) {
            const node = promptJson[key];
            if (node.class_type === 'KSampler' || node.class_type === 'KSamplerAdvanced') {
                kSamplerNode = node;
            }
            if (node.class_type === 'CheckpointLoaderSimple' || node.class_type === 'CheckpointLoader') {
                checkpointNode = node;
            }
            if (node.class_type === 'EmptyLatentImage') {
                latentNode = node;
            }
            if (node.class_type === 'VAELoader') {
                vaeNode = node;
            }
            if (node.class_type === 'UltimateSDUpscale' || node.class_type === 'UpscaleModelLoader') {
                upscaleNode = node;
            }
            if (node.class_type === 'ModelSamplingAuraFlow') {
                if (!metadata.parameters) metadata.parameters = {};
                if (node.inputs?.shift) metadata.parameters['Shift'] = String(node.inputs.shift);
            }
        }

        if (!metadata.parameters) metadata.parameters = {};

        if (kSamplerNode) {
            const posInput = kSamplerNode.inputs?.positive;
            const negInput = kSamplerNode.inputs?.negative;

            if (Array.isArray(posInput) && posInput.length > 0) {
                const posNodeId = posInput[0];
                const posNode = promptJson[posNodeId];
                if (posNode && (posNode.class_type === 'CLIPTextEncode' || posNode.class_type === 'CLIPTextEncodeSDXL')) {
                    metadata.positivePrompt = posNode.inputs?.text;
                }
            }

            if (Array.isArray(negInput) && negInput.length > 0) {
                const negNodeId = negInput[0];
                const negNode = promptJson[negNodeId];
                if (negNode && (negNode.class_type === 'CLIPTextEncode' || negNode.class_type === 'CLIPTextEncodeSDXL')) {
                    metadata.negativePrompt = negNode.inputs?.text;
                }
            }
            
            // Extract other params from KSampler
            if (kSamplerNode.inputs.seed) metadata.parameters['Seed'] = String(kSamplerNode.inputs.seed);
            if (kSamplerNode.inputs.steps) metadata.parameters['Steps'] = String(kSamplerNode.inputs.steps);
            if (kSamplerNode.inputs.cfg) metadata.parameters['CFG scale'] = String(kSamplerNode.inputs.cfg);
            if (kSamplerNode.inputs.sampler_name) metadata.parameters['Sampler'] = String(kSamplerNode.inputs.sampler_name);
            if (kSamplerNode.inputs.scheduler) metadata.parameters['Scheduler'] = String(kSamplerNode.inputs.scheduler);
            if (kSamplerNode.inputs.denoise && kSamplerNode.inputs.denoise < 1) metadata.parameters['Denoise'] = String(kSamplerNode.inputs.denoise);
        }

        // Extract Checkpoint Name
        if (checkpointNode && checkpointNode.inputs?.ckpt_name) {
            metadata.parameters['Model'] = String(checkpointNode.inputs.ckpt_name);
        }

        // Extract VAE Name
        if (vaeNode && vaeNode.inputs?.vae_name) {
            metadata.parameters['VAE'] = String(vaeNode.inputs.vae_name);
        }

        // Extract Generation Size
        if (latentNode && latentNode.inputs?.width && latentNode.inputs?.height) {
            metadata.parameters['Size'] = `${latentNode.inputs.width}x${latentNode.inputs.height}`;
            if (latentNode.inputs.batch_size && latentNode.inputs.batch_size > 1) {
                metadata.parameters['Batch Size'] = String(latentNode.inputs.batch_size);
            }
        }

        // Extract Upscale Info
        if (upscaleNode) {
             // This is a bit generic, as upscale nodes vary
             metadata.parameters['Upscale'] = 'Yes';
        }

    } catch (e) {
        console.error("Error extracting ComfyUI prompts", e);
    }
}

export const createThumbnail = (file: File, size: number): Promise<string | null> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (!e.target?.result || typeof e.target.result !== 'string') return resolve(null);
            const img = document.createElement('img');
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return resolve(null);
                canvas.width = size;
                canvas.height = size;
                ctx.drawImage(img, 0, 0, size, size);
                resolve(canvas.toDataURL('image/png'));
                URL.revokeObjectURL(img.src);
            };
            img.onerror = () => {
                resolve(null);
                URL.revokeObjectURL(img.src);
            };
            img.src = e.target.result;
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
    });
};

function extractJpegMetadata(buffer: ArrayBuffer): ImageMetadata {
    const view = new DataView(buffer);
    const metadata: ImageMetadata = { raw: {}, exif: {}, icc: {} };
    let offset = 2;

    while (offset < view.byteLength) {
        if (view.getUint8(offset) !== 0xFF) break;

        const marker = view.getUint8(offset + 1);
        const length = view.getUint16(offset + 2, false);

        // APP0 - JFIF
        if (marker === 0xE0) {
            if (length >= 16 && 
                view.getUint8(offset + 4) === 0x4A && // J
                view.getUint8(offset + 5) === 0x46 && // F
                view.getUint8(offset + 6) === 0x49 && // I
                view.getUint8(offset + 7) === 0x46 && // F
                view.getUint8(offset + 8) === 0x00) { // \0
                
                const major = view.getUint8(offset + 9);
                const minor = view.getUint8(offset + 10);
                const units = view.getUint8(offset + 11);
                const xDensity = view.getUint16(offset + 12, false);
                const yDensity = view.getUint16(offset + 14, false);

                if (metadata.exif) {
                    metadata.exif['JFIFVersion'] = `${major}.${minor < 10 ? '0' + minor : minor}`;
                    metadata.exif['ResolutionUnit'] = units === 1 ? 'inches' : (units === 2 ? 'cm' : 'none');
                    metadata.exif['XResolution'] = xDensity.toString();
                    metadata.exif['YResolution'] = yDensity.toString();
                }
            }
        }

        // APP1 - Exif / XMP
        if (marker === 0xE1) { // APP1
            if (view.byteLength >= offset + 10) {
                // Check for Exif
                const exifHeader = "Exif\0\0";
                let isExif = true;
                for (let i = 0; i < 6; i++) {
                    if (view.getUint8(offset + 4 + i) !== exifHeader.charCodeAt(i)) {
                        isExif = false;
                        break;
                    }
                }
                if (isExif) {
                    const tiffStart = offset + 10;
                    const tags = readExifTags(view, tiffStart);
                    
                    if (tags) {
                        metadata.exif = { ...metadata.exif, ...tags };
                        
                        // Map specific tags to raw parameters if they contain generation info
                        if (tags['UserComment']) {
                            if (!metadata.raw) metadata.raw = {};
                            metadata.raw['parameters'] = tags['UserComment'];
                        }
                        // Some tools put generation info in ImageDescription
                        if (tags['ImageDescription']) {
                            // If it looks like parameters (contains "Steps:" or "Model:"), treat it as such
                            if (tags['ImageDescription'].includes('Steps:') || tags['ImageDescription'].includes('Model:')) {
                                if (!metadata.raw) metadata.raw = {};
                                // If we already have parameters from UserComment, append or prefer?
                                // Usually UserComment is more reliable for A1111, but ImageDescription might have upscale info.
                                if (!metadata.raw['parameters']) {
                                    metadata.raw['parameters'] = tags['ImageDescription'];
                                } else {
                                    // Append as extra info if needed, or just keep it in exif
                                }
                            }
                        }
                    }
                }

                // Check for XMP
                const xmpHeader = "http://ns.adobe.com/xap/1.0/\0";
                let isXmp = true;
                for (let i = 0; i < 29; i++) {
                    if (view.getUint8(offset + 4 + i) !== xmpHeader.charCodeAt(i)) {
                        isXmp = false;
                        break;
                    }
                }
                if (isXmp) {
                    const xmpStart = offset + 4 + 29;
                    const xmpLen = length - 2 - 29;
                    if (xmpStart + xmpLen <= view.byteLength) {
                        const xmpData = new Uint8Array(view.buffer, xmpStart, xmpLen);
                        const decoder = new TextDecoder('utf-8');
                        const xmlString = decoder.decode(xmpData);
                        const xmpMeta = parseXmp(xmlString);
                        if (xmpMeta && metadata.exif) {
                            metadata.exif = { ...metadata.exif, ...xmpMeta };
                        }
                    }
                }
            }
        }

        // APP2 - ICC Profile
        if (marker === 0xE2) {
            const iccHeader = "ICC_PROFILE\0";
            let isIcc = true;
            for (let i = 0; i < 12; i++) {
                if (view.getUint8(offset + 4 + i) !== iccHeader.charCodeAt(i)) {
                    isIcc = false;
                    break;
                }
            }
            if (isIcc && metadata.exif) {
                const iccStart = offset + 4 + 12 + 2; // +2 for chunk count/index
                
                try {
                    const deviceClass = new TextDecoder().decode(new Uint8Array(view.buffer, iccStart + 12, 4));
                    const colorSpace = new TextDecoder().decode(new Uint8Array(view.buffer, iccStart + 16, 4));
                    const pcs = new TextDecoder().decode(new Uint8Array(view.buffer, iccStart + 20, 4));
                    const dateYear = view.getUint16(iccStart + 24, false);
                    const dateMonth = view.getUint16(iccStart + 26, false);
                    const dateDay = view.getUint16(iccStart + 28, false);
                    const dateHour = view.getUint16(iccStart + 30, false);
                    const dateMin = view.getUint16(iccStart + 32, false);
                    const dateSec = view.getUint16(iccStart + 34, false);
                    const signature = new TextDecoder().decode(new Uint8Array(view.buffer, iccStart + 36, 4));
                    const platform = new TextDecoder().decode(new Uint8Array(view.buffer, iccStart + 40, 4));
                    
                    metadata.exif['ProfileClass'] = getIccClassDescription(deviceClass);
                    metadata.exif['ColorSpaceData'] = colorSpace.trim();
                    metadata.exif['ProfileConnectionSpace'] = pcs.trim();
                    metadata.exif['ProfileDateTime'] = `${dateYear}-${dateMonth}-${dateDay} ${dateHour}:${dateMin}:${dateSec}`;
                    metadata.exif['ProfileFileSignature'] = signature.trim();
                    metadata.exif['PrimaryPlatform'] = platform.trim() || 'Unknown';
                    metadata.exif['CMMFlags'] = 'Not Embedded, Independent'; // Simplified
                    metadata.exif['DeviceManufacturer'] = new TextDecoder().decode(new Uint8Array(view.buffer, iccStart + 48, 4)).trim();
                    metadata.exif['DeviceModel'] = new TextDecoder().decode(new Uint8Array(view.buffer, iccStart + 52, 4)).trim();
                    metadata.exif['RenderingIntent'] = ['Perceptual', 'Media-Relative Colorimetric', 'Saturation', 'ICC-Absolute Colorimetric'][view.getUint32(iccStart + 64, false)] || 'Unknown';
                    metadata.exif['ProfileCreator'] = new TextDecoder().decode(new Uint8Array(view.buffer, iccStart + 80, 4)).trim();
                    metadata.exif['ProfileID'] = Array.from(new Uint8Array(view.buffer, iccStart + 84, 16)).map(b => b.toString(16).padStart(2, '0')).join('');

                    // Parse Tags
                    const tagCount = view.getUint32(iccStart + 128, false);
                    let tagOffset = iccStart + 132;
                    
                    for (let i = 0; i < tagCount; i++) {
                        if (tagOffset + 12 > view.byteLength) break;
                        const tagSig = new TextDecoder().decode(new Uint8Array(view.buffer, tagOffset, 4));
                        const tagDataOffset = view.getUint32(tagOffset + 4, false);
                        const tagDataSize = view.getUint32(tagOffset + 8, false);
                        
                        if (tagSig === 'desc') { // Profile Description
                            const descOffset = iccStart + tagDataOffset;
                            if (descOffset + tagDataSize <= view.byteLength) {
                                const descLen = view.getUint32(descOffset + 8, false);
                                if (descLen > 0 && descLen < tagDataSize) {
                                    metadata.exif['ProfileDescription'] = new TextDecoder().decode(new Uint8Array(view.buffer, descOffset + 12, descLen - 1)); 
                                }
                            }
                        } else if (tagSig === 'cprt') { // Copyright
                             const cprtOffset = iccStart + tagDataOffset;
                             if (cprtOffset + tagDataSize <= view.byteLength) {
                                 metadata.exif['ProfileCopyright'] = new TextDecoder().decode(new Uint8Array(view.buffer, cprtOffset + 8, tagDataSize - 8)).replace(/\0/g, '');
                             }
                        } else if (tagSig === 'wtpt') { // MediaWhitePoint
                             const wpOffset = iccStart + tagDataOffset;
                             const x = view.getInt32(wpOffset + 8, false) / 65536.0;
                             const y = view.getInt32(wpOffset + 12, false) / 65536.0;
                             const z = view.getInt32(wpOffset + 16, false) / 65536.0;
                             metadata.exif['MediaWhitePoint'] = `${x.toFixed(5)} ${y.toFixed(5)} ${z.toFixed(5)}`;
                        }
                        
                        tagOffset += 12;
                    }

                } catch (e) {
                    console.warn("Error parsing ICC profile", e);
                }
            }
        }

        // SOF0 (Baseline), SOF2 (Progressive)
        if (marker === 0xC0 || marker === 0xC2) {
            const precision = view.getUint8(offset + 4);
            const height = view.getUint16(offset + 5, false);
            const width = view.getUint16(offset + 7, false);
            const components = view.getUint8(offset + 9);

            if (metadata.exif) {
                metadata.exif['EncodingProcess'] = marker === 0xC0 ? 'Baseline DCT, Huffman coding' : 'Progressive DCT, Huffman coding';
                metadata.exif['BitsPerSample'] = precision.toString();
                metadata.exif['ImageHeight'] = height.toString();
                metadata.exif['ImageWidth'] = width.toString();
                metadata.exif['ColorComponents'] = components.toString();
                metadata.exif['ImageSize'] = `${width}x${height}`;
                metadata.exif['Megapixels'] = (width * height / 1000000).toFixed(1);
                
                if (components === 3) {
                    metadata.exif['YCbCrSubSampling'] = 'YCbCr4:2:0 (2 2)'; 
                }
            }
        }

        offset += 2 + length;
    }
    return metadata;
}

function getIccClassDescription(cls: string): string {
    switch (cls) {
        case 'mntr': return 'Display Device Profile';
        case 'scnr': return 'Input Device Profile';
        case 'prtr': return 'Output Device Profile';
        case 'link': return 'DeviceLink Profile';
        case 'spac': return 'ColorSpace Conversion Profile';
        case 'abst': return 'Abstract Profile';
        case 'nmcl': return 'Named Color Profile';
        default: return cls;
    }
}

function parseXmp(xml: string): Record<string, string> {
    const metadata: Record<string, string> = {};
    if (typeof DOMParser === 'undefined') return metadata;

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, "text/xml");
        
        const extract = (tag: string, name: string) => {
            const elements = doc.getElementsByTagName(tag);
            if (elements.length > 0) {
                metadata[name] = elements[0].textContent || '';
            }
        };

        // Common XMP tags
        extract('dc:format', 'Format');
        extract('dc:title', 'Title');
        extract('dc:description', 'Description');
        extract('dc:creator', 'Creator');
        extract('xmp:CreatorTool', 'CreatorTool');
        extract('xmp:CreateDate', 'CreateDate');
        extract('xmp:ModifyDate', 'ModifyDate');
        extract('xmp:MetadataDate', 'MetadataDate');
        extract('photoshop:DateCreated', 'DateCreated');
        extract('photoshop:Credit', 'Credit');
        extract('photoshop:Source', 'Source');
        extract('photoshop:Headline', 'Headline');
        
        // Try to find software agent in history
        const history = doc.getElementsByTagName('stEvt:softwareAgent');
        if (history.length > 0) {
             metadata['HistorySoftwareAgent'] = history[history.length - 1].textContent || '';
        }

    } catch (e) {
        console.warn("XMP Parsing failed", e);
    }
    return metadata;
}

const EXIF_TAGS: Record<number, string> = {
    0x0100: 'ImageWidth',
    0x0101: 'ImageHeight',
    0x0102: 'BitsPerSample',
    0x0103: 'Compression',
    0x0106: 'PhotometricInterpretation',
    0x010E: 'ImageDescription',
    0x010F: 'Make',
    0x0110: 'Model',
    0x0111: 'StripOffsets',
    0x0112: 'Orientation',
    0x0115: 'SamplesPerPixel',
    0x0116: 'RowsPerStrip',
    0x0117: 'StripByteCounts',
    0x011A: 'XResolution',
    0x011B: 'YResolution',
    0x011C: 'PlanarConfiguration',
    0x0128: 'ResolutionUnit',
    0x012D: 'TransferFunction',
    0x0131: 'Software',
    0x0132: 'DateTime',
    0x013B: 'Artist',
    0x013E: 'WhitePoint',
    0x013F: 'PrimaryChromaticities',
    0x0201: 'JPEGInterchangeFormat',
    0x0202: 'JPEGInterchangeFormatLength',
    0x0211: 'YCbCrCoefficients',
    0x0212: 'YCbCrSubSampling',
    0x0213: 'YCbCrPositioning',
    0x0214: 'ReferenceBlackWhite',
    0x8298: 'Copyright',
    0x8769: 'ExifOffset',
    0x8825: 'GPSInfo',
    0x9000: 'ExifVersion',
    0x9003: 'DateTimeOriginal',
    0x9004: 'DateTimeDigitized',
    0x9101: 'ComponentsConfiguration',
    0x9102: 'CompressedBitsPerPixel',
    0x927C: 'MakerNote',
    0x9286: 'UserComment',
    0xA001: 'ColorSpace',
    0xA002: 'PixelXDimension',
    0xA003: 'PixelYDimension',
    0xA401: 'CustomRendered',
    0xA402: 'ExposureMode',
    0xA403: 'WhiteBalance',
    0xA404: 'DigitalZoomRatio',
    0xA405: 'FocalLengthIn35mmFilm',
    0xA406: 'SceneCaptureType',
    0xA407: 'GainControl',
    0xA408: 'Contrast',
    0xA409: 'Saturation',
    0xA40A: 'Sharpness',
    0xA40B: 'DeviceSettingDescription',
    0xA40C: 'SubjectDistanceRange',
    0xA420: 'ImageUniqueID',
    0xA430: 'CameraOwnerName',
    0xA431: 'BodySerialNumber',
    0xA432: 'LensSpecification',
    0xA433: 'LensMake',
    0xA434: 'LensModel',
    0xA435: 'LensSerialNumber',
};

function readExifTags(view: DataView, tiffStart: number): Record<string, string> | null {
    const littleEndian = view.getUint16(tiffStart, false) === 0x4949;
    const ifdOffset = view.getUint32(tiffStart + 4, littleEndian);
    const tags: Record<string, string> = {};

    let currentIfdOffset = tiffStart + ifdOffset;

    // Read 0th IFD
    readIFD(view, currentIfdOffset, tiffStart, littleEndian, tags);

    // Check for Exif SubIFD
    if (tags['ExifOffset']) {
        const exifOffset = parseInt(tags['ExifOffset']);
        if (!isNaN(exifOffset)) {
            readIFD(view, tiffStart + exifOffset, tiffStart, littleEndian, tags);
        }
        delete tags['ExifOffset']; // Internal pointer, not needed in output
    }

    return tags;
}

function readIFD(view: DataView, ifdOffset: number, tiffStart: number, littleEndian: boolean, tags: Record<string, string>) {
    if (ifdOffset + 2 > view.byteLength) return;
    const numEntries = view.getUint16(ifdOffset, littleEndian);
    let currentOffset = ifdOffset + 2;

    for (let i = 0; i < numEntries; i++) {
        const entryOffset = currentOffset + (i * 12);
        if (entryOffset + 12 > view.byteLength) return;

        const tag = view.getUint16(entryOffset, littleEndian);
        const type = view.getUint16(entryOffset + 2, littleEndian);
        const count = view.getUint32(entryOffset + 4, littleEndian);
        const valueOffset = view.getUint32(entryOffset + 8, littleEndian);

        const tagName = EXIF_TAGS[tag];
        if (tagName) {
            if (tagName === 'ExifOffset') {
                tags[tagName] = valueOffset.toString();
            } else if (tagName === 'UserComment') {
                 let dataOffset = tiffStart + valueOffset;
                 if (count <= 4) dataOffset = entryOffset + 8; // Value fits in offset field
                 
                 if (dataOffset + count <= view.byteLength) {
                     const encodingPrefix = new Uint8Array(view.buffer, dataOffset, 8);
                     let textStart = dataOffset + 8;
                     let textLen = count - 8;
                     
                     // Handle UserComment encoding
                     if (encodingPrefix[0] === 0x41 && encodingPrefix[1] === 0x53 && encodingPrefix[2] === 0x43) { // ASCII
                         tags[tagName] = new TextDecoder('ascii').decode(new Uint8Array(view.buffer, textStart, textLen)).replace(/\0/g, '');
                     } else if (encodingPrefix[0] === 0x55 && encodingPrefix[1] === 0x4E && encodingPrefix[2] === 0x49) { // UNICODE
                         tags[tagName] = new TextDecoder('utf-16').decode(new Uint8Array(view.buffer, textStart, textLen)).replace(/\0/g, '');
                     } else {
                         // Try reading as UTF-8/ASCII directly if no prefix or unknown
                         tags[tagName] = new TextDecoder('utf-8').decode(new Uint8Array(view.buffer, dataOffset, count)).replace(/\0/g, '');
                     }
                 }
            } else if (type === 2) { // ASCII string
                let dataOffset = count > 4 ? tiffStart + valueOffset : entryOffset + 8;
                if (dataOffset + count <= view.byteLength) {
                    const val = new TextDecoder('utf-8').decode(new Uint8Array(view.buffer, dataOffset, count - 1)); // -1 for null terminator
                    tags[tagName] = val.replace(/\0/g, '');
                }
            }
        }
    }
}


