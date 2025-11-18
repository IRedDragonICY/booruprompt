export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { type NextRequest, NextResponse } from 'next/server';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS as unknown as HeadersInit });
}

export async function GET(req: NextRequest) {
    try {
        // Get base URL
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000';

        // Fetch from cron endpoint which has cached data
        const response = await fetch(`${baseUrl}/api/cron/check-status`, {
            headers: {
                'User-Agent': 'vercel-cron/1.0',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success || !result.data) {
            throw new Error('Invalid response from status check');
        }

        return NextResponse.json(result.data, {
            headers: {
                ...CORS_HEADERS,
                // Cache for 1 hour (matches cron schedule)
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
                'CDN-Cache-Control': 'public, s-maxage=3600',
                'Vercel-CDN-Cache-Control': 'public, s-maxage=3600'
            }
        });

    } catch (error: unknown) {
        console.error('[Status API] Error:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch status',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            {
                status: 500,
                headers: CORS_HEADERS
            }
        );
    }
}
