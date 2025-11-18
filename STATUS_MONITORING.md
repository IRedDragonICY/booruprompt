# Status Monitoring Setup

This document explains how the status monitoring system works and how to set it up.

## Overview

The status monitoring system uses **Vercel Cron Jobs** to automatically check all booru sites. On **Pro/Enterprise plans**, checks run **every hour**. On **Hobby plan**, checks run **once per day**. The results are cached and served instantly to users, providing a fast and efficient status page.

## Architecture

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│   Vercel    │ Hourly* │  /api/cron/      │ Stores  │   Cache     │
│  Cron Job   │────────▶│  check-status    │────────▶│  (1 hour)   │
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

**\*** _Hourly on Pro/Enterprise plans, once daily on Hobby plan_

## How It Works

### 1. Cron Job (`/api/cron/check-status`)
- Runs **every hour** on Pro/Enterprise plans via Vercel Cron Jobs
- On **Hobby plan**, runs **once per day** (Vercel limitation)
- Checks all 18 booru sites in parallel
- Determines status for each site:
  - ✅ **Operational**: Site responds normally
  - ⚠️ **Degraded**: Slow response or rate limited
  - 🟠 **Partial Outage**: Login required or partial failure
  - 🔴 **Major Outage**: Site down or unreachable
- Caches results in-memory and CDN (1-hour TTL)

### 2. Status API (`/api/status`)
- Public endpoint that serves cached data
- Returns instantly from CDN cache
- No need to check sites again
- Cache headers:
  - `s-maxage=3600` (1 hour)
  - `stale-while-revalidate=300` (serve stale while updating)

### 3. Status Page (`/status`)
- Fetches from `/api/status` endpoint
- Loads instantly (<1 second)
- Auto-refreshes every hour
- Shows:
  - Overall uptime percentage
  - Individual service status
  - 90-day uptime graph (gray = no data, colored = today's status)
  - Response times

## Setup Instructions

### 1. No Environment Variables Required

The status monitoring system works out of the box without any environment variables. The cron endpoint is secured using Vercel's built-in user agent verification (`vercel-cron/1.0`).

### 2. Deploy to Vercel

The cron job is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/check-status",
      "schedule": "0 * * * *"
    }
  ]
}
```

**Schedule Explanation:**
- `0 * * * *` = Every hour at minute 0 (Pro/Enterprise)
- On Hobby plan: Runs once per day (Vercel limitation)

This will automatically be picked up by Vercel on deployment.

### 3. Verify Cron Job

After deployment:

1. Go to Vercel Dashboard → Your Project → Cron Jobs
2. You should see the cron job listed
3. Check the logs to verify it's running

### 3. Manual Trigger (Development)

To manually trigger the cron job during development:

```bash
curl -X GET "http://localhost:3000/api/cron/check-status" \
  -H "User-Agent: vercel-cron/1.0"
```

## Cron Schedule

The cron job runs **every hour** (or once daily on Hobby plan):

```
0 * * * *
│ │ │ │ │
│ │ │ │ └─ Day of week (0-6, Sun-Sat)
│ │ │ └──── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └────────── Hour (0-23)
└──────────── Minute (0-59)
```

**Plan-Specific Behavior:**
- **Pro/Enterprise**: Runs every hour at minute 0 (00:00, 01:00, 02:00, etc.)
- **Hobby**: Runs once per day at any time within the configured hour

You can adjust this in `vercel.json` if needed (Pro/Enterprise only):
- `0 */2 * * *` - Every 2 hours
- `0 */6 * * *` - Every 6 hours
- `0 0 * * *` - Once per day at midnight

## Cache Strategy

### CDN Cache (Vercel Edge)
- **TTL**: 1 hour (`s-maxage=3600`)
- **Stale-while-revalidate**: 5 minutes
- Users get instant response from edge

### In-Memory Cache
- Stored in serverless function memory
- Valid for 1 hour
- Falls back to fresh check if expired

## Performance Benefits

| Metric | Before (Client-side) | After (Cron + Cache) |
|--------|---------------------|---------------------|
| Initial Load | ~30 seconds | <1 second |
| User Wait Time | 30s per visit | Instant |
| API Calls/Hour (Pro) | ~180 (3/min × 60) | 1 (cron only) |
| API Calls/Day (Hobby) | ~4,320 | 1 (cron only) |
| Booru Load | High (every user) | Low (hourly/daily) |

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
3. Check deployment logs for errors
4. **Hobby Plan**: Remember cron runs only once per day

### Status Always Shows "No Data"
1. Manually trigger cron job once to populate cache:
   ```bash
   curl -H "User-Agent: vercel-cron/1.0" https://your-domain.vercel.app/api/cron/check-status
   ```
2. **Hobby Plan**: Wait up to 24 hours for first automatic run
3. **Pro/Enterprise**: Wait up to 1 hour for first automatic run
4. Check `/api/cron/check-status` logs in Vercel Dashboard

### "Unauthorized" Error
- Ensure you're using the correct User-Agent header
- For manual testing:
  ```bash
  curl -H "User-Agent: vercel-cron/1.0" http://localhost:3000/api/cron/check-status
  ```

## Cost Considerations

### Vercel Cron Jobs
- Available on all plans (including Hobby)
- Counts as function invocations
- **Hobby Plan**: 1 invocation/day = ~30 invocations/month
- **Pro Plan**: 24 invocations/day = ~720 invocations/month
- **Enterprise**: Same as Pro (24/day)

### Plan Limits
| Plan | Cron Jobs | Schedule |
|------|-----------|----------|
| Hobby | 2 max | Once per day |
| Pro | 40 max | Unlimited invocations |
| Enterprise | 100 max | Unlimited invocations |

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
1. **User Agent Check**: Only accepts `vercel-cron/1.0`
2. **No Environment Variables Required**: Works out of the box

### Rate Limiting
- Cron runs at fixed intervals (not user-triggered)
- Prevents abuse and DDoS on booru sites
- Respects target site resources
- Hobby plan: Maximum 1 check per day
- Pro/Enterprise: Maximum 24 checks per day

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
