export interface LeaseAnalysis {
  id: string;
  leaseText: string;
  summary: string;
  keyTerms: { label: string; value: string; category: string }[];
  redFlags: { title: string; description: string; severity: "low" | "medium" | "high" }[];
  clauses: { category: string; original: string; plainEnglish: string; status: "favorable" | "neutral" | "concern" }[];
  importantDates: { label: string; value: string }[];
  tenantRights: string[];
  questionsForLandlord: string[];
  monthlyRent: string | null;
  securityDeposit: string | null;
  leaseDuration: string | null;
  moveInDate: string | null;
  petPolicy: string | null;
  maintenanceResponsibilities: { landlord: string[]; tenant: string[] };
  terminationClause: string | null;
  riskScore: number;
  leaseScore: number;
  createdAt: string;
}

const analyses: LeaseAnalysis[] = [];

export function getAnalyses(): LeaseAnalysis[] {
  return analyses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAnalysisById(id: string): LeaseAnalysis | undefined {
  return analyses.find((a) => a.id === id);
}

export function addAnalysis(analysis: LeaseAnalysis): void {
  analyses.push(analysis);
}
