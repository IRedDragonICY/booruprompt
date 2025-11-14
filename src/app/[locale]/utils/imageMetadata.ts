export interface ImageMetadata { positivePrompt?: string; negativePrompt?: string; parameters?: Record<string, string>; error?: string; }

export const MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024;


