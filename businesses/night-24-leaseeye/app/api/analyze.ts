import { LeaseAnalysis } from "./store";

function extractRent(text: string): string | null {
  const patterns = [
    /\$\s?([\d,]+(?:\.\d{2})?)\s*(?:\/\s*month|per\s*month|monthly|\/mo)/i,
    /monthly\s*rent\s*(?:of|is|shall be|:)?\s*\$\s?([\d,]+(?:\.\d{2})?)/i,
    /rent\s*(?:of|is|shall be|:)?\s*\$\s?([\d,]+(?:\.\d{2})?)\s*(?:per|\/|a)\s*month/i,
    /\$\s?([\d,]+(?:\.\d{2})?)\s*(?:due|each|every)\s*month/i,
  ];
  for (const pat of patterns) {
    const m = text.match(pat);
    if (m) return `$${m[1]}`;
  }
  return null;
}

function extractSecurityDeposit(text: string): string | null {
  const patterns = [
    /security\s*deposit\s*(?:of|is|shall be|:)?\s*\$\s?([\d,]+(?:\.\d{2})?)/i,
    /deposit\s*(?:of|is|shall be|:)?\s*\$\s?([\d,]+(?:\.\d{2})?)/i,
    /\$\s?([\d,]+(?:\.\d{2})?)\s*(?:security\s*)?deposit/i,
  ];
  for (const pat of patterns) {
    const m = text.match(pat);
    if (m) return `$${m[1]}`;
  }
  return null;
}

function extractLeaseDuration(text: string): string | null {
  const patterns = [
    /lease\s*(?:term|duration|period)\s*(?:of|is|shall be|:)?\s*(\d+)\s*(month|year|week)s?/i,
    /(\d+)\s*(?:-\s*)?(month|year|week)s?\s*lease/i,
    /term\s*(?:of|is|:)?\s*(\d+)\s*(month|year|week)s?/i,
    /for\s*(?:a\s*(?:period|term)\s*of\s*)?(\d+)\s*(month|year|week)s?/i,
  ];
  for (const pat of patterns) {
    const m = text.match(pat);
    if (m) return `${m[1]} ${m[2].toLowerCase()}s`;
  }
  return null;
}

function extractMoveInDate(text: string): string | null {
  const patterns = [
    /(?:move[- ]?in|commencement|beginning|starting|starts?)\s*(?:date|on|:)?\s*(?:is\s*)?(?:on\s*)?((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s*\d{4})/i,
    /(?:beginning|commencing|starting)\s+(?:on\s+)?((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s*\d{4})/i,
    /(\d{1,2}\/\d{1,2}\/\d{2,4})\s*(?:move[- ]?in|commencement|start)/i,
  ];
  for (const pat of patterns) {
    const m = text.match(pat);
    if (m) return m[1];
  }
  return null;
}

function extractPetPolicy(text: string): string | null {
  const lc = text.toLowerCase();
  if (/no\s*pets?\s*(?:allowed|permitted|policy)/i.test(text) || /pets?\s*(?:are\s*)?(?:not|prohibited|strictly\s*(?:not|prohibited))/i.test(text)) {
    return "Not allowed";
  }
  const depositMatch = text.match(/pets?\s*(?:are\s*)?(?:allowed|permitted|welcome).*?\$\s?([\d,]+)\s*(?:pet\s*)?deposit/i)
    || text.match(/\$\s?([\d,]+)\s*pet\s*deposit/i)
    || text.match(/pet\s*deposit\s*(?:of|:)?\s*\$\s?([\d,]+)/i);
  if (depositMatch) {
    return `Allowed with $${depositMatch[1]} deposit`;
  }
  if (/pets?\s*(?:are\s*)?(?:allowed|permitted|welcome)/i.test(text)) {
    return "Allowed";
  }
  if (/pet/i.test(lc)) {
    return "Mentioned - review details";
  }
  return null;
}

function extractMaintenanceResponsibilities(text: string): { landlord: string[]; tenant: string[] } {
  const landlord: string[] = [];
  const tenant: string[] = [];

  const landlordPatterns = [
    /landlord\s*(?:is|shall be|will be)?\s*responsible\s*(?:for)?\s*([^.]+)/gi,
    /(?:owner|management|property manager)\s*(?:is|shall|will)\s*(?:be\s*)?responsible\s*(?:for)?\s*([^.]+)/gi,
  ];
  const tenantPatterns = [
    /tenant\s*(?:is|shall be|will be)?\s*responsible\s*(?:for)?\s*([^.]+)/gi,
    /(?:renter|lessee|resident)\s*(?:is|shall|will)\s*(?:be\s*)?responsible\s*(?:for)?\s*([^.]+)/gi,
  ];

  for (const pat of landlordPatterns) {
    let m;
    while ((m = pat.exec(text)) !== null) {
      landlord.push(m[1].trim());
    }
  }
  for (const pat of tenantPatterns) {
    let m;
    while ((m = pat.exec(text)) !== null) {
      tenant.push(m[1].trim());
    }
  }

  if (landlord.length === 0 && tenant.length === 0) {
    if (/landlord.*(?:repair|maintain|fix)/i.test(text)) {
      landlord.push("General repairs and maintenance");
    }
    if (/tenant.*(?:repair|maintain|fix)/i.test(text)) {
      tenant.push("General repairs and maintenance");
    }
  }

  return { landlord, tenant };
}

function extractTerminationClause(text: string): string | null {
  const patterns = [
    /early\s*termination[^.]*\./i,
    /termination\s*(?:clause|terms?|conditions?)[^.]*\./i,
    /(?:break|end|terminate)\s*(?:the\s*)?lease[^.]*\./i,
  ];
  for (const pat of patterns) {
    const m = text.match(pat);
    if (m) return m[0].trim();
  }
  return null;
}

interface RedFlag {
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
}

function detectRedFlags(text: string, rent: string | null, deposit: string | null): RedFlag[] {
  const flags: RedFlag[] = [];
  const lc = text.toLowerCase();

  // Excessive penalties
  if (/penalty\s*(?:of|:)?\s*(?:\$[\d,]+|[2-9]\s*months?\s*rent|\d+\s*months?\s*rent)/i.test(text)) {
    flags.push({
      title: "High Early Termination Penalty",
      description: "The lease includes significant financial penalties for early termination.",
      severity: "high",
    });
  }

  // Waived rights
  if (/waive.*(?:right|claim|lawsuit|legal|court|jury|trial)/i.test(lc) || /(?:right|claim|lawsuit|legal|court|jury|trial).*waive/i.test(lc)) {
    flags.push({
      title: "Waived Legal Rights",
      description: "The lease may require you to waive important legal rights.",
      severity: "high",
    });
  }

  // Unreasonable entry notice
  if (/(?:enter|access|entry).*?(?:at\s*any\s*time|without\s*(?:notice|prior\s*notice|consent))/i.test(text)) {
    flags.push({
      title: "Unreasonable Entry Rights",
      description: "The landlord may enter your unit without reasonable notice.",
      severity: "high",
    });
  }

  // Automatic renewal
  if (/auto(?:matic(?:ally)?)?[- ]?renew/i.test(text)) {
    flags.push({
      title: "Automatic Renewal Clause",
      description: "The lease auto-renews, which could lock you in if you miss the cancellation window.",
      severity: "medium",
    });
  }

  // Liability waivers
  if (/(?:landlord|owner|management)\s*(?:is\s*)?(?:not\s*(?:liable|responsible)|held\s*harmless)/i.test(text) || /hold\s*harmless/i.test(lc)) {
    flags.push({
      title: "Liability Waiver",
      description: "The lease limits the landlord's liability, which could leave you unprotected.",
      severity: "medium",
    });
  }

  // Non-refundable fees
  if (/non[- ]?refundable\s*(?:fee|deposit|charge|payment)/i.test(text)) {
    flags.push({
      title: "Non-Refundable Fees",
      description: "The lease includes non-refundable fees that you cannot recover.",
      severity: "medium",
    });
  }

  // High security deposit relative to rent
  if (rent && deposit) {
    const rentVal = parseFloat(rent.replace(/[$,]/g, ""));
    const depVal = parseFloat(deposit.replace(/[$,]/g, ""));
    if (rentVal > 0 && depVal > rentVal * 2) {
      flags.push({
        title: "Excessive Security Deposit",
        description: `The security deposit (${deposit}) is more than 2x the monthly rent (${rent}), which may exceed legal limits.`,
        severity: "high",
      });
    } else if (rentVal > 0 && depVal > rentVal * 1.5) {
      flags.push({
        title: "High Security Deposit",
        description: `The security deposit (${deposit}) is more than 1.5x the monthly rent (${rent}).`,
        severity: "medium",
      });
    }
  }

  // Late fee concerns
  if (/late\s*fee\s*(?:of|:)?\s*\$\s?([\d,]+)/i.test(text)) {
    const m = text.match(/late\s*fee\s*(?:of|:)?\s*\$\s?([\d,]+)/i);
    if (m) {
      const lateFee = parseFloat(m[1].replace(/,/g, ""));
      if (lateFee > 100) {
        flags.push({
          title: "High Late Fee",
          description: `Late fee of $${m[1]} may be excessive.`,
          severity: "medium",
        });
      }
    }
  }

  return flags;
}

function extractClauses(text: string): { category: string; original: string; plainEnglish: string }[] {
  const clauses: { category: string; original: string; plainEnglish: string }[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 10);

  for (const sentence of sentences) {
    const s = sentence.trim();
    const lc = s.toLowerCase();

    if (/rent|payment|deposit|\$\s?\d|fee|charge|cost/i.test(lc)) {
      clauses.push({
        category: "financial",
        original: s,
        plainEnglish: translateToPlainEnglish(s, "financial"),
      });
    } else if (/repair|maintain|maintenance|fix|condition|damage|wear/i.test(lc)) {
      clauses.push({
        category: "maintenance",
        original: s,
        plainEnglish: translateToPlainEnglish(s, "maintenance"),
      });
    } else if (/pet|noise|quiet|guest|park|smok|rule|prohibit|restrict|comply/i.test(lc)) {
      clauses.push({
        category: "rules",
        original: s,
        plainEnglish: translateToPlainEnglish(s, "rules"),
      });
    } else if (/terminat|cancel|break|end|vacat|evict|notice|renew|expir/i.test(lc)) {
      clauses.push({
        category: "termination",
        original: s,
        plainEnglish: translateToPlainEnglish(s, "termination"),
      });
    }
  }

  return clauses;
}

function translateToPlainEnglish(clause: string, category: string): string {
  let plain = clause;

  // Simplify common legal phrases
  plain = plain.replace(/\bshall\b/gi, "will");
  plain = plain.replace(/\bhereinafter\b/gi, "from now on");
  plain = plain.replace(/\bwherein\b/gi, "where");
  plain = plain.replace(/\bnotwithstanding\b/gi, "despite");
  plain = plain.replace(/\bin the event (?:that|of)\b/gi, "if");
  plain = plain.replace(/\bpursuant to\b/gi, "according to");
  plain = plain.replace(/\bhereby\b/gi, "");
  plain = plain.replace(/\bthereof\b/gi, "of it");
  plain = plain.replace(/\baforesaid\b/gi, "mentioned earlier");
  plain = plain.replace(/\bthe premises\b/gi, "the apartment");
  plain = plain.replace(/\blessee\b/gi, "you (the tenant)");
  plain = plain.replace(/\blessor\b/gi, "the landlord");
  plain = plain.replace(/\btenant\b/gi, "you");
  plain = plain.replace(/\blandlord\b/gi, "your landlord");

  plain = plain.replace(/\s+/g, " ").trim();
  return plain;
}

function calculateRiskScore(flags: RedFlag[]): number {
  let score = 0;
  for (const flag of flags) {
    switch (flag.severity) {
      case "high":
        score += 25;
        break;
      case "medium":
        score += 15;
        break;
      case "low":
        score += 5;
        break;
    }
  }
  return Math.min(100, score);
}

function generateSummary(
  rent: string | null,
  deposit: string | null,
  duration: string | null,
  petPolicy: string | null,
  riskScore: number,
  flagCount: number
): string {
  const parts: string[] = [];

  if (duration && rent) {
    parts.push(`This is a ${duration} lease at ${rent}/month`);
  } else if (rent) {
    parts.push(`Monthly rent is ${rent}`);
  } else if (duration) {
    parts.push(`This is a ${duration} lease`);
  } else {
    parts.push("This is a residential lease agreement");
  }

  if (deposit) {
    parts.push(`with a ${deposit} security deposit`);
  }

  let summary = parts.join(" ") + ".";

  if (petPolicy) {
    summary += ` Pets: ${petPolicy}.`;
  }

  if (riskScore > 60) {
    summary += ` HIGH RISK (score: ${riskScore}/100) - ${flagCount} red flag(s) detected. Review carefully before signing.`;
  } else if (riskScore > 30) {
    summary += ` Moderate risk (score: ${riskScore}/100) - ${flagCount} item(s) to review.`;
  } else {
    summary += ` Low risk (score: ${riskScore}/100). Looks reasonable overall.`;
  }

  return summary;
}

export function analyzeLease(leaseText: string): LeaseAnalysis {
  const rent = extractRent(leaseText);
  const deposit = extractSecurityDeposit(leaseText);
  const duration = extractLeaseDuration(leaseText);
  const moveInDate = extractMoveInDate(leaseText);
  const petPolicy = extractPetPolicy(leaseText);
  const maintenance = extractMaintenanceResponsibilities(leaseText);
  const terminationClause = extractTerminationClause(leaseText);
  const redFlags = detectRedFlags(leaseText, rent, deposit);
  const clauses = extractClauses(leaseText);
  const riskScore = calculateRiskScore(redFlags);
  const summary = generateSummary(rent, deposit, duration, petPolicy, riskScore, redFlags.length);

  const keyTerms: { label: string; value: string; category: string }[] = [];
  if (rent) keyTerms.push({ label: "Monthly Rent", value: rent, category: "financial" });
  if (deposit) keyTerms.push({ label: "Security Deposit", value: deposit, category: "financial" });
  if (duration) keyTerms.push({ label: "Lease Duration", value: duration, category: "financial" });
  if (moveInDate) keyTerms.push({ label: "Move-in Date", value: moveInDate, category: "financial" });
  if (petPolicy) keyTerms.push({ label: "Pet Policy", value: petPolicy, category: "rules" });
  if (terminationClause) keyTerms.push({ label: "Termination", value: terminationClause, category: "termination" });

  const id = `analysis-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  return {
    id,
    leaseText,
    summary,
    keyTerms,
    redFlags,
    clauses,
    monthlyRent: rent,
    securityDeposit: deposit,
    leaseDuration: duration,
    moveInDate,
    petPolicy,
    maintenanceResponsibilities: maintenance,
    terminationClause,
    riskScore,
    createdAt: new Date().toISOString(),
  };
}
