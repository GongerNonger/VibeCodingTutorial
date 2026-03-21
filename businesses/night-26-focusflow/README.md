# Night 26: FocusFlow - ADHD-Friendly AI Task Manager

## What It Does

FocusFlow helps adults with ADHD (and anyone feeling overwhelmed) manage tasks without the overwhelm. Brain dump everything on your mind, and FocusFlow serves you exactly ONE task at a time with a timer and encouragement.

**No configuration paralysis. No overwhelming lists. Just: what's next?**

## Revenue Model

$9-15/month per user. $29/month for AI coaching tier.

## Target Market

- Adults with ADHD (8-10M in the US)
- Overwhelmed professionals
- Anyone who finds Todoist/Notion too complex

## Features

- **Brain dump input** - Type or paste everything on your mind, one task per line
- **AI prioritization** - Auto-detects urgency, effort, and category from natural language
- **One task at a time** - Only shows your highest-priority task. No overwhelming lists.
- **Focus timer** - Built-in timer to track time spent on each task
- **Encouragement system** - Motivational messages tailored to each task
- **Dopamine rewards** - Celebration messages at milestones (1, 3, 5, 10+ tasks)
- **Progress tracking** - Completion rate, time spent, streak counter
- **Peek mode** - Optionally view full task list (hidden by default)
- **Skip & come back** - Skip tasks without guilt; they stay in the queue
- **Session summary** - End-of-session report showing everything you accomplished

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Dark theme with amber-500/orange-500 accents

## Getting Started

```bash
cd businesses/night-26-focusflow
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Running Tests

```bash
npm test
```

## Deployment

Deploy to Vercel:

```bash
npx vercel
```

No environment variables needed - the core brain dump parser runs client-side with server-side session storage.

## How It Works

1. **Brain Dump** - User dumps all tasks as free text
2. **Smart Parsing** - NLP detects urgency ("ASAP", "today", "someday"), effort ("quick", "just", large descriptions), and category (work, health, errands, creative, personal)
3. **Priority Scoring** - Combines urgency weight + effort bonus (tiny tasks get priority) + randomization to break ties
4. **One-at-a-time** - Shows only the top task with a timer and encouragement
5. **Complete or Skip** - User marks done (gets celebration) or skips (task stays in queue)
6. **Session Summary** - Final stats showing completion rate and accomplishments

## Why This Works for ADHD

- **Reduces decision fatigue** - No choosing from a list
- **Tiny tasks first** - Quick wins build momentum and dopamine
- **No visible backlog** - The list is hidden by default
- **Encouragement, not guilt** - Positive messaging, skip without shame
- **Timer creates urgency** - External structure for time-blind brains
