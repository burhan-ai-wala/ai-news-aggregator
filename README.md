# AI News Aggregator

A powerful daily news aggregator that scans and filters AI-related tech job news from around the USA. This tool automatically collects articles from multiple sources, scores them for relevance, and generates comprehensive daily reports in both JSON and HTML formats.

## Features

- **Multi-Source Aggregation**: Fetches from RSS feeds, APIs, and web scrapers
- **Smart Filtering**: AI-powered relevance scoring based on keywords and content analysis
- **Job Market Focus**: Specifically tracks hiring, layoffs, and employment trends in tech
- **Geographic Tracking**: Identifies and highlights US locations mentioned in articles
- **Automated Scheduling**: Runs daily at a configurable time (default: 12 noon)
- **Email Digests**: Sends beautiful HTML email summaries to your inbox daily
- **Beautiful Reports**: Generates both JSON and HTML reports with summaries and insights
- **Categorization**: Automatically categorizes articles (Layoffs, Hiring, Funding, LLM/Gen AI, etc.)
- **Deduplication**: Removes duplicate articles across sources

## Installation

```bash
# Clone or navigate to the project directory
cd ai-news-aggregator

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Edit .env with your settings (optional)
```

## Configuration

Edit [.env](.env) file to customize settings:

```env
# Aggregation Settings
SCHEDULE_CRON=0 12 * * *          # Run daily at 12 noon
MAX_ARTICLES_PER_SOURCE=50        # Maximum articles per source
MIN_RELEVANCE_SCORE=0.6           # Minimum relevance threshold (0-1)

# Email Settings
ENABLE_EMAIL=true                 # Enable email digests
EMAIL_TO=burhan@interviewkickstart.com

# Output Settings
OUTPUT_DIR=./output               # Directory for reports
LOG_LEVEL=info                    # Logging level
```

### Email Setup

The aggregator sends daily digest emails to `burhan@interviewkickstart.com` at 12 noon.

To configure email delivery, see the detailed [EMAIL_SETUP.md](EMAIL_SETUP.md) guide. Quick options:

**Gmail (easiest):**
```env
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

**Generic SMTP:**
```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
```

### Customize News Sources

Edit [src/config/sources.ts](src/config/sources.ts) to add or remove RSS feeds and other sources.

### Customize Keywords

Edit [src/config/keywords.ts](src/config/keywords.ts) to adjust AI keywords, job keywords, and US locations for better filtering.

## Usage

### Run Once (Immediate Aggregation)

```bash
npm run run
```

This will:
1. Fetch articles from all configured sources
2. Filter and score articles based on relevance
3. Generate JSON and HTML reports in the [output](output/) directory
4. Display a summary in the console

### Start Scheduled Service

```bash
npm run schedule
```

This will:
1. Run an initial aggregation immediately
2. Schedule daily aggregations based on SCHEDULE_CRON
3. Keep running until stopped (Ctrl+C)

### Development Mode

```bash
# Run with ts-node (no build required)
npm run dev run

# Watch mode with auto-reload
npm run dev:watch
```

### Build for Production

```bash
npm run build
npm start run
```

## Output

### Reports Location
Reports are saved in the [output](output/) directory with format:
- `ai-news-YYYY-MM-DD.json` - Structured JSON data
- `ai-news-YYYY-MM-DD.html` - Beautiful HTML report

### Report Contents

Each report includes:
- **Summary Statistics**: Total articles, average relevance, top categories, top locations
- **Article Details**: Title, description, source, publication date, relevance score
- **Categorization**: Layoffs, Hiring, Funding & M&A, LLM & Generative AI, Robotics, etc.
- **Keywords**: Extracted AI and tech job keywords
- **Geographic Info**: US locations mentioned in articles

### HTML Report Features

The HTML report includes:
- Modern, responsive design
- Color-coded relevance scores
- Clickable article titles linking to original sources
- Category tags for easy scanning
- Summary dashboard with key metrics

## Project Structure

```
ai-news-aggregator/
├── src/
│   ├── config/          # Configuration files
│   │   ├── sources.ts   # News source definitions
│   │   └── keywords.ts  # Keyword lists for filtering
│   ├── models/          # TypeScript interfaces
│   │   └── types.ts     # Data models
│   ├── services/        # Core services
│   │   ├── aggregator.ts    # Main aggregation logic
│   │   ├── rss-fetcher.ts   # RSS feed fetcher
│   │   ├── scheduler.ts     # Cron scheduler
│   │   └── storage.ts       # Report generation & storage
│   ├── utils/           # Utility functions
│   │   ├── logger.ts    # Winston logger
│   │   └── scorer.ts    # Relevance scoring engine
│   └── index.ts         # Application entry point
├── output/              # Generated reports
├── logs/                # Application logs
├── .env                 # Environment configuration
├── package.json
├── tsconfig.json
└── README.md
```

## How It Works

### 1. Source Aggregation
The system fetches articles from multiple RSS feeds including:
- TechCrunch AI
- VentureBeat AI
- MIT Technology Review
- The Verge AI
- AI News
- Hacker News (AI-filtered)

### 2. Relevance Scoring
Each article is scored (0-1) based on:
- **AI Keywords (40%)**: artificial intelligence, machine learning, GPT, LLM, etc.
- **Tech Job Keywords (40%)**: hiring, layoffs, employment, engineer, etc.
- **US Location (20%)**: Silicon Valley, New York, Seattle, Austin, etc.

### 3. Filtering & Deduplication
- Articles below MIN_RELEVANCE_SCORE are filtered out
- Duplicate articles are removed based on URL and title similarity
- Articles are sorted by relevance score

### 4. Categorization
Articles are automatically categorized:
- **Layoffs**: Job cuts, downsizing, workforce reduction
- **Hiring**: Recruiting, talent acquisition, expansion
- **Funding & M&A**: Startup funding, IPOs, acquisitions
- **LLM & Generative AI**: ChatGPT, GPT models, generative AI
- **Robotics & Autonomy**: Autonomous systems, computer vision
- **General AI News**: Other AI-related news

### 5. Report Generation
- JSON report for programmatic access
- HTML report for human-friendly viewing
- Summary statistics and insights

## Extending the System

### Add New RSS Sources

Edit [src/config/sources.ts](src/config/sources.ts):

```typescript
{
  name: 'Your Source Name',
  type: 'rss',
  url: 'https://example.com/feed',
  enabled: true,
}
```

### Add Custom Keywords

Edit [src/config/keywords.ts](src/config/keywords.ts):

```typescript
export const AI_KEYWORDS = [
  // Add your keywords here
  'quantum computing',
  'AGI',
];
```

### Adjust Relevance Scoring

Modify the scoring algorithm in [src/utils/scorer.ts](src/utils/scorer.ts) to change weights or add new scoring criteria.

## Logging

Logs are written to:
- Console: Colored, formatted output
- [logs/combined.log](logs/combined.log): All logs
- [logs/error.log](logs/error.log): Error logs only

Set `LOG_LEVEL` in .env to control verbosity: `error`, `warn`, `info`, `debug`

## Troubleshooting

### No Articles Found
- Check if RSS feeds are accessible
- Lower MIN_RELEVANCE_SCORE in .env
- Review keyword lists in [src/config/keywords.ts](src/config/keywords.ts)

### Scheduler Not Running
- Verify SCHEDULE_CRON format (use https://crontab.guru)
- Check logs for errors
- Ensure process stays running (use PM2 or similar for production)

### Build Errors
- Ensure Node.js version >= 16
- Run `npm install` to update dependencies
- Check TypeScript version: `npx tsc --version`

## Future Enhancements

- Add News API integration for broader coverage
- Implement OpenAI API for advanced content summarization
- Add email notifications for daily reports
- Create web dashboard for browsing historical reports
- Add sentiment analysis for articles
- Implement web scraping for non-RSS sources
- Add database storage (SQLite/PostgreSQL) for long-term data

## License

ISC

## Contributing

Feel free to submit issues and pull requests for new features or bug fixes.
