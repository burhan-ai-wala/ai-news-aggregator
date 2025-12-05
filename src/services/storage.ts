import fs from 'fs/promises';
import path from 'path';
import { NewsArticle, DailyReport } from '../models/types';
import { logger } from '../utils/logger';

export class StorageService {
  private outputDir: string;

  constructor(outputDir = './output') {
    this.outputDir = outputDir;
  }

  /**
   * Save daily report to JSON file
   */
  async saveDailyReport(articles: NewsArticle[]): Promise<string> {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });

      const date = new Date();
      const dateString = date.toISOString().split('T')[0];
      const fileName = `ai-news-${dateString}.json`;
      const filePath = path.join(this.outputDir, fileName);

      const report = this.generateReport(articles, date);

      await fs.writeFile(filePath, JSON.stringify(report, null, 2));

      logger.info(`Report saved to ${filePath}`);
      return filePath;
    } catch (error) {
      logger.error('Error saving daily report:', error);
      throw error;
    }
  }

  /**
   * Save daily report as HTML
   */
  async saveHTMLReport(articles: NewsArticle[]): Promise<string> {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });

      const date = new Date();
      const dateString = date.toISOString().split('T')[0];
      const fileName = `ai-news-${dateString}.html`;
      const filePath = path.join(this.outputDir, fileName);

      const html = this.generateHTMLReport(articles, date);

      await fs.writeFile(filePath, html);

      logger.info(`HTML report saved to ${filePath}`);
      return filePath;
    } catch (error) {
      logger.error('Error saving HTML report:', error);
      throw error;
    }
  }

  /**
   * Generate structured report
   */
  private generateReport(
    articles: NewsArticle[],
    date: Date
  ): DailyReport {
    const categoryCount = new Map<string, number>();
    const locationCount = new Map<string, number>();
    let totalRelevance = 0;

    articles.forEach((article) => {
      article.categories.forEach((cat) => {
        categoryCount.set(cat, (categoryCount.get(cat) || 0) + 1);
      });

      if (article.location) {
        locationCount.set(
          article.location,
          (locationCount.get(article.location) || 0) + 1
        );
      }

      totalRelevance += article.relevanceScore;
    });

    const topCategories = Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat]) => cat);

    const topLocations = Array.from(locationCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([loc]) => loc);

    return {
      date,
      articles,
      summary: {
        totalArticles: articles.length,
        topCategories,
        topLocations,
        averageRelevance:
          articles.length > 0 ? totalRelevance / articles.length : 0,
      },
    };
  }

  /**
   * Generate HTML report
   */
  private generateHTMLReport(articles: NewsArticle[], date: Date): string {
    const dateString = date.toDateString();
    const report = this.generateReport(articles, date);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Tech Jobs News - ${dateString}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
        }
        .summary {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .summary-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        .summary-item h3 {
            margin: 0 0 10px 0;
            color: #667eea;
        }
        .article {
            background: white;
            padding: 25px;
            margin-bottom: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .article:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        .article h2 {
            margin: 0 0 10px 0;
            color: #333;
        }
        .article h2 a {
            color: #667eea;
            text-decoration: none;
        }
        .article h2 a:hover {
            text-decoration: underline;
        }
        .article-meta {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 15px;
        }
        .article-description {
            color: #444;
            margin-bottom: 15px;
        }
        .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 15px;
        }
        .tag {
            background: #e3e8ff;
            color: #667eea;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 0.85em;
            font-weight: 500;
        }
        .relevance-score {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.85em;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 50px;
            padding: 20px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>AI Tech Jobs News Aggregator</h1>
        <p>Daily digest for ${dateString}</p>
    </div>

    <div class="summary">
        <h2>Summary</h2>
        <div class="summary-grid">
            <div class="summary-item">
                <h3>Total Articles</h3>
                <p style="font-size: 2em; margin: 0; color: #667eea;">${report.summary.totalArticles}</p>
            </div>
            <div class="summary-item">
                <h3>Avg Relevance</h3>
                <p style="font-size: 2em; margin: 0; color: #10b981;">${(report.summary.averageRelevance * 100).toFixed(0)}%</p>
            </div>
            <div class="summary-item">
                <h3>Top Categories</h3>
                <p>${report.summary.topCategories.join(', ') || 'N/A'}</p>
            </div>
            <div class="summary-item">
                <h3>Top Locations</h3>
                <p>${report.summary.topLocations.join(', ') || 'N/A'}</p>
            </div>
        </div>
    </div>

    <div class="articles">
        ${articles
          .map(
            (article) => `
        <div class="article">
            <h2><a href="${article.url}" target="_blank">${article.title}</a></h2>
            <div class="article-meta">
                <span><strong>Source:</strong> ${article.source}</span> |
                <span><strong>Published:</strong> ${new Date(article.publishedAt).toLocaleString()}</span> |
                <span class="relevance-score">${(article.relevanceScore * 100).toFixed(0)}% relevant</span>
            </div>
            <div class="article-description">${article.description}</div>
            <div class="tags">
                ${article.categories.map((cat) => `<span class="tag">${cat}</span>`).join('')}
                ${article.location ? `<span class="tag">${article.location}</span>` : ''}
            </div>
        </div>
        `
          )
          .join('')}
    </div>

    <div class="footer">
        <p>Generated by AI News Aggregator on ${new Date().toLocaleString()}</p>
    </div>
</body>
</html>`;
  }

  /**
   * Load previous reports
   */
  async loadReports(days = 7): Promise<DailyReport[]> {
    try {
      const files = await fs.readdir(this.outputDir);
      const jsonFiles = files
        .filter((f) => f.endsWith('.json') && f.startsWith('ai-news-'))
        .sort()
        .reverse()
        .slice(0, days);

      const reports: DailyReport[] = [];

      for (const file of jsonFiles) {
        const filePath = path.join(this.outputDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        reports.push(JSON.parse(content));
      }

      return reports;
    } catch (error) {
      logger.error('Error loading reports:', error);
      return [];
    }
  }
}
