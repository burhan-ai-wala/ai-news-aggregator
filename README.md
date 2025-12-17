# AI News Aggregator

A powerful daily news aggregator that scans and filters AI-related tech job news from multiple sources worldwide. This tool automatically collects articles, intelligently groups duplicates, scores them for relevance, and delivers the top 10 most important stories via email.

## Features

- **Multi-Source Aggregation**: Fetches from 17 curated RSS feeds including major tech news outlets, Reddit communities, and company blogs
- **Intelligent Duplicate Detection**: Groups the same story from multiple sources and shows all source links
- **Top 10 Ranking**: Automatically selects and delivers only the 10 most relevant articles daily
- **Smart Filtering**: AI-powered relevance scoring based on keywords and content analysis
- **Job Market Focus**: Specifically tracks hiring, layoffs, and employment trends in tech
- **Geographic Tracking**: Identifies and highlights US locations mentioned in articles
- **Automated Scheduling**: Runs daily at 12 noon IST (6:30 AM UTC)
- **Email Digests**: Sends beautiful HTML email summaries with all sources for each article
- **Beautiful Reports**: Generates both JSON and HTML reports with summaries and insights
- **Categorization**: Automatically categorizes articles (Layoffs, Hiring, Funding, LLM/Gen AI, etc.)

## News Sources

The aggregator pulls from **17 curated sources**:

### Major Tech Publications
- TechCrunch AI
- VentureBeat AI
- MIT Technology Review AI
- The Verge AI
- AI News
- Ars Technica AI
- Wired AI

### Reddit Communities
- r/MachineLearning
- r/artificial
- r/ChatGPT
- r/LocalLLaMA

### Company Blogs & Research
- OpenAI Blog
- Google AI Blog
- DeepMind Blog
- Anthropic News

### Tech Communities
- Hacker News (AI-filtered)
- AI Weekly Newsletter

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
SCHEDULE_CRON=30 6 * * *          # Run daily at 12 noon IST (6:30 AM UTC)
MAX_ARTICLES_PER_SOURCE=50        # Maximum articles per source
MIN_RELEVANCE_SCORE=0.6           # Minimum relevance threshold (0-1)
TOP_ARTICLES_LIMIT=10             # Number of top articles to include

# Email Settings
ENABLE_EMAIL=true                 # Enable email digests
EMAIL_TO=burhan@interviewkickstart.com

# Output Settings
OUTPUT_DIR=./output               # Directory for reports
LOG_LEVEL=info                    # Logging level
```

### Email Setup

The aggregator sends daily digest emails to `burhan@interviewkickstart.com` at 12 noon IST.

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

Edit [src/config/sources.ts](src/config/sources.ts) to add or remove RSS feeds. You can enable/disable sources by setting `enabled: true/false`.

### Customize Keywords

Edit [src/config/keywords.ts](src/config/keywords.ts) to adjust AI keywords, job keywords, and US locations for better filtering.

## Usage

### Run Once (Immediate Aggregation)

```bash
npm run run
```

This will:
1. Fetch articles from all 17 configured sources
2. Filter and score articles based on relevance
3. Group duplicate articles from multiple sources
4. Select top 10 most relevant articles
5. Generate JSON and HTML reports in the [output](output/) directory
6. Send email digest (if configured)
7. Display a summary in the console

### Start Scheduled Service

```bash
npm run schedule
```

This will:
1. Run an initial aggregation immediately
2. Schedule daily aggregations at 12 noon IST (6:30 AM UTC)
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

### Email Digest Features

Each daily email includes:
- **Top 10 Articles**: Ranked by relevance score
- **Multiple Source Links**: When the same story appears in multiple sources, all links are shown
- **Summary Statistics**: Total articles scanned, average relevance, top categories
- **Article Details**: Title, description, publication date, relevance score
- **Categories**: Visual tags for quick scanning (Layoffs, Hiring, LLM & Generative AI, etc.)
- **Source Count**: Shows how many sources reported the same story
- **Responsive Design**: Beautiful HTML formatting with hover effects

Example:
```
📰 Found in 3 sources:
• TechCrunch AI
• Reddit - Machine Learning
• Hacker News
```

### Report Contents

Each report includes:
- **Summary Statistics**: Total articles, average relevance, top categories, top locations
- **Top 10 Articles**: Highest-scoring articles with all source references
- **Article Details**: Title, description, sources, publication date, relevance score
- **Categorization**: Layoffs, Hiring, Funding & M&A, LLM & Generative AI, Robotics, etc.
- **Keywords**: Extracted AI and tech job keywords
- **Geographic Info**: US locations mentioned in articles

## Project Structure

```
ai-news-aggregator/
├── src/
│   ├── config/          # Configuration files
│   │   ├── sources.ts   # News source definitions (16 sources)
│   │   └── keywords.ts  # Keyword lists for filtering
│   ├── models/          # TypeScript interfaces
│   │   └── types.ts     # Data models (NewsArticle, SourceReference, etc.)
│   ├── services/        # Core services
│   │   ├── aggregator.ts    # Main aggregation logic with deduplication
│   │   ├── rss-fetcher.ts   # RSS feed fetcher
│   │   ├── scheduler.ts     # Cron scheduler
│   │   ├── email.ts         # Email service with HTML templates
│   │   └── storage.ts       # Report generation & storage
│   ├── utils/           # Utility functions
│   │   ├── logger.ts    # Winston logger
│   │   └── scorer.ts    # Relevance scoring engine
│   └── index.ts         # Application entry point
├── output/              # Generated reports
├── logs/                # Application logs
├── .env                 # Environment configuration
├── EMAIL_SETUP.md       # Detailed email setup guide
├── package.json
├── tsconfig.json
└── README.md
```

## How It Works

### 1. Source Aggregation
The system fetches articles from 17 RSS feeds including:
- Major tech publications (TechCrunch, VentureBeat, MIT Tech Review, The Verge, Wired, Ars Technica)
- Reddit communities (r/MachineLearning, r/artificial, r/ChatGPT, r/LocalLLaMA)
- Company blogs (OpenAI, Google AI, DeepMind, Anthropic)
- Tech communities (Hacker News, AI Weekly)

### 2. Relevance Scoring
Each article is scored (0-1) based on:
- **AI Keywords (40%)**: artificial intelligence, machine learning, GPT, LLM, Claude, etc.
- **Tech Job Keywords (40%)**: hiring, layoffs, employment, engineer, funding, etc.
- **US Location (20%)**: Silicon Valley, New York, Seattle, Austin, etc.

### 3. Intelligent Duplicate Detection
- Articles with similar titles are grouped together
- Title normalization removes punctuation and common words
- All source links are preserved and displayed
- Uses the highest relevance score among duplicates
- Uses the earliest publication date

### 4. Top 10 Ranking
- Articles are sorted by relevance score
- Only the top 10 most relevant articles are selected
- Ensures you get the most important news without information overload

### 5. Categorization
Articles are automatically categorized:
- **Layoffs**: Job cuts, downsizing, workforce reduction
- **Hiring**: Recruiting, talent acquisition, expansion
- **Funding & M&A**: Startup funding, IPOs, acquisitions
- **LLM & Generative AI**: ChatGPT, GPT models, generative AI
- **Robotics & Autonomy**: Autonomous systems, computer vision
- **General AI News**: Other AI-related news

### 6. Report Generation & Email Delivery
- JSON report for programmatic access
- HTML report for human-friendly viewing
- Beautiful email digest with all sources
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
  'neural networks',
];
```

### Adjust Relevance Scoring

Modify the scoring algorithm in [src/utils/scorer.ts](src/utils/scorer.ts) to change weights or add new scoring criteria.

### Change Top Articles Limit

Modify the `topArticlesLimit` parameter in [src/services/aggregator.ts](src/services/aggregator.ts) or add it to your environment configuration.

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
- Check logs for specific feed errors

### Email Not Sending
- Verify SMTP credentials in .env
- Check [EMAIL_SETUP.md](EMAIL_SETUP.md) for detailed setup
- Review logs for email errors
- Test with Gmail app password (easiest method)

### Scheduler Not Running
- Verify SCHEDULE_CRON format (use https://crontab.guru)
- Check logs for errors
- Ensure process stays running (use PM2 or similar for production)

### Build Errors
- Ensure Node.js version >= 16
- Run `npm install` to update dependencies
- Check TypeScript version: `npx tsc --version`

### Duplicate Detection Too Aggressive
- Modify the `normalizeTitle()` function in [src/services/aggregator.ts](src/services/aggregator.ts)
- Adjust the title normalization rules

## Recent Updates

- Added intelligent duplicate detection that groups similar articles
- Implemented top 10 ranking system for most relevant articles
- Enhanced email templates to show multiple sources per article
- Expanded to 17 news sources including Reddit communities and company blogs (Anthropic, OpenAI, Google AI, DeepMind)
- Improved title matching algorithm for better deduplication
- Added SourceReference interface for tracking multiple article sources

## Future Enhancements

- Add News API integration for broader coverage
- Implement OpenAI API for advanced content summarization
- Create web dashboard for browsing historical reports
- Add sentiment analysis for articles
- Implement web scraping for non-RSS sources (e.g., Blind)
- Add database storage (SQLite/PostgreSQL) for long-term data
- Support for international sources beyond US
- Real-time notifications for breaking news

## License

ISC

## Contributing

Feel free to submit issues and pull requests for new features or bug fixes.
