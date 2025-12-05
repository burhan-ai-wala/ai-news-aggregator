import * as cron from 'node-cron';
import { NewsAggregator } from './aggregator';
import { StorageService } from './storage';
import { EmailService } from './email';
import { NEWS_SOURCES } from '../config/sources';
import { logger } from '../utils/logger';

export class NewsScheduler {
  private aggregator: NewsAggregator;
  private storage: StorageService;
  private emailService: EmailService;
  private cronExpression: string;
  private task: cron.ScheduledTask | null = null;

  constructor(
    cronExpression = '0 12 * * *', // Default: 12 noon daily
    minRelevanceScore = 0.6,
    maxArticlesPerSource = 50
  ) {
    this.aggregator = new NewsAggregator(
      minRelevanceScore,
      maxArticlesPerSource
    );
    this.storage = new StorageService(
      process.env.OUTPUT_DIR || './output'
    );
    this.emailService = new EmailService();
    this.cronExpression = cronExpression;
  }

  /**
   * Start the scheduled aggregation
   */
  start(): void {
    logger.info(`Starting scheduler with cron: ${this.cronExpression}`);

    this.task = cron.schedule(this.cronExpression, async () => {
      await this.runAggregation();
    });

    logger.info('Scheduler started successfully');
  }

  /**
   * Stop the scheduler
   */
  stop(): void {
    if (this.task) {
      this.task.stop();
      logger.info('Scheduler stopped');
    }
  }

  /**
   * Run aggregation immediately
   */
  async runAggregation(): Promise<void> {
    try {
      logger.info('Starting news aggregation...');
      const startTime = Date.now();

      // Aggregate articles
      const articles = await this.aggregator.aggregateFromSources(
        NEWS_SOURCES
      );

      // Filter to last 24 hours
      const recentArticles = this.aggregator.filterByTimeRange(articles, 24);

      if (recentArticles.length === 0) {
        logger.warn('No relevant articles found in the last 24 hours');
        return;
      }

      // Save reports
      await Promise.all([
        this.storage.saveDailyReport(recentArticles),
        this.storage.saveHTMLReport(recentArticles),
      ]);

      // Send email digest
      if (process.env.ENABLE_EMAIL !== 'false') {
        try {
          await this.emailService.sendDailyDigest(recentArticles);
          logger.info('Email digest sent successfully');
        } catch (error) {
          logger.error('Failed to send email digest:', error);
          // Don't throw - continue even if email fails
        }
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      logger.info(
        `Aggregation complete: ${recentArticles.length} articles in ${duration}s`
      );

      // Print summary to console
      this.printSummary(recentArticles);
    } catch (error) {
      logger.error('Error during aggregation:', error);
      throw error;
    }
  }

  /**
   * Print summary to console
   */
  private printSummary(articles: any[]): void {
    const categories = new Map<string, number>();
    articles.forEach((article) => {
      article.categories.forEach((cat: string) => {
        categories.set(cat, (categories.get(cat) || 0) + 1);
      });
    });

    console.log('\n=================================');
    console.log('DAILY AI TECH JOBS NEWS SUMMARY');
    console.log('=================================');
    console.log(`Total Articles: ${articles.length}`);
    console.log('\nTop Categories:');
    Array.from(categories.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([cat, count]) => {
        console.log(`  - ${cat}: ${count}`);
      });
    console.log('\nTop 5 Articles:');
    articles.slice(0, 5).forEach((article, index) => {
      console.log(
        `  ${index + 1}. ${article.title} (${(article.relevanceScore * 100).toFixed(0)}%)`
      );
    });
    console.log('=================================\n');
  }
}
