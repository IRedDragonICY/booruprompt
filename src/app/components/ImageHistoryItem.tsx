import React, { useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AnimatedIcon } from './AnimatedIcon';
import { PhotoIcon, ArrowUpOnSquareIcon, TrashIcon } from './icons/icons';
import { TooltipWrapper } from './TooltipWrapper';
import type { ImageHistoryEntry } from '../types/history';
import { THUMBNAIL_SIZE } from '../constants';

interface ImageHistoryItemProps {
    entry: ImageHistoryEntry;
    onLoad: (entry: ImageHistoryEntry) => void;
    onDelete: (id: string) => void;
}

export const ImageHistoryItem = React.memo(({ entry, onLoad, onDelete }: ImageHistoryItemProps) => {
    const formattedDate = useMemo(() => new Date(entry.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }), [entry.timestamp]);
    const hasMetadata = useMemo(() => !!(entry.imageData.positivePrompt || entry.imageData.negativePrompt || entry.imageData.parameters), [entry.imageData]);
    const handleLoadClick = useCallback((e: React.MouseEvent) => { e.stopPropagation(); onLoad(entry); }, [onLoad, entry]);
    const handleDeleteClick = useCallback((e: React.MouseEvent) => { e.stopPropagation(); onDelete(entry.id); }, [onDelete, entry.id]);

    return (
        <motion.div layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }} className="flex items-center space-x-3 rounded-lg bg-[rgb(var(--color-surface-alt-2-rgb))] p-3 transition-colors hover:bg-[rgb(var(--color-surface-border-rgb))]">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-[rgb(var(--color-surface-border-rgb))] flex items-center justify-center">
                {entry.previewUrl ? (
                    <Image src={entry.previewUrl} alt="thumbnail" width={THUMBNAIL_SIZE} height={THUMBNAIL_SIZE} className="h-full w-full object-cover" />
                ) : (
                    <AnimatedIcon animation="gentle"><PhotoIcon className="h-5 w-5 text-[rgb(var(--color-on-surface-faint-rgb))]" /></AnimatedIcon>
                )}
            </div>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]" title={entry.fileName}>{entry.fileName}</p><p className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">{formattedDate} {hasMetadata ? '• Metadata found' : '• No metadata'}</p></div>
            <TooltipWrapper tipContent="Load Metadata"><motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1, backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)', transition: { duration: 0.1 } }} onClick={handleLoadClick} className="rounded-full p-1.5 text-[rgb(var(--color-on-surface-faint-rgb))] transition-colors hover:text-[rgb(var(--color-primary-rgb))]" aria-label="Load metadata"><AnimatedIcon animation="gentle"><ArrowUpOnSquareIcon /></AnimatedIcon></motion.button></TooltipWrapper>
            <TooltipWrapper tipContent="Delete Entry"><motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1, backgroundColor: 'rgba(var(--color-error-rgb), 0.1)', transition: { duration: 0.1 } }} onClick={handleDeleteClick} className="rounded-full p-1.5 text-[rgb(var(--color-on-surface-faint-rgb))] transition-colors hover:text-[rgb(var(--color-error-rgb))]" aria-label="Delete entry"><AnimatedIcon animation="gentle"><TrashIcon /></AnimatedIcon></motion.button></TooltipWrapper>
        </motion.div>
    );
});
ImageHistoryItem.displayName = 'ImageHistoryItem';
