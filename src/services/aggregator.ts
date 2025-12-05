import { NewsArticle, NewsSource } from '../models/types';
import { RSSFetcher } from './rss-fetcher';
import { logger } from '../utils/logger';

export class NewsAggregator {
  private rssFetcher: RSSFetcher;
  private minRelevanceScore: number;
  private maxArticlesPerSource: number;

  constructor(minRelevanceScore = 0.6, maxArticlesPerSource = 50) {
    this.rssFetcher = new RSSFetcher();
    this.minRelevanceScore = minRelevanceScore;
    this.maxArticlesPerSource = maxArticlesPerSource;
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

    // Remove duplicates and sort by relevance
    const uniqueArticles = this.deduplicateArticles(allArticles);
    const sortedArticles = uniqueArticles.sort(
      (a, b) => b.relevanceScore - a.relevanceScore
    );

    logger.info(
      `Aggregation complete: ${sortedArticles.length} unique articles`
    );
    return sortedArticles;
  }

  /**
   * Remove duplicate articles based on ID and similar titles
   */
  private deduplicateArticles(articles: NewsArticle[]): NewsArticle[] {
    const seen = new Set<string>();
    const unique: NewsArticle[] = [];

    for (const article of articles) {
      const normalizedTitle = article.title.toLowerCase().trim();

      if (!seen.has(article.id) && !seen.has(normalizedTitle)) {
        seen.add(article.id);
        seen.add(normalizedTitle);
        unique.push(article);
      }
    }

    return unique;
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
