import nodemailer from 'nodemailer';
import { NewsArticle } from '../models/types';
import { logger } from '../utils/logger';

export class EmailService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;
  private toEmail: string;

  constructor() {
    this.fromEmail = process.env.EMAIL_FROM || 'ai-news@aggregator.com';
    this.toEmail = process.env.EMAIL_TO || 'burhan@interviewkickstart.com';

    // Create transporter based on configuration
    if (process.env.SMTP_HOST) {
      // Use SMTP configuration
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      // Use Gmail configuration
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });
    } else {
      // Development mode: log emails instead of sending
      logger.warn('No email configuration found. Using test mode (emails will be logged only).');
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true,
      });
    }
  }

  /**
   * Send daily digest email
   */
  async sendDailyDigest(articles: NewsArticle[]): Promise<void> {
    try {
      const subject = `AI Tech Jobs News Digest - ${new Date().toLocaleDateString()}`;
      const html = this.generateEmailHTML(articles);
      const text = this.generateEmailText(articles);

      const mailOptions = {
        from: this.fromEmail,
        to: this.toEmail,
        subject,
        html,
        text,
      };

      const info = await this.transporter.sendMail(mailOptions);

      if (process.env.SMTP_HOST || process.env.GMAIL_USER) {
        logger.info(`Email sent successfully to ${this.toEmail}`);
        logger.info(`Message ID: ${info.messageId}`);
      } else {
        logger.info('Test mode: Email content generated (not sent)');
        logger.debug(`Email preview: ${info.message}`);
      }
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Generate HTML email content
   */
  private generateEmailHTML(articles: NewsArticle[]): string {
    const date = new Date().toDateString();
    const topArticles = articles.slice(0, 10);

    const categoryCount = new Map<string, number>();
    articles.forEach((article) => {
      article.categories.forEach((cat) => {
        categoryCount.set(cat, (categoryCount.get(cat) || 0) + 1);
      });
    });

    const topCategories = Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat, count]) => `${cat} (${count})`)
      .join(', ');

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .summary {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
        }
        .summary-item {
            margin: 8px 0;
            font-size: 14px;
        }
        .article {
            border-left: 3px solid #667eea;
            padding: 15px;
            margin-bottom: 20px;
            background: #f8f9fa;
            border-radius: 4px;
        }
        .article h3 {
            margin: 0 0 8px 0;
            font-size: 16px;
        }
        .article h3 a {
            color: #667eea;
            text-decoration: none;
        }
        .article h3 a:hover {
            text-decoration: underline;
        }
        .article-meta {
            font-size: 12px;
            color: #666;
            margin-bottom: 8px;
        }
        .article-description {
            font-size: 14px;
            color: #444;
        }
        .tags {
            margin-top: 10px;
        }
        .tag {
            display: inline-block;
            background: #e3e8ff;
            color: #667eea;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 11px;
            margin-right: 5px;
            margin-top: 5px;
        }
        .score {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 3px 8px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 AI Tech Jobs News Digest</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px;">${date}</p>
        </div>

        <div class="summary">
            <div class="summary-item"><strong>📊 Total Articles:</strong> ${articles.length}</div>
            <div class="summary-item"><strong>🏷️ Top Categories:</strong> ${topCategories || 'N/A'}</div>
            <div class="summary-item"><strong>⭐ Average Relevance:</strong> ${((articles.reduce((sum, a) => sum + a.relevanceScore, 0) / articles.length) * 100).toFixed(0)}%</div>
        </div>

        <h2 style="color: #667eea; font-size: 18px; margin-bottom: 15px;">Top Stories</h2>

        ${topArticles
          .map(
            (article) => `
        <div class="article">
            <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
            <div class="article-meta">
                <strong>Source:</strong> ${article.source} |
                <strong>Published:</strong> ${new Date(article.publishedAt).toLocaleDateString()} |
                <span class="score">${(article.relevanceScore * 100).toFixed(0)}%</span>
            </div>
            <div class="article-description">${article.description}</div>
            <div class="tags">
                ${article.categories.map((cat) => `<span class="tag">${cat}</span>`).join('')}
                ${article.location ? `<span class="tag">📍 ${article.location}</span>` : ''}
            </div>
        </div>
        `
          )
          .join('')}

        ${articles.length > 10 ? `<p style="text-align: center; color: #666; font-size: 14px;">... and ${articles.length - 10} more articles</p>` : ''}

        <div class="footer">
            <p>This is your automated AI Tech Jobs News digest.</p>
            <p>Generated by AI News Aggregator on ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Generate plain text email content
   */
  private generateEmailText(articles: NewsArticle[]): string {
    const date = new Date().toDateString();
    const topArticles = articles.slice(0, 10);

    let text = `AI TECH JOBS NEWS DIGEST\n`;
    text += `${date}\n`;
    text += `${'='.repeat(50)}\n\n`;
    text += `Total Articles: ${articles.length}\n`;
    text += `Average Relevance: ${((articles.reduce((sum, a) => sum + a.relevanceScore, 0) / articles.length) * 100).toFixed(0)}%\n\n`;
    text += `TOP STORIES\n`;
    text += `${'='.repeat(50)}\n\n`;

    topArticles.forEach((article, index) => {
      text += `${index + 1}. ${article.title}\n`;
      text += `   Source: ${article.source} | Relevance: ${(article.relevanceScore * 100).toFixed(0)}%\n`;
      text += `   ${article.description}\n`;
      text += `   Categories: ${article.categories.join(', ')}\n`;
      text += `   Link: ${article.url}\n\n`;
    });

    if (articles.length > 10) {
      text += `... and ${articles.length - 10} more articles\n\n`;
    }

    text += `${'='.repeat(50)}\n`;
    text += `Generated by AI News Aggregator\n`;

    return text;
  }
}
