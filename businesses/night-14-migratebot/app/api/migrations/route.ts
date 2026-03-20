import { getAllMigrations, createMigration, ORM, Database } from "../store";

export const dynamic = "force-dynamic";

const VALID_ORMS: ORM[] = ["prisma", "drizzle", "knex", "typeorm", "raw-sql"];
const VALID_DBS: Database[] = ["postgres", "mysql", "sqlite"];

export async function GET() {
  const migrations = getAllMigrations();
  return Response.json(migrations);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { description, orm, database } = body;

  if (!description || typeof description !== "string" || !description.trim()) {
    return Response.json(
      { error: "description is required" },
      { status: 400 }
    );
  }

  if (!VALID_ORMS.includes(orm)) {
    return Response.json(
      { error: `orm must be one of: ${VALID_ORMS.join(", ")}` },
      { status: 400 }
    );
  }

  if (!VALID_DBS.includes(database)) {
    return Response.json(
      { error: `database must be one of: ${VALID_DBS.join(", ")}` },
      { status: 400 }
    );
  }

  const migration = createMigration(description.trim(), orm, database);
  return Response.json(migration, { status: 201 });
}
