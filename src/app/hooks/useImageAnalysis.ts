import { useState, useRef, useCallback, useEffect } from 'react';
import type { ImageMetadata } from '../utils/imageMetadata';
import { extractImageMetadata, createThumbnail, MAX_IMAGE_SIZE_BYTES } from '../utils/imageMetadata';
import type { CopyStatus } from '../types/common';
import type { ImageHistoryEntry } from '../types/history';
import type { Settings } from '../types/settings';
import { THUMBNAIL_SIZE } from '../constants';

interface UseImageAnalysisProps {
    settings: Settings;
    addImageHistoryEntry: (entry: ImageHistoryEntry) => void;
}

export function useImageAnalysis({ settings, addImageHistoryEntry }: UseImageAnalysisProps) {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [imageData, setImageData] = useState<ImageMetadata | null>(null);
    const [imageLoading, setImageLoading] = useState<boolean>(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const [isDraggingOverImage, setIsDraggingOverImage] = useState<boolean>(false);
    const [copyStatus, setCopyStatus] = useState<CopyStatus>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClearImage = useCallback(() => {
        setImageFile(null);
        setImageData(null);
        setImageError(null);
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
            setImagePreviewUrl(null);
        }
        setCopyStatus({});
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [imagePreviewUrl]);

    const processImageFile = useCallback(async (file: File | null | undefined) => {
        if (!file || imageLoading) return;
        handleClearImage();
        setImageLoading(true);
        setImageFile(file);

        const objectUrl = URL.createObjectURL(file);
        setImagePreviewUrl(objectUrl);

        let thumbnailDataUrl: string | null = null;
        try {
            thumbnailDataUrl = await createThumbnail(file, THUMBNAIL_SIZE);
        } catch (thumbErr) {
            console.warn("Thumbnail creation failed:", thumbErr);
        }

        try {
            const metadata = await extractImageMetadata(file);
            if (metadata.error) {
                setImageError(metadata.error);
                setImageData(null);
            } else {
                setImageData(metadata);
                setImageError(null);
                if (settings.saveHistory && (metadata.positivePrompt || metadata.negativePrompt || metadata.parameters || thumbnailDataUrl)) {
                    const newImageEntry: ImageHistoryEntry = {
                        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                        fileName: file.name,
                        imageData: metadata,
                        timestamp: Date.now(),
                        previewUrl: thumbnailDataUrl ?? undefined
                    };
                    addImageHistoryEntry(newImageEntry);
                }
            }
        } catch (err) {
            setImageError(`Processing failed: ${(err as Error).message}`);
            setImageData(null);
            console.error("Image error:", err);
        } finally {
            setImageLoading(false);
        }
    }, [imageLoading, handleClearImage, settings.saveHistory, addImageHistoryEntry]);

    useEffect(() => {
        return () => {
            if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
        };
    }, [imagePreviewUrl]);

    const handleImageDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOverImage(false);
        if (imageLoading) return;
        const file = e.dataTransfer.files?.[0];
        if (file?.type.startsWith('image/')) {
            void processImageFile(file);
        } else if (file) {
            setImageError('Drop valid image.');
        }
    }, [processImageFile, imageLoading]);

    const handleImageDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (imageLoading) return;
        const isImage = e.dataTransfer.items?.[0]?.kind === 'file' && e.dataTransfer.items[0].type.startsWith('image/');
        e.dataTransfer.dropEffect = isImage ? 'copy' : 'none';
        setIsDraggingOverImage(isImage);
    }, [imageLoading]);

    const handleImageDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDraggingOverImage(false);
        }
    }, []);

    const handleImageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && !file.type.startsWith('image/')) {
            setImageError('Select valid image.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }
        void processImageFile(file);
    }, [processImageFile]);

    const triggerFileInput = useCallback(() => fileInputRef.current?.click(), []);

    const handleMetadataCopy = useCallback(async (type: keyof CopyStatus, text: string | undefined | null) => {
        if (!text || copyStatus[type]) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopyStatus(p => ({ ...p, [type]: true }));
            setTimeout(() => setCopyStatus(p => ({ ...p, [type]: false })), 2000);
        } catch (err) {
            console.error(`Copy ${type} failed:`, err);
            setImageError(`Failed to copy ${type}.`);
            setTimeout(() => setImageError(null), 3000);
        }
    }, [copyStatus]);

    const handleLoadImageHistoryEntry = useCallback((entry: ImageHistoryEntry) => {
        if (imageLoading) return;
        handleClearImage();
        setImageData(entry.imageData);
        
        const extension = entry.fileName.split('.').pop()?.toLowerCase();
        const type = extension === 'png' ? 'image/png' : 
                     extension === 'jpg' || extension === 'jpeg' ? 'image/jpeg' : 
                     extension === 'webp' ? 'image/webp' : 'image/unknown';
                     
        setImageFile({ name: entry.fileName, type } as File);
        setImageError(null);
        setImagePreviewUrl(entry.previewUrl ?? null);
        setCopyStatus({});
    }, [imageLoading, handleClearImage]);

    return {
        imageFile,
        imagePreviewUrl,
        imageData,
        imageLoading,
        imageError,
        isDraggingOverImage,
        copyStatus,
        fileInputRef,
        handleClearImage,
        processImageFile,
        handleImageDrop,
        handleImageDragOver,
        handleImageDragLeave,
        handleImageInputChange,
        triggerFileInput,
        handleMetadataCopy,
        handleLoadImageHistoryEntry
    };
}
