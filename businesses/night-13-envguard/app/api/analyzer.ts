import { Finding, ScanResult } from "./store";

interface PatternRule {
  pattern: RegExp;
  severity: Finding["severity"];
  issue: string;
  recommendation: string;
  matchOn: "value" | "key" | "line";
}

const COMMON_PASSWORDS = [
  "password",
  "password123",
  "123456",
  "admin",
  "root",
  "secret",
  "test",
  "changeme",
  "default",
  "letmein",
  "qwerty",
  "abc123",
  "monkey",
  "master",
  "dragon",
  "login",
  "passw0rd",
  "welcome",
  "shadow",
  "sunshine",
];

const VALUE_PATTERNS: PatternRule[] = [
  {
    pattern: /^AKIA[0-9A-Z]{16}$/,
    severity: "critical",
    issue: "AWS Access Key detected (starts with AKIA)",
    recommendation:
      "Rotate this key immediately. Use IAM roles instead of long-term access keys.",
    matchOn: "value",
  },
  {
    pattern: /^sk_live_/,
    severity: "critical",
    issue: "Stripe live secret key detected",
    recommendation:
      "Rotate this key in Stripe dashboard. Use restricted keys with minimal permissions.",
    matchOn: "value",
  },
  {
    pattern: /^sk_test_/,
    severity: "medium",
    issue: "Stripe test secret key detected",
    recommendation:
      "While this is a test key, avoid committing it to version control.",
    matchOn: "value",
  },
  {
    pattern: /^ghp_[a-zA-Z0-9]{36,}$/,
    severity: "critical",
    issue: "GitHub personal access token detected",
    recommendation:
      "Revoke this token. Use fine-grained tokens with minimal scopes.",
    matchOn: "value",
  },
  {
    pattern: /^gho_[a-zA-Z0-9]{36,}$/,
    severity: "critical",
    issue: "GitHub OAuth token detected",
    recommendation: "Revoke and regenerate this OAuth token.",
    matchOn: "value",
  },
  {
    pattern: /^SG\.[a-zA-Z0-9._-]+/,
    severity: "high",
    issue: "SendGrid API key detected",
    recommendation: "Rotate this key and use API key scoping.",
    matchOn: "value",
  },
  {
    pattern: /^xoxb-/,
    severity: "critical",
    issue: "Slack bot token detected",
    recommendation: "Rotate this token in Slack app settings.",
    matchOn: "value",
  },
  {
    pattern: /^xoxp-/,
    severity: "critical",
    issue: "Slack user token detected",
    recommendation: "Rotate this token in Slack app settings.",
    matchOn: "value",
  },
  {
    pattern: /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/,
    severity: "critical",
    issue: "Private key detected in environment variable",
    recommendation:
      "Never store private keys in .env files. Use a secrets manager or key vault.",
    matchOn: "value",
  },
  {
    pattern: /^(mongodb(\+srv)?):\/\/[^:]+:[^@]+@/,
    severity: "high",
    issue: "MongoDB URI contains embedded credentials",
    recommendation:
      "Use separate credential variables. Consider certificate-based auth.",
    matchOn: "value",
  },
  {
    pattern: /^postgres(ql)?:\/\/[^:]+:[^@]+@/,
    severity: "high",
    issue: "PostgreSQL URL contains embedded credentials",
    recommendation:
      "Use separate credential variables. Consider IAM-based authentication.",
    matchOn: "value",
  },
  {
    pattern: /^mysql:\/\/[^:]+:[^@]+@/,
    severity: "high",
    issue: "MySQL URL contains embedded credentials",
    recommendation: "Use separate credential variables for database connections.",
    matchOn: "value",
  },
  {
    pattern: /^redis:\/\/:[^@]+@/,
    severity: "high",
    issue: "Redis URL contains embedded password",
    recommendation:
      "Use separate environment variables for Redis credentials.",
    matchOn: "value",
  },
  {
    pattern: /^(\d{1,3}\.){3}\d{1,3}$/,
    severity: "medium",
    issue: "Hardcoded IP address detected",
    recommendation:
      "Use DNS names or service discovery instead of hardcoded IPs.",
    matchOn: "value",
  },
];

const SECRET_KEY_PATTERNS = [
  /secret/i,
  /password/i,
  /passwd/i,
  /token/i,
  /api.?key/i,
  /private.?key/i,
  /encryption.?key/i,
  /auth/i,
  /credential/i,
];

function isWeakValue(value: string): { weak: boolean; reason: string } {
  const lower = value.toLowerCase();

  if (COMMON_PASSWORDS.includes(lower)) {
    return { weak: true, reason: `'${value}' is a commonly used password` };
  }
  if (value.length < 8) {
    return {
      weak: true,
      reason: `Value is only ${value.length} characters (minimum 8 recommended)`,
    };
  }
  if (/^[0-9]+$/.test(value) && value.length < 16) {
    return { weak: true, reason: "Purely numeric value is easily guessable" };
  }
  if (/^(.)\1+$/.test(value)) {
    return { weak: true, reason: "Repeated character pattern is trivially guessable" };
  }
  if (/^(123|abc|qwerty|asdf)/i.test(value)) {
    return { weak: true, reason: "Sequential/keyboard pattern detected" };
  }

  return { weak: false, reason: "" };
}

function parseEnvLines(
  content: string
): { line: number; key: string; value: string }[] {
  const results: { line: number; key: string; value: string }[] = [];
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();
    if (!raw || raw.startsWith("#") || raw.startsWith("//")) continue;

    const eqIndex = raw.indexOf("=");
    if (eqIndex === -1) continue;

    const key = raw.slice(0, eqIndex).trim();
    let value = raw.slice(eqIndex + 1).trim();
    // Strip quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && value) {
      results.push({ line: i + 1, key, value });
    }
  }

  return results;
}

function parseYamlLines(
  content: string
): { line: number; key: string; value: string }[] {
  const results: { line: number; key: string; value: string }[] = [];
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();
    if (!raw || raw.startsWith("#")) continue;

    const colonIndex = raw.indexOf(":");
    if (colonIndex === -1) continue;

    const key = raw.slice(0, colonIndex).trim();
    let value = raw.slice(colonIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && value) {
      results.push({ line: i + 1, key, value });
    }
  }

  return results;
}

function parseJsonContent(
  content: string
): { line: number; key: string; value: string }[] {
  const results: { line: number; key: string; value: string }[] = [];
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/["']([^"']+)["']\s*:\s*["']([^"']+)["']/);
    if (match) {
      results.push({ line: i + 1, key: match[1], value: match[2] });
    }
  }

  return results;
}

export function analyzeContent(
  content: string,
  fileType: string
): ScanResult {
  let entries: { line: number; key: string; value: string }[];

  switch (fileType) {
    case ".yaml":
    case ".yml":
      entries = parseYamlLines(content);
      break;
    case ".json":
      entries = parseJsonContent(content);
      break;
    case ".toml":
      entries = parseEnvLines(content); // TOML key=value is similar
      break;
    default:
      entries = parseEnvLines(content);
  }

  const findings: Finding[] = [];

  for (const entry of entries) {
    // Check value patterns
    for (const rule of VALUE_PATTERNS) {
      if (rule.pattern.test(entry.value)) {
        findings.push({
          line: entry.line,
          variable: entry.key,
          severity: rule.severity,
          issue: rule.issue,
          recommendation: rule.recommendation,
        });
        break; // One pattern match per value is enough
      }
    }

    // Check if key suggests a secret
    const isSecretKey = SECRET_KEY_PATTERNS.some((p) => p.test(entry.key));
    if (isSecretKey) {
      // Check if the finding was already added by a value pattern
      const alreadyFound = findings.some(
        (f) => f.line === entry.line && f.variable === entry.key
      );
      if (!alreadyFound) {
        const weakness = isWeakValue(entry.value);
        if (weakness.weak) {
          findings.push({
            line: entry.line,
            variable: entry.key,
            severity: "high",
            issue: `Weak secret value: ${weakness.reason}`,
            recommendation:
              "Generate a cryptographically secure random string of at least 32 characters.",
          });
        }
      }
    }
  }

  // Sort findings by severity then line number
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  findings.sort(
    (a, b) =>
      severityOrder[a.severity] - severityOrder[b.severity] ||
      a.line - b.line
  );

  // Calculate risk score
  const riskScore = calculateRiskScore(findings, entries.length);

  return {
    findings,
    riskScore,
    stats: {
      totalVars: entries.length,
      secretsFound: findings.length,
      recommendationsCount: findings.length,
    },
  };
}

function calculateRiskScore(findings: Finding[], totalVars: number): number {
  if (findings.length === 0) return 0;
  if (totalVars === 0) return 0;

  const weights = { critical: 25, high: 15, medium: 8, low: 3 };
  let score = 0;

  for (const f of findings) {
    score += weights[f.severity];
  }

  // Normalize to 0-100
  return Math.min(100, Math.round(score));
}
