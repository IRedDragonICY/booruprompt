import { NextRequest, NextResponse } from 'next/server';

// Configure caching for this route
export const revalidate = 2592000; // Revalidate every 30 days

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');
    const size = searchParams.get('sz') || '64';

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain parameter is required' },
        { status: 400 }
      );
    }

    // Fetch favicon from Google's service
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`;

    const response = await fetch(faviconUrl, {
      // Cache for a long time since favicons rarely change
      cache: 'force-cache',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch favicon' },
        { status: response.status }
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';

    // Return the favicon with aggressive caching headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Browser cache: 7 days
        'Cache-Control': 'public, max-age=604800, s-maxage=2592000, stale-while-revalidate=31536000, immutable',
        // CDN cache: 30 days
        'CDN-Cache-Control': 'public, max-age=2592000, stale-while-revalidate=31536000, immutable',
        // Vercel CDN cache: 1 year (maximum for static assets like favicons)
        'Vercel-CDN-Cache-Control': 'public, max-age=31536000, stale-while-revalidate=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error fetching favicon:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
