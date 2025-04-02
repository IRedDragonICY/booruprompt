export type TagCategory = 'copyright' | 'character' | 'general' | 'meta' | 'other';
export type TagCategoryOption = { id: TagCategory; label: string; enabled: boolean; variable: string };
export interface ExtractedTag { name: string; category: TagCategory }
export interface ExtractionResult { tags: Partial<Record<TagCategory, string[]>>; imageUrl?: string; title?: string }

const groupTags = (tags: ExtractedTag[]): Partial<Record<TagCategory, string[]>> =>
    tags.reduce((acc, tag) => {
        (acc[tag.category] ??= []).push(tag.name);
        return acc;
    }, {} as Partial<Record<TagCategory, string[]>>);

const CLASS_CATEGORY_MAP: Readonly<Record<string, TagCategory>> = {
    'tag-type-copyright': 'copyright', 'tag-type-3': 'copyright', 'copyright': 'copyright',
    'tag-type-character': 'character', 'tag-type-4': 'character', 'character': 'character',
    'tag-type-artist': 'other', 'tag-type-1': 'other', 'artist': 'other',
    'tag-type-metadata': 'meta', 'tag-type-5': 'meta', 'tag-type-meta': 'meta', 'tag-type-style': 'meta', 'style': 'meta',
    'tag-type-general': 'general', 'tag-type-0': 'general', 'reference': 'general', 'object': 'general', 'general': 'general'
};

const DATA_ATTR_CATEGORY_MAP: Readonly<Record<string, TagCategory>> = {
    'copyright': 'copyright',
    'character': 'character',
    'artist': 'other',
    'style': 'meta',
    'general': 'general',
    'meta': 'meta',
    'species': 'general',
};

const HEADER_TEXT_CATEGORY_MAP: Readonly<Record<string, TagCategory>> = {
    'copyright': 'copyright', 'source:': 'copyright',
    'character': 'character', 'characters:': 'character',
    'general': 'general', 'tags:': 'general',
    'meta': 'meta', 'metadata': 'meta',
    'artist': 'other', 'artists': 'other'
};

const KNOWN_CATEGORY_NAMES = new Set<string>([
    'copyrights', 'characters', 'general', 'meta', 'metadata', 'artists', 'tag list', '?', 'tagme (character)'
]);

const utils = {
    getCategoryFromClassList: (element: Element | null): TagCategory => {
        if (!element) return 'general';
        for (const className of element.classList) {
            const category = CLASS_CATEGORY_MAP[className];
            if (category) return category;
        }
        const parentCategoryElement = element.closest('[class*="tag-type-"], [class*=" copyright"], [class*=" character"], [class*=" artist"], [class*=" meta"]');
        if (parentCategoryElement && parentCategoryElement !== element) {
            return utils.getCategoryFromClassList(parentCategoryElement);
        }
        return 'general';
    },
    getCategoryFromMap: (map: Readonly<Record<string, TagCategory>>, key: string | undefined | null, defaultCategory: TagCategory = 'other'): TagCategory => {
        return key ? map[key.toLowerCase()] ?? defaultCategory : defaultCategory;
    },
    getCategoryFromHeaderText: (text: string | null | undefined): TagCategory => {
        const normalized = text?.toLowerCase().trim() ?? '';
        for (const key in HEADER_TEXT_CATEGORY_MAP) {
            if (normalized.includes(key)) return HEADER_TEXT_CATEGORY_MAP[key];
        }
        return 'other';
    },
    cleanTagName: (tagName: string): string => {
        return tagName.replace(/ \(\d+\.?\d*[kM]?\)$/, '').replace(/^[?\s]+/, '').trim();
    },
    extractTags: (doc: Document, config: {
        containerSelector: string,
        tagSelector: string,
        categoryStrategy: (element: Element) => TagCategory,
        nameSelector?: string
    }): ExtractedTag[] => {
        const tags = new Map<string, ExtractedTag>();
        doc.querySelectorAll(config.containerSelector).forEach(element => {
            const tagElement = config.nameSelector ? element.querySelector(config.nameSelector) : element.querySelector(config.tagSelector);
            const tagName = tagElement?.textContent?.trim();
            if (tagName) {
                const cleanName = utils.cleanTagName(tagName);
                const category = config.categoryStrategy(element);
                if (cleanName && !KNOWN_CATEGORY_NAMES.has(cleanName.toLowerCase()) && cleanName.toLowerCase() !== category) {
                    tags.set(`${category}-${cleanName}`, { name: cleanName, category });
                }
            }
        });
        return Array.from(tags.values());
    },
    extractTagsBySection: (doc: Document, sectionSelector: string, tagLinkSelector: string): ExtractedTag[] => {
        const tags = new Map<string, ExtractedTag>();
        let currentCategory: TagCategory = 'other';
        const container = doc.querySelector(sectionSelector);
        if (!container) return [];

        Array.from(container.children).forEach(child => {
            const headerText = child.textContent;
            if ((child.matches('h3, h6, .tag-type-header, .tag-sidebar-header') || (child.matches('li') && child.querySelector('h6'))) && headerText) {
                 currentCategory = utils.getCategoryFromHeaderText(headerText);
            }
            else if (child.matches('ul, li.tag')) {
                const listItems = child.matches('ul') ? Array.from(child.children) : [child];
                listItems.forEach(tagLi => {
                    if (tagLi.matches('li')) {
                        let itemCategory = utils.getCategoryFromClassList(tagLi);
                        if (itemCategory === 'general' && currentCategory !== 'general') itemCategory = currentCategory;

                        const tagElement = tagLi.querySelector(tagLinkSelector);
                        const tagName = tagElement?.textContent?.trim();
                        if (tagName) {
                            const cleanName = utils.cleanTagName(tagName);
                            if (cleanName && !KNOWN_CATEGORY_NAMES.has(cleanName.toLowerCase())) {
                                tags.set(`${itemCategory}-${cleanName}`, { name: cleanName, category: itemCategory });
                            }
                        }
                    }
                });
            }
        });
        return Array.from(tags.values());
    },
    extractImageUrl: (doc: Document, selector: string, attribute: string = 'src'): string | undefined => {
        const element = doc.querySelector(selector);
        if (!element) return undefined;
        let src = element.getAttribute(attribute) ?? element.getAttribute('src');
        if (element.tagName === 'VIDEO' && !src) {
            src = element.querySelector('source')?.src ?? null;
        }
        if (!src) return undefined;

        if (src.startsWith('//')) src = `https:${src}`;
        try {
            return new URL(src, doc.baseURI).href;
        } catch (e) {
            console.error(`Invalid URL: ${src} against base: ${doc.baseURI}`, e);
            return src.startsWith('http') ? src : undefined;
        }
    },
    extractTitle: (doc: Document, customSelector?: string): string | undefined => {
        let title: string | null | undefined;
        const selectors = [
            customSelector,
            'meta[property="og:title"]',
            'h1',
            'img[alt]',
            'title'
        ].filter(Boolean) as string[];

        for (const sel of selectors) {
            const element = doc.querySelector(sel);
            if (sel.startsWith('attr:')) {
                 const attrName = sel.substring(5);
                 title = doc.querySelector(`[${attrName}]`)?.getAttribute(attrName);
            } else if (element) {
                 title = (element as HTMLImageElement).alt ?? element.textContent;
            }
            if (title) break;
        }
        title = title ?? doc.title;
        if (!title) return undefined;

        const sitePatterns = /^(Danbooru|Safebooru|Gelbooru|Rule 34|Yande\.re|Konachan\.com - Anime Wallpapers|Zerochan Anime Image Board|E-Shuushuu|AIBooru|e621)\s*[-|»]?\s*/i;
        const siteSuffixPatterns = /\s*[-|»]?\s*(Danbooru|Safebooru|Gelbooru|Rule 34|Yande\.re|Konachan\.com - Anime Wallpapers|Zerochan Anime Image Board|E-Shuushuu|AIBooru|e621)$/i;
        const cleanupPatterns: [RegExp, string][] = [
            [sitePatterns, ''],
            [siteSuffixPatterns, ''],
            [/\s*[-|»]?\s*(?:Post|Image)\s+#\d+$/i, ''],
            [/ \| Anime-Pictures\.net$/i, ''],
            [/ on e621$/i, ''],
            [/\s+\(?\d+[x✕]\d+(\s+\d+(\.\d+)?\s*k?B)?\)?$/i, ''],
            [/^Post #\d+\s*[-|»]?\s*/i, ''],
            [/^Image #\d+\s*[-|»]?\s*/i, ''],
            [/\s+/g, ' ']
        ];

        let cleanedTitle = cleanupPatterns.reduce((t, [regex, replacement]) => t.replace(regex, replacement), title).trim();

        if (/^(image|post)$/i.test(cleanedTitle) || /^\d+$/.test(cleanedTitle)) {
            cleanedTitle = '';
        }

        const zerochanImgTitle = doc.querySelector('#large > a.preview > img.jpg')?.getAttribute('title');
        if (zerochanImgTitle && (cleanedTitle === '' || cleanedTitle.toLowerCase().includes('zerochan'))) {
            const potentialTitle = zerochanImgTitle.split(' (')[0].trim();
             if (potentialTitle && potentialTitle.length > cleanedTitle.length) {
                 cleanedTitle = potentialTitle;
             }
        }

        const tagListHeuristicPattern = /^(?:[\w:]+\s+){5,}/;
        if (tagListHeuristicPattern.test(cleanedTitle) && cleanedTitle.split(' ').length > 10) {
           return undefined;
        }

        return cleanedTitle.length >= 3 ? cleanedTitle : undefined;
    }
};

export const extractionStrategies = {
    danbooru: (doc: Document): ExtractionResult => ({
        tags: groupTags(utils.extractTags(doc, { containerSelector: '#tag-list li[class*="tag-type-"]', tagSelector: 'a.search-tag', categoryStrategy: utils.getCategoryFromClassList })),
        imageUrl: utils.extractImageUrl(doc, '#image'),
        title: utils.extractTitle(doc)
    }),
    safebooru: (doc: Document): ExtractionResult => ({
        tags: groupTags(utils.extractTagsBySection(doc, '#tag-sidebar', 'a[href*="page=post"]:last-of-type')),
        imageUrl: utils.extractImageUrl(doc, '#image'),
        title: utils.extractTitle(doc)
    }),
    gelbooru: (doc: Document): ExtractionResult => ({
        tags: groupTags(utils.extractTags(doc, { containerSelector: '.tag-list li[class*="tag-type-"], #tag-sidebar li[class*="tag-type-"]', tagSelector: 'a[href*="page=post"]', categoryStrategy: utils.getCategoryFromClassList })),
        imageUrl: utils.extractImageUrl(doc, '#image, #gelcomVideoPlayer source'),
        title: utils.extractTitle(doc)
    }),
    rule34: (doc: Document): ExtractionResult => ({
        tags: groupTags(utils.extractTagsBySection(doc, '#tag-sidebar, .sidebar > div:last-of-type', 'a[href*="page=post"]')),
        imageUrl: utils.extractImageUrl(doc, '#image, #gelcomVideoPlayer source, video#videoelement source'),
        title: utils.extractTitle(doc)
    }),
    e621: (doc: Document): ExtractionResult => ({
        tags: groupTags(utils.extractTags(doc, {
            containerSelector: 'section#tag-list > ul > li.tag-list-item',
            tagSelector: 'a.tag-list-search > span:not(.tag-list-count)',
            categoryStrategy: (el) => utils.getCategoryFromMap(DATA_ATTR_CATEGORY_MAP, el.getAttribute('data-category'), 'other')
        })),
        imageUrl: utils.extractImageUrl(doc, '#image, #image-container img, #image-container video source'),
        title: utils.extractTitle(doc, 'attr:data-title') ?? utils.extractTitle(doc, '#image-container h5') ?? utils.extractTitle(doc)
    }),
    aibooru: (doc: Document): ExtractionResult => ({
        tags: groupTags(utils.extractTags(doc, { containerSelector: 'div.categorized-tag-list li[class*="tag-type-"]', tagSelector: 'a.search-tag', categoryStrategy: utils.getCategoryFromClassList })),
        imageUrl: utils.extractImageUrl(doc, '#image'),
        title: utils.extractTitle(doc)
    }),
    yandere: (doc: Document): ExtractionResult => ({
        tags: groupTags(utils.extractTags(doc, { containerSelector: '#tag-sidebar li[class*="tag-type-"]', tagSelector: 'a[href*="/post?tags="]', categoryStrategy: utils.getCategoryFromClassList })),
        imageUrl: utils.extractImageUrl(doc, '#image, img.fit-width'),
        title: utils.extractTitle(doc)
    }),
    konachan: (doc: Document): ExtractionResult => ({
        tags: groupTags(utils.extractTags(doc, {
            containerSelector: 'ul#tag-sidebar li.tag-link',
            tagSelector: 'a:nth-of-type(2)',
            categoryStrategy: (el) => utils.getCategoryFromMap(DATA_ATTR_CATEGORY_MAP, el.getAttribute('data-type'), 'other')
        })),
        imageUrl: utils.extractImageUrl(doc, '#image'),
        title: utils.extractTitle(doc)
    }),
    animePictures: (doc: Document): ExtractionResult => ({
        tags: groupTags(utils.extractTags(doc, {
             containerSelector: 'ul.tags li a.svelte-1a4tkgo',
             tagSelector: 'self',
             nameSelector: 'self',
             categoryStrategy: utils.getCategoryFromClassList
        })),
        imageUrl: utils.extractImageUrl(doc, 'img#big_preview'),
        title: utils.extractTitle(doc, 'img#big_preview') ?? utils.extractTitle(doc)
    }),
    zerochan: (doc: Document): ExtractionResult => {
        const tagsArray: ExtractedTag[] = [];
        doc.querySelector('#large > p')?.textContent?.trim().split(',').forEach(name => {
            const cleanName = name.trim();
            if (cleanName) tagsArray.push({ name: cleanName, category: 'general' });
        });
        return {
            tags: groupTags(tagsArray),
            imageUrl: utils.extractImageUrl(doc, '#large > a.preview', 'href') ?? utils.extractImageUrl(doc, '#large > a.preview > img.jpg'),
            title: utils.extractTitle(doc)
        };
    },
    eShuushuu: (doc: Document): ExtractionResult => {
        const tagsArray: ExtractedTag[] = [];
        doc.querySelectorAll('div.meta dl dt').forEach(dt => {
            const category = utils.getCategoryFromMap(HEADER_TEXT_CATEGORY_MAP, dt.textContent, 'general');
            const dd = dt.nextElementSibling;
            if (dd?.matches('dd.quicktag')) {
                dd.querySelectorAll<HTMLAnchorElement>('span.tag a').forEach(link => {
                    const tagName = link.textContent?.trim();
                    if (tagName) {
                        const cleanName = utils.cleanTagName(tagName);
                        if (cleanName) tagsArray.push({ name: cleanName, category });
                    }
                });
            }
        });
        return {
            tags: groupTags(tagsArray),
            imageUrl: utils.extractImageUrl(doc, 'a.thumb_image', 'href'),
            title: utils.extractTitle(doc, 'div.title h2 a') ?? utils.extractTitle(doc)
        }
    }
};

export const BOORU_SITES = [
    { name: 'Danbooru', urlPattern: /danbooru\.donmai\.us\/posts\/\d+/i, extractTags: extractionStrategies.danbooru },
    { name: 'Safebooru (Donmai)', urlPattern: /safebooru\.donmai\.us\/posts\/\d+/i, extractTags: extractionStrategies.danbooru },
    { name: 'Safebooru (Org)', urlPattern: /safebooru\.org\/(index\.php\?page=post&s=view&id=\d+|post\/view\/\d+)/i, extractTags: extractionStrategies.safebooru },
    { name: 'Gelbooru', urlPattern: /gelbooru\.com\/index\.php\?page=post&s=view&id=\d+/i, extractTags: extractionStrategies.gelbooru },
    { name: 'Rule34', urlPattern: /rule34\.xxx\/index\.php\?page=post&s=view&id=\d+/i, extractTags: extractionStrategies.rule34 },
    { name: 'e621', urlPattern: /e621\.net\/posts\/\d+/i, extractTags: extractionStrategies.e621 },
    { name: 'AIBooru', urlPattern: /aibooru\.online\/posts\/\d+/i, extractTags: extractionStrategies.aibooru },
    { name: 'Yande.re', urlPattern: /yande\.re\/post\/show\/\d+/i, extractTags: extractionStrategies.yandere },
    { name: 'Konachan', urlPattern: /konachan\.(?:com|net)\/post\/show\/\d+/i, extractTags: extractionStrategies.konachan },
    { name: 'Anime-Pictures', urlPattern: /anime-pictures\.net\/posts\/\d+/i, extractTags: extractionStrategies.animePictures },
    { name: 'Zerochan', urlPattern: /zerochan\.net\/\d+/i, extractTags: extractionStrategies.zerochan },
    { name: 'E-Shuushuu', urlPattern: /e-shuushuu\.net\/image\/\d+/i, extractTags: extractionStrategies.eShuushuu }
];

export const DEFAULT_TAG_CATEGORIES: TagCategoryOption[] = [
    { id: 'copyright', label: 'Copyright', enabled: true, variable: '--cat-color-copyright-rgb' },
    { id: 'character', label: 'Character', enabled: true, variable: '--cat-color-character-rgb' },
    { id: 'general', label: 'General', enabled: true, variable: '--cat-color-general-rgb' },
    { id: 'meta', label: 'Meta', enabled: true, variable: '--cat-color-meta-rgb' },
    { id: 'other', label: 'Other', enabled: true, variable: '--cat-color-other-rgb' }
];