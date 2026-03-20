# NewsletterPilot - Newsletter Content Assistant

**Night 9 of 25 - Overnight Business Factory**

Input your niche + this week's topics and get a ready-to-send newsletter with email-safe HTML.

## Features

- **Newsletter Setup** - Create newsletters with a name, niche, and tone (casual/professional/witty)
- **Topic-Based Generation** - Add multiple topics and generate a complete newsletter edition
- **Email-Safe HTML** - Output is inline-styled HTML ready to paste into any email platform
- **Copy HTML** - One-click copy of the generated newsletter HTML
- **Edition History** - Browse and preview past editions
- **Dark UI** - Sleek dark theme with violet accent color
- **Pre-Seeded Data** - Includes a sample "Tech Pulse Weekly" newsletter with one edition

## Revenue Model

| Plan         | Price   | Features                             |
| ------------ | ------- | ------------------------------------ |
| Hobby        | $15/mo  | 5 newsletters, 10 editions/month     |
| Professional | $39/mo  | Unlimited newsletters and editions   |

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Storage:** In-memory (server-side)
- **External APIs:** None

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests (requires dev server running on port 3000)
npm test
```

## API Endpoints

| Method | Path                              | Description                          |
| ------ | --------------------------------- | ------------------------------------ |
| GET    | /api/newsletters                  | List all newsletters                 |
| POST   | /api/newsletters                  | Create a newsletter                  |
| GET    | /api/newsletters/[id]             | Get newsletter with editions         |
| POST   | /api/newsletters/[id]/generate    | Generate an edition from topics      |

## Project Structure

```
app/
  page.tsx              # Main UI (client component)
  layout.tsx            # Root layout with dark theme
  globals.css           # Global styles
  api/
    store.ts            # In-memory data store
    newsletters/
      route.ts          # GET (list) + POST (create)
      [id]/
        route.ts        # GET (detail with editions)
        generate/
          route.ts      # POST (generate edition)
test.ts                 # 6 test cases
```
