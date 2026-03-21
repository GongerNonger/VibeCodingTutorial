// Velocity x UVU — In-Memory Data Store
// Utah Valley University Academic Advisor Prototype
// All types and pre-seeded data using real UVU degree programs and courses

export interface Student {
  id: string;
  name: string;
  email: string;
  uvid: string;
  major: string;
  minor: string | null;
  college: string;
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
  description: string;
}

export interface DegreeRequirement {
  id: string;
  major: string;
  college: string;
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

// --- UVU Sample Students ---

export const students: Student[] = [
  {
    id: "STU-001",
    name: "McKenna Johnson",
    email: "mjohnson@uvu.edu",
    uvid: "10847231",
    major: "Computer Science",
    minor: "Mathematics",
    college: "Scott M. Smith College of Engineering & Technology",
    enrollmentYear: 2023,
    expectedGraduation: "Spring 2027",
    completedCredits: 72,
    requiredCredits: 120,
    gpa: 3.78,
    skills: ["Python", "Java", "Data Structures", "Algorithms", "SQL", "Git", "Linux"],
    careerGoals: ["Software Engineer", "Machine Learning Engineer"],
  },
  {
    id: "STU-002",
    name: "Dallin Park",
    email: "dpark@uvu.edu",
    uvid: "10923456",
    major: "Information Technology",
    minor: null,
    college: "Scott M. Smith College of Engineering & Technology",
    enrollmentYear: 2022,
    expectedGraduation: "Spring 2026",
    completedCredits: 98,
    requiredCredits: 120,
    gpa: 3.21,
    skills: ["Networking", "Linux Administration", "AWS", "Python", "Cybersecurity Basics", "IT Project Management"],
    careerGoals: ["Systems Administrator", "Cloud Engineer"],
  },
  {
    id: "STU-003",
    name: "Sofia Rodriguez",
    email: "srodriguez@uvu.edu",
    uvid: "10834567",
    major: "Digital Marketing",
    minor: "Data Analytics",
    college: "Woodbury School of Business",
    enrollmentYear: 2024,
    expectedGraduation: "Spring 2028",
    completedCredits: 34,
    requiredCredits: 120,
    gpa: 3.91,
    skills: ["Social Media Marketing", "Content Strategy", "Google Analytics", "Canva", "Copywriting", "SEO Basics"],
    careerGoals: ["Digital Marketing Manager", "Brand Strategist"],
  },
  {
    id: "STU-004",
    name: "Ethan Wright",
    email: "ewright@uvu.edu",
    uvid: "10756789",
    major: "Business Management",
    minor: "Entrepreneurship",
    college: "Woodbury School of Business",
    enrollmentYear: 2023,
    expectedGraduation: "Spring 2027",
    completedCredits: 64,
    requiredCredits: 120,
    gpa: 3.45,
    skills: ["Excel", "Financial Analysis", "Leadership", "Public Speaking", "Business Writing", "Project Management"],
    careerGoals: ["Product Manager", "Management Consultant"],
  },
  {
    id: "STU-005",
    name: "Amara Osei",
    email: "aosei@uvu.edu",
    uvid: "10898765",
    major: "Computer Science",
    minor: null,
    college: "Scott M. Smith College of Engineering & Technology",
    enrollmentYear: 2024,
    expectedGraduation: "Spring 2028",
    completedCredits: 28,
    requiredCredits: 120,
    gpa: 3.55,
    skills: ["Python", "HTML/CSS", "JavaScript", "Git"],
    careerGoals: ["Software Engineer", "Web Developer"],
  },
  {
    id: "STU-006",
    name: "Jake Moretti",
    email: "jmoretti@uvu.edu",
    uvid: "10812345",
    major: "Cybersecurity",
    minor: null,
    college: "Scott M. Smith College of Engineering & Technology",
    enrollmentYear: 2023,
    expectedGraduation: "Spring 2027",
    completedCredits: 61,
    requiredCredits: 120,
    gpa: 3.32,
    skills: ["Networking", "Linux", "Python", "Wireshark", "Firewalls", "Risk Assessment"],
    careerGoals: ["Cybersecurity Analyst", "Penetration Tester"],
  },
];

// --- UVU Courses (based on real UVU catalog) ---

export const courses: Course[] = [
  // Computer Science
  {
    id: "CRS-001",
    name: "Data Structures & Algorithms",
    code: "CS 2420",
    credits: 4,
    department: "Computer Science",
    prerequisites: ["CS 1410"],
    skillsTaught: ["Algorithms", "Data Structures", "Problem Solving", "Java"],
    description: "Study of data structures including lists, stacks, queues, trees, and graphs with algorithm analysis.",
  },
  {
    id: "CRS-002",
    name: "Artificial Intelligence",
    code: "CS 4470",
    credits: 3,
    department: "Computer Science",
    prerequisites: ["CS 2420", "MATH 2270"],
    skillsTaught: ["Machine Learning", "AI Fundamentals", "Python", "Neural Networks"],
    description: "Introduction to AI concepts including search, machine learning, and neural networks.",
  },
  {
    id: "CRS-003",
    name: "Principles and Patterns of Software Design",
    code: "CS 3450",
    credits: 3,
    department: "Computer Science",
    prerequisites: ["CS 2450"],
    skillsTaught: ["Agile", "System Design", "Testing", "Git", "Design Patterns"],
    description: "Software design principles, patterns, and team-based agile development practices.",
  },
  {
    id: "CRS-004",
    name: "Database Theory",
    code: "CS 3520",
    credits: 3,
    department: "Computer Science",
    prerequisites: ["CS 2420"],
    skillsTaught: ["SQL", "Database Design", "NoSQL", "Data Modeling"],
    description: "Relational database design, SQL, normalization, and introduction to NoSQL databases.",
  },
  {
    id: "CRS-005",
    name: "Operating Systems Theory",
    code: "CS 3060",
    credits: 3,
    department: "Computer Science",
    prerequisites: ["CS 2420"],
    skillsTaught: ["Systems Programming", "Concurrency", "Memory Management", "Linux"],
    description: "Process management, memory management, file systems, and concurrent programming.",
  },
  {
    id: "CRS-006",
    name: "Data Communications and Networking",
    code: "CS 3530",
    credits: 3,
    department: "Computer Science",
    prerequisites: ["CS 2420"],
    skillsTaught: ["Networking", "TCP/IP", "Network Security", "Protocols"],
    description: "Study of computer networking including protocols, architecture, and security.",
  },
  {
    id: "CRS-007",
    name: "Advanced Internet Programming",
    code: "CS 2550",
    credits: 3,
    department: "Computer Science",
    prerequisites: ["CS 1410"],
    skillsTaught: ["HTML/CSS", "JavaScript", "React", "Web APIs"],
    description: "Full-stack web development with modern frameworks and APIs.",
  },
  // Information Technology
  {
    id: "CRS-008",
    name: "System Administration",
    code: "IT 2300",
    credits: 3,
    department: "Information Technology",
    prerequisites: ["IT 1100"],
    skillsTaught: ["Linux Administration", "Windows Server", "Shell Scripting", "Automation"],
    description: "System administration for Linux and Windows enterprise environments.",
  },
  {
    id: "CRS-009",
    name: "Cloud Computing",
    code: "IT 3110",
    credits: 3,
    department: "Information Technology",
    prerequisites: ["IT 2300"],
    skillsTaught: ["AWS", "Cloud Architecture", "DevOps", "Docker", "Kubernetes"],
    description: "Cloud services, architecture, and deployment using AWS and containerization.",
  },
  {
    id: "CRS-010",
    name: "Network Administration",
    code: "IT 2400",
    credits: 3,
    department: "Information Technology",
    prerequisites: ["IT 1100"],
    skillsTaught: ["Networking", "Cisco", "Routing", "Switching", "Network Design"],
    description: "Enterprise network design, configuration, and troubleshooting.",
  },
  {
    id: "CRS-011",
    name: "Cybersecurity Fundamentals",
    code: "IT 2700",
    credits: 3,
    department: "Information Technology",
    prerequisites: ["IT 1100"],
    skillsTaught: ["Cybersecurity Basics", "Risk Assessment", "Security Policies", "Compliance"],
    description: "Foundations of cybersecurity including risk management and security policies.",
  },
  // Business / Woodbury School of Business
  {
    id: "CRS-012",
    name: "Financial Accounting",
    code: "ACCT 2010",
    credits: 3,
    department: "Business Management",
    prerequisites: [],
    skillsTaught: ["Financial Analysis", "Accounting", "Financial Statements"],
    description: "Principles of financial accounting for business decision-making.",
  },
  {
    id: "CRS-013",
    name: "Business Strategy Formulation and Implementation",
    code: "MGMT 4860",
    credits: 3,
    department: "Business Management",
    prerequisites: ["MGMT 3000"],
    skillsTaught: ["Strategic Planning", "Leadership", "Business Analysis", "Competitive Strategy"],
    description: "Capstone course integrating functional business knowledge into strategic decisions.",
  },
  {
    id: "CRS-014",
    name: "Organizational Behavior",
    code: "MGMT 3000",
    credits: 3,
    department: "Business Management",
    prerequisites: [],
    skillsTaught: ["Leadership", "Team Management", "Communication", "Organizational Design"],
    description: "Study of individual and group behavior in organizational contexts.",
  },
  {
    id: "CRS-015",
    name: "Operations Management",
    code: "MGMT 3450",
    credits: 3,
    department: "Business Management",
    prerequisites: ["MGMT 3000"],
    skillsTaught: ["Operations", "Supply Chain", "Process Optimization", "Lean Six Sigma"],
    description: "Design, planning, and control of production and service operations.",
  },
  {
    id: "CRS-016",
    name: "Business Communication",
    code: "MGMT 2200",
    credits: 3,
    department: "Business Management",
    prerequisites: [],
    skillsTaught: ["Public Speaking", "Business Writing", "Communication", "Presentation Skills"],
    description: "Effective written and oral communication in professional business settings.",
  },
  // Digital Marketing
  {
    id: "CRS-017",
    name: "Digital Marketing",
    code: "MKTG 3660",
    credits: 3,
    department: "Digital Marketing",
    prerequisites: ["MKTG 3010"],
    skillsTaught: ["SEO", "Social Media Marketing", "Content Strategy", "Google Analytics", "PPC"],
    description: "Strategic approaches to digital marketing including SEO, SEM, and social media campaigns.",
  },
  {
    id: "CRS-018",
    name: "Marketing with Social Media",
    code: "MKTG 3680",
    credits: 3,
    department: "Digital Marketing",
    prerequisites: ["MKTG 3010"],
    skillsTaught: ["Market Research", "Consumer Psychology", "Data Analysis", "Segmentation"],
    description: "Understanding consumer decision-making and its implications for marketing strategy.",
  },
  {
    id: "CRS-019",
    name: "Search Engine Optimization",
    code: "MKTG 3665",
    credits: 3,
    department: "Digital Marketing",
    prerequisites: ["MKTG 3660"],
    skillsTaught: ["Brand Strategy", "Brand Identity", "Campaign Management", "Brand Equity"],
    description: "Building, measuring, and managing brand equity in competitive markets.",
  },
  {
    id: "CRS-020",
    name: "Digital Marketing Analytics",
    code: "MKTG 3690",
    credits: 3,
    department: "Digital Marketing",
    prerequisites: ["MKTG 3660", "STAT 2040"],
    skillsTaught: ["Data Analysis", "A/B Testing", "Marketing Metrics", "SQL", "Tableau"],
    description: "Data-driven marketing decisions using analytics tools and statistical methods.",
  },
  // Math / Stats
  {
    id: "CRS-021",
    name: "Introduction to Statistics",
    code: "STAT 2040",
    credits: 4,
    department: "Mathematics",
    prerequisites: ["MATH 1050"],
    skillsTaught: ["Statistics", "Data Analysis", "Probability", "Statistical Software"],
    description: "Descriptive and inferential statistics with applications to real-world problems.",
  },
  {
    id: "CRS-022",
    name: "Linear Algebra",
    code: "MATH 2270",
    credits: 3,
    department: "Mathematics",
    prerequisites: ["MATH 1210"],
    skillsTaught: ["Linear Algebra", "Mathematical Modeling", "Matrix Operations"],
    description: "Systems of linear equations, matrices, vector spaces, and linear transformations.",
  },
  // Cybersecurity
  {
    id: "CRS-023",
    name: "Ethical Hacking & Penetration Testing",
    code: "IT 4500",
    credits: 3,
    department: "Cybersecurity",
    prerequisites: ["IT 2700", "IT 2400"],
    skillsTaught: ["Penetration Testing", "Ethical Hacking", "Vulnerability Assessment", "Metasploit"],
    description: "Authorized security testing methodologies and tools for identifying vulnerabilities.",
  },
  {
    id: "CRS-024",
    name: "Digital Forensics",
    code: "IT 4400",
    credits: 3,
    department: "Cybersecurity",
    prerequisites: ["IT 2700"],
    skillsTaught: ["Digital Forensics", "Incident Response", "Evidence Collection", "Chain of Custody"],
    description: "Investigation and analysis of digital evidence for cybercrime cases.",
  },
  {
    id: "CRS-025",
    name: "Security Architecture",
    code: "IT 4600",
    credits: 3,
    department: "Cybersecurity",
    prerequisites: ["IT 2700", "IT 2300"],
    skillsTaught: ["Security Architecture", "Zero Trust", "SIEM", "Security Operations"],
    description: "Designing and implementing enterprise security architectures.",
  },
];

// --- UVU Degree Requirements ---

export const degreeRequirements: DegreeRequirement[] = [
  {
    id: "DEG-001",
    major: "Computer Science",
    college: "Scott M. Smith College of Engineering & Technology",
    totalCredits: 120,
    requiredCourses: ["CRS-001", "CRS-002", "CRS-003", "CRS-004", "CRS-005", "CRS-006", "CRS-007", "CRS-021", "CRS-022"],
    electiveCredits: 21,
  },
  {
    id: "DEG-002",
    major: "Information Technology",
    college: "Scott M. Smith College of Engineering & Technology",
    totalCredits: 120,
    requiredCourses: ["CRS-008", "CRS-009", "CRS-010", "CRS-011", "CRS-021"],
    electiveCredits: 30,
  },
  {
    id: "DEG-003",
    major: "Business Management",
    college: "Woodbury School of Business",
    totalCredits: 120,
    requiredCourses: ["CRS-012", "CRS-013", "CRS-014", "CRS-015", "CRS-016", "CRS-021"],
    electiveCredits: 30,
  },
  {
    id: "DEG-004",
    major: "Digital Marketing",
    college: "Woodbury School of Business",
    totalCredits: 120,
    requiredCourses: ["CRS-017", "CRS-018", "CRS-019", "CRS-020", "CRS-016", "CRS-021"],
    electiveCredits: 30,
  },
  {
    id: "DEG-005",
    major: "Cybersecurity",
    college: "Scott M. Smith College of Engineering & Technology",
    totalCredits: 120,
    requiredCourses: ["CRS-010", "CRS-011", "CRS-023", "CRS-024", "CRS-025", "CRS-008"],
    electiveCredits: 24,
  },
];

// --- Career Paths ---

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
    requiredSkills: ["Python", "Machine Learning", "Neural Networks", "Statistics", "Linear Algebra", "Data Analysis", "SQL"],
    averageSalary: 145000,
    growthRate: 40,
    relatedMajors: ["Computer Science"],
  },
  {
    id: "CAR-003",
    title: "Cloud Engineer",
    requiredSkills: ["AWS", "Cloud Architecture", "Docker", "Kubernetes", "Linux Administration", "Networking", "DevOps", "Python"],
    averageSalary: 135000,
    growthRate: 30,
    relatedMajors: ["Information Technology", "Computer Science"],
  },
  {
    id: "CAR-004",
    title: "Systems Administrator",
    requiredSkills: ["Linux Administration", "Windows Server", "Networking", "Shell Scripting", "Automation", "Cloud Architecture"],
    averageSalary: 85000,
    growthRate: 5,
    relatedMajors: ["Information Technology"],
  },
  {
    id: "CAR-005",
    title: "Cybersecurity Analyst",
    requiredSkills: ["Cybersecurity Basics", "Risk Assessment", "Networking", "SIEM", "Incident Response", "Firewalls", "Security Operations"],
    averageSalary: 105000,
    growthRate: 33,
    relatedMajors: ["Cybersecurity", "Information Technology"],
  },
  {
    id: "CAR-006",
    title: "Penetration Tester",
    requiredSkills: ["Penetration Testing", "Ethical Hacking", "Networking", "Python", "Linux", "Vulnerability Assessment", "Metasploit"],
    averageSalary: 115000,
    growthRate: 35,
    relatedMajors: ["Cybersecurity"],
  },
  {
    id: "CAR-007",
    title: "Product Manager",
    requiredSkills: ["Leadership", "Strategic Planning", "Data Analysis", "Communication", "Market Research", "Agile"],
    averageSalary: 135000,
    growthRate: 12,
    relatedMajors: ["Business Management", "Computer Science", "Digital Marketing"],
  },
  {
    id: "CAR-008",
    title: "Digital Marketing Manager",
    requiredSkills: ["SEO", "Social Media Marketing", "Content Strategy", "Google Analytics", "A/B Testing", "Data Analysis", "Brand Strategy"],
    averageSalary: 95000,
    growthRate: 18,
    relatedMajors: ["Digital Marketing", "Business Management"],
  },
  {
    id: "CAR-009",
    title: "Management Consultant",
    requiredSkills: ["Strategic Planning", "Financial Analysis", "Leadership", "Communication", "Business Analysis", "Public Speaking", "Excel"],
    averageSalary: 115000,
    growthRate: 14,
    relatedMajors: ["Business Management"],
  },
  {
    id: "CAR-010",
    title: "Web Developer",
    requiredSkills: ["HTML/CSS", "JavaScript", "React", "Git", "SQL", "Web APIs", "Testing"],
    averageSalary: 95000,
    growthRate: 16,
    relatedMajors: ["Computer Science", "Information Technology"],
  },
  {
    id: "CAR-011",
    title: "Brand Strategist",
    requiredSkills: ["Brand Strategy", "Brand Identity", "Market Research", "Consumer Psychology", "Content Strategy", "Campaign Management"],
    averageSalary: 85000,
    growthRate: 10,
    relatedMajors: ["Digital Marketing"],
  },
];

export const pricingTiers = [
  { name: "Small", label: "< 5,000 Students", platformFee: 50000, perStudent: 30, description: "Community colleges & small institutions" },
  { name: "Mid", label: "5,000 - 20,000 Students", platformFee: 100000, perStudent: 25, description: "Regional universities & mid-size institutions" },
  { name: "Large", label: "20,000+ Students", platformFee: 250000, perStudent: 20, description: "Large research universities & state systems" },
];
