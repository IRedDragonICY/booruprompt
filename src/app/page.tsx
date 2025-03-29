// page.tsx
'use client';

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';

// --- Types ---
type TagCategory = 'copyright' | 'character' | 'general' | 'meta' | 'other';

type TagCategoryOption = {
    id: TagCategory;
    label: string;
    enabled: boolean;
    color: string;
};

interface ExtractedTag {
    name: string;
    category: TagCategory;
}

interface ExtractionResult {
    tags: ExtractedTag[];
    imageUrl?: string;
    title?: string;
}

// --- Utility Functions ---
const utils = {
    getCategoryFromClassList: (element: Element): TagCategory => {
        const classList = element.classList;
        if (classList.contains('tag-type-copyright') || classList.contains('tag-type-3')) return 'copyright';
        if (classList.contains('tag-type-character') || classList.contains('tag-type-4')) return 'character';
        if (classList.contains('tag-type-general') || classList.contains('tag-type-0')) return 'general';
        if (classList.contains('tag-type-metadata') || classList.contains('tag-type-5')) return 'meta';
        if (classList.contains('tag-type-artist') || classList.contains('tag-type-1')) return 'other';
        const parentCategoryElement = element.closest('[class*="tag-type-"]');
        if (parentCategoryElement) return utils.getCategoryFromClassList(parentCategoryElement);
        return 'general';
    },
    getCategoryFromHeader: (text: string): TagCategory => {
        const normalized = text.toLowerCase().trim();
        if (normalized.includes('copyright')) return 'copyright';
        if (normalized.includes('character')) return 'character';
        if (normalized.includes('general')) return 'general';
        if (normalized.includes('meta') || normalized.includes('metadata')) return 'meta';
        if (normalized.includes('artist')) return 'other';
        return 'other';
    },
    cleanTagName: (tagName: string): string => {
        return tagName.replace(/ \(\d+\.?\d*[kM]?\)$/, '').trim();
    },
    extractTagsByClass: (doc: Document, selectors: { container: string, tag: string }): ExtractedTag[] => {
        const tags: ExtractedTag[] = [];
        const elements = doc.querySelectorAll(selectors.container);
        elements.forEach(element => {
            const tagElement = selectors.tag ? element.querySelector(selectors.tag) : element;
            const tagName = tagElement?.textContent?.trim() || '';
            if (tagName) {
                const category = utils.getCategoryFromClassList(element);
                const cleanName = utils.cleanTagName(tagName);
                if (cleanName.toLowerCase() !== category && !['copyrights', 'characters', 'general', 'meta', 'metadata', 'artists'].includes(cleanName.toLowerCase())) {
                    tags.push({ name: cleanName, category });
                }
            }
        });
        return tags;
    },
    extractTagsBySection: (doc: Document, selector: string, tagLinkSelector: string): ExtractedTag[] => {
        const tags: ExtractedTag[] = [];
        let currentCategory: TagCategory = 'other';
        const container = doc.querySelector(selector);
        if (!container) return [];

        Array.from(container.children).forEach(child => {
            if ((child.tagName === 'H3' || child.tagName === 'H6' || child.classList.contains('tag-type-header')) && child.textContent) {
                currentCategory = utils.getCategoryFromHeader(child.textContent);
            }
            else if (child.tagName === 'UL') {
                Array.from(child.children).forEach(tagLi => {
                    if (tagLi.tagName === 'LI') {
                        const tagElement = tagLi.querySelector(tagLinkSelector);
                        const tagName = tagElement?.textContent?.trim();
                        if (tagName) {
                            const cleanName = utils.cleanTagName(tagName);
                            tags.push({ name: cleanName, category: currentCategory });
                        }
                    }
                });
            }
            else if (child.tagName === 'LI' && (child.classList.contains('tag') || child.querySelector(tagLinkSelector))) {
                const tagElement = child.querySelector(tagLinkSelector);
                const tagName = tagElement?.textContent?.trim();
                if (tagName) {
                    const cleanName = utils.cleanTagName(tagName);
                    const categoryFromClass = utils.getCategoryFromClassList(child);
                    tags.push({ name: cleanName, category: categoryFromClass !== 'general' ? categoryFromClass : currentCategory });
                }
            }
        });
        return tags;
    },
    extractImageUrl: (doc: Document, selector: string, attribute: string = 'src'): string | undefined => {
        const imgElement = doc.querySelector(selector) as HTMLImageElement | HTMLVideoElement | HTMLElement;
        if (!imgElement) return undefined;

        if (imgElement.tagName === 'VIDEO') {
            const sourceElement = imgElement.querySelector('source');
            return sourceElement?.src || imgElement.getAttribute('src') || undefined;
        }
        return imgElement.getAttribute(attribute) || imgElement.getAttribute('src') || undefined;
    },
    extractTitle: (doc: Document, selector: string): string | undefined => {
        const titleElement = doc.querySelector(selector);
        return titleElement?.textContent?.trim() || doc.title?.trim() || undefined;
    }
};

// --- Extraction Strategies ---
const extractionStrategies = {
    danbooru: (doc: Document): ExtractionResult => ({
        tags: utils.extractTagsByClass(doc, {
            container: '#tag-list li[class*="tag-type-"]',
            tag: 'a.search-tag'
        }),
        imageUrl: utils.extractImageUrl(doc, '#image, #image-container > picture > img, #image-container > img', 'src'),
        title: utils.extractTitle(doc, 'title')
    }),
    safebooru: (doc: Document): ExtractionResult => ({
        tags: utils.extractTagsBySection(doc, '#tag-sidebar, .tag-sidebar', 'a[href*="page=post"]'),
        imageUrl: utils.extractImageUrl(doc, '#image, #content img[alt="img"]', 'src'),
        title: utils.extractTitle(doc, 'title')
    }),
    gelbooru: (doc: Document): ExtractionResult => ({
        tags: utils.extractTagsByClass(doc, {
            container: '.tag-list li[class*="tag-type-"]',
            tag: 'a[href*="page=post"]'
        }),
        imageUrl: utils.extractImageUrl(doc, '#image, #gelcomVideoPlayer > source', 'src'),
        title: utils.extractTitle(doc, 'title')
    }),
    rule34: (doc: Document): ExtractionResult => ({
        tags: utils.extractTagsBySection(doc, '#tag-sidebar, .tag-sidebar', 'a[href*="page=post"]'),
        imageUrl: utils.extractImageUrl(doc, '#image, #gelcomVideoPlayer > source', 'src'),
        title: utils.extractTitle(doc, 'title')
    }),
    e621: (doc: Document): ExtractionResult => ({
        tags: utils.extractTagsByClass(doc, {
            container: '#tag-list li[class*="tag-type-"]',
            tag: '.tag-name a, a.tag-name'
        }),
        imageUrl: utils.extractImageUrl(doc, '#image, #image-container img', 'src'),
        title: utils.extractTitle(doc, 'title')
    })
};

// --- Constants ---
const BOORU_SITES = [
    { name: 'Danbooru', urlPattern: /danbooru\.donmai\.us\/posts\/\d+/i, extractTags: extractionStrategies.danbooru },
    { name: 'Safebooru', urlPattern: /safebooru\.org\/(index\.php\?page=post&s=view&id=\d+|images\/\d+)/i, extractTags: extractionStrategies.safebooru },
    { name: 'Gelbooru', urlPattern: /gelbooru\.com\/index\.php\?page=post&s=view&id=\d+/i, extractTags: extractionStrategies.gelbooru },
    { name: 'Rule34', urlPattern: /rule34\.xxx\/index\.php\?page=post&s=view&id=\d+/i, extractTags: extractionStrategies.rule34 },
    { name: 'e621', urlPattern: /e621\.net\/posts\/\d+/i, extractTags: extractionStrategies.e621 }
];

const DEFAULT_TAG_CATEGORIES: TagCategoryOption[] = [
    { id: 'copyright', label: 'Copyright', enabled: true, color: 'bg-pink-500' },
    { id: 'character', label: 'Character', enabled: true, color: 'bg-indigo-500' },
    { id: 'general', label: 'General', enabled: true, color: 'bg-blue-500' },
    { id: 'meta', label: 'Meta', enabled: true, color: 'bg-emerald-500' },
    { id: 'other', label: 'Other/Artist', enabled: true, color: 'bg-amber-500' }
];

// --- Sub-Components ---

const CategoryToggle = ({ category, count, onToggle }: { category: TagCategoryOption; count: number; onToggle: () => void }) => (
    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-md shadow-sm transform hover:-translate-y-1 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center space-x-2 overflow-hidden">
            <span className={`inline-block w-3 h-3 rounded-full ${category.color} animate-pulse flex-shrink-0`}></span>
            <span className="truncate" title={category.label}>{category.label}</span>
            {count > 0 && (
                <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full text-gray-300 flex-shrink-0">
                    {count}
                </span>
            )}
        </div>
        <label className="inline-flex items-center cursor-pointer flex-shrink-0 ml-2">
            <input
                type="checkbox"
                className="sr-only"
                checked={category.enabled}
                onChange={onToggle}
                aria-labelledby={`category-label-${category.id}`}
            />
            <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${category.enabled ? category.color : 'bg-gray-600'}`}>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${category.enabled ? 'transform translate-x-5' : ''}`}></div>
            </div>
        </label>
        <span id={`category-label-${category.id}`} className="sr-only">{category.label} Toggle</span>
    </div>
);


const StatusMessage = ({ type, children }: { type: 'info' | 'error', children: React.ReactNode }) => (
    <div className={`bg-gray-700 border-l-4 ${type === 'info' ? 'border-blue-500' : 'border-red-500'} p-4 rounded animate-fadeIn`}>
        <p className={`text-sm ${type === 'info' ? 'text-blue-300' : 'text-red-300'}`}>
            {children}
        </p>
    </div>
);

const LoadingSpinner = () => (
    <span className="flex items-center justify-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Extracting...
    </span>
);

const ImagePreview = ({ url, title, isLoading }: { url?: string; title?: string; isLoading: boolean; }) => {
    const [imgLoading, setImgLoading] = useState(true);
    const [imgError, setImgError] = useState(false);
    const isVideo = url?.match(/\.(mp4|webm|ogg)$/i);

    useEffect(() => {
        if (url || isLoading) {
            setImgLoading(true);
            setImgError(false);
        }
    }, [url, isLoading]);

    if (isLoading) {
        return (
            <div className="w-full h-60 flex items-center justify-center bg-gray-800 rounded-md animate-pulse">
                <div className="text-gray-500">Loading preview...</div>
            </div>
        );
    }

    if (!url) {
        return null;
    }

    if (imgError) {
        return (
            <div className="w-full h-60 flex items-center justify-center bg-gray-800 rounded-md border border-red-500/50">
                <div className="text-center text-red-400 text-sm px-4">
                    <p>Could not load image/video preview.</p>
                    <p className="text-xs text-gray-400">(Possibly CORS or invalid URL)</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-60 group">
            {(imgLoading || isVideo) && (
                <div className={`absolute inset-0 flex items-center justify-center bg-gray-800 rounded-md ${imgLoading && !isVideo ? 'animate-pulse' : ''}`}>
                    <div className="text-gray-500">{isVideo ? "Video preview (click to play)" : "Loading preview..."}</div>
                </div>
            )}

            <div className="relative w-full h-full overflow-hidden rounded-md bg-gray-800">
                {isVideo ? (
                    <video
                        key={url}
                        controls
                        muted
                        className={`w-full h-full object-contain transition-opacity duration-300 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
                        onLoadedData={() => setImgLoading(false)}
                        onError={() => {
                            console.error("Error loading video:", url);
                            setImgLoading(false);
                            setImgError(true);
                        }}
                    >
                        <source src={url} />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    /* eslint-disable @next/next/no-img-element */
                    <img
                        key={url}
                        src={url}
                        alt={title || "Booru image preview"}
                        className={`w-full h-full object-contain transition-opacity duration-300 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
                        onLoad={() => setImgLoading(false)}
                        onError={() => {
                            console.error("Error loading image:", url);
                            setImgLoading(false);
                            setImgError(true);
                        }}
                        loading="lazy"
                    />
                    /* eslint-enable @next/next/no-img-element */
                )}

                {title && !imgLoading && !imgError && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate" title={title}>
                        {title}
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Main Component ---
const BooruTagExtractor = () => {
    const [url, setUrl] = useState('');
    const [allExtractedTags, setAllExtractedTags] = useState<ExtractedTag[]>([]);
    const [imageUrl, setImageUrl] = useState<string | undefined>();
    const [imageTitle, setImageTitle] = useState<string | undefined>();
    const [displayedTags, setDisplayedTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeSite, setActiveSite] = useState<string | null>(null);
    const [tagCategories, setTagCategories] = useState<TagCategoryOption[]>(DEFAULT_TAG_CATEGORIES);
    const [isMobile, setIsMobile] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const currentExtractionUrl = useRef<string | null>(null);

    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth < 640);
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    useEffect(() => {
        if (allExtractedTags.length > 0) {
            const enabledCategories = new Set(
                tagCategories.filter(cat => cat.enabled).map(cat => cat.id)
            );

            const filteredTags = allExtractedTags
                .filter(tag => enabledCategories.has(tag.category))
                .map(tag => tag.name);

            setDisplayedTags(filteredTags.join(', '));
        } else {
            setDisplayedTags('');
        }
    }, [allExtractedTags, tagCategories]);

    const tagCounts = useMemo(() => {
        return allExtractedTags.reduce((acc, tag) => {
            acc[tag.category] = (acc[tag.category] || 0) + 1;
            return acc;
        }, {} as Record<TagCategory, number>);
    }, [allExtractedTags]);

    const handleReset = useCallback(() => {
        setUrl('');
        setAllExtractedTags([]);
        setImageUrl(undefined);
        setImageTitle(undefined);
        setDisplayedTags('');
        setError('');
        setActiveSite(null);
        setTagCategories(DEFAULT_TAG_CATEGORIES);
        setCopySuccess(false);
        setLoading(false);
        currentExtractionUrl.current = null;
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
    }, []);

    const extractTags = useCallback(async (targetUrl: string) => {
        if (!targetUrl || loading || targetUrl === currentExtractionUrl.current) {
            if(!targetUrl && !loading) {
                handleReset();
            }
            return;
        }

        const site = BOORU_SITES.find(s => s.urlPattern.test(targetUrl));
        if (!site) {
            setError('URL does not match supported sites/formats.');
            setAllExtractedTags([]);
            setImageUrl(undefined);
            setImageTitle(undefined);
            setActiveSite(null);
            currentExtractionUrl.current = null;
            return;
        }

        console.log(`Attempting extraction for: ${targetUrl} using ${site.name} strategy`);
        setLoading(true);
        setError('');
        setAllExtractedTags([]);
        setImageUrl(undefined);
        setImageTitle(undefined);
        setDisplayedTags('');
        setActiveSite(null);
        setCopySuccess(false);
        currentExtractionUrl.current = targetUrl;

        let response: Response | undefined;
        try {
            setActiveSite(site.name);
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
            response = await fetch(proxyUrl);

            if (!response.ok) {
                let errorBody = `HTTP error ${response.status}`;
                try {
                    const text = await response.text();
                    if (text.includes("Could not retrieve contents")) {
                        errorBody = "Proxy could not retrieve page content. URL might be invalid, site blocked the proxy, or requires login.";
                    } else {
                        try {
                            const jsonError = JSON.parse(text);
                            if (jsonError?.contents?.error) {
                                errorBody = `Proxy Error: ${jsonError.contents.error}`;
                            } else if (jsonError?.error) {
                                errorBody = `Proxy Error: ${jsonError.error}`;
                            } else if (text.length < 500) {
                                errorBody = text || errorBody;
                            }
                        } catch {
                            if (text.length < 500) errorBody = text || errorBody;
                        }
                    }
                } catch { /* Ignore nested parsing errors */
                }
                throw new Error(errorBody);
            }

            const html = await response.text();
            if (!html) {
                throw new Error("Received empty response from proxy.");
            }

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            if (doc.body?.textContent?.includes("Could not retrieve contents") || doc.title.toLowerCase().includes("error")) {
                throw new Error("Proxy could not retrieve page content. The URL might be wrong or the site blocked the proxy.");
            }

            const extractionResult = site.extractTags(doc);

            if (extractionResult.tags.length === 0 && !extractionResult.imageUrl) {
                console.warn("Extraction result:", extractionResult);
                throw new Error('No tags or image found. Page structure might differ, content blocked, or not a valid post page.');
            } else if (extractionResult.tags.length === 0) {
                setError('Image found, but no tags were extracted. Page structure might have changed.');
            } else {
                setError('');
            }

            console.log("Extraction successful:", {
                tags: extractionResult.tags.length,
                imageUrl: !!extractionResult.imageUrl,
                title: extractionResult.title
            });
            setAllExtractedTags(extractionResult.tags);
            setImageUrl(extractionResult.imageUrl);
            setImageTitle(extractionResult.title);

        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            if (!error) {
                setError(`Extraction failed: ${message}`);
            }
            console.error('Error extracting tags:', err);
            if (!(err instanceof Error && error)) {
                setAllExtractedTags([]);
                setImageUrl(undefined);
                setImageTitle(undefined);
            }
            setActiveSite(null);
            currentExtractionUrl.current = null;
        } finally {
            setLoading(false);
        }
    }, [loading, handleReset, error]);


    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        const trimmedUrl = url.trim();

        if (trimmedUrl && trimmedUrl.includes('.') && trimmedUrl.length > 10) {
            const site = BOORU_SITES.find(s => s.urlPattern.test(trimmedUrl));
            if (site) {
                if (trimmedUrl !== currentExtractionUrl.current) {
                    debounceTimeoutRef.current = setTimeout(() => {
                        if (trimmedUrl === url.trim() && trimmedUrl !== currentExtractionUrl.current) {
                            extractTags(trimmedUrl).catch(e => {
                                console.error("Extraction failed in debounce handler:", e);
                            });
                        }
                    }, 750);
                }
            } else {
                if (trimmedUrl !== currentExtractionUrl.current) {
                    setError('URL does not match supported sites/formats.');
                    setAllExtractedTags([]);
                    setImageUrl(undefined);
                    setImageTitle(undefined);
                    setActiveSite(null);
                }
            }
        } else if (!trimmedUrl && currentExtractionUrl.current) {
            handleReset();
        }

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [url, extractTags, handleReset]);


    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setUrl(newUrl);
        if (error && newUrl.trim() !== currentExtractionUrl.current) {
            setError('');
        }
    };


    const handleManualExtract = () => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        currentExtractionUrl.current = null;
        extractTags(url.trim()).catch(e => {
            console.error("Manual extraction failed:", e);
        });
    };

    const toggleTagCategory = (categoryId: TagCategory) => {
        setTagCategories(prev =>
            prev.map(cat => cat.id === categoryId ? { ...cat, enabled: !cat.enabled } : cat)
        );
        setCopySuccess(false);
    };

    const toggleAllCategories = (enabled: boolean) => {
        setTagCategories(prev => prev.map(cat => ({ ...cat, enabled })));
        setCopySuccess(false);
    };

    const handleCopy = async () => {
        if (!displayedTags) return;
        try {
            await navigator.clipboard.writeText(displayedTags);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (copyErr) {
            console.error('Failed to copy to clipboard:', copyErr);
            setError("Failed to copy tags. Your browser might not support this feature or requires permission.");
        }
    };

    // Calculate button disabled states
    const areAllEnabled = useMemo(() => tagCategories.every(cat => cat.enabled), [tagCategories]);
    const areNoneEnabled = useMemo(() => tagCategories.every(cat => !cat.enabled), [tagCategories]);


    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black">
            <div className="w-full max-w-xl bg-gray-850/80 backdrop-blur-md rounded-lg overflow-hidden border border-gray-700 shadow-xl transform transition-all duration-500 hover:shadow-2xl animate-fadeIn">

                <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 relative overflow-hidden border-b border-gray-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-gradient-x opacity-50"></div>
                    <h1 className="text-2xl font-bold text-white relative z-10 animate-fadeSlideDown">Booru Tag Extractor</h1>
                    <p className="text-sm text-gray-300 mt-1 relative z-10 animate-fadeSlideDown animation-delay-100 flex flex-wrap gap-x-2">
                        Supports:
                        {BOORU_SITES.map((site, index) => (
                            <span key={site.name} className={`${activeSite === site.name ? 'text-blue-300 font-medium' : ''} transition-colors duration-300`}>
                                {site.name}{index < BOORU_SITES.length - 1 ? ',' : ''}
                            </span>
                        ))}
                    </p>
                </div>

                <div className="p-6 space-y-6 animate-fadeIn animation-delay-200">
                    <div className="transform transition-all duration-300 hover:scale-[1.01]">
                        <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
                            Booru Post URL (e.g., Danbooru, Gelbooru...)
                        </label>
                        <input
                            id="url"
                            type="url"
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:scale-[1.01]"
                            placeholder="Paste URL here... extraction starts automatically"
                            value={url}
                            onChange={handleUrlChange}
                            aria-label="Booru Post URL"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 animate-fadeSlideUp animation-delay-300">
                        <button
                            onClick={handleManualExtract}
                            disabled={loading || !url.trim()}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-850 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:enabled:scale-105 active:enabled:scale-95 hover:enabled:shadow-lg"
                            aria-label="Extract Tags Manually"
                        >
                            {loading ? <LoadingSpinner /> : 'Extract Manually'}
                        </button>

                        <button
                            onClick={handleReset}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-850 transition-all duration-300 transform hover:scale-105 active:scale-95"
                            aria-label="Reset Form"
                        >
                            Reset
                        </button>
                    </div>

                    {activeSite && !error && !loading && (
                        <div className="animate-fadeIn animation-delay-400">
                            <StatusMessage type="info">
                                Extracted from: <span className="font-medium">{activeSite}</span>
                            </StatusMessage>
                        </div>
                    )}
                    {error && (
                        <div className="animate-shakeX">
                            <StatusMessage type="error">{error}</StatusMessage>
                        </div>
                    )}

                    {(imageUrl || (loading && !imageUrl)) && (
                        <div className="animate-fadeIn animation-delay-400">
                            <h3 className="text-md font-medium text-white mb-2">Preview</h3>
                            <ImagePreview
                                url={imageUrl}
                                title={imageTitle}
                                isLoading={loading && !imageUrl}
                            />
                        </div>
                    )}


                    {allExtractedTags.length > 0 && !loading && (
                        <div className="space-y-4 animate-fadeIn animation-delay-500">
                            <div className="bg-gray-750/70 p-4 rounded-md shadow-inner backdrop-blur-sm border border-gray-700">
                                <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
                                    <h3 className="text-md font-medium text-white">Filter Tag Categories</h3>
                                    <div className="flex space-x-2 flex-shrink-0">
                                        <button
                                            onClick={() => toggleAllCategories(true)}
                                            disabled={areAllEnabled} // Disable if all are already enabled
                                            className={`text-xs px-2 py-1 rounded transition-colors duration-300 transform hover:scale-105 active:scale-95 ${
                                                areAllEnabled
                                                    ? 'bg-blue-800 text-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                            aria-label="Select All Tag Categories"
                                            aria-disabled={areAllEnabled}
                                        >
                                            All
                                        </button>
                                        <button
                                            onClick={() => toggleAllCategories(false)}
                                            disabled={areNoneEnabled} // Disable if none are enabled
                                            className={`text-xs px-2 py-1 rounded transition-colors duration-300 transform hover:scale-105 active:scale-95 ${
                                                areNoneEnabled
                                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                                    : 'bg-gray-600 hover:bg-gray-700'
                                            }`}
                                            aria-label="Clear All Tag Categories"
                                            aria-disabled={areNoneEnabled}
                                        >
                                            None
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {DEFAULT_TAG_CATEGORIES.map((categoryDef, idx) => {
                                        const categoryOption = tagCategories.find(c => c.id === categoryDef.id) || categoryDef;
                                        const count = tagCounts[categoryOption.id] || 0;
                                        if (count > 0 || DEFAULT_TAG_CATEGORIES.some(dc => dc.id === categoryOption.id)) {
                                            return (
                                                <div key={categoryOption.id} className={`animate-fadeSlideUp animation-delay-${600 + idx * 50}`}>
                                                    <CategoryToggle
                                                        category={categoryOption}
                                                        count={count}
                                                        onToggle={() => toggleTagCategory(categoryOption.id)}
                                                    />
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {allExtractedTags.length > 0 && !loading && (
                        <div className="space-y-4 animate-fadeIn animation-delay-700">
                            <div className="transform transition-all duration-300 hover:scale-[1.01]">
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
                                    Filtered Tags ({displayedTags.split(',').filter(t => t.trim()).length} shown)
                                </label>
                                <textarea
                                    id="tags"
                                    rows={isMobile ? 6 : 4}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:shadow-lg resize-y"
                                    readOnly
                                    value={displayedTags || "No tags match selected categories."}
                                    aria-label="Extracted and filtered tags"
                                />
                            </div>

                            <button
                                onClick={handleCopy}
                                disabled={!displayedTags || copySuccess}
                                className={`w-full font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-850 transition-all duration-500 transform hover:enabled:scale-105 active:enabled:scale-95 hover:enabled:shadow-lg ${
                                    copySuccess
                                        ? 'bg-green-700 text-white animate-pulse cursor-default'
                                        : 'bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                                }`}
                                aria-label={copySuccess ? "Tags Copied" : "Copy Filtered Tags"}
                            >
                                {copySuccess ? 'Copied!' : 'Copy Tags'}
                            </button>
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-700 p-4 bg-gray-800/50 text-gray-400 text-xs text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 animate-pulse opacity-30"></div>
                    <p className="relative z-10">Made with <span className="animate-heartBeat inline-block text-red-400">❤️</span> by <a href="https://x.com/ireddragonicy" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300 transition-colors">IRedDragonICY</a></p>
                    <p className="relative z-10 text-gray-500 text-[10px] mt-1">Uses AllOrigins CORS proxy. Respect source site terms of service.</p>
                </div>
            </div>
        </div>
    );
};

// --- Default Export for the Page ---
export default function Home() {
    return (
        <main>
            <BooruTagExtractor />
        </main>
    );
}