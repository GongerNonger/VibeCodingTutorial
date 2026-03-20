import { NextRequest, NextResponse } from "next/server";
import { students } from "../store";
import { getAdvisorRecommendation } from "../advisor";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { studentId } = body;

  if (!studentId) {
    return NextResponse.json(
      { error: "Missing required field: studentId" },
      { status: 400 }
    );
  }

  const student = students.find((s) => s.id === studentId);
  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const recommendation = getAdvisorRecommendation(student);
  return NextResponse.json({ recommendation });
}
