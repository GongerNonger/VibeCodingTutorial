# CronSpeak - Natural Language Cron Builder

**Night 15 of 25 - Overnight Business Factory**

Describe a schedule in plain English, get a cron expression with a visual timeline and field-by-field breakdown.

## Features

- **Natural Language Input** - Type schedules like "every 5 minutes", "daily at 9am", "every Monday at 3pm"
- **Visual Timeline** - See the next 5 calculated run times with relative time labels
- **Field Breakdown** - Understand each cron field (minute, hour, day of month, month, day of week)
- **Manual Editor** - Edit individual cron fields directly with live preview
- **Quick Presets** - 12 common schedules as one-click buttons
- **Saved Library** - Save and reload your favorite cron expressions
- **Dark Theme** - Easy on the eyes with lime accent colors

## Supported Phrases

| Phrase | Cron |
|--------|------|
| every minute | `* * * * *` |
| every 5 minutes | `*/5 * * * *` |
| every 2 hours | `0 */2 * * *` |
| daily at 9am | `0 9 * * *` |
| every Monday at 3pm | `0 15 * * 1` |
| every weekday at 8am | `0 8 * * 1-5` |
| first day of month | `0 0 1 * *` |
| weekly on Sunday at midnight | `0 0 * * 0` |
| twice a day at 9am and 5pm | `0 9,17 * * *` |
| every 15 minutes during business hours | `*/15 9-17 * * 1-5` |

## Revenue Model

- **Free Tier** - Unlimited cron generation, 5 saved expressions
- **Pro ($5/mo)** - Monitoring integration, unlimited saves, webhook notifications, team sharing

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **In-memory storage** (no database required)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests (requires dev server running)
npm test
```

Open [http://localhost:3000](http://localhost:3000) to use CronSpeak.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/generate | Generate cron from natural language |
| GET | /api/crons | List all saved crons |
| POST | /api/crons | Save a new cron expression |
| GET | /api/crons/[id] | Get a specific saved cron |
