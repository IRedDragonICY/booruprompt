export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { type NextRequest, NextResponse } from 'next/server';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS as unknown as HeadersInit });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const targetUrl = body.targetUrl;

        if (!targetUrl || typeof targetUrl !== 'string' || !targetUrl.startsWith('http')) {
            return NextResponse.json({ error: 'Invalid target URL provided.' }, { status: 400 });
        }

        console.log(`[DEBUG] Testing URL: ${targetUrl}`);

        // Test basic fetch
        const startTime = Date.now();
        let response: Response;
        let html: string;
        let fetchTime: number;

        try {
            response = await fetch(targetUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'DNT': '1',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                },
                cache: 'no-store'
            });

            fetchTime = Date.now() - startTime;
            html = await response.text();

        } catch (error) {
            return NextResponse.json({
                error: 'Fetch failed',
                details: error instanceof Error ? error.message : String(error),
                url: targetUrl,
                fetchTime: Date.now() - startTime
            }, { status: 500, headers: CORS_HEADERS });
        }

        // Analyze response
        const url = new URL(targetUrl);
        const contentType = response.headers.get('content-type') || '';
        const contentLength = response.headers.get('content-length');
        const server = response.headers.get('server');
        const cfRay = response.headers.get('cf-ray'); // Cloudflare
        const xPoweredBy = response.headers.get('x-powered-by');

        // Check for common error indicators in HTML
        const errorIndicators = [
            'cloudflare', 'access denied', 'rate limit', 'blocked', 'captcha',
            'javascript required', 'enable cookies', 'checking your browser',
            'ddos protection', 'security check'
        ];

        const htmlLower = html.toLowerCase();
        const foundErrors = errorIndicators.filter(indicator => htmlLower.includes(indicator));

        // Extract title and basic info
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : 'No title found';

        // Check for redirects
        const finalUrl = response.url;
        const wasRedirected = finalUrl !== targetUrl;

        return NextResponse.json({
            success: true,
            url: targetUrl,
            finalUrl: finalUrl,
            wasRedirected,
            status: response.status,
            statusText: response.statusText,
            contentType,
            contentLength: contentLength ? parseInt(contentLength) : html.length,
            server,
            cfRay: cfRay ? 'Cloudflare detected' : null,
            xPoweredBy,
            title,
            fetchTime,
            htmlLength: html.length,
            errorIndicators: foundErrors,
            hasErrors: foundErrors.length > 0,
            sampleContent: html.substring(0, 500) + (html.length > 500 ? '...' : ''),
            headers: Object.fromEntries(response.headers.entries())
        }, { headers: CORS_HEADERS });

    } catch (error) {
        return NextResponse.json({
            error: 'Internal error',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500, headers: CORS_HEADERS });
    }
}