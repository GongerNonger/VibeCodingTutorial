import { NextRequest, NextResponse } from "next/server";
import { store } from "../store";

export async function GET() {
  const courses = store.getAll();
  return NextResponse.json(courses);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { topic, description, audienceLevel } = body;

  if (!topic || !description || !audienceLevel) {
    return NextResponse.json(
      { error: "topic, description, and audienceLevel are required" },
      { status: 400 }
    );
  }

  if (!["beginner", "intermediate", "advanced"].includes(audienceLevel)) {
    return NextResponse.json(
      { error: "audienceLevel must be beginner, intermediate, or advanced" },
      { status: 400 }
    );
  }

  const course = store.create({ topic, description, audienceLevel });
  return NextResponse.json(course, { status: 201 });
}
