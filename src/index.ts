#!/usr/bin/env node
import dotenv from 'dotenv';
import { NewsScheduler } from './services/scheduler';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

async function main() {
  try {
    const args = process.argv.slice(2);
    const command = args[0];

    const minRelevanceScore = parseFloat(
      process.env.MIN_RELEVANCE_SCORE || '0.6'
    );
    const maxArticlesPerSource = parseInt(
      process.env.MAX_ARTICLES_PER_SOURCE || '50'
    );
    const scheduleCron = process.env.SCHEDULE_CRON || '0 9 * * *';

    const scheduler = new NewsScheduler(
      scheduleCron,
      minRelevanceScore,
      maxArticlesPerSource
    );

    switch (command) {
      case 'run':
        // Run aggregation once
        logger.info('Running one-time aggregation...');
        await scheduler.runAggregation();
        process.exit(0);
        break;

      case 'start':
        // Start scheduled aggregation
        logger.info('Starting scheduled aggregation service...');
        scheduler.start();

        // Run immediately on start
        await scheduler.runAggregation();

        // Keep process alive
        process.on('SIGINT', () => {
          logger.info('Received SIGINT, shutting down...');
          scheduler.stop();
          process.exit(0);
        });

        process.on('SIGTERM', () => {
          logger.info('Received SIGTERM, shutting down...');
          scheduler.stop();
          process.exit(0);
        });

        logger.info('Service running. Press Ctrl+C to stop.');
        break;

      case 'help':
      default:
        console.log(`
AI News Aggregator - Daily news scanning for AI tech jobs

Usage:
  npm start [command]

Commands:
  run       Run aggregation once and exit
  start     Start scheduled aggregation service (default: daily at 9 AM)
  help      Show this help message

Environment Variables:
  NEWS_API_KEY              (Optional) News API key for additional sources
  SCHEDULE_CRON             Cron expression (default: "0 9 * * *")
  MAX_ARTICLES_PER_SOURCE   Maximum articles per source (default: 50)
  MIN_RELEVANCE_SCORE       Minimum relevance score (default: 0.6)
  OUTPUT_DIR                Output directory (default: ./output)
  LOG_LEVEL                 Log level (default: info)

Examples:
  npm start run              Run once
  npm start start            Run as scheduled service
  npm start                  Show help

Configuration:
  Edit .env file to configure settings
  Edit src/config/sources.ts to add/remove news sources
  Edit src/config/keywords.ts to customize keyword matching
        `);
        break;
    }
  } catch (error) {
    logger.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
