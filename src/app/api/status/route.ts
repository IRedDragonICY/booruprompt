export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

import { type NextRequest, NextResponse } from 'next/server';
import booruTopList from '@/../public/booru_top.json';

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
    url?: string;
    rank?: number;
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
    'Garycbooru': 'https://garycbooru.booru.org/index.php?page=post&s=view&id=160249',
    'e621': 'https://e621.net/posts/5982892',
    'AIBooru': 'https://aibooru.online/posts/1',
    'Yande.re': 'https://yande.re/post/show/1248231',
    'Konachan': 'https://konachan.com/post/show/1',
    'Anime-Pictures': 'https://anime-pictures.net/posts/1',
    'Zerochan': 'https://zerochan.net/2',
    'E-Shuushuu': 'https://e-shuushuu.net/image/1',
    'Pixiv': 'https://pixiv.net/en/artworks/44298467',
    'Fur Affinity': 'https://furaffinity.net/view/1'
};

const BROWSER_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const BOT_USER_AGENT = 'BooruPrompt/1.0';

async function checkApiEndpoint(): Promise<SiteStatus> {
    const startTime = Date.now();

    try {
        // Get the base URL - use public URL for external calls
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
            || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
            || 'http://localhost:3000';

        console.log(`[Status API] Checking API endpoint at: ${baseUrl}/api/fetch-booru`);

        // Test API endpoint with a known working URL
        const response = await fetch(`${baseUrl}/api/fetch-booru`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'BooruPrompt-StatusMonitor/1.0',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ targetUrl: 'https://danbooru.donmai.us/posts/1' }),
            signal: AbortSignal.timeout(15000), // 15 second timeout for API
        });

        const responseTime = Date.now() - startTime;
        let status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage';
        let errorMsg: string | undefined;

        console.log(`[Status API] API endpoint response status: ${response.status}, content-type: ${response.headers.get('content-type')}`);

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

async function checkSiteStatus(siteName: string, testUrl: string, rank?: number): Promise<SiteStatus> {
    const startTime = Date.now();

    const performCheck = async (ua: string) => {
        // Direct check to booru site (not through /api/fetch-booru)
        const response = await fetch(testUrl, {
            method: 'HEAD', // Use HEAD for faster response
            headers: {
                'User-Agent': ua,
            },
            signal: AbortSignal.timeout(5000), // 5 second timeout for faster bulk checks
        });

        if (response.ok) return { status: 'operational' as const, response };
        
        if (response.status === 403 || response.status === 401 || response.status === 405) {
            // Some sites block HEAD requests or require auth
            // Try GET request instead
            const getResponse = await fetch(testUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': ua,
                },
                signal: AbortSignal.timeout(5000),
            });

            if (getResponse.ok) return { status: 'operational' as const, response: getResponse };
            return { status: 'error' as const, code: getResponse.status, response: getResponse };
        }

        return { status: 'error' as const, code: response.status, response };
    };

    try {
        let result = await performCheck(BROWSER_USER_AGENT);
        let status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage';
        let errorMsg: string | undefined;

        // Retry with Bot UA if 403 or 503 (Cloudflare/Protection)
        if (result.status === 'error' && (result.code === 403 || result.code === 503)) {
            // Special handling for Konachan .com -> .net fallback
            if (testUrl.includes('konachan.com')) {
                const netUrl = testUrl.replace('konachan.com', 'konachan.net');
                const netResult = await performCheck(BROWSER_USER_AGENT.replace('konachan.com', 'konachan.net')); // Use helper with new URL? No, performCheck uses testUrl from closure.
                
                // We need to manually fetch for the fallback URL since performCheck is bound to the original URL
                try {
                    const fallbackResponse = await fetch(netUrl, {
                        method: 'HEAD',
                        headers: { 'User-Agent': BROWSER_USER_AGENT },
                        signal: AbortSignal.timeout(5000)
                    });
                    
                    if (fallbackResponse.ok) {
                        result = { status: 'operational', response: fallbackResponse };
                    } else {
                        // Try GET if HEAD fails
                        const fallbackGetResponse = await fetch(netUrl, {
                            method: 'GET',
                            headers: { 'User-Agent': BROWSER_USER_AGENT },
                            signal: AbortSignal.timeout(5000)
                        });
                        
                        if (fallbackGetResponse.ok) {
                            result = { status: 'operational', response: fallbackGetResponse };
                        }
                    }
                } catch (e) {
                    // Fallback failed, continue to standard retry
                }
            }

            // If still not operational, try with Bot UA
            if (result.status !== 'operational') {
                const retryResult = await performCheck(BOT_USER_AGENT);
                if (retryResult.status === 'operational' || (retryResult.code !== 403 && retryResult.code !== 503)) {
                    result = retryResult;
                }
            }
        }

        const responseTime = Date.now() - startTime;

        if (result.status === 'operational') {
            status = 'operational';
        } else {
            const code = result.code;
            if (code === 429) {
                status = 'degraded';
                errorMsg = 'Rate limited';
            } else if (code === 502 || code === 503 || code === 504) {
                status = 'major_outage';
                errorMsg = `Server error: ${code}`;
            } else if (code === 404) {
                status = 'partial_outage';
                errorMsg = 'Page not found';
            } else {
                status = 'degraded';
                errorMsg = `HTTP ${code}`;
            }
        }

        return {
            name: siteName,
            status,
            responseTime,
            lastChecked: new Date().toISOString(),
            error: errorMsg,
            url: testUrl,
            rank
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
            error: errorMsg,
            url: testUrl,
            rank
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

        // Prepare list of sites to check
        const sitesToCheck: { name: string; url: string; rank?: number }[] = [];
        const processedDomains = new Set<string>();

        // 1. Add Major Sites (from BOORU_SITES / TEST_URLS)
        BOORU_SITES.forEach(site => {
            const testUrl = TEST_URLS[site.name];
            if (testUrl) {
                sitesToCheck.push({ name: site.name, url: testUrl, rank: 0 }); // Rank 0 for major sites
                try {
                    const domain = new URL(testUrl).hostname.replace('www.', '');
                    processedDomains.add(domain);
                } catch (e) {}
            }
        });

        // 2. Add sites from booru_top.json
        // We limit to top 200 to avoid timeout, as checking 600 sites might take too long
        // Users can still see the full list in the Booru List page
        const MAX_ADDITIONAL_SITES = 200;
        let addedCount = 0;

        booruTopList.forEach((site: any) => {
            if (addedCount >= MAX_ADDITIONAL_SITES) return;

            try {
                const domain = new URL(site.booru_url).hostname.replace('www.', '');
                // Check if we already have this domain (approximate check)
                if (!processedDomains.has(domain)) {
                    sitesToCheck.push({ 
                        name: site.booru_title || site.domain, 
                        url: site.booru_url,
                        rank: site.rank 
                    });
                    processedDomains.add(domain);
                    addedCount++;
                }
            } catch (e) {}
        });

        // Check API endpoint
        const apiCheckPromise = checkApiEndpoint();

        // Batch processing for sites
        const BATCH_SIZE = 20;
        const siteStatuses: SiteStatus[] = [];
        
        // Process in batches
        for (let i = 0; i < sitesToCheck.length; i += BATCH_SIZE) {
            const batch = sitesToCheck.slice(i, i + BATCH_SIZE);
            const batchPromises = batch.map(site => checkSiteStatus(site.name, site.url, site.rank));
            
            const results = await Promise.all(batchPromises);
            siteStatuses.push(...results);
        }

        // Wait for API check
        const apiStatus = await apiCheckPromise;

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
                // Cache for 1 minute for faster updates during debugging
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
                'CDN-Cache-Control': 'public, s-maxage=60',
                'Vercel-CDN-Cache-Control': 'public, s-maxage=60'
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
