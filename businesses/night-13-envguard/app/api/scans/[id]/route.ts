import { getScan } from "../../store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const scan = getScan(id);

  if (!scan) {
    return Response.json({ error: "Scan not found" }, { status: 404 });
  }

  return Response.json(scan);
}
