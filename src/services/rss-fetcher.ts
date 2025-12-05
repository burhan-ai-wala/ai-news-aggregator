import Parser from 'rss-parser';
import { NewsArticle } from '../models/types';
import { RelevanceScorer } from '../utils/scorer';
import { logger } from '../utils/logger';
import crypto from 'crypto';

export class RSSFetcher {
  private parser: Parser;

  constructor() {
    this.parser = new Parser({
      customFields: {
        item: [
          ['content:encoded', 'contentEncoded'],
          ['description', 'description'],
        ],
      },
    });
  }

  /**
   * Fetch articles from an RSS feed
   */
  async fetchFeed(url: string, sourceName: string): Promise<NewsArticle[]> {
    try {
      logger.info(`Fetching RSS feed: ${sourceName} from ${url}`);
      const feed = await this.parser.parseURL(url);
      const articles: NewsArticle[] = [];

      for (const item of feed.items) {
        try {
          const article = this.parseRSSItem(item, sourceName);
          if (article) {
            articles.push(article);
          }
        } catch (error) {
          logger.error(`Error parsing RSS item from ${sourceName}:`, error);
        }
      }

      logger.info(
        `Fetched ${articles.length} articles from ${sourceName}`
      );
      return articles;
    } catch (error) {
      logger.error(`Error fetching RSS feed ${sourceName}:`, error);
      return [];
    }
  }

  /**
   * Parse an RSS item into a NewsArticle
   */
  private parseRSSItem(item: any, sourceName: string): NewsArticle | null {
    const title = item.title || '';
    const description = item.description || item.summary || '';
    const content =
      item.contentEncoded || item['content:encoded'] || description;
    const url = item.link || '';

    if (!title || !url) {
      return null;
    }

    const relevanceScore = RelevanceScorer.calculateScore(
      title,
      description,
      content
    );

    const keywords = RelevanceScorer.extractKeywords(
      title,
      description,
      content
    );
    const categories = RelevanceScorer.categorizeArticle(keywords);
    const location = RelevanceScorer.extractLocations(
      title,
      description,
      content
    )[0];

    const id = this.generateArticleId(url);

    // Use title as summary (under 140 chars)
    const summary = this.createShortSummary(title.trim());

    return {
      id,
      title: title.trim(),
      description: summary,
      content: content.trim(),
      url,
      source: sourceName,
      author: item.creator || item.author,
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      relevanceScore,
      categories,
      location,
      keywords,
    };
  }

  /**
   * Create a short summary under 140 characters from title
   */
  private createShortSummary(title: string): string {
    if (title.length <= 140) {
      return title;
    }
    // Truncate at word boundary
    return title.substring(0, 137).trim() + '...';
  }

  /**
   * Generate a unique ID for an article based on URL
   */
  private generateArticleId(url: string): string {
    return crypto.createHash('md5').update(url).digest('hex');
  }
}
