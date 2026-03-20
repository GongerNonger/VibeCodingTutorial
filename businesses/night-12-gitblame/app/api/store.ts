import { v4 as uuidv4 } from "uuid";

export interface FocusArea {
  file: string;
  concern: string;
  priority: "high" | "medium" | "low";
}

export interface DiffStats {
  filesChanged: number;
  additions: number;
  deletions: number;
}

export interface Analysis {
  summary: string;
  riskLevel: "low" | "medium" | "high";
  focusAreas: FocusArea[];
  suggestions: string[];
  stats: DiffStats;
  analyzedAt: string;
}

export interface Review {
  id: string;
  title: string;
  description: string;
  diffText: string;
  baseBranch: string;
  headBranch: string;
  analysis: Analysis | null;
  createdAt: string;
}

const reviews: Map<string, Review> = new Map();

// Pre-seed with a sample review
const sampleId = uuidv4();
const sampleDiff = `diff --git a/src/auth/middleware.ts b/src/auth/middleware.ts
new file mode 100644
index 0000000..a1b2c3d
--- /dev/null
+++ b/src/auth/middleware.ts
@@ -0,0 +1,45 @@
+import { NextRequest, NextResponse } from "next/server";
+import jwt from "jsonwebtoken";
+
+const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";
+
+export interface AuthUser {
+  id: string;
+  email: string;
+  role: "admin" | "user";
+}
+
+export function verifyToken(token: string): AuthUser | null {
+  try {
+    return jwt.verify(token, JWT_SECRET) as AuthUser;
+  } catch {
+    return null;
+  }
+}
+
+export function authMiddleware(req: NextRequest) {
+  const authHeader = req.headers.get("authorization");
+  if (!authHeader?.startsWith("Bearer ")) {
+    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
+  }
+
+  const token = authHeader.split(" ")[1];
+  const user = verifyToken(token);
+
+  if (!user) {
+    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
+  }
+
+  return user;
+}
+
+export function requireRole(user: AuthUser, role: string) {
+  if (user.role !== role) {
+    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
+  }
+  return null;
+}
+
+export function hashPassword(password: string): string {
+  // TODO: Use bcrypt in production
+  return Buffer.from(password).toString("base64");
+}
diff --git a/src/auth/login.ts b/src/auth/login.ts
new file mode 100644
index 0000000..d4e5f6a
--- /dev/null
+++ b/src/auth/login.ts
@@ -0,0 +1,32 @@
+import jwt from "jsonwebtoken";
+import { hashPassword } from "./middleware";
+
+const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";
+
+interface LoginRequest {
+  email: string;
+  password: string;
+}
+
+const users = new Map<string, { id: string; email: string; passwordHash: string; role: string }>();
+
+export async function register(email: string, password: string) {
+  if (users.has(email)) {
+    throw new Error("User already exists");
+  }
+  const user = {
+    id: crypto.randomUUID(),
+    email,
+    passwordHash: hashPassword(password),
+    role: "user",
+  };
+  users.set(email, user);
+  return { id: user.id, email: user.email };
+}
+
+export async function login({ email, password }: LoginRequest) {
+  const user = users.get(email);
+  if (!user || user.passwordHash !== hashPassword(password)) {
+    throw new Error("Invalid credentials");
+  }
+  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
+  return { token, user: { id: user.id, email: user.email } };
+}
diff --git a/src/db/schema.sql b/src/db/schema.sql
new file mode 100644
index 0000000..f7a8b9c
--- /dev/null
+++ b/src/db/schema.sql
@@ -0,0 +1,12 @@
+CREATE TABLE users (
+  id TEXT PRIMARY KEY,
+  email TEXT UNIQUE NOT NULL,
+  password_hash TEXT NOT NULL,
+  role TEXT DEFAULT 'user',
+  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
+);
+
+CREATE TABLE sessions (
+  id TEXT PRIMARY KEY,
+  user_id TEXT REFERENCES users(id),
+  expires_at DATETIME NOT NULL
+);`;

const sampleAnalysis: Analysis = {
  summary:
    "This PR adds user authentication with JWT-based middleware, login/registration endpoints, and a database schema for users and sessions. The implementation includes role-based access control but uses a placeholder password hashing mechanism that needs to be replaced before production.",
  riskLevel: "high",
  focusAreas: [
    {
      file: "src/auth/middleware.ts",
      concern: "Hardcoded fallback JWT secret 'dev-secret-key' could leak into production",
      priority: "high",
    },
    {
      file: "src/auth/middleware.ts",
      concern: "Password hashing uses Base64 encoding instead of bcrypt - insecure for production",
      priority: "high",
    },
    {
      file: "src/auth/login.ts",
      concern: "User storage is in-memory Map - data will be lost on server restart",
      priority: "medium",
    },
    {
      file: "src/auth/login.ts",
      concern: "JWT_SECRET is duplicated across files instead of using a shared config",
      priority: "medium",
    },
    {
      file: "src/db/schema.sql",
      concern: "Sessions table lacks an index on user_id for query performance",
      priority: "low",
    },
  ],
  suggestions: [
    "Replace Base64 password hashing with bcrypt or argon2 before merging",
    "Extract JWT_SECRET to a shared configuration module to avoid duplication",
    "Add input validation for email format and password strength requirements",
    "Consider adding rate limiting to the login endpoint to prevent brute force attacks",
    "Add unit tests for the auth middleware and login flow",
    "Add CASCADE delete on sessions when a user is removed",
  ],
  stats: {
    filesChanged: 3,
    additions: 89,
    deletions: 0,
  },
  analyzedAt: new Date().toISOString(),
};

reviews.set(sampleId, {
  id: sampleId,
  title: "Add user authentication",
  description:
    "Implements JWT-based authentication with login, registration, role-based middleware, and database schema for users and sessions.",
  diffText: sampleDiff,
  baseBranch: "main",
  headBranch: "feature/auth",
  analysis: sampleAnalysis,
  createdAt: new Date().toISOString(),
});

export function getAllReviews(): Review[] {
  return Array.from(reviews.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getReview(id: string): Review | undefined {
  return reviews.get(id);
}

export function createReview(data: {
  title: string;
  description: string;
  diffText: string;
  baseBranch: string;
  headBranch: string;
}): Review {
  const review: Review = {
    id: uuidv4(),
    title: data.title,
    description: data.description,
    diffText: data.diffText,
    baseBranch: data.baseBranch,
    headBranch: data.headBranch,
    analysis: null,
    createdAt: new Date().toISOString(),
  };
  reviews.set(review.id, review);
  return review;
}

export function setAnalysis(id: string, analysis: Analysis): Review | undefined {
  const review = reviews.get(id);
  if (!review) return undefined;
  review.analysis = analysis;
  return review;
}
