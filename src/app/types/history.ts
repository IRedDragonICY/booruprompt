import type { TagCategory } from '../utils/extractionUtils';
import type { ImageMetadata } from '../utils/imageMetadata';

export interface HistoryEntry {
    id: string;
    url: string;
    tags: Partial<Record<TagCategory, string[]>>;
    imageUrl?: string;
    title?: string;
    siteName?: string;
    timestamp: number;
}

export interface ImageHistoryEntry {
    id: string;
    fileName: string;
    imageData: ImageMetadata;
    timestamp: number;
    previewUrl?: string;
}

export interface StoredHistoryItem {
    id: string;
    url: string;
    tags?: Partial<Record<TagCategory, string[]>>;
    imageUrl?: string;
    title?: string;
    siteName?: string;
    timestamp: number;
}

export interface StoredImageHistoryItem {
    id: string;
    fileName: string;
    imageData?: ImageMetadata;
    timestamp: number;
    previewUrl?: string;
}
