# Quick Start Guide

Get up and running with the AI News Aggregator in 5 minutes.

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

## Installation & First Run

```bash
# 1. Install dependencies
npm install

# 2. Run your first aggregation
npm run run
```

That's it! The aggregator will:
- Fetch AI news from 6+ sources
- Filter for tech job relevance
- Generate reports in the [output](output/) directory

## View Your Report

```bash
# Open the HTML report in your browser
open output/ai-news-$(date +%Y-%m-%d).html

# Or view JSON data
cat output/ai-news-$(date +%Y-%m-%d).json
```

## Schedule Daily Runs

```bash
# Start scheduled service (runs daily at 9 AM)
npm run schedule
```

Press Ctrl+C to stop the scheduler.

## Configuration (Optional)

Edit [.env](.env) to customize:

```env
MIN_RELEVANCE_SCORE=0.6        # Lower = more articles (0.3-0.8 recommended)
MAX_ARTICLES_PER_SOURCE=50     # Increase for more comprehensive scanning
SCHEDULE_CRON=0 9 * * *        # Change run time (default: 9 AM daily)
```

## Common Adjustments

### Get More Articles
Lower the relevance threshold in [.env](.env):
```env
MIN_RELEVANCE_SCORE=0.4
```

### Add Custom Keywords
Edit [src/config/keywords.ts](src/config/keywords.ts) to add your specific interests:
```typescript
export const AI_KEYWORDS = [
  // existing keywords...
  'your custom keyword',
];
```

### Add More News Sources
Edit [src/config/sources.ts](src/config/sources.ts):
```typescript
{
  name: 'Your Source',
  type: 'rss',
  url: 'https://your-rss-feed.com/feed',
  enabled: true,
}
```

## Production Deployment

For 24/7 operation, use a process manager:

```bash
# Using PM2
npm install -g pm2
pm2 start npm --name "ai-news" -- run schedule
pm2 save
pm2 startup
```

## Need Help?

- Check [README.md](README.md) for full documentation
- Review logs in [logs/combined.log](logs/combined.log)
- Adjust keywords in [src/config/keywords.ts](src/config/keywords.ts)
- Modify sources in [src/config/sources.ts](src/config/sources.ts)

## Example Output

The aggregator generates two files daily:
- `ai-news-YYYY-MM-DD.json` - Structured data for automation
- `ai-news-YYYY-MM-DD.html` - Beautiful visual report

Each article includes:
- Title and description
- Source and publication date
- Relevance score (0-100%)
- Categories (Layoffs, Hiring, LLM/Gen AI, etc.)
- Geographic location
- Direct link to original article
