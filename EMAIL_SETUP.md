# Email Setup Guide

This guide will help you configure email delivery for the AI News Aggregator.

## Overview

The aggregator can send daily digest emails automatically. Currently configured to send to:
- **Recipient:** burhan@interviewkickstart.com
- **Schedule:** Daily at 12:00 noon
- **Format:** Beautiful HTML email with top stories

## Setup Options

### Option 1: Gmail (Recommended for Testing)

This is the easiest method for personal use.

#### Steps:

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Create an App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Update .env file:**
   ```env
   ENABLE_EMAIL=true
   EMAIL_TO=burhan@interviewkickstart.com
   EMAIL_FROM=your-gmail@gmail.com

   GMAIL_USER=your-gmail@gmail.com
   GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
   ```

4. **Test it:**
   ```bash
   npm run run
   ```

### Option 2: Generic SMTP Server

For production use or other email providers.

#### Common Providers:

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

**AWS SES:**
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
```

**Office 365:**
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@company.com
SMTP_PASS=your-password
```

**Custom SMTP:**
```env
SMTP_HOST=mail.yourcompany.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yourcompany.com
SMTP_PASS=your-password
```

## Configuration Variables

Edit [.env](.env) file:

```env
# Enable/disable email
ENABLE_EMAIL=true

# Email addresses
EMAIL_TO=burhan@interviewkickstart.com
EMAIL_FROM=ai-news@aggregator.com

# Schedule (cron format)
SCHEDULE_CRON=0 12 * * *  # Daily at 12 noon
```

### Cron Schedule Examples:

```
0 12 * * *    # Daily at 12:00 noon
0 9 * * *     # Daily at 9:00 AM
0 17 * * 1-5  # Weekdays at 5:00 PM
0 9,17 * * *  # Daily at 9 AM and 5 PM
```

## Email Content

The digest email includes:

### Summary Section:
- Total articles found
- Top categories
- Average relevance score

### Top 10 Stories:
- Article title (clickable link)
- Source and publication date
- Relevance score
- Short description
- Category tags
- Geographic location

### Format:
- **HTML Version:** Beautiful, responsive design with colors
- **Text Version:** Plain text fallback for email clients

## Testing

### Test Mode (No Email Configuration)

Without email credentials, the system runs in test mode:

```bash
npm run run
```

You'll see:
```
warn: No email configuration found. Using test mode (emails will be logged only).
info: Test mode: Email content generated (not sent)
```

### Production Test (With Email Configuration)

Once configured, test with:

```bash
npm run run
```

Check your inbox at burhan@interviewkickstart.com for the digest.

## Troubleshooting

### "No email configuration found"
- Add GMAIL_USER + GMAIL_APP_PASSWORD **OR** SMTP_* variables to .env
- Restart the application

### "Authentication failed"
- Gmail: Make sure you're using an App Password, not your regular password
- SMTP: Verify username and password are correct
- Check if 2FA is required

### "Connection timeout"
- Check SMTP_HOST and SMTP_PORT
- Verify firewall isn't blocking SMTP ports (587, 465, 25)
- Try SMTP_PORT=465 with SMTP_SECURE=true

### Emails not arriving
- Check spam/junk folder
- Verify EMAIL_TO address is correct
- Check email service logs (Gmail: https://mail.google.com/mail/u/0/#settings/forwarding)

### Rate limits
- Gmail: 500 emails/day for free accounts
- SendGrid: 100 emails/day on free tier
- Consider using a dedicated SMTP service for production

## Disabling Emails

To disable email sending:

```env
ENABLE_EMAIL=false
```

Or remove/comment out all email configuration.

## Schedule Management

### Run Once (Manual)
```bash
npm run run
```

### Start Scheduled Service (12 noon daily)
```bash
npm run schedule
```

### Change Schedule Time

Edit [.env](.env):
```env
SCHEDULE_CRON=0 8 * * *  # 8 AM daily
```

## Production Deployment

For 24/7 operation with PM2:

```bash
npm install -g pm2
pm2 start npm --name "ai-news-aggregator" -- run schedule
pm2 save
pm2 startup
```

View logs:
```bash
pm2 logs ai-news-aggregator
```

## Email Preview

The email will look like this:

```
🤖 AI Tech Jobs News Digest
December 5, 2025

📊 Total Articles: 6
🏷️ Top Categories: LLM & Generative AI, Robotics & Autonomy, Hiring
⭐ Average Relevance: 80%

Top Stories
───────────────────────────────────

1. AWS launches Kiro powers with Stripe, Figma, and Datadog integrations...
   Source: VentureBeat AI | Published: 12/4/2025 | 100%
   AWS launches Kiro powers with Stripe, Figma, and Datadog integrations...
   [LLM & Generative AI] [Robotics & Autonomy] [📍 USA]

[... more articles ...]
```

## Security Notes

- Never commit .env file to version control
- Use App Passwords instead of main passwords
- Rotate credentials periodically
- Use environment variables in production
- Consider using secret management services (AWS Secrets Manager, etc.)

## Support

For issues:
1. Check [logs/error.log](logs/error.log) for detailed errors
2. Verify .env configuration
3. Test with a simple email provider first (Gmail)
4. Review this guide for common issues


## Email to be sent to
devik.kaul@interviewkickstart.com, burhan@interviewkickstart.com,
abhinav.r@interviewkickstart.com,
himanshu.meena@interviewkickstart.com,
madan.rawtani@interviewkickstart.com,
abhishek.sharma@interviewkickstart.com,
kartikey.sharma@interviewkickstart.com,
vanda@interviewkickstart.com,
swapnil.srivastava@interviewkickstart.com,
aashish.kumar@interviewkickstart.com,
ryan@interviewkickstart.com,
raghav@interviewkickstart.com,
payal.saxena@interviewkickstart.com,
soham@interviewkickstart.com 