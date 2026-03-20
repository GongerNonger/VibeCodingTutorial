import { NextResponse } from "next/server";
import { students } from "../store";

export async function GET() {
  return NextResponse.json({
    students: students.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      major: s.major,
      minor: s.minor,
      gpa: s.gpa,
      completedCredits: s.completedCredits,
      requiredCredits: s.requiredCredits,
      expectedGraduation: s.expectedGraduation,
    })),
    total: students.length,
  });
}
