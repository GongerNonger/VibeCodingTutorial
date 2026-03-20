import { NextRequest } from "next/server";
import { getAllScans, createScan } from "../store";

export async function GET() {
  const scans = getAllScans().map((s) => ({
    id: s.id,
    projectName: s.projectName,
    fileType: s.fileType,
    createdAt: s.createdAt,
    hasAnalysis: s.analysis !== null,
    riskScore: s.analysis?.riskScore ?? null,
    findingsCount: s.analysis?.findings.length ?? 0,
  }));
  return Response.json(scans);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { projectName, fileContent, fileType } = body;

  if (!projectName || !fileContent || !fileType) {
    return Response.json(
      { error: "Missing required fields: projectName, fileContent, fileType" },
      { status: 400 }
    );
  }

  const validTypes = [".env", ".yaml", ".yml", ".json", ".toml"];
  if (!validTypes.includes(fileType)) {
    return Response.json(
      { error: `Invalid fileType. Must be one of: ${validTypes.join(", ")}` },
      { status: 400 }
    );
  }

  const scan = createScan(projectName, fileContent, fileType);
  return Response.json(scan, { status: 201 });
}
