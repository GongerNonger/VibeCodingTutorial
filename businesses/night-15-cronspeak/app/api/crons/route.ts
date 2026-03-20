import { NextRequest, NextResponse } from "next/server";
import { getAllCrons, addCron } from "../store";

export async function GET() {
  return NextResponse.json(getAllCrons());
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { expression, description, label } = body;

    if (!expression || !description || !label) {
      return NextResponse.json(
        { error: "expression, description, and label are required" },
        { status: 400 }
      );
    }

    const entry = addCron({ expression, description, label });
    return NextResponse.json(entry, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
