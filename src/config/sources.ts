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
  {
    name: 'Reddit - Machine Learning',
    type: 'rss',
    url: 'https://www.reddit.com/r/MachineLearning/.rss',
    enabled: true,
  },
  {
    name: 'Reddit - Artificial Intelligence',
    type: 'rss',
    url: 'https://www.reddit.com/r/artificial/.rss',
    enabled: true,
  },
  {
    name: 'Reddit - ChatGPT',
    type: 'rss',
    url: 'https://www.reddit.com/r/ChatGPT/.rss',
    enabled: true,
  },
  {
    name: 'Reddit - LocalLLaMA',
    type: 'rss',
    url: 'https://www.reddit.com/r/LocalLLaMA/.rss',
    enabled: true,
  },
  {
    name: 'Ars Technica AI',
    type: 'rss',
    url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
    enabled: true,
  },
  {
    name: 'Wired AI',
    type: 'rss',
    url: 'https://www.wired.com/feed/tag/ai/latest/rss',
    enabled: true,
  },
  {
    name: 'AI Weekly Newsletter',
    type: 'rss',
    url: 'https://aiweekly.co/issues.rss',
    enabled: true,
  },
  {
    name: 'OpenAI Blog',
    type: 'rss',
    url: 'https://openai.com/blog/rss.xml',
    enabled: true,
  },
  {
    name: 'Google AI Blog',
    type: 'rss',
    url: 'https://blog.google/technology/ai/rss/',
    enabled: true,
  },
  {
    name: 'DeepMind Blog',
    type: 'rss',
    url: 'https://deepmind.google/blog/rss.xml',
    enabled: true,
  },
  {
    name: 'Anthropic News',
    type: 'rss',
    url: 'https://www.anthropic.com/news.rss',
    enabled: true,
  },
];
