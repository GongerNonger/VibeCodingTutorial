import { getScan, setScanAnalysis } from "../../../store";
import { analyzeContent } from "../../../analyzer";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const scan = getScan(id);

  if (!scan) {
    return Response.json({ error: "Scan not found" }, { status: 404 });
  }

  const result = analyzeContent(scan.fileContent, scan.fileType);
  setScanAnalysis(id, result);

  return Response.json({
    id: scan.id,
    projectName: scan.projectName,
    analysis: result,
  });
}
