# GitHub Actions Setup Guide

This guide will help you set up automated daily news aggregation using GitHub Actions.

## Overview

GitHub Actions will:
- Run automatically every day at 12:00 noon UTC
- Aggregate AI tech job news from multiple sources
- Send email digest to burhan@interviewkickstart.com
- Store reports and logs as artifacts
- Run for free on GitHub's infrastructure

## Setup Steps

### 1. Create GitHub Repository

```bash
# If not already done
git init
git add .
git commit -m "Initial commit: AI News Aggregator"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/ai-news-aggregator.git
git branch -M main
git push -u origin main
```

### 2. Configure GitHub Secrets

GitHub Secrets keep your credentials secure. Never commit credentials to the repository!

**Go to your repository on GitHub:**
1. Click **Settings** tab
2. Navigate to **Secrets and variables** → **Actions**
3. Click **New repository secret**

**Add these secrets:**

| Secret Name | Value | Example |
|------------|-------|---------|
| `EMAIL_TO` | burhan@interviewkickstart.com | burhan@interviewkickstart.com |
| `EMAIL_FROM` | ai-news@aggregator.com | ai-news@aggregator.com |
| `GMAIL_USER` | Your Gmail address | burhan@interviewkickstart.com |
| `GMAIL_APP_PASSWORD` | Gmail App Password | qclm mhbo bsez zgsf |

**Steps to add each secret:**
1. Click **New repository secret**
2. Enter **Name** (e.g., `GMAIL_USER`)
3. Enter **Value** (your credential)
4. Click **Add secret**

### 3. Enable GitHub Actions

1. Go to your repository on GitHub
2. Click **Actions** tab
3. If prompted, click **Enable GitHub Actions**
4. You should see the workflow: "Daily AI News Aggregation"

### 4. Test the Workflow

**Manual Test:**
1. Go to **Actions** tab
2. Click **Daily AI News Aggregation** workflow
3. Click **Run workflow** button (top right)
4. Select branch: `main`
5. Click **Run workflow**

The workflow will start immediately and you can watch it run in real-time.

**Check the results:**
1. Click on the running workflow
2. Click on the `aggregate-news` job
3. Expand steps to see logs
4. Check your email inbox for the digest

### 5. Verify Schedule

The workflow runs automatically at **12:00 noon UTC** daily.

**Convert to your timezone:**
- UTC 12:00 = 12:00 noon GMT
- UTC 12:00 = 7:00 AM EST (Eastern Time)
- UTC 12:00 = 4:00 AM PST (Pacific Time)
- UTC 12:00 = 5:30 PM IST (India Time)

**To change the schedule:**

Edit [.github/workflows/daily-aggregation.yml](.github/workflows/daily-aggregation.yml):

```yaml
schedule:
  - cron: '0 17 * * *'  # 5:00 PM UTC = 12 noon EST
```

Use [crontab.guru](https://crontab.guru) to help with cron expressions.

## Workflow Features

### Automatic Runs
- Runs daily at scheduled time
- No server or computer needed
- Completely free on GitHub Actions

### Manual Triggers
- Can run manually anytime via "Run workflow" button
- Useful for testing or getting immediate updates

### Artifacts
Reports and logs are saved for review:
- **Reports:** Stored for 30 days
- **Logs:** Stored for 7 days

**To download artifacts:**
1. Go to **Actions** tab
2. Click on a completed workflow run
3. Scroll to **Artifacts** section
4. Download `daily-reports-XXX` or `logs-XXX`

### Email Delivery
- Sends HTML email via Gmail
- Includes top 10 articles
- Beautiful formatting with categories and scores

## Monitoring

### Check Workflow Status

**Via GitHub:**
1. Go to **Actions** tab
2. See recent runs and their status (✓ success, ✗ failed)
3. Click any run for detailed logs

**Via Email:**
- If workflow succeeds, you'll receive the digest email
- If no email arrives, check workflow logs for errors

### Common Issues

#### Workflow doesn't run automatically
- Check workflow file is in `.github/workflows/` directory
- Verify workflow file has `.yml` extension
- Ensure repository has at least one commit on main branch
- Check Actions are enabled in repository settings

#### Email not sent
- Verify all secrets are correctly set (no typos)
- Check Gmail App Password is valid
- Review workflow logs for error messages
- Ensure GMAIL_USER matches the account that created the App Password

#### No articles found
- This is normal if there aren't relevant articles in the last 24 hours
- Check logs to see how many articles were fetched
- Consider lowering `MIN_RELEVANCE_SCORE` in workflow file

## Customization

### Change Schedule Time

Edit [.github/workflows/daily-aggregation.yml](.github/workflows/daily-aggregation.yml):

```yaml
schedule:
  - cron: '0 17 * * *'  # 5:00 PM UTC
```

### Adjust Settings

Edit environment variables in the workflow file:

```yaml
env:
  MAX_ARTICLES_PER_SOURCE: 100  # Get more articles
  MIN_RELEVANCE_SCORE: 0.5      # Lower threshold for more articles
```

### Add Multiple Recipients

Currently supports one recipient. To send to multiple:

**Option 1: Use Gmail alias**
- Forward from burhan@interviewkickstart.com to other addresses

**Option 2: Modify code**
- Update `EMAIL_TO` secret: `email1@example.com,email2@example.com`
- Update [src/services/email.ts](src/services/email.ts) to split and send to multiple addresses

### Run Multiple Times Per Day

Add multiple cron schedules:

```yaml
schedule:
  - cron: '0 9 * * *'   # 9:00 AM UTC
  - cron: '0 17 * * *'  # 5:00 PM UTC
```

## Cost

**GitHub Actions Free Tier:**
- 2,000 minutes/month for private repositories
- Unlimited for public repositories
- This workflow uses ~2 minutes per run
- Daily runs = 60 minutes/month (well within free tier)

**Gmail:**
- Free: 500 emails/day
- This workflow sends 1 email/day (well within free tier)

**Total Cost: $0/month** ✅

## Troubleshooting

### Workflow fails with "npm ci" error
- Check `package-lock.json` is committed to repository
- Try running workflow again (sometimes transient)

### "Permission denied" errors
- Ensure Actions have write permissions:
  - Settings → Actions → General → Workflow permissions
  - Select "Read and write permissions"

### Secrets not found
- Secret names are case-sensitive
- Ensure no spaces in secret names
- Verify secrets are set in correct repository

### Email authentication failed
- Verify Gmail App Password (not regular password)
- Check 2FA is enabled on Gmail account
- Regenerate App Password if needed

## Security Best Practices

✅ **Do:**
- Use GitHub Secrets for all credentials
- Enable 2FA on GitHub account
- Use Gmail App Passwords (not account password)
- Keep .env file in .gitignore
- Rotate credentials periodically

❌ **Don't:**
- Never commit .env file
- Never share GitHub Secret values
- Never use your main Gmail password
- Never disable secret scanning in GitHub

## Updating the Workflow

After making changes to code:

```bash
git add .
git commit -m "Update aggregator"
git push
```

GitHub Actions will automatically use the latest code on the next run.

## Disabling/Pausing

**Temporarily disable:**
1. Go to **Actions** tab
2. Click **Daily AI News Aggregation**
3. Click **⋮** (three dots)
4. Click **Disable workflow**

**Re-enable:**
1. Follow same steps
2. Click **Enable workflow**

## Advanced: Custom Notifications

Want Slack/Discord notifications? Add steps to the workflow:

```yaml
- name: Send Slack notification
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "AI News Aggregation failed!"
      }
```

## Support

For issues:
1. Check workflow logs in Actions tab
2. Verify secrets are correctly configured
3. Test locally first: `npm run run`
4. Review [README.md](README.md) and [EMAIL_SETUP.md](EMAIL_SETUP.md)

## Summary

✅ **What you get:**
- Automated daily news aggregation
- Email digest sent to your inbox
- No servers to maintain
- Completely free
- Runs 24/7 on GitHub's infrastructure

🎯 **Next steps:**
1. Push code to GitHub
2. Add secrets in repository settings
3. Run workflow manually to test
4. Receive daily digests at 12 noon UTC!
