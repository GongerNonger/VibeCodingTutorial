export interface CronEntry {
  id: string;
  expression: string;
  description: string;
  label: string;
  createdAt: string;
}

let nextId = 6;

const store: CronEntry[] = [
  {
    id: "1",
    expression: "* * * * *",
    description: "Runs every single minute",
    label: "Every Minute",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    expression: "0 * * * *",
    description: "Runs at the start of every hour",
    label: "Every Hour",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    expression: "0 0 * * *",
    description: "Runs at midnight every day",
    label: "Daily at Midnight",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    expression: "0 9 * * 1",
    description: "Runs every Monday at 9:00 AM",
    label: "Weekly Monday 9am",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    expression: "0 0 1 * *",
    description: "Runs at midnight on the first day of every month",
    label: "Monthly First Day",
    createdAt: new Date().toISOString(),
  },
];

export function getAllCrons(): CronEntry[] {
  return [...store];
}

export function getCronById(id: string): CronEntry | undefined {
  return store.find((c) => c.id === id);
}

export function addCron(entry: Omit<CronEntry, "id" | "createdAt">): CronEntry {
  const newEntry: CronEntry = {
    ...entry,
    id: String(nextId++),
    createdAt: new Date().toISOString(),
  };
  store.push(newEntry);
  return newEntry;
}
