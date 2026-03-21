// Velocity x UVU - AI Academic Advisor - Test Suite

import {
  students,
  courses,
  degreeRequirements,
  careerPaths,
  pricingTiers,
  Student,
} from "./app/api/store";

import {
  calculateGraduationProgress,
  recommendCourses,
  generateRiskAlerts,
  analyzeCareerPathways,
  getAdvisorRecommendation,
  getInstitutionalAnalytics,
} from "./app/api/advisor";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  PASS: ${message}`);
  } else {
    failed++;
    console.log(`  FAIL: ${message}`);
  }
}

// ============================================================
// 1. Data Store - UVU Data Integrity
// ============================================================
console.log("\n--- UVU Data Store Tests ---");

assert(students.length >= 5, "At least 5 UVU sample students exist");
assert(courses.length >= 20, "At least 20 UVU courses exist");
assert(degreeRequirements.length >= 5, "At least 5 UVU degree programs exist");
assert(careerPaths.length >= 8, "At least 8 career paths exist");
assert(pricingTiers.length >= 3, "At least 3 pricing tiers exist");

// Verify UVU student structure
const mckenna = students.find((s) => s.id === "STU-001")!;
assert(mckenna !== undefined, "Student STU-001 (McKenna Johnson) exists");
assert(mckenna.major === "Computer Science", "McKenna is a CS major");
assert(mckenna.email.endsWith("@uvu.edu"), "McKenna has UVU email");
assert((mckenna as any).uvid !== undefined, "McKenna has a UVID");
assert((mckenna as any).college === "Scott M. Smith College of Engineering & Technology", "McKenna is in Engineering & Tech");
assert(mckenna.skills.length > 0, "McKenna has skills listed");
assert(mckenna.careerGoals.length > 0, "McKenna has career goals");
assert(mckenna.gpa > 0 && mckenna.gpa <= 4.0, "McKenna has a valid GPA");

// Verify all UVU emails
for (const s of students) {
  assert(s.email.endsWith("@uvu.edu"), `${s.name} has UVU email`);
}

// Verify UVU degree requirements
const uvuMajors = ["Computer Science", "Information Technology", "Business Management", "Digital Marketing", "Cybersecurity"];
for (const major of uvuMajors) {
  const deg = degreeRequirements.find((d) => d.major === major);
  assert(deg !== undefined, `Degree requirements exist for ${major}`);
  assert(deg!.totalCredits === 120, `${major} requires 120 credits`);
  assert(deg!.requiredCourses.length > 0, `${major} has required courses`);
}

// ============================================================
// 2. Graduation Progress Calculation
// ============================================================
console.log("\n--- Graduation Progress Tests ---");

const mckennaProgress = calculateGraduationProgress(mckenna);
assert(mckennaProgress.percentComplete === 60, "McKenna progress is 60% (72/120)");
assert(mckennaProgress.creditsRemaining === 48, "McKenna has 48 credits remaining");
assert(mckennaProgress.creditsCompleted === 72, "McKenna has completed 72 credits");
assert(mckennaProgress.requiredCredits === 120, "McKenna requires 120 credits");
assert(mckennaProgress.estimatedSemesters > 0, "McKenna has positive semesters remaining");
assert(typeof mckennaProgress.onTrack === "boolean", "On-track is a boolean");

const dallin = students.find((s) => s.id === "STU-002")!;
const dallinProgress = calculateGraduationProgress(dallin);
assert(dallinProgress.percentComplete === 82, "Dallin progress is 82% (98/120)");
assert(dallinProgress.creditsRemaining === 22, "Dallin has 22 credits remaining");

// ============================================================
// 3. AI Advising Recommendations
// ============================================================
console.log("\n--- AI Advising Recommendations Tests ---");

const mckennaAdvice = getAdvisorRecommendation(mckenna);
assert(mckennaAdvice.recommendedCourses.length > 0, "McKenna gets course recommendations");
assert(mckennaAdvice.recommendedCourses.length <= 4, "Recommendations capped at 4 courses");
assert(mckennaAdvice.graduationTimeline.estimatedSemesters > 0, "Timeline has estimated semesters");
assert(typeof mckennaAdvice.graduationTimeline.onTrack === "boolean", "Timeline includes on-track status");
assert(mckennaAdvice.progressSummary.percentComplete >= 0, "Progress summary has percent complete");
assert(mckennaAdvice.progressSummary.creditsRemaining >= 0, "Progress summary has credits remaining");

for (const rec of mckennaAdvice.recommendedCourses) {
  assert(rec.reasoning.length > 0, `Recommendation for ${rec.course.code} has reasoning`);
  assert(rec.course.credits > 0, `Recommended course ${rec.course.code} has credits`);
}

// ============================================================
// 4. Risk Alert Generation
// ============================================================
console.log("\n--- Risk Alert Tests ---");

const mckennaAlerts = generateRiskAlerts(mckenna);
assert(Array.isArray(mckennaAlerts), "Risk alerts returns an array");

const lowGPAStudent: Student = {
  id: "TEST-LOW",
  name: "Test Low",
  email: "test@uvu.edu",
  uvid: "99999999",
  major: "Computer Science",
  minor: null,
  college: "Scott M. Smith College of Engineering & Technology",
  enrollmentYear: 2022,
  expectedGraduation: "Spring 2026",
  completedCredits: 40,
  requiredCredits: 120,
  gpa: 1.8,
  skills: [],
  careerGoals: ["Software Engineer"],
};

const lowGPAAlerts = generateRiskAlerts(lowGPAStudent);
assert(lowGPAAlerts.length > 0, "Low GPA student generates risk alerts");
const gpaAlert = lowGPAAlerts.find((a) => a.type === "Academic Standing");
assert(gpaAlert !== undefined, "Low GPA triggers Academic Standing alert");
assert(gpaAlert!.severity === "high", "Very low GPA alert is high severity");

// ============================================================
// 5. Career Pathway Analysis
// ============================================================
console.log("\n--- Career Pathway Tests ---");

const mckennaCareer = analyzeCareerPathways(mckenna);
assert(mckennaCareer.matchedPaths.length > 0, "McKenna has career path matches");

const softwareMatch = mckennaCareer.matchedPaths.find((m) => m.career.title === "Software Engineer");
assert(softwareMatch !== undefined, "McKenna matches Software Engineer career path");
assert(softwareMatch!.matchScore > 0, "Software Engineer match has positive score");
assert(softwareMatch!.matchedSkills.length > 0, "McKenna has matched skills for SE");

assert(mckennaCareer.skillGapAnalysis.currentSkills.length > 0, "Skill gap analysis tracks current skills");
assert(Array.isArray(mckennaCareer.skillGapAnalysis.gaps), "Skill gap analysis identifies gaps");

const jake = students.find((s) => s.id === "STU-006")!;
const jakeCareer = analyzeCareerPathways(jake);
assert(jakeCareer.matchedPaths.length > 0, "Jake has career path matches");
const cyberMatch = jakeCareer.matchedPaths.find((m) => m.career.title === "Cybersecurity Analyst");
assert(cyberMatch !== undefined, "Jake matches Cybersecurity Analyst career path");

const dallinCareer = analyzeCareerPathways(dallin);
assert(dallinCareer.matchedPaths.length > 0, "Dallin has career path matches");

// ============================================================
// 6. Institutional Analytics
// ============================================================
console.log("\n--- Institutional Analytics Tests ---");

const analytics = getInstitutionalAnalytics();
assert(analytics.totalStudents === students.length, "Total students count matches store");
assert(analytics.averageGPA > 0, "Average GPA is positive");
assert(analytics.averageProgress > 0, "Average progress is positive");
assert(analytics.retentionIndicators.length > 0, "Has retention indicators");
assert(analytics.popularCareerPaths.length > 0, "Has popular career paths");
assert(analytics.commonSkillGaps.length > 0, "Has common skill gaps identified");
assert(analytics.departmentBreakdown.length > 0, "Has department breakdown");

for (const indicator of analytics.retentionIndicators) {
  assert(["good", "warning", "critical"].includes(indicator.status), `Retention indicator "${indicator.metric}" has valid status`);
  assert(indicator.value.length > 0, `Retention indicator "${indicator.metric}" has a value`);
}

// ============================================================
// 7. UVU Course Codes
// ============================================================
console.log("\n--- UVU Course Code Tests ---");

const csCourses = courses.filter((c) => c.code.startsWith("CS"));
assert(csCourses.length >= 5, "At least 5 CS-prefix courses exist");

const itCourses = courses.filter((c) => c.code.startsWith("IT"));
assert(itCourses.length >= 4, "At least 4 IT-prefix courses exist");

const mgmtCourses = courses.filter((c) => c.code.startsWith("MGMT") || c.code.startsWith("ACCT"));
assert(mgmtCourses.length >= 4, "At least 4 MGMT/ACCT-prefix courses exist");

const mktgCourses = courses.filter((c) => c.code.startsWith("MKTG"));
assert(mktgCourses.length >= 3, "At least 3 MKTG-prefix courses exist");

const cs2420 = courses.find((c) => c.code === "CS 2420");
assert(cs2420 !== undefined, "CS 2420 Data Structures exists");
assert(cs2420!.name.includes("Data Structures"), "CS 2420 is Data Structures");

// ============================================================
// Summary
// ============================================================
console.log("\n========================================");
console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed} total`);
console.log("========================================\n");

if (failed > 0) {
  process.exit(1);
}
