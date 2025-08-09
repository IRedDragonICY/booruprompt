export const dynamic = 'force-static';
export const revalidate = 3600;

import { type NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import { BOORU_SITES, type ExtractionResult, type TagCategory } from '@/app/utils/extractionUtils';

const FETCH_TIMEOUT = 25000;
const USER_AGENT = 'BooruTagExtractor/1.1 (Server-Side Processor; +http://localhost/)';

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
            const response = await fetch(targetUrl, {
                headers: {
                    'User-Agent': USER_AGENT,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Referer': new URL(targetUrl).origin + '/',
                },
                cache: 'no-store',
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                let errorText = `Failed to fetch page from target site. Status: ${response.status}`;
                 try {
                     const siteError = await response.text();
                     if (siteError && siteError.length < 500) {
                         errorText += ` - ${siteError.substring(0, 100)}${siteError.length > 100 ? '...' : ''}`;
                     }
                 } catch { }
                 return NextResponse.json({ error: errorText, status: response.status }, { status: 502 });
            }

            html = await response.text();

            if (!html) {
                return NextResponse.json({ error: 'Received empty page response from target site.', status: 502 }, { status: 502 });
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
            return NextResponse.json({ error: errorMessage, status }, { status });
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
                 return NextResponse.json({ error: `Extraction failed: ${specificError}`, status: 422 }, { status: 422 });
             }

            const result: ExtractionResult = site.extractTags(doc);
            const totalTagCount = calculateTotalTags(result.tags || {});
            const imageUrl = result.imageUrl;

            if (totalTagCount === 0 && !imageUrl) {
                return NextResponse.json({ error: `Warning: No tags or image found on ${site.name}. Page structure might have changed, post is unavailable, or requires login.`, siteName: site.name, tags: {}, imageUrl: undefined, title: undefined, status: 200 }, { status: 200 });
            }

            if (totalTagCount === 0 && imageUrl) {
                 console.warn(`API Route POST: Image found, but no tags extracted for ${targetUrl} on ${site.name}`);
            }

            return NextResponse.json({ siteName: site.name, ...result });

        } catch (parseError: unknown) {
             return NextResponse.json({ error: `Failed to parse or extract data from the page. Error: ${(parseError as Error).message}`, status: 500 }, { status: 500 });
        }

    } catch (error: unknown) {
        let errorMessage = 'An unexpected internal error occurred.';
        const status = 500;
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ error: errorMessage, status }, { status: status });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get('imageUrl');

    if (!imageUrl || !imageUrl.startsWith('http')) {
        return new NextResponse('Invalid image URL parameter.', { status: 400 });
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'image/*,video/*',
                'Referer': new URL(imageUrl).origin + '/',
            },
            cache: 'force-cache',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            return new NextResponse(`Failed to fetch image from upstream. Status: ${response.status}`, { status: response.status });
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

        return new NextResponse(body, {
            status: 200,
            statusText: 'OK',
            headers: headers,
        });

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
        return new NextResponse(errorMessage, { status: status });
    }
}