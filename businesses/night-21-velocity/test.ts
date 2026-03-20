// Velocity - AI Academic Advisor - Test Suite
// 30+ assertions covering all core functionality

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
// 1. Data Store - Sample Data Integrity
// ============================================================
console.log("\n--- Data Store Tests ---");

assert(students.length >= 3, "At least 3 sample students exist");
assert(courses.length >= 10, "At least 10 courses exist");
assert(degreeRequirements.length >= 3, "At least 3 degree programs exist");
assert(careerPaths.length >= 4, "At least 4 career paths exist");
assert(pricingTiers.length >= 3, "At least 3 pricing tiers exist");

// Verify student structure
const maya = students.find((s) => s.id === "STU-001")!;
assert(maya !== undefined, "Student STU-001 (Maya Chen) exists");
assert(maya.major === "Computer Science", "Maya is a CS major");
assert(maya.skills.length > 0, "Maya has skills listed");
assert(maya.careerGoals.length > 0, "Maya has career goals");
assert(maya.gpa > 0 && maya.gpa <= 4.0, "Maya has a valid GPA");

// Verify degree requirements exist for each major
const majors = ["Computer Science", "Business Management", "Marketing"];
for (const major of majors) {
  const deg = degreeRequirements.find((d) => d.major === major);
  assert(deg !== undefined, `Degree requirements exist for ${major}`);
  assert(deg!.totalCredits === 120, `${major} requires 120 credits`);
  assert(deg!.requiredCourses.length > 0, `${major} has required courses`);
}

// ============================================================
// 2. Graduation Progress Calculation
// ============================================================
console.log("\n--- Graduation Progress Tests ---");

const mayaProgress = calculateGraduationProgress(maya);
assert(mayaProgress.percentComplete === 57, "Maya progress is 57% (68/120)");
assert(mayaProgress.creditsRemaining === 52, "Maya has 52 credits remaining");
assert(mayaProgress.creditsCompleted === 68, "Maya has completed 68 credits");
assert(mayaProgress.requiredCredits === 120, "Maya requires 120 credits");
assert(mayaProgress.estimatedSemesters > 0, "Maya has positive semesters remaining");
assert(typeof mayaProgress.onTrack === "boolean", "On-track is a boolean");

const jordan = students.find((s) => s.id === "STU-002")!;
const jordanProgress = calculateGraduationProgress(jordan);
assert(jordanProgress.percentComplete === 80, "Jordan progress is 80% (96/120)");
assert(jordanProgress.creditsRemaining === 24, "Jordan has 24 credits remaining");

// ============================================================
// 3. AI Advising Recommendations
// ============================================================
console.log("\n--- AI Advising Recommendations Tests ---");

const mayaAdvice = getAdvisorRecommendation(maya);
assert(mayaAdvice.recommendedCourses.length > 0, "Maya gets course recommendations");
assert(mayaAdvice.recommendedCourses.length <= 4, "Recommendations capped at 4 courses");
assert(mayaAdvice.graduationTimeline.estimatedSemesters > 0, "Timeline has estimated semesters");
assert(typeof mayaAdvice.graduationTimeline.onTrack === "boolean", "Timeline includes on-track status");
assert(mayaAdvice.progressSummary.percentComplete >= 0, "Progress summary has percent complete");
assert(mayaAdvice.progressSummary.creditsRemaining >= 0, "Progress summary has credits remaining");

// Verify course recommendations have reasoning
for (const rec of mayaAdvice.recommendedCourses) {
  assert(rec.reasoning.length > 0, `Recommendation for ${rec.course.code} has reasoning`);
  assert(rec.course.credits > 0, `Recommended course ${rec.course.code} has credits`);
}

// ============================================================
// 4. Risk Alert Generation
// ============================================================
console.log("\n--- Risk Alert Tests ---");

const mayaAlerts = generateRiskAlerts(maya);
assert(Array.isArray(mayaAlerts), "Risk alerts returns an array");

// Test with a low GPA student
const lowGPAStudent: Student = {
  id: "TEST-LOW",
  name: "Test Low",
  email: "test@uni.edu",
  major: "Computer Science",
  minor: null,
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

const mayaCareer = analyzeCareerPathways(maya);
assert(mayaCareer.matchedPaths.length > 0, "Maya has career path matches");

const softwareMatch = mayaCareer.matchedPaths.find((m) => m.career.title === "Software Engineer");
assert(softwareMatch !== undefined, "Maya matches Software Engineer career path");
assert(softwareMatch!.matchScore > 0, "Software Engineer match has positive score");
assert(softwareMatch!.matchedSkills.length > 0, "Maya has matched skills for SE");
assert(typeof softwareMatch!.missingSkills.length === "number", "Missing skills is tracked");

assert(mayaCareer.skillGapAnalysis.currentSkills.length > 0, "Skill gap analysis tracks current skills");
assert(Array.isArray(mayaCareer.skillGapAnalysis.gaps), "Skill gap analysis identifies gaps");

// Jordan's career analysis
const jordanCareer = analyzeCareerPathways(jordan);
assert(jordanCareer.matchedPaths.length > 0, "Jordan has career path matches");
const pmMatch = jordanCareer.matchedPaths.find((m) => m.career.title === "Product Manager");
assert(pmMatch !== undefined, "Jordan matches Product Manager career path");

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

// Verify retention indicator structure
for (const indicator of analytics.retentionIndicators) {
  assert(["good", "warning", "critical"].includes(indicator.status), `Retention indicator "${indicator.metric}" has valid status`);
  assert(indicator.value.length > 0, `Retention indicator "${indicator.metric}" has a value`);
}

// ============================================================
// 7. Student CRUD - Create/Update via store mutation
// ============================================================
console.log("\n--- Student CRUD Tests ---");

const originalCount = students.length;

const newStudent: Student = {
  id: `STU-${String(students.length + 1).padStart(3, "0")}`,
  name: "Test Student",
  email: "test.student@university.edu",
  major: "Marketing",
  minor: null,
  enrollmentYear: 2025,
  expectedGraduation: "Spring 2029",
  completedCredits: 0,
  requiredCredits: 120,
  gpa: 0,
  skills: [],
  careerGoals: ["Digital Marketing Manager"],
};

students.push(newStudent);
assert(students.length === originalCount + 1, "Student added to store");
assert(students.find((s) => s.email === "test.student@university.edu") !== undefined, "New student findable by email");

// Update test
newStudent.gpa = 3.5;
newStudent.completedCredits = 15;
newStudent.skills = ["Social Media Marketing", "Content Strategy"];
const updated = students.find((s) => s.email === "test.student@university.edu")!;
assert(updated.gpa === 3.5, "Student GPA updated correctly");
assert(updated.completedCredits === 15, "Student credits updated correctly");
assert(updated.skills.length === 2, "Student skills updated correctly");

// Clean up
students.pop();
assert(students.length === originalCount, "Student removed after test cleanup");

// ============================================================
// Summary
// ============================================================
console.log("\n========================================");
console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed} total`);
console.log("========================================\n");

if (failed > 0) {
  process.exit(1);
}
