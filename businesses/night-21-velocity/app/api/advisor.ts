// Velocity - AI Advisor Engine
// Local algorithmic advisor logic - no external APIs

import {
  Student,
  Course,
  CareerPath,
  DegreeRequirement,
  AdvisorRecommendation,
  CareerAnalysis,
  InstitutionalAnalytics,
  students,
  courses,
  careerPaths,
  degreeRequirements,
} from "./store";

// --- Graduation Progress ---

export function calculateGraduationProgress(student: Student) {
  const percentComplete = Math.round((student.completedCredits / student.requiredCredits) * 100);
  const creditsRemaining = student.requiredCredits - student.completedCredits;
  const creditsPerSemester = 15;
  const estimatedSemesters = Math.ceil(creditsRemaining / creditsPerSemester);

  const currentYear = 2026;
  const currentSemester = 1; // Spring
  let gradYear = currentYear;
  let gradSemester = currentSemester;
  for (let i = 0; i < estimatedSemesters; i++) {
    gradSemester++;
    if (gradSemester > 2) {
      gradSemester = 1;
      gradYear++;
    }
  }
  const semesterLabel = gradSemester === 1 ? "Spring" : "Fall";
  const estimatedGraduation = `${semesterLabel} ${gradYear}`;

  // Parse expected graduation for on-track check
  const expectedParts = student.expectedGraduation.split(" ");
  const expectedSem = expectedParts[0] === "Spring" ? 1 : 2;
  const expectedYear = parseInt(expectedParts[1]);
  const expectedTotal = expectedYear * 2 + expectedSem;
  const estimatedTotal = gradYear * 2 + gradSemester;
  const onTrack = estimatedTotal <= expectedTotal;

  return {
    percentComplete,
    creditsRemaining,
    creditsCompleted: student.completedCredits,
    requiredCredits: student.requiredCredits,
    estimatedSemesters,
    estimatedGraduation,
    onTrack,
  };
}

// --- Course Recommendations ---

export function recommendCourses(student: Student): { course: Course; reasoning: string }[] {
  const degree = degreeRequirements.find((d) => d.major === student.major);
  if (!degree) return [];

  const studentSkillsLower = student.skills.map((s) => s.toLowerCase());

  // Find required courses the student likely hasn't taken (based on skills overlap)
  const recommendations: { course: Course; reasoning: string; priority: number }[] = [];

  for (const courseId of degree.requiredCourses) {
    const course = courses.find((c) => c.id === courseId);
    if (!course) continue;

    // Check if student likely already took this course (has most of the skills)
    const skillsFromCourse = course.skillsTaught.map((s) => s.toLowerCase());
    const alreadyHasSkills = skillsFromCourse.filter((s) => studentSkillsLower.includes(s));
    const coverage = alreadyHasSkills.length / skillsFromCourse.length;

    if (coverage >= 0.8) continue; // Likely already completed

    // Check prerequisites met (simplified: check if student has skills from prereq courses)
    const prereqsMet = checkPrerequisitesMet(student, course);

    if (prereqsMet) {
      // Prioritize courses that align with career goals
      const careerRelevance = calculateCareerRelevance(student, course);
      const reasoning = generateCourseReasoning(student, course, careerRelevance);

      recommendations.push({
        course,
        reasoning,
        priority: careerRelevance + (coverage < 0.3 ? 2 : 0),
      });
    }
  }

  // Also add elective recommendations based on career goals
  const electiveRecs = getElectiveRecommendations(student, degree);
  recommendations.push(...electiveRecs);

  // Sort by priority and return top 4
  return recommendations
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 4)
    .map(({ course, reasoning }) => ({ course, reasoning }));
}

function checkPrerequisitesMet(student: Student, course: Course): boolean {
  if (course.prerequisites.length === 0) return true;

  // Simplified: check if student has skills that prerequisite courses teach
  for (const prereqCode of course.prerequisites) {
    const prereqCourse = courses.find((c) => c.code === prereqCode || c.id === prereqCode);
    if (!prereqCourse) continue;

    const prereqSkills = prereqCourse.skillsTaught.map((s) => s.toLowerCase());
    const studentSkills = student.skills.map((s) => s.toLowerCase());
    const hasPrereqSkills = prereqSkills.some((s) => studentSkills.includes(s));

    if (!hasPrereqSkills) return false;
  }
  return true;
}

function calculateCareerRelevance(student: Student, course: Course): number {
  let relevance = 0;
  const goalCareers = careerPaths.filter((cp) =>
    student.careerGoals.some((g) => cp.title.toLowerCase().includes(g.toLowerCase()) || g.toLowerCase().includes(cp.title.toLowerCase()))
  );

  for (const career of goalCareers) {
    const neededSkills = career.requiredSkills.map((s) => s.toLowerCase());
    const courseTeaches = course.skillsTaught.map((s) => s.toLowerCase());
    const overlap = courseTeaches.filter((s) => neededSkills.includes(s));
    relevance += overlap.length * 2;
  }

  return relevance;
}

function generateCourseReasoning(student: Student, course: Course, careerRelevance: number): string {
  const reasons: string[] = [];

  if (careerRelevance > 0) {
    const relevantGoals = student.careerGoals.filter((goal) => {
      const career = careerPaths.find(
        (cp) => cp.title.toLowerCase().includes(goal.toLowerCase()) || goal.toLowerCase().includes(cp.title.toLowerCase())
      );
      if (!career) return false;
      return course.skillsTaught.some((s) => career.requiredSkills.map((r) => r.toLowerCase()).includes(s.toLowerCase()));
    });
    if (relevantGoals.length > 0) {
      reasons.push(`Directly supports your goal of becoming a ${relevantGoals[0]}`);
    }
  }

  const newSkills = course.skillsTaught.filter((s) => !student.skills.map((sk) => sk.toLowerCase()).includes(s.toLowerCase()));
  if (newSkills.length > 0) {
    reasons.push(`Develops new skills: ${newSkills.slice(0, 3).join(", ")}`);
  }

  reasons.push(`Required for ${student.major} degree (${course.credits} credits)`);

  return reasons.join(". ") + ".";
}

function getElectiveRecommendations(
  student: Student,
  _degree: DegreeRequirement
): { course: Course; reasoning: string; priority: number }[] {
  const recs: { course: Course; reasoning: string; priority: number }[] = [];

  // Find courses outside the major that align with career goals
  const goalCareers = careerPaths.filter((cp) =>
    student.careerGoals.some((g) => cp.title.toLowerCase().includes(g.toLowerCase()) || g.toLowerCase().includes(cp.title.toLowerCase()))
  );

  for (const course of courses) {
    if (course.department === student.major) continue;

    for (const career of goalCareers) {
      const neededSkills = career.requiredSkills.map((s) => s.toLowerCase());
      const courseTeaches = course.skillsTaught.map((s) => s.toLowerCase());
      const studentSkills = student.skills.map((s) => s.toLowerCase());

      const gapSkillsTaught = courseTeaches.filter((s) => neededSkills.includes(s) && !studentSkills.includes(s));

      if (gapSkillsTaught.length > 0 && checkPrerequisitesMet(student, course)) {
        recs.push({
          course,
          reasoning: `Elective that fills skill gaps for ${career.title}: teaches ${gapSkillsTaught.join(", ")}.`,
          priority: gapSkillsTaught.length,
        });
        break;
      }
    }
  }

  return recs;
}

// --- Risk Alerts ---

export function generateRiskAlerts(student: Student): { type: string; severity: "low" | "medium" | "high"; message: string }[] {
  const alerts: { type: string; severity: "low" | "medium" | "high"; message: string }[] = [];
  const progress = calculateGraduationProgress(student);

  // GPA alerts
  if (student.gpa < 2.0) {
    alerts.push({
      type: "Academic Standing",
      severity: "high",
      message: `GPA of ${student.gpa} is below 2.0. Student is at risk of academic probation. Immediate intervention recommended.`,
    });
  } else if (student.gpa < 2.5) {
    alerts.push({
      type: "GPA Warning",
      severity: "medium",
      message: `GPA of ${student.gpa} is approaching academic concern threshold. Consider lighter course load or tutoring resources.`,
    });
  } else if (student.gpa < 3.0) {
    alerts.push({
      type: "GPA Advisory",
      severity: "low",
      message: `GPA of ${student.gpa} is adequate but may limit graduate school or competitive career options.`,
    });
  }

  // Schedule alerts
  if (!progress.onTrack) {
    alerts.push({
      type: "Graduation Delay",
      severity: "high",
      message: `Currently projected to graduate ${progress.estimatedGraduation}, which is later than the expected ${student.expectedGraduation}. Consider increasing course load.`,
    });
  }

  // Credit pace
  const yearsEnrolled = 2026 - student.enrollmentYear;
  const expectedCredits = yearsEnrolled * 30; // 30 credits per year
  if (student.completedCredits < expectedCredits * 0.85) {
    alerts.push({
      type: "Credit Pace",
      severity: "medium",
      message: `Completed ${student.completedCredits} credits, but expected approximately ${expectedCredits} by this point. May need to take summer courses.`,
    });
  }

  // Skill gap alerts
  const goalCareers = careerPaths.filter((cp) =>
    student.careerGoals.some((g) => cp.title.toLowerCase().includes(g.toLowerCase()) || g.toLowerCase().includes(cp.title.toLowerCase()))
  );
  for (const career of goalCareers) {
    const neededSkills = career.requiredSkills;
    const studentSkills = student.skills.map((s) => s.toLowerCase());
    const missing = neededSkills.filter((s) => !studentSkills.includes(s.toLowerCase()));
    if (missing.length > neededSkills.length * 0.5) {
      alerts.push({
        type: "Skill Gap",
        severity: "medium",
        message: `Significant skill gaps for ${career.title} career path. Missing ${missing.length} of ${neededSkills.length} required skills.`,
      });
    }
  }

  return alerts;
}

// --- Career Pathway Analysis ---

export function analyzeCareerPathways(student: Student): CareerAnalysis {
  const studentSkillsLower = student.skills.map((s) => s.toLowerCase());

  const matchedPaths = careerPaths
    .filter(
      (cp) =>
        cp.relatedMajors.includes(student.major) ||
        student.careerGoals.some((g) => cp.title.toLowerCase().includes(g.toLowerCase()) || g.toLowerCase().includes(cp.title.toLowerCase()))
    )
    .map((career) => {
      const requiredLower = career.requiredSkills.map((s) => s.toLowerCase());
      const matchedSkills = career.requiredSkills.filter((s) => studentSkillsLower.includes(s.toLowerCase()));
      const missingSkills = career.requiredSkills.filter((s) => !studentSkillsLower.includes(s.toLowerCase()));
      const matchScore = Math.round((matchedSkills.length / requiredLower.length) * 100);

      return {
        career,
        matchScore,
        matchedSkills,
        missingSkills,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  // Aggregate all needed skills from goal careers
  const allNeededSkills = new Set<string>();
  matchedPaths.forEach((mp) => mp.career.requiredSkills.forEach((s) => allNeededSkills.add(s)));

  const gaps = [...allNeededSkills].filter((s) => !studentSkillsLower.includes(s.toLowerCase()));

  return {
    matchedPaths,
    skillGapAnalysis: {
      currentSkills: student.skills,
      neededSkills: [...allNeededSkills],
      gaps,
    },
  };
}

// --- Full Advisor Recommendation ---

export function getAdvisorRecommendation(student: Student): AdvisorRecommendation {
  const progress = calculateGraduationProgress(student);
  const recommendedCourses = recommendCourses(student);
  const riskAlerts = generateRiskAlerts(student);

  return {
    recommendedCourses,
    graduationTimeline: {
      estimatedSemesters: progress.estimatedSemesters,
      estimatedGraduation: progress.estimatedGraduation,
      onTrack: progress.onTrack,
    },
    riskAlerts,
    progressSummary: {
      percentComplete: progress.percentComplete,
      creditsRemaining: progress.creditsRemaining,
      creditsCompleted: progress.creditsCompleted,
      requiredCredits: progress.requiredCredits,
    },
  };
}

// --- Institutional Analytics ---

export function getInstitutionalAnalytics(): InstitutionalAnalytics {
  const totalStudents = students.length;
  const averageGPA = Math.round((students.reduce((sum, s) => sum + s.gpa, 0) / totalStudents) * 100) / 100;
  const averageCreditsCompleted = Math.round(students.reduce((sum, s) => sum + s.completedCredits, 0) / totalStudents);
  const averageProgress = Math.round(
    students.reduce((sum, s) => sum + (s.completedCredits / s.requiredCredits) * 100, 0) / totalStudents
  );

  // Retention indicators
  const onTrackCount = students.filter((s) => calculateGraduationProgress(s).onTrack).length;
  const highGPACount = students.filter((s) => s.gpa >= 3.0).length;

  const retentionIndicators = [
    {
      metric: "On-Track Graduation Rate",
      value: `${Math.round((onTrackCount / totalStudents) * 100)}%`,
      status: (onTrackCount / totalStudents >= 0.8 ? "good" : onTrackCount / totalStudents >= 0.6 ? "warning" : "critical") as
        | "good"
        | "warning"
        | "critical",
    },
    {
      metric: "Good Academic Standing",
      value: `${Math.round((highGPACount / totalStudents) * 100)}%`,
      status: (highGPACount / totalStudents >= 0.8 ? "good" : highGPACount / totalStudents >= 0.6 ? "warning" : "critical") as
        | "good"
        | "warning"
        | "critical",
    },
    {
      metric: "Average GPA",
      value: averageGPA.toFixed(2),
      status: (averageGPA >= 3.0 ? "good" : averageGPA >= 2.5 ? "warning" : "critical") as "good" | "warning" | "critical",
    },
  ];

  // Popular career paths
  const careerCounts: Record<string, number> = {};
  students.forEach((s) => {
    s.careerGoals.forEach((g) => {
      careerCounts[g] = (careerCounts[g] || 0) + 1;
    });
  });
  const popularCareerPaths = Object.entries(careerCounts)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count);

  // Common skill gaps
  const allGaps = new Set<string>();
  students.forEach((s) => {
    const analysis = analyzeCareerPathways(s);
    analysis.skillGapAnalysis.gaps.forEach((g) => allGaps.add(g));
  });

  // Department breakdown
  const deptCounts: Record<string, number> = {};
  students.forEach((s) => {
    deptCounts[s.major] = (deptCounts[s.major] || 0) + 1;
  });
  const departmentBreakdown = Object.entries(deptCounts).map(([department, studentCount]) => ({
    department,
    students: studentCount,
  }));

  return {
    totalStudents,
    averageGPA,
    averageProgress,
    averageCreditsCompleted,
    retentionIndicators,
    popularCareerPaths,
    commonSkillGaps: [...allGaps].slice(0, 8),
    departmentBreakdown,
  };
}
