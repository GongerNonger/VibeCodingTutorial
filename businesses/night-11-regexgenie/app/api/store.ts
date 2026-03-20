export interface SavedPattern {
  id: string;
  description: string;
  regex: string;
  flags: string;
  testStrings: string[];
  createdAt: string;
}

let nextId = 7;

function generateId(): string {
  return String(nextId++);
}

const patterns: Map<string, SavedPattern> = new Map();

// Pre-seed with 6 common patterns
const seeds: Omit<SavedPattern, "id" | "createdAt">[] = [
  {
    description: "Email address",
    regex: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    flags: "i",
    testStrings: ["user@example.com", "test.email+tag@domain.co.uk", "not-an-email", "@missing.com"],
  },
  {
    description: "URL",
    regex: "^https?:\\/\\/(?:www\\.)?[a-zA-Z0-9-]+(?:\\.[a-zA-Z]{2,})+(?:\\/[^\\s]*)?$",
    flags: "",
    testStrings: ["https://example.com", "http://www.test.org/path", "ftp://invalid", "not a url"],
  },
  {
    description: "Phone number (US)",
    regex: "^(?:\\+1[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$",
    flags: "",
    testStrings: ["(555) 123-4567", "+1-555-123-4567", "5551234567", "123"],
  },
  {
    description: "IP address (IPv4)",
    regex: "^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$",
    flags: "",
    testStrings: ["192.168.1.1", "255.255.255.0", "10.0.0.1", "999.999.999.999"],
  },
  {
    description: "Date (YYYY-MM-DD)",
    regex: "^\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])$",
    flags: "",
    testStrings: ["2024-01-15", "2023-12-31", "2024-13-01", "not-a-date"],
  },
  {
    description: "Hex color",
    regex: "^#(?:[0-9a-fA-F]{3}){1,2}$",
    flags: "",
    testStrings: ["#fff", "#FF5733", "#123abc", "#xyz", "FF5733"],
  },
];

seeds.forEach((seed, i) => {
  const id = String(i + 1);
  patterns.set(id, {
    ...seed,
    id,
    createdAt: new Date().toISOString(),
  });
});

export function getAllPatterns(): SavedPattern[] {
  return Array.from(patterns.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getPattern(id: string): SavedPattern | undefined {
  return patterns.get(id);
}

export function savePattern(data: Omit<SavedPattern, "id" | "createdAt">): SavedPattern {
  const id = generateId();
  const pattern: SavedPattern = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
  };
  patterns.set(id, pattern);
  return pattern;
}
