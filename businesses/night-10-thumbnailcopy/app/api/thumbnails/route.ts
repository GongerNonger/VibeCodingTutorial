import { NextRequest, NextResponse } from "next/server";
import { createProject, getAllProjects, Emotion } from "../store";

const VALID_EMOTIONS: Emotion[] = ["curiosity", "shock", "excitement", "fear", "joy"];

export async function GET() {
  const projects = getAllProjects();
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoTitle, niche, targetEmotion } = body;

    if (!videoTitle || typeof videoTitle !== "string" || videoTitle.trim().length === 0) {
      return NextResponse.json(
        { error: "videoTitle is required" },
        { status: 400 }
      );
    }

    if (!niche || typeof niche !== "string" || niche.trim().length === 0) {
      return NextResponse.json(
        { error: "niche is required" },
        { status: 400 }
      );
    }

    if (!targetEmotion || !VALID_EMOTIONS.includes(targetEmotion)) {
      return NextResponse.json(
        { error: `targetEmotion must be one of: ${VALID_EMOTIONS.join(", ")}` },
        { status: 400 }
      );
    }

    const project = createProject(videoTitle.trim(), niche.trim(), targetEmotion);
    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
