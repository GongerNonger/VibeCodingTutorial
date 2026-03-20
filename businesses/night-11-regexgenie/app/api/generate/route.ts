import { NextRequest, NextResponse } from "next/server";

interface RegexPart {
  part: string;
  explanation: string;
}

interface GenerateResult {
  regex: string;
  flags: string;
  explanation: RegexPart[];
  exampleMatches: string[];
  exampleNonMatches: string[];
}

interface PatternDef {
  regex: string;
  flags: string;
  explanation: RegexPart[];
  exampleMatches: string[];
  exampleNonMatches: string[];
}

const knownPatterns: Record<string, PatternDef> = {
  email: {
    regex: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    flags: "i",
    explanation: [
      { part: "^", explanation: "Start of string" },
      { part: "[a-zA-Z0-9._%+-]+", explanation: "One or more valid username characters (letters, digits, dots, underscores, percent, plus, hyphen)" },
      { part: "@", explanation: "Literal @ symbol separating username from domain" },
      { part: "[a-zA-Z0-9.-]+", explanation: "One or more valid domain characters" },
      { part: "\\.", explanation: "Literal dot before top-level domain" },
      { part: "[a-zA-Z]{2,}", explanation: "Top-level domain with at least 2 letters" },
      { part: "$", explanation: "End of string" },
    ],
    exampleMatches: ["user@example.com", "test.email+tag@domain.co.uk", "admin@site.org"],
    exampleNonMatches: ["not-an-email", "@missing.com", "user@", "user@.com"],
  },
  phone: {
    regex: "^(?:\\+1[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$",
    flags: "",
    explanation: [
      { part: "^", explanation: "Start of string" },
      { part: "(?:\\+1[-.\\s]?)?", explanation: "Optional country code +1 with optional separator" },
      { part: "\\(?", explanation: "Optional opening parenthesis" },
      { part: "\\d{3}", explanation: "Three-digit area code" },
      { part: "\\)?", explanation: "Optional closing parenthesis" },
      { part: "[-.\\s]?", explanation: "Optional separator (dash, dot, or space)" },
      { part: "\\d{3}", explanation: "Three-digit exchange code" },
      { part: "[-.\\s]?", explanation: "Optional separator" },
      { part: "\\d{4}", explanation: "Four-digit subscriber number" },
      { part: "$", explanation: "End of string" },
    ],
    exampleMatches: ["(555) 123-4567", "+1-555-123-4567", "5551234567", "555.123.4567"],
    exampleNonMatches: ["123", "abcdefghij", "555-12-4567", "+2-555-123-4567"],
  },
  url: {
    regex: "^https?:\\/\\/(?:www\\.)?[a-zA-Z0-9-]+(?:\\.[a-zA-Z]{2,})+(?:\\/[^\\s]*)?$",
    flags: "",
    explanation: [
      { part: "^", explanation: "Start of string" },
      { part: "https?", explanation: "Protocol: http or https" },
      { part: ":\\/\\/", explanation: "Literal ://" },
      { part: "(?:www\\.)?", explanation: "Optional www. prefix" },
      { part: "[a-zA-Z0-9-]+", explanation: "Domain name (letters, digits, hyphens)" },
      { part: "(?:\\.[a-zA-Z]{2,})+", explanation: "One or more domain extensions (.com, .co.uk, etc.)" },
      { part: "(?:\\/[^\\s]*)?", explanation: "Optional path after domain" },
      { part: "$", explanation: "End of string" },
    ],
    exampleMatches: ["https://example.com", "http://www.test.org/path/page", "https://sub.domain.co.uk"],
    exampleNonMatches: ["ftp://invalid.com", "not a url", "www.missing-protocol.com", "://no-protocol.com"],
  },
  ip: {
    regex: "^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$",
    flags: "",
    explanation: [
      { part: "^", explanation: "Start of string" },
      { part: "(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)", explanation: "Octet: matches 0-255" },
      { part: "\\.", explanation: "Literal dot separator" },
      { part: "{3}", explanation: "Repeat octet + dot three times" },
      { part: "(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)", explanation: "Final octet (0-255)" },
      { part: "$", explanation: "End of string" },
    ],
    exampleMatches: ["192.168.1.1", "10.0.0.1", "255.255.255.0", "0.0.0.0"],
    exampleNonMatches: ["999.999.999.999", "256.1.1.1", "1.2.3", "abc.def.ghi.jkl"],
  },
  date: {
    regex: "^\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])$",
    flags: "",
    explanation: [
      { part: "^", explanation: "Start of string" },
      { part: "\\d{4}", explanation: "Four-digit year" },
      { part: "-", explanation: "Literal dash separator" },
      { part: "(?:0[1-9]|1[0-2])", explanation: "Month: 01-12" },
      { part: "-", explanation: "Literal dash separator" },
      { part: "(?:0[1-9]|[12]\\d|3[01])", explanation: "Day: 01-31" },
      { part: "$", explanation: "End of string" },
    ],
    exampleMatches: ["2024-01-15", "2023-12-31", "1999-06-05"],
    exampleNonMatches: ["2024-13-01", "2024-00-15", "24-01-15", "not-a-date"],
  },
  "credit card": {
    regex: "^(?:4\\d{12}(?:\\d{3})?|5[1-5]\\d{14}|3[47]\\d{13}|6(?:011|5\\d{2})\\d{12})$",
    flags: "",
    explanation: [
      { part: "^", explanation: "Start of string" },
      { part: "4\\d{12}(?:\\d{3})?", explanation: "Visa: starts with 4, 13 or 16 digits" },
      { part: "|", explanation: "Or" },
      { part: "5[1-5]\\d{14}", explanation: "Mastercard: starts with 51-55, 16 digits" },
      { part: "|", explanation: "Or" },
      { part: "3[47]\\d{13}", explanation: "Amex: starts with 34 or 37, 15 digits" },
      { part: "|", explanation: "Or" },
      { part: "6(?:011|5\\d{2})\\d{12}", explanation: "Discover: starts with 6011 or 65, 16 digits" },
      { part: "$", explanation: "End of string" },
    ],
    exampleMatches: ["4111111111111111", "5500000000000004", "340000000000009", "6011000000000004"],
    exampleNonMatches: ["1234567890", "abcdefghijklmnop", "0000000000000000", "411111111111"],
  },
  "hex color": {
    regex: "^#(?:[0-9a-fA-F]{3}){1,2}$",
    flags: "",
    explanation: [
      { part: "^", explanation: "Start of string" },
      { part: "#", explanation: "Literal hash symbol" },
      { part: "[0-9a-fA-F]{3}", explanation: "Three hex digits" },
      { part: "{1,2}", explanation: "Group appears once (3-digit) or twice (6-digit)" },
      { part: "$", explanation: "End of string" },
    ],
    exampleMatches: ["#fff", "#FF5733", "#123abc", "#000"],
    exampleNonMatches: ["#xyz", "FF5733", "#12", "#1234567"],
  },
  "strong password": {
    regex: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
    flags: "",
    explanation: [
      { part: "^", explanation: "Start of string" },
      { part: "(?=.*[a-z])", explanation: "Lookahead: must contain at least one lowercase letter" },
      { part: "(?=.*[A-Z])", explanation: "Lookahead: must contain at least one uppercase letter" },
      { part: "(?=.*\\d)", explanation: "Lookahead: must contain at least one digit" },
      { part: "(?=.*[@$!%*?&])", explanation: "Lookahead: must contain at least one special character" },
      { part: "[A-Za-z\\d@$!%*?&]{8,}", explanation: "At least 8 characters from allowed set" },
      { part: "$", explanation: "End of string" },
    ],
    exampleMatches: ["P@ssw0rd!", "Str0ng!Pass", "MyP@ss12"],
    exampleNonMatches: ["password", "12345678", "Short1!", "nouppercase1!"],
  },
};

const keywordMap: Record<string, string> = {
  email: "email",
  "e-mail": "email",
  "mail address": "email",
  phone: "phone",
  "phone number": "phone",
  telephone: "phone",
  mobile: "phone",
  url: "url",
  link: "url",
  website: "url",
  "web address": "url",
  ip: "ip",
  "ip address": "ip",
  ipv4: "ip",
  date: "date",
  "credit card": "credit card",
  "card number": "credit card",
  "credit card number": "credit card",
  hex: "hex color",
  "hex color": "hex color",
  "hex colour": "hex color",
  color: "hex color",
  colour: "hex color",
  "color code": "hex color",
  password: "strong password",
  "strong password": "strong password",
};

function matchDescription(description: string): GenerateResult | null {
  const lower = description.toLowerCase().trim();

  // Direct keyword lookup
  for (const [keyword, patternKey] of Object.entries(keywordMap)) {
    if (lower.includes(keyword)) {
      const pattern = knownPatterns[patternKey];
      if (pattern) return pattern;
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description } = body;

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    const result = matchDescription(description);

    if (!result) {
      return NextResponse.json(
        {
          error: "Could not generate a regex for that description. Try: email, phone number, URL, IP address, date, credit card, hex color, or strong password.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
