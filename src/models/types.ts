export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  source: string;
  author?: string;
  publishedAt: Date;
  relevanceScore: number;
  categories: string[];
  location?: string;
  keywords: string[];
}

export interface NewsSource {
  name: string;
  type: 'rss' | 'api' | 'scraper';
  url: string;
  enabled: boolean;
}

export interface AggregatorConfig {
  sources: NewsSource[];
  keywords: {
    ai: string[];
    techJobs: string[];
    locations: string[];
  };
  schedule: string;
  maxArticlesPerSource: number;
  minRelevanceScore: number;
}

export interface DailyReport {
  date: Date;
  articles: NewsArticle[];
  summary: {
    totalArticles: number;
    topCategories: string[];
    topLocations: string[];
    averageRelevance: number;
  };
}
