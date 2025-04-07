export type TagCategory = 'copyright' | 'character' | 'general' | 'meta' | 'other';
export type TagCategoryOption = { id: TagCategory; label: string; enabled: boolean; variable: string };
export interface ExtractedTag { name: string; category: TagCategory }
export interface ExtractionResult { tags: Partial<Record<TagCategory, string[]>>; imageUrl?: string; title?: string }

const grp = (t: ExtractedTag[]): Partial<Record<TagCategory, string[]>> =>
    t.reduce((a, i) => { (a[i.category] ??= []).push(i.name); return a; }, {} as Partial<Record<TagCategory, string[]>>);

const C_MAP: Readonly<Record<string, TagCategory>> = {
    'tag-type-copyright': 'copyright', 'tag-type-3': 'copyright', 'copyright': 'copyright',
    'tag-type-character': 'character', 'tag-type-4': 'character', 'character': 'character',
    'tag-type-artist': 'other', 'tag-type-1': 'other', 'artist': 'other',
    'tag-type-metadata': 'meta', 'tag-type-5': 'meta', 'tag-type-meta': 'meta', 'tag-type-style': 'meta', 'style': 'meta',
    'tag-type-general': 'general', 'tag-type-0': 'general', 'reference': 'general', 'object': 'general', 'general': 'general'
};
const D_MAP: Readonly<Record<string, TagCategory>> = { 'copyright': 'copyright', 'character': 'character', 'artist': 'other', 'style': 'meta', 'general': 'general', 'meta': 'meta', 'species': 'general' };
const H_MAP: Readonly<Record<string, TagCategory>> = { 'copyright': 'copyright', 'source:': 'copyright', 'character': 'character', 'characters:': 'character', 'general': 'general', 'tags:': 'general', 'meta': 'meta', 'metadata': 'meta', 'artist': 'other', 'artists': 'other' };
const K_NAMES = new Set<string>(['copyrights', 'characters', 'general', 'meta', 'metadata', 'artists', 'tag list', '?', 'tagme (character)']);

interface PixivTagInfo {
    tag: string;
    translation?: {
        en?: string;
    };
}

const u = {
    cls: (e: Element | null): TagCategory => {
        if (!e) return 'general';
        for (const cn of e.classList) { const c = C_MAP[cn]; if (c) return c; }
        const p = e.closest('[class*="tag-type-"], [class*=" copyright"], [class*=" character"], [class*=" artist"], [class*=" meta"]');
        return (p && p !== e) ? u.cls(p) : 'general';
    },
    map: (m: Readonly<Record<string, TagCategory>>, k: string | null | undefined, d: TagCategory = 'other'): TagCategory => k ? m[k.toLowerCase()] ?? d : d,
    hdr: (t: string | null | undefined): TagCategory => { const n = t?.toLowerCase().trim() ?? ''; const k = Object.keys(H_MAP).find(key => n.includes(key)); return k ? H_MAP[k] : 'other'; },
    cln: (n: string): string => n.replace(/ \(\d+\.?\d*[kM]?\)$/, '').replace(/ \d+$/, '').replace(/^[?\s]+/, '').trim(),
    tags: (d: Document, c: { s: string, ts: string, cat: (e: Element) => TagCategory, ns?: string }): ExtractedTag[] => {
        const tgs = new Map<string, ExtractedTag>();
        d.querySelectorAll(c.s).forEach(e => {
            const nEl = c.ns ? e.querySelector(c.ns) : e.querySelector(c.ts);
            const name = nEl?.textContent?.trim();
            if (!name) return;
            const cl = u.cln(name); const cat = c.cat(e); const low = cl.toLowerCase();
            if (cl && !K_NAMES.has(low) && low !== cat) tgs.set(`${cat}-${cl}`, { name: cl, category: cat });
        });
        return Array.from(tgs.values());
    },
    sect: (d: Document, ss: string, ls: string): ExtractedTag[] => {
        const tgs = new Map<string, ExtractedTag>(); let cur: TagCategory = 'other';
        const cont = d.querySelector(ss); if (!cont) return [];
        Array.from(cont.children).forEach(ch => {
            const h = ch.matches('h5, h3, h6, .tag-type-header, .tag-sidebar-header') ? ch : (ch.matches('li') ? ch.querySelector('h6, h5, h3') : null);
            if (h) cur = u.hdr(h.textContent);
            else if (ch.matches('ul, li.tag, div[id*="_list"] > ul')) {
                const p = ch.matches('ul') ? ch : (ch.matches('div[id*="_list"]') ? ch.querySelector('ul') : null);
                const itms = p ? Array.from(p.children) : (ch.matches('li.tag') ? [ch] : []);
                itms.forEach(li => {
                    if (!li.matches('li')) return; let iCat = u.cls(li);
                    if (iCat === 'general' && cur !== 'general') iCat = cur;
                    const name = li.querySelector(ls)?.textContent?.trim(); if (!name) return;
                    const cl = u.cln(name);
                    if (cl && !K_NAMES.has(cl.toLowerCase())) tgs.set(`${iCat}-${cl}`, { name: cl, category: iCat });
                });
            }
        });
        return Array.from(tgs.values());
    },
    img: (d: Document, s: string, a: string = 'src'): string | undefined => {
        const e = d.querySelector(s); if (!e) return undefined;
        let url: string | null | undefined = e.getAttribute(a) ?? e.getAttribute('src');
        if (e.tagName === 'VIDEO' && !url) url = e.querySelector('source')?.src ?? null;
        if (!url) return undefined; if (url.startsWith('//')) url = `https:${url}`;
        try { return new URL(url, d.baseURI).href; } catch { return url.startsWith('http') ? url : undefined; }
    },
    tit: (d: Document, cs?: string): string | undefined => {
        let t: string | null | undefined;
        const sels = [cs, 'meta[property="og:title"]', 'h1', 'img[alt]', 'title'].filter(Boolean) as string[];
        for (const s of sels) {
            if (s && s.startsWith('attr:')) t = d.querySelector(`[${s.substring(5)}]`)?.getAttribute(s.substring(5));
            else if (s) { const e = d.querySelector(s); t = (e as HTMLImageElement)?.alt ?? e?.textContent; }
            if (t) break;
        }
        t = t?.trim() ?? d.title?.trim(); if (!t) return undefined;
        const rgx: [RegExp, string][] = [
            [/^(Danbooru|Safebooru|Gelbooru|Rule 34|Yande\.re|Konachan\.com - Anime Wallpapers|Zerochan Anime Image Board|E-Shuushuu|AIBooru|e621|TBIB|Hijiribe|Scatbooru|pixiv)\s*[-|»]?\s*/i, ''],
            [/\s*[-|»]?\s*(Danbooru|Safebooru|Gelbooru|Rule 34|Yande\.re|Konachan\.com - Anime Wallpapers|Zerochan Anime Image Board|E-Shuushuu|AIBooru|e621|TBIB|Hijiribe|Scatbooru|pixiv)$/i, ''],
            [/\s*[-|»]?\s*(?:Post|Image|Artwork)\s+#?\d+$/i, ''], [/ \| Anime-Pictures\.net$/i, ''], [/ on e621$/i, ''], [/ - pixiv$/i, ''],
            [/\s+\(?\d+[x✕]\d+(\s+\d+(\.\d+)?\s*k?B)?\)?$/i, ''], [/^Post #\d+\s*[-|»]?\s*/i, ''], [/^Image #\d+\s*[-|»]?\s*/i, ''], [/^\d+\s*[-|»]?\s*/i, ''], [/\s+/g, ' ']
        ];
        let cl = rgx.reduce((str, [re, rp]) => str.replace(re, rp), t).trim();
        if (/^(image|post|artwork)$/i.test(cl) || /^\d+$/.test(cl)) cl = '';
        const zTit = d.querySelector('#large > a.preview > img.jpg')?.getAttribute('title');
        if (zTit && (!cl || cl.toLowerCase().includes('zerochan'))) {
            const p = zTit.split(' (')[0].trim(); if (p && p.length > cl.length) cl = p;
        }
        if (/^(?:[\w:]+\s+){5,}/.test(cl) && cl.split(' ').length > 10) return undefined;
        return cl.length >= 3 ? cl : undefined;
    }
};

export const extractionStrategies = {
    danbooru: (d: Document): ExtractionResult => ({ tags: grp(u.tags(d, { s: '#tag-list li[class*="tag-type-"], div.categorized-tag-list li[class*="tag-type-"]', ts: 'a.search-tag', cat: u.cls })), imageUrl: u.img(d, '#image'), title: u.tit(d) }),
    safebooru: (d: Document): ExtractionResult => ({ tags: grp(u.sect(d, '#tag-sidebar', 'a[href*="page=post"]:last-of-type')), imageUrl: u.img(d, '#image'), title: u.tit(d) }),
    gelbooru: (d: Document): ExtractionResult => ({ tags: grp(u.tags(d, { s: '.tag-list li[class*="tag-type-"], #tag-sidebar li[class*="tag-type-"]', ts: 'a[href*="page=post"]', cat: u.cls })), imageUrl: u.img(d, '#image, #gelcomVideoPlayer source'), title: u.tit(d) }),
    rule34: (d: Document): ExtractionResult => ({ tags: grp(u.sect(d, '#tag-sidebar, .sidebar > div:last-of-type', 'a[href*="page=post"]')), imageUrl: u.img(d, '#image, #gelcomVideoPlayer source, video#videoelement source'), title: u.tit(d) }),
    e621: (d: Document): ExtractionResult => ({ tags: grp(u.tags(d, { s: 'section#tag-list > ul > li.tag-list-item', ts: 'a.tag-list-search > span:not(.tag-list-count)', cat: e => u.map(D_MAP, e.getAttribute('data-category'), 'other') })), imageUrl: u.img(d, '#image, #image-container img, #image-container video source'), title: u.tit(d, 'attr:data-title') ?? u.tit(d, '#image-container h5') ?? u.tit(d) }),
    aibooru: (d: Document): ExtractionResult => ({ tags: grp(u.tags(d, { s: 'div.categorized-tag-list li[class*="tag-type-"]', ts: 'a.search-tag', cat: u.cls })), imageUrl: u.img(d, '#image'), title: u.tit(d) }),
    yandere: (d: Document): ExtractionResult => ({ tags: grp(u.tags(d, { s: '#tag-sidebar li[class*="tag-type-"]', ts: 'a[href*="/post?tags="]', cat: u.cls })), imageUrl: u.img(d, '#image, img.fit-width'), title: u.tit(d) }),
    konachan: (d: Document): ExtractionResult => ({ tags: grp(u.tags(d, { s: 'ul#tag-sidebar li.tag-link', ts: 'a:nth-of-type(2)', cat: e => u.map(D_MAP, e.getAttribute('data-type'), 'other') })), imageUrl: u.img(d, '#image'), title: u.tit(d) }),
    animePictures: (d: Document): ExtractionResult => ({ tags: grp(u.tags(d, { s: 'ul.tags li a.svelte-1a4tkgo', ts: 'self', ns: 'self', cat: u.cls })), imageUrl: u.img(d, 'img#big_preview'), title: u.tit(d, 'img#big_preview') ?? u.tit(d) }),
    zerochan: (d: Document): ExtractionResult => ({ tags: grp((d.querySelector('#large > p')?.textContent?.trim().split(',') ?? []).map(u.cln).filter(Boolean).map(name => ({ name, category: 'general' as TagCategory }))), imageUrl: u.img(d, '#large > a.preview', 'href') ?? u.img(d, '#large > a.preview > img.jpg'), title: u.tit(d) }),
    eShuushuu: (d: Document): ExtractionResult => ({ tags: grp(Array.from(d.querySelectorAll('div.meta dl dt')).flatMap(dt => { const cat = u.map(H_MAP, dt.textContent, 'general'); const dd = dt.nextElementSibling; return dd?.matches('dd.quicktag') ? Array.from(dd.querySelectorAll<HTMLAnchorElement>('span.tag a')).map(a => u.cln(a.textContent?.trim() ?? '')).filter(Boolean).map(name => ({ name, category: cat })) : []; })), imageUrl: u.img(d, 'a.thumb_image', 'href'), title: u.tit(d, 'div.title h2 a') ?? u.tit(d) }),
    tbib: (d: Document): ExtractionResult => ({ tags: grp(u.sect(d, '#tag-sidebar', 'a[href*="page=post"]')), imageUrl: u.img(d, '#image, #gelcomVideoPlayer source'), title: u.tit(d) }),
    scatbooru: (d: Document): ExtractionResult => { const t = [...u.tags(d, { s: '#artist_list li', ts: 'a[href*="?page=post&s=list&tags="]', cat: () => 'copyright' as TagCategory }), ...u.tags(d, { s: '#tag_list li', ts: 'a[href*="?page=post&s=list&tags="]', cat: () => 'general' as TagCategory })]; return { tags: grp(Array.from(new Map(t.map(i => [`${i.category}-${i.name}`, i])).values())), imageUrl: u.img(d, '#image'), title: u.tit(d) }; },
    pixiv: (d: Document): ExtractionResult => { const p = (() => { try { return JSON.parse(d.getElementById('meta-preload-data')?.getAttribute('content') || 'null'); } catch { return null; } })(); const iid = d.location.pathname.match(/\/(\d+)$/)?.[1]; const il = (p && iid) ? p.illust?.[iid] : null; const us = (p && il) ? p.user?.[il.userId] : null; const pt = il?.tags?.tags?.map((t: PixivTagInfo) => ({ name: u.cln(t.translation?.en ?? t.tag), category: 'general' as TagCategory })) ?? []; const t = grp(pt.length ? pt : Array.from(d.querySelectorAll('figcaption div[role="presentation"] a[href*="/tags/"]')).map(el => ({ name: u.cln(el.textContent?.trim() ?? ''), category: 'general' as TagCategory })).filter(tg => tg.name)); const rimg = il?.urls?.original ?? d.querySelector('main div[role="presentation"] a > img')?.getAttribute('src'); const aimg = (rimg && !rimg.startsWith('http')) ? (() => { try { return new URL(rimg, d.baseURI).href } catch { return rimg }})() : rimg; const img = aimg?.includes('i.pximg.net/img-master') ? aimg.replace('/img-master/', '/img-original/').replace('_master1200', '').replace(/\.(jpg|png|gif)$/, '.png').replace(/(?<!\.png)$/, '.png') : aimg; const tr = il?.illustTitle ?? u.tit(d, 'meta[property="og:title"]'); const ta = us?.name; const te = (tr && ta) ? `${tr} by ${ta}` : tr; const tit = (te ?? u.tit(d))?.replace(/ - pixiv$/, '').trim(); return { tags: t, imageUrl: img, title: tit }; },
    furaffinity: (d: Document): ExtractionResult => {
        const generalTags: ExtractedTag[] = Array.from(d.querySelectorAll('section.tags-row span.tags a'))
            .map(a => ({ name: u.cln(a.textContent?.trim() ?? ''), category: 'general' as TagCategory }))
            .filter(t => t.name);

        const artistElement = d.querySelector('div.submission-id-sub-container .c-usernameBlockSimple a .c-usernameBlockSimple__displayName');
        const copyrightTags: ExtractedTag[] = [];
        if (artistElement) {
            const artistName = u.cln(artistElement.textContent?.trim() ?? '');
            if (artistName) {
                copyrightTags.push({ name: artistName, category: 'copyright' as TagCategory });
            }
        }

        const allTags = [...generalTags, ...copyrightTags];
        const tags = grp(allTags);

        const imageUrl = u.img(d, 'img#submissionImg', 'data-fullview-src');

        const title = u.tit(d, 'div.submission-title h2 p');

        return { tags, imageUrl, title };
    }
};

export const BOORU_SITES = [
    { name: 'Danbooru', urlPattern: /danbooru\.donmai\.us\/posts\/\d+/i, extractTags: extractionStrategies.danbooru },
    { name: 'Safebooru (Donmai)', urlPattern: /safebooru\.donmai\.us\/posts\/\d+/i, extractTags: extractionStrategies.danbooru },
    { name: 'Hijiribe', urlPattern: /hijiribe\.donmai\.us\/posts\/\d+/i, extractTags: extractionStrategies.danbooru },
    { name: 'Safebooru (Org)', urlPattern: /safebooru\.org\/(index\.php\?page=post&s=view&id=\d+|post\/view\/\d+)/i, extractTags: extractionStrategies.safebooru },
    { name: 'Gelbooru', urlPattern: /gelbooru\.com\/index\.php\?page=post&s=view&id=\d+/i, extractTags: extractionStrategies.gelbooru },
    { name: 'Rule34', urlPattern: /rule34\.xxx\/index\.php\?page=post&s=view&id=\d+/i, extractTags: extractionStrategies.rule34 },
    { name: 'TBIB', urlPattern: /tbib\.org\/index\.php\?page=post&s=view&id=\d+/i, extractTags: extractionStrategies.tbib },
    { name: 'Scatbooru', urlPattern: /scatbooru\.co\.uk\/\?page=post&s=view&id=\d+/i, extractTags: extractionStrategies.scatbooru },
    { name: 'e621', urlPattern: /e621\.net\/posts\/\d+/i, extractTags: extractionStrategies.e621 },
    { name: 'AIBooru', urlPattern: /aibooru\.online\/posts\/\d+/i, extractTags: extractionStrategies.aibooru },
    { name: 'Yande.re', urlPattern: /yande\.re\/post\/show\/\d+/i, extractTags: extractionStrategies.yandere },
    { name: 'Konachan', urlPattern: /konachan\.(?:com|net)\/post\/show\/\d+/i, extractTags: extractionStrategies.konachan },
    { name: 'Anime-Pictures', urlPattern: /anime-pictures\.net\/posts\/\d+/i, extractTags: extractionStrategies.animePictures },
    { name: 'Zerochan', urlPattern: /zerochan\.net\/\d+/i, extractTags: extractionStrategies.zerochan },
    { name: 'E-Shuushuu', urlPattern: /e-shuushuu\.net\/image\/\d+/i, extractTags: extractionStrategies.eShuushuu },
    { name: 'Pixiv', urlPattern: /pixiv\.net(?:\/(?:en|ja))?\/artworks\/\d+/i, extractTags: extractionStrategies.pixiv },
    { name: 'Fur Affinity', urlPattern: /furaffinity\.net\/(?:view|full)\/\d+/i, extractTags: extractionStrategies.furaffinity }
];

export const DEFAULT_TAG_CATEGORIES: TagCategoryOption[] = [
    { id: 'copyright', label: 'Copyright', enabled: true, variable: '--cat-color-copyright-rgb' },
    { id: 'character', label: 'Character', enabled: true, variable: '--cat-color-character-rgb' },
    { id: 'general', label: 'General', enabled: true, variable: '--cat-color-general-rgb' },
    { id: 'meta', label: 'Meta', enabled: true, variable: '--cat-color-meta-rgb' },
    { id: 'other', label: 'Other', enabled: true, variable: '--cat-color-other-rgb' }
];