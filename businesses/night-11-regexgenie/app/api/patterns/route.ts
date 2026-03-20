import { NextRequest, NextResponse } from "next/server";
import { getAllPatterns, savePattern } from "../store";

export async function GET() {
  const patterns = getAllPatterns();
  return NextResponse.json(patterns);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, regex, flags, testStrings } = body;

    if (!description || !regex) {
      return NextResponse.json(
        { error: "Description and regex are required" },
        { status: 400 }
      );
    }

    // Validate that the regex is valid
    try {
      new RegExp(regex, flags || "");
    } catch {
      return NextResponse.json(
        { error: "Invalid regex pattern" },
        { status: 400 }
      );
    }

    const pattern = savePattern({
      description,
      regex,
      flags: flags || "",
      testStrings: testStrings || [],
    });

    return NextResponse.json(pattern, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
