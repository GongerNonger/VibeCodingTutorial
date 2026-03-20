# CourseForge - Mini-Course Builder

**Night 8 of 25** | Overnight Business Factory

## What It Does

Describe a topic and get a structured 5-lesson mini-course complete with quizzes. CourseForge lets course creators rapidly build educational content with structured lessons, key takeaways, and multiple-choice assessments.

## Revenue Model

**$39/month** for course creators who want to quickly scaffold and deliver mini-courses.

## Features

- **Course Creation** - Define topic, description, and target audience level (beginner/intermediate/advanced)
- **Lesson Generation** - Generate 5 structured lessons per course with realistic content
- **Quiz System** - Each lesson includes a 3-question multiple-choice quiz with instant feedback
- **Progress Tracking** - Track completed lessons with a visual progress bar
- **Lesson Navigation** - Navigate between lessons with prev/next controls
- **Dark Theme UI** - Professional dark interface with emerald accent colors

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Storage:** In-memory (no database required)
- **External APIs:** None - fully self-contained

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to start building courses.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | List all courses |
| POST | `/api/courses` | Create a new course |
| GET | `/api/courses/[id]` | Get a specific course |
| POST | `/api/courses/[id]/generate` | Generate 5 lessons with quizzes |

## Pre-seeded Data

The app comes with a sample "Introduction to TypeScript" course with 5 complete lessons and quizzes, ready to explore immediately.
