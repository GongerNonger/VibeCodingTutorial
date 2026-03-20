export interface Grant {
  id: string;
  name: string;
  agency: string;
  description: string;
  amountMin: number;
  amountMax: number;
  deadline: string;
  eligibility: {
    industries: string[];
    maxEmployees: number | null;
    maxRevenue: number | null;
    states: string[] | "all";
    minorityOwned: boolean;
    womenOwned: boolean;
    veteranOwned: boolean;
    requiresMinority: boolean;
    requiresWomen: boolean;
    requiresVeteran: boolean;
  };
  url: string;
  tips: string[];
  commonQuestions: string[];
  category: string;
}

export interface BusinessProfile {
  id: string;
  name: string;
  industry: string;
  state: string;
  employeeCount: number;
  annualRevenue: number;
  minorityOwned: boolean;
  womenOwned: boolean;
  veteranOwned: boolean;
  description: string;
}

export interface GrantMatch {
  grant: Grant;
  score: number;
  reasons: string[];
}
