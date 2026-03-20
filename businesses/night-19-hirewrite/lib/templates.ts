export interface JDTemplate {
  id: string;
  industry: string;
  name: string;
  aboutUsTemplate: string;
  responsibilitiesTemplate: string[];
  requirementsTemplate: string[];
  benefitsTemplate: string[];
}

export const templates: JDTemplate[] = [
  {
    id: "tech-startup",
    industry: "Technology",
    name: "Tech Startup",
    aboutUsTemplate:
      "We are a fast-growing technology company on a mission to {mission}. Our team thrives on innovation, collaboration, and building products that make a real impact.",
    responsibilitiesTemplate: [
      "Design, develop, and maintain scalable software solutions",
      "Collaborate with cross-functional teams to define and ship new features",
      "Write clean, maintainable, and well-tested code",
      "Participate in code reviews and contribute to engineering best practices",
      "Mentor and support fellow team members",
    ],
    requirementsTemplate: [
      "{experience}+ years of professional experience in {skills}",
      "Strong problem-solving and analytical skills",
      "Experience with agile development methodologies",
      "Excellent communication and collaboration skills",
    ],
    benefitsTemplate: [
      "Competitive salary and equity package",
      "Flexible remote work options",
      "Health, dental, and vision insurance",
      "Professional development budget",
      "Unlimited PTO policy",
    ],
  },
  {
    id: "healthcare",
    industry: "Healthcare",
    name: "Healthcare",
    aboutUsTemplate:
      "We are a leading healthcare organization committed to {mission}. Our team of dedicated professionals works together to deliver exceptional patient care and advance medical innovation.",
    responsibilitiesTemplate: [
      "Provide high-quality care and support to patients and their families",
      "Collaborate with interdisciplinary teams to develop treatment plans",
      "Maintain accurate and up-to-date documentation",
      "Adhere to all regulatory and compliance standards",
      "Participate in continuous quality improvement initiatives",
    ],
    requirementsTemplate: [
      "{experience}+ years of experience in a healthcare setting",
      "Relevant certifications and licensure as required",
      "Strong clinical and critical thinking skills",
      "Excellent interpersonal and communication abilities",
    ],
    benefitsTemplate: [
      "Competitive compensation package",
      "Comprehensive health benefits",
      "Retirement savings plan with employer match",
      "Continuing education support",
      "Generous paid time off",
    ],
  },
  {
    id: "finance",
    industry: "Finance",
    name: "Finance & Banking",
    aboutUsTemplate:
      "We are a trusted financial institution dedicated to {mission}. Our team combines deep expertise with innovative thinking to deliver exceptional results for our clients.",
    responsibilitiesTemplate: [
      "Analyze financial data and provide strategic recommendations",
      "Develop and maintain financial models and reports",
      "Ensure compliance with regulatory requirements",
      "Build and maintain strong client relationships",
      "Identify opportunities for process improvement and automation",
    ],
    requirementsTemplate: [
      "{experience}+ years of experience in financial services",
      "Strong analytical and quantitative skills",
      "Proficiency in financial modeling and analysis tools",
      "Excellent attention to detail and accuracy",
    ],
    benefitsTemplate: [
      "Competitive base salary plus performance bonus",
      "Comprehensive benefits package",
      "401(k) with generous employer match",
      "Professional certification support",
      "Hybrid work arrangements",
    ],
  },
  {
    id: "education",
    industry: "Education",
    name: "Education",
    aboutUsTemplate:
      "We are an innovative educational institution committed to {mission}. We believe in fostering an inclusive learning environment where every student can thrive.",
    responsibilitiesTemplate: [
      "Develop and deliver engaging curriculum and learning experiences",
      "Assess student progress and provide constructive feedback",
      "Collaborate with colleagues to enhance educational programs",
      "Create an inclusive and supportive classroom environment",
      "Stay current with educational best practices and technologies",
    ],
    requirementsTemplate: [
      "{experience}+ years of teaching or educational experience",
      "Relevant degree and certifications",
      "Strong communication and presentation skills",
      "Commitment to diversity, equity, and inclusion",
    ],
    benefitsTemplate: [
      "Competitive salary schedule",
      "Comprehensive health and wellness benefits",
      "Retirement plan with employer contribution",
      "Professional development opportunities",
      "Summer and holiday schedules",
    ],
  },
  {
    id: "creative",
    industry: "Creative & Marketing",
    name: "Creative Agency",
    aboutUsTemplate:
      "We are a creative agency passionate about {mission}. Our diverse team of strategists, designers, and storytellers collaborate to create work that resonates and inspires.",
    responsibilitiesTemplate: [
      "Conceptualize and execute creative campaigns across multiple channels",
      "Collaborate with clients and internal teams to develop brand strategies",
      "Present creative concepts and incorporate feedback effectively",
      "Stay current with industry trends and emerging platforms",
      "Mentor junior team members and foster a collaborative culture",
    ],
    requirementsTemplate: [
      "{experience}+ years of experience in creative or marketing roles",
      "Strong portfolio demonstrating creative excellence",
      "Excellent storytelling and communication skills",
      "Proficiency in industry-standard creative tools",
    ],
    benefitsTemplate: [
      "Competitive salary and creative bonuses",
      "Flexible work schedule and remote options",
      "Health and wellness benefits",
      "Annual creative conference budget",
      "Collaborative studio environment",
    ],
  },
];
