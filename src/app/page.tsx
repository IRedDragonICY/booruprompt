'use client';

import { hexToRgb, getContrastColor, adjustRgb } from './utils/colors';
import { BOORU_SITES, DEFAULT_TAG_CATEGORIES, type TagCategoryOption, type ExtractionResult, type TagCategory } from './utils/extractionUtils';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { AnimatedIcon } from './components/AnimatedIcon';
import { SettingsModal } from './components/SettingsModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import {
  CogIcon, ClipboardIcon, CheckCircleIcon, ArrowPathIcon, XMarkIcon, ChevronDownIcon, HistoryIcon, TrashIcon, ArrowUpOnSquareIcon, PhotoIcon, MagnifyingGlassIcon, ArrowDownTrayIcon, TagIcon
} from './components/icons/icons';
import { TooltipWrapper } from './components/TooltipWrapper';

type ThemePreference = 'system' | 'light' | 'dark';
type ColorTheme = 'blue' | 'orange' | 'teal' | 'rose' | 'purple' | 'green' | 'custom';
type FetchMode = 'server' | 'clientProxy';
type ActiveView = 'extractor' | 'image';

interface ClientProxyOption { id: string; label: string; value: string; }
interface Settings { theme: ThemePreference; autoExtract: boolean; colorTheme: ColorTheme; customColorHex?: string; enableImagePreviews: boolean; fetchMode: FetchMode; clientProxyUrl: string; saveHistory: boolean; maxHistorySize: number; }
interface ImageMetadata { positivePrompt?: string; negativePrompt?: string; parameters?: Record<string, string>; error?: string; }
interface CopyStatus { positive?: boolean; negative?: boolean; parameters?: boolean; }
interface HistoryEntry { id: string; url: string; tags: Partial<Record<TagCategory, string[]>>; imageUrl?: string; title?: string; siteName?: string; timestamp: number; }
interface ImageHistoryEntry { id: string; fileName: string; imageData: ImageMetadata; timestamp: number; previewUrl?: string; }
interface StoredHistoryItem { id: string; url: string; tags?: Partial<Record<TagCategory, string[]>>; imageUrl?: string; title?: string; siteName?: string; timestamp: number; }
interface StoredImageHistoryItem { id: string; fileName: string; imageData?: ImageMetadata; timestamp: number; previewUrl?: string; }
interface ApiExtractionResponse extends Omit<ExtractionResult, 'tags'> { siteName: string; tags?: Partial<Record<TagCategory, string[]>>; error?: string; status?: number; html?: string; }
interface ImagePreviewProps { originalUrl?: string; title?: string; isLoading: boolean; enableImagePreviews: boolean; }
interface HistoryItemProps { entry: HistoryEntry; onLoad: (entry: HistoryEntry) => void; onDelete: (id: string) => void; enableImagePreviews: boolean; }
interface ImageHistoryItemProps { entry: ImageHistoryEntry; onLoad: (entry: ImageHistoryEntry) => void; onDelete: (id: string) => void; }

interface BaseHistoryPanelProps<T extends { id: string; timestamp: number }> {
    title: string;
    history: T[];
    renderItem: (entry: T) => React.ReactNode;
    filterPredicate: (entry: T, query: string) => boolean;
    searchPlaceholder: string;
    onClearHistory: () => void;
}

const THEME_STORAGE_KEY = 'booruExtractorThemePref';
const COLOR_THEME_STORAGE_KEY = 'booruExtractorColorThemePref';
const CUSTOM_COLOR_HEX_STORAGE_KEY = 'booruExtractorCustomColorHexPref';
const AUTO_EXTRACT_STORAGE_KEY = 'booruExtractorAutoExtractPref';
const IMAGE_PREVIEWS_STORAGE_KEY = 'booruExtractorImagePreviewsPref';
const FETCH_MODE_STORAGE_KEY = 'booruExtractorFetchModePref';
const CLIENT_PROXY_URL_STORAGE_KEY = 'booruExtractorClientProxyUrlPref';
const SAVE_HISTORY_STORAGE_KEY = 'booruExtractorSaveHistoryPref';
const MAX_HISTORY_SIZE_STORAGE_KEY = 'booruExtractorMaxHistorySizePref';
const HISTORY_STORAGE_KEY = 'booruExtractorHistory';
const IMAGE_HISTORY_STORAGE_KEY = 'booruExtractorImageHistory';
const DEFAULT_COLOR_THEME: ColorTheme = 'blue';
const DEFAULT_CUSTOM_COLOR_HEX = '#3B82F6';
const DEFAULT_FETCH_MODE: FetchMode = 'server';
const DEFAULT_MAX_HISTORY_SIZE = 30;
const FETCH_TIMEOUT_MS = 25000;
const API_ROUTE_URL = '/api/fetch-booru';
const MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024;
const THUMBNAIL_SIZE = 40;

const CLIENT_PROXY_OPTIONS: ClientProxyOption[] = [
    { id: 'allorigins', label: 'AllOrigins', value: 'https://api.allorigins.win/get?url=' },
    { id: 'thingproxy', label: 'ThingProxy', value: 'https://thingproxy.freeboard.io/fetch/' },
    { id: 'codetabs', label: 'CodeTabs', value: 'https://api.codetabs.com/v1/proxy?quest=' },
];
const DEFAULT_CLIENT_PROXY_URL = CLIENT_PROXY_OPTIONS[0].value;

const calculateTotalTags = (tags: Partial<Record<TagCategory, string[]>>): number => Object.values(tags || {}).reduce((sum, arr) => sum + (arr?.length ?? 0), 0);

const MotionCard = motion.div;

const CategoryToggle = React.memo(({ category, count, onToggle }: { category: TagCategoryOption; count: number; onToggle: () => void }) => (
    <MotionCard className="flex items-center justify-between rounded-2xl bg-[rgb(var(--color-surface-alt-2-rgb))] p-4 transition-all hover:shadow-md hover:shadow-[rgba(var(--color-primary-rgb),0.12)]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }} whileTap={{ scale: 0.98 }} whileHover={{ y: -2, backgroundColor: "rgba(var(--color-surface-alt-2-rgb), 0.8)" }}>
        <div className="flex items-center space-x-3 overflow-hidden">
            <motion.span className={`inline-flex h-4 w-4 shrink-0 rounded-full items-center justify-center`} style={{ backgroundColor: `rgb(var(${category.variable}))` }} animate={{ scale: category.enabled ? 1 : 0.8, boxShadow: category.enabled ? '0 2px 4px rgba(0,0,0,0.2)' : 'none' }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}/>
            <div className="flex flex-col min-w-0">
                <span className="truncate text-base font-medium text-[rgb(var(--color-on-surface-rgb))]" title={category.label}>{category.label}</span>
                {count > 0 && <span className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">{count} {count === 1 ? 'tag' : 'tags'}</span>}
            </div>
        </div>
        <div className="relative">
            <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" checked={category.enabled} onChange={onToggle} aria-labelledby={`category-label-${category.id}`}/>
                <div className={`relative h-8 w-14 rounded-full bg-[rgb(var(--color-surface-border-rgb))] transition-all duration-300 ease-out peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[rgb(var(--color-primary-rgb))] peer-focus:ring-offset-2 peer-focus:ring-offset-[rgb(var(--color-surface-alt-rgb))] peer-checked:bg-[rgb(var(${category.variable}))] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-7 after:w-7 after:rounded-full after:bg-white peer-checked:after:translate-x-6 after:shadow-sm after:transition-all after:duration-300 dark:after:bg-gray-200`}/>
            </label>
            <span id={`category-label-${category.id}`} className="sr-only">{category.label} Toggle</span>
            <motion.div className="absolute inset-0 rounded-full pointer-events-none opacity-0" animate={{ opacity: category.enabled ? 0.12 : 0, backgroundColor: `rgb(var(${category.variable}))` }} initial={false} transition={{ duration: 0.3 }}/>
        </div>
    </MotionCard>
));
CategoryToggle.displayName = 'CategoryToggle';

const StatusMessage = React.memo(({ type, children }: { type: 'info' | 'error' | 'warning', children: React.ReactNode }) => {
    const typeClasses = useMemo(() => ({
        info: 'border-[rgb(var(--color-info-rgb))] bg-[rgb(var(--color-info-bg-rgb))] text-[rgb(var(--color-info-content-rgb))]',
        error: 'border-[rgb(var(--color-error-rgb))] bg-[rgb(var(--color-error-bg-rgb))] text-[rgb(var(--color-error-rgb))]',
        warning: 'border-yellow-400 bg-yellow-50 text-yellow-700 dark:border-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300'
    }), []);
    return (
        <motion.div className={`rounded-md border-l-4 p-4 ${typeClasses[type]}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <p className={`text-sm font-medium`}>{children}</p>
        </motion.div>
    );
});
StatusMessage.displayName = 'StatusMessage';

const ImagePreview = React.memo(({ originalUrl, title, isLoading, enableImagePreviews }: ImagePreviewProps) => {
    const [imgLoading, setImgLoading] = useState(true);
    const [imgError, setImgError] = useState(false);
    const isVideo = useMemo(() => originalUrl?.match(/\.(mp4|webm|ogg)$/i), [originalUrl]);
    const placeholderBaseClasses = "flex h-64 w-full items-center justify-center rounded-lg text-[rgb(var(--color-on-surface-faint-rgb))]";
    const proxiedUrl = useMemo(() => originalUrl && enableImagePreviews ? `${API_ROUTE_URL}?imageUrl=${encodeURIComponent(originalUrl)}` : undefined, [originalUrl, enableImagePreviews]);

    useEffect(() => { setImgLoading(enableImagePreviews && (!!originalUrl || isLoading)); setImgError(false); }, [originalUrl, isLoading, enableImagePreviews]);
    const handleLoad = useCallback(() => setImgLoading(false), []);
    const handleError = useCallback(() => { setImgLoading(false); setImgError(true); }, []);

    if (!enableImagePreviews) return null;
    if (isLoading) return <div className={`${placeholderBaseClasses} animate-pulse bg-[rgb(var(--color-surface-alt-2-rgb))]`}>Loading preview...</div>;
    if (!originalUrl) return null;
    if (imgError) return <div className={`${placeholderBaseClasses} border border-[rgb(var(--color-error-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))]`}><div className="px-4 text-center text-sm text-[rgb(var(--color-error-rgb))]"><p>Could not load preview.</p><p className="text-xs text-[rgb(var(--color-on-surface-faint-rgb))]">(Server proxy error or invalid image)</p></div></div>;

    return (
        <motion.div className="relative h-64 w-full overflow-hidden rounded-lg bg-[rgb(var(--color-surface-alt-2-rgb))] shadow-xs group" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
            {imgLoading && !isVideo && <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-faint-rgb))]">Loading...</div>}
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

const HistoryItem = React.memo(({ entry, onLoad, onDelete, enableImagePreviews }: HistoryItemProps) => {
    const [showPlaceholder, setShowPlaceholder] = useState(!enableImagePreviews);
    const formattedDate = useMemo(() => new Date(entry.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }), [entry.timestamp]);
    const totalTags = useMemo(() => calculateTotalTags(entry.tags), [entry.tags]);
    const proxiedImageUrl = useMemo(() => entry.imageUrl && enableImagePreviews ? `${API_ROUTE_URL}?imageUrl=${encodeURIComponent(entry.imageUrl)}` : undefined, [entry.imageUrl, enableImagePreviews]);

    useEffect(() => { setShowPlaceholder(!proxiedImageUrl); }, [proxiedImageUrl]);
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
            <TooltipWrapper tipContent="Load Entry"><motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1, backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)', transition: { duration: 0.1 } }} onClick={handleLoadClick} className="rounded-full p-1.5 text-[rgb(var(--color-on-surface-faint-rgb))] transition-colors hover:text-[rgb(var(--color-primary-rgb))]" aria-label="Load this history entry"><AnimatedIcon animation="gentle"><ArrowUpOnSquareIcon /></AnimatedIcon></motion.button></TooltipWrapper>
            <TooltipWrapper tipContent="Delete Entry"><motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1, backgroundColor: 'rgba(var(--color-error-rgb), 0.1)', transition: { duration: 0.1 } }} onClick={handleDeleteClick} className="rounded-full p-1.5 text-[rgb(var(--color-on-surface-faint-rgb))] transition-colors hover:text-[rgb(var(--color-error-rgb))]" aria-label="Delete this history entry"><AnimatedIcon animation="gentle"><TrashIcon /></AnimatedIcon></motion.button></TooltipWrapper>
        </motion.div>
    );
});
HistoryItem.displayName = 'HistoryItem';

const ImageHistoryItem = React.memo(({ entry, onLoad, onDelete }: ImageHistoryItemProps) => {
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

const HistoryPanelBase = <T extends { id: string; timestamp: number }>({ title, history, renderItem, filterPredicate, searchPlaceholder, onClearHistory }: BaseHistoryPanelProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const handleClearClick = useCallback(() => { onClearHistory(); setShowClearConfirm(false); setSearchQuery(''); }, [onClearHistory]);
    const handleToggleOpen = useCallback(() => setIsOpen(prev => !prev), []);
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value), []);
    const handleClearSearch = useCallback(() => setSearchQuery(''), []);
    const handleShowConfirm = useCallback(() => setShowClearConfirm(true), []);
    const handleHideConfirm = useCallback(() => setShowClearConfirm(false), []);

    const filteredHistory = useMemo(() => {
        if (!searchQuery.trim()) return history;
        const lowerCaseQuery = searchQuery.toLowerCase();
        return history.filter(entry => filterPredicate(entry, lowerCaseQuery));
    }, [history, searchQuery, filterPredicate]);

    return (
        <div className="mt-6 overflow-hidden rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))]">
            <motion.button whileTap={{ backgroundColor: 'rgba(var(--color-surface-border-rgb), 0.5)' }} transition={{ duration: 0.05 }} onClick={handleToggleOpen} className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-[rgb(var(--color-surface-alt-2-rgb))] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[rgb(var(--color-primary-rgb))]" aria-expanded={isOpen} aria-controls={`${title.toLowerCase().replace(/\s+/g, '-')}-content`}>
                <div className="flex items-center space-x-2"><AnimatedIcon animation="gentle"><HistoryIcon /></AnimatedIcon><span className="font-semibold text-[rgb(var(--color-on-surface-rgb))]">{title}</span><span className="rounded-full bg-[rgb(var(--color-surface-border-rgb))] px-2 py-0.5 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">{history.length}</span></div>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDownIcon /></motion.span>
            </motion.button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div id={`${title.toLowerCase().replace(/\s+/g, '-')}-content`} key="content" initial="collapsed" animate="open" exit="collapsed" variants={{ open: { opacity: 1, height: "auto" }, collapsed: { opacity: 0, height: 0 } }} transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }} className="overflow-hidden">
                        <div className="border-t border-[rgb(var(--color-surface-border-rgb))] p-4">
                            <div className="relative">
                                <input type="text" placeholder={searchPlaceholder} value={searchQuery} onChange={handleSearchChange} className="w-full rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] py-2 pl-10 pr-10 text-sm text-[rgb(var(--color-on-surface-rgb))] placeholder:text-[rgb(var(--color-on-surface-faint-rgb))] transition focus:border-[rgb(var(--color-primary-rgb))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary-rgb))]" aria-label={`Search ${title}`}/>
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transform text-[rgb(var(--color-on-surface-faint-rgb))]"><MagnifyingGlassIcon/></span>
                                {searchQuery && (<TooltipWrapper tipContent="Clear Search"><motion.button whileTap={{ scale: 0.9 }} onClick={handleClearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full p-1 text-[rgb(var(--color-on-surface-faint-rgb))] transition-colors hover:bg-[rgb(var(--color-surface-border-rgb))] hover:text-[rgb(var(--color-on-surface-rgb))]" aria-label="Clear search" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}><XMarkIcon className="h-4 w-4"/></motion.button></TooltipWrapper>)}
                            </div>
                        </div>
                        <div className="max-h-80 space-y-2 overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]">
                            <AnimatePresence mode="popLayout">
                                {filteredHistory.map(entry => renderItem(entry))}
                            </AnimatePresence>
                            {filteredHistory.length === 0 && <p className="py-4 text-center text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">No entries match your search.</p>}
                        </div>
                        <div className="relative border-t border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] p-3 text-right">
                            <AnimatePresence>{showClearConfirm && (<motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute right-3 bottom-full z-10 mb-2 flex items-center gap-2 rounded-sm border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] p-2 shadow-lg"><p className="text-xs text-[rgb(var(--color-on-surface-rgb))]">Really clear?</p><motion.button whileTap={{ scale: 0.95 }} onClick={handleClearClick} className="rounded-sm bg-red-500 px-2 py-1 text-xs font-medium text-white transition hover:bg-red-600">Yes, Clear</motion.button><motion.button whileTap={{ scale: 0.95 }} onClick={handleHideConfirm} className="rounded-sm bg-[rgb(var(--color-surface-border-rgb))] px-2 py-1 text-xs font-medium text-[rgb(var(--color-on-surface-rgb))] transition hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</motion.button></motion.div>)}</AnimatePresence>
                            <TooltipWrapper tipContent="Clear All History"><motion.button whileTap={{ scale: 0.95 }} onClick={handleShowConfirm} className="inline-flex items-center space-x-1 rounded-md bg-[rgb(var(--color-error-bg-rgb))] px-2.5 py-1 text-xs font-medium text-[rgb(var(--color-error-rgb))] transition hover:bg-red-100 dark:hover:bg-red-900/50" aria-label={`Clear ${title}`}><AnimatedIcon animation="gentle"><TrashIcon /></AnimatedIcon><span>Clear History</span></motion.button></TooltipWrapper>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
HistoryPanelBase.displayName = 'HistoryPanelBase';

const ParameterItem = React.memo(({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between border-b border-[rgb(var(--color-surface-border-rgb))] py-2 text-sm last:border-b-0">
        <span className="font-medium text-[rgb(var(--color-on-surface-muted-rgb))] mr-2 shrink-0">{label}:</span>
        <span className="text-left sm:text-right text-[rgb(var(--color-on-surface-rgb))] break-words">{value}</span>
    </div>
));
ParameterItem.displayName = 'ParameterItem';

async function extractImageMetadata(file: File): Promise<ImageMetadata> {
    if (!file.type.startsWith('image/')) return { error: "Invalid file type." };
    if (file.type !== 'image/png') return { error: "Metadata extraction only supported for PNG files." };
    if (file.size > MAX_IMAGE_SIZE_BYTES) return { error: `File too large (max ${MAX_IMAGE_SIZE_BYTES / 1024 / 1024}MB).` };

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (!e.target?.result || !(e.target.result instanceof ArrayBuffer)) return resolve({ error: "Could not read file." });
            const buffer = e.target.result; const view = new DataView(buffer);
            const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];
            for (let i = 0; i < pngSignature.length; i++) if (view.getUint8(i) !== pngSignature[i]) return resolve({ error: "Invalid PNG signature." });

            let offset = 8; let parametersText: string | null = null;
            try {
                while (offset < view.byteLength) {
                    if (offset + 8 > view.byteLength) break;
                    const length = view.getUint32(offset, false); offset += 4;
                    const type = String.fromCharCode(view.getUint8(offset), view.getUint8(offset + 1), view.getUint8(offset + 2), view.getUint8(offset + 3)); offset += 4;
                    if (offset + length + 4 > view.byteLength) { parametersText = null; break; }
                    if (type === 'tEXt') { const chunkData = new Uint8Array(buffer, offset, length); const zeroIndex = chunkData.indexOf(0); if (zeroIndex > 0) { const keyword = new TextDecoder("iso-8859-1").decode(chunkData.slice(0, zeroIndex)); if (keyword === 'parameters') { parametersText = new TextDecoder("utf-8").decode(chunkData.slice(zeroIndex + 1)); break; } } }
                    else if (type === 'IEND') break;
                    offset += length + 4;
                }
            } catch (err) { return resolve({ error: `Error parsing PNG: ${(err as Error).message}` }); }
            if (!parametersText) return resolve({ error: "No 'parameters' metadata found." });

            try {
                const lines = parametersText.trim().split('\n'); let posLines: string[]; let negPrompt = ''; const params: Record<string, string> = {}; let paramStr = ''; let negIdx = -1;
                for (let i = 0; i < lines.length; i++) if (lines[i].trim().startsWith('Negative prompt:')) { negIdx = i; break; }
                if (negIdx !== -1) { posLines = lines.slice(0, negIdx).map(l => l.trim()).filter(Boolean); negPrompt = lines[negIdx].substring('Negative prompt:'.length).trim(); paramStr = lines.slice(negIdx + 1).map(l => l.trim()).filter(Boolean).join(' '); }
                else { const lastIdx = lines.length - 1; const lastLine = lastIdx >= 0 ? lines[lastIdx].trim() : ''; const keywords = ["Steps:", "Sampler:", "CFG scale:", "Seed:", "Size:", "Model hash:", "Model:", "Lora hashes:", "Version:"]; let looksLikeParams = false; if (lastLine.includes(':') && lastLine.includes(',')) looksLikeParams = keywords.some(k => lastLine.includes(k)); if (looksLikeParams) { paramStr = lastLine; posLines = lines.slice(0, lastIdx).map(l => l.trim()).filter(Boolean); } else posLines = lines.map(l => l.trim()).filter(Boolean); }
                const posPrompt = posLines.join('\n').trim();
                if (paramStr) { const pairs = paramStr.split(/,\s*(?=[a-zA-Z0-9\s\-_.'"]+:)/); for (const pair of pairs) { const sepIdx = pair.indexOf(':'); if (sepIdx > 0) { const key = pair.substring(0, sepIdx).trim(); const val = pair.substring(sepIdx + 1).trim(); if (key) params[key] = val; } } }
                const negParts = negPrompt.split(', '); let finalNegPrompt = negPrompt;
                if (negParts.length > 0 && Object.keys(params).length > 0) { let firstParamIdx = -1; for(let i=0; i<negParts.length; i++) { const match = negParts[i].match(/^([a-zA-Z0-9\s\-_.'"]+):\s*/); if (match && params.hasOwnProperty(match[1].trim())) { firstParamIdx = i; break; } } if (firstParamIdx > 0) finalNegPrompt = negParts.slice(0, firstParamIdx).join(', ').trim(); else if (firstParamIdx === 0) finalNegPrompt = ""; }
                if (!posPrompt && !finalNegPrompt && Object.keys(params).length === 0) return resolve({ error: "Could not parse metadata." });
                resolve({ positivePrompt: posPrompt || undefined, negativePrompt: finalNegPrompt || undefined, parameters: Object.keys(params).length > 0 ? params : undefined });
            } catch (err) { resolve({ error: `Error parsing parameters: ${(err as Error).message}` }); }
        };
        reader.onerror = () => resolve({ error: "Failed to read file." });
        reader.readAsArrayBuffer(file);
    });
}

const createThumbnail = (file: File, size: number): Promise<string | null> => {
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


const BooruTagExtractor = () => {
    const [url, setUrl] = useState('');
    const [allExtractedTags, setAllExtractedTags] = useState<Partial<Record<TagCategory, string[]>>>({});
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
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState<Settings>({ theme: 'system', autoExtract: true, colorTheme: DEFAULT_COLOR_THEME, customColorHex: DEFAULT_CUSTOM_COLOR_HEX, enableImagePreviews: true, fetchMode: DEFAULT_FETCH_MODE, clientProxyUrl: DEFAULT_CLIENT_PROXY_URL, saveHistory: false, maxHistorySize: DEFAULT_MAX_HISTORY_SIZE });
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [imageHistory, setImageHistory] = useState<ImageHistoryEntry[]>([]);
    const cardBodyRef = useRef<HTMLDivElement>(null);
    const imageCardBodyRef = useRef<HTMLDivElement>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [activeView, setActiveView] = useState<ActiveView>('extractor');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [imageData, setImageData] = useState<ImageMetadata | null>(null);
    const [imageLoading, setImageLoading] = useState<boolean>(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const [isDraggingOverImage, setIsDraggingOverImage] = useState<boolean>(false);
    const [copyStatus, setCopyStatus] = useState<CopyStatus>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadStoredItem = <T,>(key: string, defaultValue: T, validator?: (item: unknown) => boolean): T => {
        if (typeof window === 'undefined') return defaultValue;
        const item = localStorage.getItem(key); if (item === null) return defaultValue;
        try { const parsed = JSON.parse(item); return validator ? (validator(parsed) ? parsed : defaultValue) : parsed; } catch { return defaultValue; }
    };

    useEffect(() => {
        const isValidHistory = (i: unknown): i is StoredHistoryItem[] => Array.isArray(i) && i.every(it => typeof it === 'object' && it !== null && 'id' in it && 'url' in it && 'timestamp' in it);
        const isValidImageHistory = (i: unknown): i is StoredImageHistoryItem[] => Array.isArray(i) && i.every(it => typeof it === 'object' && it !== null && 'id' in it && 'fileName' in it && 'timestamp' in it);
        const isValidMaxHistorySize = (i: unknown): i is number => typeof i === 'number' && (i === -1 || (Number.isInteger(i) && i >= 0));

        setSettings({
            theme: loadStoredItem<ThemePreference>(THEME_STORAGE_KEY, 'system'),
            colorTheme: loadStoredItem<ColorTheme>(COLOR_THEME_STORAGE_KEY, DEFAULT_COLOR_THEME),
            customColorHex: loadStoredItem<string | undefined>(CUSTOM_COLOR_HEX_STORAGE_KEY, DEFAULT_CUSTOM_COLOR_HEX),
            autoExtract: loadStoredItem<boolean>(AUTO_EXTRACT_STORAGE_KEY, true),
            enableImagePreviews: loadStoredItem<boolean>(IMAGE_PREVIEWS_STORAGE_KEY, true),
            fetchMode: loadStoredItem<FetchMode>(FETCH_MODE_STORAGE_KEY, DEFAULT_FETCH_MODE),
            clientProxyUrl: loadStoredItem<string>(CLIENT_PROXY_URL_STORAGE_KEY, DEFAULT_CLIENT_PROXY_URL),
            saveHistory: loadStoredItem<boolean>(SAVE_HISTORY_STORAGE_KEY, false),
            maxHistorySize: loadStoredItem<number>(MAX_HISTORY_SIZE_STORAGE_KEY, DEFAULT_MAX_HISTORY_SIZE, isValidMaxHistorySize),
        });
        setHistory(loadStoredItem<HistoryEntry[]>(HISTORY_STORAGE_KEY, [], isValidHistory).map(i => ({ ...i, tags: i.tags ?? {} })).sort((a, b) => b.timestamp - a.timestamp));
        setImageHistory(loadStoredItem<ImageHistoryEntry[]>(IMAGE_HISTORY_STORAGE_KEY, [], isValidImageHistory).map(i => ({ ...i, imageData: i.imageData ?? {} })).sort((a, b) => b.timestamp - a.timestamp));
        if (typeof window !== 'undefined') setIsMobile(window.innerWidth < 768);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return; const root = window.document.documentElement; const isDark = settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches); root.classList.toggle('dark', isDark); root.dataset.colorTheme = settings.colorTheme;
        if (settings.colorTheme === 'custom' && settings.customColorHex) { const rgb = hexToRgb(settings.customColorHex); if (rgb) { const p = `${rgb.r} ${rgb.g} ${rgb.b}`; const f = isDark ? 1.2 : 0.85; const focus = adjustRgb(rgb.r, rgb.g, rgb.b, f); const content = getContrastColor(rgb.r, rgb.g, rgb.b); root.style.setProperty('--custom-primary-rgb', p); root.style.setProperty('--custom-primary-focus-rgb', focus); root.style.setProperty('--custom-primary-content-rgb', content); } else { ['--custom-primary-rgb', '--custom-primary-focus-rgb', '--custom-primary-content-rgb'].forEach(p => root.style.removeProperty(p)); } } else { ['--custom-primary-rgb', '--custom-primary-focus-rgb', '--custom-primary-content-rgb'].forEach(p => root.style.removeProperty(p)); }
        Object.entries(settings).forEach(([key, value]) => { const storageKeyMap: Record<string, string> = { theme: THEME_STORAGE_KEY, colorTheme: COLOR_THEME_STORAGE_KEY, customColorHex: CUSTOM_COLOR_HEX_STORAGE_KEY, autoExtract: AUTO_EXTRACT_STORAGE_KEY, enableImagePreviews: IMAGE_PREVIEWS_STORAGE_KEY, fetchMode: FETCH_MODE_STORAGE_KEY, clientProxyUrl: CLIENT_PROXY_URL_STORAGE_KEY, saveHistory: SAVE_HISTORY_STORAGE_KEY, maxHistorySize: MAX_HISTORY_SIZE_STORAGE_KEY }; const storageKey = storageKeyMap[key]; if (storageKey) { if (key === 'customColorHex' && !value) localStorage.removeItem(storageKey); else localStorage.setItem(storageKey, JSON.stringify(value)); } });
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)'); const handleChange = (e: MediaQueryListEvent) => { if (settings.theme === 'system') { const sysDark = e.matches; root.classList.toggle('dark', sysDark); if (settings.colorTheme === 'custom' && settings.customColorHex) { const rgb = hexToRgb(settings.customColorHex); if (rgb) { const f = sysDark ? 1.2 : 0.85; const focus = adjustRgb(rgb.r, rgb.g, rgb.b, f); const content = getContrastColor(rgb.r, rgb.g, rgb.b); root.style.setProperty('--custom-primary-focus-rgb', focus); root.style.setProperty('--custom-primary-content-rgb', content); } } } };
        if (settings.theme === 'system') mediaQuery.addEventListener('change', handleChange); return () => mediaQuery.removeEventListener('change', handleChange);
    }, [settings]);

    useEffect(() => { if (typeof window === 'undefined') return; const checkMobile = () => setIsMobile(window.innerWidth < 768); checkMobile(); window.addEventListener('resize', checkMobile); return () => window.removeEventListener('resize', checkMobile); }, []);
    useEffect(() => { const enabled = new Set(tagCategories.filter(c => c.enabled).map(c => c.id)); const filtered: string[] = []; DEFAULT_TAG_CATEGORIES.forEach(c => { if (enabled.has(c.id) && allExtractedTags[c.id]) filtered.push(...allExtractedTags[c.id]!.map(t => t.replace(/_/g, ' '))); }); setDisplayedTags(filtered.join(', ')); }, [allExtractedTags, tagCategories]);
    const saveHistoryToLocalStorage = useCallback((data: HistoryEntry[]) => { try { if (data.length > 0) localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(data)); else localStorage.removeItem(HISTORY_STORAGE_KEY); } catch (e) { console.error("Save tag history failed:", e); if (e instanceof Error && e.message.toLowerCase().includes('quota')) setError("History storage limit."); } }, []);
    const saveImageHistoryToLocalStorage = useCallback((data: ImageHistoryEntry[]) => { try { if (data.length > 0) localStorage.setItem(IMAGE_HISTORY_STORAGE_KEY, JSON.stringify(data)); else localStorage.removeItem(IMAGE_HISTORY_STORAGE_KEY); } catch (e) { console.error("Save image history failed:", e); if (e instanceof Error && e.message.toLowerCase().includes('quota')) { setImageError("Image history storage limit."); setTimeout(() => setImageError(null), 3000); } } }, []);
    const tagCounts = useMemo(() => Object.entries(allExtractedTags).reduce((acc, [cat, tags]) => { if (tags) acc[cat as TagCategory] = tags.length; return acc; }, {} as Record<TagCategory, number>), [allExtractedTags]);
    const totalExtractedTagCount = useMemo(() => calculateTotalTags(allExtractedTags), [allExtractedTags]);
    const extractTags = useCallback(async (targetUrl: string) => {
        const trimmedUrl = targetUrl.trim(); if (!trimmedUrl || loading || trimmedUrl === currentExtractionUrl.current) return; const site = BOORU_SITES.find(s => s.urlPattern.test(trimmedUrl)); if (!site) { setError('URL not supported.'); setAllExtractedTags({}); setImageUrl(undefined); setImageTitle(undefined); setActiveSite(null); currentExtractionUrl.current = null; return; }
        setLoading(true); setError(''); setAllExtractedTags({}); setImageUrl(undefined); setImageTitle(undefined); setDisplayedTags(''); setActiveSite(site.name); setCopySuccess(false); currentExtractionUrl.current = trimmedUrl; const controller = new AbortController(); const fetchTimeout = FETCH_TIMEOUT_MS + (settings.fetchMode === 'server' ? 2000 : 0); const timeoutId = setTimeout(() => controller.abort(), fetchTimeout); let proxyUsed = ''; let selectedProxy: ClientProxyOption | undefined;
        try {
            let result: ExtractionResult = { tags: {} }; let errorMsg: string | null = null; let siteName = site.name; let imgUrl: string | undefined = undefined; let imgTitle: string | undefined = undefined;
            if (settings.fetchMode === 'server') {
                proxyUsed = 'Server'; const response = await fetch(API_ROUTE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ targetUrl: trimmedUrl }), signal: controller.signal }); clearTimeout(timeoutId); const data: ApiExtractionResponse = await response.json(); const tags = data.tags || {}; const tagCount = calculateTotalTags(tags);
                if (!response.ok || data.error) { let apiError = data.error || `API Error: ${response.status}`; if (response.status === 504) apiError = 'Server timed out.'; else if (response.status === 502) apiError = `Server bad gateway. ${data.error || ''}`.trim(); else if (response.status === 400) apiError = `Invalid request: ${data.error || ''}`.trim(); else if (response.status === 422) apiError = `${data.error || 'Extraction failed.'}`; else if (response.status === 500) apiError = `Internal Server Error: ${data.error || ''}`.trim(); if (!(data.error?.toLowerCase().includes('warning') && tagCount > 0)) { errorMsg = apiError; siteName = ''; } else { result = { tags, imageUrl: data.imageUrl, title: data.title }; errorMsg = apiError; siteName = data.siteName; imgUrl = data.imageUrl; imgTitle = data.title; }
                } else { result = { tags, imageUrl: data.imageUrl, title: data.title }; siteName = data.siteName; imgUrl = data.imageUrl; imgTitle = data.title; if (data.error?.toLowerCase().includes('warning')) errorMsg = data.error; else if (tagCount === 0 && data.imageUrl) errorMsg = `Warning: Image found, no tags extracted.`; }
            } else {
                selectedProxy = CLIENT_PROXY_OPTIONS.find(p => p.value === settings.clientProxyUrl) || CLIENT_PROXY_OPTIONS[0]; proxyUsed = `Client (${selectedProxy.label})`; const proxyUrl = `${selectedProxy.value}${encodeURIComponent(trimmedUrl)}`; let html = ''; let clientErr = '';
                try { const resp = await fetch(proxyUrl, { signal: controller.signal }); clearTimeout(timeoutId); if (!resp.ok) clientErr = `Proxy (${selectedProxy.label}) failed: ${resp.status}.`; else { html = await resp.text(); if (!html) clientErr = `Proxy (${selectedProxy.label}) empty content.`; else if (selectedProxy.id === 'allorigins') { try { const json = JSON.parse(html); if (json?.contents) html = json.contents; else { clientErr = `Proxy JSON missing 'contents'.`; html = ''; } } catch { if (html.toLowerCase().match(/error|cloudflare/) || html.length < 100) clientErr = `Proxy non-JSON error/block.`; } } if (!html && !clientErr) clientErr = `Proxy empty HTML.`; } } catch (err) { clearTimeout(timeoutId); if ((err as Error).name === 'AbortError') clientErr = `Request via ${proxyUsed} timed out.`; else if (err instanceof TypeError && err.message.toLowerCase().includes('failed to fetch')) clientErr = `Failed to connect via ${proxyUsed}.`; else clientErr = `Client fetch error: ${(err as Error).message}`; }
                if (clientErr) { errorMsg = clientErr; siteName = ''; } else if (!html) { errorMsg = 'Failed HTML fetch via Client Proxy.'; siteName = ''; }
                else { try { const parser = new DOMParser(); const doc = parser.parseFromString(html, 'text/html'); try { doc.querySelector('base')?.remove(); const head = doc.head || doc.documentElement.appendChild(doc.createElement('head')); const base = doc.createElement('base'); base.href = new URL('./', trimmedUrl).href; head.insertBefore(base, head.firstChild); } catch (e) { console.warn(`Base tag set failed:`, e); } const detectPageError = (d: Document) => { let detected = false; let msg = "Check URL/site."; if (d.title.toLowerCase().match(/error|access denied|cloudflare/)) { detected = true; msg = `Site error in title: ${d.title.substring(0, 100)}`; } const errEl = d.querySelector('.error,#error-page,.dtext-error,[class*="error"],[id*="error"],#challenge-running'); if (errEl?.textContent?.trim()) { detected = true; const errTxt = errEl.textContent.trim().toLowerCase(); if (errTxt.includes("rate limit")) msg = "Rate limit exceeded."; else if (errTxt.includes("login") || errTxt.includes("authenticate")) msg = "Login required."; else if (errTxt.includes("not found")) msg = "Post not found (404)."; else if (errTxt.includes("cloudflare")) msg = "Blocked by Cloudflare."; else msg = `Site Error: ${errEl.textContent.trim().substring(0, 150)}`; } if (!detected && d.body) { const bodyTxt = d.body.textContent?.toLowerCase() || ''; if (bodyTxt.includes('you must be logged in')) { detected = true; msg = `Login required.`; } else if (bodyTxt.includes('access denied')) { detected = true; msg = `Access denied.`; } else if (bodyTxt.includes('cloudflare')) { detected = true; msg = `Blocked by Cloudflare.`; } else if (bodyTxt.includes('enable javascript')) { detected = true; msg = `Site requires JS/Cookies.`; } } return { detected, msg }; }; const { detected: pageErr, msg: specificErr } = detectPageError(doc); if (pageErr) { errorMsg = `Extraction stopped: ${specificErr}`; siteName = ''; } else { result = site.extractTags(doc); imgUrl = result.imageUrl; imgTitle = result.title; const tagCount = calculateTotalTags(result.tags || {}); if (tagCount === 0) errorMsg = result.imageUrl ? 'Warning: Image found, no tags (Client).' : 'Warning: No tags/image (Client).'; } } catch (parseErr) { errorMsg = `Parse/extract failed via ${proxyUsed}: ${(parseErr as Error).message}`; siteName = ''; } }
            }
            if (errorMsg) { setError(errorMsg); console.error("Error:", errorMsg, "Mode:", settings.fetchMode, "Proxy:", proxyUsed); setActiveSite(siteName || null); if (!(errorMsg.toLowerCase().includes('warning') && calculateTotalTags(result.tags) > 0)) { setAllExtractedTags({}); setImageUrl(undefined); setImageTitle(undefined); currentExtractionUrl.current = null; } else { setAllExtractedTags(result.tags || {}); setImageUrl(imgUrl); setImageTitle(imgTitle); console.warn("Warning with data:", errorMsg, "URL:", trimmedUrl, "Site:", siteName); } }
            else { setAllExtractedTags(result.tags || {}); setImageUrl(imgUrl); setImageTitle(imgTitle); setActiveSite(siteName); setError(''); const tagCount = calculateTotalTags(result.tags || {}); if (tagCount > 0) console.log(`Extracted ${tagCount} tags from ${siteName} via ${proxyUsed}.`); if (settings.saveHistory) { const newEntry: HistoryEntry = { id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, url: trimmedUrl, tags: result.tags || {}, imageUrl: imgUrl, title: imgTitle, siteName, timestamp: Date.now() }; setHistory(prev => { const updated = [newEntry, ...prev.filter(h => h.url !== trimmedUrl)]; const maxSize = settings.maxHistorySize; const finalHistory = maxSize === -1 ? updated : updated.slice(0, maxSize); saveHistoryToLocalStorage(finalHistory); return finalHistory; }); } }
        } catch (err) { clearTimeout(timeoutId); const msg = `Unexpected error: ${(err as Error).message}`; setError(msg); console.error(msg, err); setAllExtractedTags({}); setActiveSite(null); setImageUrl(undefined); setImageTitle(undefined); currentExtractionUrl.current = null; }
        finally { setLoading(false); }
    }, [loading, settings.fetchMode, settings.clientProxyUrl, settings.saveHistory, settings.maxHistorySize, saveHistoryToLocalStorage]);

    const handleReset = useCallback(() => { setUrl(''); setAllExtractedTags({}); setImageUrl(undefined); setImageTitle(undefined); setDisplayedTags(''); setError(''); setActiveSite(null); setTagCategories(DEFAULT_TAG_CATEGORIES); setCopySuccess(false); setLoading(false); currentExtractionUrl.current = null; if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); cardBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }, []);
    useEffect(() => {
        if (activeView !== 'extractor' || !settings.autoExtract) { if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); return; }
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); const trimmedUrl = url.trim();
        if (trimmedUrl && trimmedUrl.includes('.') && trimmedUrl.length > 10 && trimmedUrl.startsWith('http')) { const isSupported = BOORU_SITES.some(s => s.urlPattern.test(trimmedUrl)); if (isSupported) { if (trimmedUrl !== currentExtractionUrl.current) { debounceTimeoutRef.current = setTimeout(() => { const currentInputVal = (document.getElementById('url') as HTMLInputElement | null)?.value.trim(); if (currentInputVal !== undefined && trimmedUrl === currentInputVal && trimmedUrl !== currentExtractionUrl.current) void extractTags(trimmedUrl); }, 750); } } else if (trimmedUrl !== currentExtractionUrl.current) setError('URL not supported.'); }
        else if (!trimmedUrl && currentExtractionUrl.current) handleReset(); else if (trimmedUrl && !trimmedUrl.startsWith('http')) { if (trimmedUrl !== currentExtractionUrl.current) setError('URL must start with http:// or https://'); }
        else if (trimmedUrl && trimmedUrl !== currentExtractionUrl.current) setError(''); return () => { if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); };
    }, [url, extractTags, settings.autoExtract, handleReset, activeView]);

    const handleSettingsChange = useCallback((newSettings: Partial<Settings>) => setSettings(prev => ({ ...prev, ...newSettings })), []);
    const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value), []);
    const handleManualExtract = useCallback(() => { if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); currentExtractionUrl.current = null; void extractTags(url.trim()); }, [extractTags, url]);
    const toggleTagCategory = useCallback((id: TagCategory) => setTagCategories(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c)), []);
    const toggleAllCategories = useCallback((enabled: boolean) => setTagCategories(prev => prev.map(c => ({ ...c, enabled }))), []);
    const handleCopy = useCallback(async () => { if (!displayedTags) return; try { await navigator.clipboard.writeText(displayedTags); setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000); } catch (err) { console.error('Copy failed:', err); setError("Failed to copy."); } }, [displayedTags]);
    const areAllCategoriesEnabled = useMemo(() => tagCategories.every(c => c.enabled), [tagCategories]);
    const areAllCategoriesDisabled = useMemo(() => !tagCategories.some(c => c.enabled), [tagCategories]);
    const handleLoadHistoryEntry = useCallback((entry: HistoryEntry) => { if (loading) return; setActiveView('extractor'); handleReset(); setUrl(entry.url); setAllExtractedTags(entry.tags ?? {}); setImageUrl(entry.imageUrl); setImageTitle(entry.title); setActiveSite(entry.siteName || null); currentExtractionUrl.current = entry.url; setError(''); cardBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }, [loading, handleReset]);
    const handleDeleteHistoryEntry = useCallback((id: string) => { setHistory(prev => { const updated = prev.filter(i => i.id !== id); saveHistoryToLocalStorage(updated); return updated; }); }, [saveHistoryToLocalStorage]);
    const handleClearHistory = useCallback(() => { setHistory([]); saveHistoryToLocalStorage([]); }, [saveHistoryToLocalStorage]);
    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); if (activeView !== 'extractor') return; const types = e.dataTransfer.types; e.dataTransfer.dropEffect = (types.includes('text/uri-list') || types.includes('text/plain')) ? 'copy' : 'none'; setIsDraggingOver(e.dataTransfer.dropEffect === 'copy'); }, [activeView]);
    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); if (activeView !== 'extractor') return; setIsDraggingOver(false); }, [activeView]);
    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); if (activeView !== 'extractor') return; setIsDraggingOver(false); const dropped = (e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain')).trim(); if (dropped?.startsWith('http')) { handleReset(); currentExtractionUrl.current = null; setUrl(dropped); setError(''); if (settings.autoExtract) void extractTags(dropped); } else setError("Invalid URL dropped."); }, [handleReset, settings.autoExtract, extractTags, activeView]);
    const handleOpenSettings = useCallback(() => setShowSettings(true), []);
    const handleCloseSettings = useCallback(() => setShowSettings(false), []);
    const shouldShowPreviewSection = useMemo(() => activeView === 'extractor' && settings.enableImagePreviews && (!!imageUrl || (loading && !imageUrl && !!currentExtractionUrl.current && !error)), [activeView, settings.enableImagePreviews, imageUrl, loading, currentExtractionUrl, error]);
    const hasResults = useMemo(() => totalExtractedTagCount > 0 || !!imageUrl, [totalExtractedTagCount, imageUrl]);
    const getSelectedProxyLabel = useCallback(() => CLIENT_PROXY_OPTIONS.find(p => p.value === settings.clientProxyUrl)?.label || 'Unknown', [settings.clientProxyUrl]);
    const sidebarButtonClass = (view: ActiveView) => `flex items-center justify-center rounded-lg p-3 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary-rgb))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))] ${activeView === view ? 'bg-[rgba(var(--color-primary-rgb),0.15)] text-[rgb(var(--color-primary-rgb))]' : 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))] hover:text-[rgb(var(--color-on-surface-rgb))]'}`;
    const settingsButtonClass = `flex items-center justify-center rounded-lg p-3 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary-rgb))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-muted-rgb))] hover:text-[rgb(var(--color-primary-rgb))]`;
    const handleClearImage = useCallback(() => { setImageFile(null); setImageData(null); setImageError(null); if (imagePreviewUrl) { URL.revokeObjectURL(imagePreviewUrl); setImagePreviewUrl(null); } setCopyStatus({}); if (fileInputRef.current) fileInputRef.current.value = ''; imageCardBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }, [imagePreviewUrl]);
    const processImageFile = useCallback(async (file: File | null | undefined) => {
        if (!file || imageLoading) return; handleClearImage(); setImageLoading(true); setImageFile(file);
        const objectUrl = URL.createObjectURL(file); setImagePreviewUrl(objectUrl);
        let thumbnailDataUrl: string | null = null;
        try { thumbnailDataUrl = await createThumbnail(file, THUMBNAIL_SIZE); } catch (thumbErr) { console.warn("Thumbnail creation failed:", thumbErr); }
        try {
            const metadata = await extractImageMetadata(file);
            if (metadata.error) { setImageError(metadata.error); setImageData(null); }
            else {
                setImageData(metadata); setImageError(null);
                if (settings.saveHistory && (metadata.positivePrompt || metadata.negativePrompt || metadata.parameters || thumbnailDataUrl)) {
                     const newImageEntry: ImageHistoryEntry = { id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, fileName: file.name, imageData: metadata, timestamp: Date.now(), previewUrl: thumbnailDataUrl ?? undefined };
                     setImageHistory(prev => { const updated = [newImageEntry, ...prev.filter(h => h.fileName !== file.name || h.timestamp !== newImageEntry.timestamp)]; const maxSize = settings.maxHistorySize; const finalHistory = maxSize === -1 ? updated : updated.slice(0, maxSize); saveImageHistoryToLocalStorage(finalHistory); return finalHistory; });
                 }
            }
        } catch (err) { setImageError(`Processing failed: ${(err as Error).message}`); setImageData(null); console.error("Image error:", err); }
        finally { setImageLoading(false); imageCardBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }
    }, [imageLoading, handleClearImage, settings.saveHistory, settings.maxHistorySize, saveImageHistoryToLocalStorage]);
    useEffect(() => () => { if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl); }, [imagePreviewUrl]);
    const handleImageDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOverImage(false); if (imageLoading) return; const file = e.dataTransfer.files?.[0]; if (file?.type.startsWith('image/')) { if (file.type === 'image/png') void processImageFile(file); else { setImageError('Drop PNG only.'); const url = URL.createObjectURL(file); setImagePreviewUrl(url); setImageFile(file); setImageData(null); setImageLoading(false); } } else if (file) setImageError('Drop valid image (PNG).'); }, [processImageFile, imageLoading]);
    const handleImageDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); if (imageLoading) return; const isPng = e.dataTransfer.items?.[0]?.kind === 'file' && e.dataTransfer.items[0].type === 'image/png'; e.dataTransfer.dropEffect = isPng ? 'copy' : 'none'; setIsDraggingOverImage(isPng); }, [imageLoading]);
    const handleImageDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDraggingOverImage(false); }, []);
    const handleImageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file?.type !== 'image/png' && file?.type.startsWith('image/')) { setImageError('Select PNG only.'); const url = URL.createObjectURL(file); setImagePreviewUrl(url); setImageFile(file); setImageData(null); setImageLoading(false); if (fileInputRef.current) fileInputRef.current.value = ''; return; } void processImageFile(file); }, [processImageFile]);
    const triggerFileInput = useCallback(() => fileInputRef.current?.click(), []);
    const handleMetadataCopy = useCallback(async (type: keyof CopyStatus, text: string | undefined | null) => { if (!text || copyStatus[type]) return; try { await navigator.clipboard.writeText(text); setCopyStatus(p => ({ ...p, [type]: true })); setTimeout(() => setCopyStatus(p => ({ ...p, [type]: false })), 2000); } catch (err) { console.error(`Copy ${type} failed:`, err); setImageError(`Failed to copy ${type}.`); setTimeout(() => setImageError(null), 3000); } }, [copyStatus]);
    const formatParametersForCopy = useCallback((p?: Record<string, string>): string => !p ? '' : Object.entries(p).map(([k, v]) => `${k}: ${v}`).join('\n'), []);
    const handleLoadImageHistoryEntry = useCallback((entry: ImageHistoryEntry) => { if (imageLoading) return; handleClearImage(); setImageData(entry.imageData); setImageFile({ name: entry.fileName, type: 'image/png' } as File); setImageError(null); setImagePreviewUrl(entry.previewUrl ?? null);
        setCopyStatus({}); imageCardBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }, [imageLoading, handleClearImage]);
    const handleDeleteImageHistoryEntry = useCallback((id: string) => { setImageHistory(prev => { const updated = prev.filter(i => i.id !== id); saveImageHistoryToLocalStorage(updated); return updated; }); }, [saveImageHistoryToLocalStorage]);
    const handleClearImageHistory = useCallback(() => { setImageHistory([]); saveImageHistoryToLocalStorage([]); }, [saveImageHistoryToLocalStorage]);

    const extractionFilterPredicate = useCallback((entry: HistoryEntry, query: string): boolean =>
        entry.title?.toLowerCase().includes(query) ||
        entry.url.toLowerCase().includes(query) ||
        entry.siteName?.toLowerCase().includes(query) ||
        (entry.tags && Object.values(entry.tags).flat().some((tag: string) => tag.toLowerCase().includes(query)))
    , []);

    const imageFilterPredicate = useCallback((entry: ImageHistoryEntry, query: string): boolean =>
        entry.fileName.toLowerCase().includes(query) ||
        !!entry.imageData.positivePrompt?.toLowerCase().includes(query) ||
        !!entry.imageData.negativePrompt?.toLowerCase().includes(query) ||
        !!(entry.imageData.parameters && Object.entries(entry.imageData.parameters).some(([k, v]: [string, string]) => k.toLowerCase().includes(query) || v.toLowerCase().includes(query)))
    , []);

    const renderHistoryItem = useCallback((entry: HistoryEntry) => (
        <HistoryItem key={entry.id} entry={entry} onLoad={handleLoadHistoryEntry} onDelete={handleDeleteHistoryEntry} enableImagePreviews={settings.enableImagePreviews} />
    ), [handleLoadHistoryEntry, handleDeleteHistoryEntry, settings.enableImagePreviews]);

    const renderImageHistoryItem = useCallback((entry: ImageHistoryEntry) => (
        <ImageHistoryItem key={entry.id} entry={entry} onLoad={handleLoadImageHistoryEntry} onDelete={handleDeleteImageHistoryEntry} />
    ), [handleLoadImageHistoryEntry, handleDeleteImageHistoryEntry]);

    const historySizeDisplay = useMemo(() => {
        if (settings.maxHistorySize === -1) return 'Unlimited';
        return `${settings.maxHistorySize} Entries`;
    }, [settings.maxHistorySize]);

    return (
        <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 bg-[rgb(var(--color-surface-rgb))] text-[rgb(var(--color-on-surface-rgb))] transition-colors duration-300">
            <div className="flex items-start">
                <div className="flex-shrink-0 mr-4 z-20 pt-[1px]">
                    <div className="flex flex-col space-y-2 rounded-xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] p-2 shadow-lg">
                         <TooltipWrapper tipContent="Tag Extractor"><motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1, backgroundColor: activeView !== 'extractor' ? 'rgba(var(--color-primary-rgb), 0.1)' : undefined }} transition={{ type: 'spring', stiffness: 300, damping: 15 }} onClick={() => setActiveView('extractor')} className={sidebarButtonClass('extractor')} aria-label="Tag Extractor" aria-current={activeView === 'extractor' ? 'page' : undefined}><TagIcon/></motion.button></TooltipWrapper>
                         <TooltipWrapper tipContent="Image Metadata"><motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1, backgroundColor: activeView !== 'image' ? 'rgba(var(--color-primary-rgb), 0.1)' : undefined }} transition={{ type: 'spring', stiffness: 300, damping: 15 }} onClick={() => setActiveView('image')} className={sidebarButtonClass('image')} aria-label="Image Metadata" aria-current={activeView === 'image' ? 'page' : undefined}><PhotoIcon className="h-6 w-6"/></motion.button></TooltipWrapper>
                         <div className="my-1 h-[1px] bg-[rgb(var(--color-surface-border-rgb))]" />
                         <TooltipWrapper tipContent="Settings"><motion.button whileTap={{ scale: 0.9 }} whileHover={{ rotate: 15, scale: 1.1, backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)' }} transition={{ type: 'spring', stiffness: 300, damping: 15 }} onClick={handleOpenSettings} className={settingsButtonClass} aria-label="Settings"><CogIcon/></motion.button></TooltipWrapper>
                     </div>
                 </div>
                 <div className="relative z-10 flex w-full max-w-xl flex-col overflow-hidden rounded-xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] shadow-lg max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)]" onDragOver={activeView === 'extractor' ? handleDragOver : handleImageDragOver} onDragLeave={activeView === 'extractor' ? handleDragLeave : handleImageDragLeave} onDrop={activeView === 'extractor' ? handleDrop : handleImageDrop}>
                    <AnimatePresence>
                        {isDraggingOver && activeView === 'extractor' && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-xl border-2 border-dashed border-[rgb(var(--color-primary-rgb))] bg-[rgb(var(--color-primary-rgb))]/20 backdrop-blur-xs"><div className="rounded-lg bg-[rgb(var(--color-primary-rgb))]/80 px-4 py-2 text-center text-[rgb(var(--color-primary-content-rgb))] shadow-sm"><ArrowDownTrayIcon className="mx-auto mb-1 h-8 w-8"/><p className="font-semibold">Drop URL</p></div></motion.div>)}
                        {isDraggingOverImage && activeView === 'image' && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center rounded-xl border-2 border-dashed border-[rgb(var(--color-primary-rgb))] bg-[rgb(var(--color-primary-rgb))]/20 backdrop-blur-xs"><div className="rounded-lg bg-[rgb(var(--color-primary-rgb))]/80 px-4 py-2 text-center text-[rgb(var(--color-primary-content-rgb))] shadow-sm"><ArrowDownTrayIcon className="mx-auto mb-1 h-8 w-8"/><p className="font-semibold">Drop PNG</p></div></motion.div>)}
                    </AnimatePresence>
                    <AnimatePresence mode="wait">
                        {activeView === 'extractor' ? (
                            <motion.div key="extractor-view" className="flex flex-col flex-1 overflow-hidden" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                                <div className="sticky top-0 z-10 shrink-0 border-b border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] px-6 py-5">
                                    <h1 className="text-xl font-semibold sm:text-2xl">Booru Tag Extractor</h1>
                                    <div className="mt-2"><span className="mr-2 text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">Supports:</span>{BOORU_SITES.map(s => <span key={s.name} className={`mb-1.5 mr-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors duration-150 ${ activeSite === s.name ? 'bg-[rgb(var(--color-primary-rgb))]/10 text-[rgb(var(--color-primary-rgb))] dark:bg-[rgb(var(--color-primary-rgb))]/20' : 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-muted-rgb))]'}`}>{s.name}</span>)}</div>
                                </div>
                                <div ref={cardBodyRef} className="flex-grow space-y-6 overflow-y-auto p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]">
                                    <div><label htmlFor="url" className="mb-1.5 block text-sm font-medium">Booru Post URL</label><input id="url" type="url" className="w-full appearance-none rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] px-4 py-2.5 placeholder:text-[rgb(var(--color-on-surface-faint-rgb))] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]" placeholder="Paste URL or Drag & Drop..." value={url} onChange={handleUrlChange} aria-label="Booru Post URL"/></div>
                                    <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                                        <motion.button whileTap={{ scale: 0.97 }} onClick={handleManualExtract} disabled={loading || !url.trim()} className="flex-1 inline-flex items-center justify-center rounded-lg bg-[rgb(var(--color-primary-rgb))] px-5 py-2.5 font-semibold text-[rgb(var(--color-primary-content-rgb))] shadow-xs transition hover:bg-[rgb(var(--color-primary-focus-rgb))] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary-rgb))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))]" aria-label="Extract Tags">{loading ? <LoadingSpinner /> : 'Extract Manually'}</motion.button>
                                        <TooltipWrapper tipContent="Clear"><motion.button whileTap={{ scale: 0.97 }} onClick={handleReset} className="inline-flex items-center justify-center rounded-lg bg-[rgb(var(--color-surface-alt-2-rgb))] px-5 py-2.5 font-semibold transition hover:bg-[rgb(var(--color-surface-border-rgb))] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-on-surface-muted-rgb))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))]" aria-label="Reset"><motion.span whileTap={{ rotate: -90 }} whileHover={{ rotate: -15 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }} className="mr-2 inline-block"><ArrowPathIcon/></motion.span>Reset</motion.button></TooltipWrapper>
                                    </div>
                                    <AnimatePresence mode='wait'>
                                        {activeSite && !error && !loading && hasResults && <StatusMessage type="info">Result for: <span className="font-medium">{activeSite}</span></StatusMessage>}
                                        {error && (error.toLowerCase().includes('warning') ? <StatusMessage type="warning">{error}</StatusMessage> : <StatusMessage type="error">{error}</StatusMessage>)}
                                    </AnimatePresence>
                                    {shouldShowPreviewSection && <div className="space-y-2"><h3 className="text-sm font-medium text-[rgb(var(--color-on-surface-muted-rgb))]">Preview</h3><ImagePreview originalUrl={imageUrl} title={imageTitle} isLoading={loading && !imageUrl && !error} enableImagePreviews={settings.enableImagePreviews}/></div>}
                                    <AnimatePresence>
                                        {!loading && hasResults && (
                                            <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.4 }}>
                                                {totalExtractedTagCount > 0 && ( <>
                                                    <div className="rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] p-4">
                                                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-semibold">Filter Categories</h3><div className="flex shrink-0 space-x-2">{!areAllCategoriesEnabled && (<motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleAllCategories(true)} className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900" aria-label="All">All</motion.button>)}{!areAllCategoriesDisabled && (<motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleAllCategories(false)} className="rounded-md bg-[rgb(var(--color-surface-border-rgb))] px-2.5 py-1 text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-gray-300 dark:hover:bg-gray-500" aria-label="None">None</motion.button>)}</div></div>
                                                        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">{DEFAULT_TAG_CATEGORIES.map(catDef => { const catOpt = tagCategories.find(c => c.id === catDef.id) ?? catDef; const count = tagCounts[catOpt.id] || 0; if (count > 0 || DEFAULT_TAG_CATEGORIES.some(d => d.id === catOpt.id)) return <CategoryToggle key={catOpt.id} category={catOpt} count={count} onToggle={() => toggleTagCategory(catOpt.id)} />; return null; })}</div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div><label htmlFor="tags" className="mb-1.5 block text-sm font-medium">Filtered Tags ({displayedTags ? displayedTags.split(',').filter(t=>t.trim()).length : 0})</label><textarea id="tags" rows={isMobile ? 5 : 4} className="w-full appearance-none rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]" readOnly value={displayedTags || "No tags match."} aria-label="Filtered tags"/></div>
                                                        <motion.button whileTap={{ scale: 0.97 }} onClick={handleCopy} disabled={!displayedTags || copySuccess} className={`w-full inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-semibold shadow-xs transition-all duration-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:shadow-none focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))] ${copySuccess ? 'cursor-default bg-[rgb(var(--color-success-rgb))] text-[rgb(var(--color-success-content-rgb))] focus-visible:ring-[rgb(var(--color-success-rgb))] disabled:opacity-100' : 'bg-[rgb(var(--color-on-surface-rgb))] text-[rgb(var(--color-surface-rgb))] hover:opacity-90 focus-visible:ring-[rgb(var(--color-on-surface-muted-rgb))] disabled:cursor-not-allowed disabled:opacity-50 dark:text-[rgb(var(--color-surface-alt-rgb))]'}`} aria-label={copySuccess ? "Copied" : "Copy Tags"}>
                                                            <motion.div className="inline-flex items-center justify-center overflow-hidden w-5 h-5"><AnimatePresence mode="popLayout" initial={false}>{copySuccess ? (<motion.span key="check" initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} transition={{ duration: 0.2 }} className="flex items-center"><CheckCircleIcon/></motion.span>) : (<motion.span key="clip" initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} transition={{ duration: 0.2 }} className="flex items-center"><ClipboardIcon/></motion.span>)}</AnimatePresence></motion.div>
                                                            <span className="ml-2">{copySuccess ? 'Copied!' : 'Copy Tags'}</span>
                                                        </motion.button>
                                                    </div>
                                                </>)}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    {settings.saveHistory && history.length > 0 && (<HistoryPanelBase title="Extraction History" history={history} renderItem={renderHistoryItem} filterPredicate={extractionFilterPredicate} searchPlaceholder="Search title, url, tags..." onClearHistory={handleClearHistory} />)}
                                </div>
                                <div className="shrink-0 border-t border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] p-4 text-center text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
                                    <p>Made with <span className="animate-heartBeat mx-0.5 inline-block text-red-500 dark:text-red-400">❤️</span> by <a href="https://x.com/ireddragonicy" target="_blank" rel="noopener noreferrer" className="font-medium underline transition-colors hover:text-[rgb(var(--color-primary-rgb))]">IRedDragonICY</a></p>
                                    <p className="mt-1 text-[10px] text-[rgb(var(--color-on-surface-faint-rgb))]">{settings.fetchMode === 'server' ? 'Server Proxy.' : `Client Proxy (${getSelectedProxyLabel()}).`} History {settings.saveHistory ? `enabled (${historySizeDisplay})` : 'disabled'}.</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="image-view" className="flex flex-col flex-1 overflow-hidden" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                                <div className="sticky top-0 z-10 shrink-0 border-b border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] px-6 py-5">
                                    <div className="flex items-center justify-between"><h1 className="text-xl font-semibold sm:text-2xl">Image Metadata</h1>{imageFile && !imageLoading && (<TooltipWrapper tipContent="Clear"><motion.button onClick={handleClearImage} whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1, backgroundColor: 'rgba(var(--color-error-rgb), 0.1)' }} className="rounded-full p-1.5 text-[rgb(var(--color-on-surface-faint-rgb))] transition hover:text-[rgb(var(--color-error-rgb))]" aria-label="Clear"><XMarkIcon/></motion.button></TooltipWrapper>)}</div>
                                </div>
                                <div ref={imageCardBodyRef} className="flex-grow overflow-y-auto p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]">
                                    <AnimatePresence mode="wait">
                                        {imageLoading ? (<motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full min-h-[300px] flex-col items-center justify-center text-center"><LoadingSpinner/><p className="mt-4 text-[rgb(var(--color-on-surface-muted-rgb))]">Processing...</p></motion.div>)
                                        : !imageFile ? (<motion.div key="initial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full min-h-[300px] flex-col items-center justify-center">
                                            <div className={`flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-colors ${isDraggingOverImage ? 'border-[rgb(var(--color-primary-rgb))] bg-[rgba(var(--color-primary-rgb),0.05)]' : 'border-[rgb(var(--color-surface-border-rgb))] bg-transparent'}`}>
                                                 <AnimatedIcon animation="gentle"><ArrowUpOnSquareIcon/></AnimatedIcon><p className="mb-2 font-semibold">Drag & Drop PNG Here</p><p className="mb-4 text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">or click to upload</p>
                                                 <input type="file" ref={fileInputRef} onChange={handleImageInputChange} accept="image/png" className="sr-only" /><motion.button whileTap={{ scale: 0.97 }} onClick={triggerFileInput} className="inline-flex items-center justify-center rounded-lg bg-[rgb(var(--color-primary-rgb))] px-5 py-2.5 text-sm font-semibold text-[rgb(var(--color-primary-content-rgb))] shadow-xs transition hover:bg-[rgb(var(--color-primary-focus-rgb))] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary-rgb))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))]">Select PNG</motion.button>
                                             </div>
                                             <AnimatePresence>{imageError && <div className="mt-4 w-full"><StatusMessage type="error">{imageError}</StatusMessage></div>}</AnimatePresence>
                                             {settings.saveHistory && imageHistory.length > 0 && (<HistoryPanelBase title="Image History" history={imageHistory} renderItem={renderImageHistoryItem} filterPredicate={imageFilterPredicate} searchPlaceholder="Search filename, prompts, params..." onClearHistory={handleClearImageHistory}/>)}
                                        </motion.div>)
                                        : (<motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                                            <AnimatePresence>{imageError && <StatusMessage type={imageError.toLowerCase().includes("only supported for png") ? 'warning' : 'error'}>{imageError}</StatusMessage>}</AnimatePresence>
                                            {imagePreviewUrl && (<MotionCard className="overflow-hidden rounded-xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))]"><div className="relative mx-auto max-h-72 w-full bg-[rgb(var(--color-surface-rgb))] aspect-video flex items-center justify-center"><Image src={imagePreviewUrl} alt="Preview" layout="fill" objectFit="contain" unoptimized /></div><div className="p-3 text-center text-xs text-[rgb(var(--color-on-surface-muted-rgb))] truncate">{imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)</div></MotionCard>)}
                                            {(imageData?.positivePrompt || imageData?.negativePrompt || imageData?.parameters) ? ( <>
                                                {imageData.positivePrompt && (<MotionCard className="rounded-2xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                                    <div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-semibold">Positive Prompt</h3><TooltipWrapper tipContent={copyStatus.positive ? 'Copied!' : 'Copy'}><motion.button whileTap={{ scale: 0.95 }} onClick={() => handleMetadataCopy('positive', imageData.positivePrompt)} disabled={copyStatus.positive} className={`rounded-full p-1.5 transition-colors ${copyStatus.positive ? 'text-[rgb(var(--color-success-rgb))]' : 'text-[rgb(var(--color-on-surface-faint-rgb))] hover:text-[rgb(var(--color-primary-rgb))] hover:bg-[rgba(var(--color-primary-rgb),0.1)]'}`}><AnimatedIcon animation="gentle">{copyStatus.positive ? <CheckCircleIcon /> : <ClipboardIcon />}</AnimatedIcon></motion.button></TooltipWrapper></div>
                                                    <textarea readOnly value={imageData.positivePrompt} rows={4} className="w-full appearance-none rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] p-2.5 text-xs focus:outline-none scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]" aria-label="Positive Prompt"/>
                                                </MotionCard>)}
                                                {imageData.negativePrompt && (<MotionCard className="rounded-2xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                                    <div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-semibold">Negative Prompt</h3><TooltipWrapper tipContent={copyStatus.negative ? 'Copied!' : 'Copy'}><motion.button whileTap={{ scale: 0.95 }} onClick={() => handleMetadataCopy('negative', imageData.negativePrompt)} disabled={copyStatus.negative} className={`rounded-full p-1.5 transition-colors ${copyStatus.negative ? 'text-[rgb(var(--color-success-rgb))]' : 'text-[rgb(var(--color-on-surface-faint-rgb))] hover:text-[rgb(var(--color-primary-rgb))] hover:bg-[rgba(var(--color-primary-rgb),0.1)]'}`}><AnimatedIcon animation="gentle">{copyStatus.negative ? <CheckCircleIcon /> : <ClipboardIcon />}</AnimatedIcon></motion.button></TooltipWrapper></div>
                                                    <textarea readOnly value={imageData.negativePrompt} rows={3} className="w-full appearance-none rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] p-2.5 text-xs focus:outline-none scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]" aria-label="Negative Prompt"/>
                                                </MotionCard>)}
                                                {imageData.parameters && Object.keys(imageData.parameters).length > 0 && (<MotionCard className="rounded-2xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                                    <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-semibold">Parameters</h3><TooltipWrapper tipContent={copyStatus.parameters ? 'Copied!' : 'Copy All'}><motion.button whileTap={{ scale: 0.95 }} onClick={() => handleMetadataCopy('parameters', formatParametersForCopy(imageData.parameters))} disabled={copyStatus.parameters} className={`rounded-full p-1.5 transition-colors ${copyStatus.parameters ? 'text-[rgb(var(--color-success-rgb))]' : 'text-[rgb(var(--color-on-surface-faint-rgb))] hover:text-[rgb(var(--color-primary-rgb))] hover:bg-[rgba(var(--color-primary-rgb),0.1)]'}`}><AnimatedIcon animation="gentle">{copyStatus.parameters ? <CheckCircleIcon /> : <ClipboardIcon />}</AnimatedIcon></motion.button></TooltipWrapper></div>
                                                    <div className="space-y-1 max-h-60 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))] pr-2">{Object.entries(imageData.parameters).map(([k, v]) => (<ParameterItem key={k} label={k} value={v} />))}</div>
                                                </MotionCard>)}
                                            </>) : (!imageError && <StatusMessage type="info">No generation metadata found.</StatusMessage>)}
                                            {settings.saveHistory && imageHistory.length > 0 && (<HistoryPanelBase title="Image History" history={imageHistory} renderItem={renderImageHistoryItem} filterPredicate={imageFilterPredicate} searchPlaceholder="Search filename, prompts, params..." onClearHistory={handleClearImageHistory}/>)}
                                        </motion.div>)}
                                    </AnimatePresence>
                                </div>
                                 <div className="shrink-0 border-t border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] p-4 text-center text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
                                     <p>PNG metadata extraction for &#39;parameters&#39; text chunk.</p>
                                      <p className="mt-1 text-[10px] text-[rgb(var(--color-on-surface-faint-rgb))]">History {settings.saveHistory ? `enabled (${historySizeDisplay})` : 'disabled'}.</p>
                                 </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                 </div>
            </div>
            <SettingsModal isOpen={showSettings} onClose={handleCloseSettings} settings={settings} onSettingsChange={handleSettingsChange} />
        </div>
    );
};
export default BooruTagExtractor;