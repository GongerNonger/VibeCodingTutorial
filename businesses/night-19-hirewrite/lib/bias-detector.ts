export interface BiasMatch {
  term: string;
  index: number;
  category: string;
  suggestion: string;
  explanation: string;
}

interface BiasRule {
  pattern: RegExp;
  category: string;
  suggestion: string;
  explanation: string;
}

const biasRules: BiasRule[] = [
  // Gender-coded language
  {
    pattern: /\bninja\b/gi,
    category: "Gender-coded",
    suggestion: "expert, specialist",
    explanation: "This term is associated with masculine stereotypes and may discourage some candidates from applying.",
  },
  {
    pattern: /\brockstar\b/gi,
    category: "Gender-coded",
    suggestion: "high-performer, top talent",
    explanation: "This term is associated with masculine stereotypes and may discourage some candidates from applying.",
  },
  {
    pattern: /\bguru\b/gi,
    category: "Gender-coded",
    suggestion: "expert, specialist, authority",
    explanation: "This term can be culturally insensitive and is associated with masculine stereotypes.",
  },
  {
    pattern: /\bhacker\b/gi,
    category: "Gender-coded",
    suggestion: "developer, engineer, programmer",
    explanation: "This term is associated with masculine stereotypes and may discourage diverse candidates.",
  },
  {
    pattern: /\bdominant\b/gi,
    category: "Gender-coded",
    suggestion: "leading, primary, key",
    explanation: "This term carries aggressive connotations that may discourage some candidates.",
  },
  {
    pattern: /\baggressive\b/gi,
    category: "Gender-coded",
    suggestion: "ambitious, driven, motivated",
    explanation: "This term carries masculine-coded connotations. Use more neutral alternatives.",
  },
  {
    pattern: /\bcompetitive\b/gi,
    category: "Gender-coded",
    suggestion: "motivated, results-oriented",
    explanation: "This term is masculine-coded and may discourage some applicants.",
  },
  // Age-biased language
  {
    pattern: /\byoung\b/gi,
    category: "Age bias",
    suggestion: "energetic, motivated",
    explanation: "Age-related terms may violate equal employment laws and discourage qualified candidates.",
  },
  {
    pattern: /\bdigital native\b/gi,
    category: "Age bias",
    suggestion: "digitally proficient, tech-savvy",
    explanation: "This term implies a preference for younger candidates and may be discriminatory.",
  },
  {
    pattern: /\brecent graduate\b/gi,
    category: "Age bias",
    suggestion: "entry-level candidate",
    explanation: "This may be age-discriminatory. Focus on skills and experience level instead.",
  },
  {
    pattern: /\bmature\b/gi,
    category: "Age bias",
    suggestion: "experienced, seasoned",
    explanation: "Age-related descriptors can be discriminatory regardless of intent.",
  },
  // Ability-biased language
  {
    pattern: /\bable-bodied\b/gi,
    category: "Ability bias",
    suggestion: "physically capable of performing essential functions",
    explanation: "Focus on essential job functions rather than physical ability.",
  },
  {
    pattern: /\bstand for long periods\b/gi,
    category: "Ability bias",
    suggestion: "perform duties at a workstation for extended periods",
    explanation: "Unless essential, avoid physical requirements that exclude people with disabilities.",
  },
  // Exclusionary requirements
  {
    pattern: /\bmust have ([0-9]{2,})\+? years\b/gi,
    category: "Exclusionary",
    suggestion: "Consider reducing years requirement or making it preferred",
    explanation: "Excessive experience requirements can exclude qualified candidates and may correlate with age discrimination.",
  },
  {
    pattern: /\bculture fit\b/gi,
    category: "Exclusionary",
    suggestion: "culture add, values alignment",
    explanation: "'Culture fit' often leads to homogeneous hiring. 'Culture add' promotes diversity.",
  },
  {
    pattern: /\bnative speaker\b/gi,
    category: "Exclusionary",
    suggestion: "fluent, proficient",
    explanation: "Requiring native-level language skills may discriminate against qualified non-native speakers.",
  },
  {
    pattern: /\bman\b(?!age|dat|ual|ner|uscript|ifest|y)/gi,
    category: "Gender-coded",
    suggestion: "person, individual, team member",
    explanation: "Use gender-neutral language to be inclusive of all candidates.",
  },
  {
    pattern: /\bmanpower\b/gi,
    category: "Gender-coded",
    suggestion: "workforce, personnel, team capacity",
    explanation: "Use gender-neutral alternatives for inclusive job descriptions.",
  },
  {
    pattern: /\bhe\/she\b/gi,
    category: "Gender-coded",
    suggestion: "they, the candidate, the employee",
    explanation: "Use gender-neutral pronouns to be inclusive of all gender identities.",
  },
];

export function detectBias(text: string): BiasMatch[] {
  const matches: BiasMatch[] = [];

  for (const rule of biasRules) {
    // Reset the regex lastIndex
    rule.pattern.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = rule.pattern.exec(text)) !== null) {
      matches.push({
        term: match[0],
        index: match.index,
        category: rule.category,
        suggestion: rule.suggestion,
        explanation: rule.explanation,
      });
    }
  }

  // Sort by index
  matches.sort((a, b) => a.index - b.index);
  return matches;
}
