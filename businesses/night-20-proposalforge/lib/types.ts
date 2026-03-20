export interface FreelancerProfile {
  id: string;
  name: string;
  title: string;
  skills: string[];
  hourlyRate: number;
  portfolioUrl: string;
  email: string;
  createdAt: string;
}

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  unit: string; // "hours" | "units" | "fixed"
}

export interface ProjectDetails {
  clientName: string;
  clientCompany?: string;
  projectTitle: string;
  projectDescription: string;
  deliverables: string[];
  deadline: string;
  pricingModel: "hourly" | "fixed";
  lineItems: LineItem[];
}

export interface GenerateRequest {
  profile: FreelancerProfile;
  project: ProjectDetails;
  style: "minimal" | "professional" | "creative";
}

export interface Proposal {
  id: string;
  profileId: string;
  clientName: string;
  projectTitle: string;
  style: string;
  coverLetter: string;
  projectUnderstanding: string;
  scopeOfWork: string;
  timeline: string;
  pricingTable: string;
  termsAndConditions: string;
  totalPrice: number;
  createdAt: string;
}
