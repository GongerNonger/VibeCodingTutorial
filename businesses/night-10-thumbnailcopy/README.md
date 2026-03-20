# ThumbnailCopy - YouTube Thumbnail Text Optimizer

**Night 10 of 25** | Overnight Business Factory

## What It Does

Analyze your video niche and title, get optimized thumbnail text suggestions with visual preview. ThumbnailCopy generates 5 high-impact text options per project, complete with color scheme recommendations, font suggestions, and viral scores.

## Features

- **Smart Text Generation** — AI-powered suggestions based on your niche, title, and target emotion
- **Visual Preview** — See your thumbnail text rendered on colored backgrounds before creating
- **Viral Score** — Each suggestion rated 1-100 for click-through potential
- **5 Target Emotions** — Curiosity, Shock, Excitement, Fear, Joy
- **10 Niche Categories** — Programming, Gaming, Cooking, Fitness, Finance, Tech, Travel, Beauty, Music, Education
- **Copy to Clipboard** — One-click copy for any suggestion
- **Tips Sidebar** — Built-in thumbnail best practices

## Revenue Model

**$9/month** subscription for unlimited projects and generations.

## Tech Stack

- **Frontend:** Next.js 14 + React + TypeScript
- **Styling:** Tailwind CSS (dark theme, orange accent)
- **Backend:** Next.js API Routes
- **Storage:** In-memory (no database required)
- **AI:** Mock generation engine (no external API calls)

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

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/thumbnails` | List all projects |
| POST | `/api/thumbnails` | Create a new project |
| GET | `/api/thumbnails/[id]` | Get project with suggestions |
| POST | `/api/thumbnails/[id]/generate` | Generate 5 text suggestions |

### Create Project Body

```json
{
  "videoTitle": "10 React Tips for Beginners",
  "niche": "programming",
  "targetEmotion": "curiosity"
}
```

### Suggestion Response

```json
{
  "id": "uuid",
  "primaryText": "HIDDEN CODE TRICKS",
  "subtitleText": "Must See",
  "colorScheme": "Yellow on dark purple (#FFD700 on #1a0533)",
  "fontStyle": "Bold Impact / Bebas Neue",
  "viralScore": 88
}
```

## Project Structure

```
app/
  layout.tsx          # Root layout with dark theme
  page.tsx            # Main UI (client component)
  globals.css         # Tailwind imports
  api/
    store.ts          # In-memory store + mock AI engine
    thumbnails/
      route.ts        # GET list, POST create
      [id]/
        route.ts      # GET project by id
        generate/
          route.ts    # POST generate suggestions
test.ts               # 6 test cases
```
