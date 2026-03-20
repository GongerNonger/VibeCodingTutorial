import { NextRequest, NextResponse } from "next/server";
import { generateSuggestions, getProject } from "../../../store";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const project = getProject(params.id);

  if (!project) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }

  const suggestions = generateSuggestions(params.id);

  return NextResponse.json({
    projectId: params.id,
    suggestions,
  });
}
