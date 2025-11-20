export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 3600;

import { type NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import { BOORU_SITES, type ExtractionResult, type TagCategory } from '@/app/utils/extractionUtils';

const FETCH_TIMEOUT = 25000;
// Use a mainstream browser UA to avoid simple blocks
const BROWSER_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const BOT_USER_AGENT = 'BooruPrompt/1.0';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS as unknown as HeadersInit });
}

const calculateTotalTags = (tags: Partial<Record<TagCategory, string[]>>): number => {
    return Object.values(tags || {}).reduce((sum, arr) => sum + arr.length, 0);
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const targetUrl = body.targetUrl;

        if (!targetUrl || typeof targetUrl !== 'string' || !targetUrl.startsWith('http')) {
            return NextResponse.json({ error: 'Invalid target URL provided.' }, { status: 400 });
        }

        const site = BOORU_SITES.find(s => s.urlPattern.test(targetUrl));
        if (!site) {
            return NextResponse.json({ error: 'URL does not match supported sites/formats.' }, { status: 400 });
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

        let html: string;

        try {
            const fetchWithUA = async (ua: string, url: string = targetUrl) => {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
                try {
                    const res = await fetch(url, {
                        headers: {
                            'User-Agent': ua,
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                            'Accept-Language': 'en-US,en;q=0.5',
                            'Referer': new URL(url).origin + '/',
                        },
                        cache: 'no-store',
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);
                    return res;
                } catch (e) {
                    clearTimeout(timeoutId);
                    throw e;
                }
            };

            let response = await fetchWithUA(BROWSER_USER_AGENT).catch(() => null);

            // Retry with Bot UA if 403 or 503 (Cloudflare/Protection)
            if (!response || response.status === 403 || response.status === 503) {
                console.log(`[Fetch API] Retrying ${targetUrl} with Bot UA due to ${response ? response.status : 'error'}`);
                const retryResponse = await fetchWithUA(BOT_USER_AGENT).catch(() => null);
                if (retryResponse && (retryResponse.ok || retryResponse.status !== 403)) {
                    response = retryResponse;
                } else if (retryResponse) {
                    // If retry also failed, keep the original response if it existed, or use retry response
                    if (!response) response = retryResponse;
                }
            }

            // Special handling for Konachan.com -> Konachan.net fallback
            if ((!response || !response.ok) && targetUrl.includes('konachan.com')) {
                const fallbackUrl = targetUrl.replace('konachan.com', 'konachan.net');
                console.log(`[Fetch API] Retrying Konachan.com as Konachan.net: ${fallbackUrl}`);
                const fallbackResponse = await fetchWithUA(BROWSER_USER_AGENT, fallbackUrl).catch(() => null);
                if (fallbackResponse && fallbackResponse.ok) {
                    response = fallbackResponse;
                }
            }

            if (!response) {
                 throw new Error('Failed to fetch page (network error)');
            }

            if (!response.ok) {
                let errorText = `Failed to fetch page from target site. Status: ${response.status}`;
                try {
                    const siteError = await response.text();
                    if (siteError && siteError.length < 500) {
                        errorText += ` - ${siteError.substring(0, 100)}${siteError.length > 100 ? '...' : ''}`;
                    }
                } catch { }
                return NextResponse.json({ error: errorText, status: response.status }, { status: 502, headers: CORS_HEADERS });
            }

            html = await response.text();

            if (!html) {
                return NextResponse.json({ error: 'Received empty page response from target site.', status: 502 }, { status: 502, headers: CORS_HEADERS });
            }

        } catch (fetchError: unknown) {
            clearTimeout(timeoutId);
            let errorMessage = 'An unexpected error occurred fetching page data.';
            let status = 500;
            if (fetchError instanceof Error) {
                errorMessage = `Error fetching page: ${fetchError.message}`;
                if (fetchError.name === 'AbortError' || fetchError.message.includes('timed out')) {
                    errorMessage = `Request to target site for page data timed out (${FETCH_TIMEOUT / 1000}s).`;
                    status = 504;
                } else if (fetchError.message.toLowerCase().includes('failed to fetch')) {
                    errorMessage = `Network error fetching page: ${fetchError.message}. Check site or network.`;
                    status = 502;
                }
            }
            return NextResponse.json({ error: errorMessage, status }, { status, headers: CORS_HEADERS });
        }

        try {
            const dom = new JSDOM(html, { url: targetUrl });
            const doc = dom.window.document;

            let pageErrorDetected = false;
            let specificError = "Extraction failed. Check URL, site status, or if login is required.";
            if (doc.title.toLowerCase().includes("error") || doc.title.toLowerCase().includes("access denied") || doc.title.toLowerCase().includes("cloudflare")) { pageErrorDetected = true; specificError = `Site returned error/denial/block in title: ${doc.title.substring(0, 100)}`; }
            const errorElement = doc.querySelector('.error, #error-page, .dtext-error, [class*="error"], [id*="error"], #challenge-running');
            if (errorElement?.textContent && errorElement.textContent.trim().length > 10) {
                pageErrorDetected = true;
                const pageErrorText = errorElement.textContent.trim();
                if (pageErrorText.toLowerCase().includes("rate limit")) specificError = "Rate limit likely exceeded on target site.";
                else if (pageErrorText.toLowerCase().includes("login") || pageErrorText.toLowerCase().includes("authenticate")) specificError = "Content may require login.";
                else if (pageErrorText.toLowerCase().includes("not found") || pageErrorText.toLowerCase().includes("doesn't exist")) specificError = "Post not found (404).";
                else if (pageErrorText.toLowerCase().includes("cloudflare") || pageErrorText.toLowerCase().includes("checking your browser")) specificError = "Blocked by Cloudflare or similar security check.";
                else specificError = `Site Error Detected: ${pageErrorText.substring(0, 150)}`;
            }
            if (!pageErrorDetected && doc.body) {
                const bodyText = doc.body.textContent?.toLowerCase() || '';
                if (bodyText.includes('you must be logged in') || bodyText.includes('requires an account') || bodyText.includes('please login')) { pageErrorDetected = true; specificError = `Content may require login.`; }
                else if (bodyText.includes('access denied')) { pageErrorDetected = true; specificError = `Access denied by target site.`; }
                else if (bodyText.includes('cloudflare') && bodyText.includes('checking your browser')) { pageErrorDetected = true; specificError = `Blocked by Cloudflare or similar security check.`; }
                else if (bodyText.includes('enable javascript') && bodyText.includes('enable cookies')) { pageErrorDetected = true; specificError = `Target site requires JS/Cookies, may be incompatible with extraction.`; }
            }

            if (pageErrorDetected) {
                return NextResponse.json({ error: `Extraction failed: ${specificError}`, status: 422 }, { status: 422, headers: CORS_HEADERS });
            }

            let result: ExtractionResult = site.extractTags(doc);
            let totalTagCount = calculateTotalTags(result.tags || {});
            let imageUrl = result.imageUrl;

            // Pixiv fallback: use JSON API if HTML didn't yield data
            const needsBetterPixivImage = (() => {
                if (site.name !== 'Pixiv') return false;
                if (!imageUrl) return true;
                try {
                    const u = new URL(imageUrl);
                    const isPximg = /(^|\.)i\.pximg\.net$/i.test(u.hostname);
                    const isEmbed = /(^|\.)embed\.pixiv\.net$/i.test(u.hostname) || /artwork\.php$/i.test(u.pathname);
                    const isOgp = /\/ogp\//i.test(u.pathname) || /decorate\.php$/i.test(u.pathname);
                    const hasImageExt = /\.(jpg|jpeg|png|gif|webp)$/i.test(u.pathname);
                    return !isPximg || isEmbed || isOgp || !hasImageExt;
                } catch { return true; }
            })();

            if (site.name === 'Pixiv' && (totalTagCount === 0 || needsBetterPixivImage)) {
                const illustId = new URL(targetUrl).pathname.match(/\/(\d+)$/)?.[1];
                if (illustId) {
                    try {
                        const controllerJson = new AbortController();
                        const timeoutJson = setTimeout(() => controllerJson.abort(), 10000);
                        const jsonResp = await fetch(`https://www.pixiv.net/ajax/illust/${illustId}?lang=en`, {
                            headers: {
                                'User-Agent': BROWSER_USER_AGENT,
                                'Accept': 'application/json,text/plain,*/*',
                                'Referer': 'https://www.pixiv.net/',
                            },
                            cache: 'no-store',
                            signal: controllerJson.signal
                        });
                        clearTimeout(timeoutJson);
                        if (jsonResp.ok) {
                            type PixivAjaxTag = { tag: string; translation?: { en?: string } };
                            type PixivAjaxBody = { illustTitle?: string; userName?: string; urls?: { original?: string; regular?: string; small?: string }; tags?: { tags?: PixivAjaxTag[] } };
                            type PixivAjaxResponse = { body?: PixivAjaxBody };
                            const j: PixivAjaxResponse | null = await jsonResp.json().catch(() => null);
                            const body = j?.body;
                            if (body) {
                                const tags = (body.tags?.tags ?? []).map((t: PixivAjaxTag) => ({ name: (t?.translation?.en ?? t?.tag ?? '').toString().trim(), category: 'general' as TagCategory })).filter(t => t.name);
                                const urls = body.urls || {};
                                const originalUrl: string | undefined = urls.original ?? urls.regular ?? urls.small ?? undefined;
                                const title = body.illustTitle as string | undefined;
                                const userName = body.userName as string | undefined;
                                const composedTitle = (title && userName) ? `${title} by ${userName}` : title;
                                const grouped = Object.keys(result.tags || {}).length > 0 ? result.tags : (tags.length ? { general: tags.map(t => t.name) } : {});
                                const preferPximg = (u?: string) => {
                                    if (!u) return false;
                                    try { return /(^|\.)i\.pximg\.net$/i.test(new URL(u).hostname); } catch { return false; }
                                };
                                const finalImage = preferPximg(originalUrl) ? originalUrl : (imageUrl || originalUrl);
                                if (finalImage || calculateTotalTags(grouped) > 0) {
                                    result = { tags: grouped, imageUrl: finalImage, title: composedTitle || result.title };
                                    totalTagCount = calculateTotalTags(result.tags || {});
                                    imageUrl = result.imageUrl;
                                }
                            }
                        }
                    } catch { /* ignore JSON fallback errors */ }
                }
            }

            if (totalTagCount === 0 && !imageUrl) {
                return NextResponse.json({ error: `Warning: No tags or image found on ${site.name}. Page structure might have changed, post is unavailable, or requires login.`, siteName: site.name, tags: {}, imageUrl: undefined, title: undefined, status: 200 }, { status: 200, headers: CORS_HEADERS });
            }

            if (totalTagCount === 0 && imageUrl) {
                console.warn(`API Route POST: Image found, but no tags extracted for ${targetUrl} on ${site.name}`);
            }

            return NextResponse.json({ siteName: site.name, ...result }, { headers: CORS_HEADERS });

        } catch (parseError: unknown) {
            return NextResponse.json({ error: `Failed to parse or extract data from the page. Error: ${(parseError as Error).message}`, status: 500 }, { status: 500, headers: CORS_HEADERS });
        }

    } catch (error: unknown) {
        let errorMessage = 'An unexpected internal error occurred.';
        const status = 500;
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ error: errorMessage, status }, { status: status, headers: CORS_HEADERS });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get('imageUrl');

    if (!imageUrl || !imageUrl.startsWith('http')) {
        return new NextResponse('Invalid image URL parameter.', { status: 400, headers: CORS_HEADERS as unknown as HeadersInit });
    }

    try {
        const fetchWithUA = async (ua: string) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
            try {
                const res = await fetch(imageUrl, {
                    headers: {
                        'User-Agent': ua,
                        'Accept': 'image/*,video/*',
                        // Pixiv images (i.pximg.net) require a pixiv.net referer
                        'Referer': (() => { try { const u = new URL(imageUrl); return /(^|\.)i\.pximg\.net$/i.test(u.hostname) ? 'https://www.pixiv.net/' : (u.origin + '/'); } catch { return 'https://www.pixiv.net/'; } })(),
                    },
                    cache: 'force-cache',
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                return res;
            } catch (e) {
                clearTimeout(timeoutId);
                throw e;
            }
        };

        let response = await fetchWithUA(BROWSER_USER_AGENT).catch(() => null);

        // Retry with Bot UA if 403 or 503 (Cloudflare/Protection)
        if (!response || response.status === 403 || response.status === 503) {
            const retryResponse = await fetchWithUA(BOT_USER_AGENT).catch(() => null);
            if (retryResponse && (retryResponse.ok || retryResponse.status !== 403)) {
                response = retryResponse;
            } else if (retryResponse) {
                if (!response) response = retryResponse;
            }
        }

        if (!response) {
             throw new Error('Failed to fetch image (network error)');
        }

        if (!response.ok) {
            return new NextResponse(`Failed to fetch image from upstream. Status: ${response.status}`, { status: response.status, headers: CORS_HEADERS as unknown as HeadersInit });
        }

        const contentType = response.headers.get('Content-Type');
        const upstreamCacheControl = response.headers.get('Cache-Control');
        const body = response.body;

        if (!body) {
            return new NextResponse('Empty image body received from upstream.', { status: 502 });
        }

        const headers = new Headers();
        if (contentType) {
            headers.set('Content-Type', contentType);
        }
        headers.set('Cache-Control', upstreamCacheControl || 'public, max-age=86400');

        for (const [k, v] of Object.entries(CORS_HEADERS)) headers.set(k, v);
        return new NextResponse(body, { status: 200, statusText: 'OK', headers });

    } catch (error: unknown) {
        let errorMessage = 'An unexpected error occurred fetching image data.';
        let status = 500;
        if (error instanceof Error) {
            errorMessage = error.message;
            if (error.name === 'AbortError' || error.message.includes('timed out')) {
                errorMessage = `Request to target site for image timed out (${FETCH_TIMEOUT/1000}s).`;
                status = 504;
            } else if (error.message.toLowerCase().includes('failed to fetch')) {
                errorMessage = `Network error fetching image: ${error.message}. Check image URL or network.`;
                status = 502;
            }
        }
        return new NextResponse(errorMessage, { status: status, headers: CORS_HEADERS as unknown as HeadersInit });
    }
}


