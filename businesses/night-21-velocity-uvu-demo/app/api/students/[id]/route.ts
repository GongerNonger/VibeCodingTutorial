import { NextRequest, NextResponse } from "next/server";
import { students } from "../../store";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const student = students.find((s) => s.id === params.id);
  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }
  return NextResponse.json({ student });
}
