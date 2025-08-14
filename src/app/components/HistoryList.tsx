import React, { useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedIcon } from './AnimatedIcon';
import { PhotoIcon, ArrowUpOnSquareIcon, TrashIcon } from './icons/icons';
import type { TagCategory } from '../utils/extractionUtils';
import { API_ROUTE_URL } from '../utils/extractionUtils';

export interface HistoryEntry { id: string; url: string; tags: Partial<Record<TagCategory, string[]>>; imageUrl?: string; title?: string; siteName?: string; timestamp: number; }

interface HistoryItemProps { entry: HistoryEntry; onLoad: (entry: HistoryEntry) => void; onDelete: (id: string) => void; enableImagePreviews: boolean; }

const calculateTotalTags = (tags: Partial<Record<TagCategory, string[]>>): number => Object.values(tags || {}).reduce((sum, arr) => sum + (arr?.length ?? 0), 0);

export const HistoryItem: React.FC<HistoryItemProps> = ({ entry, onLoad, onDelete, enableImagePreviews }) => {
    const [showPlaceholder, setShowPlaceholder] = React.useState(!enableImagePreviews);
    const formattedDate = useMemo(() => new Date(entry.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }), [entry.timestamp]);
    const totalTags = useMemo(() => calculateTotalTags(entry.tags), [entry.tags]);
    const proxiedImageUrl = useMemo(() => entry.imageUrl && enableImagePreviews ? `${API_ROUTE_URL}?imageUrl=${encodeURIComponent(entry.imageUrl)}` : undefined, [entry.imageUrl, enableImagePreviews]);

    const handleError = useCallback(() => setShowPlaceholder(true), []);
    const handleLoadSuccess = useCallback(() => setShowPlaceholder(false), []);
    const handleLoadClick = useCallback((e: React.MouseEvent) => { e.stopPropagation(); onLoad(entry); }, [onLoad, entry]);
    const handleDeleteClick = useCallback((e: React.MouseEvent) => { e.stopPropagation(); onDelete(entry.id); }, [onDelete, entry.id]);

    return (
        <motion.div layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }} className="flex items-center space-x-3 rounded-lg bg-[rgb(var(--color-surface-alt-2-rgb))] p-3 transition-colors hover:bg-[rgb(var(--color-surface-border-rgb))]">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-[rgb(var(--color-surface-border-rgb))] flex items-center justify-center">
                {proxiedImageUrl && !showPlaceholder ? (<Image src={proxiedImageUrl} alt="preview" width={40} height={40} unoptimized className="h-full w-full object-cover" onError={handleError} onLoad={handleLoadSuccess}/>) : (<AnimatedIcon animation="gentle"><PhotoIcon className="h-5 w-5 text-[rgb(var(--color-on-surface-faint-rgb))]" /></AnimatedIcon>)}
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]" title={entry.title || entry.url}>{entry.title || new URL(entry.url).pathname.split('/').pop() || entry.url}</p>
                <p className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">{entry.siteName ? `${entry.siteName} • ` : ''}{formattedDate} • {totalTags} {totalTags === 1 ? 'tag' : 'tags'}</p>
            </div>
            <motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1, backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)' }} onClick={handleLoadClick} className="rounded-full p-1.5 text-[rgb(var(--color-on-surface-faint-rgb))] transition-colors hover:text-[rgb(var(--color-primary-rgb))]" aria-label="Load this history entry"><AnimatedIcon animation="gentle"><ArrowUpOnSquareIcon /></AnimatedIcon></motion.button>
            <motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1, backgroundColor: 'rgba(var(--color-error-rgb), 0.1)' }} onClick={handleDeleteClick} className="rounded-full p-1.5 text-[rgb(var(--color-on-surface-faint-rgb))] transition-colors hover:text-[rgb(var(--color-error-rgb))]" aria-label="Delete this history entry"><AnimatedIcon animation="gentle"><TrashIcon /></AnimatedIcon></motion.button>
        </motion.div>
    );
};

export default HistoryItem;


