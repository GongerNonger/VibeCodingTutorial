import { Grant, BusinessProfile, GrantMatch } from "./types";

export function matchGrants(
  profile: BusinessProfile,
  allGrants: Grant[]
): GrantMatch[] {
  const matches: GrantMatch[] = [];

  for (const grant of allGrants) {
    const { score, reasons } = calculateMatch(profile, grant);
    if (score > 0) {
      matches.push({ grant, score, reasons });
    }
  }

  matches.sort((a, b) => b.score - a.score);
  return matches;
}

function calculateMatch(
  profile: BusinessProfile,
  grant: Grant
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  let disqualified = false;

  // Check industry match
  const industryLower = profile.industry.toLowerCase();
  if (grant.eligibility.industries.includes(industryLower)) {
    score += 25;
    reasons.push(`Industry match: ${profile.industry}`);
  } else {
    disqualified = true;
  }

  // Check state eligibility
  if (grant.eligibility.states === "all") {
    score += 15;
    reasons.push("Available in all states");
  } else if (grant.eligibility.states.includes(profile.state)) {
    score += 20;
    reasons.push(`Available in ${profile.state}`);
  } else {
    disqualified = true;
  }

  // Check employee count
  if (grant.eligibility.maxEmployees === null || profile.employeeCount <= grant.eligibility.maxEmployees) {
    score += 15;
    reasons.push("Employee count within range");
  } else {
    disqualified = true;
  }

  // Check revenue
  if (grant.eligibility.maxRevenue === null || profile.annualRevenue <= grant.eligibility.maxRevenue) {
    score += 10;
    reasons.push("Revenue within range");
  } else {
    disqualified = true;
  }

  // Check demographic requirements
  if (grant.eligibility.requiresMinority && !profile.minorityOwned) {
    disqualified = true;
  }
  if (grant.eligibility.requiresWomen && !profile.womenOwned) {
    disqualified = true;
  }
  if (grant.eligibility.requiresVeteran && !profile.veteranOwned) {
    disqualified = true;
  }

  // Bonus for demographic match (non-required)
  if (profile.minorityOwned && grant.eligibility.minorityOwned) {
    score += 10;
    reasons.push("Minority-owned business eligible");
  }
  if (profile.womenOwned && grant.eligibility.womenOwned) {
    score += 10;
    reasons.push("Women-owned business eligible");
  }
  if (profile.veteranOwned && grant.eligibility.veteranOwned) {
    score += 10;
    reasons.push("Veteran-owned business eligible");
  }

  // Demographic requirement match bonus
  if (grant.eligibility.requiresMinority && profile.minorityOwned) {
    score += 15;
    reasons.push("Qualifies for minority-owned requirement");
  }
  if (grant.eligibility.requiresWomen && profile.womenOwned) {
    score += 15;
    reasons.push("Qualifies for women-owned requirement");
  }
  if (grant.eligibility.requiresVeteran && profile.veteranOwned) {
    score += 15;
    reasons.push("Qualifies for veteran-owned requirement");
  }

  if (disqualified) {
    return { score: 0, reasons: [] };
  }

  return { score: Math.min(score, 100), reasons };
}

export function filterGrants(
  allGrants: Grant[],
  filters: {
    industry?: string;
    state?: string;
    maxEmployees?: number;
    minorityOwned?: boolean;
    womenOwned?: boolean;
    veteranOwned?: boolean;
    category?: string;
  }
): Grant[] {
  return allGrants.filter((grant) => {
    if (filters.industry) {
      if (!grant.eligibility.industries.includes(filters.industry.toLowerCase())) {
        return false;
      }
    }
    if (filters.state) {
      if (grant.eligibility.states !== "all" && !grant.eligibility.states.includes(filters.state)) {
        return false;
      }
    }
    if (filters.maxEmployees !== undefined) {
      if (grant.eligibility.maxEmployees !== null && grant.eligibility.maxEmployees < filters.maxEmployees) {
        return false;
      }
    }
    if (filters.minorityOwned) {
      if (grant.eligibility.requiresMinority && !filters.minorityOwned) {
        return false;
      }
    }
    if (filters.womenOwned) {
      if (grant.eligibility.requiresWomen && !filters.womenOwned) {
        return false;
      }
    }
    if (filters.veteranOwned) {
      if (grant.eligibility.requiresVeteran && !filters.veteranOwned) {
        return false;
      }
    }
    if (filters.category) {
      if (!grant.category.toLowerCase().includes(filters.category.toLowerCase())) {
        return false;
      }
    }
    return true;
  });
}
