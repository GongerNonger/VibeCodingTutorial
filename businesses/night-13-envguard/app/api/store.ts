export interface Finding {
  line: number;
  variable: string;
  severity: "critical" | "high" | "medium" | "low";
  issue: string;
  recommendation: string;
}

export interface ScanResult {
  findings: Finding[];
  riskScore: number;
  stats: {
    totalVars: number;
    secretsFound: number;
    recommendationsCount: number;
  };
}

export interface Scan {
  id: string;
  projectName: string;
  fileType: string;
  fileContent: string;
  createdAt: string;
  analysis: ScanResult | null;
}

const scans: Map<string, Scan> = new Map();

// Pre-seed with a sample insecure .env scan
const sampleId = "sample-001";
const sampleContent = `# Database
DB_HOST=192.168.1.100
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=password123
DATABASE_URL=postgresql://admin:password123@192.168.1.100:5432/mydb

# AWS
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1

# API Keys
STRIPE_SECRET_KEY=sk_live_abc123def456ghi789
SENDGRID_API_KEY=SG.abcdef123456.xyz789
GITHUB_TOKEN=ghp_ABCDEFghijklmnop1234567890abcdef

# App Config
APP_SECRET=mysecret
JWT_SECRET=jwt123
SESSION_SECRET=secret
ENCRYPTION_KEY=1234567890

# Services
REDIS_URL=redis://:redispass@10.0.0.5:6379
MONGO_URI=mongodb://root:mongopass@10.0.0.10:27017/app

# Private Key
PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----MIIEpAIBAAKCAQ...
`;

const sampleFindings: Finding[] = [
  {
    line: 5,
    variable: "DB_PASSWORD",
    severity: "critical",
    issue: "Weak password detected: 'password123' is a commonly used password",
    recommendation:
      "Use a strong, randomly generated password with at least 16 characters including uppercase, lowercase, numbers, and symbols.",
  },
  {
    line: 6,
    variable: "DATABASE_URL",
    severity: "critical",
    issue: "Database URL contains embedded credentials (admin:password123)",
    recommendation:
      "Use environment variable references for credentials in connection strings. Consider using IAM-based authentication.",
  },
  {
    line: 9,
    variable: "AWS_ACCESS_KEY_ID",
    severity: "critical",
    issue: "AWS Access Key detected (starts with AKIA)",
    recommendation:
      "Rotate this key immediately. Use IAM roles or AWS SSO instead of long-term access keys. Never commit AWS keys to version control.",
  },
  {
    line: 10,
    variable: "AWS_SECRET_ACCESS_KEY",
    severity: "critical",
    issue: "AWS Secret Access Key exposed",
    recommendation:
      "Rotate this key immediately. Use AWS Secrets Manager or Parameter Store for secret management.",
  },
  {
    line: 14,
    variable: "STRIPE_SECRET_KEY",
    severity: "critical",
    issue: "Stripe live secret key detected (sk_live_ prefix)",
    recommendation:
      "Rotate this key in your Stripe dashboard immediately. Use restricted API keys with minimal permissions.",
  },
  {
    line: 15,
    variable: "SENDGRID_API_KEY",
    severity: "high",
    issue: "SendGrid API key detected (SG. prefix)",
    recommendation:
      "Rotate this key and use API key scoping to limit permissions.",
  },
  {
    line: 16,
    variable: "GITHUB_TOKEN",
    severity: "critical",
    issue: "GitHub personal access token detected (ghp_ prefix)",
    recommendation:
      "Revoke this token immediately. Use fine-grained tokens with minimal scopes and short expiration.",
  },
  {
    line: 19,
    variable: "APP_SECRET",
    severity: "high",
    issue: "Weak secret value: 'mysecret' is easily guessable",
    recommendation:
      "Generate a cryptographically secure random string of at least 32 characters.",
  },
  {
    line: 20,
    variable: "JWT_SECRET",
    severity: "high",
    issue: "Weak JWT secret: 'jwt123' is trivially guessable and too short",
    recommendation:
      "Use a minimum 256-bit (32-byte) random secret for JWT signing. Consider using RS256 with key pairs instead.",
  },
  {
    line: 21,
    variable: "SESSION_SECRET",
    severity: "high",
    issue: "Weak session secret: 'secret' is a default/common value",
    recommendation:
      "Generate a strong random session secret of at least 32 characters.",
  },
  {
    line: 22,
    variable: "ENCRYPTION_KEY",
    severity: "high",
    issue: "Weak encryption key: '1234567890' is a sequential numeric pattern",
    recommendation:
      "Use a cryptographically secure random key appropriate for your encryption algorithm (e.g., 256-bit for AES-256).",
  },
  {
    line: 2,
    variable: "DB_HOST",
    severity: "medium",
    issue: "Hardcoded private IP address (192.168.1.100)",
    recommendation:
      "Use DNS names or service discovery instead of hardcoded IPs. Consider using environment-specific configuration.",
  },
  {
    line: 25,
    variable: "REDIS_URL",
    severity: "high",
    issue: "Redis URL contains embedded password",
    recommendation:
      "Use separate environment variables for Redis credentials. Consider Redis ACL authentication.",
  },
  {
    line: 26,
    variable: "MONGO_URI",
    severity: "high",
    issue: "MongoDB URI contains embedded credentials (root:mongopass)",
    recommendation:
      "Use separate credential variables. Consider SCRAM-SHA-256 or x.509 certificate authentication.",
  },
  {
    line: 29,
    variable: "PRIVATE_KEY",
    severity: "critical",
    issue: "RSA private key detected in environment variable",
    recommendation:
      "Never store private keys in .env files. Use a secrets manager, HSM, or key vault. Regenerate this key pair immediately.",
  },
];

scans.set(sampleId, {
  id: sampleId,
  projectName: "Insecure Demo App",
  fileType: ".env",
  fileContent: sampleContent,
  createdAt: new Date().toISOString(),
  analysis: {
    findings: sampleFindings,
    riskScore: 92,
    stats: {
      totalVars: 16,
      secretsFound: 15,
      recommendationsCount: 15,
    },
  },
});

export function getAllScans(): Scan[] {
  return Array.from(scans.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getScan(id: string): Scan | undefined {
  return scans.get(id);
}

export function createScan(
  projectName: string,
  fileContent: string,
  fileType: string
): Scan {
  const id = `scan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const scan: Scan = {
    id,
    projectName,
    fileType,
    fileContent,
    createdAt: new Date().toISOString(),
    analysis: null,
  };
  scans.set(id, scan);
  return scan;
}

export function setScanAnalysis(id: string, analysis: ScanResult): boolean {
  const scan = scans.get(id);
  if (!scan) return false;
  scan.analysis = analysis;
  return true;
}
