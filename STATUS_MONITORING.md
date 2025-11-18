# Status Monitoring Setup

This document explains how the status monitoring system works and how to set it up.

## Overview

The status monitoring system uses **on-demand CDN caching** to check all booru sites efficiently. The first user each hour triggers a fresh check, and subsequent users get instant cached results for 1 hour.

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│  First User │ Visits  │ /api/status  │ Stores  │  CDN Cache  │
│  (Hourly)   │────────▶│  (checks)    │────────▶│  (1 hour)   │
└─────────────┘         └──────────────┘         └─────────────┘
                                │                        │
                                │ Checks all sites       │
                                ▼                        │
                        ┌───────────────┐                │
                        │  Booru Sites  │                │
                        │ (18 services) │                │
                        └───────────────┘                │
                                                         │
                        ┌──────────────┐   Reads from   │
                        │ Other Users  │◀────────────────┘
                        │  (Instant)   │
                        └──────────────┘
```

## How It Works

### 1. On-Demand Checking (`/api/status`)
- **First user each hour**: Triggers fresh status check (~10 seconds)
- **Other users**: Get instant cached results (<1 second)
- Checks all 18 booru sites in parallel using `Promise.all()`
- Determines status for each site:
  - ✅ **Operational**: Site responds normally
  - ⚠️ **Degraded**: Slow response or rate limited
  - 🟠 **Partial Outage**: Login required or partial failure
  - 🔴 **Major Outage**: Site down or unreachable
- Caches results in Vercel Edge Network (1-hour TTL)

### 2. Cache Headers
```typescript
'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300'
'CDN-Cache-Control': 'public, s-maxage=3600'
'Vercel-CDN-Cache-Control': 'public, s-maxage=3600'
```

- **s-maxage=3600**: Cache for 1 hour on CDN
- **stale-while-revalidate=300**: Serve stale content while updating in background
- **public**: Cache can be shared across all users

### 3. Status View (Internal View)
- Part of main app (not separate page)
- Fetches from `/api/status` endpoint
- First load each hour: ~10 seconds (triggers fresh check)
- Subsequent loads: Instant (from CDN cache)
- Auto-refreshes every hour
- Shows:
  - Overall uptime percentage
  - Individual service status
  - 90-day uptime graph (gray = no data, colored = today's status)
  - Response times

## Setup Instructions

### 1. No Configuration Required

The status monitoring system works out of the box:
- ✅ No environment variables needed
- ✅ No cron jobs required
- ✅ No database needed
- ✅ No API keys required

### 2. Deploy to Vercel

Simply deploy your Next.js app:

```bash
git push origin main
```

Vercel will automatically:
- Enable CDN caching for `/api/status`
- Serve cached responses from edge network
- Handle on-demand checking

### 3. Access the Status View

Navigate to the status view in the app:
1. Click the signal icon in the sidebar (desktop)
2. Or tap the status button in bottom nav (mobile)

## Cache Strategy

### CDN Cache (Vercel Edge Network)
- **TTL**: 1 hour (`s-maxage=3600`)
- **Stale-while-revalidate**: 5 minutes
- **Coverage**: Global edge network
- **Behavior**:
  - First request each hour: MISS (triggers check)
  - Subsequent requests: HIT (instant)
  - After 1 hour: Stale (background revalidation)

### How It Works

```
Hour 1, Minute 0:
User A visits → Cache MISS → Check all sites (10s) → Store in cache → Show results

Hour 1, Minute 5:
User B visits → Cache HIT → Instant response (cached from User A)

Hour 1, Minute 30:
User C visits → Cache HIT → Instant response (still fresh)

Hour 2, Minute 5:
User D visits → Cache MISS → Check all sites (10s) → Update cache → Show results

Hour 2, Minute 10:
User E visits → Cache HIT → Instant response (cached from User D)
```

## Performance Benefits

| Metric | Client-side Checking | On-Demand Cache |
|--------|---------------------|-----------------|
| First User (hourly) | ~30 seconds | ~10 seconds |
| Other Users | ~30 seconds each | <1 second |
| API Calls/Hour | Every user (~100s) | Only first user (1) |
| Booru Site Load | High (constant) | Low (hourly) |
| Bandwidth Usage | High | Minimal (edge cache) |
| User Experience | Slow every time | Fast for most |

## Monitoring

### Check Cache Status

You can inspect cache headers in browser DevTools:

```typescript
// In browser console
fetch('/api/status').then(r => {
  console.log('Cache Status:', r.headers.get('x-vercel-cache'));
  console.log('Age:', r.headers.get('age'), 'seconds');
});

// Possible values:
// HIT - Served from cache (instant)
// MISS - Fresh check triggered (slow)
// STALE - Serving stale while revalidating (fast)
```

### View Real-Time Status

The status view itself shows:
- Last updated timestamp
- Individual site status
- Response times
- Overall uptime percentage

## Troubleshooting

### Status Takes Long to Load
**Expected behavior**: First user each hour triggers fresh check (~10 seconds)
- This is normal and expected
- Subsequent users get instant results
- After 1 hour, cache expires and next user triggers new check

### All Sites Show "Major Outage"
1. Check browser console for errors
2. Verify `/api/fetch-booru` endpoint is working
3. Check if you're behind a firewall blocking booru sites
4. Try again in a few minutes (temporary network issue)

### Cache Not Working
1. Check response headers include `Cache-Control`
2. Verify deployed to Vercel (caching only works on Vercel Edge)
3. Local development (`localhost`) doesn't use CDN cache
4. Check Vercel deployment logs for errors

### Response Times Seem High
- Response times include:
  - Network latency to booru site
  - Time to fetch test post
  - Time to extract tags
  - API proxy overhead
- 18 sites checked in parallel (not sequential)
- Some sites are naturally slower than others
- Rate limiting can increase response time

## Cost Considerations

### Vercel Resources

**Function Invocations:**
- ~24 invocations/day (once per hour)
- ~720 invocations/month
- Well within Hobby plan limits (100,000/month)

**Function Duration:**
- Each check: 5-10 seconds (18 sites in parallel)
- Only first user per hour pays this cost
- All other users: edge cache (no function invocation)

**Bandwidth:**
- CDN-cached responses: Minimal origin requests
- Most traffic served from edge
- Highly efficient for multiple users

### Plan Compatibility

| Plan | Compatible | Notes |
|------|-----------|-------|
| Hobby | ✅ Yes | Perfect fit, no limits hit |
| Pro | ✅ Yes | More edge regions |
| Enterprise | ✅ Yes | Best performance |

**No cron jobs required** - works on all plans without additional setup!

## Security

### Rate Limiting
- Automatic via CDN caching
- Maximum 24 checks/day to booru sites (hourly)
- Prevents abuse and DDoS on target sites
- Respects booru site resources

### CORS Protection
```typescript
'Access-Control-Allow-Origin': '*'
'Access-Control-Allow-Methods': 'GET,OPTIONS'
'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
```

### Public Endpoint
- `/api/status` is intentionally public
- No authentication required
- Read-only data (no mutations)
- Safe to expose

## Advanced Configuration

### Adjust Cache Duration

To change cache duration, edit `/src/app/api/status/route.ts`:

```typescript
// Current: 1 hour cache
'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300'

// 30 minutes cache
'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=300'

// 2 hours cache
'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=300'
```

### Add More Sites

Edit `TEST_URLS` in `/src/app/api/status/route.ts`:

```typescript
const TEST_URLS: Record<string, string> = {
    'Danbooru': 'https://danbooru.donmai.us/posts/1',
    'Your New Site': 'https://example.com/test-url',
    // ...
};
```

Site will automatically appear in status view.

### Customize Status Logic

Edit `checkSiteStatus()` in `/src/app/api/status/route.ts` to customize status determination:

```typescript
if (data.error.includes('Your Custom Error')) {
    status = 'degraded';
    errorMsg = 'Custom error handling';
}
```

## Architecture Decisions

### Why On-Demand Instead of Cron?

**Reasons:**
1. **Account Limits**: User hit cron job limits on Hobby plan
2. **Simplicity**: No cron configuration needed
3. **Resource Efficiency**: Only check when users actually visit
4. **Cost-Effective**: Free tier friendly
5. **No Infrastructure**: Works out of the box

**Trade-offs:**
- ✅ First user each hour waits ~10 seconds
- ✅ No cron job management
- ✅ No environment variables
- ❌ Data not pre-checked before user visits
- ❌ Status could be up to 1 hour stale

### Why 1 Hour Cache?

**Chosen for balance:**
- **Longer (2+ hours)**: Too stale, status changes missed
- **Shorter (15 min)**: Too many checks, loads booru sites
- **1 hour**: Good freshness, minimal load

## Future Enhancements

Potential improvements:
- [ ] Store historical data in Vercel KV
- [ ] Real 90-day uptime graphs with actual data
- [ ] Webhook notifications on status changes
- [ ] Per-site custom check intervals
- [ ] Incident history and downtime tracking
- [ ] Public status badge/widget
- [ ] Graph showing response time trends

## References

- [Vercel Edge Network Caching](https://vercel.com/docs/edge-network/caching)
- [HTTP Cache-Control Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Vercel Edge Network](https://vercel.com/docs/edge-network/overview)
