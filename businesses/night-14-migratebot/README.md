# MigrateBot - Database Migration Generator

**Night 14 of 25 - Overnight Business Factory**

Describe schema changes in plain English, get migration files for your ORM. No more writing boilerplate migration code by hand.

## Features

- **Natural Language Input** - Describe changes like "Create users table with id, email, name" or "Add status column to orders table"
- **Multi-ORM Support** - Generate migrations for Prisma, Drizzle, Knex, TypeORM, or raw SQL
- **Multi-Database** - PostgreSQL, MySQL, and SQLite output
- **Smart Parsing** - Recognizes create table, add column, rename column, add index, and drop table operations
- **Up & Down Migrations** - Always generates both directions for safe rollbacks
- **Data Loss Warnings** - Alerts when operations might cause data loss (e.g., dropping tables)
- **Schema Visualization** - Text-based visual representation of schema changes
- **Copy to Clipboard** - One-click copy for generated migration code
- **Migration History** - Browse and revisit previously generated migrations

## Revenue Model

$19/month subscription for unlimited migration generation with advanced features.

## Tech Stack

- **Framework**: Next.js (App Router) with TypeScript
- **Styling**: Tailwind CSS (dark theme with teal accent)
- **Storage**: In-memory (server-side)
- **API**: Next.js Route Handlers

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

Open [http://localhost:3000](http://localhost:3000) to use the app.

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/migrations | Create a new migration |
| GET | /api/migrations | List all migrations |
| GET | /api/migrations/[id] | Get a specific migration |
| POST | /api/migrations/[id]/generate | Generate migration code |

## Supported Operations

- `Create table X with columns A, B, C`
- `Add column X to table Y`
- `Rename column X to Y in table Z`
- `Add index on table X (columns)`
- `Drop table X`
