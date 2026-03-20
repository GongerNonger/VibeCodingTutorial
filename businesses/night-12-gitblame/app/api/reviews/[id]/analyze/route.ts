import { NextRequest, NextResponse } from "next/server";
import { getReview, setAnalysis, Analysis, FocusArea } from "../../../store";

function parseDiffStats(diff: string): {
  filesChanged: number;
  additions: number;
  deletions: number;
  fileNames: string[];
} {
  const lines = diff.split("\n");
  const fileNames: string[] = [];
  let additions = 0;
  let deletions = 0;

  for (const line of lines) {
    const fileMatch = line.match(/^diff --git a\/(.+?) b\//);
    if (fileMatch) {
      fileNames.push(fileMatch[1]);
    }
    if (line.startsWith("+") && !line.startsWith("+++")) {
      additions++;
    }
    if (line.startsWith("-") && !line.startsWith("---")) {
      deletions++;
    }
  }

  return {
    filesChanged: fileNames.length,
    additions,
    deletions,
    fileNames,
  };
}

function generateConcerns(
  fileName: string,
  diff: string
): { concern: string; priority: "high" | "medium" | "low" } | null {
  const lower = diff.toLowerCase();
  const fileLower = fileName.toLowerCase();

  // Security concerns
  if (
    lower.includes("secret") ||
    lower.includes("password") ||
    lower.includes("api_key") ||
    lower.includes("token")
  ) {
    if (
      fileLower.includes("auth") ||
      fileLower.includes("security") ||
      fileLower.includes("middleware")
    ) {
      return {
        concern: "Security-sensitive file modified - review for credential exposure and access control",
        priority: "high",
      };
    }
    return {
      concern: "Contains references to secrets or credentials - verify no sensitive data is hardcoded",
      priority: "high",
    };
  }

  // Database concerns
  if (fileLower.includes("schema") || fileLower.includes("migration") || fileLower.endsWith(".sql")) {
    return {
      concern: "Database schema change - verify migrations and backward compatibility",
      priority: "high",
    };
  }

  // Config concerns
  if (fileLower.includes("config") || fileLower.includes(".env") || fileLower.includes("setting")) {
    return {
      concern: "Configuration file modified - ensure environment-specific values are handled correctly",
      priority: "medium",
    };
  }

  // Test files
  if (fileLower.includes("test") || fileLower.includes("spec")) {
    return {
      concern: "Test file modified - verify test coverage remains adequate",
      priority: "low",
    };
  }

  // Large files
  const fileLines = diff.split("\n").filter(
    (l) =>
      (l.startsWith("+") && !l.startsWith("+++")) ||
      (l.startsWith("-") && !l.startsWith("---"))
  );
  if (fileLines.length > 50) {
    return {
      concern: "Large number of changes - consider breaking into smaller, focused commits",
      priority: "medium",
    };
  }

  // Generic
  return {
    concern: "Review for code quality, naming conventions, and error handling",
    priority: "low",
  };
}

function generateSuggestions(diff: string, fileNames: string[]): string[] {
  const suggestions: string[] = [];
  const lower = diff.toLowerCase();

  if (lower.includes("todo") || lower.includes("fixme") || lower.includes("hack")) {
    suggestions.push("Address TODO/FIXME comments before merging or create follow-up tickets");
  }

  if (lower.includes("console.log") || lower.includes("console.debug")) {
    suggestions.push("Remove or replace console.log statements with a proper logging library");
  }

  if (!fileNames.some((f) => f.includes("test") || f.includes("spec"))) {
    suggestions.push("Add unit tests for the new code to maintain test coverage");
  }

  if (lower.includes("any") && (lower.includes("typescript") || fileNames.some((f) => f.endsWith(".ts")))) {
    suggestions.push("Replace 'any' types with proper TypeScript type definitions");
  }

  if (lower.includes("catch") && (lower.includes("// ") || lower.includes("{}") )) {
    suggestions.push("Ensure error handling includes proper logging and user-friendly error messages");
  }

  if (fileNames.length > 5) {
    suggestions.push("Consider splitting this PR into smaller, more focused pull requests for easier review");
  }

  // Always add some general suggestions
  if (suggestions.length === 0) {
    suggestions.push("Consider adding inline documentation for complex logic");
  }
  suggestions.push("Verify the changes work correctly in all target environments");

  return suggestions;
}

function generateSummary(
  title: string,
  description: string,
  stats: { filesChanged: number; additions: number; deletions: number },
  riskLevel: string
): string {
  const scope = stats.filesChanged === 1 ? "a single file" : `${stats.filesChanged} files`;
  const changeSize =
    stats.additions + stats.deletions > 100
      ? "substantial"
      : stats.additions + stats.deletions > 30
        ? "moderate"
        : "minor";

  return `This PR "${title}" introduces ${changeSize} changes across ${scope} with ${stats.additions} additions and ${stats.deletions} deletions. ${description ? description.split(".")[0] + "." : ""} Risk level is assessed as ${riskLevel} based on the scope and nature of changes.`;
}

function assessRiskLevel(
  diff: string,
  stats: { filesChanged: number; additions: number; deletions: number },
  fileNames: string[]
): "low" | "medium" | "high" {
  const lower = diff.toLowerCase();

  // High risk indicators
  if (
    lower.includes("secret") ||
    lower.includes("password") ||
    lower.includes("api_key") ||
    lower.includes("delete") ||
    lower.includes("drop table") ||
    fileNames.some((f) => f.includes("auth") || f.includes("security") || f.includes("payment"))
  ) {
    return "high";
  }

  // Medium risk indicators
  if (
    stats.filesChanged > 5 ||
    stats.additions + stats.deletions > 100 ||
    fileNames.some((f) => f.includes("config") || f.includes("migration") || f.endsWith(".sql"))
  ) {
    return "medium";
  }

  return "low";
}

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const review = getReview(params.id);
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  const { filesChanged, additions, deletions, fileNames } = parseDiffStats(review.diffText);
  const riskLevel = assessRiskLevel(review.diffText, { filesChanged, additions, deletions }, fileNames);

  const focusAreas: FocusArea[] = fileNames
    .map((fileName) => {
      const concern = generateConcerns(fileName, review.diffText);
      if (!concern) return null;
      return { file: fileName, ...concern };
    })
    .filter(Boolean) as FocusArea[];

  const suggestions = generateSuggestions(review.diffText, fileNames);
  const summary = generateSummary(review.title, review.description, { filesChanged, additions, deletions }, riskLevel);

  const analysis: Analysis = {
    summary,
    riskLevel,
    focusAreas,
    suggestions,
    stats: { filesChanged, additions, deletions },
    analyzedAt: new Date().toISOString(),
  };

  const updated = setAnalysis(params.id, analysis);
  return NextResponse.json(updated);
}
