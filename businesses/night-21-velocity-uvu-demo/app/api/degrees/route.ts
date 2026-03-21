import { NextResponse } from "next/server";
import { degreeRequirements, courses } from "../store";

export async function GET() {
  const programs = degreeRequirements.map((deg) => {
    const requiredCourseDetails = deg.requiredCourses
      .map((courseId) => courses.find((c) => c.id === courseId))
      .filter(Boolean);

    const totalRequiredCredits = requiredCourseDetails.reduce(
      (sum, c) => sum + (c?.credits || 0),
      0
    );

    return {
      id: deg.id,
      major: deg.major,
      totalCredits: deg.totalCredits,
      electiveCredits: deg.electiveCredits,
      requiredCourses: requiredCourseDetails,
      totalRequiredCredits,
    };
  });

  return NextResponse.json({ programs, total: programs.length });
}
