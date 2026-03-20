import { getNewsletter, getEditionsForNewsletter } from "../../store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const newsletter = getNewsletter(id);

  if (!newsletter) {
    return Response.json({ error: "Newsletter not found" }, { status: 404 });
  }

  const editions = getEditionsForNewsletter(id);
  return Response.json({ ...newsletter, editions });
}
