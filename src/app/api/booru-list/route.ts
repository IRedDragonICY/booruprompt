import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

// Configure caching for this route
export const revalidate = 86400; // Revalidate every 24 hours (1 day)

export async function GET() {
  try {
    // Read the booru_top.json file from the public directory
    const filePath = join(process.cwd(), 'public', 'booru_top.json');
    const fileContents = readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    // Create response with comprehensive cache headers for optimal Vercel caching
    const response = NextResponse.json(data, {
      status: 200,
      headers: {
        // Browser cache: 1 hour
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
        // CDN cache: 24 hours
        'CDN-Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        // Vercel CDN cache: 7 days (longest cache for Vercel edge)
        'Vercel-CDN-Cache-Control': 'public, max-age=604800, stale-while-revalidate=2592000',
        // Content type
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    console.error('Error reading booru_top.json:', error);
    return NextResponse.json(
      { error: 'Failed to load booru data' },
      { status: 500 }
    );
  }
}
