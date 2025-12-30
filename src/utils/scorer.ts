import { AI_KEYWORDS, TECH_JOB_KEYWORDS, US_LOCATIONS } from '../config/keywords';

export class RelevanceScorer {
  /**
   * Calculate relevance score for an article based on keywords and content
   */
  static calculateScore(
    title: string,
    description: string,
    content: string
  ): number {
    const text = `${title} ${description} ${content}`.toLowerCase();
    let score = 0;
    let maxScore = 0;

    // AI keyword scoring (70% weight)
    const aiMatches = this.countKeywordMatches(text, AI_KEYWORDS);
    const aiScore = Math.min(aiMatches / 3, 1) * 0.7;
    score += aiScore;
    maxScore += 0.7;

    // Tech job keyword scoring (20% weight)
    const jobMatches = this.countKeywordMatches(text, TECH_JOB_KEYWORDS);
    const jobScore = Math.min(jobMatches / 3, 1) * 0.2;
    score += jobScore;
    maxScore += 0.2;

    // US location scoring (10% weight)
    const locationMatches = this.countKeywordMatches(text, US_LOCATIONS);
    const locationScore = Math.min(locationMatches / 2, 1) * 0.1;
    score += locationScore;
    maxScore += 0.1;

    return score;
  }

  /**
   * Count keyword matches in text
   */
  private static countKeywordMatches(text: string, keywords: string[]): number {
    let matches = 0;
    for (const keyword of keywords) {
      const regex = new RegExp(keyword.toLowerCase(), 'gi');
      const keywordMatches = text.match(regex);
      if (keywordMatches) {
        matches += keywordMatches.length;
      }
    }
    return matches;
  }

  /**
   * Extract matched keywords from text
   */
  static extractKeywords(
    title: string,
    description: string,
    content: string
  ): string[] {
    const text = `${title} ${description} ${content}`.toLowerCase();
    const allKeywords = [...AI_KEYWORDS, ...TECH_JOB_KEYWORDS];
    const matched = new Set<string>();

    for (const keyword of allKeywords) {
      if (text.includes(keyword.toLowerCase())) {
        matched.add(keyword);
      }
    }

    return Array.from(matched);
  }

  /**
   * Extract US locations mentioned in text
   */
  static extractLocations(
    title: string,
    description: string,
    content: string
  ): string[] {
    const text = `${title} ${description} ${content}`;
    const matched = new Set<string>();

    for (const location of US_LOCATIONS) {
      const regex = new RegExp(location, 'gi');
      if (regex.test(text)) {
        matched.add(location);
      }
    }

    return Array.from(matched);
  }

  /**
   * Categorize article based on content
   */
  static categorizeArticle(keywords: string[]): string[] {
    const categories = new Set<string>();

    const keywordLower = keywords.map((k) => k.toLowerCase());

    if (
      keywordLower.some((k) =>
        ['layoff', 'job cut', 'workforce reduction', 'downsize'].includes(k)
      )
    ) {
      categories.add('Layoffs');
    }

    if (
      keywordLower.some((k) =>
        ['hiring', 'recruiting', 'expansion', 'talent'].includes(k)
      )
    ) {
      categories.add('Hiring');
    }

    if (
      keywordLower.some((k) =>
        ['funding', 'IPO', 'acquisition', 'merger', 'startup'].includes(k)
      )
    ) {
      categories.add('Funding & M&A');
    }

    if (
      keywordLower.some((k) =>
        [
          'gpt',
          'llm',
          'large language model',
          'chatgpt',
          'generative ai',
        ].includes(k)
      )
    ) {
      categories.add('LLM & Generative AI');
    }

    if (
      keywordLower.some((k) =>
        ['autonomous', 'robotics', 'computer vision'].includes(k)
      )
    ) {
      categories.add('Robotics & Autonomy');
    }

    if (categories.size === 0) {
      categories.add('General AI News');
    }

    return Array.from(categories);
  }
}
