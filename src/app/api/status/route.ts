export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

import { type NextRequest, NextResponse } from 'next/server';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

interface SiteStatus {
    name: string;
    status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage';
    responseTime: number;
    lastChecked: string;
    error?: string;
}

interface StatusData {
    overall: {
        uptimePercentage: string;
        operationalCount: number;
        totalCount: number;
        status: 'operational' | 'degraded' | 'major_outage';
    };
    sites: SiteStatus[];
    lastUpdated: string;
}

// Test URLs for each site
const TEST_URLS: Record<string, string> = {
    'Danbooru': 'https://danbooru.donmai.us/posts/1',
    'Safebooru (Donmai)': 'https://safebooru.donmai.us/posts/1',
    'Hijiribe': 'https://hijiribe.donmai.us/posts/1',
    'Safebooru (Org)': 'https://safebooru.org/index.php?page=post&s=view&id=1',
    'Gelbooru': 'https://gelbooru.com/index.php?page=post&s=view&id=1',
    'Rule34': 'https://rule34.xxx/index.php?page=post&s=view&id=1',
    'TBIB': 'https://tbib.org/index.php?page=post&s=view&id=1',
    'Scatbooru': 'https://scatbooru.co.uk/?page=post&s=view&id=1',
    'Garycbooru': 'https://garycbooru.booru.org/index.php?page=post&s=view&id=1',
    'e621': 'https://e621.net/posts/1',
    'AIBooru': 'https://aibooru.online/posts/1',
    'Yande.re': 'https://yande.re/post/show/1',
    'Konachan': 'https://konachan.com/post/show/1',
    'Anime-Pictures': 'https://anime-pictures.net/posts/1',
    'Zerochan': 'https://zerochan.net/1',
    'E-Shuushuu': 'https://e-shuushuu.net/image/1',
    'Pixiv': 'https://pixiv.net/en/artworks/44298467',
    'Fur Affinity': 'https://furaffinity.net/view/1'
};

async function checkApiEndpoint(): Promise<SiteStatus> {
    const startTime = Date.now();

    try {
        // Get the base URL - use public URL for external calls
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
            || process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000';

        console.log(`[Status API] Checking API endpoint at: ${baseUrl}/api/fetch-booru`);

        // Test API endpoint with a known working URL
        const response = await fetch(`${baseUrl}/api/fetch-booru`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ targetUrl: 'https://danbooru.donmai.us/posts/1' }),
            signal: AbortSignal.timeout(15000), // 15 second timeout for API
        });

        const responseTime = Date.now() - startTime;
        let status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage';
        let errorMsg: string | undefined;

        console.log(`[Status API] API endpoint response status: ${response.status}`);

        if (response.ok) {
            const data = await response.json();

            // Check if API returned valid data
            if (data.error) {
                // Even with error, if API responded properly, it's operational
                status = 'operational';
                console.log('[Status API] API endpoint operational (returned error response)');
            } else if (data.tags || data.siteName) {
                // Valid extraction response
                status = 'operational';
                console.log('[Status API] API endpoint operational (valid extraction)');
            } else {
                status = 'degraded';
                errorMsg = 'Invalid API response';
                console.log('[Status API] API endpoint degraded (invalid response structure)');
            }
        } else if (response.status === 422) {
            // Unprocessable entity - API works but extraction failed
            status = 'operational';
            console.log('[Status API] API endpoint operational (422 - validation error is expected)');
        } else if (response.status === 400) {
            // Bad request but API is responding - still operational
            status = 'operational';
            console.log('[Status API] API endpoint operational (400 - API responding to requests)');
        } else if (response.status === 401 || response.status === 403) {
            // Auth errors - but API is responding, just access denied
            // This is actually operational since API is working, just access control
            status = 'operational';
            console.log('[Status API] API endpoint operational (auth response - API is responding)');
        } else if (response.status === 502 || response.status === 503 || response.status === 504) {
            status = 'major_outage';
            errorMsg = `Server error: ${response.status}`;
            console.log(`[Status API] API endpoint major outage: ${response.status}`);
        } else {
            status = 'degraded';
            errorMsg = `HTTP ${response.status}`;
            console.log(`[Status API] API endpoint degraded: HTTP ${response.status}`);
        }

        return {
            name: 'API Endpoint (/api/fetch-booru)',
            status,
            responseTime,
            lastChecked: new Date().toISOString(),
            error: errorMsg
        };
    } catch (err: unknown) {
        const responseTime = Date.now() - startTime;
        let errorMsg: string;
        let status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage' = 'major_outage';

        if (err instanceof Error) {
            console.error('[Status API] API endpoint check error:', err.message);
            if (err.name === 'TimeoutError' || err.message.includes('timeout')) {
                status = 'major_outage';
                errorMsg = 'API timeout';
            } else {
                errorMsg = err.message;
            }
        } else {
            errorMsg = 'Unknown error';
            console.error('[Status API] API endpoint check unknown error:', err);
        }

        return {
            name: 'API Endpoint (/api/fetch-booru)',
            status,
            responseTime,
            lastChecked: new Date().toISOString(),
            error: errorMsg
        };
    }
}

async function checkSiteStatus(siteName: string, testUrl: string): Promise<SiteStatus> {
    const startTime = Date.now();

    try {
        // Direct check to booru site (not through /api/fetch-booru)
        const response = await fetch(testUrl, {
            method: 'HEAD', // Use HEAD for faster response
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
            signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        const responseTime = Date.now() - startTime;
        let status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage';
        let errorMsg: string | undefined;

        if (response.ok) {
            // 2xx status codes
            status = 'operational';
        } else if (response.status === 403 || response.status === 401) {
            // Some sites block HEAD requests or require auth
            // Try GET request instead
            try {
                const getResponse = await fetch(testUrl, {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    },
                    signal: AbortSignal.timeout(10000),
                });

                if (getResponse.ok) {
                    status = 'operational';
                } else {
                    status = 'degraded';
                    errorMsg = `HTTP ${getResponse.status}`;
                }
            } catch {
                status = 'degraded';
                errorMsg = `HTTP ${response.status}`;
            }
        } else if (response.status === 429) {
            status = 'degraded';
            errorMsg = 'Rate limited';
        } else if (response.status === 502 || response.status === 503 || response.status === 504) {
            status = 'major_outage';
            errorMsg = `Server error: ${response.status}`;
        } else if (response.status === 404) {
            status = 'partial_outage';
            errorMsg = 'Page not found';
        } else {
            status = 'degraded';
            errorMsg = `HTTP ${response.status}`;
        }

        return {
            name: siteName,
            status,
            responseTime,
            lastChecked: new Date().toISOString(),
            error: errorMsg
        };
    } catch (err: unknown) {
        const responseTime = Date.now() - startTime;
        let errorMsg: string;
        let status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage' = 'major_outage';

        if (err instanceof Error) {
            if (err.name === 'TimeoutError' || err.message.includes('timeout')) {
                status = 'degraded';
                errorMsg = 'Request timeout';
            } else if (err.message.includes('fetch failed') || err.message.includes('ENOTFOUND')) {
                status = 'major_outage';
                errorMsg = 'Site unreachable';
            } else {
                errorMsg = err.message;
            }
        } else {
            errorMsg = 'Unknown error';
        }

        return {
            name: siteName,
            status,
            responseTime,
            lastChecked: new Date().toISOString(),
            error: errorMsg
        };
    }
}

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS as unknown as HeadersInit });
}

export async function GET(req: NextRequest) {
    try {
        console.log('[Status API] Starting status check...');

        // Import BOORU_SITES
        const { BOORU_SITES } = await import('@/app/utils/extractionUtils');

        // Check API endpoint and all sites in parallel
        const apiCheckPromise = checkApiEndpoint();

        const siteCheckPromises = BOORU_SITES.map(async (site) => {
            const testUrl = TEST_URLS[site.name];
            if (!testUrl) {
                return {
                    name: site.name,
                    status: 'major_outage' as const,
                    responseTime: 0,
                    lastChecked: new Date().toISOString(),
                    error: 'No test URL configured'
                };
            }

            return checkSiteStatus(site.name, testUrl);
        });

        // Wait for all checks to complete
        const [apiStatus, ...siteStatuses] = await Promise.all([apiCheckPromise, ...siteCheckPromises]);

        // Combine API status at the beginning of the list
        const sites = [apiStatus, ...siteStatuses];

        // Calculate overall status
        const operationalCount = sites.filter(s => s.status === 'operational').length;
        const totalCount = sites.length;
        const uptimePercentage = ((operationalCount / totalCount) * 100).toFixed(2);

        const statusData: StatusData = {
            overall: {
                uptimePercentage,
                operationalCount,
                totalCount,
                status: operationalCount === totalCount ? 'operational' :
                       operationalCount > totalCount * 0.5 ? 'degraded' : 'major_outage'
            },
            sites,
            lastUpdated: new Date().toISOString()
        };

        console.log(`[Status API] Check completed. ${operationalCount}/${totalCount} operational (including API endpoint)`);

        return NextResponse.json(statusData, {
            headers: {
                ...CORS_HEADERS,
                // Cache for 1 hour - first user triggers check, others get cached result
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
                'CDN-Cache-Control': 'public, s-maxage=3600',
                'Vercel-CDN-Cache-Control': 'public, s-maxage=3600'
            }
        });

    } catch (error: unknown) {
        console.error('[Status API] Error:', error);
        return NextResponse.json(
            {
                error: 'Failed to check status',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            {
                status: 500,
                headers: CORS_HEADERS
            }
        );
    }
}
