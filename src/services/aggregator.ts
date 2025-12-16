import { NewsArticle, NewsSource } from '../models/types';
import { RSSFetcher } from './rss-fetcher';
import { logger } from '../utils/logger';

export class NewsAggregator {
  private rssFetcher: RSSFetcher;
  private minRelevanceScore: number;
  private maxArticlesPerSource: number;
  private topArticlesLimit: number;

  constructor(minRelevanceScore = 0.6, maxArticlesPerSource = 50, topArticlesLimit = 10) {
    this.rssFetcher = new RSSFetcher();
    this.minRelevanceScore = minRelevanceScore;
    this.maxArticlesPerSource = maxArticlesPerSource;
    this.topArticlesLimit = topArticlesLimit;
  }

  /**
   * Aggregate articles from all sources
   */
  async aggregateFromSources(sources: NewsSource[]): Promise<NewsArticle[]> {
    logger.info(`Starting aggregation from ${sources.length} sources`);
    const allArticles: NewsArticle[] = [];

    const enabledSources = sources.filter((s) => s.enabled);

    for (const source of enabledSources) {
      try {
        let articles: NewsArticle[] = [];

        switch (source.type) {
          case 'rss':
            articles = await this.rssFetcher.fetchFeed(
              source.url,
              source.name
            );
            break;
          case 'api':
            // Future: implement API fetcher
            logger.warn(`API source ${source.name} not yet implemented`);
            break;
          case 'scraper':
            // Future: implement web scraper
            logger.warn(`Scraper source ${source.name} not yet implemented`);
            break;
        }

        // Filter by relevance score
        const relevantArticles = articles.filter(
          (article) => article.relevanceScore >= this.minRelevanceScore
        );

        // Limit articles per source
        const limitedArticles = relevantArticles.slice(
          0,
          this.maxArticlesPerSource
        );

        allArticles.push(...limitedArticles);

        logger.info(
          `Collected ${limitedArticles.length} relevant articles from ${source.name}`
        );
      } catch (error) {
        logger.error(`Error aggregating from ${source.name}:`, error);
      }
    }

    // Remove duplicates and group similar articles
    const groupedArticles = this.groupDuplicateArticles(allArticles);

    // Sort by relevance and get top N
    const sortedArticles = groupedArticles.sort(
      (a, b) => b.relevanceScore - a.relevanceScore
    );

    const topArticles = sortedArticles.slice(0, this.topArticlesLimit);

    logger.info(
      `Aggregation complete: ${topArticles.length} top articles from ${sortedArticles.length} unique articles`
    );
    return topArticles;
  }

  /**
   * Group duplicate articles by similar titles and merge their sources
   */
  private groupDuplicateArticles(articles: NewsArticle[]): NewsArticle[] {
    const articleMap = new Map<string, NewsArticle>();

    for (const article of articles) {
      const normalizedTitle = this.normalizeTitle(article.title);

      if (articleMap.has(normalizedTitle)) {
        // Article with similar title exists, merge sources
        const existingArticle = articleMap.get(normalizedTitle)!;

        // Add this source to the existing article
        existingArticle.sources.push({
          name: article.source,
          url: article.url,
          publishedAt: article.publishedAt,
        });

        // Use the highest relevance score
        if (article.relevanceScore > existingArticle.relevanceScore) {
          existingArticle.relevanceScore = article.relevanceScore;
        }

        // Use the earliest publish date
        if (article.publishedAt < existingArticle.publishedAt) {
          existingArticle.publishedAt = article.publishedAt;
        }

        // Merge categories and keywords
        existingArticle.categories = Array.from(
          new Set([...existingArticle.categories, ...article.categories])
        );
        existingArticle.keywords = Array.from(
          new Set([...existingArticle.keywords, ...article.keywords])
        );
      } else {
        // New article, initialize sources array
        article.sources = [{
          name: article.source,
          url: article.url,
          publishedAt: article.publishedAt,
        }];
        articleMap.set(normalizedTitle, article);
      }
    }

    return Array.from(articleMap.values());
  }

  /**
   * Normalize title for similarity matching
   */
  private normalizeTitle(title: string): string {
    return title
      .toLowerCase()
      .trim()
      // Remove common punctuation and special characters
      .replace(/[^\w\s]/g, ' ')
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Remove common filler words for better matching
      .replace(/\b(the|a|an|and|or|but|in|on|at|to|for|of|with|by)\b/g, '')
      .trim();
  }

  /**
   * Get articles from the last N hours
   */
  filterByTimeRange(articles: NewsArticle[], hours: number): NewsArticle[] {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hours);

    return articles.filter(
      (article) => article.publishedAt >= cutoffTime
    );
  }
}
