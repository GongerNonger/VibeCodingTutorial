// Velocity - In-Memory Data Store
// All types and pre-seeded data for the AI Academic Advisor Platform

export interface Student {
  id: string;
  name: string;
  email: string;
  major: string;
  minor: string | null;
  enrollmentYear: number;
  expectedGraduation: string;
  completedCredits: number;
  requiredCredits: number;
  gpa: number;
  skills: string[];
  careerGoals: string[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  department: string;
  prerequisites: string[];
  skillsTaught: string[];
}

export interface DegreeRequirement {
  id: string;
  major: string;
  totalCredits: number;
  requiredCourses: string[];
  electiveCredits: number;
}

export interface CareerPath {
  id: string;
  title: string;
  requiredSkills: string[];
  averageSalary: number;
  growthRate: number;
  relatedMajors: string[];
}

export interface AdvisorRecommendation {
  recommendedCourses: { course: Course; reasoning: string }[];
  graduationTimeline: {
    estimatedSemesters: number;
    estimatedGraduation: string;
    onTrack: boolean;
  };
  riskAlerts: { type: string; severity: "low" | "medium" | "high"; message: string }[];
  progressSummary: {
    percentComplete: number;
    creditsRemaining: number;
    creditsCompleted: number;
    requiredCredits: number;
  };
}

export interface CareerAnalysis {
  matchedPaths: {
    career: CareerPath;
    matchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
  }[];
  skillGapAnalysis: {
    currentSkills: string[];
    neededSkills: string[];
    gaps: string[];
  };
}

export interface InstitutionalAnalytics {
  totalStudents: number;
  averageGPA: number;
  averageProgress: number;
  averageCreditsCompleted: number;
  retentionIndicators: { metric: string; value: string; status: "good" | "warning" | "critical" }[];
  popularCareerPaths: { path: string; count: number }[];
  commonSkillGaps: string[];
  departmentBreakdown: { department: string; students: number }[];
}

// --- Pre-seeded Data ---

export const students: Student[] = [
  {
    id: "STU-001",
    name: "Maya Chen",
    email: "maya.chen@university.edu",
    major: "Computer Science",
    minor: "Mathematics",
    enrollmentYear: 2023,
    expectedGraduation: "Spring 2027",
    completedCredits: 68,
    requiredCredits: 120,
    gpa: 3.72,
    skills: ["Python", "Java", "Data Structures", "Algorithms", "SQL", "Statistics", "Git"],
    careerGoals: ["Software Engineer", "Machine Learning Engineer"],
  },
  {
    id: "STU-002",
    name: "Jordan Williams",
    email: "jordan.w@university.edu",
    major: "Business Management",
    minor: null,
    enrollmentYear: 2022,
    expectedGraduation: "Spring 2026",
    completedCredits: 96,
    requiredCredits: 120,
    gpa: 3.15,
    skills: ["Excel", "Financial Analysis", "Leadership", "Public Speaking", "Marketing Basics"],
    careerGoals: ["Product Manager", "Management Consultant"],
  },
  {
    id: "STU-003",
    name: "Aisha Patel",
    email: "aisha.p@university.edu",
    major: "Marketing",
    minor: "Data Analytics",
    enrollmentYear: 2024,
    expectedGraduation: "Spring 2028",
    completedCredits: 32,
    requiredCredits: 120,
    gpa: 3.88,
    skills: ["Social Media Marketing", "Content Strategy", "Google Analytics", "Canva", "Copywriting"],
    careerGoals: ["Digital Marketing Manager", "Brand Strategist"],
  },
];

export const courses: Course[] = [
  {
    id: "CRS-001",
    name: "Data Structures & Algorithms",
    code: "CS 301",
    credits: 4,
    department: "Computer Science",
    prerequisites: ["CS 201"],
    skillsTaught: ["Algorithms", "Data Structures", "Problem Solving"],
  },
  {
    id: "CRS-002",
    name: "Machine Learning Fundamentals",
    code: "CS 401",
    credits: 4,
    department: "Computer Science",
    prerequisites: ["CS 301", "MATH 210"],
    skillsTaught: ["Machine Learning", "Python", "TensorFlow", "Data Analysis"],
  },
  {
    id: "CRS-003",
    name: "Software Engineering",
    code: "CS 350",
    credits: 3,
    department: "Computer Science",
    prerequisites: ["CS 301"],
    skillsTaught: ["Agile", "System Design", "Testing", "Git"],
  },
  {
    id: "CRS-004",
    name: "Database Systems",
    code: "CS 340",
    credits: 3,
    department: "Computer Science",
    prerequisites: ["CS 201"],
    skillsTaught: ["SQL", "Database Design", "NoSQL", "Data Modeling"],
  },
  {
    id: "CRS-005",
    name: "Operating Systems",
    code: "CS 360",
    credits: 4,
    department: "Computer Science",
    prerequisites: ["CS 301"],
    skillsTaught: ["Systems Programming", "Concurrency", "Memory Management"],
  },
  {
    id: "CRS-006",
    name: "Financial Accounting",
    code: "BUS 201",
    credits: 3,
    department: "Business Management",
    prerequisites: [],
    skillsTaught: ["Financial Analysis", "Accounting", "Financial Statements"],
  },
  {
    id: "CRS-007",
    name: "Strategic Management",
    code: "BUS 401",
    credits: 3,
    department: "Business Management",
    prerequisites: ["BUS 201", "BUS 301"],
    skillsTaught: ["Strategic Planning", "Leadership", "Business Analysis"],
  },
  {
    id: "CRS-008",
    name: "Operations Management",
    code: "BUS 301",
    credits: 3,
    department: "Business Management",
    prerequisites: ["BUS 201"],
    skillsTaught: ["Operations", "Supply Chain", "Process Optimization"],
  },
  {
    id: "CRS-009",
    name: "Organizational Behavior",
    code: "BUS 310",
    credits: 3,
    department: "Business Management",
    prerequisites: [],
    skillsTaught: ["Leadership", "Team Management", "Communication"],
  },
  {
    id: "CRS-010",
    name: "Digital Marketing",
    code: "MKT 301",
    credits: 3,
    department: "Marketing",
    prerequisites: ["MKT 101"],
    skillsTaught: ["SEO", "Social Media Marketing", "Content Strategy", "Google Analytics"],
  },
  {
    id: "CRS-011",
    name: "Consumer Behavior",
    code: "MKT 310",
    credits: 3,
    department: "Marketing",
    prerequisites: ["MKT 101"],
    skillsTaught: ["Market Research", "Consumer Psychology", "Data Analysis"],
  },
  {
    id: "CRS-012",
    name: "Brand Management",
    code: "MKT 401",
    credits: 3,
    department: "Marketing",
    prerequisites: ["MKT 301"],
    skillsTaught: ["Brand Strategy", "Brand Identity", "Campaign Management"],
  },
  {
    id: "CRS-013",
    name: "Marketing Analytics",
    code: "MKT 350",
    credits: 3,
    department: "Marketing",
    prerequisites: ["MKT 301", "STAT 101"],
    skillsTaught: ["Data Analysis", "A/B Testing", "Marketing Metrics", "SQL"],
  },
  {
    id: "CRS-014",
    name: "Introduction to Statistics",
    code: "STAT 101",
    credits: 3,
    department: "Mathematics",
    prerequisites: [],
    skillsTaught: ["Statistics", "Data Analysis", "Probability"],
  },
  {
    id: "CRS-015",
    name: "Linear Algebra",
    code: "MATH 210",
    credits: 3,
    department: "Mathematics",
    prerequisites: ["MATH 101"],
    skillsTaught: ["Linear Algebra", "Mathematical Modeling"],
  },
  {
    id: "CRS-016",
    name: "Cloud Computing",
    code: "CS 420",
    credits: 3,
    department: "Computer Science",
    prerequisites: ["CS 340", "CS 350"],
    skillsTaught: ["AWS", "Cloud Architecture", "DevOps", "Docker"],
  },
  {
    id: "CRS-017",
    name: "Business Communication",
    code: "BUS 220",
    credits: 3,
    department: "Business Management",
    prerequisites: [],
    skillsTaught: ["Public Speaking", "Business Writing", "Communication"],
  },
];

export const degreeRequirements: DegreeRequirement[] = [
  {
    id: "DEG-001",
    major: "Computer Science",
    totalCredits: 120,
    requiredCourses: ["CRS-001", "CRS-002", "CRS-003", "CRS-004", "CRS-005", "CRS-014", "CRS-015", "CRS-016"],
    electiveCredits: 24,
  },
  {
    id: "DEG-002",
    major: "Business Management",
    totalCredits: 120,
    requiredCourses: ["CRS-006", "CRS-007", "CRS-008", "CRS-009", "CRS-014", "CRS-017"],
    electiveCredits: 30,
  },
  {
    id: "DEG-003",
    major: "Marketing",
    totalCredits: 120,
    requiredCourses: ["CRS-010", "CRS-011", "CRS-012", "CRS-013", "CRS-014", "CRS-017"],
    electiveCredits: 30,
  },
];

export const careerPaths: CareerPath[] = [
  {
    id: "CAR-001",
    title: "Software Engineer",
    requiredSkills: ["Python", "Java", "Data Structures", "Algorithms", "System Design", "Git", "SQL", "Testing"],
    averageSalary: 125000,
    growthRate: 25,
    relatedMajors: ["Computer Science"],
  },
  {
    id: "CAR-002",
    title: "Machine Learning Engineer",
    requiredSkills: ["Python", "Machine Learning", "TensorFlow", "Statistics", "Linear Algebra", "Data Analysis", "SQL"],
    averageSalary: 145000,
    growthRate: 40,
    relatedMajors: ["Computer Science"],
  },
  {
    id: "CAR-003",
    title: "Product Manager",
    requiredSkills: ["Leadership", "Strategic Planning", "Data Analysis", "Communication", "Market Research", "Agile"],
    averageSalary: 135000,
    growthRate: 12,
    relatedMajors: ["Business Management", "Computer Science", "Marketing"],
  },
  {
    id: "CAR-004",
    title: "Digital Marketing Manager",
    requiredSkills: ["SEO", "Social Media Marketing", "Content Strategy", "Google Analytics", "A/B Testing", "Data Analysis", "Brand Strategy"],
    averageSalary: 95000,
    growthRate: 18,
    relatedMajors: ["Marketing", "Business Management"],
  },
  {
    id: "CAR-005",
    title: "Management Consultant",
    requiredSkills: ["Strategic Planning", "Financial Analysis", "Leadership", "Communication", "Business Analysis", "Public Speaking", "Excel"],
    averageSalary: 115000,
    growthRate: 14,
    relatedMajors: ["Business Management"],
  },
];

export const pricingTiers = [
  { name: "Small", label: "< 5,000 Students", platformFee: 50000, perStudent: 30, description: "Community colleges & small institutions" },
  { name: "Mid", label: "5,000 - 20,000 Students", platformFee: 100000, perStudent: 25, description: "Regional universities & mid-size institutions" },
  { name: "Large", label: "20,000+ Students", platformFee: 250000, perStudent: 20, description: "Large research universities & state systems" },
];
