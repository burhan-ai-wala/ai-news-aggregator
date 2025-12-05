import { NewsSource } from '../models/types';

export const NEWS_SOURCES: NewsSource[] = [
  {
    name: 'TechCrunch AI',
    type: 'rss',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    enabled: true,
  },
  {
    name: 'VentureBeat AI',
    type: 'rss',
    url: 'https://venturebeat.com/category/ai/feed/',
    enabled: true,
  },
  {
    name: 'MIT Technology Review AI',
    type: 'rss',
    url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed',
    enabled: true,
  },
  {
    name: 'The Verge AI',
    type: 'rss',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    enabled: true,
  },
  {
    name: 'AI News',
    type: 'rss',
    url: 'https://www.artificialintelligence-news.com/feed/',
    enabled: true,
  },
  {
    name: 'Hacker News',
    type: 'rss',
    url: 'https://hnrss.org/newest?q=AI+OR+artificial+intelligence+OR+machine+learning',
    enabled: true,
  },
];
