import { NextRequest, NextResponse } from "next/server";
import { students, Student } from "../store";

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

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { name, email, major, minor, enrollmentYear, expectedGraduation, completedCredits, requiredCredits, gpa, skills, careerGoals } = body;

  if (!name || !email || !major) {
    return NextResponse.json(
      { error: "Missing required fields: name, email, major" },
      { status: 400 }
    );
  }

  // Check if student already exists by email (update case)
  const existingIndex = students.findIndex((s) => s.email === email);

  const student: Student = {
    id: existingIndex >= 0 ? students[existingIndex].id : `STU-${String(students.length + 1).padStart(3, "0")}`,
    name,
    email,
    major,
    minor: minor || null,
    enrollmentYear: enrollmentYear || 2024,
    expectedGraduation: expectedGraduation || "Spring 2028",
    completedCredits: completedCredits || 0,
    requiredCredits: requiredCredits || 120,
    gpa: gpa || 0,
    skills: skills || [],
    careerGoals: careerGoals || [],
  };

  if (existingIndex >= 0) {
    students[existingIndex] = student;
    return NextResponse.json({ student, updated: true });
  } else {
    students.push(student);
    return NextResponse.json({ student, created: true }, { status: 201 });
  }
}
