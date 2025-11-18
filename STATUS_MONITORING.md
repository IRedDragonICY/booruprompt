# Status Monitoring Setup

This document explains how the status monitoring system works and how to set it up.

## Overview

The status monitoring system uses **Vercel Cron Jobs** to automatically check all booru sites every 10 minutes. The results are cached and served instantly to users, providing a fast and efficient status page.

## Architecture

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│   Vercel    │ Every   │  /api/cron/      │ Stores  │   Cache     │
│  Cron Job   │─10 min─▶│  check-status    │────────▶│ (5 minutes) │
└─────────────┘         └──────────────────┘         └─────────────┘
                                │                            │
                                │ Checks all sites           │
                                ▼                            │
                        ┌───────────────┐                    │
                        │  Booru Sites  │                    │
                        │ (18 services) │                    │
                        └───────────────┘                    │
                                                             │
                        ┌──────────────┐   Reads from       │
                        │  /api/status │◀───────────────────┘
                        └──────────────┘
                                ▲
                                │
                        ┌───────────────┐
                        │  Status Page  │
                        │   (Instant)   │
                        └───────────────┘
```

## How It Works

### 1. Cron Job (`/api/cron/check-status`)
- Runs **every 10 minutes** via Vercel Cron Jobs
- Checks all 18 booru sites in parallel
- Determines status for each site:
  - ✅ **Operational**: Site responds normally
  - ⚠️ **Degraded**: Slow response or rate limited
  - 🟠 **Partial Outage**: Login required or partial failure
  - 🔴 **Major Outage**: Site down or unreachable
- Caches results in-memory and CDN (5-minute TTL)

### 2. Status API (`/api/status`)
- Public endpoint that serves cached data
- Returns instantly from CDN cache
- No need to check sites again
- Cache headers:
  - `s-maxage=300` (5 minutes)
  - `stale-while-revalidate=60` (serve stale while updating)

### 3. Status Page (`/status`)
- Fetches from `/api/status` endpoint
- Loads instantly (<1 second)
- Auto-refreshes every 5 minutes
- Shows:
  - Overall uptime percentage
  - Individual service status
  - 90-day uptime graph (gray = no data, colored = today's status)
  - Response times

## Setup Instructions

### 1. Environment Variables

Set the `CRON_SECRET` environment variable in your Vercel project:

```bash
# Generate a secure random secret
openssl rand -base64 32

# Add to Vercel environment variables
vercel env add CRON_SECRET
```

Or via Vercel Dashboard:
1. Go to your project settings
2. Navigate to Environment Variables
3. Add `CRON_SECRET` with a random value

### 2. Deploy to Vercel

The cron job is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/check-status",
      "schedule": "*/10 * * * *"
    }
  ]
}
```

This will automatically be picked up by Vercel on deployment.

### 3. Verify Cron Job

After deployment:

1. Go to Vercel Dashboard → Your Project → Cron Jobs
2. You should see the cron job listed
3. Check the logs to verify it's running

### 4. Manual Trigger (Development)

To manually trigger the cron job during development:

```bash
curl -X GET "http://localhost:3000/api/cron/check-status" \
  -H "Authorization: Bearer your-cron-secret"
```

## Cron Schedule

The cron job runs **every 10 minutes**:

```
*/10 * * * *
│    │  │  │  │
│    │  │  │  └─ Day of week (0-6, Sun-Sat)
│    │  │  └──── Month (1-12)
│    │  └─────── Day of month (1-31)
│    └────────── Hour (0-23)
└─────────────── Minute (0-59)
```

You can adjust this in `vercel.json` if needed:
- `*/5 * * * *` - Every 5 minutes (more frequent, higher costs)
- `*/15 * * * *` - Every 15 minutes (less frequent, lower costs)
- `0 * * * *` - Every hour

## Cache Strategy

### CDN Cache (Vercel Edge)
- **TTL**: 5 minutes (`s-maxage=300`)
- **Stale-while-revalidate**: 60 seconds
- Users get instant response from edge

### In-Memory Cache
- Stored in serverless function memory
- Valid for 10 minutes
- Falls back to fresh check if expired

## Performance Benefits

| Metric | Before (Client-side) | After (Cron + Cache) |
|--------|---------------------|---------------------|
| Initial Load | ~30 seconds | <1 second |
| User Wait Time | 30s per visit | Instant |
| API Calls/Hour | ~180 (3/min × 60) | 6 (cron only) |
| Booru Load | High (every user) | Low (10min interval) |

## Monitoring

### Check Cron Job Execution
1. Vercel Dashboard → Project → Cron Jobs
2. View execution logs
3. Monitor success/failure rate

### Check Cache Status
Add this to your status page to see cache hits:

```typescript
const response = await fetch('/api/status');
const cacheStatus = response.headers.get('x-vercel-cache');
console.log('Cache status:', cacheStatus);
// HIT = served from cache
// MISS = fresh request
// STALE = serving stale while revalidating
```

## Troubleshooting

### Cron Job Not Running
1. Check Vercel Dashboard → Cron Jobs
2. Verify `vercel.json` is committed
3. Ensure `CRON_SECRET` is set in environment variables
4. Check deployment logs for errors

### Status Always Shows "No Data"
1. Manually trigger cron job once to populate cache
2. Wait 10 minutes for first automatic run
3. Check `/api/cron/check-status` logs

### "Unauthorized" Error
- Ensure `CRON_SECRET` environment variable is set
- For manual testing, include Authorization header:
  ```bash
  Authorization: Bearer your-cron-secret
  ```

## Cost Considerations

### Vercel Cron Jobs
- Available on all plans (including Hobby)
- Counts as function invocations
- Running every 10 minutes = ~4,320 invocations/month

### Function Duration
- Each cron run checks 18 sites in parallel
- Average duration: 5-10 seconds
- Max timeout: 60 seconds

### Bandwidth
- Cached responses are served from edge
- Minimal origin requests
- Highly efficient for multiple users

## Security

### Endpoint Protection
The cron endpoint is protected by:
1. **User Agent Check**: Vercel sends `vercel-cron/1.0`
2. **Authorization Header**: Requires `CRON_SECRET`

### Rate Limiting
- Cron runs at fixed intervals (not user-triggered)
- Prevents abuse and DDoS on booru sites
- Respects target site resources

## Future Enhancements

Potential improvements:
- [ ] Store historical data in database (Vercel KV or PostgreSQL)
- [ ] Real 90-day uptime graphs with actual data
- [ ] Email/Slack notifications on status changes
- [ ] Per-site custom check intervals
- [ ] Incident history and downtime tracking
- [ ] Public status badge/widget

## References

- [Vercel Cron Jobs Documentation](https://vercel.com/docs/cron-jobs)
- [Vercel Cache Documentation](https://vercel.com/docs/edge-network/caching)
- [Cron Expression Validator](https://crontab.guru)
