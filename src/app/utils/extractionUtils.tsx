export type TagCategory = 'copyright' | 'character' | 'general' | 'meta' | 'other';
export type TagCategoryOption = { id: TagCategory; label: string; enabled: boolean; variable: string };
export interface ExtractedTag { name: string; category: TagCategory }
export interface ExtractionResult { tags: Partial<Record<TagCategory, string[]>>; imageUrl?: string; title?: string }

const groupTags = (tags: ExtractedTag[]): Partial<Record<TagCategory, string[]>> => {
    const grouped: Partial<Record<TagCategory, string[]>> = {};
    for (const tag of tags) {
        if (!grouped[tag.category]) {
            grouped[tag.category] = [];
        }
        grouped[tag.category]!.push(tag.name);
    }
    return grouped;
};

const utils = {
    getCategoryFromClassList: (element: Element): TagCategory => {
        const classList = element.classList;
        if (classList.contains('tag-type-copyright') || classList.contains('tag-type-3')) return 'copyright';
        if (classList.contains('tag-type-character') || classList.contains('tag-type-4')) return 'character';
        if (classList.contains('tag-type-general') || classList.contains('tag-type-0')) return 'general';
        if (classList.contains('tag-type-metadata') || classList.contains('tag-type-5') || classList.contains('tag-type-meta') || classList.contains('tag-type-style')) return 'meta';
        if (classList.contains('tag-type-artist') || classList.contains('tag-type-1')) return 'other';
        const parentCategoryElement = element.closest('[class*="tag-type-"]');
        if (parentCategoryElement && parentCategoryElement !== element) {
            return utils.getCategoryFromClassList(parentCategoryElement);
        }
        return 'general';
    },
    getCategoryFromDataType: (dataType: string | undefined | null): TagCategory => {
        switch (dataType?.toLowerCase()) {
            case 'copyright': return 'copyright';
            case 'character': return 'character';
            case 'artist': return 'other';
            case 'style': return 'meta';
            case 'general': return 'general';
            default: return 'other';
        }
    },
    getCategoryFromE621DataAttr: (dataCategory: string | undefined | null): TagCategory => {
        switch (dataCategory?.toLowerCase()) {
            case 'copyright': return 'copyright';
            case 'character': return 'character';
            case 'general': return 'general';
            case 'meta': return 'meta';
            case 'artist': return 'other';
            case 'species': return 'general';
            default: return 'other';
        }
    },
    getCategoryFromHeader: (text: string): TagCategory => {
        const normalized = text.toLowerCase().trim();
        if (normalized.includes('copyright') || normalized.includes('source:')) return 'copyright';
        if (normalized.includes('character')) return 'character';
        if (normalized.includes('general') || normalized.includes('tags:')) return 'general';
        if (normalized.includes('meta') || normalized.includes('metadata')) return 'meta';
        if (normalized.includes('artist')) return 'other';
        return 'other';
    },
    getAnimePicturesCategory: (element: Element): TagCategory => {
        if (element.classList.contains('copyright')) return 'copyright';
        if (element.classList.contains('character')) return 'character';
        if (element.classList.contains('artist')) return 'other';
        if (element.classList.contains('reference')) return 'general';
        if (element.classList.contains('object')) return 'general';
        return 'general';
    },
    cleanTagName: (tagName: string): string => {
        return tagName.replace(/ \(\d+\.?\d*[kM]?\)$/, '').replace(/^\? /, '').trim();
    },
    extractTagsByClass: (doc: Document, selectors: { container: string, tag: string }): ExtractedTag[] => {
        const tags = new Map<string, ExtractedTag>();
        const elements = doc.querySelectorAll(selectors.container);
        elements.forEach(element => {
            const tagElement = element.querySelector(selectors.tag);
            const tagName = tagElement?.textContent?.trim() || '';
            if (tagName) {
                const category = utils.getCategoryFromClassList(element);
                const cleanName = utils.cleanTagName(tagName);
                const tagIsCategoryName = ['copyrights', 'characters', 'general', 'meta', 'metadata', 'artists'].includes(cleanName.toLowerCase()) || cleanName.toLowerCase() === category;
                if (cleanName && !tagIsCategoryName) {
                    tags.set(`${category}-${cleanName}`, { name: cleanName, category });
                }
            }
        });
        return Array.from(tags.values());
    },
    extractTagsBySection: (doc: Document, selector: string, tagLinkSelector: string): ExtractedTag[] => {
        const tags = new Map<string, ExtractedTag>();
        let currentCategory: TagCategory = 'other';
        const container = doc.querySelector(selector);
        if (!container) return [];

        Array.from(container.children).forEach(child => {
            if ((child.tagName === 'H3' || child.tagName === 'H6' || child.classList.contains('tag-type-header') || child.classList.contains('tag-sidebar-header') || (child.tagName === 'LI' && child.querySelector('h6'))) && child.textContent) {
                currentCategory = utils.getCategoryFromHeader(child.textContent);
            }
            else if (child.tagName === 'UL' || (child.tagName === 'LI' && child.classList.contains('tag'))) {
                const listItems = child.tagName === 'UL' ? Array.from(child.children) : [child];
                listItems.forEach(tagLi => {
                    if (tagLi.tagName === 'LI') {
                        let itemCategory = utils.getCategoryFromClassList(tagLi);
                        if (itemCategory === 'general' && currentCategory !== 'general') itemCategory = currentCategory;

                        const tagElement = tagLi.querySelector(tagLinkSelector);
                        const tagName = tagElement?.textContent?.trim();
                        if (tagName) {
                            const cleanName = utils.cleanTagName(tagName);
                            if (cleanName && cleanName.toLowerCase() !== 'tag list' && cleanName.toLowerCase() !== '?') {
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
        const imgElement = doc.querySelector(selector);
        if (!imgElement) return undefined;
        let src = imgElement.getAttribute(attribute) || imgElement.getAttribute('src');
        if (imgElement.tagName === 'VIDEO' && !src) {
            const sourceElement = imgElement.querySelector('source');
            src = sourceElement?.src || null;
        }
        if (!src) return undefined;

        if (!src.startsWith('http') && !src.startsWith('//') && doc.baseURI) {
            try { src = new URL(src, doc.baseURI).href; }
            catch (e) { console.error(`Error resolving relative image URL: ${src} against base: ${doc.baseURI}`, e); return undefined; }
        } else if (src.startsWith('//')) {
            src = `https:${src}`;
        }
        return src;
    },
    extractTitle: (doc: Document, selector: string = 'title'): string | undefined => {
        let title: string | undefined | null;
        const siteNamePattern = /^(Danbooru|Safebooru|Gelbooru|Rule 34|Yande\.re|Konachan\.com - Anime Wallpapers|Zerochan Anime Image Board|E-Shuushuu|AIBooru|e621)\s*[-|»]?\s*/i;
        const siteNameSuffixPattern = /\s*[-|»]?\s*(Danbooru|Safebooru|Gelbooru|Rule 34|Yande\.re|Konachan\.com - Anime Wallpapers|Zerochan Anime Image Board|E-Shuushuu|AIBooru|e621)$/i;
        const postNumPattern = /\s*[-|»]?\s*(?:Post|Image)\s+#\d+$/i;
        const dimensionsPattern = /\s+\(?\d+[x✕]\d+(\s+\d+(\.\d+)?\s*k?B)?\)?$/i;
        const tagListHeuristicPattern = /^(?:[\w:]+\s+){5,}/;
        const zerochanPattern = / \| Anime-Pictures\.net$/i;
        const e621SuffixPattern = / on e621$/i;

        if (selector.startsWith('attr:')) {
            const attrName = selector.substring(5);
            const elementWithAttr = doc.querySelector(`[${attrName}]`);
            title = elementWithAttr?.getAttribute(attrName);
        } else {
            const titleElement = doc.querySelector(selector);
            if (titleElement?.tagName === 'IMG') {
                 title = (titleElement as HTMLImageElement).alt;
            } else if(titleElement?.textContent) {
                title = titleElement.textContent;
            }
        }

        if (!title) {
            const ogTitle = doc.querySelector('meta[property="og:title"]');
            if (ogTitle) title = ogTitle.getAttribute('content');
        }

        if (!title) {
            const h1 = doc.querySelector('h1');
            if (h1?.textContent) title = h1.textContent;
        }

        if (!title) {
             title = doc.title;
        }

        if (!title) return undefined;

        let cleanedTitle = title.trim()
            .replace(siteNamePattern, '')
            .replace(siteNameSuffixPattern, '')
            .replace(postNumPattern, '')
            .replace(zerochanPattern, '')
            .replace(e621SuffixPattern, '')
            .replace(dimensionsPattern, '')
            .replace(/^Post #\d+\s*[-|»]?\s*/i, '')
            .replace(/^Image #\d+\s*[-|»]?\s*/i, '')
            .replace(/\s+/g, ' ')
            .trim();

        if (cleanedTitle.toLowerCase() === 'image' || cleanedTitle.toLowerCase() === 'post' || /^\d+$/.test(cleanedTitle)) {
            cleanedTitle = '';
        }

        const zerochanImgTitle = doc.querySelector('#large > a.preview > img.jpg')?.getAttribute('title');
        if (zerochanImgTitle && (cleanedTitle === '' || cleanedTitle.toLowerCase().includes('zerochan'))) {
            const titleMatch = zerochanImgTitle.match(/^([^(]+)\s+\(/);
            const potentialTitle = titleMatch?.[1]?.trim() || zerochanImgTitle.split(' (')[0].trim();
            if (potentialTitle && potentialTitle.length > cleanedTitle.length) {
                 cleanedTitle = potentialTitle;
            }
        }

        if (tagListHeuristicPattern.test(cleanedTitle) && cleanedTitle.split(' ').length > 10) {
           return undefined;
        }

        if (cleanedTitle.length < 3) return undefined;

        return cleanedTitle;
    }
};

export const extractionStrategies = {
    danbooru: (doc: Document): ExtractionResult => ({
        tags: groupTags(utils.extractTagsByClass(doc, { container: '#tag-list li[class*="tag-type-"]', tag: 'a.search-tag' })),
        imageUrl: utils.extractImageUrl(doc, '#image', 'src'),
        title: utils.extractTitle(doc)
    }),
    safebooru: (doc: Document): ExtractionResult => ({
        tags: groupTags(utils.extractTagsBySection(doc, '#tag-sidebar', 'a[href*="page=post"]:last-of-type')),
        imageUrl: utils.extractImageUrl(doc, '#image', 'src'),
        title: utils.extractTitle(doc)
    }),
    gelbooru: (doc: Document): ExtractionResult => ({
        tags: groupTags(utils.extractTagsByClass(doc, { container: '.tag-list li[class*="tag-type-"], #tag-sidebar li[class*="tag-type-"]', tag: 'a[href*="page=post"]' })),
        imageUrl: utils.extractImageUrl(doc, '#image, #gelcomVideoPlayer source', 'src'),
        title: utils.extractTitle(doc)
    }),
    rule34: (doc: Document): ExtractionResult => ({
        tags: groupTags(utils.extractTagsBySection(doc, '#tag-sidebar, .sidebar > div:last-of-type', 'a[href*="page=post"]')),
        imageUrl: utils.extractImageUrl(doc, '#image, #gelcomVideoPlayer source, video#videoelement source', 'src'),
        title: utils.extractTitle(doc)
    }),
    e621: (doc: Document): ExtractionResult => {
        const tagsArray: ExtractedTag[] = [];
        const listItems = doc.querySelectorAll('section#tag-list > ul > li.tag-list-item');
        listItems.forEach(item => {
            const dataCategory = item.getAttribute('data-category');
            const category = utils.getCategoryFromE621DataAttr(dataCategory);
            const tagNameElement = item.querySelector('a.tag-list-search > span:not(.tag-list-count)');
            const tagName = tagNameElement?.textContent?.trim();
            if (tagName) {
                const cleanName = utils.cleanTagName(tagName);
                if (cleanName) tagsArray.push({ name: cleanName, category });
            }
        });
        return {
            tags: groupTags(tagsArray),
            imageUrl: utils.extractImageUrl(doc, '#image, #image-container img, #image-container video source', 'src'),
            title: utils.extractTitle(doc, 'attr:data-title') || utils.extractTitle(doc, '#image-container h5') || utils.extractTitle(doc)
        };
    },
    aibooru: (doc: Document): ExtractionResult => ({
        tags: groupTags(utils.extractTagsByClass(doc, { container: 'div.categorized-tag-list li[class*="tag-type-"]', tag: 'a.search-tag' })),
        imageUrl: utils.extractImageUrl(doc, '#image', 'src'),
        title: utils.extractTitle(doc)
    }),
    yandere: (doc: Document): ExtractionResult => ({
        tags: groupTags(utils.extractTagsByClass(doc, { container: '#tag-sidebar li[class*="tag-type-"]', tag: 'a[href*="/post?tags="]' })),
        imageUrl: utils.extractImageUrl(doc, '#image') || utils.extractImageUrl(doc, 'img.fit-width'),
        title: utils.extractTitle(doc)
    }),
    konachan: (doc: Document): ExtractionResult => {
        const tagsArray: ExtractedTag[] = [];
        const listItems = doc.querySelectorAll('ul#tag-sidebar li.tag-link');
        listItems.forEach(item => {
            const dataType = item.getAttribute('data-type');
            const category = utils.getCategoryFromDataType(dataType);
            const tagNameElement = item.querySelector('a:nth-of-type(2)');
            const tagName = tagNameElement?.textContent?.trim();
            if (tagName) {
                const cleanName = utils.cleanTagName(tagName);
                if (cleanName && cleanName.toLowerCase() !== 'tagme (character)') {
                    tagsArray.push({ name: cleanName, category });
                }
            }
        });
        return {
            tags: groupTags(tagsArray),
            imageUrl: utils.extractImageUrl(doc, '#image'),
            title: utils.extractTitle(doc)
        };
    },
    animePictures: (doc: Document): ExtractionResult => {
        const tagsArray: ExtractedTag[] = [];
        const tagElements = doc.querySelectorAll('ul.tags li a.svelte-1a4tkgo');
        tagElements.forEach(element => {
            const tagName = element?.textContent?.trim();
            if (tagName) {
                const cleanName = utils.cleanTagName(tagName);
                const category = utils.getAnimePicturesCategory(element);
                if (cleanName) tagsArray.push({ name: cleanName, category });
            }
        });
        return {
            tags: groupTags(tagsArray),
            imageUrl: utils.extractImageUrl(doc, 'img#big_preview'),
            title: utils.extractTitle(doc, 'img#big_preview') || utils.extractTitle(doc)
        };
    },
    zerochan: (doc: Document): ExtractionResult => {
        const tagsArray: ExtractedTag[] = [];
        const tagsString = doc.querySelector('#large > p')?.textContent?.trim();
        if (tagsString) {
            tagsString.split(',').forEach(name => {
                const cleanName = name.trim();
                if (cleanName) tagsArray.push({ name: cleanName, category: 'general' });
            });
        }
        return {
            tags: groupTags(tagsArray),
            imageUrl: utils.extractImageUrl(doc, '#large > a.preview', 'href') || utils.extractImageUrl(doc, '#large > a.preview > img.jpg', 'src'),
            title: utils.extractTitle(doc)
        };
    },
    eShuushuu: (doc: Document): ExtractionResult => {
        const tagsArray: ExtractedTag[] = [];
        const metaContainer = doc.querySelector('div.meta dl');
        if (metaContainer) {
            const dtElements = metaContainer.querySelectorAll('dt');
            dtElements.forEach(dt => {
                const headerText = dt.textContent?.trim().toLowerCase();
                let category: TagCategory | null = null;
                switch (headerText) {
                    case 'tags:': category = 'general'; break;
                    case 'source:': category = 'copyright'; break;
                    case 'characters:': category = 'character'; break;
                    case 'artist:': category = 'other'; break;
                }
                if (category) {
                    const dd = dt.nextElementSibling as HTMLElement | null;
                    if (dd?.tagName === 'DD' && dd.classList.contains('quicktag')) {
                        dd.querySelectorAll<HTMLAnchorElement>('span.tag a').forEach(link => {
                            const tagName = link.textContent?.trim();
                            if (tagName) {
                                const cleanName = utils.cleanTagName(tagName);
                                if (cleanName) tagsArray.push({ name: cleanName, category: category as TagCategory });
                            }
                        });
                    }
                }
            });
        }
        return {
            tags: groupTags(tagsArray),
            imageUrl: utils.extractImageUrl(doc, 'a.thumb_image', 'href'),
            title: utils.extractTitle(doc, 'div.title h2 a') || utils.extractTitle(doc)
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