export interface Persona {
  id: string;
  name: string;
  description: string;
  style: string;
}

export interface CommitRequest {
  id: string;
  diff: string;
  persona: string | null;
  generatedMessages: GeneratedMessage[];
  createdAt: string;
}

export interface GeneratedMessage {
  personaId: string;
  personaName: string;
  message: string;
}

export const personas: Persona[] = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean conventional commits following best practices",
    style: "conventional",
  },
  {
    id: "pirate",
    name: "Pirate",
    description: "Arr matey! Swashbuckling commit messages",
    style: "pirate",
  },
  {
    id: "shakespeare",
    name: "Shakespeare",
    description: "Ye olde English commit prose",
    style: "shakespeare",
  },
  {
    id: "emoji-master",
    name: "Emoji Master",
    description: "Heavy emoji usage for expressive commits",
    style: "emoji",
  },
  {
    id: "haiku",
    name: "Haiku",
    description: "Commit messages in actual haiku format (5-7-5)",
    style: "haiku",
  },
  {
    id: "senior-dev",
    name: "Senior Dev",
    description: "Dry humor, concise, seen-it-all attitude",
    style: "senior",
  },
];

export const commitHistory: CommitRequest[] = [];

let nextId = 1;

export function generateId(): string {
  return `cr_${nextId++}`;
}
