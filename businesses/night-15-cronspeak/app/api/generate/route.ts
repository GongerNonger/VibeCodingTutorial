import { NextRequest, NextResponse } from "next/server";

interface FieldBreakdown {
  field: string;
  value: string;
  meaning: string;
}

interface GenerateResult {
  expression: string;
  explanation: string;
  nextRuns: string[];
  breakdown: FieldBreakdown[];
}

function parseCronFields(expression: string): FieldBreakdown[] {
  const parts = expression.split(" ");
  const fieldNames = ["Minute", "Hour", "Day of Month", "Month", "Day of Week"];
  const dayOfWeekNames: Record<string, string> = {
    "0": "Sunday", "1": "Monday", "2": "Tuesday", "3": "Wednesday",
    "4": "Thursday", "5": "Friday", "6": "Saturday", "7": "Sunday",
  };
  const monthNames: Record<string, string> = {
    "1": "January", "2": "February", "3": "March", "4": "April",
    "5": "May", "6": "June", "7": "July", "8": "August",
    "9": "September", "10": "October", "11": "November", "12": "December",
  };

  return parts.map((value, i) => {
    let meaning = "";
    const field = fieldNames[i];

    if (value === "*") {
      meaning = `Every ${field.toLowerCase()}`;
    } else if (value.startsWith("*/")) {
      const interval = value.slice(2);
      meaning = `Every ${interval} ${field.toLowerCase()}${parseInt(interval) > 1 ? "s" : ""}`;
    } else if (value.includes(",")) {
      const vals = value.split(",");
      if (i === 1) meaning = `At hours ${vals.join(" and ")}`;
      else if (i === 0) meaning = `At minutes ${vals.join(" and ")}`;
      else meaning = `At ${vals.join(" and ")}`;
    } else if (value.includes("-")) {
      const [start, end] = value.split("-");
      if (i === 1) meaning = `From hour ${start} through ${end}`;
      else if (i === 4) meaning = `From ${dayOfWeekNames[start] || start} through ${dayOfWeekNames[end] || end}`;
      else meaning = `From ${start} through ${end}`;
    } else {
      if (i === 0) meaning = `At minute ${value}`;
      else if (i === 1) meaning = `At hour ${value} (${parseInt(value) > 12 ? `${parseInt(value) - 12}PM` : parseInt(value) === 0 ? "12AM" : `${value}AM`})`;
      else if (i === 2) meaning = `On day ${value} of the month`;
      else if (i === 3) meaning = monthNames[value] || `Month ${value}`;
      else if (i === 4) meaning = dayOfWeekNames[value] || `Day ${value}`;
    }

    return { field, value, meaning };
  });
}

function calculateNextRuns(expression: string, count: number = 5): string[] {
  const parts = expression.split(" ");
  const [minPart, hourPart, domPart, monPart, dowPart] = parts;
  const runs: Date[] = [];
  const now = new Date();
  const cursor = new Date(now.getTime());
  cursor.setSeconds(0);
  cursor.setMilliseconds(0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  const maxIterations = 525600; // one year of minutes

  for (let i = 0; i < maxIterations && runs.length < count; i++) {
    if (matchesCron(cursor, minPart, hourPart, domPart, monPart, dowPart)) {
      runs.push(new Date(cursor.getTime()));
    }
    cursor.setMinutes(cursor.getMinutes() + 1);
  }

  return runs.map((d) => d.toISOString());
}

function matchesCron(
  date: Date,
  minPart: string,
  hourPart: string,
  domPart: string,
  monPart: string,
  dowPart: string
): boolean {
  return (
    matchesField(date.getMinutes(), minPart) &&
    matchesField(date.getHours(), hourPart) &&
    matchesField(date.getDate(), domPart) &&
    matchesField(date.getMonth() + 1, monPart) &&
    matchesField(date.getDay(), dowPart)
  );
}

function matchesField(value: number, pattern: string): boolean {
  if (pattern === "*") return true;

  // Handle comma-separated values
  if (pattern.includes(",")) {
    return pattern.split(",").some((p) => matchesField(value, p.trim()));
  }

  // Handle step values like */5 or 1-5/2
  if (pattern.includes("/")) {
    const [rangePart, stepStr] = pattern.split("/");
    const step = parseInt(stepStr);
    if (rangePart === "*") {
      return value % step === 0;
    }
    if (rangePart.includes("-")) {
      const [start, end] = rangePart.split("-").map(Number);
      return value >= start && value <= end && (value - start) % step === 0;
    }
    return false;
  }

  // Handle ranges like 1-5
  if (pattern.includes("-")) {
    const [start, end] = pattern.split("-").map(Number);
    return value >= start && value <= end;
  }

  // Handle exact value
  return value === parseInt(pattern);
}

function naturalLanguageToCron(input: string): GenerateResult | null {
  const text = input.toLowerCase().trim();

  let expression = "";
  let explanation = "";

  // "every minute"
  if (/every\s+minute/.test(text)) {
    expression = "* * * * *";
    explanation = "Runs every minute, every hour, every day";
  }
  // "every X minutes"
  else if (/every\s+(\d+)\s+minutes?/.test(text)) {
    const m = text.match(/every\s+(\d+)\s+minutes?/);
    const mins = m![1];
    expression = `*/${mins} * * * *`;
    explanation = `Runs every ${mins} minutes`;
  }
  // "every X hours"
  else if (/every\s+(\d+)\s+hours?/.test(text)) {
    const m = text.match(/every\s+(\d+)\s+hours?/);
    const hrs = m![1];
    expression = `0 */${hrs} * * *`;
    explanation = `Runs every ${hrs} hours at minute 0`;
  }
  // "every 15 minutes during business hours"
  else if (/every\s+(\d+)\s+minutes?\s+during\s+business\s+hours/.test(text)) {
    const m = text.match(/every\s+(\d+)\s+minutes?\s+during\s+business\s+hours/);
    const mins = m![1];
    expression = `*/${mins} 9-17 * * 1-5`;
    explanation = `Runs every ${mins} minutes between 9AM-5PM on weekdays`;
  }
  // "twice a day at X and Y"
  else if (/twice\s+a\s+day\s+at\s+(\d+)\s*(?:am|pm)?\s+and\s+(\d+)\s*(am|pm)?/i.test(text)) {
    const m = text.match(/twice\s+a\s+day\s+at\s+(\d+)\s*(am|pm)?\s+and\s+(\d+)\s*(am|pm)?/i);
    let h1 = parseInt(m![1]);
    const p1 = (m![2] || "").toLowerCase();
    let h2 = parseInt(m![3]);
    const p2 = (m![4] || "").toLowerCase();
    if (p1 === "pm" && h1 < 12) h1 += 12;
    if (p1 === "am" && h1 === 12) h1 = 0;
    if (p2 === "pm" && h2 < 12) h2 += 12;
    if (p2 === "am" && h2 === 12) h2 = 0;
    expression = `0 ${h1},${h2} * * *`;
    explanation = `Runs twice a day at ${formatHour(h1)} and ${formatHour(h2)}`;
  }
  // "every weekday at X"
  else if (/every\s+weekday\s+at\s+(\d+)\s*(am|pm)?/i.test(text)) {
    const m = text.match(/every\s+weekday\s+at\s+(\d+)\s*(am|pm)?/i);
    let hr = parseInt(m![1]);
    const period = (m![2] || "").toLowerCase();
    if (period === "pm" && hr < 12) hr += 12;
    if (period === "am" && hr === 12) hr = 0;
    expression = `0 ${hr} * * 1-5`;
    explanation = `Runs at ${formatHour(hr)} every weekday (Monday-Friday)`;
  }
  // "every monday/tuesday/etc at X"
  else if (/every\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s+at\s+(\d+)\s*(am|pm)?/i.test(text)) {
    const m = text.match(/every\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s+at\s+(\d+)\s*(am|pm)?/i);
    const dayMap: Record<string, number> = {
      sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
      thursday: 4, friday: 5, saturday: 6,
    };
    const dayNum = dayMap[m![1].toLowerCase()];
    let hr = parseInt(m![2]);
    const period = (m![3] || "").toLowerCase();
    if (period === "pm" && hr < 12) hr += 12;
    if (period === "am" && hr === 12) hr = 0;
    expression = `0 ${hr} * * ${dayNum}`;
    explanation = `Runs at ${formatHour(hr)} every ${m![1].charAt(0).toUpperCase() + m![1].slice(1)}`;
  }
  // "daily at X" or "every day at X"
  else if (/(?:daily|every\s+day)\s+at\s+(\d+)\s*(am|pm)?/i.test(text)) {
    const m = text.match(/(?:daily|every\s+day)\s+at\s+(\d+)\s*(am|pm)?/i);
    let hr = parseInt(m![1]);
    const period = (m![2] || "").toLowerCase();
    if (period === "pm" && hr < 12) hr += 12;
    if (period === "am" && hr === 12) hr = 0;
    expression = `0 ${hr} * * *`;
    explanation = `Runs at ${formatHour(hr)} every day`;
  }
  // "first day of month" or "first day of every month"
  else if (/first\s+day\s+of\s+(every\s+)?month/.test(text)) {
    expression = "0 0 1 * *";
    explanation = "Runs at midnight on the 1st of every month";
  }
  // "weekly on sunday at midnight"
  else if (/weekly\s+on\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s+at\s+midnight/i.test(text)) {
    const m = text.match(/weekly\s+on\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s+at\s+midnight/i);
    const dayMap: Record<string, number> = {
      sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
      thursday: 4, friday: 5, saturday: 6,
    };
    const dayNum = dayMap[m![1].toLowerCase()];
    expression = `0 0 * * ${dayNum}`;
    explanation = `Runs at midnight every ${m![1].charAt(0).toUpperCase() + m![1].slice(1)}`;
  }
  // "hourly"
  else if (/^hourly$/.test(text)) {
    expression = "0 * * * *";
    explanation = "Runs at minute 0 of every hour";
  }
  // "at midnight"
  else if (/at\s+midnight/.test(text)) {
    expression = "0 0 * * *";
    explanation = "Runs at midnight (00:00) every day";
  }
  else {
    return null;
  }

  return {
    expression,
    explanation,
    nextRuns: calculateNextRuns(expression),
    breakdown: parseCronFields(expression),
  };
}

function formatHour(h: number): string {
  if (h === 0) return "12:00 AM";
  if (h < 12) return `${h}:00 AM`;
  if (h === 12) return "12:00 PM";
  return `${h - 12}:00 PM`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description } = body;

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "description is required" },
        { status: 400 }
      );
    }

    const result = naturalLanguageToCron(description);

    if (!result) {
      return NextResponse.json(
        {
          error: "Could not parse that schedule description. Try phrases like: 'every 5 minutes', 'daily at 9am', 'every Monday at 3pm', 'first day of month'",
        },
        { status: 400 }
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
