import { type NextRequest, NextResponse } from 'next/server';

const FETCH_TIMEOUT = 25000;
const USER_AGENT = 'BooruTagExtractor/1.1 (Server-Side Proxy; +http://localhost/)';


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const targetUrl = body.targetUrl;

        if (!targetUrl || typeof targetUrl !== 'string' || !targetUrl.startsWith('http')) {
            return NextResponse.json({ error: 'Invalid target URL provided.' }, { status: 400 });
        }

        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Referer': new URL(targetUrl).origin + '/',
            },
            cache: 'no-store',
            signal: AbortSignal.timeout(FETCH_TIMEOUT)
        });

        if (!response.ok) {
            console.error(`API Route POST: Failed to fetch HTML from ${targetUrl}. Status: ${response.status}`);
            let errorText = `Failed to fetch page from target site. Status: ${response.status}`;
            try {
                const siteError = await response.text();
                if (siteError && siteError.length < 500) {
                    errorText += ` - ${siteError.substring(0, 100)}${siteError.length > 100 ? '...' : ''}`;
                }
            } catch {}
            return NextResponse.json({ error: errorText, status: response.status }, { status: 502 });
        }

        const html = await response.text();

        if (!html) {
            console.error(`API Route POST: Received empty HTML response from ${targetUrl}`);
            return NextResponse.json({ error: 'Received empty page response from target site.', status: 502 }, { status: 502 });
        }

        return NextResponse.json({ html });

    } catch (error: unknown) {
        let errorMessage = 'An unexpected error occurred fetching page data.';
        if (error instanceof Error) {
            errorMessage = error.message;
            if (error.name === 'AbortError' || error.message.includes('timed out')) {
                errorMessage = 'Request to target site for page data timed out.';
                return NextResponse.json({ error: errorMessage, status: 504 }, { status: 504 });
            }
        }
        console.error('API Route POST Error:', error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get('imageUrl');

    if (!imageUrl || !imageUrl.startsWith('http')) {
        return new NextResponse('Invalid image URL parameter.', { status: 400 });
    }

    try {
        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'image/*,video/*',
                'Referer': new URL(imageUrl).origin + '/',
            },
            cache: 'force-cache',
            signal: AbortSignal.timeout(FETCH_TIMEOUT)
        });

        if (!response.ok) {
            console.error(`API Route GET: Failed to fetch image ${imageUrl}. Status: ${response.status}`);
            return new NextResponse(`Failed to fetch image from upstream. Status: ${response.status}`, { status: response.status });
        }

        const contentType = response.headers.get('Content-Type');
        const upstreamCacheControl = response.headers.get('Cache-Control');
        const body = response.body;

        if (!body) {
            console.error(`API Route GET: Received empty image body from ${imageUrl}`);
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
                errorMessage = 'Request to target site for image timed out.';
                status = 504;
            }
        }
        console.error(`API Route GET Error fetching ${imageUrl}:`, error);
        return new NextResponse(errorMessage, { status: status });
    }
}


export const runtime = 'nodejs';