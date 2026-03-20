import { getMigration, setGenerated } from "../../../store";
import { generateMigration } from "../../../generate";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const migration = getMigration(id);

  if (!migration) {
    return Response.json({ error: "Migration not found" }, { status: 404 });
  }

  const generated = generateMigration(
    migration.description,
    migration.orm,
    migration.database
  );

  const updated = setGenerated(id, generated);
  return Response.json(updated);
}
