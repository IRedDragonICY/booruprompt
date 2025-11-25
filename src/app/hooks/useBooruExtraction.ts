import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BOORU_SITES, DEFAULT_TAG_CATEGORIES, API_ROUTE_URL, calculateTotalTags } from '../utils/extractionUtils';
import type { TagCategoryOption, ExtractionResult, TagCategory, BooruSite } from '../utils/extractionUtils';
import type { Settings } from '../types/settings';
import type { HistoryEntry } from '../types/history';
import { CLIENT_PROXY_OPTIONS, FETCH_TIMEOUT_MS } from '../constants';
import i18n from '@/lib/i18n';

interface ApiExtractionResponse extends Omit<ExtractionResult, 'tags'> {
    siteName: string;
    tags?: Partial<Record<TagCategory, string[]>>;
    error?: string;
    status?: number;
    html?: string;
}

interface UseBooruExtractionProps {
    settings: Settings;
    activeView: string;
    addHistoryEntry: (entry: HistoryEntry) => void;
}

export function useBooruExtraction({ settings, activeView, addHistoryEntry }: UseBooruExtractionProps) {
    const { t } = useTranslation();
    const [url, setUrl] = useState('');
    const [allExtractedTags, setAllExtractedTags] = useState<Partial<Record<TagCategory, string[]>>>({});
    const [imageUrl, setImageUrl] = useState<string | undefined>();
    const [imageTitle, setImageTitle] = useState<string | undefined>();
    const [displayedTags, setDisplayedTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeSite, setActiveSite] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const [isRetrying, setIsRetrying] = useState(false);
    const [showFullErrorPage, setShowFullErrorPage] = useState(false);
    const [tagCategories, setTagCategories] = useState<TagCategoryOption[]>(DEFAULT_TAG_CATEGORIES);
    const [copySuccess, setCopySuccess] = useState(false);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const currentExtractionUrl = useRef<string | null>(null);
    const retryCountRef = useRef<number>(0);
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const cardBodyRef = useRef<HTMLDivElement>(null);

    const clearAllTimeouts = useCallback(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
            debounceTimeoutRef.current = null;
        }
        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
        }
    }, []);

    const resetRetryState = useCallback(() => {
        setRetryCount(0);
        retryCountRef.current = 0;
        setIsRetrying(false);
        setShowFullErrorPage(false);
    }, []);

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

        if (retryCountRef.current >= 3 && showFullErrorPage) {
            console.log('Blocked extraction attempt: max retry limit (3) already reached.');
            return;
        }

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

        setLoading(true);
        setError('');
        setAllExtractedTags({});
        setImageUrl(undefined);
        setImageTitle(undefined);
        setDisplayedTags('');
        setActiveSite(site.name);
        setCopySuccess(false);
        currentExtractionUrl.current = trimmedUrl;

        const controller = new AbortController();
        const fetchTimeout = FETCH_TIMEOUT_MS + (settings.fetchMode === 'server' ? 2000 : 0);
        const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
        let proxyUsed = '';
        let selectedProxy;

        try {
            let result: ExtractionResult = { tags: {} };
            let errorMsg: string | null = null;
            let siteName = site.name;
            let imgUrl: string | undefined = undefined;
            let imgTitle: string | undefined = undefined;

            if (settings.fetchMode === 'server') {
                proxyUsed = 'Server';
                const response = await fetch(API_ROUTE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ targetUrl: trimmedUrl }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                let data: ApiExtractionResponse;
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
                selectedProxy = CLIENT_PROXY_OPTIONS.find(p => p.value === settings.clientProxyUrl) || CLIENT_PROXY_OPTIONS[0];
                proxyUsed = `Client (${selectedProxy.label})`;
                const proxyUrl = `${selectedProxy.value}${encodeURIComponent(trimmedUrl)}`;
                let html = '';
                let clientErr = '';
                try {
                    const resp = await fetch(proxyUrl, { signal: controller.signal });
                    clearTimeout(timeoutId);
                    if (!resp.ok) clientErr = `Proxy (${selectedProxy.label}) failed: ${resp.status}.`;
                    else {
                        html = await resp.text();
                        if (!html) clientErr = `Proxy (${selectedProxy.label}) empty content.`;
                        else if (selectedProxy.id === 'allorigins') {
                            try {
                                const json = JSON.parse(html);
                                if (json?.contents) html = json.contents;
                                else { clientErr = `Proxy JSON missing 'contents'.`; html = ''; }
                            } catch {
                                if (html.toLowerCase().match(/error|cloudflare/) || html.length < 100) clientErr = `Proxy non-JSON error/block.`;
                            }
                        }
                        if (!html && !clientErr) clientErr = `Proxy empty HTML.`;
                    }
                } catch (err) {
                    clearTimeout(timeoutId);
                    if ((err as Error).name === 'AbortError') clientErr = `Request via ${proxyUsed} timed out.`;
                    else if (err instanceof TypeError && err.message.toLowerCase().includes('failed to fetch')) clientErr = `Failed to connect via ${proxyUsed}.`;
                    else clientErr = `Client fetch error: ${(err as Error).message}`;
                }
                if (clientErr) { errorMsg = clientErr; siteName = ''; }
                else if (!html) { errorMsg = 'Failed HTML fetch via Client Proxy.'; siteName = ''; }
                else {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        try {
                            doc.querySelector('base')?.remove();
                            const head = doc.head || doc.documentElement.appendChild(doc.createElement('head'));
                            const base = doc.createElement('base');
                            base.href = new URL('./', trimmedUrl).href;
                            head.insertBefore(base, head.firstChild);
                        } catch (e) { console.warn(`Base tag set failed:`, e); }
                        
                        const detectPageError = (d: Document) => {
                            let detected = false;
                            let msg = "Check URL/site.";
                            if (d.title.toLowerCase().match(/error|access denied|cloudflare/)) { detected = true; msg = `Site error in title: ${d.title.substring(0, 100)}`; }
                            const errEl = d.querySelector('.error,#error-page,.dtext-error,[class*="error"],[id*="error"],#challenge-running');
                            if (errEl?.textContent?.trim()) {
                                detected = true;
                                const errTxt = errEl.textContent.trim().toLowerCase();
                                if (errTxt.includes("rate limit")) msg = "Rate limit exceeded.";
                                else if (errTxt.includes("login") || errTxt.includes("authenticate")) msg = "Login required.";
                                else if (errTxt.includes("not found")) msg = "Post not found (404).";
                                else if (errTxt.includes("cloudflare")) msg = "Blocked by Cloudflare.";
                                else msg = `Site Error: ${errEl.textContent.trim().substring(0, 150)}`;
                            }
                            if (!detected && d.body) {
                                const bodyTxt = d.body.textContent?.toLowerCase() || '';
                                if (bodyTxt.includes('you must be logged in')) { detected = true; msg = `Login required.`; }
                                else if (bodyTxt.includes('access denied')) { detected = true; msg = `Access denied.`; }
                                else if (bodyTxt.includes('cloudflare')) { detected = true; msg = `Blocked by Cloudflare.`; }
                                else if (bodyTxt.includes('enable javascript')) { detected = true; msg = `Site requires JS/Cookies.`; }
                            }
                            return { detected, msg };
                        };
                        const { detected: pageErr, msg: specificErr } = detectPageError(doc);
                        if (pageErr) { errorMsg = `Extraction stopped: ${specificErr}`; siteName = ''; }
                        else {
                            result = site.extractTags(doc);
                            imgUrl = result.imageUrl;
                            imgTitle = result.title;
                            const tagCount = calculateTotalTags(result.tags || {});
                            if (tagCount === 0) errorMsg = result.imageUrl ? 'Warning: Image found, no tags (Client).' : 'Warning: No tags/image (Client).';
                        }
                    } catch (parseErr) {
                        errorMsg = `Parse/extract failed via ${proxyUsed}: ${(parseErr as Error).message}`;
                        siteName = '';
                    }
                }
            }

            if (errorMsg) {
                setError(errorMsg);
                console.error("Error:", errorMsg, "Mode:", settings.fetchMode, "Proxy:", proxyUsed);
                setActiveSite(siteName || null);

                const isCriticalError = errorMsg.toLowerCase().includes('bad gateway') ||
                                       errorMsg.toLowerCase().includes('403') ||
                                       errorMsg.toLowerCase().includes('timed out') ||
                                       errorMsg.toLowerCase().includes('failed to connect');

                if (isCriticalError && !errorMsg.toLowerCase().includes('warning')) {
                    setShowFullErrorPage(true);

                    if (retryCountRef.current < 3) {
                        if (retryTimeoutRef.current) {
                            clearTimeout(retryTimeoutRef.current);
                            retryTimeoutRef.current = null;
                        }

                        retryCountRef.current += 1;
                        const newRetryCount = retryCountRef.current;
                        setRetryCount(newRetryCount);
                        setIsRetrying(true);

                        const backoffDelay = Math.pow(2, newRetryCount) * 1000;
                        console.log(`Auto-retrying extraction (attempt ${newRetryCount}/3) after ${backoffDelay}ms...`);

                        retryTimeoutRef.current = setTimeout(() => {
                            retryTimeoutRef.current = null;
                            setIsRetrying(false);
                            void extractTags(trimmedUrl);
                        }, backoffDelay);
                    } else {
                        if (retryTimeoutRef.current) {
                            clearTimeout(retryTimeoutRef.current);
                            retryTimeoutRef.current = null;
                        }
                        console.log('Max retry attempts (3) reached. Stopping auto-retry.');
                        setIsRetrying(false);
                    }
                }

                if (!(errorMsg.toLowerCase().includes('warning') && calculateTotalTags(result.tags) > 0)) {
                    setAllExtractedTags({});
                    setImageUrl(undefined);
                    setImageTitle(undefined);
                    currentExtractionUrl.current = null;
                } else {
                    setAllExtractedTags(result.tags || {});
                    setImageUrl(imgUrl);
                    setImageTitle(imgTitle);
                    console.warn("Warning with data:", errorMsg, "URL:", trimmedUrl, "Site:", siteName);
                }
            } else {
                clearAllTimeouts();
                resetRetryState();

                setAllExtractedTags(result.tags || {});
                setImageUrl(imgUrl);
                setImageTitle(imgTitle);
                setActiveSite(siteName);
                setError('');
                const tagCount = calculateTotalTags(result.tags || {});
                if (tagCount > 0) console.log(`Extracted ${tagCount} tags from ${siteName} via ${proxyUsed}.`);
                
                if (settings.saveHistory) {
                    const newEntry: HistoryEntry = {
                        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                        url: trimmedUrl,
                        tags: result.tags || {},
                        imageUrl: imgUrl,
                        title: imgTitle,
                        siteName,
                        timestamp: Date.now()
                    };
                    addHistoryEntry(newEntry);
                }
            }
        } catch (err) {
            clearTimeout(timeoutId);
            const msg = `Unexpected error: ${(err as Error).message}`;
            setError(msg);
            console.error(msg, err);
            setAllExtractedTags({});
            setActiveSite(null);
            setImageUrl(undefined);
            setImageTitle(undefined);
            currentExtractionUrl.current = null;
        } finally {
            setLoading(false);
        }
    }, [loading, settings.fetchMode, settings.clientProxyUrl, settings.saveHistory, settings.enableUnsupportedSites, findSimilarSite, clearAllTimeouts, resetRetryState, addHistoryEntry, showFullErrorPage]);

    const handleReportBug = useCallback(() => {
        const githubIssuesUrl = 'https://github.com/IRedDragonICY/booruprompt/issues/new';
        const issueTitle = encodeURIComponent('502 Gateway Error - Failed to fetch from booru site');
        const issueBody = encodeURIComponent(
            `## Bug Report\n\n` +
            `**Error:** ${error}\n\n` +
            `**URL:** ${url}\n\n` +
            `**Fetch Mode:** ${settings.fetchMode}\n\n` +
            `**Retry Count:** ${retryCount}\n\n` +
            `**Steps to Reproduce:**\n` +
            `1. Paste the URL above\n` +
            `2. Click Extract or enable auto-extract\n` +
            `3. Observe the 502 gateway error\n\n` +
            `**Expected Behavior:**\n` +
            `Tags should be extracted successfully from the booru post.\n\n` +
            `**Additional Context:**\n` +
            `Add any other context about the problem here.`
        );

        window.open(`${githubIssuesUrl}?title=${issueTitle}&body=${issueBody}`, '_blank');
    }, [error, url, settings.fetchMode, retryCount]);

    const handleRetryAgain = useCallback(async () => {
        clearAllTimeouts();
        resetRetryState();
        setError('');
        await extractTags(url);
    }, [url, extractTags, clearAllTimeouts, resetRetryState]);

    const handleReset = useCallback(() => {
        setUrl('');
        setAllExtractedTags({});
        setImageUrl(undefined);
        setImageTitle(undefined);
        setDisplayedTags('');
        setError('');
        setActiveSite(null);
        setTagCategories(DEFAULT_TAG_CATEGORIES);
        setCopySuccess(false);
        setLoading(false);
        resetRetryState();
        clearAllTimeouts();
        currentExtractionUrl.current = null;
        cardBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, [clearAllTimeouts, resetRetryState]);

    const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value), []);
    const handleManualExtract = useCallback(() => {
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        currentExtractionUrl.current = null;
        void extractTags(url.trim());
    }, [extractTags, url]);

    const toggleTagCategory = useCallback((id: TagCategory) => setTagCategories(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c)), []);
    const toggleAllCategories = useCallback((enabled: boolean) => setTagCategories(prev => prev.map(c => ({ ...c, enabled }))), []);

    const handleCopy = useCallback(async () => {
        if (!displayedTags) return;
        try {
            await navigator.clipboard.writeText(displayedTags);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
            setError("Failed to copy.");
        }
    }, [displayedTags]);

    const handleLoadHistoryEntry = useCallback((entry: HistoryEntry) => {
        if (loading) return;
        handleReset();
        setUrl(entry.url);
        setAllExtractedTags(entry.tags ?? {});
        setImageUrl(entry.imageUrl);
        setImageTitle(entry.title);
        setActiveSite(entry.siteName || null);
        currentExtractionUrl.current = entry.url;
        setError('');
        cardBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, [loading, handleReset]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (activeView !== 'extractor') return;
        const types = e.dataTransfer.types;
        e.dataTransfer.dropEffect = (types.includes('text/uri-list') || types.includes('text/plain')) ? 'copy' : 'none';
        setIsDraggingOver(e.dataTransfer.dropEffect === 'copy');
    }, [activeView]);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (activeView !== 'extractor') return;
        setIsDraggingOver(false);
    }, [activeView]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (activeView !== 'extractor') return;
        setIsDraggingOver(false);
        const dropped = (e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain')).trim();
        if (dropped?.startsWith('http')) {
            handleReset();
            currentExtractionUrl.current = null;
            setUrl(dropped);
            setError('');
            if (settings.autoExtract) void extractTags(dropped);
        } else setError("Invalid URL dropped.");
    }, [handleReset, settings.autoExtract, extractTags, activeView]);

    useEffect(() => {
        if (activeView !== 'extractor' || !settings.autoExtract || (showFullErrorPage && retryCountRef.current >= 3)) {
            if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
            return;
        }
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        const trimmedUrl = url.trim();
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
        else if (!trimmedUrl && currentExtractionUrl.current) handleReset();
        else if (trimmedUrl && !trimmedUrl.startsWith('http')) {
            if (trimmedUrl !== currentExtractionUrl.current) setError('URL must start with http:// or https://');
        }
        else if (trimmedUrl && trimmedUrl !== currentExtractionUrl.current) setError('');
        return () => { if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); };
    }, [url, extractTags, settings.autoExtract, settings.enableUnsupportedSites, findSimilarSite, handleReset, activeView, showFullErrorPage]);

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

    useEffect(() => {
        const enabled = new Set(tagCategories.filter(c => c.enabled).map(c => c.id));
        const filteredTags: string[] = [];

        const parseKeywords = (input: string): string[] => input
            .split(/[\n,;]+/)
            .map(k => k.trim().toLowerCase())
            .filter(Boolean);

        const keywords = settings.enableBlacklist ? parseKeywords(settings.blacklistKeywords || i18n.getFixedT('en')('settings.toggles.blacklist.defaultKeywords')) : [];

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

    const tagCounts = useMemo(() => Object.entries(allExtractedTags).reduce((acc, [cat, tags]) => { if (tags) acc[cat as TagCategory] = tags.length; return acc; }, {} as Record<TagCategory, number>), [allExtractedTags]);
    const totalExtractedTagCount = useMemo(() => calculateTotalTags(allExtractedTags), [allExtractedTags]);
    const areAllCategoriesEnabled = useMemo(() => tagCategories.every(c => c.enabled), [tagCategories]);
    const areAllCategoriesDisabled = useMemo(() => !tagCategories.some(c => c.enabled), [tagCategories]);
    const selectedProxyLabel = useMemo(() => CLIENT_PROXY_OPTIONS.find(p => p.value === settings.clientProxyUrl)?.label || t('common.unknown'), [settings.clientProxyUrl, t]);

    return {
        url,
        allExtractedTags,
        imageUrl,
        imageTitle,
        displayedTags,
        loading,
        error,
        activeSite,
        retryCount,
        isRetrying,
        showFullErrorPage,
        tagCategories,
        copySuccess,
        isDraggingOver,
        cardBodyRef,
        tagCounts,
        totalExtractedTagCount,
        areAllCategoriesEnabled,
        areAllCategoriesDisabled,
        selectedProxyLabel,
        setUrl,
        handleUrlChange,
        handleManualExtract,
        handleReset,
        handleRetryAgain,
        handleReportBug,
        toggleTagCategory,
        toggleAllCategories,
        handleCopy,
        handleLoadHistoryEntry,
        handleDragOver,
        handleDragLeave,
        handleDrop
    };
}
