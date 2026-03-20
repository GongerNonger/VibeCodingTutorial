# RegexGenie - Natural Language to Regex

> Night 11 of 25 - Overnight Business Factory

Describe what you want to match in plain English, get tested regex patterns instantly.

## Features

- **Natural Language Input** - Type what you want to match (email, phone, URL, etc.)
- **Instant Regex Generation** - Get correct, tested regex patterns with no external API calls
- **Syntax Highlighting** - Each regex component is color-coded for easy reading
- **Pattern Breakdown** - Every part of the regex explained in plain English
- **Live Testing** - Paste test strings and see real-time match results with highlighted matches
- **Captured Groups** - View captured groups from regex matches
- **Copy to Clipboard** - One-click copy of the generated regex
- **Pattern Library** - Save patterns and access them from the sidebar
- **Quick-Select Grid** - Common patterns (email, URL, phone, IP, date, hex color, credit card, password) available with one click
- **Pre-seeded Patterns** - 6 common patterns ready to use out of the box

## Supported Patterns

| Pattern         | Example Input                    |
| --------------- | -------------------------------- |
| Email           | `user@example.com`               |
| Phone (US)      | `(555) 123-4567`                 |
| URL             | `https://example.com/path`       |
| IP Address      | `192.168.1.1`                    |
| Date (ISO)      | `2024-01-15`                     |
| Credit Card     | `4111111111111111`               |
| Hex Color       | `#FF5733`                        |
| Strong Password | `P@ssw0rd!`                      |

## Revenue Model

- **Free Tier** - Unlimited regex generation
- **Pro ($9/mo)** - Saved patterns library and API access

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- In-memory storage (no database required)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests (requires dev server running)
npm test
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

- `POST /api/generate` - Generate regex from natural language description
- `GET /api/patterns` - List all saved patterns
- `POST /api/patterns` - Save a new pattern
- `GET /api/patterns/[id]` - Get a specific pattern by ID
