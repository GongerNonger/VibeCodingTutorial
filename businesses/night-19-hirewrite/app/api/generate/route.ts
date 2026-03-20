import { NextRequest, NextResponse } from "next/server";
import { generateJobDescription, GenerateInput } from "@/lib/generator";

export async function POST(request: NextRequest) {
  try {
    const body: GenerateInput = await request.json();

    // Validate required fields
    if (!body.role?.title || !body.role?.department) {
      return NextResponse.json(
        { error: "Role title and department are required" },
        { status: 400 }
      );
    }

    const result = generateJobDescription(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate job description" },
      { status: 500 }
    );
  }
}
