export type ORM = "prisma" | "drizzle" | "knex" | "typeorm" | "raw-sql";
export type Database = "postgres" | "mysql" | "sqlite";

export interface Migration {
  id: string;
  description: string;
  orm: ORM;
  database: Database;
  createdAt: string;
  generated: GeneratedMigration | null;
}

export interface GeneratedMigration {
  up: string;
  down: string;
  warnings: string[];
  filename: string;
}

const seedGenerated: GeneratedMigration = {
  up: `-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");`,
  down: `-- DropTable
DROP TABLE "users";`,
  warnings: [],
  filename: "20260320000000_create_users_table.sql",
};

const migrations: Migration[] = [
  {
    id: "seed-1",
    description: "Create users table with id, email, name, created_at",
    orm: "prisma",
    database: "postgres",
    createdAt: "2026-03-20T00:00:00.000Z",
    generated: seedGenerated,
  },
];

let nextId = 1;

export function getAllMigrations(): Migration[] {
  return [...migrations].reverse();
}

export function getMigration(id: string): Migration | undefined {
  return migrations.find((m) => m.id === id);
}

export function createMigration(
  description: string,
  orm: ORM,
  database: Database
): Migration {
  const migration: Migration = {
    id: `mig-${nextId++}`,
    description,
    orm,
    database,
    createdAt: new Date().toISOString(),
    generated: null,
  };
  migrations.push(migration);
  return migration;
}

export function setGenerated(
  id: string,
  generated: GeneratedMigration
): Migration | undefined {
  const migration = migrations.find((m) => m.id === id);
  if (migration) {
    migration.generated = generated;
  }
  return migration;
}
