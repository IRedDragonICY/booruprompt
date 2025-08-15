export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 3600;

import { type NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import { BOORU_SITES, type ExtractionResult, type TagCategory } from '@/app/utils/extractionUtils';

const FETCH_TIMEOUT = 25000;
// Multiple user agents to rotate through to avoid detection
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0'
];

// Get a random user agent
const getRandomUserAgent = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

// Retry mechanism with exponential backoff
const retryFetch = async (url: string, options: RequestInit, maxRetries: number = 3): Promise<Response> => {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
            
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            // If we get a successful response, return it
            if (response.ok) {
                return response;
            }
            
            // If it's a client error (4xx), don't retry
            if (response.status >= 400 && response.status < 500) {
                return response;
            }
            
            // For server errors (5xx), we'll retry
            lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
            
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            
            // Don't retry on abort errors (timeouts)
            if (lastError.name === 'AbortError') {
                throw lastError;
            }
        }
        
        // If this isn't the last attempt, wait before retrying
        if (attempt < maxRetries) {
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Exponential backoff, max 5s
            console.log(`[API] Retry attempt ${attempt} for ${url} in ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    throw lastError || new Error('Max retries exceeded');
};

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

// Enhanced error detection function
const detectErrorPage = (html: string, doc: Document, targetUrl: string): { isError: boolean; errorType: string; details: string } => {
    const url = new URL(targetUrl);
    const hostname = url.hostname.toLowerCase();
    
    // Check for common error indicators
    const errorIndicators = [
        { pattern: /cloudflare/i, type: 'Cloudflare Protection' },
        { pattern: /access denied/i, type: 'Access Denied' },
        { pattern: /rate limit/i, type: 'Rate Limited' },
        { pattern: /blocked/i, type: 'IP Blocked' },
        { pattern: /captcha/i, type: 'Captcha Required' },
        { pattern: /javascript required/i, type: 'JavaScript Required' },
        { pattern: /enable cookies/i, type: 'Cookies Required' },
        { pattern: /checking your browser/i, type: 'Browser Check' },
        { pattern: /ddos protection/i, type: 'DDoS Protection' },
        { pattern: /security check/i, type: 'Security Check' }
    ];

    // Check title for errors
    const title = doc.title?.toLowerCase() || '';
    for (const indicator of errorIndicators) {
        if (title.includes(indicator.pattern.source.replace(/[\/i]/g, ''))) {
            return { isError: true, errorType: indicator.type, details: `Error detected in page title: ${doc.title}` };
        }
    }

    // Check body content for errors
    const bodyText = doc.body?.textContent?.toLowerCase() || '';
    for (const indicator of errorIndicators) {
        if (bodyText.includes(indicator.pattern.source.replace(/[\/i]/g, ''))) {
            return { isError: true, errorType: indicator.type, details: `Error detected in page content: ${indicator.type}` };
        }
    }

    // Check for specific error elements
    const errorSelectors = [
        '.error', '#error-page', '.dtext-error', '[class*="error"]', 
        '[id*="error"]', '#challenge-running', '.cf-error-code',
        '.cf-error-details', '.cf-browser-verification'
    ];

    for (const selector of errorSelectors) {
        const errorEl = doc.querySelector(selector);
        if (errorEl?.textContent?.trim()) {
            const errorText = errorEl.textContent.trim().substring(0, 200);
            return { isError: true, errorType: 'Page Error', details: `Error element found (${selector}): ${errorText}` };
        }
    }

    // Check for login requirements
    const loginIndicators = [
        'you must be logged in', 'requires an account', 'please login',
        'sign in required', 'authentication required'
    ];

    for (const indicator of loginIndicators) {
        if (bodyText.includes(indicator)) {
            return { isError: true, errorType: 'Login Required', details: `Content requires authentication: ${indicator}` };
        }
    }

    // Check for empty or invalid content
    if (!doc.body || doc.body.children.length === 0) {
        return { isError: true, errorType: 'Empty Page', details: 'Page has no content or body' };
    }

    // Check if we got redirected to a different site
    const currentUrl = doc.location?.href;
    if (currentUrl && !currentUrl.includes(hostname)) {
        return { isError: true, errorType: 'Redirect', details: `Redirected to different domain: ${currentUrl}` };
    }

    return { isError: false, errorType: '', details: '' };
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

        let html: string;

        try {
            console.log(`[API] Fetching: ${targetUrl} (Site: ${site.name})`);
            
            const response = await retryFetch(targetUrl, {
                headers: {
                    'User-Agent': getRandomUserAgent(),
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'DNT': '1',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Referer': new URL(targetUrl).origin + '/',
                },
                cache: 'no-store'
            });

            if (!response.ok) {
                let errorText = `Failed to fetch page from target site. Status: ${response.status}`;
                try {
                    const siteError = await response.text();
                    if (siteError && siteError.length < 500) {
                        errorText += ` - ${siteError.substring(0, 100)}${siteError.length > 100 ? '...' : ''}`;
                    }
                } catch { }
                console.error(`[API] HTTP Error ${response.status}: ${errorText}`);
                return NextResponse.json({ error: errorText, status: response.status }, { status: 502, headers: CORS_HEADERS });
            }

            html = await response.text();

            if (!html) {
                console.error(`[API] Empty response from: ${targetUrl}`);
                return NextResponse.json({ error: 'Received empty page response from target site.', status: 502 }, { status: 502, headers: CORS_HEADERS });
            }

            console.log(`[API] Received ${html.length} characters from: ${targetUrl}`);

        } catch (fetchError: unknown) {
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
            console.error(`[API] Fetch Error: ${errorMessage}`);
            return NextResponse.json({ error: errorMessage, status }, { status, headers: CORS_HEADERS });
        }

        try {
            const dom = new JSDOM(html, { url: targetUrl });
            const doc = dom.window.document;

            // Enhanced error detection
            const errorCheck = detectErrorPage(html, doc, targetUrl);
            if (errorCheck.isError) {
                console.error(`[API] Error detected: ${errorCheck.errorType} - ${errorCheck.details}`);
                return NextResponse.json({ 
                    error: `Extraction failed: ${errorCheck.errorType} - ${errorCheck.details}`, 
                    status: 422,
                    debug: {
                        url: targetUrl,
                        site: site.name,
                        errorType: errorCheck.errorType,
                        details: errorCheck.details,
                        responseLength: html.length,
                        title: doc.title?.substring(0, 100)
                    }
                }, { status: 422, headers: CORS_HEADERS });
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
                        const jsonResp = await retryFetch(`https://www.pixiv.net/ajax/illust/${illustId}?lang=en`, {
                            headers: {
                                'User-Agent': getRandomUserAgent(),
                                'Accept': 'application/json,text/plain,*/*',
                                'Referer': 'https://www.pixiv.net/',
                            },
                            cache: 'no-store'
                        }, 2); // Fewer retries for JSON API
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
                console.warn(`[API] No content extracted from: ${targetUrl} (Site: ${site.name})`);
                return NextResponse.json({ 
                    error: `Warning: No tags or image found on ${site.name}. Page structure might have changed, post is unavailable, or requires login.`, 
                    siteName: site.name, 
                    tags: {}, 
                    imageUrl: undefined, 
                    title: undefined, 
                    status: 200,
                    debug: {
                        url: targetUrl,
                        site: site.name,
                        responseLength: html.length,
                        title: doc.title?.substring(0, 100)
                    }
                }, { status: 200, headers: CORS_HEADERS });
            }

            if (totalTagCount === 0 && imageUrl) {
                console.warn(`[API] Image found, but no tags extracted for ${targetUrl} on ${site.name}`);
            }

            console.log(`[API] Successfully extracted ${totalTagCount} tags and ${imageUrl ? 'image' : 'no image'} from ${targetUrl}`);
            return NextResponse.json({ siteName: site.name, ...result }, { headers: CORS_HEADERS });

        } catch (parseError: unknown) {
            console.error(`[API] Parse Error: ${(parseError as Error).message}`);
            return NextResponse.json({ 
                error: `Failed to parse or extract data from the page. Error: ${(parseError as Error).message}`, 
                status: 500,
                debug: {
                    url: targetUrl,
                    site: site.name,
                    responseLength: html.length
                }
            }, { status: 500, headers: CORS_HEADERS });
        }

    } catch (error: unknown) {
        let errorMessage = 'An unexpected internal error occurred.';
        const status = 500;
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        console.error(`[API] Internal Error: ${errorMessage}`);
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
        const response = await retryFetch(imageUrl, {
            headers: {
                'User-Agent': getRandomUserAgent(),
                'Accept': 'image/*,video/*',
                // Pixiv images (i.pximg.net) require a pixiv.net referer
                'Referer': (() => { try { const u = new URL(imageUrl); return /(^|\.)i\.pximg\.net$/i.test(u.hostname) ? 'https://www.pixiv.net/' : (u.origin + '/'); } catch { return 'https://www.pixiv.net/'; } })(),
            },
            cache: 'force-cache'
        }, 2); // Fewer retries for images

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


