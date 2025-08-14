// page.tsx
'use client';

import { hexToRgb, getContrastColor, adjustRgb } from './utils/colors';
import { BOORU_SITES, DEFAULT_TAG_CATEGORIES, type TagCategoryOption, type ExtractionResult, type TagCategory, type BooruSite, API_ROUTE_URL } from './utils/extractionUtils';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { AnimatedIcon } from './components/AnimatedIcon';
import { SettingsModal } from './components/SettingsModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import {
  CogIcon, ClipboardIcon, CheckCircleIcon, ArrowPathIcon, XMarkIcon, TrashIcon, ArrowUpOnSquareIcon, PhotoIcon, ArrowDownTrayIcon, TagIcon
} from './components/icons/icons';
import { TooltipWrapper } from './components/TooltipWrapper';
import { ImagePreview } from './components/ImagePreview';
import ExtractorHeader from './components/ExtractorHeader';
import FilteredTagsPanel from './components/FilteredTagsPanel';
import PreviewSection from './components/PreviewSection';
import CategoryToggle from './components/CategoryToggle';
import { StatusMessage } from './components/StatusMessage';
import { HistoryPanelBase } from './components/HistoryPanel';
import { ParameterItem } from './components/ParameterItem';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DesktopSideNav } from './components/DesktopSideNav';
import { HistoryItem as HistoryItemComponent } from './components/HistoryList';
import type { Settings, ThemePreference, ColorTheme, FetchMode, ActiveView } from './types/settings';
import type { ImageMetadata } from './utils/imageMetadata';
import { MAX_IMAGE_SIZE_BYTES } from './utils/imageMetadata';

interface ClientProxyOption { id: string; label: string; value: string; }
 
interface CopyStatus { positive?: boolean; negative?: boolean; parameters?: boolean; }
interface HistoryEntry { id: string; url: string; tags: Partial<Record<TagCategory, string[]>>; imageUrl?: string; title?: string; siteName?: string; timestamp: number; }
interface ImageHistoryEntry { id: string; fileName: string; imageData: ImageMetadata; timestamp: number; previewUrl?: string; }
interface StoredHistoryItem { id: string; url: string; tags?: Partial<Record<TagCategory, string[]>>; imageUrl?: string; title?: string; siteName?: string; timestamp: number; }
interface StoredImageHistoryItem { id: string; fileName: string; imageData?: ImageMetadata; timestamp: number; previewUrl?: string; }
interface ApiExtractionResponse extends Omit<ExtractionResult, 'tags'> { siteName: string; tags?: Partial<Record<TagCategory, string[]>>; error?: string; status?: number; html?: string; }
interface HistoryItemProps { entry: HistoryEntry; onLoad: (entry: HistoryEntry) => void; onDelete: (id: string) => void; enableImagePreviews: boolean; }
interface ImageHistoryItemProps { entry: ImageHistoryEntry; onLoad: (entry: ImageHistoryEntry) => void; onDelete: (id: string) => void; }

// HistoryPanel types moved to components/HistoryPanel

const THEME_STORAGE_KEY = 'booruExtractorThemePref';
const COLOR_THEME_STORAGE_KEY = 'booruExtractorColorThemePref';
const CUSTOM_COLOR_HEX_STORAGE_KEY = 'booruExtractorCustomColorHexPref';
const AUTO_EXTRACT_STORAGE_KEY = 'booruExtractorAutoExtractPref';
const IMAGE_PREVIEWS_STORAGE_KEY = 'booruExtractorImagePreviewsPref';
const FETCH_MODE_STORAGE_KEY = 'booruExtractorFetchModePref';
const CLIENT_PROXY_URL_STORAGE_KEY = 'booruExtractorClientProxyUrlPref';
const SAVE_HISTORY_STORAGE_KEY = 'booruExtractorSaveHistoryPref';
const MAX_HISTORY_SIZE_STORAGE_KEY = 'booruExtractorMaxHistorySizePref';
 const UNSUPPORTED_SITES_STORAGE_KEY = 'booruExtractorUnsupportedSitesPref';
 const BLACKLIST_ENABLED_STORAGE_KEY = 'booruExtractorBlacklistEnabledPref';
 const BLACKLIST_KEYWORDS_STORAGE_KEY = 'booruExtractorBlacklistKeywordsPref';
const HISTORY_STORAGE_KEY = 'booruExtractorHistory';
const IMAGE_HISTORY_STORAGE_KEY = 'booruExtractorImageHistory';
const DEFAULT_COLOR_THEME: ColorTheme = 'blue';
const DEFAULT_CUSTOM_COLOR_HEX = '#3B82F6';
const DEFAULT_FETCH_MODE: FetchMode = 'server';
 const DEFAULT_MAX_HISTORY_SIZE = 30;
 const DEFAULT_BLACKLIST_ENABLED = true;
 const DEFAULT_BLACKLIST_KEYWORDS = [
   'text',
   'english text',
   'japanese text',
   'chinese text',
   'korean text',
   'copyright',
   'copyright name',
   'character name',
   'signature',
   'watermark',
   'logo',
   'subtitle',
   'subtitles',
   'caption',
   'captions',
   'speech bubble',
   'words',
   'letters'
 ].join(', ');
const FETCH_TIMEOUT_MS = 25000;
const THUMBNAIL_SIZE = 40;

const CLIENT_PROXY_OPTIONS: ClientProxyOption[] = [
    { id: 'allorigins', label: 'AllOrigins', value: 'https://api.allorigins.win/get?url=' },
    { id: 'thingproxy', label: 'ThingProxy', value: 'https://thingproxy.freeboard.io/fetch/' },
    { id: 'codetabs', label: 'CodeTabs', value: 'https://api.codetabs.com/v1/proxy?quest=' },
];
const DEFAULT_CLIENT_PROXY_URL = CLIENT_PROXY_OPTIONS[0].value;

const calculateTotalTags = (tags: Partial<Record<TagCategory, string[]>>): number => Object.values(tags || {}).reduce((sum, arr) => sum + (arr?.length ?? 0), 0);

const MotionCard = motion.div;

const HistoryItem = React.memo(HistoryItemComponent);
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

// HistoryPanelBase moved to components/HistoryPanel

// ParameterItem moved to components/ParameterItem

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
 const [settings, setSettings] = useState<Settings>({ theme: 'system', autoExtract: true, colorTheme: DEFAULT_COLOR_THEME, customColorHex: DEFAULT_CUSTOM_COLOR_HEX, enableImagePreviews: true, fetchMode: DEFAULT_FETCH_MODE, clientProxyUrl: DEFAULT_CLIENT_PROXY_URL, saveHistory: false, maxHistorySize: DEFAULT_MAX_HISTORY_SIZE, enableUnsupportedSites: false, enableBlacklist: DEFAULT_BLACKLIST_ENABLED, blacklistKeywords: DEFAULT_BLACKLIST_KEYWORDS });
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

    const handleLocationChange = useCallback(() => {
        const currentPath = window.location.pathname;
        if (currentPath === '/image-metadata') {
            setActiveView('image');
        } else {
            setActiveView('extractor');
            if (currentPath !== '/booru-tag') {
                window.history.replaceState(null, '', '/booru-tag');
            }
        }
    }, [setActiveView]);

    useEffect(() => {
        handleLocationChange();
        window.addEventListener('popstate', handleLocationChange);
        return () => {
            window.removeEventListener('popstate', handleLocationChange);
        };
    }, [handleLocationChange]);

    useEffect(() => {
        const currentPath = window.location.pathname;
        let targetPath: string;

        if (activeView === 'extractor') {
            targetPath = '/booru-tag';
        } else {
            targetPath = '/image-metadata';
        }

        if (currentPath !== targetPath) {
            window.history.pushState(null, '', targetPath);
        }
    }, [activeView]);

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
             enableUnsupportedSites: loadStoredItem<boolean>(UNSUPPORTED_SITES_STORAGE_KEY, false),
             enableBlacklist: loadStoredItem<boolean>(BLACKLIST_ENABLED_STORAGE_KEY, DEFAULT_BLACKLIST_ENABLED),
             blacklistKeywords: loadStoredItem<string>(BLACKLIST_KEYWORDS_STORAGE_KEY, DEFAULT_BLACKLIST_KEYWORDS),
        });
        setHistory(loadStoredItem<HistoryEntry[]>(HISTORY_STORAGE_KEY, [], isValidHistory).map(i => ({ ...i, tags: i.tags ?? {} })).sort((a, b) => b.timestamp - a.timestamp));
        setImageHistory(loadStoredItem<ImageHistoryEntry[]>(IMAGE_HISTORY_STORAGE_KEY, [], isValidImageHistory).map(i => ({ ...i, imageData: i.imageData ?? {} })).sort((a, b) => b.timestamp - a.timestamp));
        if (typeof window !== 'undefined') setIsMobile(window.innerWidth < 768);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return; const root = window.document.documentElement; const isDark = settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches); root.classList.toggle('dark', isDark); root.dataset.colorTheme = settings.colorTheme;
         if (settings.colorTheme === 'custom' && settings.customColorHex) { const rgb = hexToRgb(settings.customColorHex); if (rgb) { const p = `${rgb.r} ${rgb.g} ${rgb.b}`; const f = isDark ? 1.2 : 0.85; const focus = adjustRgb(rgb.r, rgb.g, rgb.b, f); const content = getContrastColor(rgb.r, rgb.g, rgb.b); root.style.setProperty('--custom-primary-rgb', p); root.style.setProperty('--custom-primary-focus-rgb', focus); root.style.setProperty('--custom-primary-content-rgb', content); } else { ['--custom-primary-rgb', '--custom-primary-focus-rgb', '--custom-primary-content-rgb'].forEach(p => root.style.removeProperty(p)); } } else { ['--custom-primary-rgb', '--custom-primary-focus-rgb', '--custom-primary-content-rgb'].forEach(p => root.style.removeProperty(p)); }
         Object.entries(settings).forEach(([key, value]) => { const storageKeyMap: Record<string, string> = { theme: THEME_STORAGE_KEY, colorTheme: COLOR_THEME_STORAGE_KEY, customColorHex: CUSTOM_COLOR_HEX_STORAGE_KEY, autoExtract: AUTO_EXTRACT_STORAGE_KEY, enableImagePreviews: IMAGE_PREVIEWS_STORAGE_KEY, fetchMode: FETCH_MODE_STORAGE_KEY, clientProxyUrl: CLIENT_PROXY_URL_STORAGE_KEY, saveHistory: SAVE_HISTORY_STORAGE_KEY, maxHistorySize: MAX_HISTORY_SIZE_STORAGE_KEY, enableUnsupportedSites: UNSUPPORTED_SITES_STORAGE_KEY, enableBlacklist: BLACKLIST_ENABLED_STORAGE_KEY, blacklistKeywords: BLACKLIST_KEYWORDS_STORAGE_KEY }; const storageKey = storageKeyMap[key]; if (storageKey) { if (key === 'customColorHex' && !value) localStorage.removeItem(storageKey); else localStorage.setItem(storageKey, JSON.stringify(value)); } });
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)'); const handleChange = (e: MediaQueryListEvent) => { if (settings.theme === 'system') { const sysDark = e.matches; root.classList.toggle('dark', sysDark); if (settings.colorTheme === 'custom' && settings.customColorHex) { const rgb = hexToRgb(settings.customColorHex); if (rgb) { const f = sysDark ? 1.2 : 0.85; const focus = adjustRgb(rgb.r, rgb.g, rgb.b, f); const content = getContrastColor(rgb.r, rgb.g, rgb.b); root.style.setProperty('--custom-primary-focus-rgb', focus); root.style.setProperty('--custom-primary-content-rgb', content); } } } };
        if (settings.theme === 'system') mediaQuery.addEventListener('change', handleChange); return () => mediaQuery.removeEventListener('change', handleChange);
    }, [settings]);

    useEffect(() => { if (typeof window === 'undefined') return; const checkMobile = () => setIsMobile(window.innerWidth < 768); checkMobile(); window.addEventListener('resize', checkMobile); return () => window.removeEventListener('resize', checkMobile); }, []);
     useEffect(() => {
         const enabled = new Set(tagCategories.filter(c => c.enabled).map(c => c.id));
         const filteredTags: string[] = [];

         const parseKeywords = (input: string): string[] => input
             .split(/[\n,;]+/)
             .map(k => k.trim().toLowerCase())
             .filter(Boolean);

         const keywords = settings.enableBlacklist ? parseKeywords(settings.blacklistKeywords || DEFAULT_BLACKLIST_KEYWORDS) : [];

         const isBlacklisted = (tag: string): boolean => {
             if (!keywords.length) return false;
             const normalized = tag.toLowerCase().replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
             const tokens = new Set(normalized.split(' '));
             for (const kw of keywords) {
                 if (kw.includes(' ')) {
                     if (normalized.includes(kw)) return true;
                 } else if (tokens.has(kw)) {
                     return true;
                 }
             }
             return false;
         };

         DEFAULT_TAG_CATEGORIES.forEach(c => {
             const arr = allExtractedTags[c.id];
             if (enabled.has(c.id) && arr && arr.length) {
                 filteredTags.push(
                     ...arr.filter(t => !isBlacklisted(t)).map(t => t.replace(/_/g, ' '))
                 );
             }
         });

         setDisplayedTags(filteredTags.join(', '));
     }, [allExtractedTags, tagCategories, settings.enableBlacklist, settings.blacklistKeywords]);
    const saveHistoryToLocalStorage = useCallback((data: HistoryEntry[]) => { try { if (data.length > 0) localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(data)); else localStorage.removeItem(HISTORY_STORAGE_KEY); } catch (e) { console.error("Save tag history failed:", e); if (e instanceof Error && e.message.toLowerCase().includes('quota')) setError("History storage limit."); } }, []);
    const saveImageHistoryToLocalStorage = useCallback((data: ImageHistoryEntry[]) => { try { if (data.length > 0) localStorage.setItem(IMAGE_HISTORY_STORAGE_KEY, JSON.stringify(data)); else localStorage.removeItem(IMAGE_HISTORY_STORAGE_KEY); } catch (e) { console.error("Save image history failed:", e); if (e instanceof Error && e.message.toLowerCase().includes('quota')) { setImageError("Image history storage limit."); setTimeout(() => setImageError(null), 3000); } } }, []);
    const tagCounts = useMemo(() => Object.entries(allExtractedTags).reduce((acc, [cat, tags]) => { if (tags) acc[cat as TagCategory] = tags.length; return acc; }, {} as Record<TagCategory, number>), [allExtractedTags]);
    const totalExtractedTagCount = useMemo(() => calculateTotalTags(allExtractedTags), [allExtractedTags]);
    const findSimilarSite = useCallback((url: string): BooruSite | null => {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname;

            if (hostname.endsWith('donmai.us')) {
                const danbooruSite = BOORU_SITES.find(s => s.name === 'Danbooru');
                if (danbooruSite) {
                    console.log(`Using Danbooru strategy for unsupported donmai.us subdomain: ${hostname}`);
                    return danbooruSite;
                }
            }
            return null;
        } catch (e) {
            console.error("Error parsing URL for similar site detection:", e);
            return null;
        }
    }, []);

    const extractTags = useCallback(async (targetUrl: string) => {
        const trimmedUrl = targetUrl.trim();
        if (!trimmedUrl || loading || trimmedUrl === currentExtractionUrl.current) return;

        let site = BOORU_SITES.find(s => s.urlPattern.test(trimmedUrl));

        if (!site && settings.enableUnsupportedSites) {
            const similarSite = findSimilarSite(trimmedUrl);
            if (similarSite) {
                site = similarSite;
                console.log(`Using ${site!.name} extraction strategy for unsupported site: ${trimmedUrl}`);
            }
        }

        if (!site) {
            setError('URL not supported.');
            setAllExtractedTags({});
            setImageUrl(undefined);
            setImageTitle(undefined);
            setActiveSite(null);
            currentExtractionUrl.current = null;
            return;
        }
        setLoading(true); setError(''); setAllExtractedTags({}); setImageUrl(undefined); setImageTitle(undefined); setDisplayedTags(''); setActiveSite(site.name); setCopySuccess(false); currentExtractionUrl.current = trimmedUrl; const controller = new AbortController(); const fetchTimeout = FETCH_TIMEOUT_MS + (settings.fetchMode === 'server' ? 2000 : 0); const timeoutId = setTimeout(() => controller.abort(), fetchTimeout); let proxyUsed = ''; let selectedProxy: ClientProxyOption | undefined;
        try {
            let result: ExtractionResult = { tags: {} }; let errorMsg: string | null = null; let siteName = site.name; let imgUrl: string | undefined = undefined; let imgTitle: string | undefined = undefined;
            if (settings.fetchMode === 'server') {
                proxyUsed = 'Server';
                const response = await fetch(API_ROUTE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ targetUrl: trimmedUrl }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                let data: ApiExtractionResponse = {} as ApiExtractionResponse;
                let rawBody = '';
                try {
                    rawBody = await response.text();
                    data = rawBody ? (JSON.parse(rawBody) as ApiExtractionResponse) : ({} as ApiExtractionResponse);
                } catch {
                    data = { error: rawBody?.slice(0, 200) || undefined } as ApiExtractionResponse;
                }
                const tags = data.tags || {};
                const tagCount = calculateTotalTags(tags);
                if (!response.ok || data.error) {
                    let apiError = data.error || `API Error: ${response.status}`;
                    if (response.status === 504) apiError = 'Server timed out.';
                    else if (response.status === 502) apiError = `Server bad gateway. ${data.error || ''}`.trim();
                    else if (response.status === 400) apiError = `Invalid request: ${data.error || ''}`.trim();
                    else if (response.status === 422) apiError = `${data.error || 'Extraction failed.'}`;
                    else if (response.status === 500) apiError = `Internal Server Error: ${data.error || ''}`.trim();
                    if (!(data.error?.toLowerCase().includes('warning') && tagCount > 0)) {
                        errorMsg = apiError;
                        siteName = '';
                    } else {
                        result = { tags, imageUrl: data.imageUrl, title: data.title };
                        errorMsg = apiError;
                        siteName = data.siteName;
                        imgUrl = data.imageUrl;
                        imgTitle = data.title;
                    }
                } else {
                    result = { tags, imageUrl: data.imageUrl, title: data.title };
                    siteName = data.siteName;
                    imgUrl = data.imageUrl;
                    imgTitle = data.title;
                    if (data.error?.toLowerCase().includes('warning')) errorMsg = data.error;
                    else if (tagCount === 0 && data.imageUrl) errorMsg = `Warning: Image found, no tags extracted.`;
                }
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
    }, [loading, settings.fetchMode, settings.clientProxyUrl, settings.saveHistory, settings.maxHistorySize, settings.enableUnsupportedSites, findSimilarSite, saveHistoryToLocalStorage]);

    const handleReset = useCallback(() => { setUrl(''); setAllExtractedTags({}); setImageUrl(undefined); setImageTitle(undefined); setDisplayedTags(''); setError(''); setActiveSite(null); setTagCategories(DEFAULT_TAG_CATEGORIES); setCopySuccess(false); setLoading(false); currentExtractionUrl.current = null; if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); cardBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

    useEffect(() => {
        if (activeView !== 'extractor' || !settings.autoExtract) { if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); return; }
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); const trimmedUrl = url.trim();
        if (trimmedUrl && trimmedUrl.includes('.') && trimmedUrl.length > 10 && trimmedUrl.startsWith('http')) {
            const isSupported = BOORU_SITES.some(s => s.urlPattern.test(trimmedUrl));
            const canUseSimilarSite = settings.enableUnsupportedSites && !isSupported && findSimilarSite(trimmedUrl) !== null;
            if (isSupported || canUseSimilarSite) {
                if (trimmedUrl !== currentExtractionUrl.current) {
                    debounceTimeoutRef.current = setTimeout(() => {
                        const currentInputVal = (document.getElementById('url') as HTMLInputElement | null)?.value.trim();
                        if (currentInputVal !== undefined && trimmedUrl === currentInputVal && trimmedUrl !== currentExtractionUrl.current)
                            void extractTags(trimmedUrl);
                    }, 750);
                }
            } else if (trimmedUrl !== currentExtractionUrl.current) {
                setError('URL not supported.');
            }
        }
        else if (!trimmedUrl && currentExtractionUrl.current) handleReset(); else if (trimmedUrl && !trimmedUrl.startsWith('http')) { if (trimmedUrl !== currentExtractionUrl.current) setError('URL must start with http:// or https://'); }
        else if (trimmedUrl && trimmedUrl !== currentExtractionUrl.current) setError(''); return () => { if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); };
    }, [url, extractTags, settings.autoExtract, settings.enableUnsupportedSites, findSimilarSite, handleReset, activeView]);

    useEffect(() => {
         const handlePaste = (event: ClipboardEvent) => {
             if (activeView !== 'extractor') return;
             const pastedText = event.clipboardData?.getData('text')?.trim();
             if (pastedText && pastedText.startsWith('http')) {
                 if (document.activeElement?.id !== 'url') {
                     setUrl(pastedText);
                 }
             }
         };
         window.addEventListener('paste', handlePaste);
         return () => window.removeEventListener('paste', handlePaste);
     }, [activeView, setUrl]);

    const handleCopy = useCallback(async () => { if (!displayedTags) return; try { await navigator.clipboard.writeText(displayedTags); setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000); } catch (err) { console.error('Copy failed:', err); setError("Failed to copy."); } }, [displayedTags]);

    useEffect(() => {
        const handleGlobalCopyKeyboard = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c') {
                const activeEl = document.activeElement;
                if (activeEl && (
                    activeEl.tagName === 'INPUT' ||
                    activeEl.tagName === 'TEXTAREA' ||
                    (activeEl instanceof HTMLElement && activeEl.isContentEditable)
                )) {
                    return;
                }

                if (activeView !== 'extractor' || !displayedTags.trim()) {
                    return;
                }

                handleCopy().catch(err => console.error("Global copy shortcut failed:", err));
                event.preventDefault();
            }
        };

        window.addEventListener('keydown', handleGlobalCopyKeyboard);
        return () => {
            window.removeEventListener('keydown', handleGlobalCopyKeyboard);
        };
    }, [activeView, displayedTags, handleCopy]);

    const handleSettingsChange = useCallback((newSettings: Partial<Settings>) => setSettings(prev => ({ ...prev, ...newSettings })), []);
    const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value), []);
    const handleManualExtract = useCallback(() => { if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); currentExtractionUrl.current = null; void extractTags(url.trim()); }, [extractTags, url]);
    const toggleTagCategory = useCallback((id: TagCategory) => setTagCategories(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c)), []);
    const toggleAllCategories = useCallback((enabled: boolean) => setTagCategories(prev => prev.map(c => ({ ...c, enabled }))), []);
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
    const navButtonClass = (isActive: boolean) => `group relative overflow-hidden rounded-2xl h-12 md:h-12 w-full md:w-12 flex-1 md:flex-none flex items-center justify-center transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary-rgb))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))] ${isActive ? 'text-[rgb(var(--color-primary-rgb))] bg-[rgba(var(--color-primary-rgb),0.15)] ring-1 ring-[rgb(var(--color-primary-rgb))]/40 shadow-sm' : 'text-[rgb(var(--color-on-surface-muted-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))] hover:text-[rgb(var(--color-on-surface-rgb))]'}`;
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
            <div className="flex items-start md:flex-row flex-col mx-auto relative">
                <DesktopSideNav active={activeView} highlightSettings={showSettings} onSelectExtractor={() => setActiveView('extractor')} onSelectImage={() => setActiveView('image')} onOpenSettings={handleOpenSettings} />
                 <div className="relative z-10 flex w-full max-w-xl flex-col overflow-hidden rounded-xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] shadow-lg max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] pb-20 md:pb-0" onDragOver={activeView === 'extractor' ? handleDragOver : handleImageDragOver} onDragLeave={activeView === 'extractor' ? handleDragLeave : handleImageDragLeave} onDrop={activeView === 'extractor' ? handleDrop : handleImageDrop}>
                    <AnimatePresence>
                        {isDraggingOver && activeView === 'extractor' && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-xl border-2 border-dashed border-[rgb(var(--color-primary-rgb))] bg-[rgb(var(--color-primary-rgb))]/20 backdrop-blur-xs"><div className="rounded-lg bg-[rgb(var(--color-primary-rgb))]/80 px-4 py-2 text-center text-[rgb(var(--color-primary-content-rgb))] shadow-sm"><ArrowDownTrayIcon className="mx-auto mb-1 h-8 w-8"/><p className="font-semibold">Drop URL</p></div></motion.div>)}
                        {isDraggingOverImage && activeView === 'image' && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center rounded-xl border-2 border-dashed border-[rgb(var(--color-primary-rgb))] bg-[rgb(var(--color-primary-rgb))]/20 backdrop-blur-xs"><div className="rounded-lg bg-[rgb(var(--color-primary-rgb))]/80 px-4 py-2 text-center text-[rgb(var(--color-primary-content-rgb))] shadow-sm"><ArrowDownTrayIcon className="mx-auto mb-1 h-8 w-8"/><p className="font-semibold">Drop PNG</p></div></motion.div>)}
                    </AnimatePresence>
                    <AnimatePresence mode="wait">
                        {activeView === 'extractor' ? (
                            <motion.div key="extractor-view" className="flex flex-col flex-1 overflow-hidden" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                                <ExtractorHeader activeSite={activeSite} url={url} onUrlChange={handleUrlChange} onExtract={handleManualExtract} onReset={handleReset} loading={loading} />
                  {/* Mobile bottom navigation */}
                  {isMobile && (
                    <MobileBottomNav
                      active={activeView}
                      onSelectExtractor={() => setActiveView('extractor')}
                      onSelectImage={() => setActiveView('image')}
                      onOpenSettings={handleOpenSettings}
                      highlightSettings={showSettings}
                    />
                  )}
            
                                <div ref={cardBodyRef} className="flex-grow space-y-6 overflow-y-auto p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]">
                                    <AnimatePresence mode='wait'>
                                        {activeSite && !error && !loading && hasResults && <StatusMessage type="info">Result for: <span className="font-medium">{activeSite}</span></StatusMessage>}
                                        {error && (error.toLowerCase().includes('warning') ? <StatusMessage type="warning">{error}</StatusMessage> : <StatusMessage type="error">{error}</StatusMessage>)}
                                    </AnimatePresence>
                                    <PreviewSection title="Preview" show={!!shouldShowPreviewSection} imageUrl={imageUrl} imageTitle={imageTitle} loading={loading} error={error || undefined} />

                                    <AnimatePresence>
                                        {!loading && hasResults && totalExtractedTagCount > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.1, duration: 0.4 }}
                                            >
                                                <div className="rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] p-4">
                                                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-semibold">Filter Categories</h3><div className="flex shrink-0 space-x-2">{!areAllCategoriesEnabled && (<motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleAllCategories(true)} className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900" aria-label="All">All</motion.button>)}{!areAllCategoriesDisabled && (<motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleAllCategories(false)} className="rounded-md bg-[rgb(var(--color-surface-border-rgb))] px-2.5 py-1 text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-gray-300 dark:hover:bg-gray-500" aria-label="None">None</motion.button>)}</div></div>
                                                    <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">{DEFAULT_TAG_CATEGORIES.map(catDef => { const catOpt = tagCategories.find(c => c.id === catDef.id) ?? catDef; const count = tagCounts[catOpt.id] || 0; if (count > 0 || DEFAULT_TAG_CATEGORIES.some(d => d.id === catOpt.id)) return <CategoryToggle key={catOpt.id} category={catOpt} count={count} onToggle={() => toggleTagCategory(catOpt.id)} />; return null; })}</div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    {settings.saveHistory && history.length > 0 && (<HistoryPanelBase title="Extraction History" history={history} renderItem={renderHistoryItem} filterPredicate={extractionFilterPredicate} searchPlaceholder="Search title, url, tags..." onClearHistory={handleClearHistory} />)}
                                </div>

                                <AnimatePresence>
                                    {!loading && hasResults && totalExtractedTagCount > 0 && (
                                        <FilteredTagsPanel displayedTags={displayedTags} isMobile={isMobile} onCopy={handleCopy} copySuccess={copySuccess} />
                                    )}
                                </AnimatePresence>

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
                                     <p>PNG metadata extraction for &rsquo;parameters&apos; text chunk.</p>
                                      <p className="mt-1 text-[10px] text-[rgb(var(--color-on-surface-faint-rgb))]">History {settings.saveHistory ? `enabled (${historySizeDisplay})` : 'disabled'}.</p>
                                 </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                 </div>
            </div>
            {/* Mobile bottom navigation */}
            {isMobile && (
                <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] backdrop-blur-md" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                    <div className="mx-auto max-w-xl">
                        <div className="grid grid-cols-3 gap-1 p-1">
                            <button
                                onClick={() => setActiveView('extractor')}
                                className={`group relative flex items-center justify-center rounded-xl px-3 py-2 transition-all ${activeView === 'extractor' ? 'text-[rgb(var(--color-primary-rgb))] bg-[rgba(var(--color-primary-rgb),0.12)]' : 'text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'}`}
                                aria-label="Tag Extractor"
                                aria-current={activeView === 'extractor' ? 'page' : undefined}
                            >
                                <TagIcon />
                                <span className="ml-2 text-xs font-medium">Tags</span>
                                <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity" />
                            </button>
                            <button
                                onClick={() => setActiveView('image')}
                                className={`group relative flex items-center justify-center rounded-xl px-3 py-2 transition-all ${activeView === 'image' ? 'text-[rgb(var(--color-primary-rgb))] bg-[rgba(var(--color-primary-rgb),0.12)]' : 'text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'}`}
                                aria-label="Image Metadata"
                                aria-current={activeView === 'image' ? 'page' : undefined}
                            >
                                <PhotoIcon className="h-5 w-5" />
                                <span className="ml-2 text-xs font-medium">Image</span>
                                <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity" />
                            </button>
                            <button
                                onClick={handleOpenSettings}
                                className={`group relative flex items-center justify-center rounded-xl px-3 py-2 transition-all ${showSettings ? 'text-[rgb(var(--color-primary-rgb))] bg-[rgba(var(--color-primary-rgb),0.12)]' : 'text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'}`}
                                aria-label="Settings"
                            >
                                <CogIcon />
                                <span className="ml-2 text-xs font-medium">Settings</span>
                                <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity" />
                            </button>
                        </div>
                    </div>
                </nav>
            )}
            <SettingsModal isOpen={showSettings} onClose={handleCloseSettings} settings={settings} onSettingsChange={handleSettingsChange} />
        </div>
    );
};
export default BooruTagExtractor;