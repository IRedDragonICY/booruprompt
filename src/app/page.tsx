// page.tsx
'use client';

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';

type TagCategory = 'copyright' | 'character' | 'general' | 'meta' | 'other';
type ThemePreference = 'system' | 'light' | 'dark';
type ColorTheme = 'blue' | 'orange' | 'teal' | 'rose';
type TagCategoryOption = { id: TagCategory; label: string; enabled: boolean; color: string; };
interface ExtractedTag { name: string; category: TagCategory; }
interface ExtractionResult { tags: ExtractedTag[]; imageUrl?: string; title?: string; }
interface Settings { theme: ThemePreference; autoExtract: boolean; colorTheme: ColorTheme; }
interface HistoryEntry {
    id: string;
    url: string;
    tags: ExtractedTag[];
    imageUrl?: string;
    title?: string;
    siteName?: string;
    timestamp: number;
}

const THEME_STORAGE_KEY = 'booruExtractorThemePref';
const COLOR_THEME_STORAGE_KEY = 'booruExtractorColorThemePref';
const AUTO_EXTRACT_STORAGE_KEY = 'booruExtractorAutoExtractPref';
const HISTORY_STORAGE_KEY = 'booruExtractorHistory';
const MAX_HISTORY_SIZE = 30;
const DEFAULT_COLOR_THEME: ColorTheme = 'blue';

const utils = {
    getCategoryFromClassList: (element: Element): TagCategory => {
        const classList = element.classList;
        if (classList.contains('tag-type-copyright') || classList.contains('tag-type-3')) return 'copyright';
        if (classList.contains('tag-type-character') || classList.contains('tag-type-4')) return 'character';
        if (classList.contains('tag-type-general') || classList.contains('tag-type-0')) return 'general';
        if (classList.contains('tag-type-metadata') || classList.contains('tag-type-5') || classList.contains('tag-type-meta')) return 'meta';
        if (classList.contains('tag-type-artist') || classList.contains('tag-type-1')) return 'other';
        const parentCategoryElement = element.closest('[class*="tag-type-"]');
        if (parentCategoryElement && parentCategoryElement !== element) {
            return utils.getCategoryFromClassList(parentCategoryElement);
        }
        return 'general';
    },
    getCategoryFromHeader: (text: string): TagCategory => {
        const normalized = text.toLowerCase().trim();
        if (normalized.includes('copyright')) return 'copyright';
        if (normalized.includes('character')) return 'character';
        if (normalized.includes('general')) return 'general';
        if (normalized.includes('meta') || normalized.includes('metadata')) return 'meta';
        if (normalized.includes('artist')) return 'other';
        return 'other';
    },
    cleanTagName: (tagName: string): string => {
        return tagName.replace(/ \(\d+\.?\d*[kM]?\)$/, '').replace(/^\? /, '').trim();
    },
    extractTagsByClass: (doc: Document, selectors: { container: string, tag: string }): ExtractedTag[] => {
        const tags: ExtractedTag[] = [];
        const elements = doc.querySelectorAll(selectors.container);
        elements.forEach(element => {
            const tagElement = element.querySelector(selectors.tag);
            const tagName = tagElement?.textContent?.trim() || '';
            if (tagName) {
                const category = utils.getCategoryFromClassList(element);
                const cleanName = utils.cleanTagName(tagName);
                if (cleanName && !['copyrights', 'characters', 'general', 'meta', 'metadata', 'artists'].includes(cleanName.toLowerCase())) {
                    const tagIsCategoryName = cleanName.toLowerCase() === category;
                    if (!tagIsCategoryName) {
                        tags.push({ name: cleanName, category });
                    }
                }
            }
        });
        return Array.from(new Map(tags.map(tag => [`${tag.category}-${tag.name}`, tag])).values());
    },
    extractTagsBySection: (doc: Document, selector: string, tagLinkSelector: string): ExtractedTag[] => {
        const tags: ExtractedTag[] = [];
        let currentCategory: TagCategory = 'other';
        const container = doc.querySelector(selector);
        if (!container) return [];

        Array.from(container.children).forEach(child => {
            if ((child.tagName === 'H3' || child.tagName === 'H6' || child.classList.contains('tag-type-header') || child.classList.contains('tag-sidebar-header') || (child.tagName === 'LI' && child.querySelector('h6'))) && child.textContent) {
                currentCategory = utils.getCategoryFromHeader(child.textContent);
            }
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

const BOORU_SITES = [
    { name: 'Danbooru', urlPattern: /danbooru\.donmai\.us\/posts\/\d+/i, extractTags: extractionStrategies.danbooru },
    { name: 'Safebooru', urlPattern: /safebooru\.org\/(index\.php\?page=post&s=view&id=\d+|post\/view\/\d+)/i, extractTags: extractionStrategies.safebooru },
    { name: 'Gelbooru', urlPattern: /gelbooru\.com\/index\.php\?page=post&s=view&id=\d+/i, extractTags: extractionStrategies.gelbooru },
    { name: 'Rule34', urlPattern: /rule34\.xxx\/index\.php\?page=post&s=view&id=\d+/i, extractTags: extractionStrategies.rule34 },
    { name: 'e621', urlPattern: /e621\.net\/posts\/\d+/i, extractTags: extractionStrategies.e621 }
];

const DEFAULT_TAG_CATEGORIES: TagCategoryOption[] = [
    { id: 'copyright', label: 'Copyright', enabled: true, color: 'bg-cat-copyright' },
    { id: 'character', label: 'Character', enabled: true, color: 'bg-cat-character' },
    { id: 'general', label: 'General', enabled: true, color: 'bg-cat-general' },
    { id: 'meta', label: 'Meta', enabled: true, color: 'bg-cat-meta' },
    { id: 'other', label: 'Other', enabled: true, color: 'bg-cat-other' }
];

// Animated Icon Wrapper
const AnimatedIcon = ({ children, isActive = false, animation = "default" }: { children: React.ReactNode, isActive?: boolean, animation?: "default" | "spin" | "gentle" }) => {
    const variants = {
        default: {
            hover: { scale: 1.15, rotate: isActive ? 0 : 5 },
            tap: { scale: 0.9 },
            active: { scale: 1.1, transition: { type: 'spring', stiffness: 300, damping: 10 } },
            inactive: { scale: 1 }
        },
        spin: {
            hover: { scale: 1.2, rotate: 360 },
            tap: { scale: 0.9 },
            active: { rotate: 360, transition: { duration: 0.5, ease: 'easeInOut' } },
            inactive: { rotate: 0 }
        },
        gentle: {
            hover: { scale: 1.1 },
            tap: { scale: 0.95 },
            active: { scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 15 } },
            inactive: { scale: 1 }
        }
    } as const;

    return (
        <motion.span
            className="inline-flex items-center justify-center"
            variants={variants[animation]}
            initial="inactive"
            animate={isActive ? "active" : "inactive"}
            whileHover="hover"
            whileTap="tap"
            transition={{ type: 'spring', stiffness: 400, damping: 15 }} // Default spring for hover/tap
        >
            {children}
        </motion.span>
    );
};

// SVG Icons (no changes needed here)
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>;
const ComputerDesktopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" /></svg>;
const CogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /></svg>;
const ClipboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const ArrowPathIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>;
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;
const ArrowUpOnSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-on-surface-faint"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>;

const MotionCard = motion.div;
const CategoryToggle = React.memo(({ category, count, onToggle }: { category: TagCategoryOption; count: number; onToggle: () => void }) => (
    <MotionCard
        className="flex items-center justify-between bg-surface-alt-2 p-3 rounded-lg shadow-sm transition-shadow hover:shadow-md"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}
        whileHover={{ y: -2 }}
    >
        <div className="flex items-center space-x-3 overflow-hidden">
            <motion.span
                className={`inline-block w-3 h-3 rounded-full ${category.color} flex-shrink-0`}
                animate={{ scale: category.enabled ? 1 : 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            ></motion.span>
            <span className="truncate text-sm font-medium text-on-surface" title={category.label}>{category.label}</span>
            {count > 0 && (<span className="text-xs bg-surface-border px-2 py-0.5 rounded-full text-on-surface-muted flex-shrink-0">{count}</span>)}
        </div>
        <label className="inline-flex items-center cursor-pointer flex-shrink-0 ml-2">
            <input type="checkbox" className="sr-only peer" checked={category.enabled} onChange={onToggle} aria-labelledby={`category-label-${category.id}`}/>
            <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 dark:peer-focus:ring-offset-surface-alt peer-focus:ring-primary ${category.enabled ? category.color : 'bg-surface-border'}`}>
                <motion.div
                    className={`absolute left-1 top-1 bg-white dark:bg-gray-300 w-4 h-4 rounded-full shadow-sm`}
                    layout
                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                    initial={false}
                    animate={{ x: category.enabled ? 20 : 0 }}
                ></motion.div>
            </div>
        </label>
        <span id={`category-label-${category.id}`} className="sr-only">{category.label} Toggle</span>
    </MotionCard>
));
CategoryToggle.displayName = 'CategoryToggle';
const StatusMessage = React.memo(({ type, children }: { type: 'info' | 'error', children: React.ReactNode }) => (
    <motion.div
        className={`border-l-4 p-4 rounded-md ${type === 'info' ? 'bg-info-bg border-info' : 'bg-error-bg border-error'}`}
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
    >
        <p className={`text-sm font-medium ${type === 'info' ? 'text-info-content' : 'text-error'}`}>{children}</p>
    </motion.div>
));
StatusMessage.displayName = 'StatusMessage';
const LoadingSpinner = () => (
    <motion.span className="flex items-center justify-center text-primary-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.svg
            className="-ml-1 mr-2 h-5 w-5 text-currentColor" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </motion.svg> Extracting...
    </motion.span>
);
const ImagePreview = React.memo(({ url, title, isLoading }: { url?: string; title?: string; isLoading: boolean; }) => {
    const [imgLoading, setImgLoading] = useState(true); const [imgError, setImgError] = useState(false); const isVideo = url?.match(/\.(mp4|webm|ogg)$/i);
    useEffect(() => { if (url || isLoading) { setImgLoading(true); setImgError(false); } }, [url, isLoading]);
    const placeholderClasses = "w-full h-64 flex items-center justify-center bg-surface-alt-2 rounded-lg text-on-surface-faint";
    if (isLoading) return <div className={`${placeholderClasses} animate-pulse`}>Loading preview...</div>;
    if (!url) return null;
    if (imgError) return <div className={`${placeholderClasses} border border-error`}><div className="text-center text-error text-sm px-4"><p>Could not load preview.</p><p className="text-xs text-on-surface-faint">(Possibly CORS or invalid URL)</p></div></div>;
    return (
        <motion.div className="relative w-full h-64 group bg-surface-alt-2 rounded-lg overflow-hidden shadow-sm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
            {(imgLoading && !isVideo) && <div className="absolute inset-0 flex items-center justify-center bg-surface-alt-2 animate-pulse text-on-surface-faint">Loading...</div>}
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
    const handleColorThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => onSettingsChange({ colorTheme: event.target.value as ColorTheme });
    const handleAutoExtractChange = (event: React.ChangeEvent<HTMLInputElement>) => onSettingsChange({ autoExtract: event.target.checked });

    const themeOptions: { value: ThemePreference; label: string; icon: React.ReactNode; animation: "default" | "spin" | "gentle" }[] = [
        { value: 'system', label: 'System', icon: <ComputerDesktopIcon />, animation: "gentle" },
        { value: 'light', label: 'Light', icon: <SunIcon />, animation: "spin" },
        { value: 'dark', label: 'Dark', icon: <MoonIcon />, animation: "default" },
    ];

    const colorThemeOptions: { value: ColorTheme; label: string; colorClass: string }[] = [
        { value: 'blue', label: 'Blue', colorClass: 'bg-[#3B82F6] dark:bg-[#60A5FA]' },
        { value: 'orange', label: 'Orange', colorClass: 'bg-[#F97316] dark:bg-[#FB923C]' },
        { value: 'teal', label: 'Teal', colorClass: 'bg-[#0D9488] dark:bg-[#2DD4BF]' },
        { value: 'rose', label: 'Rose', colorClass: 'bg-[#E11D48] dark:bg-[#FB7185]' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="settings-title">
                    <motion.div className="bg-surface-alt rounded-xl shadow-xl p-6 w-full max-w-md" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", damping: 15, stiffness: 150 }} onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6 border-b border-surface-border pb-4">
                            <h2 id="settings-title" className="text-xl font-semibold text-on-surface">Settings</h2>
                            <motion.button whileTap={{ scale: 0.9 }} whileHover={{ rotate: 90, scale: 1.1 }} onClick={onClose} className="text-on-surface-muted hover:text-on-surface transition-colors rounded-full p-1 -mr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface-alt" aria-label="Close Settings">
                                <XMarkIcon />
                            </motion.button>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-on-surface mb-2">Appearance</label>
                                <div className="flex items-center space-x-2 rounded-lg bg-surface-alt-2 p-1">
                                    {themeOptions.map(({ value, label, icon, animation }) => (
                                        <label key={value} className={`flex-1 flex items-center justify-center space-x-2 px-3 py-1.5 rounded-md cursor-pointer transition-all text-sm font-medium ${settings.theme === value ? 'bg-surface shadow text-primary' : 'text-on-surface-muted hover:bg-surface-border'}`}>
                                            <input type="radio" name="theme" value={value} checked={settings.theme === value} onChange={handleThemeChange} className="sr-only" aria-label={`Theme ${label}`} />
                                            <AnimatedIcon isActive={settings.theme === value} animation={animation as "default" | "spin" | "gentle"}>
                                                {icon}
                                            </AnimatedIcon>
                                            <span>{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface mb-2">Color</label>
                                <div className="flex items-center space-x-2 rounded-lg bg-surface-alt-2 p-1">
                                    {colorThemeOptions.map(({ value, label, colorClass }) => (
                                        <motion.label whileHover={{ scale: 1.05 }} key={value} className={`relative flex-1 flex items-center justify-center px-3 py-1.5 rounded-md cursor-pointer transition-all text-sm font-medium ${settings.colorTheme === value ? 'bg-surface shadow ring-2 ring-primary ring-offset-1 ring-offset-surface-alt-2' : 'hover:bg-surface-border'}`} title={label}>
                                            <input type="radio" name="colorTheme" value={value} checked={settings.colorTheme === value} onChange={handleColorThemeChange} className="sr-only" aria-label={`Color Theme ${label}`} />
                                            <span className={`block w-5 h-5 rounded-full ${colorClass}`}></span>
                                            <AnimatePresence>
                                                {settings.colorTheme === value && (
                                                    <motion.div
                                                        className="absolute inset-0 flex items-center justify-center"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        exit={{ scale: 0 }}
                                                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                                                    >
                                                        <svg className="w-3 h-3 text-primary-content dark:text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            <span className="sr-only">{label}</span>
                                        </motion.label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="flex items-center justify-between cursor-pointer select-none">
                                    <span className="text-sm font-medium text-on-surface mr-3">Automatic Extraction</span>
                                    <div className="relative">
                                        <input type="checkbox" id="autoExtractToggle" className="sr-only peer" checked={settings.autoExtract} onChange={handleAutoExtractChange} />
                                        <div className="block w-11 h-6 rounded-full bg-surface-border peer-checked:bg-primary transition-colors duration-200 peer-focus:ring-2 peer-focus:ring-offset-2 dark:peer-focus:ring-offset-surface-alt peer-focus:ring-primary"></div>
                                        <motion.div
                                            className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm"
                                            layout
                                            transition={{ type: "spring", stiffness: 700, damping: 30 }}
                                            initial={false}
                                            animate={{ x: settings.autoExtract ? 20 : 0 }}
                                        ></motion.div>
                                    </div>
                                </label>
                                <p className="text-xs text-on-surface-muted mt-1.5">Extract tags automatically after pasting a valid URL.</p>
                            </div>
                        </div>
                        <div className="mt-8 pt-4 border-t border-surface-border text-right">
                            <motion.button whileTap={{ scale: 0.95 }} onClick={onClose} className="bg-primary hover:bg-primary-focus text-primary-content font-medium py-2 px-5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface-alt transition-colors duration-200">Done</motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
SettingsModal.displayName = 'SettingsModal';
interface HistoryItemProps {
    entry: HistoryEntry;
    onLoad: (entry: HistoryEntry) => void;
    onDelete: (id: string) => void;
}
const HistoryItem: React.FC<HistoryItemProps> = React.memo(({ entry, onLoad, onDelete }) => {
    const formattedDate = useMemo(() => new Date(entry.timestamp).toLocaleString(undefined, {
        dateStyle: 'short',
        timeStyle: 'short',
    }), [entry.timestamp]);

    const handleLoadClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onLoad(entry);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(entry.id);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
            className="flex items-center space-x-3 p-3 bg-surface-alt-2 rounded-lg hover:bg-surface-border transition-colors"
        >
            {entry.imageUrl ? (
                <motion.img
                    layoutId={`history-image-${entry.id}`} // Added layoutId for potential shared transition
                    src={entry.imageUrl}
                    alt="preview"
                    className="w-10 h-10 rounded object-cover flex-shrink-0 bg-surface-border"
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }}
                />
            ) : (
                <div className="w-10 h-10 rounded bg-surface-border flex items-center justify-center flex-shrink-0">
                    <AnimatedIcon animation="gentle"><PhotoIcon /></AnimatedIcon> {/* Gentle animation */}
                </div>
            )}
            {/* Fallback placeholder if image fails to load */}
            <div className="w-10 h-10 rounded bg-surface-border items-center justify-center flex-shrink-0 hidden">
                <AnimatedIcon animation="gentle"><PhotoIcon /></AnimatedIcon>
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-on-surface truncate" title={entry.title || entry.url}>
                    {entry.title || entry.url}
                </p>
                <p className="text-xs text-on-surface-muted">
                    {entry.siteName ? `${entry.siteName} • ` : ''}
                    {formattedDate} • {entry.tags.length} tags
                </p>
            </div>
            <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.1)', transition: { duration: 0.1 } }}
                onClick={handleLoadClick}
                className="p-1.5 rounded-full text-on-surface-faint hover:text-primary dark:hover:text-primary transition-colors"
                title="Load this entry"
                aria-label="Load this history entry"
            >
                <AnimatedIcon animation="gentle"><ArrowUpOnSquareIcon /></AnimatedIcon>
            </motion.button>
            <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)', transition: { duration: 0.1 } }}
                onClick={handleDeleteClick}
                className="p-1.5 rounded-full text-on-surface-faint hover:text-error dark:hover:text-error transition-colors"
                title="Delete this entry"
                aria-label="Delete this history entry"
            >
                <AnimatedIcon animation="gentle"><TrashIcon /></AnimatedIcon>
            </motion.button>
        </motion.div>
    );
});
HistoryItem.displayName = 'HistoryItem';
interface HistoryPanelProps {
    history: HistoryEntry[];
    onLoadEntry: (entry: HistoryEntry) => void;
    onDeleteEntry: (id: string) => void;
    onClearHistory: () => void;
}
const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoadEntry, onDeleteEntry, onClearHistory }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const handleClearClick = () => {
        onClearHistory();
        setShowClearConfirm(false);
    };

    if (history.length === 0) {
        return null;
    }

    return (
        <div className="mt-6 bg-surface-alt border border-surface-border rounded-lg overflow-hidden">
            <motion.button
                whileTap={{ backgroundColor: 'rgba(var(--color-surface-border), 0.5)' }}
                transition={{ duration: 0.05 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left hover:bg-surface-alt-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset transition-colors"
                aria-expanded={isOpen}
                aria-controls="history-content"
            >
                <div className="flex items-center space-x-2">
                    <AnimatedIcon animation="gentle"><HistoryIcon /></AnimatedIcon>
                    <span className="font-semibold text-on-surface">Extraction History</span>
                    <span className="text-xs bg-surface-border px-2 py-0.5 rounded-full text-on-surface-muted">{history.length}</span>
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
                        <div className="p-4 space-y-2 border-t border-surface-border max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-surface-border scrollbar-track-transparent">
                            <AnimatePresence mode="popLayout">
                                {history.map((entry) => (
                                    <HistoryItem
                                        key={entry.id}
                                        entry={entry}
                                        onLoad={onLoadEntry}
                                        onDelete={onDeleteEntry}
                                    />
                                ))}
                            </AnimatePresence>
                            {history.length === 0 && (
                                <p className="text-sm text-center text-on-surface-muted py-4">History is empty.</p>
                            )}
                        </div>
                        {history.length > 0 && (
                            <div className="p-3 border-t border-surface-border bg-surface-alt-2 text-right relative">
                                <AnimatePresence>
                                    {showClearConfirm && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className="absolute right-3 bottom-full mb-2 flex gap-2 items-center bg-surface p-2 rounded shadow-lg border border-surface-border"
                                        >
                                            <p className="text-xs text-on-surface">Really clear?</p>
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleClearClick}
                                                className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors font-medium"
                                            >
                                                Yes, Clear
                                            </motion.button>
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setShowClearConfirm(false)}
                                                className="text-xs bg-surface-border hover:bg-gray-300 dark:hover:bg-gray-500 text-on-surface px-2 py-1 rounded transition-colors font-medium"
                                            >
                                                Cancel
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowClearConfirm(true)}
                                    className="inline-flex items-center space-x-1 text-xs bg-error-bg text-error hover:bg-red-100 dark:hover:bg-red-900/50 px-2.5 py-1 rounded-md transition-colors font-medium"
                                    aria-label="Clear History"
                                >
                                    <AnimatedIcon animation="gentle"><TrashIcon /></AnimatedIcon>
                                    <span>Clear History</span>
                                </motion.button>
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
    const [settings, setSettings] = useState<Settings>({
        theme: 'system',
        autoExtract: true,
        colorTheme: DEFAULT_COLOR_THEME
    });
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const cardBodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;
        const savedColorTheme = localStorage.getItem(COLOR_THEME_STORAGE_KEY) as ColorTheme | null;
        const savedAutoExtract = localStorage.getItem(AUTO_EXTRACT_STORAGE_KEY);
        let loadedHistory: HistoryEntry[] = [];

        try {
            const savedHistoryData = localStorage.getItem(HISTORY_STORAGE_KEY);
            if (savedHistoryData) {
                const parsed = JSON.parse(savedHistoryData);
                if (Array.isArray(parsed) && parsed.every(item => typeof item.id === 'string' && typeof item.url === 'string' && typeof item.timestamp === 'number')) {
                    loadedHistory = parsed.sort((a, b) => b.timestamp - a.timestamp);
                } else {
                    console.warn("Invalid history data in localStorage. Clearing.");
                    localStorage.removeItem(HISTORY_STORAGE_KEY);
                }
            }
        } catch (e) {
            console.error("Failed to load or parse history:", e);
            localStorage.removeItem(HISTORY_STORAGE_KEY);
        }

        if (typeof window !== 'undefined') {
            setSettings({
                theme: savedTheme ?? 'system',
                colorTheme: savedColorTheme ?? DEFAULT_COLOR_THEME,
                autoExtract: savedAutoExtract ? JSON.parse(savedAutoExtract) : true
            });
            setHistory(loadedHistory);
            setIsMobile(window.innerWidth < 768);
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const applyTheme = (pref: ThemePreference, colorPref: ColorTheme) => {
            const root = window.document.documentElement;

            const isDark = pref === 'dark' || (pref === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            root.classList.toggle('dark', isDark);
            localStorage.setItem(THEME_STORAGE_KEY, pref);

            root.setAttribute('data-color-theme', colorPref);
            localStorage.setItem(COLOR_THEME_STORAGE_KEY, colorPref);
        };

        applyTheme(settings.theme, settings.colorTheme);
        localStorage.setItem(AUTO_EXTRACT_STORAGE_KEY, JSON.stringify(settings.autoExtract));

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (settings.theme === 'system') {
                applyTheme('system', settings.colorTheme);
            }
        };
        if (settings.theme === 'system') {
            mediaQuery.addEventListener('change', handleChange);
        }
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

    useEffect(() => {
        if (history && history.length > 0) {
            localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
        } else if (history && history.length === 0 && localStorage.getItem(HISTORY_STORAGE_KEY)) {
            localStorage.removeItem(HISTORY_STORAGE_KEY);
        }
    }, [history]);

    const tagCounts = useMemo(() => {
        return allExtractedTags.reduce((acc, tag) => {
            acc[tag.category] = (acc[tag.category] || 0) + 1;
            return acc;
        }, {} as Record<TagCategory, number>)
    }, [allExtractedTags]);

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

            const newEntryBase = {
                id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                url: trimmedUrl,
                imageUrl: extractionResult.imageUrl,
                title: extractionResult.title,
                siteName: site.name,
                timestamp: Date.now(),
            };

            const updateHistory = (entry: HistoryEntry) => {
                setHistory(prevHistory => {
                    const existingIndex = prevHistory.findIndex(h => h.url === entry.url);
                    let updatedHistory = [...prevHistory];
                    if (existingIndex > -1) {
                        updatedHistory.splice(existingIndex, 1);
                    }
                    updatedHistory = [entry, ...updatedHistory];
                    if (updatedHistory.length > MAX_HISTORY_SIZE) {
                        return updatedHistory.slice(0, MAX_HISTORY_SIZE);
                    }
                    return updatedHistory;
                });
            }

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
                const newEntry: HistoryEntry = { ...newEntryBase, tags: [] };
                updateHistory(newEntry);
            } else {
                console.log(`Successfully extracted ${extractionResult.tags.length} tags.`);
                setAllExtractedTags(extractionResult.tags); setImageUrl(extractionResult.imageUrl); setImageTitle(extractionResult.title); setError('');
                const newEntry: HistoryEntry = { ...newEntryBase, tags: extractionResult.tags };
                updateHistory(newEntry);
            }
        } catch (err) {
            const message = (err instanceof Error) ? err.message : String(err); setError(`Extraction failed: ${message}`); console.error('Error extracting tags:', err);
            currentExtractionUrl.current = null;
        } finally { setLoading(false); }
    }, [loading]);

    const handleReset = useCallback(() => {
        setUrl(''); setAllExtractedTags([]); setImageUrl(undefined); setImageTitle(undefined); setDisplayedTags(''); setError(''); setActiveSite(null); setTagCategories(DEFAULT_TAG_CATEGORIES); setCopySuccess(false); setLoading(false);
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

        if (trimmedUrl && trimmedUrl.includes('.') && trimmedUrl.length > 10) {
            const site = BOORU_SITES.find(s => s.urlPattern.test(trimmedUrl));
            if (site) {
                if (trimmedUrl !== currentExtractionUrl.current) {
                    debounceTimeoutRef.current = setTimeout(() => {
                        const currentInputValue = (document.getElementById('url') as HTMLInputElement)?.value.trim();
                        if (trimmedUrl === currentInputValue && trimmedUrl !== currentExtractionUrl.current) {
                            void extractTags(trimmedUrl);
                        }
                    }, 750);
                }
            } else {
                if (trimmedUrl !== currentExtractionUrl.current) {
                    setError('');
                }
            }
        } else if (!trimmedUrl && currentExtractionUrl.current) {
            // Optionally reset or do nothing when input is cleared
        }
        return () => { if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); };
    }, [url, extractTags, settings.autoExtract, handleReset]);

    const handleSettingsChange = (newSettings: Partial<Settings>) => setSettings(prev => ({ ...prev, ...newSettings }));
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => { setUrl(e.target.value); };
    const handleManualExtract = () => {
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        currentExtractionUrl.current = null;
        void extractTags(url.trim());
    };
    const toggleTagCategory = (categoryId: TagCategory) => setTagCategories(prev => prev.map(cat => cat.id === categoryId ? { ...cat, enabled: !cat.enabled } : cat));
    const toggleAllCategories = (enabled: boolean) => setTagCategories(prev => prev.map(cat => ({ ...cat, enabled })));
    const handleCopy = async () => { if (!displayedTags) return; try { await navigator.clipboard.writeText(displayedTags); setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000); } catch (err) { console.error('Failed to copy tags:', err); setError("Failed to copy tags."); } };
    const areAllCategoriesEnabled = useMemo(() => tagCategories.every(cat => cat.enabled), [tagCategories]);
    const areAllCategoriesDisabled = useMemo(() => !tagCategories.some(cat => cat.enabled), [tagCategories]);

    const handleLoadHistoryEntry = useCallback((entry: HistoryEntry) => {
        if (loading) return;

        setUrl(entry.url);
        setAllExtractedTags(entry.tags);
        setImageUrl(entry.imageUrl);
        setImageTitle(entry.title);
        setActiveSite(entry.siteName || null);
        setTagCategories(DEFAULT_TAG_CATEGORIES);
        setError('');
        setLoading(false);
        setCopySuccess(false);
        currentExtractionUrl.current = entry.url;

        cardBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

    }, [loading]);

    const handleDeleteHistoryEntry = useCallback((id: string) => {
        setHistory(prev => prev.filter(item => item.id !== id));
    }, []);

    const handleClearHistory = useCallback(() => {
        setHistory([]);
    }, []);

    return (
        <div className="min-h-screen bg-surface text-on-surface flex items-center justify-center p-4 sm:p-6 transition-colors duration-300 overflow-hidden">
            <MotionCard
                className="w-full max-w-xl bg-surface-alt rounded-xl shadow-lg flex flex-col overflow-hidden border border-surface-border max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="flex-shrink-0 sticky top-0 z-10 px-6 py-5 border-b border-surface-border bg-surface-alt flex justify-between items-start">
                    <div className="flex-grow pr-4 sm:pr-10">
                        <h1 className="text-xl sm:text-2xl font-semibold text-on-surface">Booru Tag Extractor</h1>
                        <div className="mt-2">
                            <span className="text-sm text-on-surface-muted mr-2">Supports:</span>
                            {BOORU_SITES.map((site) => (
                                <span key={site.name} className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mr-1.5 mb-1.5 transition-colors duration-150 ${ activeSite === site.name ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary' : 'bg-surface-alt-2 text-on-surface-muted'}`}>
                                     {site.name}
                                 </span>
                            ))}
                        </div>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        onClick={() => setShowSettings(true)}
                        className="flex-shrink-0 p-2 rounded-full text-on-surface-muted hover:text-on-surface hover:bg-surface-alt-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface-alt transition-colors"
                        aria-label="Open Settings"
                    >
                        <CogIcon />
                    </motion.button>
                </div>

                <div ref={cardBodyRef} className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-surface-border scrollbar-track-transparent">
                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-on-surface mb-1.5">Booru Post URL</label>
                        <input id="url" type="url" className="w-full appearance-none bg-surface-alt-2 border border-surface-border rounded-lg px-4 py-2.5 text-on-surface placeholder-on-surface-faint focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200" placeholder={settings.autoExtract ? "Paste URL here for auto-magic..." : "Paste URL here..."} value={url} onChange={handleUrlChange} aria-label="Booru Post URL"/>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                        <motion.button whileTap={{ scale: 0.97 }} onClick={handleManualExtract} disabled={loading || !url.trim()} className="flex-1 inline-flex items-center justify-center bg-primary hover:bg-primary-focus text-primary-content font-semibold py-2.5 px-5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface-alt disabled:opacity-60 disabled:cursor-not-allowed transition duration-200 shadow-sm hover:shadow-md disabled:shadow-none" aria-label="Extract Tags Manually">
                            {loading ? <LoadingSpinner /> : 'Extract Manually'}
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={handleReset}
                            className="inline-flex items-center justify-center bg-surface-alt-2 hover:bg-surface-border text-on-surface font-semibold py-2.5 px-5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-on-surface-muted focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface-alt transition duration-200"
                            aria-label="Reset Form"
                        >
                            <motion.span
                                whileTap={{ rotate: -90 }}
                                whileHover={{ rotate: -15 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                className="mr-2 inline-block"
                            >
                                <ArrowPathIcon />
                            </motion.span>
                            Reset
                        </motion.button>
                    </div>

                    <AnimatePresence>
                        {activeSite && !error && !loading && (allExtractedTags.length > 0 || imageUrl) && <StatusMessage type="info">Showing result for: <span className="font-medium">{activeSite}</span></StatusMessage>}
                        {error && <StatusMessage type="error">{error}</StatusMessage>}
                    </AnimatePresence>

                    {(imageUrl || (loading && !imageUrl && !!currentExtractionUrl.current)) && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-on-surface-muted">Preview</h3>
                            <ImagePreview url={imageUrl} title={imageTitle} isLoading={loading && !imageUrl} />
                        </div>
                    )}

                    <AnimatePresence>
                        {(!loading && (allExtractedTags.length > 0 || imageUrl)) && (
                            <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.4 }}>
                                {allExtractedTags.length > 0 && (
                                    <div className="bg-surface-alt-2 p-4 rounded-lg border border-surface-border">
                                        <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
                                            <h3 className="text-sm font-semibold text-on-surface">Filter Categories</h3>
                                            <div className="flex space-x-2 flex-shrink-0">
                                                {!areAllCategoriesEnabled && (<motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleAllCategories(true)} className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900 px-2.5 py-1 rounded-md transition-colors font-medium" aria-label="Select All Categories">All</motion.button>)}
                                                {!areAllCategoriesDisabled && (<motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleAllCategories(false)} className="text-xs bg-surface-border text-on-surface-muted hover:bg-gray-300 dark:hover:bg-gray-500 px-2.5 py-1 rounded-md transition-colors font-medium" aria-label="Clear All Tag Categories">None</motion.button>)}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                            {DEFAULT_TAG_CATEGORIES.map((categoryDef) => {
                                                const categoryOption = tagCategories.find(c => c.id === categoryDef.id) || { ...categoryDef, enabled: DEFAULT_TAG_CATEGORIES.find(d => d.id === categoryDef.id)?.enabled ?? false };
                                                const count = tagCounts[categoryOption.id] || 0;
                                                return (<CategoryToggle key={categoryOption.id} category={categoryOption} count={count} onToggle={() => toggleTagCategory(categoryOption.id)} />);
                                            })}
                                        </div>
                                    </div>
                                )}
                                {allExtractedTags.length > 0 && (
                                    <div className="space-y-3">
                                        <div>
                                            <label htmlFor="tags" className="block text-sm font-medium text-on-surface mb-1.5">Filtered Tags ({displayedTags ? displayedTags.split(',').filter(t => t.trim()).length : 0})</label>
                                            <textarea id="tags" rows={isMobile ? 5 : 4} className="w-full appearance-none bg-surface-alt-2 border border-surface-border rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 text-sm scrollbar-thin scrollbar-thumb-surface-border scrollbar-track-transparent" readOnly value={displayedTags || "No tags match selected categories."} aria-label="Extracted and filtered tags" />
                                        </div>
                                        <motion.button
                                            whileTap={{ scale: 0.97 }}
                                            onClick={handleCopy}
                                            disabled={!displayedTags || copySuccess}
                                            className={`w-full inline-flex items-center justify-center font-semibold py-2.5 px-5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface-alt transition-all duration-300 shadow-sm hover:shadow-md disabled:shadow-none ${copySuccess ? 'bg-success text-success-content focus-visible:ring-success disabled:opacity-100 cursor-default' : 'bg-on-surface hover:opacity-90 text-surface dark:text-surface-alt focus-visible:ring-on-surface-muted disabled:opacity-50 disabled:cursor-not-allowed'}`}
                                            aria-label={copySuccess ? "Tags Copied" : "Copy Filtered Tags"}
                                        >
                                            <motion.div
                                                className="inline-flex items-center justify-center overflow-hidden"
                                                style={{ width: '1.25rem', height: '1.25rem' }} // Match icon size
                                            >
                                                <AnimatePresence mode="popLayout" initial={false}>
                                                    {copySuccess ? (
                                                        <motion.span
                                                            key="check"
                                                            initial={{ opacity: 0, y: -15 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 15 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="flex items-center"
                                                        >
                                                            <CheckCircleIcon />
                                                        </motion.span>
                                                    ) : (
                                                        <motion.span
                                                            key="clipboard"
                                                            initial={{ opacity: 0, y: -15 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 15 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="flex items-center"
                                                        >
                                                            <ClipboardIcon />
                                                        </motion.span>
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

                    <HistoryPanel
                        history={history}
                        onLoadEntry={handleLoadHistoryEntry}
                        onDeleteEntry={handleDeleteHistoryEntry}
                        onClearHistory={handleClearHistory}
                    />

                </div>

                <div className="flex-shrink-0 border-t border-surface-border p-4 bg-surface-alt text-on-surface-muted text-xs text-center">
                    <p>Made with <span className="animate-heartBeat inline-block text-red-500 dark:text-red-400 mx-0.5">❤️</span> by <a href="https://x.com/ireddragonicy" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors font-medium">IRedDragonICY</a></p>
                    <p className="text-on-surface-faint text-[10px] mt-1">Uses AllOrigins CORS proxy. Respect source site ToS.</p>
                </div>
            </MotionCard>

            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} settings={settings} onSettingsChange={handleSettingsChange} />
        </div>
    );
};

export default BooruTagExtractor;
