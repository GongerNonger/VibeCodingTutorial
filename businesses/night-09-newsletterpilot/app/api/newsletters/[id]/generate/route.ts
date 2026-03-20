import { generateEdition, getNewsletter } from "../../../store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const newsletter = getNewsletter(id);

  if (!newsletter) {
    return Response.json({ error: "Newsletter not found" }, { status: 404 });
  }

  const body = await request.json();
  const { topics } = body;

  if (!topics || !Array.isArray(topics) || topics.length === 0) {
    return Response.json(
      { error: "topics must be a non-empty array of strings" },
      { status: 400 }
    );
  }

  const edition = generateEdition(id, topics);

  if (!edition) {
    return Response.json(
      { error: "Failed to generate edition" },
      { status: 500 }
    );
  }

  return Response.json(edition, { status: 201 });
}
