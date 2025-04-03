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
  CogIcon,
  ClipboardIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  XMarkIcon,
  ChevronDownIcon,
  HistoryIcon,
  TrashIcon,
  ArrowUpOnSquareIcon,
  PhotoIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
} from './components/icons/icons';
import { TooltipWrapper } from './components/TooltipWrapper';

type ThemePreference = 'system' | 'light' | 'dark';
type ColorTheme = 'blue' | 'orange' | 'teal' | 'rose' | 'purple' | 'green' | 'custom';
type FetchMode = 'server' | 'clientProxy';

interface ClientProxyOption {
    id: string;
    label: string;
    value: string;
}

interface Settings {
    theme: ThemePreference;
    autoExtract: boolean;
    colorTheme: ColorTheme;
    customColorHex?: string;
    enableImagePreviews: boolean;
    fetchMode: FetchMode;
    clientProxyUrl: string;
    saveHistory: boolean;
}
interface HistoryEntry {
    id: string;
    url: string;
    tags: Partial<Record<TagCategory, string[]>>;
    imageUrl?: string;
    title?: string;
    siteName?: string;
    timestamp: number;
}
interface StoredHistoryItem {
    id: string;
    url: string;
    tags?: Partial<Record<TagCategory, string[]>>;
    imageUrl?: string;
    title?: string;
    siteName?: string;
    timestamp: number;
}
interface ApiExtractionResponse extends Omit<ExtractionResult, 'tags'> {
    siteName: string;
    tags?: Partial<Record<TagCategory, string[]>>;
    error?: string;
    status?: number;
    html?: string;
}

const THEME_STORAGE_KEY = 'booruExtractorThemePref';
const COLOR_THEME_STORAGE_KEY = 'booruExtractorColorThemePref';
const CUSTOM_COLOR_HEX_STORAGE_KEY = 'booruExtractorCustomColorHexPref';
const AUTO_EXTRACT_STORAGE_KEY = 'booruExtractorAutoExtractPref';
const IMAGE_PREVIEWS_STORAGE_KEY = 'booruExtractorImagePreviewsPref';
const FETCH_MODE_STORAGE_KEY = 'booruExtractorFetchModePref';
const CLIENT_PROXY_URL_STORAGE_KEY = 'booruExtractorClientProxyUrlPref';
const SAVE_HISTORY_STORAGE_KEY = 'booruExtractorSaveHistoryPref';
const HISTORY_STORAGE_KEY = 'booruExtractorHistory';
const MAX_HISTORY_SIZE = 30;
const DEFAULT_COLOR_THEME: ColorTheme = 'blue';
const DEFAULT_CUSTOM_COLOR_HEX = '#3B82F6';
const DEFAULT_FETCH_MODE: FetchMode = 'server';
const FETCH_TIMEOUT_MS = 25000;
const API_ROUTE_URL = '/api/fetch-booru';

const CLIENT_PROXY_OPTIONS: ClientProxyOption[] = [
    { id: 'allorigins', label: 'AllOrigins', value: 'https://api.allorigins.win/get?url=' },
    { id: 'thingproxy', label: 'ThingProxy', value: 'https://thingproxy.freeboard.io/fetch/' },
    { id: 'codetabs', label: 'CodeTabs', value: 'https://api.codetabs.com/v1/proxy?quest=' },
];
const DEFAULT_CLIENT_PROXY_URL = CLIENT_PROXY_OPTIONS[0].value;

const calculateTotalTags = (tags: Partial<Record<TagCategory, string[]>>): number => {
    return Object.values(tags || {}).reduce((sum, arr) => sum + (arr?.length ?? 0), 0);
};

const MotionCard = motion.div;

const CategoryToggle = React.memo(({ category, count, onToggle }: { category: TagCategoryOption; count: number; onToggle: () => void }) => (
    <MotionCard
        className="flex items-center justify-between rounded-2xl bg-[rgb(var(--color-surface-alt-2-rgb))] p-4 transition-all hover:shadow-md hover:shadow-[rgba(var(--color-primary-rgb),0.12)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        whileTap={{ scale: 0.98 }}
        whileHover={{ y: -2, backgroundColor: "rgba(var(--color-surface-alt-2-rgb), 0.8)" }}
    >
        <div className="flex items-center space-x-3 overflow-hidden">
            <motion.span
                className={`inline-flex h-4 w-4 shrink-0 rounded-full items-center justify-center`}
                style={{ backgroundColor: `rgb(var(${category.variable}))` }}
                animate={{
                    scale: category.enabled ? 1 : 0.8,
                    boxShadow: category.enabled ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            />
            <div className="flex flex-col">
                <span
                    className="truncate text-base font-medium text-[rgb(var(--color-on-surface-rgb))]"
                    title={category.label}
                >
                    {category.label}
                </span>
                {count > 0 && (
                    <span className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
                        {count} {count === 1 ? 'tag' : 'tags'}
                    </span>
                )}
            </div>
        </div>

        <div className="relative">
            <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={category.enabled}
                    onChange={onToggle}
                    aria-labelledby={`category-label-${category.id}`}
                />
                <div
                    className={`
                        relative h-8 w-14 rounded-full
                        bg-[rgb(var(--color-surface-border-rgb))]
                        transition-all duration-300 ease-out
                        peer-focus:outline-none peer-focus:ring-2
                        peer-focus:ring-[rgb(var(--color-primary-rgb))]
                        peer-focus:ring-offset-2
                        peer-focus:ring-offset-[rgb(var(--color-surface-alt-rgb))]
                        peer-checked:bg-[rgb(var(${category.variable}))]
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                        after:h-7 after:w-7 after:rounded-full after:bg-white
                        peer-checked:after:translate-x-6
                        after:shadow-sm after:transition-all after:duration-300
                        dark:after:bg-gray-200
                    `}
                />
            </label>
            <span id={`category-label-${category.id}`} className="sr-only">{category.label} Toggle</span>

            <motion.div
                className="absolute inset-0 rounded-full pointer-events-none opacity-0"
                animate={{
                    opacity: category.enabled ? 0.12 : 0,
                    backgroundColor: `rgb(var(${category.variable}))`
                }}
                initial={false}
                transition={{ duration: 0.3 }}
            />
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
        <motion.div
            className={`rounded-md border-l-4 p-4 ${typeClasses[type]}`}
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
        >
            <p className={`text-sm font-medium`}>{children}</p>
        </motion.div>
    );
});
StatusMessage.displayName = 'StatusMessage';

interface ImagePreviewProps {
    originalUrl?: string;
    title?: string;
    isLoading: boolean;
    enableImagePreviews: boolean;
}

const ImagePreview = React.memo(({ originalUrl, title, isLoading, enableImagePreviews }: ImagePreviewProps) => {
    const [imgLoading, setImgLoading] = useState(true);
    const [imgError, setImgError] = useState(false);
    const isVideo = useMemo(() => originalUrl?.match(/\.(mp4|webm|ogg)$/i), [originalUrl]);
    const placeholderBaseClasses = "flex h-64 w-full items-center justify-center rounded-lg text-[rgb(var(--color-on-surface-faint-rgb))]";

    const proxiedUrl = useMemo(() => {
        if (!originalUrl || !enableImagePreviews) return undefined;
        return `${API_ROUTE_URL}?imageUrl=${encodeURIComponent(originalUrl)}`;
    }, [originalUrl, enableImagePreviews]);

    useEffect(() => {
        if (enableImagePreviews && (originalUrl || isLoading)) {
            setImgLoading(true);
            setImgError(false);
        } else {
            setImgLoading(false);
            setImgError(false);
        }
    }, [originalUrl, isLoading, enableImagePreviews]);

    const handleLoad = useCallback(() => setImgLoading(false), []);
    const handleError = useCallback(() => { setImgLoading(false); setImgError(true); }, []);

    if (!enableImagePreviews) return null;

    if (isLoading) return <div className={`${placeholderBaseClasses} animate-pulse bg-[rgb(var(--color-surface-alt-2-rgb))]`}>Loading preview...</div>;
    if (!originalUrl) return null;
    if (imgError) return <div className={`${placeholderBaseClasses} border border-[rgb(var(--color-error-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))]`}><div className="px-4 text-center text-sm text-[rgb(var(--color-error-rgb))]"><p>Could not load preview.</p><p className="text-xs text-[rgb(var(--color-on-surface-faint-rgb))]">(Server proxy error or invalid image)</p></div></div>;

    return (
        <motion.div className="relative h-64 w-full overflow-hidden rounded-lg bg-[rgb(var(--color-surface-alt-2-rgb))] shadow-xs group" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
            {(imgLoading && !isVideo) && <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-faint-rgb))]">Loading...</div>}
            {isVideo ? (
                <video key={proxiedUrl} controls muted className={`h-full w-full object-contain transition-opacity duration-300 ${imgLoading ? 'opacity-0' : 'opacity-100'}`} onLoadedData={handleLoad} onError={handleError}>
                    <source src={proxiedUrl} /> Your browser does not support video.
                </video>
            ) : (
                <Image
                    key={proxiedUrl!}
                    src={proxiedUrl!}
                    alt={title || "Booru preview"}
                    fill={true}
                    unoptimized={true}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={`object-contain transition-opacity duration-300 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
                />
            )}
            {title && !imgLoading && !imgError && (
                <motion.div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-3 text-sm text-white" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <p className="truncate">{title}</p>
                </motion.div>
            )}
        </motion.div>
    );
});
ImagePreview.displayName = 'ImagePreview';

interface HistoryItemProps {
    entry: HistoryEntry;
    onLoad: (entry: HistoryEntry) => void;
    onDelete: (id: string) => void;
    enableImagePreviews: boolean;
}
const HistoryItem: React.FC<HistoryItemProps> = React.memo(({ entry, onLoad, onDelete, enableImagePreviews }) => {
    const [showPlaceholder, setShowPlaceholder] = useState(true);
    const formattedDate = useMemo(() => new Date(entry.timestamp).toLocaleString(undefined, {
        dateStyle: 'short',
        timeStyle: 'short',
    }), [entry.timestamp]);
    const totalTags = useMemo(() => calculateTotalTags(entry.tags), [entry.tags]);

    const handleLoadClick = useCallback((e: React.MouseEvent) => { e.stopPropagation(); onLoad(entry); }, [onLoad, entry]);
    const handleDeleteClick = useCallback((e: React.MouseEvent) => { e.stopPropagation(); onDelete(entry.id); }, [onDelete, entry.id]);

    const proxiedImageUrl = useMemo(() => {
        if (!entry.imageUrl || !enableImagePreviews) return undefined;
        return `${API_ROUTE_URL}?imageUrl=${encodeURIComponent(entry.imageUrl)}`;
    }, [entry.imageUrl, enableImagePreviews]);

    useEffect(() => {
        setShowPlaceholder(!proxiedImageUrl);
    }, [proxiedImageUrl]);

    const handleError = useCallback(() => setShowPlaceholder(true), []);
    const handleLoadSuccess = useCallback(() => setShowPlaceholder(false), []);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
            className="flex items-center space-x-3 rounded-lg bg-[rgb(var(--color-surface-alt-2-rgb))] p-3 transition-colors hover:bg-[rgb(var(--color-surface-border-rgb))]"
        >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-[rgb(var(--color-surface-border-rgb))]">
                {enableImagePreviews && !showPlaceholder && proxiedImageUrl && (
                    <Image
                        src={proxiedImageUrl}
                        alt="preview"
                        width={40}
                        height={40}
                        unoptimized={true}
                        className="h-full w-full object-cover"
                        onError={handleError}
                        onLoad={handleLoadSuccess}
                    />
                )}
                {(!enableImagePreviews || showPlaceholder) && (
                    <div className="flex h-full w-full items-center justify-center">
                        <AnimatedIcon animation="gentle"><PhotoIcon className="h-5 w-5 text-[rgb(var(--color-on-surface-faint-rgb))]" /></AnimatedIcon>
                    </div>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]" title={entry.title || entry.url}>
                    {entry.title || new URL(entry.url).pathname.split('/').pop() || entry.url}
                </p>
                <p className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
                    {entry.siteName ? `${entry.siteName} • ` : ''}
                    {formattedDate} • {totalTags} {totalTags === 1 ? 'tag' : 'tags'}
                </p>
            </div>
            <TooltipWrapper tipContent="Load Entry">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)', transition: { duration: 0.1 } }}
                    onClick={handleLoadClick}
                    className="rounded-full p-1.5 text-[rgb(var(--color-on-surface-faint-rgb))] transition-colors hover:text-[rgb(var(--color-primary-rgb))]"
                    aria-label="Load this history entry"
                >
                    <AnimatedIcon animation="gentle"><ArrowUpOnSquareIcon /></AnimatedIcon>
                </motion.button>
            </TooltipWrapper>
            <TooltipWrapper tipContent="Delete Entry">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(var(--color-error-rgb), 0.1)', transition: { duration: 0.1 } }}
                    onClick={handleDeleteClick}
                    className="rounded-full p-1.5 text-[rgb(var(--color-on-surface-faint-rgb))] transition-colors hover:text-[rgb(var(--color-error-rgb))]"
                    aria-label="Delete this history entry"
                >
                    <AnimatedIcon animation="gentle"><TrashIcon /></AnimatedIcon>
                </motion.button>
            </TooltipWrapper>
        </motion.div>
    );
});
HistoryItem.displayName = 'HistoryItem';

interface HistoryPanelProps {
    history: HistoryEntry[];
    onLoadEntry: (entry: HistoryEntry) => void;
    onDeleteEntry: (id: string) => void;
    onClearHistory: () => void;
    enableImagePreviews: boolean;
}
const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoadEntry, onDeleteEntry, onClearHistory, enableImagePreviews }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleClearClick = useCallback(() => {
        onClearHistory();
        setShowClearConfirm(false);
        setSearchQuery('');
    }, [onClearHistory]);

    const handleToggleOpen = useCallback(() => setIsOpen(prev => !prev), []);
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value), []);
    const handleClearSearch = useCallback(() => setSearchQuery(''), []);
    const handleShowConfirm = useCallback(() => setShowClearConfirm(true), []);
    const handleHideConfirm = useCallback(() => setShowClearConfirm(false), []);

    const filteredHistory = useMemo(() => {
        if (!searchQuery.trim()) return history;
        const lowerCaseQuery = searchQuery.toLowerCase();
        return history.filter(entry =>
            entry.title?.toLowerCase().includes(lowerCaseQuery) ||
            entry.url.toLowerCase().includes(lowerCaseQuery) ||
            entry.siteName?.toLowerCase().includes(lowerCaseQuery) ||
            (entry.tags && Object.values(entry.tags).flat().some(tag => tag.toLowerCase().includes(lowerCaseQuery)))
        );
    }, [history, searchQuery]);

    useEffect(() => {
        if (history.length === 0 && isOpen) {
            setIsOpen(false);
        }
    }, [history.length, isOpen]);

    return (
        <div className="mt-6 overflow-hidden rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))]">
            <motion.button
                whileTap={{ backgroundColor: 'rgba(var(--color-surface-border-rgb), 0.5)' }}
                transition={{ duration: 0.05 }}
                onClick={handleToggleOpen}
                className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-[rgb(var(--color-surface-alt-2-rgb))] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[rgb(var(--color-primary-rgb))]"
                aria-expanded={isOpen}
                aria-controls="history-content"
            >
                <div className="flex items-center space-x-2">
                    <AnimatedIcon animation="gentle"><HistoryIcon /></AnimatedIcon>
                    <span className="font-semibold text-[rgb(var(--color-on-surface-rgb))]">Extraction History</span>
                    <span className="rounded-full bg-[rgb(var(--color-surface-border-rgb))] px-2 py-0.5 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">{history.length}</span>
                </div>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDownIcon />
                </motion.span>
            </motion.button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        id="history-content"
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: "auto" },
                            collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-[rgb(var(--color-surface-border-rgb))] p-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search history (title, url, tags...)"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="w-full rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] py-2 pl-10 pr-10 text-sm text-[rgb(var(--color-on-surface-rgb))] placeholder:text-[rgb(var(--color-on-surface-faint-rgb))] transition duration-200 focus:border-[rgb(var(--color-primary-rgb))] focus:outline-hidden focus:ring-1 focus:ring-[rgb(var(--color-primary-rgb))]"
                                    aria-label="Search history entries"
                                />
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transform text-[rgb(var(--color-on-surface-faint-rgb))]">
                                    <MagnifyingGlassIcon />
                                </span>
                                {searchQuery && (
                                    <TooltipWrapper tipContent="Clear Search">
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleClearSearch}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full p-1 text-[rgb(var(--color-on-surface-faint-rgb))] transition-colors hover:bg-[rgb(var(--color-surface-border-rgb))] hover:text-[rgb(var(--color-on-surface-rgb))]"
                                            aria-label="Clear search"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                        >
                                            <XMarkIcon className="h-4 w-4"/>
                                        </motion.button>
                                    </TooltipWrapper>
                                )}
                            </div>
                        </div>
                        <div className="max-h-80 space-y-2 overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]">
                            <AnimatePresence mode="popLayout">
                                {filteredHistory.map((entry) => (
                                    <HistoryItem
                                        key={entry.id}
                                        entry={entry}
                                        onLoad={onLoadEntry}
                                        onDelete={onDeleteEntry}
                                        enableImagePreviews={enableImagePreviews}
                                    />
                                ))}
                            </AnimatePresence>
                            {history.length > 0 && filteredHistory.length === 0 && searchQuery && (
                                <p className="py-4 text-center text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">No history entries match your search.</p>
                            )}
                            {history.length === 0 && (
                                <p className="py-4 text-center text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">History is empty.</p>
                            )}
                        </div>

                        {history.length > 0 && (
                            <div className="relative border-t border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] p-3 text-right">
                                <AnimatePresence>
                                    {showClearConfirm && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className="absolute right-3 bottom-full z-10 mb-2 flex items-center gap-2 rounded-sm border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] p-2 shadow-lg"
                                        >
                                            <p className="text-xs text-[rgb(var(--color-on-surface-rgb))]">Really clear?</p>
                                            <motion.button whileTap={{ scale: 0.95 }} onClick={handleClearClick} className="rounded-sm bg-red-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-red-600"> Yes, Clear </motion.button>
                                            <motion.button whileTap={{ scale: 0.95 }} onClick={handleHideConfirm} className="rounded-sm bg-[rgb(var(--color-surface-border-rgb))] px-2 py-1 text-xs font-medium text-[rgb(var(--color-on-surface-rgb))] transition-colors hover:bg-gray-300 dark:hover:bg-gray-500"> Cancel </motion.button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <TooltipWrapper tipContent="Clear All History">
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleShowConfirm}
                                        className="inline-flex items-center space-x-1 rounded-md bg-[rgb(var(--color-error-bg-rgb))] px-2.5 py-1 text-xs font-medium text-[rgb(var(--color-error-rgb))] transition-colors hover:bg-red-100 dark:hover:bg-red-900/50"
                                        aria-label="Clear History"
                                    >
                                        <AnimatedIcon animation="gentle"><TrashIcon /></AnimatedIcon>
                                        <span>Clear History</span>
                                    </motion.button>
                                </TooltipWrapper>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
HistoryPanel.displayName = 'HistoryPanel';

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
    const [settings, setSettings] = useState<Settings>({
        theme: 'system',
        autoExtract: true,
        colorTheme: DEFAULT_COLOR_THEME,
        customColorHex: DEFAULT_CUSTOM_COLOR_HEX,
        enableImagePreviews: true,
        fetchMode: DEFAULT_FETCH_MODE,
        clientProxyUrl: DEFAULT_CLIENT_PROXY_URL,
        saveHistory: false,
    });
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const cardBodyRef = useRef<HTMLDivElement>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;
        const savedColorTheme = localStorage.getItem(COLOR_THEME_STORAGE_KEY) as ColorTheme | null;
        const savedCustomHex = localStorage.getItem(CUSTOM_COLOR_HEX_STORAGE_KEY);
        const savedAutoExtract = localStorage.getItem(AUTO_EXTRACT_STORAGE_KEY);
        const savedImagePreviews = localStorage.getItem(IMAGE_PREVIEWS_STORAGE_KEY);
        const savedFetchMode = localStorage.getItem(FETCH_MODE_STORAGE_KEY) as FetchMode | null;
        const savedClientProxyUrl = localStorage.getItem(CLIENT_PROXY_URL_STORAGE_KEY);
        const savedSaveHistory = localStorage.getItem(SAVE_HISTORY_STORAGE_KEY);
        let loadedHistory: HistoryEntry[] = [];

        try {
            const savedHistoryData = localStorage.getItem(HISTORY_STORAGE_KEY);
            if (savedHistoryData) {
                const parsed = JSON.parse(savedHistoryData);
                const isValidHistory = (item: unknown): item is StoredHistoryItem =>
                    typeof item === 'object' && item !== null &&
                    'id' in item && typeof item.id === 'string' &&
                    'url' in item && typeof item.url === 'string' &&
                    'timestamp' in item && typeof item.timestamp === 'number' &&
                    (!('tags' in item) || item.tags === undefined || (typeof item.tags === 'object' && item.tags !== null && !Array.isArray(item.tags)));

                if (Array.isArray(parsed) && parsed.every(isValidHistory)) {
                    loadedHistory = parsed.map((item) => ({
                            ...(item as StoredHistoryItem),
                            tags: (typeof item.tags === 'object' && item.tags !== null && !Array.isArray(item.tags)) ? item.tags : {}
                         }))
                        .sort((a, b) => b.timestamp - a.timestamp);
                } else {
                    localStorage.removeItem(HISTORY_STORAGE_KEY);
                }
            }
        } catch (e) {
            console.error("Failed to load or parse history:", e);
            localStorage.removeItem(HISTORY_STORAGE_KEY);
        }

        const initialSettings: Settings = {
            theme: savedTheme ?? 'system',
            colorTheme: savedColorTheme ?? DEFAULT_COLOR_THEME,
            customColorHex: savedCustomHex ?? DEFAULT_CUSTOM_COLOR_HEX,
            autoExtract: savedAutoExtract ? JSON.parse(savedAutoExtract) : true,
            enableImagePreviews: savedImagePreviews ? JSON.parse(savedImagePreviews) : true,
            fetchMode: savedFetchMode ?? DEFAULT_FETCH_MODE,
            clientProxyUrl: savedClientProxyUrl ?? DEFAULT_CLIENT_PROXY_URL,
            saveHistory: savedSaveHistory ? JSON.parse(savedSaveHistory) : false,
        };
        setSettings(initialSettings);
        setHistory(loadedHistory);
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth < 768);
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const root = window.document.documentElement;
        const isDark = settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        root.classList.toggle('dark', isDark);
        root.dataset.colorTheme = settings.colorTheme;

        if (settings.colorTheme === 'custom' && settings.customColorHex) {
            const rgb = hexToRgb(settings.customColorHex);
            if (rgb) {
                const primaryRgbStr = `${rgb.r} ${rgb.g} ${rgb.b}`;
                const focusFactor = isDark ? 1.2 : 0.85;
                const focusRgbStr = adjustRgb(rgb.r, rgb.g, rgb.b, focusFactor);
                const contentRgbStr = getContrastColor(rgb.r, rgb.g, rgb.b);
                root.style.setProperty('--custom-primary-rgb', primaryRgbStr);
                root.style.setProperty('--custom-primary-focus-rgb', focusRgbStr);
                root.style.setProperty('--custom-primary-content-rgb', contentRgbStr);
            } else {
                root.style.removeProperty('--custom-primary-rgb');
                root.style.removeProperty('--custom-primary-focus-rgb');
                root.style.removeProperty('--custom-primary-content-rgb');
            }
        } else {
            root.style.removeProperty('--custom-primary-rgb');
            root.style.removeProperty('--custom-primary-focus-rgb');
            root.style.removeProperty('--custom-primary-content-rgb');
        }

        localStorage.setItem(THEME_STORAGE_KEY, settings.theme);
        localStorage.setItem(AUTO_EXTRACT_STORAGE_KEY, JSON.stringify(settings.autoExtract));
        localStorage.setItem(COLOR_THEME_STORAGE_KEY, settings.colorTheme);
        localStorage.setItem(IMAGE_PREVIEWS_STORAGE_KEY, JSON.stringify(settings.enableImagePreviews));
        localStorage.setItem(FETCH_MODE_STORAGE_KEY, settings.fetchMode);
        localStorage.setItem(CLIENT_PROXY_URL_STORAGE_KEY, settings.clientProxyUrl);
        localStorage.setItem(SAVE_HISTORY_STORAGE_KEY, JSON.stringify(settings.saveHistory));
        if (settings.customColorHex) localStorage.setItem(CUSTOM_COLOR_HEX_STORAGE_KEY, settings.customColorHex);
        else localStorage.removeItem(CUSTOM_COLOR_HEX_STORAGE_KEY);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            if (settings.theme === 'system') {
                const systemIsDark = e.matches;
                root.classList.toggle('dark', systemIsDark);
                if (settings.colorTheme === 'custom' && settings.customColorHex) {
                    const rgb = hexToRgb(settings.customColorHex);
                    if (rgb) {
                        const focusFactor = systemIsDark ? 1.2 : 0.85;
                        const focusRgbStr = adjustRgb(rgb.r, rgb.g, rgb.b, focusFactor);
                        const contentRgbStr = getContrastColor(rgb.r, rgb.g, rgb.b);
                        root.style.setProperty('--custom-primary-focus-rgb', focusRgbStr);
                        root.style.setProperty('--custom-primary-content-rgb', contentRgbStr);
                    }
                }
            }
        };

        if (settings.theme === 'system') mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);

    }, [settings]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    useEffect(() => {
        const enabledCategories = new Set(tagCategories.filter(cat => cat.enabled).map(cat => cat.id));
        const filteredTags: string[] = [];
        DEFAULT_TAG_CATEGORIES.forEach(catDef => {
            if (enabledCategories.has(catDef.id) && allExtractedTags[catDef.id]) {
                filteredTags.push(...allExtractedTags[catDef.id]!.map(tag => tag.replace(/_/g, ' ')));
            }
        });
        setDisplayedTags(filteredTags.join(', '));
    }, [allExtractedTags, tagCategories]);

    const saveHistoryToLocalStorage = useCallback((historyToSave: HistoryEntry[]) => {
        try {
            if (historyToSave.length > 0) {
                localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyToSave));
            } else if (localStorage.getItem(HISTORY_STORAGE_KEY)) {
                localStorage.removeItem(HISTORY_STORAGE_KEY);
            }
        } catch (e) {
            console.error("Failed to save history to localStorage:", e);
            if (e instanceof Error && e.message.toLowerCase().includes('quota')) {
                 setError("History storage limit reached. Cannot save more entries.");
            }
        }
    }, []);


    const tagCounts = useMemo(() => {
        return Object.entries(allExtractedTags).reduce((acc, [category, tagsArray]) => {
            if (tagsArray) {
                acc[category as TagCategory] = tagsArray.length;
            }
            return acc;
        }, {} as Record<TagCategory, number>);
    }, [allExtractedTags]);

    const totalExtractedTagCount = useMemo(() => calculateTotalTags(allExtractedTags), [allExtractedTags]);

    const extractTags = useCallback(async (targetUrl: string) => {
        const trimmedUrl = targetUrl.trim();
        if (!trimmedUrl || loading || trimmedUrl === currentExtractionUrl.current) return;

        const site = BOORU_SITES.find(s => s.urlPattern.test(trimmedUrl));
        if (!site) {
            setError('URL does not match supported sites/formats.');
            setAllExtractedTags({}); setImageUrl(undefined); setImageTitle(undefined); setActiveSite(null);
            currentExtractionUrl.current = null;
            return;
        }

        setLoading(true); setError(''); setAllExtractedTags({}); setImageUrl(undefined); setImageTitle(undefined); setDisplayedTags(''); setActiveSite(site.name); setCopySuccess(false);
        currentExtractionUrl.current = trimmedUrl;

        const controller = new AbortController();
        const fetchTimeout = FETCH_TIMEOUT_MS + (settings.fetchMode === 'server' ? 2000 : 0);
        const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

        let proxyUsed = '';
        let selectedProxy: ClientProxyOption | undefined;

        try {
            let extractionResult: ExtractionResult = { tags: {} };
            let extractionError: string | null = null;
            let extractionSiteName: string = site.name;
            let extractionImageUrl: string | undefined = undefined;
            let extractionTitle: string | undefined = undefined;

            if (settings.fetchMode === 'server') {
                proxyUsed = 'Server Proxy';
                const response = await fetch(API_ROUTE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ targetUrl: trimmedUrl }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                const resultData: ApiExtractionResponse = await response.json();
                const responseTags = resultData.tags || {};
                const responseTotalTags = calculateTotalTags(responseTags);

                if (!response.ok || resultData.error) {
                    let errorMsg = resultData.error || `API Error: ${response.status}`;
                    if (response.status === 504) errorMsg = 'Server timed out fetching data from the target site.';
                    else if (response.status === 502) errorMsg = `Server couldn't reach target site (Bad Gateway). ${resultData.error || ''}`.trim();
                    else if (response.status === 400) errorMsg = `Invalid request: ${resultData.error || ''}`.trim();
                    else if (response.status === 422) errorMsg = `${resultData.error || 'Extraction failed (e.g., page error, login needed).'}`;
                    else if (response.status === 500) errorMsg = `Internal Server Error: ${resultData.error || 'Unknown server issue.'}`;

                    if (!(resultData.error && resultData.error.toLowerCase().includes('warning') && responseTotalTags > 0)) {
                        extractionError = errorMsg;
                        extractionSiteName = '';
                    } else {
                        extractionResult = { tags: responseTags, imageUrl: resultData.imageUrl, title: resultData.title };
                        extractionError = errorMsg;
                        extractionSiteName = resultData.siteName;
                        extractionImageUrl = resultData.imageUrl;
                        extractionTitle = resultData.title;
                    }
                } else {
                    extractionResult = { tags: responseTags, imageUrl: resultData.imageUrl, title: resultData.title };
                    extractionSiteName = resultData.siteName;
                    extractionImageUrl = resultData.imageUrl;
                    extractionTitle = resultData.title;
                    if (resultData.error && resultData.error.toLowerCase().includes('warning')) {
                        extractionError = resultData.error;
                    } else if (responseTotalTags === 0 && resultData.imageUrl) {
                       extractionError = `Warning: Image found on ${resultData.siteName}, but no tags were extracted. Selectors may need update or tags might be absent.`;
                    }
                }
            } else {
                selectedProxy = CLIENT_PROXY_OPTIONS.find(p => p.value === settings.clientProxyUrl) || CLIENT_PROXY_OPTIONS[0];
                proxyUsed = `Client Proxy (${selectedProxy.label})`;
                const proxyFetchUrl = `${selectedProxy.value}${encodeURIComponent(trimmedUrl)}`;
                let html = '';
                let clientFetchError = '';

                try {
                    const response = await fetch(proxyFetchUrl, { signal: controller.signal });
                     clearTimeout(timeoutId);

                    if (!response.ok) {
                         clientFetchError = `Client proxy (${selectedProxy.label}) failed: ${response.status}. Service may be down/blocking.`;
                    } else {
                        html = await response.text();
                        if (!html) {
                            clientFetchError = `Client proxy (${selectedProxy.label}) returned empty content.`;
                        } else if (selectedProxy.id === 'allorigins') {
                            try {
                                const jsonData = JSON.parse(html);
                                if (jsonData && jsonData.contents) {
                                    html = jsonData.contents;
                                } else {
                                    clientFetchError = `Client proxy (${selectedProxy.label}) returned JSON but missing 'contents' field.`; html = '';
                                }
                            } catch  {
                                if (html.toLowerCase().includes("error") || html.toLowerCase().includes("cloudflare") || html.length < 100) {
                                    clientFetchError = `Client proxy (${selectedProxy.label}) returned non-JSON content (likely error/block).`;
                                }
                            }
                        }
                         if (!html && !clientFetchError) clientFetchError = `Client proxy (${selectedProxy.label}) resulted in empty HTML.`;
                    }
                } catch(fetchErr) {
                    clearTimeout(timeoutId);
                     if ((fetchErr as Error).name === 'AbortError') clientFetchError = `Request via ${proxyUsed} timed out after ${fetchTimeout / 1000}s.`;
                     else if (fetchErr instanceof TypeError && fetchErr.message.toLowerCase().includes('failed to fetch')) clientFetchError = `Failed to connect via ${proxyUsed}. Check connection/proxy status.`;
                     else clientFetchError = `Client fetch error via ${proxyUsed}: ${(fetchErr as Error).message}`;
                }

                if (clientFetchError) {
                    extractionError = clientFetchError;
                    extractionSiteName = '';
                } else if (!html) {
                    extractionError = 'Failed to retrieve valid HTML content via Client Proxy.';
                    extractionSiteName = '';
                } else {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');

                        try {
                            doc.querySelector('base')?.remove();
                            const head = doc.head || doc.documentElement.appendChild(doc.createElement('head'));
                            const base = doc.createElement('base');
                            base.href = new URL('./', trimmedUrl).href;
                            head.insertBefore(base, head.firstChild);
                        } catch (e) { console.warn(`Could not set base tag via Client Proxy for ${trimmedUrl}:`, e); }

                        const detectPageError = (document: Document) => {
                            let detected = false;
                            let errorMessage = "Check URL, site status, or try again later.";

                            if (document.title.toLowerCase().includes("error") ||
                                document.title.toLowerCase().includes("access denied") ||
                                document.title.toLowerCase().includes("cloudflare")) {
                                detected = true;
                                errorMessage = `Site returned error/denial/block in title: ${document.title.substring(0, 100)}`;
                            }

                            const errorElement = document.querySelector('.error, #error-page, .dtext-error, [class*="error"], [id*="error"], #challenge-running');
                            if (errorElement?.textContent && errorElement.textContent.trim().length > 10) {
                                detected = true;
                                const pageErrorText = errorElement.textContent.trim();
                                if (pageErrorText.toLowerCase().includes("rate limit"))
                                    errorMessage = "Rate limit likely exceeded on target site.";
                                else if (pageErrorText.toLowerCase().includes("login") || pageErrorText.toLowerCase().includes("authenticate"))
                                    errorMessage = "Content may require login.";
                                else if (pageErrorText.toLowerCase().includes("not found") || pageErrorText.toLowerCase().includes("doesn't exist"))
                                    errorMessage = "Post not found (404).";
                                else if (pageErrorText.toLowerCase().includes("cloudflare") || pageErrorText.toLowerCase().includes("checking your browser"))
                                    errorMessage = "Blocked by Cloudflare or similar security check.";
                                else
                                    errorMessage = `Site Error Detected: ${pageErrorText.substring(0, 150)}`;
                            }

                            if (!detected && document.body) {
                                const bodyText = document.body.textContent?.toLowerCase() || '';
                                if (bodyText.includes('you must be logged in') || bodyText.includes('requires an account') || bodyText.includes('please login')) {
                                    detected = true;
                                    errorMessage = `Content may require login.`;
                                } else if (bodyText.includes('access denied')) {
                                    detected = true;
                                    errorMessage = `Access denied by target site.`;
                                } else if (bodyText.includes('cloudflare') && bodyText.includes('checking your browser')) {
                                    detected = true;
                                    errorMessage = `Blocked by Cloudflare or similar security check.`;
                                } else if (bodyText.includes('enable javascript') && bodyText.includes('enable cookies')) {
                                    detected = true;
                                    errorMessage = `Target site requires JS/Cookies, may be incompatible with proxy.`;
                                }
                            }

                            return { detected, errorMessage };
                        };

                        const { detected: pageErrorDetected, errorMessage: specificError } = detectPageError(doc);

                        if (pageErrorDetected) {
                            extractionError = `Extraction stopped: ${specificError}`;
                            extractionSiteName = '';
                        } else {
                             extractionResult = site.extractTags(doc);
                             extractionImageUrl = extractionResult.imageUrl;
                             extractionTitle = extractionResult.title;
                             const clientTotalTags = calculateTotalTags(extractionResult.tags || {});
                             if (clientTotalTags === 0) {
                                 extractionError = extractionResult.imageUrl
                                     ? 'Warning: Image found, but no tags extracted (Client Proxy). Selectors may need update or tags absent.'
                                     : 'Warning: No tags or image found (Client Proxy). Page structure changed, post unavailable, or login needed.';
                             }
                        }
                    } catch (parseErr) {
                        extractionError = `Failed to parse or extract via ${proxyUsed}: ${(parseErr as Error).message}`;
                        extractionSiteName = '';
                    }
                }
            }

            if (extractionError) {
                 setError(extractionError);
                 console.error("Extraction Error:", extractionError, "Mode:", settings.fetchMode, "Proxy:", proxyUsed);
                 if (!extractionSiteName) setActiveSite(null);
                 else setActiveSite(extractionSiteName);

                 if (!(extractionError.toLowerCase().includes('warning') && calculateTotalTags(extractionResult.tags) > 0)) {
                     setAllExtractedTags({}); setImageUrl(undefined); setImageTitle(undefined);
                     currentExtractionUrl.current = null;
                 } else {
                     setAllExtractedTags(extractionResult.tags || {});
                     setImageUrl(extractionImageUrl);
                     setImageTitle(extractionTitle);
                     console.warn("Extraction Warning with data:", extractionError, "URL:", trimmedUrl, "Site:", extractionSiteName);
                 }

            } else {
                 setAllExtractedTags(extractionResult.tags || {});
                 setImageUrl(extractionImageUrl);
                 setImageTitle(extractionTitle);
                 setActiveSite(extractionSiteName);
                 setError('');

                 const finalTotalTags = calculateTotalTags(extractionResult.tags || {});
                 if(finalTotalTags > 0) console.log(`Successfully extracted ${finalTotalTags} tags from ${extractionSiteName} via ${proxyUsed}.`);

                if (settings.saveHistory) {
                     const newEntry: HistoryEntry = {
                         id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                         url: trimmedUrl,
                         tags: extractionResult.tags || {},
                         imageUrl: extractionImageUrl,
                         title: extractionTitle,
                         siteName: extractionSiteName,
                         timestamp: Date.now(),
                     };
                     setHistory(prevHistory => {
                         const updatedHistory = [newEntry, ...prevHistory.filter(h => h.url !== trimmedUrl)];
                         const finalHistory = updatedHistory.slice(0, MAX_HISTORY_SIZE);
                         saveHistoryToLocalStorage(finalHistory);
                         return finalHistory;
                     });
                 }
             }

        } catch (err) {
             clearTimeout(timeoutId);
             const errorMessage = `Unexpected error during extraction: ${(err as Error).message}`;
             setError(errorMessage);
             console.error(errorMessage, err);
             setAllExtractedTags({}); setActiveSite(null); setImageUrl(undefined); setImageTitle(undefined);
             currentExtractionUrl.current = null;
        } finally {
             setLoading(false);
        }
    }, [loading, settings.fetchMode, settings.clientProxyUrl, settings.saveHistory, saveHistoryToLocalStorage]);

    const handleReset = useCallback(() => {
        setUrl(''); setAllExtractedTags({}); setImageUrl(undefined); setImageTitle(undefined); setDisplayedTags(''); setError(''); setActiveSite(null); setTagCategories(DEFAULT_TAG_CATEGORIES); setCopySuccess(false); setLoading(false);
        currentExtractionUrl.current = null;
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        cardBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (!settings.autoExtract) {
            if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
            return;
        }
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        const trimmedUrl = url.trim();

        if (trimmedUrl && trimmedUrl.includes('.') && trimmedUrl.length > 10 && (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://'))) {
            const isSupported = BOORU_SITES.some(s => s.urlPattern.test(trimmedUrl));
            if (isSupported) {
                if (trimmedUrl !== currentExtractionUrl.current) {
                    debounceTimeoutRef.current = setTimeout(() => {
                        const currentInputValue = (document.getElementById('url') as HTMLInputElement)?.value.trim();
                        if (trimmedUrl === currentInputValue && trimmedUrl !== currentExtractionUrl.current) {
                            void extractTags(trimmedUrl);
                        }
                    }, 750);
                }
            } else if (trimmedUrl !== currentExtractionUrl.current) {
                setError('URL detected, but does not match supported sites.');
            }
        } else if (!trimmedUrl && currentExtractionUrl.current) {
            handleReset();
        } else if (trimmedUrl && !(trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://'))) {
            if (trimmedUrl !== currentExtractionUrl.current) setError('Please enter a valid URL starting with http:// or https://');
        } else if (trimmedUrl && trimmedUrl !== currentExtractionUrl.current) {
             setError('');
        }
        return () => { if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); };
    }, [url, extractTags, settings.autoExtract, handleReset]);

    const handleSettingsChange = useCallback((newSettings: Partial<Settings>) => setSettings(prev => ({ ...prev, ...newSettings })), []);
    const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value), []);
    const handleManualExtract = useCallback(() => {
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        currentExtractionUrl.current = null;
        void extractTags(url.trim());
    }, [extractTags, url]);
    const toggleTagCategory = useCallback((categoryId: TagCategory) => setTagCategories(prev => prev.map(cat => cat.id === categoryId ? { ...cat, enabled: !cat.enabled } : cat)), []);
    const toggleAllCategories = useCallback((enabled: boolean) => setTagCategories(prev => prev.map(cat => ({ ...cat, enabled }))), []);
    const handleCopy = useCallback(async () => {
        if (!displayedTags) return;
        try { await navigator.clipboard.writeText(displayedTags); setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000); }
        catch (err) { console.error('Failed to copy tags:', err); setError("Failed to copy tags."); }
    }, [displayedTags]);
    const areAllCategoriesEnabled = useMemo(() => tagCategories.every(cat => cat.enabled), [tagCategories]);
    const areAllCategoriesDisabled = useMemo(() => !tagCategories.some(cat => cat.enabled), [tagCategories]);

    const handleLoadHistoryEntry = useCallback((entry: HistoryEntry) => {
        if (loading) return;
        handleReset();
        setUrl(entry.url);
        setAllExtractedTags(typeof entry.tags === 'object' && entry.tags !== null ? entry.tags : {});
        setImageUrl(entry.imageUrl);
        setImageTitle(entry.title);
        setActiveSite(entry.siteName || null);
        currentExtractionUrl.current = entry.url;
        setError('');
        cardBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, [loading, handleReset]);

    const handleDeleteHistoryEntry = useCallback((id: string) => {
         setHistory(prev => {
             const updatedHistory = prev.filter(item => item.id !== id);
             saveHistoryToLocalStorage(updatedHistory);
             return updatedHistory;
         });
     }, [saveHistoryToLocalStorage]);

    const handleClearHistory = useCallback(() => {
        setHistory([]);
        saveHistoryToLocalStorage([]);
    }, [saveHistoryToLocalStorage]);


    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const types = e.dataTransfer.types;
        if (types.includes('text/uri-list') || types.includes('text/plain')) {
            e.dataTransfer.dropEffect = 'copy';
            setIsDraggingOver(true);
        } else {
            e.dataTransfer.dropEffect = 'none';
        }
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);
        const droppedUrl = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
        if (droppedUrl && (droppedUrl.startsWith('http://') || droppedUrl.startsWith('https://'))) {
            const trimmedUrl = droppedUrl.trim();
            if (trimmedUrl) {
                handleReset();
                currentExtractionUrl.current = null;
                setUrl(trimmedUrl);
                setError('');
                if (settings.autoExtract) void extractTags(trimmedUrl);
            }
        } else {
            setError("Dropped item is not a valid URL.");
        }
    }, [handleReset, settings.autoExtract, extractTags]);

    const handleOpenSettings = useCallback(() => setShowSettings(true), []);
    const handleCloseSettings = useCallback(() => setShowSettings(false), []);

    const shouldShowPreviewSection = useMemo(() => {
        return settings.enableImagePreviews && (!!imageUrl || (loading && !imageUrl && !!currentExtractionUrl.current && !error));
    }, [settings.enableImagePreviews, imageUrl, loading, currentExtractionUrl, error]);

    const hasResults = useMemo(() => totalExtractedTagCount > 0 || !!imageUrl, [totalExtractedTagCount, imageUrl]);

    const getSelectedProxyLabel = useCallback(() => {
        return CLIENT_PROXY_OPTIONS.find(p => p.value === settings.clientProxyUrl)?.label || 'Unknown Proxy';
    }, [settings.clientProxyUrl]);

    return (
        <div className="flex min-h-screen items-center justify-center overflow-hidden bg-[rgb(var(--color-surface-rgb))] p-4 text-[rgb(var(--color-on-surface-rgb))] transition-colors duration-300 sm:p-6">
            <MotionCard
                className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] shadow-lg max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <AnimatePresence>
                    {isDraggingOver && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-xl border-2 border-dashed border-[rgb(var(--color-primary-rgb))] bg-[rgb(var(--color-primary-rgb))]/20 backdrop-blur-xs"
                        >
                            <div className="rounded-lg bg-[rgb(var(--color-primary-rgb))]/80 px-4 py-2 text-center text-[rgb(var(--color-primary-content-rgb))] shadow-sm">
                                <ArrowDownTrayIcon className="mx-auto mb-1 h-8 w-8"/>
                                <p className="font-semibold">Drop URL Here</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="sticky top-0 z-10 flex shrink-0 items-start justify-between border-b border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] px-6 py-5">
                    <div className="grow pr-4 sm:pr-10">
                        <h1 className="text-xl font-semibold text-[rgb(var(--color-on-surface-rgb))] sm:text-2xl">Booru Tag Extractor</h1>
                        <div className="mt-2">
                            <span className="mr-2 text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">Supports:</span>
                            {BOORU_SITES.map((site) => (
                                <span key={site.name} className={`mb-1.5 mr-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors duration-150 ${ activeSite === site.name ? 'bg-[rgb(var(--color-primary-rgb))]/10 text-[rgb(var(--color-primary-rgb))] dark:bg-[rgb(var(--color-primary-rgb))]/20' : 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-muted-rgb))]'}`}>
                                    {site.name}
                                </span>
                            ))}
                        </div>
                    </div>
                    <TooltipWrapper tipContent="Settings">
                        <motion.button
                            whileTap={{ scale: 0.9 }} whileHover={{ rotate: 15, scale: 1.1 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            onClick={handleOpenSettings}
                            className="shrink-0 rounded-full p-2 text-[rgb(var(--color-on-surface-muted-rgb))] transition-colors hover:bg-[rgb(var(--color-surface-alt-2-rgb))] hover:text-[rgb(var(--color-on-surface-rgb))] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary-rgb))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))]"
                            aria-label="Open Settings"
                        ><CogIcon /></motion.button>
                    </TooltipWrapper>
                </div>

                <div ref={cardBodyRef} className="grow space-y-6 overflow-y-auto p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]">
                    <div>
                        <label htmlFor="url" className="mb-1.5 block text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]">Booru Post URL</label>
                        <input id="url" type="url" className="w-full appearance-none rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] px-4 py-2.5 text-[rgb(var(--color-on-surface-rgb))] placeholder:text-[rgb(var(--color-on-surface-faint-rgb))] transition duration-200 focus:border-transparent focus:outline-hidden focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]" placeholder="Paste URL here or Drag & Drop..." value={url} onChange={handleUrlChange} aria-label="Booru Post URL"/>
                    </div>
                    <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                        <motion.button whileTap={{ scale: 0.97 }} onClick={handleManualExtract} disabled={loading || !url.trim()} className="flex-1 inline-flex items-center justify-center rounded-lg bg-[rgb(var(--color-primary-rgb))] px-5 py-2.5 font-semibold text-[rgb(var(--color-primary-content-rgb))] shadow-xs transition duration-200 hover:bg-[rgb(var(--color-primary-focus-rgb))] hover:shadow-md focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary-rgb))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))]" aria-label="Extract Tags Manually">
                            {loading ? <LoadingSpinner /> : 'Extract Manually'}
                        </motion.button>
                        <TooltipWrapper tipContent="Clear input, results, and filters">
                            <motion.button whileTap={{ scale: 0.97 }} onClick={handleReset} className="inline-flex items-center justify-center rounded-lg bg-[rgb(var(--color-surface-alt-2-rgb))] px-5 py-2.5 font-semibold text-[rgb(var(--color-on-surface-rgb))] transition duration-200 hover:bg-[rgb(var(--color-surface-border-rgb))] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-on-surface-muted-rgb))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))]" aria-label="Reset Form">
                                <motion.span whileTap={{ rotate: -90 }} whileHover={{ rotate: -15 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }} className="mr-2 inline-block"> <ArrowPathIcon /> </motion.span>
                                Reset
                            </motion.button>
                        </TooltipWrapper>
                    </div>

                    <AnimatePresence>
                        {activeSite && !error && !loading && hasResults && <StatusMessage type="info">Showing result for: <span className="font-medium">{activeSite}</span></StatusMessage>}
                        {error && error.toLowerCase().includes('warning') && <StatusMessage type="warning">{error}</StatusMessage>}
                        {error && !error.toLowerCase().includes('warning') && <StatusMessage type="error">{error}</StatusMessage>}
                    </AnimatePresence>

                    {shouldShowPreviewSection && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-[rgb(var(--color-on-surface-muted-rgb))]">Preview</h3>
                            <ImagePreview
                                originalUrl={imageUrl}
                                title={imageTitle}
                                isLoading={loading && !imageUrl && !error}
                                enableImagePreviews={settings.enableImagePreviews}
                            />
                        </div>
                    )}

                    <AnimatePresence>
                        {!loading && hasResults && (
                            <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.4 }}>
                                {totalExtractedTagCount > 0 && (
                                    <div className="rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] p-4">
                                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                                            <h3 className="text-sm font-semibold text-[rgb(var(--color-on-surface-rgb))]">Filter Categories</h3>
                                            <div className="flex shrink-0 space-x-2">
                                                {!areAllCategoriesEnabled && (<motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleAllCategories(true)} className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900" aria-label="Select All Categories">All</motion.button>)}
                                                {!areAllCategoriesDisabled && (<motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleAllCategories(false)} className="rounded-md bg-[rgb(var(--color-surface-border-rgb))] px-2.5 py-1 text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))] transition-colors hover:bg-gray-300 dark:hover:bg-gray-500" aria-label="Clear All Tag Categories">None</motion.button>)}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                                            {DEFAULT_TAG_CATEGORIES.map((categoryDef) => {
                                                const categoryOption = tagCategories.find(c => c.id === categoryDef.id) ?? categoryDef;
                                                const count = tagCounts[categoryOption.id] || 0;
                                                if (count > 0 || DEFAULT_TAG_CATEGORIES.some(def => def.id === categoryOption.id)) {
                                                    return (<CategoryToggle key={categoryOption.id} category={categoryOption} count={count} onToggle={() => toggleTagCategory(categoryOption.id)} />);
                                                }
                                                return null;
                                            })}
                                        </div>
                                    </div>
                                )}
                                {totalExtractedTagCount > 0 && (
                                    <div className="space-y-3">
                                        <div>
                                            <label htmlFor="tags" className="mb-1.5 block text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]">Filtered Tags ({displayedTags ? displayedTags.split(',').filter(t => t.trim()).length : 0})</label>
                                            <textarea id="tags" rows={isMobile ? 5 : 4} className="w-full appearance-none rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] px-4 py-2.5 text-sm text-[rgb(var(--color-on-surface-rgb))] transition duration-200 focus:border-transparent focus:outline-hidden focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]" readOnly value={displayedTags || "No tags match selected categories."} aria-label="Extracted and filtered tags" />
                                        </div>
                                        <motion.button
                                            whileTap={{ scale: 0.97 }} onClick={handleCopy} disabled={!displayedTags || copySuccess}
                                            className={`w-full inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-semibold shadow-xs transition-all duration-300 hover:shadow-md focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:shadow-none focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))] ${copySuccess ? 'cursor-default bg-[rgb(var(--color-success-rgb))] text-[rgb(var(--color-success-content-rgb))] focus-visible:ring-[rgb(var(--color-success-rgb))] disabled:opacity-100' : 'bg-[rgb(var(--color-on-surface-rgb))] text-[rgb(var(--color-surface-rgb))] hover:opacity-90 focus-visible:ring-[rgb(var(--color-on-surface-muted-rgb))] disabled:cursor-not-allowed disabled:opacity-50 dark:text-[rgb(var(--color-surface-alt-rgb))]'}`}
                                            aria-label={copySuccess ? "Tags Copied" : "Copy Filtered Tags"}
                                        >
                                            <motion.div className="inline-flex items-center justify-center overflow-hidden" style={{ width: '1.25rem', height: '1.25rem' }}>
                                                <AnimatePresence mode="popLayout" initial={false}>
                                                    {copySuccess ? (
                                                        <motion.span key="check" initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} transition={{ duration: 0.2 }} className="flex items-center" > <CheckCircleIcon /> </motion.span>
                                                    ) : (
                                                        <motion.span key="clipboard" initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} transition={{ duration: 0.2 }} className="flex items-center" > <ClipboardIcon /> </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                            <span className="ml-2">{copySuccess ? 'Copied!' : 'Copy Tags'}</span>
                                        </motion.button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {history.length > 0 && (
                         <HistoryPanel
                             history={history}
                             onLoadEntry={handleLoadHistoryEntry}
                             onDeleteEntry={handleDeleteHistoryEntry}
                             onClearHistory={handleClearHistory}
                             enableImagePreviews={settings.enableImagePreviews}
                         />
                     )}

                </div>

                <div className="shrink-0 border-t border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] p-4 text-center text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
                    <p>Made with <span className="animate-heartBeat mx-0.5 inline-block text-red-500 dark:text-red-400">❤️</span> by <a href="https://x.com/ireddragonicy" target="_blank" rel="noopener noreferrer" className="font-medium underline transition-colors hover:text-[rgb(var(--color-primary-rgb))]">IRedDragonICY</a></p>
                    <p className="mt-1 text-[10px] text-[rgb(var(--color-on-surface-faint-rgb))]">
                        {settings.fetchMode === 'server'
                            ? 'Using Server Proxy. Respect source site ToS.'
                            : `Using Client Proxy (${getSelectedProxyLabel()}). Respect source site ToS & proxy usage policy.`
                        }
                        {' '}History saving is {settings.saveHistory ? 'enabled' : 'disabled'}.
                    </p>
                </div>
            </MotionCard>

            <SettingsModal isOpen={showSettings} onClose={handleCloseSettings} settings={settings} onSettingsChange={handleSettingsChange} />
        </div>
    );
};

export default BooruTagExtractor;