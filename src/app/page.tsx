// src/app/page.tsx (atau file komponen Anda)
'use client';

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';

// --- Type Definitions ---
type TagCategory = 'copyright' | 'character' | 'general' | 'meta' | 'other';
type ThemePreference = 'system' | 'light' | 'dark';
type TagCategoryOption = { id: TagCategory; label: string; enabled: boolean; color: string; };
interface ExtractedTag { name: string; category: TagCategory; }
interface ExtractionResult { tags: ExtractedTag[]; imageUrl?: string; title?: string; }
interface Settings { theme: ThemePreference; autoExtract: boolean; }

// --- Local Storage Keys ---
const THEME_STORAGE_KEY = 'booruExtractorThemePref';
const AUTO_EXTRACT_STORAGE_KEY = 'booruExtractorAutoExtractPref';

// --- Utility Functions ---
const utils = {
    getCategoryFromClassList: (element: Element): TagCategory => {
        const classList = element.classList;
        if (classList.contains('tag-type-copyright') || classList.contains('tag-type-3')) return 'copyright';
        if (classList.contains('tag-type-character') || classList.contains('tag-type-4')) return 'character';
        if (classList.contains('tag-type-general') || classList.contains('tag-type-0')) return 'general';
        if (classList.contains('tag-type-metadata') || classList.contains('tag-type-5') || classList.contains('tag-type-meta')) return 'meta'; // Added tag-type-meta
        if (classList.contains('tag-type-artist') || classList.contains('tag-type-1')) return 'other'; // Artist still mapped to 'other' for simplicity unless specifically handled
        // Fallback check on parent if the direct element has no category (less common for 'byClass' usage)
        const parentCategoryElement = element.closest('[class*="tag-type-"]');
        if (parentCategoryElement && parentCategoryElement !== element) {
            return utils.getCategoryFromClassList(parentCategoryElement);
        }
        return 'general'; // Default to general if no specific category class found
    },
    getCategoryFromHeader: (text: string): TagCategory => {
        const normalized = text.toLowerCase().trim();
        if (normalized.includes('copyright')) return 'copyright';
        if (normalized.includes('character')) return 'character';
        if (normalized.includes('general')) return 'general';
        if (normalized.includes('meta') || normalized.includes('metadata')) return 'meta';
        if (normalized.includes('artist')) return 'other'; // Map artist to 'other' for consistency
        return 'other'; // Default if no keyword matches
    },
    cleanTagName: (tagName: string): string => {
        // Removes trailing counts like " (123)", " (1.2k)", " (3M)" and leading question marks
        return tagName.replace(/ \(\d+\.?\d*[kM]?\)$/, '').replace(/^\? /, '').trim();
    },
    extractTagsByClass: (doc: Document, selectors: { container: string, tag: string }): ExtractedTag[] => {
        const tags: ExtractedTag[] = [];
        const elements = doc.querySelectorAll(selectors.container);
        elements.forEach(element => {
            // Find the tag element *within* the current container element
            const tagElement = element.querySelector(selectors.tag);
            const tagName = tagElement?.textContent?.trim() || '';
            if (tagName) {
                const category = utils.getCategoryFromClassList(element); // Get category from the CONTAINER element's class
                const cleanName = utils.cleanTagName(tagName);
                // Basic filtering: ensure cleanName is not empty and not just a category name
                if (cleanName && !['copyrights', 'characters', 'general', 'meta', 'metadata', 'artists'].includes(cleanName.toLowerCase())) {
                    const tagIsCategoryName = cleanName.toLowerCase() === category;
                    if (!tagIsCategoryName) {
                        tags.push({ name: cleanName, category });
                    }
                }
            }
        });
        // Deduplicate based on name AND category
        return Array.from(new Map(tags.map(tag => [`${tag.category}-${tag.name}`, tag])).values());
    },
    extractTagsBySection: (doc: Document, selector: string, tagLinkSelector: string): ExtractedTag[] => {
        const tags: ExtractedTag[] = [];
        let currentCategory: TagCategory = 'other'; // Start with a default
        const container = doc.querySelector(selector);
        if (!container) return [];

        Array.from(container.children).forEach(child => {
            // Identify category headers
            if ((child.tagName === 'H3' || child.tagName === 'H6' || child.classList.contains('tag-type-header') || child.classList.contains('tag-sidebar-header') || (child.tagName === 'LI' && child.querySelector('h6'))) && child.textContent) {
                currentCategory = utils.getCategoryFromHeader(child.textContent);
            }
            // Process tag lists (UL)
            else if (child.tagName === 'UL') {
                Array.from(child.children).forEach(tagLi => {
                    if (tagLi.tagName === 'LI') {
                        let itemCategory = utils.getCategoryFromClassList(tagLi);
                        if (itemCategory === 'general' && currentCategory !== 'general') itemCategory = currentCategory;

                        const tagElement = tagLi.querySelector(tagLinkSelector);
                        const tagName = tagElement?.textContent?.trim();
                        if (tagName) {
                            const cleanName = utils.cleanTagName(tagName);
                            if (cleanName && cleanName.toLowerCase() !== 'tag list' && cleanName.toLowerCase() !== '?') {
                                tags.push({ name: cleanName, category: itemCategory });
                            }
                        }
                    }
                });
            }
            // Process direct tag list items (LI)
            else if (child.tagName === 'LI' && child.classList.contains('tag')) {
                let itemCategory = utils.getCategoryFromClassList(child);
                if (itemCategory === 'general' && currentCategory !== 'general') itemCategory = currentCategory;

                const tagElement = child.querySelector(tagLinkSelector);
                const tagName = tagElement?.textContent?.trim();
                if (tagName) {
                    const cleanName = utils.cleanTagName(tagName);
                    if (cleanName && cleanName.toLowerCase() !== 'tag list' && cleanName.toLowerCase() !== '?') {
                        tags.push({ name: cleanName, category: itemCategory });
                    }
                }
            }
        });
        // Deduplicate tags
        return Array.from(new Map(tags.map(tag => [`${tag.category}-${tag.name}`, tag])).values());
    },
    extractImageUrl: (doc: Document, selector: string, attribute: string = 'src'): string | undefined => {
        const imgElement = doc.querySelector(selector) as HTMLImageElement | HTMLVideoElement | HTMLElement;
        if (!imgElement) return undefined;
        let src = imgElement.getAttribute(attribute) || imgElement.getAttribute('src');
        if (imgElement.tagName === 'VIDEO' && !src) {
            const sourceElement = imgElement.querySelector('source');
            src = sourceElement?.src || null;
        }
        if (src && !src.startsWith('http') && !src.startsWith('//')) {
            try {
                const baseURI = doc.baseURI;
                if (baseURI) src = new URL(src, baseURI).href;
            } catch (e) { console.error("Error resolving relative image URL:", src, e); }
        }
        return src || undefined;
    },
    extractTitle: (doc: Document, selector: string): string | undefined => {
        let title: string | undefined | null;
        if (selector.startsWith('attr:')) {
            const attrName = selector.substring(5);
            const elementWithAttr = doc.querySelector(`[${attrName}]`);
            title = elementWithAttr?.getAttribute(attrName);
        } else {
            const titleElement = doc.querySelector(selector);
            title = titleElement?.textContent?.trim();
        }
        title = title || doc.title?.trim() || undefined;
        if (title) {
            title = title.replace(/ - (Danbooru|Safebooru|Gelbooru|Rule 34 -)/i, '').trim();
            title = title.replace(/ » /g, ' - ').trim();
            title = title.replace(/^Post #\d+ /i, '').trim();
            title = title.replace(/ - e621$/i, '').trim();
        }
        return title || undefined;
    }
};

// --- Extraction Strategies ---
const extractionStrategies = {
    danbooru: (doc: Document): ExtractionResult => ({
        tags: utils.extractTagsByClass(doc, { container: '#tag-list li[class*="tag-type-"]', tag: 'a.search-tag' }),
        imageUrl: utils.extractImageUrl(doc, '#image', 'src'),
        title: utils.extractTitle(doc, 'title')
    }),
    safebooru: (doc: Document): ExtractionResult => ({
        tags: utils.extractTagsByClass(doc, { container: '#tag-sidebar li[class*="tag-type-"].tag', tag: 'a[href*="page=post"]:last-of-type' }),
        imageUrl: utils.extractImageUrl(doc, '#image', 'src'),
        title: utils.extractTitle(doc, 'title')
    }),
    gelbooru: (doc: Document): ExtractionResult => ({
        tags: utils.extractTagsByClass(doc, { container: '.tag-list li[class*="tag-type-"], #tag-sidebar li[class*="tag-type-"]', tag: 'a[href*="page=post"]' }),
        imageUrl: utils.extractImageUrl(doc, '#image, #gelcomVideoPlayer source', 'src'),
        title: utils.extractTitle(doc, 'title')
    }),
    rule34: (doc: Document): ExtractionResult => ({
        tags: utils.extractTagsBySection(doc, '#tag-sidebar, .sidebar > div:last-of-type', 'a[href*="page=post"]'),
        imageUrl: utils.extractImageUrl(doc, '#image, #gelcomVideoPlayer source, video#videoelement source', 'src'),
        title: utils.extractTitle(doc, 'title')
    }),
    e621: (doc: Document): ExtractionResult => ({
        tags: utils.extractTagsByClass(doc, { container: '#tag-list section > ul > li[class*="tag-type-"]', tag: '.tag a span.tag-name, a.tag-name' }),
        imageUrl: utils.extractImageUrl(doc, '#image, #image-container img, #image-container video source', 'src'),
        title: utils.extractTitle(doc, 'attr:data-title') || utils.extractTitle(doc, '#image-container h5') || utils.extractTitle(doc, 'title')
    })
};

// --- Site Definitions ---
const BOORU_SITES = [
    { name: 'Danbooru', urlPattern: /danbooru\.donmai\.us\/posts\/\d+/i, extractTags: extractionStrategies.danbooru },
    { name: 'Safebooru', urlPattern: /safebooru\.org\/(index\.php\?page=post&s=view&id=\d+|post\/view\/\d+)/i, extractTags: extractionStrategies.safebooru },
    { name: 'Gelbooru', urlPattern: /gelbooru\.com\/index\.php\?page=post&s=view&id=\d+/i, extractTags: extractionStrategies.gelbooru },
    { name: 'Rule34', urlPattern: /rule34\.xxx\/index\.php\?page=post&s=view&id=\d+/i, extractTags: extractionStrategies.rule34 },
    { name: 'e621', urlPattern: /e621\.net\/posts\/\d+/i, extractTags: extractionStrategies.e621 }
];

// --- Default Categories ---
const DEFAULT_TAG_CATEGORIES: TagCategoryOption[] = [
    { id: 'copyright', label: 'Copyright', enabled: true, color: 'bg-pink-500' },
    { id: 'character', label: 'Character', enabled: true, color: 'bg-indigo-500' },
    { id: 'general', label: 'General', enabled: true, color: 'bg-blue-500' },
    { id: 'meta', label: 'Meta', enabled: true, color: 'bg-emerald-500' },
    { id: 'other', label: 'Other', enabled: true, color: 'bg-amber-500' }
];

// --- Icons --- (Keep existing icon components)
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>;
const ComputerDesktopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" /></svg>;
const CogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /></svg>;
const ClipboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const ArrowPathIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>;
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;

// --- UI Components --- (Keep existing UI components)
const MotionCard = motion.div;
const CategoryToggle = React.memo(({ category, count, onToggle }: { category: TagCategoryOption; count: number; onToggle: () => void }) => (
    <MotionCard
        className="flex items-center justify-between bg-gray-100 dark:bg-gray-700/60 p-3 rounded-lg shadow-sm transition-shadow hover:shadow-md"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}
    >
        <div className="flex items-center space-x-3 overflow-hidden">
            <span className={`inline-block w-3 h-3 rounded-full ${category.color} flex-shrink-0`}></span>
            <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-200" title={category.label}>{category.label}</span>
            {count > 0 && (<span className="text-xs bg-gray-300 dark:bg-gray-600 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300 flex-shrink-0">{count}</span>)}
        </div>
        <label className="inline-flex items-center cursor-pointer flex-shrink-0 ml-2">
            <input type="checkbox" className="sr-only peer" checked={category.enabled} onChange={onToggle} aria-labelledby={`category-label-${category.id}`}/>
            <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 dark:peer-focus:ring-offset-gray-800 peer-focus:ring-blue-500 ${category.enabled ? category.color : 'bg-gray-300 dark:bg-gray-600'}`}>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${category.enabled ? 'transform translate-x-5' : ''}`}></div>
            </div>
        </label>
        <span id={`category-label-${category.id}`} className="sr-only">{category.label} Toggle</span>
    </MotionCard>
));
CategoryToggle.displayName = 'CategoryToggle';
const StatusMessage = React.memo(({ type, children }: { type: 'info' | 'error', children: React.ReactNode }) => (
    <motion.div
        className={`border-l-4 p-4 rounded-md ${type === 'info' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500' : 'bg-red-50 dark:bg-red-900/30 border-red-500'}`}
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
    >
        <p className={`text-sm font-medium ${type === 'info' ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300'}`}>{children}</p>
    </motion.div>
));
StatusMessage.displayName = 'StatusMessage';
const LoadingSpinner = () => (
    <motion.span className="flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-currentColor" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> Extracting...
    </motion.span>
);
const ImagePreview = React.memo(({ url, title, isLoading }: { url?: string; title?: string; isLoading: boolean; }) => {
    const [imgLoading, setImgLoading] = useState(true); const [imgError, setImgError] = useState(false); const isVideo = url?.match(/\.(mp4|webm|ogg)$/i);
    useEffect(() => { if (url || isLoading) { setImgLoading(true); setImgError(false); } }, [url, isLoading]);
    const placeholderClasses = "w-full h-64 flex items-center justify-center bg-gray-200 dark:bg-gray-700/50 rounded-lg text-gray-500 dark:text-gray-400";
    if (isLoading) return <div className={`${placeholderClasses} animate-pulse`}>Loading preview...</div>;
    if (!url) return null;
    if (imgError) return <div className={`${placeholderClasses} border border-red-300 dark:border-red-500/50`}><div className="text-center text-red-600 dark:text-red-400 text-sm px-4"><p>Could not load preview.</p><p className="text-xs text-gray-500 dark:text-gray-400">(Possibly CORS or invalid URL)</p></div></div>;
    return (
        <motion.div className="relative w-full h-64 group bg-gray-200 dark:bg-gray-700/50 rounded-lg overflow-hidden shadow-sm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
            {(imgLoading && !isVideo) && <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700/50 animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>}
            {isVideo ? (<video key={url} controls muted className={`w-full h-full object-contain transition-opacity duration-300 ${imgLoading ? 'opacity-0' : 'opacity-100'}`} onLoadedData={() => setImgLoading(false)} onError={() => { setImgLoading(false); setImgError(true); }}><source src={url} /> Your browser does not support video.</video>)
                : (/* eslint-disable @next/next/no-img-element */ <img key={url} src={url} alt={title || "Booru preview"} className={`w-full h-full object-contain transition-opacity duration-300 ${imgLoading ? 'opacity-0' : 'opacity-100'}`} onLoad={() => setImgLoading(false)} onError={() => { setImgLoading(false); setImgError(true); }} loading="lazy" /> /* eslint-enable @next/next/no-img-element */)}
            {title && !imgLoading && !imgError && <motion.div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-3 text-white text-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}><p className="truncate">{title}</p></motion.div>}
        </motion.div>
    );
});
ImagePreview.displayName = 'ImagePreview';
interface SettingsModalProps { isOpen: boolean; onClose: () => void; settings: Settings; onSettingsChange: (newSettings: Partial<Settings>) => void; }
const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
    const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => onSettingsChange({ theme: event.target.value as ThemePreference });
    const handleAutoExtractChange = (event: React.ChangeEvent<HTMLInputElement>) => onSettingsChange({ autoExtract: event.target.checked });
    const themeOptions: { value: ThemePreference; label: string; icon: React.ReactNode }[] = [{ value: 'system', label: 'System', icon: <ComputerDesktopIcon /> },{ value: 'light', label: 'Light', icon: <SunIcon /> },{ value: 'dark', label: 'Dark', icon: <MoonIcon /> },];
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="settings-title">
                    <motion.div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", damping: 15, stiffness: 150 }} onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                            <h2 id="settings-title" className="text-xl font-semibold text-gray-800 dark:text-gray-100">Settings</h2>
                            <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-colors rounded-full p-1 -mr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800" aria-label="Close Settings"><XMarkIcon /></motion.button>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                                <div className="flex items-center space-x-2 rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
                                    {themeOptions.map(({ value, label, icon }) => (<label key={value} className={`flex-1 flex items-center justify-center space-x-2 px-3 py-1.5 rounded-md cursor-pointer transition-all text-sm font-medium ${settings.theme === value ? 'bg-white dark:bg-gray-800 shadow text-blue-600 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600/50'}`}><input type="radio" name="theme" value={value} checked={settings.theme === value} onChange={handleThemeChange} className="sr-only" aria-label={`Theme ${label}`} />{icon} <span>{label}</span></label>))}
                                </div>
                            </div>
                            <div>
                                <label className="flex items-center justify-between cursor-pointer select-none">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-3">Automatic Extraction</span>
                                    <div className="relative"><input type="checkbox" id="autoExtractToggle" className="sr-only peer" checked={settings.autoExtract} onChange={handleAutoExtractChange} /><div className="block w-11 h-6 rounded-full bg-gray-300 peer-checked:bg-blue-600 dark:bg-gray-600 transition-colors duration-200 peer-focus:ring-2 peer-focus:ring-offset-2 dark:peer-focus:ring-offset-gray-800 peer-focus:ring-blue-500"></div><div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></div></div>
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Extract tags automatically after pasting a valid URL.</p>
                            </div>
                        </div>
                        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-right">
                            <motion.button whileTap={{ scale: 0.95 }} onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 transition-colors duration-200">Done</motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
SettingsModal.displayName = 'SettingsModal';

// --- Main Component ---
const BooruTagExtractor = () => {
    const [url, setUrl] = useState('');
    const [allExtractedTags, setAllExtractedTags] = useState<ExtractedTag[]>([]);
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
    const [settings, setSettings] = useState<Settings>({ theme: 'system', autoExtract: true });

    // --- Effects ---
    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;
        const savedAutoExtract = localStorage.getItem(AUTO_EXTRACT_STORAGE_KEY);
        if (typeof window !== 'undefined') {
            setSettings({ theme: savedTheme ?? 'system', autoExtract: savedAutoExtract ? JSON.parse(savedAutoExtract) : true });
            setIsMobile(window.innerWidth < 768);
        }
    }, []);
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const applyTheme = (pref: ThemePreference) => {
            const root = window.document.documentElement;
            const isDark = pref === 'dark' || (pref === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            root.classList.toggle('dark', isDark);
            localStorage.setItem(THEME_STORAGE_KEY, pref);
        };
        applyTheme(settings.theme);
        localStorage.setItem(AUTO_EXTRACT_STORAGE_KEY, JSON.stringify(settings.autoExtract));
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => { if (settings.theme === 'system') applyTheme('system'); };
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
        if (allExtractedTags.length > 0) {
            const enabledCategories = new Set(tagCategories.filter(cat => cat.enabled).map(cat => cat.id));
            const filteredTags = allExtractedTags
                .filter(tag => enabledCategories.has(tag.category))
                .map(tag => tag.name.replace(/_/g, ' '));
            setDisplayedTags(filteredTags.join(', '));
        } else { setDisplayedTags(''); }
    }, [allExtractedTags, tagCategories]);
    const tagCounts = useMemo(() => {
        return allExtractedTags.reduce((acc, tag) => {
            acc[tag.category] = (acc[tag.category] || 0) + 1;
            return acc;
        }, {} as Record<TagCategory, number>)
    }, [allExtractedTags]);

    // --- Core Extraction Logic ---
    const extractTags = useCallback(async (targetUrl: string) => {
        const trimmedUrl = targetUrl.trim();
        if (!trimmedUrl || loading || trimmedUrl === currentExtractionUrl.current) return;

        const site = BOORU_SITES.find(s => s.urlPattern.test(trimmedUrl));
        if (!site) {
            setError('URL does not match supported sites/formats.');
            setAllExtractedTags([]); setImageUrl(undefined); setImageTitle(undefined); setActiveSite(null);
            currentExtractionUrl.current = null;
            return;
        }

        console.log(`Attempting extraction for: ${trimmedUrl} using strategy for ${site.name}`);
        setLoading(true); setError(''); setAllExtractedTags([]); setImageUrl(undefined); setImageTitle(undefined); setDisplayedTags(''); setActiveSite(null); setCopySuccess(false);
        currentExtractionUrl.current = trimmedUrl;

        try {
            setActiveSite(site.name);
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(trimmedUrl)}`;
            const response = await fetch(proxyUrl, { cache: 'no-store' });

            if (!response.ok) {
                let errorMsg = `Failed to fetch from proxy (Status: ${response.status}).`;
                try { const text = await response.text(); if (text) { try { const jsonError = JSON.parse(text); if (jsonError?.contents?.error) errorMsg = `Proxy Error: ${jsonError.contents.error}`; else if (jsonError?.error) errorMsg = `Proxy Error: ${jsonError.error}`; else if (text.length < 500) errorMsg += ` Response: ${text}`; } catch { if (text.length < 500) errorMsg += ` Response: ${text}`; } } } catch { /* Ignore */ }
                throw new Error(errorMsg);
            }
            const html = await response.text();
            if (!html) throw new Error("Received empty response from proxy.");

            const parser = new DOMParser(); const doc = parser.parseFromString(html, 'text/html');
            if (doc.title.toLowerCase().includes("error") || doc.body.textContent?.includes("Could not retrieve contents") || doc.body.textContent?.includes("error") || doc.querySelector('.error')) {
                console.warn("Proxy likely returned an error page."); const errorElement = doc.querySelector('.error, #content > div > p'); const pageError = errorElement?.textContent?.trim(); throw new Error(`Proxy could not retrieve page content. ${pageError ? `(${pageError.substring(0, 100)})` : '(Check URL or try again)'}`);
            }

            console.log(`Applying extraction strategy: ${site.name}`);
            const extractionResult = site.extractTags(doc);
            console.log("Raw extraction result:", extractionResult);

            if (extractionResult.tags.length === 0 && !extractionResult.imageUrl) {
                console.warn("No tags or image found for URL:", trimmedUrl, "Site:", site.name);
                if (doc.body.textContent?.includes("You need to login")) throw new Error('Extraction failed: Content requires login.');
                if (doc.body.textContent?.includes("Rate limit exceeded")) throw new Error('Extraction failed: Rate limit likely exceeded.');
                if (doc.querySelector('#tag-sidebar') && !doc.querySelector('#tag-sidebar li[class*="tag-type-"].tag')) console.warn("Tag sidebar exists, but no tag LIs found with expected class structure.");
                throw new Error('No tags or image found. Page structure might have changed or post is unavailable.');
            } else if (extractionResult.tags.length === 0) {
                setImageUrl(extractionResult.imageUrl); setImageTitle(extractionResult.title); setAllExtractedTags([]);
                setError('Image found, but no tags were extracted. Selectors may need update.');
                console.warn("Image found, but no tags extracted for URL:", trimmedUrl, "Site:", site.name);
            } else {
                console.log(`Successfully extracted ${extractionResult.tags.length} tags.`);
                setAllExtractedTags(extractionResult.tags); setImageUrl(extractionResult.imageUrl); setImageTitle(extractionResult.title); setError('');
            }
        } catch (err) {
            const message = (err instanceof Error) ? err.message : String(err); setError(`Extraction failed: ${message}`); console.error('Error extracting tags:', err);
            setAllExtractedTags([]); setImageUrl(undefined); setImageTitle(undefined); setActiveSite(null); currentExtractionUrl.current = null;
        } finally { setLoading(false); }
    }, [loading]);

    // --- Reset Logic ---
    const handleReset = useCallback(() => {
        setUrl(''); setAllExtractedTags([]); setImageUrl(undefined); setImageTitle(undefined); setDisplayedTags(''); setError(''); setActiveSite(null); setTagCategories(DEFAULT_TAG_CATEGORIES); setCopySuccess(false); setLoading(false);
        currentExtractionUrl.current = null;
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    }, []);

    // --- Automatic Extraction Effect ---
    useEffect(() => {
        if (!settings.autoExtract) {
            if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
            return;
        }
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        const trimmedUrl = url.trim();

        if (trimmedUrl && trimmedUrl.includes('.') && trimmedUrl.length > 10) {
            const site = BOORU_SITES.find(s => s.urlPattern.test(trimmedUrl));
            if (site) {
                if (trimmedUrl !== currentExtractionUrl.current) {
                    debounceTimeoutRef.current = setTimeout(() => {
                        const currentInputValue = (document.getElementById('url') as HTMLInputElement)?.value.trim();
                        if (trimmedUrl === currentInputValue && trimmedUrl !== currentExtractionUrl.current) {
                            // *** FIX HERE ***
                            void extractTags(trimmedUrl); // Ignore the returned promise explicitly
                        }
                    }, 750);
                }
            } else {
                if (trimmedUrl !== currentExtractionUrl.current) {
                    setError('URL does not match supported sites/formats.');
                    setAllExtractedTags([]); setImageUrl(undefined); setImageTitle(undefined); setActiveSite(null);
                }
            }
        } else if (!trimmedUrl && currentExtractionUrl.current) {
            handleReset();
        }
        return () => { if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); };
    }, [url, extractTags, settings.autoExtract, handleReset]); // Added handleReset dependency

    // --- Event Handlers ---
    const handleSettingsChange = (newSettings: Partial<Settings>) => setSettings(prev => ({ ...prev, ...newSettings }));
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => { setUrl(e.target.value); };
    const handleManualExtract = () => {
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        currentExtractionUrl.current = null;
        // *** FIX HERE ***
        void extractTags(url.trim()); // Ignore the returned promise explicitly
    };
    const toggleTagCategory = (categoryId: TagCategory) => setTagCategories(prev => prev.map(cat => cat.id === categoryId ? { ...cat, enabled: !cat.enabled } : cat));
    const toggleAllCategories = (enabled: boolean) => setTagCategories(prev => prev.map(cat => ({ ...cat, enabled })));
    const handleCopy = async () => { if (!displayedTags) return; try { await navigator.clipboard.writeText(displayedTags); setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000); } catch (err) { console.error('Failed to copy tags:', err); setError("Failed to copy tags."); } };
    const areAllCategoriesEnabled = useMemo(() => tagCategories.every(cat => cat.enabled), [tagCategories]);
    const areAllCategoriesDisabled = useMemo(() => !tagCategories.some(cat => cat.enabled), [tagCategories]);

    // --- Render ---
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
            <MotionCard
                className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-start">
                    <div className="flex-grow pr-10">
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Booru Tag Extractor</h1>
                        <div className="mt-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Supports:</span>
                            {BOORU_SITES.map((site) => (
                                <span key={site.name} className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mr-1.5 mb-1.5 transition-colors duration-150 ${ activeSite === site.name ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                                    {site.name}
                                </span>
                            ))}
                        </div>
                    </div>
                    <motion.button 
                        whileTap={{ scale: 0.9 }} 
                        onClick={() => setShowSettings(true)} 
                        className="flex-shrink-0 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 transition-colors" 
                        aria-label="Open Settings"
                    >
                        <CogIcon />
                    </motion.button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* URL Input */}
                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Booru Post URL</label>
                        <input id="url" type="url" className="w-full appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200" placeholder={settings.autoExtract ? "Paste URL here for auto-magic..." : "Paste URL here..."} value={url} onChange={handleUrlChange} aria-label="Booru Post URL"/>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                        <motion.button whileTap={{ scale: 0.97 }} onClick={handleManualExtract} disabled={loading || !url.trim()} className="flex-1 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition duration-200 shadow-sm hover:shadow-md disabled:shadow-none" aria-label="Extract Tags Manually">
                            {loading ? <LoadingSpinner /> : 'Extract Manually'}
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.97 }} onClick={handleReset} className="inline-flex items-center justify-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-100 font-semibold py-2.5 px-5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 transition duration-200" aria-label="Reset Form">
                            <ArrowPathIcon /> Reset
                        </motion.button>
                    </div>

                    {/* Status & Error Messages */}
                    <AnimatePresence>
                        {activeSite && !error && !loading && allExtractedTags.length > 0 && <StatusMessage type="info">Extracted from: <span className="font-medium">{activeSite}</span></StatusMessage>}
                        {error && <StatusMessage type="error">{error}</StatusMessage>}
                    </AnimatePresence>

                    {/* Image Preview */}
                    {(imageUrl || (loading && !imageUrl && !!currentExtractionUrl.current)) && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Preview</h3>
                            <ImagePreview url={imageUrl} title={imageTitle} isLoading={loading && !imageUrl} />
                        </div>
                    )}

                    {/* Results Section */}
                    <AnimatePresence>
                        {(!loading && (allExtractedTags.length > 0 || imageUrl)) && (
                            <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.4 }}>
                                {/* Tag Category Filters */}
                                {allExtractedTags.length > 0 && (
                                    <div className="bg-gray-50 dark:bg-gray-700/40 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
                                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filter Categories</h3>
                                            <div className="flex space-x-2 flex-shrink-0">
                                                {!areAllCategoriesEnabled && (<motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleAllCategories(true)} className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900 px-2.5 py-1 rounded-md transition-colors font-medium" aria-label="Select All Categories">All</motion.button>)}
                                                {!areAllCategoriesDisabled && (<motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleAllCategories(false)} className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 px-2.5 py-1 rounded-md transition-colors font-medium" aria-label="Clear All Tag Categories">None</motion.button>)}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                            {DEFAULT_TAG_CATEGORIES.map((categoryDef) => {
                                                const categoryOption = tagCategories.find(c => c.id === categoryDef.id) || { ...categoryDef, enabled: DEFAULT_TAG_CATEGORIES.find(d => d.id === categoryDef.id)?.enabled ?? false }; // Get default enabled state if not found
                                                const count = tagCounts[categoryOption.id] || 0;
                                                return (<CategoryToggle key={categoryOption.id} category={categoryOption} count={count} onToggle={() => toggleTagCategory(categoryOption.id)} />);
                                            })}
                                        </div>
                                    </div>
                                )}
                                {/* Tags Display & Copy */}
                                {allExtractedTags.length > 0 && (
                                    <div className="space-y-3">
                                        <div>
                                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Filtered Tags ({displayedTags ? displayedTags.split(',').filter(t => t.trim()).length : 0})</label>
                                            <textarea id="tags" rows={isMobile ? 5 : 4} className="w-full appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm" readOnly value={displayedTags || "No tags match selected categories."} aria-label="Extracted and filtered tags" />
                                        </div>
                                        <motion.button whileTap={{ scale: 0.97 }} onClick={handleCopy} disabled={!displayedTags || copySuccess} className={`w-full inline-flex items-center justify-center font-semibold py-2.5 px-5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 transition-all duration-300 shadow-sm hover:shadow-md disabled:shadow-none ${copySuccess ? 'bg-green-600 dark:bg-green-600 text-white focus-visible:ring-green-500 disabled:opacity-100 cursor-default' : 'bg-gray-700 hover:bg-gray-800 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900 focus-visible:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed'}`} aria-label={copySuccess ? "Tags Copied" : "Copy Filtered Tags"}>
                                            {copySuccess ? <CheckCircleIcon /> : <ClipboardIcon />} {copySuccess ? 'Copied!' : 'Copy Tags'}
                                        </motion.button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs text-center">
                    <p>Made with <span className="animate-heartBeat inline-block text-red-500 dark:text-red-400 mx-0.5">❤️</span> by <a href="https://x.com/ireddragonicy" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 dark:hover:text-blue-300 transition-colors font-medium">IRedDragonICY</a></p>
                    <p className="text-gray-400 dark:text-gray-500 text-[10px] mt-1">Uses AllOrigins CORS proxy. Respect source site ToS.</p>
                </div>
            </MotionCard>

            {/* Settings Modal */}
            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} settings={settings} onSettingsChange={handleSettingsChange} />
        </div>
    );
};

export default BooruTagExtractor;
