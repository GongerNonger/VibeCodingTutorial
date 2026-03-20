export interface CompanyProfile {
  id: string;
  name: string;
  description: string;
  capabilities: string;
  pastProjects: string;
  teamSize: number;
  createdAt: string;
}

export interface RFPSection {
  id: string;
  title: string;
  content: string;
  type: "question" | "requirement" | "criteria" | "general";
}

export interface GeneratedResponse {
  sectionId: string;
  sectionTitle: string;
  response: string;
}

export type Tone = "formal" | "persuasive" | "technical";
