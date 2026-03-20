import { getMigration } from "../../store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const migration = getMigration(id);

  if (!migration) {
    return Response.json({ error: "Migration not found" }, { status: 404 });
  }

  return Response.json(migration);
}
