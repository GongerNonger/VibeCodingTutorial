import { v4 as uuidv4 } from "uuid";

export type Emotion = "curiosity" | "shock" | "excitement" | "fear" | "joy";

export interface ThumbnailSuggestion {
  id: string;
  primaryText: string;
  subtitleText: string | null;
  colorScheme: string;
  fontStyle: string;
  viralScore: number;
}

export interface ThumbnailProject {
  id: string;
  videoTitle: string;
  niche: string;
  targetEmotion: Emotion;
  suggestions: ThumbnailSuggestion[];
  createdAt: string;
}

// In-memory store
const projects: Map<string, ThumbnailProject> = new Map();

// Seed data
const seedId = "seed-project-001";
const seedProject: ThumbnailProject = {
  id: seedId,
  videoTitle: "10 JavaScript Tricks You Didn't Know",
  niche: "programming",
  targetEmotion: "curiosity",
  suggestions: [
    {
      id: uuidv4(),
      primaryText: "YOU MISSED THESE",
      subtitleText: "JS Secrets",
      colorScheme: "Yellow on dark purple (#FFD700 on #1a0533)",
      fontStyle: "Bold Impact / Bebas Neue",
      viralScore: 88,
    },
    {
      id: uuidv4(),
      primaryText: "STOP CODING WRONG",
      subtitleText: "10 JS Tricks",
      colorScheme: "White on red gradient (#FFFFFF on #DC2626)",
      fontStyle: "Extra Bold Sans-Serif / Montserrat Black",
      viralScore: 92,
    },
    {
      id: uuidv4(),
      primaryText: "HIDDEN JS POWERS",
      subtitleText: null,
      colorScheme: "Cyan on black (#00FFE0 on #000000)",
      fontStyle: "Futuristic / Orbitron Bold",
      viralScore: 75,
    },
    {
      id: uuidv4(),
      primaryText: "10X YOUR CODE",
      subtitleText: "Dev Secrets",
      colorScheme: "Orange on dark blue (#F97316 on #0F172A)",
      fontStyle: "Heavy Condensed / Oswald Bold",
      viralScore: 84,
    },
    {
      id: uuidv4(),
      primaryText: "JS TRICKS EXPOSED",
      subtitleText: "Must Watch",
      colorScheme: "White on green gradient (#FFFFFF on #16A34A)",
      fontStyle: "Rounded Bold / Nunito Black",
      viralScore: 79,
    },
  ],
  createdAt: new Date().toISOString(),
};

projects.set(seedId, seedProject);

// Store operations
export function getAllProjects(): ThumbnailProject[] {
  return Array.from(projects.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getProject(id: string): ThumbnailProject | undefined {
  return projects.get(id);
}

export function createProject(
  videoTitle: string,
  niche: string,
  targetEmotion: Emotion
): ThumbnailProject {
  const project: ThumbnailProject = {
    id: uuidv4(),
    videoTitle,
    niche,
    targetEmotion,
    suggestions: [],
    createdAt: new Date().toISOString(),
  };
  projects.set(project.id, project);
  return project;
}

// Mock AI generation
const emotionKeywords: Record<Emotion, string[]> = {
  curiosity: ["SECRET", "HIDDEN", "UNKNOWN", "MISSING", "BURIED", "REVEALED"],
  shock: ["INSANE", "SHOCKING", "EXPOSED", "UNREAL", "BROKE", "DESTROYED"],
  excitement: ["AMAZING", "INCREDIBLE", "EPIC", "ULTIMATE", "BEST", "GAME-CHANGER"],
  fear: ["DANGER", "WARNING", "AVOID THIS", "NIGHTMARE", "DEADLY", "SCARY"],
  joy: ["LOVE THIS", "PERFECT", "BEAUTIFUL", "HAPPY", "BLESSED", "WONDERFUL"],
};

const colorSchemes: Record<Emotion, string[]> = {
  curiosity: [
    "Yellow on dark purple (#FFD700 on #1a0533)",
    "Cyan on black (#00FFE0 on #000000)",
    "White on teal (#FFFFFF on #0D9488)",
    "Lime on navy (#84CC16 on #0A1128)",
    "Gold on charcoal (#F59E0B on #1F2937)",
  ],
  shock: [
    "White on red (#FFFFFF on #DC2626)",
    "Yellow on black (#FACC15 on #000000)",
    "Red on white (#EF4444 on #FFFFFF)",
    "Orange on dark red (#FB923C on #7F1D1D)",
    "White on crimson (#FFFFFF on #BE123C)",
  ],
  excitement: [
    "White on orange gradient (#FFFFFF on #EA580C)",
    "Yellow on blue (#FDE047 on #1D4ED8)",
    "White on magenta (#FFFFFF on #C026D3)",
    "Lime on purple (#A3E635 on #7C3AED)",
    "Gold on deep blue (#EAB308 on #1E3A5F)",
  ],
  fear: [
    "Red on black (#EF4444 on #000000)",
    "White on dark gray (#FFFFFF on #1F2937)",
    "Yellow on dark red (#FDE047 on #450A0A)",
    "Orange on black (#F97316 on #0A0A0A)",
    "Blood red on charcoal (#991B1B on #111827)",
  ],
  joy: [
    "White on pink (#FFFFFF on #EC4899)",
    "Yellow on sky blue (#FDE047 on #0EA5E9)",
    "White on green (#FFFFFF on #16A34A)",
    "Pink on purple (#F472B6 on #7C3AED)",
    "White on coral (#FFFFFF on #F97171)",
  ],
};

const fontStyles = [
  "Bold Impact / Bebas Neue",
  "Extra Bold Sans-Serif / Montserrat Black",
  "Heavy Condensed / Oswald Bold",
  "Rounded Bold / Nunito Black",
  "Futuristic / Orbitron Bold",
];

function generatePrimaryText(
  title: string,
  niche: string,
  emotion: Emotion
): string {
  const keywords = emotionKeywords[emotion];
  const keyword = keywords[Math.floor(Math.random() * keywords.length)];

  const nicheWords: Record<string, string[]> = {
    programming: ["CODE", "DEVS", "APPS", "BUGS", "STACK"],
    gaming: ["GAMERS", "PLAYS", "WINS", "CLUTCH", "GG"],
    cooking: ["RECIPE", "FLAVOR", "CHEFS", "TASTE", "COOK"],
    fitness: ["GAINS", "BODY", "REPS", "SHRED", "STRONG"],
    finance: ["MONEY", "RICH", "INVEST", "WEALTH", "CASH"],
    tech: ["TECH", "GADGET", "DEVICE", "HACK", "SMART"],
    travel: ["PLACES", "TRIP", "WORLD", "EXPLORE", "VISIT"],
    beauty: ["GLOW UP", "SKIN", "LOOK", "BEAUTY", "STYLE"],
    music: ["SOUNDS", "BEATS", "VIBES", "MUSIC", "TUNE"],
    education: ["LEARN THIS", "STUDY", "BRAIN", "SMART", "FACTS"],
  };

  const nicheWord =
    nicheWords[niche]?.[Math.floor(Math.random() * 5)] || "THIS";

  const templates = [
    `${keyword} ${nicheWord}`,
    `${nicheWord} ${keyword}`,
    `${keyword} FOR YOU`,
    `DON'T MISS ${keyword}`,
    `${keyword} ALERT`,
  ];

  const text = templates[Math.floor(Math.random() * templates.length)];
  // Ensure max 5 words
  return text.split(" ").slice(0, 5).join(" ");
}

function generateSubtitle(title: string): string | null {
  if (Math.random() < 0.2) return null; // 20% chance no subtitle

  const words = title.split(" ").filter((w) => w.length > 3);
  const picked = words.slice(0, Math.min(4, words.length));
  if (picked.length === 0) return null;

  const subtitles = [
    picked.slice(0, 3).join(" "),
    `Watch Now`,
    `Must See`,
    `Part 1`,
    `Full Guide`,
    `No Cap`,
  ];
  return subtitles[Math.floor(Math.random() * subtitles.length)];
}

export function generateSuggestions(projectId: string): ThumbnailSuggestion[] | null {
  const project = projects.get(projectId);
  if (!project) return null;

  const suggestions: ThumbnailSuggestion[] = [];
  const colors = colorSchemes[project.targetEmotion];

  for (let i = 0; i < 5; i++) {
    suggestions.push({
      id: uuidv4(),
      primaryText: generatePrimaryText(
        project.videoTitle,
        project.niche,
        project.targetEmotion
      ),
      subtitleText: generateSubtitle(project.videoTitle),
      colorScheme: colors[i % colors.length],
      fontStyle: fontStyles[i % fontStyles.length],
      viralScore: Math.floor(Math.random() * 35) + 65, // 65-99
    });
  }

  project.suggestions = suggestions;
  projects.set(projectId, project);
  return suggestions;
}
