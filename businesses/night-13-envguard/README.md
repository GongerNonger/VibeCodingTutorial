# EnvGuard - .env File Security Scanner

**Night 13 of 25** - Overnight Business Factory

## What It Does

Paste your .env, YAML, JSON, or TOML config files and get an instant security scan that identifies:

- **Leaked secrets** - AWS keys (AKIA...), Stripe keys, GitHub tokens, SendGrid keys, Slack tokens
- **Weak passwords** - Common passwords, short values, sequential patterns
- **Embedded credentials** - Database URLs with hardcoded usernames/passwords
- **Hardcoded IPs** - Private IP addresses that should use DNS
- **Private keys** - RSA/EC/DSA private keys stored in config

Each finding includes a severity level (critical/high/medium/low), the exact line number, and a specific remediation recommendation.

## Revenue Model

- **$15/month per project** - Team-based scanning with history and reporting
- Export markdown reports for compliance documentation
- Scan history with risk score tracking over time

## Tech Stack

- **Next.js** with TypeScript and App Router
- **Tailwind CSS** - Dark theme with red accent
- **In-memory storage** - No database required for demo
- **Pattern matching** - Local analysis, no external API calls

## Features

- Dark theme UI (bg-gray-950) with red-500 accent
- Scan input form with project name, file type selector, and large textarea
- Scan history sidebar with color-coded risk score badges (green/yellow/red)
- Findings report with overall risk score gauge, severity badges, and line numbers
- Expandable recommendations per finding
- Export Report button (copies markdown to clipboard)
- Security tips section
- Pre-seeded sample scan with a deliberately insecure .env file

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests (requires dev server running on port 3000)
npx tsx test.ts
```

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/scans | Create a new scan (projectName, fileContent, fileType) |
| GET | /api/scans | List all scans with summary info |
| GET | /api/scans/[id] | Get a specific scan with full details |
| POST | /api/scans/[id]/analyze | Run security analysis on a scan |

## Supported File Types

- `.env` - Environment variable files
- `.yaml` / `.yml` - YAML configuration files
- `.json` - JSON configuration files
- `.toml` - TOML configuration files
