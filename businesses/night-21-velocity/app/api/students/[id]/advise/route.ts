import { NextRequest, NextResponse } from "next/server";
import { students } from "../../../store";
import { getAdvisorRecommendation } from "../../../advisor";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const student = students.find((s) => s.id === params.id);
  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const recommendation = getAdvisorRecommendation(student);
  return NextResponse.json({ recommendation });
}
