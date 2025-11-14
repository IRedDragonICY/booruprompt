'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
    const [viewerOpen, setViewerOpen] = useState(false);
    const [scale, setScale] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const panRef = React.useRef<{ x: number; y: number } | null>(null);
    const isVideo = useMemo(() => originalUrl?.match(/\.(mp4|webm|ogg)$/i), [originalUrl]);
    const placeholderBaseClasses = "flex h-64 w-full items-center justify-center rounded-lg text-[rgb(var(--color-on-surface-faint-rgb))]";
    // Adjusted API_ROUTE_URL to be potentially passed or defined. If it's a constant from page.tsx, it should be imported or passed.
    // For now, assuming it might come from a shared utils or constants file.
    const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;
    const proxiedUrl = useMemo(() => {
        if (!originalUrl || !enableImagePreviews) return undefined;
        // In Tauri/static export we cannot hit Next API route; use original URL
        return isTauri ? originalUrl : `${API_ROUTE_URL}?imageUrl=${encodeURIComponent(originalUrl)}`;
    }, [originalUrl, enableImagePreviews, isTauri]);

    useEffect(() => { setImgLoading(enableImagePreviews && (!!originalUrl || isLoading)); setImgError(false); }, [originalUrl, isLoading, enableImagePreviews]);
    const handleLoad = useCallback(() => setImgLoading(false), []);
    const handleError = useCallback(() => { setImgLoading(false); setImgError(true); }, []);

    const openViewer = useCallback(() => {
        if (!proxiedUrl || isVideo) return;
        setViewerOpen(true);
        setScale(1);
        setTranslate({ x: 0, y: 0 });
    }, [proxiedUrl, isVideo]);

    const closeViewer = useCallback(() => setViewerOpen(false), []);
    const resetTransform = useCallback(() => { setScale(1); setTranslate({ x: 0, y: 0 }); }, []);

    const onWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
        e.preventDefault();
        const delta = -e.deltaY;
        const zoomIntensity = 0.0015;
        const newScale = Math.min(8, Math.max(0.5, scale * (1 + delta * zoomIntensity)));
        setScale(newScale);
    }, [scale]);

    const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        // Only start panning when dragging the image
        const isImg = (e.target as HTMLElement)?.tagName === 'IMG';
        if (!isImg) return;
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
        panRef.current = { x: e.clientX, y: e.clientY };
        setIsPanning(true);
    }, []);

    const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!isPanning || !panRef.current) return;
        const dx = e.clientX - panRef.current.x;
        const dy = e.clientY - panRef.current.y;
        panRef.current = { x: e.clientX, y: e.clientY };
        setTranslate(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    }, [isPanning]);

    const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
        setIsPanning(false);
        panRef.current = null;
    }, []);

    const onDoubleClick = useCallback(() => {
        setScale(prev => (prev > 1 ? 1 : 2));
        if (scale <= 1) setTranslate({ x: 0, y: 0 });
    }, [scale]);

    useEffect(() => {
        if (!viewerOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setViewerOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [viewerOpen]);

    if (!enableImagePreviews) return null;
    if (isLoading) return <div className={`${placeholderBaseClasses} animate-pulse bg-[rgb(var(--color-surface-alt-2-rgb))]`}>Loading preview...</div>;
    if (!originalUrl) return null;
    if (imgError) return <div className={`${placeholderBaseClasses} border border-[rgb(var(--color-error-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))]`}><div className="px-4 text-center text-sm text-[rgb(var(--color-error-rgb))]" ><p>Could not load preview.</p><p className="text-xs text-[rgb(var(--color-on-surface-faint-rgb))]" > (Server proxy error or invalid image)</p></div></div>;

    return (
        <motion.div className="relative h-40 w-full overflow-hidden rounded-lg bg-[rgb(var(--color-surface-alt-2-rgb))] shadow-xs group" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
            {imgLoading && !isVideo && <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-faint-rgb))]" > Loading...</div>}
            {isVideo ? (
                <video key={proxiedUrl} controls muted className={`h-full w-full object-contain transition-opacity duration-300 ${imgLoading ? 'opacity-0' : 'opacity-100'}`} onLoadedData={handleLoad} onError={handleError}>
                    <source src={proxiedUrl} /> Your browser does not support video.
                </video>
            ) : (
                <>
                    <button type="button" onClick={openViewer} className="absolute inset-0 z-10 cursor-zoom-in" aria-label="Open full-size preview" />
                    <Image key={proxiedUrl!} src={proxiedUrl!} alt={title || "Booru preview"} fill unoptimized onLoad={handleLoad} onError={handleError} className={`object-contain transition-opacity duration-300 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}/>
                </>
            )}
            {title && !imgLoading && !imgError && <motion.div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-3 text-sm text-white" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}><p className="truncate">{title}</p></motion.div>}

            {/* Fullscreen Viewer */}
            {viewerOpen && !isVideo && proxiedUrl && typeof window !== 'undefined' && createPortal(
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm">
                    {/* Click outside image to close */}
                    <button type="button" aria-label="Close" onClick={closeViewer} className="absolute inset-0 h-full w-full cursor-zoom-out" />
                    <div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center" onWheel={onWheel} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onDoubleClick={onDoubleClick} role="dialog" aria-modal="true">
                        <img src={proxiedUrl} alt={title || 'Full image'} draggable={false} style={{ transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`, transformOrigin: 'center center' }} className="pointer-events-auto max-h-[95vh] max-w-[95vw] cursor-grab active:cursor-grabbing rounded-md shadow-xl" />
                        <button type="button" onClick={closeViewer} className="pointer-events-auto absolute right-4 top-4 rounded-full bg-white/10 px-3 py-2 text-sm text-white backdrop-blur hover:bg-white/20">Close</button>
                        <div className="pointer-events-auto absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-2 text-white backdrop-blur">
                            <div className="flex items-center gap-3 text-sm">
                                <button type="button" onClick={() => setScale(s => Math.max(0.5, s - 0.25))} className="hover:text-white/80">-</button>
                                <span>{Math.round(scale * 100)}%</span>
                                <button type="button" onClick={() => setScale(s => Math.min(8, s + 0.25))} className="hover:text-white/80">+</button>
                                <button type="button" onClick={resetTransform} className="ml-2 text-white/90 hover:text-white">Reset</button>
                                <a href={originalUrl} target="_blank" rel="noreferrer" className="ml-2 text-white/90 underline hover:text-white">Open original</a>
                            </div>
                        </div>
                    </div>
                </motion.div>,
                document.body
            )}
        </motion.div>
    );
});
ImagePreview.displayName = 'ImagePreview'; 