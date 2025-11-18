export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { type NextRequest, NextResponse } from 'next/server';
import { BOORU_SITES } from '@/app/utils/extractionUtils';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS as unknown as HeadersInit });
}

interface SiteStatus {
    name: string;
    status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage';
    responseTime: number;
    lastChecked: string;
    error?: string;
}

// Test URLs for each booru site
const getTestUrl = (siteName: string): string | null => {
    const testUrls: Record<string, string> = {
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

    return testUrls[siteName] || null;
};

async function checkSiteStatus(siteName: string): Promise<SiteStatus> {
    const testUrl = getTestUrl(siteName);

    if (!testUrl) {
        return {
            name: siteName,
            status: 'major_outage',
            responseTime: 0,
            lastChecked: new Date().toISOString(),
            error: 'No test URL configured'
        };
    }

    const startTime = Date.now();

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/fetch-booru`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ targetUrl: testUrl }),
            signal: controller.signal,
            cache: 'no-store'
        });

        clearTimeout(timeoutId);
        const responseTime = Date.now() - startTime;

        let status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage';
        let error: string | undefined;

        if (response.ok) {
            const data = await response.json();

            // Check if we got meaningful data
            if (data.error) {
                // Some errors are acceptable (like "No tags found" for test posts)
                if (data.error.includes('No tags') || data.error.includes('Warning')) {
                    status = 'operational';
                } else if (data.error.includes('Rate limit') || data.error.includes('timeout')) {
                    status = 'degraded';
                } else if (data.error.includes('login') || data.error.includes('Access denied')) {
                    status = 'partial_outage';
                    error = data.error;
                } else {
                    status = 'major_outage';
                    error = data.error;
                }
            } else {
                status = 'operational';
            }
        } else if (response.status === 502 || response.status === 504) {
            status = 'major_outage';
            error = `Gateway error: ${response.status}`;
        } else if (response.status === 422) {
            // Extraction failed - might be site issue
            status = 'partial_outage';
            const data = await response.json().catch(() => ({}));
            error = data.error || 'Extraction failed';
        } else {
            status = 'degraded';
            error = `HTTP ${response.status}`;
        }

        return {
            name: siteName,
            status,
            responseTime,
            lastChecked: new Date().toISOString(),
            error
        };

    } catch (err: unknown) {
        const responseTime = Date.now() - startTime;
        const error = err instanceof Error ? err.message : 'Unknown error';

        return {
            name: siteName,
            status: 'major_outage',
            responseTime,
            lastChecked: new Date().toISOString(),
            error
        };
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const siteName = searchParams.get('site');

        // If specific site requested, check only that one
        if (siteName) {
            const site = BOORU_SITES.find(s => s.name === siteName);
            if (!site) {
                return NextResponse.json(
                    { error: 'Site not found' },
                    { status: 404, headers: CORS_HEADERS }
                );
            }

            const status = await checkSiteStatus(site.name);
            return NextResponse.json(status, { headers: CORS_HEADERS });
        }

        // Check all sites
        const statusPromises = BOORU_SITES.map(site => checkSiteStatus(site.name));
        const statuses = await Promise.all(statusPromises);

        // Calculate overall status
        const operationalCount = statuses.filter(s => s.status === 'operational').length;
        const totalCount = statuses.length;
        const uptimePercentage = ((operationalCount / totalCount) * 100).toFixed(2);

        return NextResponse.json({
            overall: {
                uptimePercentage,
                operationalCount,
                totalCount,
                status: operationalCount === totalCount ? 'operational' :
                       operationalCount > totalCount * 0.5 ? 'degraded' : 'major_outage'
            },
            sites: statuses,
            lastUpdated: new Date().toISOString()
        }, { headers: CORS_HEADERS });

    } catch (error: unknown) {
        return NextResponse.json(
            {
                error: 'Failed to check status',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500, headers: CORS_HEADERS }
        );
    }
}
