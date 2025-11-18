export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds max for cron job

import { type NextRequest, NextResponse } from 'next/server';

// Vercel Cron Jobs will send requests with this user agent
const VERCEL_CRON_USER_AGENT = 'vercel-cron/1.0';

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

// Global cache variable (will reset on cold starts but that's okay)
let cachedStatusData: StatusData | null = null;
let lastCheckTimestamp: number = 0;

async function checkSiteStatus(siteName: string, testUrl: string): Promise<SiteStatus> {
    const startTime = Date.now();

    try {
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/fetch-booru`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ targetUrl: testUrl }),
        });

        const responseTime = Date.now() - startTime;
        let status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage';
        let errorMsg: string | undefined;

        if (response.ok) {
            const data = await response.json();

            if (data.error) {
                if (data.error.includes('No tags') || data.error.includes('Warning')) {
                    status = 'operational';
                } else if (data.error.includes('Rate limit') || data.error.includes('timeout')) {
                    status = 'degraded';
                    errorMsg = data.error;
                } else if (data.error.includes('login') || data.error.includes('Access denied')) {
                    status = 'partial_outage';
                    errorMsg = data.error;
                } else {
                    status = 'major_outage';
                    errorMsg = data.error;
                }
            } else {
                status = 'operational';
            }
        } else if (response.status === 502 || response.status === 504) {
            status = 'major_outage';
            errorMsg = `Gateway error: ${response.status}`;
        } else if (response.status === 422) {
            status = 'partial_outage';
            const data = await response.json().catch(() => ({}));
            errorMsg = data.error || 'Extraction failed';
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
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';

        return {
            name: siteName,
            status: 'major_outage',
            responseTime,
            lastChecked: new Date().toISOString(),
            error: errorMsg
        };
    }
}

export async function GET(req: NextRequest) {
    // Verify the request is from Vercel Cron by checking user agent
    const userAgent = req.headers.get('user-agent');

    // Security: Only allow Vercel Cron requests
    // Vercel automatically sends this user agent for cron jobs
    if (userAgent !== VERCEL_CRON_USER_AGENT) {
        return NextResponse.json(
            { error: 'Unauthorized - This endpoint is only accessible via Vercel Cron Jobs' },
            { status: 401 }
        );
    }

    try {
        console.log('[Cron] Starting status check...');

        // Import BOORU_SITES
        const { BOORU_SITES } = await import('@/app/utils/extractionUtils');

        // Check all sites
        const statusPromises = BOORU_SITES.map(async (site) => {
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

        const sites = await Promise.all(statusPromises);

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

        // Update cache
        cachedStatusData = statusData;
        lastCheckTimestamp = Date.now();

        console.log(`[Cron] Status check completed. ${operationalCount}/${totalCount} operational`);

        return NextResponse.json({
            success: true,
            data: statusData,
            message: 'Status check completed successfully'
        }, {
            headers: {
                // Cache for 1 hour (matches cron schedule)
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
                'CDN-Cache-Control': 'public, s-maxage=3600',
                'Vercel-CDN-Cache-Control': 'public, s-maxage=3600'
            }
        });

    } catch (error: unknown) {
        console.error('[Cron] Error checking status:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to check status',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// Export cached data getter for other endpoints to use
export function getCachedStatusData(): StatusData | null {
    // Only return cache if it's less than 10 minutes old
    const cacheAge = Date.now() - lastCheckTimestamp;
    const TEN_MINUTES = 10 * 60 * 1000;

    if (cachedStatusData && cacheAge < TEN_MINUTES) {
        return cachedStatusData;
    }

    return null;
}
