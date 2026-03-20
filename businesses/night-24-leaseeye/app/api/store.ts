export interface LeaseAnalysis {
  id: string;
  leaseText: string;
  summary: string;
  keyTerms: { label: string; value: string; category: string }[];
  redFlags: { title: string; description: string; severity: "low" | "medium" | "high" }[];
  clauses: { category: string; original: string; plainEnglish: string }[];
  monthlyRent: string | null;
  securityDeposit: string | null;
  leaseDuration: string | null;
  moveInDate: string | null;
  petPolicy: string | null;
  maintenanceResponsibilities: { landlord: string[]; tenant: string[] };
  terminationClause: string | null;
  riskScore: number;
  createdAt: string;
}

const analyses: LeaseAnalysis[] = [
  {
    id: "sample-1",
    leaseText: "This Residential Lease Agreement is made on January 1, 2025. The monthly rent shall be $1,500/month due on the 1st. Security deposit of $3,000 is required. Lease term is 12 months beginning February 1, 2025. Pets are allowed with a $500 pet deposit. Tenant is responsible for minor repairs under $100. Landlord is responsible for structural repairs and plumbing. Early termination requires 60 days notice and a penalty of 2 months rent. Landlord may enter premises with 24 hours notice.",
    summary: "Standard 12-month lease at $1,500/month with a $3,000 security deposit. Pets allowed with deposit. Moderate risk due to early termination penalty of 2 months rent.",
    keyTerms: [
      { label: "Monthly Rent", value: "$1,500", category: "financial" },
      { label: "Security Deposit", value: "$3,000", category: "financial" },
      { label: "Lease Duration", value: "12 months", category: "financial" },
      { label: "Pet Policy", value: "Allowed with $500 deposit", category: "rules" },
      { label: "Move-in Date", value: "February 1, 2025", category: "financial" },
    ],
    redFlags: [
      {
        title: "High Early Termination Penalty",
        description: "Early termination requires a penalty of 2 months rent, which is significant.",
        severity: "medium",
      },
      {
        title: "Security Deposit is 2x Rent",
        description: "The security deposit ($3,000) is twice the monthly rent, which may exceed legal limits in some jurisdictions.",
        severity: "medium",
      },
    ],
    clauses: [
      { category: "financial", original: "The monthly rent shall be $1,500/month due on the 1st.", plainEnglish: "You pay $1,500 on the first of every month." },
      { category: "financial", original: "Security deposit of $3,000 is required.", plainEnglish: "You need to put down $3,000 upfront as a security deposit." },
      { category: "maintenance", original: "Tenant is responsible for minor repairs under $100.", plainEnglish: "You handle small fixes costing less than $100." },
      { category: "termination", original: "Early termination requires 60 days notice and a penalty of 2 months rent.", plainEnglish: "If you want to leave early, give 60 days notice and pay 2 months of rent as a penalty." },
    ],
    monthlyRent: "$1,500",
    securityDeposit: "$3,000",
    leaseDuration: "12 months",
    moveInDate: "February 1, 2025",
    petPolicy: "Allowed with $500 deposit",
    maintenanceResponsibilities: {
      landlord: ["Structural repairs", "Plumbing"],
      tenant: ["Minor repairs under $100"],
    },
    terminationClause: "60 days notice and 2 months rent penalty",
    riskScore: 35,
    createdAt: new Date("2025-01-15").toISOString(),
  },
];

export function getAnalyses(): LeaseAnalysis[] {
  return analyses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAnalysisById(id: string): LeaseAnalysis | undefined {
  return analyses.find((a) => a.id === id);
}

export function addAnalysis(analysis: LeaseAnalysis): void {
  analyses.push(analysis);
}
