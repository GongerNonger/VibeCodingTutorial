import { RFPSection } from "./types";

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function classifySection(title: string, content: string): RFPSection["type"] {
  const lower = (title + " " + content).toLowerCase();
  if (lower.includes("?") || lower.includes("describe") || lower.includes("explain") || lower.includes("provide details")) {
    return "question";
  }
  if (lower.includes("must") || lower.includes("shall") || lower.includes("required") || lower.includes("requirement")) {
    return "requirement";
  }
  if (lower.includes("criteria") || lower.includes("evaluation") || lower.includes("scoring") || lower.includes("weighted")) {
    return "criteria";
  }
  return "general";
}

export function analyzeRFP(text: string): RFPSection[] {
  const sections: RFPSection[] = [];
  if (!text || !text.trim()) return sections;

  // Strategy 1: Numbered sections like "1." "2." "1)" "2)" "Section 1:"
  const numberedPattern = /(?:^|\n)\s*(?:(?:section\s+)?\d+[\.\):]?\s+|[A-Z][\.\)]\s+)(.*?)(?=\n\s*(?:(?:section\s+)?\d+[\.\):]?\s+|[A-Z][\.\)]\s+)|\s*$)/gis;
  const numberedMatches = text.match(numberedPattern);

  if (numberedMatches && numberedMatches.length >= 2) {
    for (const match of numberedMatches) {
      const trimmed = match.trim();
      if (!trimmed) continue;
      const firstLine = trimmed.split("\n")[0].replace(/^(?:(?:section\s+)?\d+[\.\):]?\s+|[A-Z][\.\)]\s+)/i, "").trim();
      const rest = trimmed.split("\n").slice(1).join("\n").trim();
      const title = firstLine || "Untitled Section";
      const content = rest || firstLine;
      sections.push({
        id: generateId(),
        title,
        content,
        type: classifySection(title, content),
      });
    }
    return sections;
  }

  // Strategy 2: Header-based splitting (lines ending with colon, all-caps lines, bold markers)
  const lines = text.split("\n");
  let currentTitle = "";
  let currentContent: string[] = [];

  const isHeader = (line: string): boolean => {
    const t = line.trim();
    if (!t) return false;
    if (t.endsWith(":") && t.length < 100) return true;
    if (t === t.toUpperCase() && t.length > 3 && t.length < 100 && /[A-Z]/.test(t)) return true;
    if (/^\*\*.*\*\*$/.test(t)) return true;
    if (/^#{1,4}\s+/.test(t)) return true;
    return false;
  };

  for (const line of lines) {
    if (isHeader(line)) {
      if (currentTitle && currentContent.length > 0) {
        const content = currentContent.join("\n").trim();
        sections.push({
          id: generateId(),
          title: currentTitle,
          content,
          type: classifySection(currentTitle, content),
        });
      }
      currentTitle = line.trim().replace(/[:*#]+$/g, "").replace(/^[#*]+\s*/, "").trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  if (currentTitle && currentContent.length > 0) {
    const content = currentContent.join("\n").trim();
    sections.push({
      id: generateId(),
      title: currentTitle,
      content,
      type: classifySection(currentTitle, content),
    });
  }

  // Strategy 3: If nothing matched, split by double newlines
  if (sections.length === 0) {
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim());
    for (let i = 0; i < paragraphs.length; i++) {
      const para = paragraphs[i].trim();
      const firstSentence = para.split(/[.!?]/)[0].trim();
      sections.push({
        id: generateId(),
        title: firstSentence.length < 80 ? firstSentence : `Section ${i + 1}`,
        content: para,
        type: classifySection(firstSentence, para),
      });
    }
  }

  return sections;
}
