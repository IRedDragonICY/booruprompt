'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { API_ROUTE_URL } from '../utils/extractionUtils';

interface ImagePreviewProps {
    originalUrl?: string;
    title?: string;
    isLoading: boolean;
    enableImagePreviews: boolean;
}

export const ImagePreview = React.memo(({ originalUrl, title, isLoading, enableImagePreviews }: ImagePreviewProps) => {
    const [imgLoading, setImgLoading] = useState(true);
    const [imgError, setImgError] = useState(false);
    const isVideo = useMemo(() => originalUrl?.match(/\.(mp4|webm|ogg)$/i), [originalUrl]);
    const placeholderBaseClasses = "flex h-64 w-full items-center justify-center md:rounded-lg text-[rgb(var(--color-on-surface-faint-rgb))]";
    // Adjusted API_ROUTE_URL to be potentially passed or defined. If it's a constant from page.tsx, it should be imported or passed.
    // For now, assuming it might come from a shared utils or constants file.
    const proxiedUrl = useMemo(() => originalUrl && enableImagePreviews ? `${API_ROUTE_URL}?imageUrl=${encodeURIComponent(originalUrl)}` : undefined, [originalUrl, enableImagePreviews]);

    useEffect(() => { setImgLoading(enableImagePreviews && (!!originalUrl || isLoading)); setImgError(false); }, [originalUrl, isLoading, enableImagePreviews]);
    const handleLoad = useCallback(() => setImgLoading(false), []);
    const handleError = useCallback(() => { setImgLoading(false); setImgError(true); }, []);

    if (!enableImagePreviews) return null;
    if (isLoading) return <div className={`${placeholderBaseClasses} animate-pulse bg-[rgb(var(--color-surface-alt-2-rgb))]`}>Loading preview...</div>;
    if (!originalUrl) return null;
    if (imgError) return <div className={`${placeholderBaseClasses} border border-[rgb(var(--color-error-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))]`}><div className="px-4 text-center text-sm text-[rgb(var(--color-error-rgb))]" ><p>Could not load preview.</p><p className="text-xs text-[rgb(var(--color-on-surface-faint-rgb))]" > (Server proxy error or invalid image)</p></div></div>;

    return (
        <motion.div className="relative h-64 w-full overflow-hidden md:rounded-lg bg-[rgb(var(--color-surface-alt-2-rgb))] shadow-xs group" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
            {imgLoading && !isVideo && <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-faint-rgb))]" > Loading...</div>}
            {isVideo ? (
                <video key={proxiedUrl} controls muted className={`h-full w-full object-contain transition-opacity duration-300 ${imgLoading ? 'opacity-0' : 'opacity-100'}`} onLoadedData={handleLoad} onError={handleError}>
                    <source src={proxiedUrl} /> Your browser does not support video.
                </video>
            ) : (
                <Image key={proxiedUrl!} src={proxiedUrl!} alt={title || "Booru preview"} fill unoptimized onLoad={handleLoad} onError={handleError} className={`object-contain transition-opacity duration-300 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}/>
            )}
            {title && !imgLoading && !imgError && <motion.div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-3 text-sm text-white" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}><p className="truncate">{title}</p></motion.div>}
        </motion.div>
    );
});
ImagePreview.displayName = 'ImagePreview'; 