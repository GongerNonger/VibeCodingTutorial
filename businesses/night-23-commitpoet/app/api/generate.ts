import { personas, type Persona, type GeneratedMessage } from "./store";

export interface DiffAnalysis {
  filesChanged: string[];
  linesAdded: number;
  linesRemoved: number;
  changeTypes: ChangeType[];
  languages: string[];
  detectedChanges: string[];
}

export type ChangeType = "new_file" | "modification" | "deletion" | "rename";

const EXTENSION_MAP: Record<string, string> = {
  ts: "TypeScript",
  tsx: "TypeScript/React",
  js: "JavaScript",
  jsx: "JavaScript/React",
  py: "Python",
  rb: "Ruby",
  go: "Go",
  rs: "Rust",
  java: "Java",
  css: "CSS",
  scss: "SCSS",
  html: "HTML",
  json: "JSON",
  yaml: "YAML",
  yml: "YAML",
  md: "Markdown",
  sql: "SQL",
  sh: "Shell",
  dockerfile: "Docker",
  toml: "TOML",
  xml: "XML",
};

export function parseDiff(diff: string): DiffAnalysis {
  const lines = diff.split("\n");
  const filesChanged: string[] = [];
  const changeTypes = new Set<ChangeType>();
  const languages = new Set<string>();
  const detectedChanges: string[] = [];
  let linesAdded = 0;
  let linesRemoved = 0;

  for (const line of lines) {
    // Detect file paths from diff headers
    const diffMatch = line.match(/^diff --git a\/(.+?) b\/(.+)/);
    if (diffMatch) {
      const filePath = diffMatch[2];
      if (!filesChanged.includes(filePath)) {
        filesChanged.push(filePath);
      }
      const ext = filePath.split(".").pop()?.toLowerCase() || "";
      const lang = EXTENSION_MAP[ext];
      if (lang) languages.add(lang);
      continue;
    }

    // Detect new files
    if (line.startsWith("new file mode")) {
      changeTypes.add("new_file");
      continue;
    }

    // Detect deletions
    if (line.startsWith("deleted file mode")) {
      changeTypes.add("deletion");
      continue;
    }

    // Detect renames
    if (line.startsWith("rename from") || line.startsWith("similarity index")) {
      changeTypes.add("rename");
      continue;
    }

    // Count added/removed lines
    if (line.startsWith("+") && !line.startsWith("+++")) {
      linesAdded++;
      const content = line.substring(1).trim();
      // Detect function definitions
      const funcMatch = content.match(
        /(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\(|def\s+(\w+)|fn\s+(\w+)|func\s+(\w+))/
      );
      if (funcMatch) {
        const name = funcMatch[1] || funcMatch[2] || funcMatch[3] || funcMatch[4] || funcMatch[5];
        if (!detectedChanges.includes(`function:${name}`)) {
          detectedChanges.push(`function:${name}`);
        }
      }
      // Detect imports
      if (content.match(/^import\s|^from\s|^require\(/)) {
        if (!detectedChanges.includes("imports")) {
          detectedChanges.push("imports");
        }
      }
      // Detect test patterns
      if (content.match(/(?:describe|it|test|expect)\s*\(/)) {
        if (!detectedChanges.includes("tests")) {
          detectedChanges.push("tests");
        }
      }
      // Detect config patterns
      if (content.match(/(?:config|settings|env|\.env)/i)) {
        if (!detectedChanges.includes("config")) {
          detectedChanges.push("config");
        }
      }
      continue;
    }

    if (line.startsWith("-") && !line.startsWith("---")) {
      linesRemoved++;
      continue;
    }
  }

  // If no diff headers found, try to infer from +/- lines
  if (filesChanged.length === 0 && (linesAdded > 0 || linesRemoved > 0)) {
    filesChanged.push("unknown file");
    changeTypes.add("modification");
  }

  // Default to modification if no specific type detected
  if (changeTypes.size === 0 && filesChanged.length > 0) {
    changeTypes.add("modification");
  }

  return {
    filesChanged,
    linesAdded,
    linesRemoved,
    changeTypes: Array.from(changeTypes),
    languages: Array.from(languages),
    detectedChanges,
  };
}

function inferChangeCategory(analysis: DiffAnalysis): string {
  const { detectedChanges, filesChanged, changeTypes } = analysis;

  if (detectedChanges.includes("tests")) return "test";
  if (filesChanged.some((f) => /readme|docs?|\.md$/i.test(f))) return "docs";
  if (filesChanged.some((f) => /config|\.env|\.json|\.yaml|\.yml|\.toml/i.test(f)) || detectedChanges.includes("config"))
    return "chore";
  if (changeTypes.includes("new_file")) return "feat";
  if (changeTypes.includes("deletion")) return "refactor";
  if (changeTypes.includes("rename")) return "refactor";
  if (analysis.linesRemoved > analysis.linesAdded * 2) return "refactor";
  if (analysis.linesAdded > 20 && analysis.linesRemoved < 5) return "feat";
  return "fix";
}

function getFilesSummary(files: string[]): string {
  if (files.length === 0) return "files";
  if (files.length === 1) {
    const name = files[0].split("/").pop() || files[0];
    return name;
  }
  const dir = files[0].split("/").slice(0, -1).join("/");
  const allSameDir = files.every((f) => f.startsWith(dir + "/") || f === dir);
  if (allSameDir && dir) return `${dir}/ (${files.length} files)`;
  return `${files.length} files`;
}

function getFunctionNames(analysis: DiffAnalysis): string[] {
  return analysis.detectedChanges
    .filter((c) => c.startsWith("function:"))
    .map((c) => c.replace("function:", ""));
}

function generateProfessional(analysis: DiffAnalysis): string {
  const category = inferChangeCategory(analysis);
  const files = getFilesSummary(analysis.filesChanged);
  const funcs = getFunctionNames(analysis);

  const prefixes: Record<string, string[]> = {
    feat: [`feat: add ${files}`, `feat: implement new functionality in ${files}`],
    fix: [`fix: resolve issue in ${files}`, `fix: correct behavior in ${files}`],
    refactor: [`refactor: clean up ${files}`, `refactor: simplify ${files}`],
    docs: [`docs: update ${files}`, `docs: improve documentation in ${files}`],
    test: [`test: add tests for ${files}`, `test: improve coverage for ${files}`],
    chore: [`chore: update ${files}`, `chore: configure ${files}`],
  };

  const options = prefixes[category] || prefixes.fix;
  let msg = options[Math.floor(Math.random() * options.length)];

  if (funcs.length > 0) {
    msg = `${category}: ${category === "feat" ? "add" : "update"} ${funcs[0]}${funcs.length > 1 ? ` and ${funcs.length - 1} more` : ""}`;
  }

  const details: string[] = [];
  if (analysis.linesAdded > 0) details.push(`+${analysis.linesAdded}`);
  if (analysis.linesRemoved > 0) details.push(`-${analysis.linesRemoved}`);

  return msg;
}

function generatePirate(analysis: DiffAnalysis): string {
  const files = getFilesSummary(analysis.filesChanged);
  const category = inferChangeCategory(analysis);
  const funcs = getFunctionNames(analysis);

  const templates = [
    `Arr! Plundered ${files} and made 'er seaworthy again`,
    `Shiver me timbers! Rewrote ${files} by the light of the moon`,
    `Avast ye scallywags! ${analysis.linesAdded} lines added to the treasure map`,
    `Yo ho ho! Set sail with changes to ${files}`,
    `By Davy Jones' locker! Buried ${analysis.linesRemoved} dead lines and raised ${analysis.linesAdded} fresh ones`,
    `Batten down the hatches! Modified ${files} before the storm`,
  ];

  if (category === "new_file") {
    return `Land ho! Discovered new territory: ${files}`;
  }
  if (category === "deletion") {
    return `Walk the plank! Sent ${files} to Davy Jones' locker`;
  }
  if (funcs.length > 0) {
    return `Arr! Taught me parrot a new trick: ${funcs[0]}()`;
  }

  return templates[Math.floor(Math.random() * templates.length)];
}

function generateShakespeare(analysis: DiffAnalysis): string {
  const files = getFilesSummary(analysis.filesChanged);
  const category = inferChangeCategory(analysis);
  const funcs = getFunctionNames(analysis);

  const templates = [
    `To commit, or not to commit—'twas never the question. Changed ${files}`,
    `Hark! What light through yonder diff breaks? 'Tis ${files}, and changes be the sun`,
    `O ${files}, ${files}! Wherefore art thou broken? Mended with ${analysis.linesAdded} lines of prose`,
    `All the code's a stage, and ${files} merely plays a part`,
    `By the pricking of my thumbs, something refactored this way comes`,
    `Now is the winter of our discontent, made glorious summer by these ${analysis.linesAdded} new lines`,
  ];

  if (category === "new_file") {
    return `A new player enters the stage: ${files}! Let the drama unfold`;
  }
  if (category === "deletion") {
    return `Out, out, brief ${files}! Life's but a walking shadow`;
  }
  if (funcs.length > 0) {
    return `What's in a name? That which we call ${funcs[0]}() by any other name would code as sweet`;
  }

  return templates[Math.floor(Math.random() * templates.length)];
}

function generateEmoji(analysis: DiffAnalysis): string {
  const files = getFilesSummary(analysis.filesChanged);
  const category = inferChangeCategory(analysis);
  const funcs = getFunctionNames(analysis);

  const categoryEmoji: Record<string, string> = {
    feat: "\u2728\ud83d\ude80",
    fix: "\ud83d\udc1b\ud83d\udd27",
    refactor: "\u267b\ufe0f\ud83e\uddf9",
    docs: "\ud83d\udcdd\ud83d\udcda",
    test: "\ud83e\uddea\u2705",
    chore: "\ud83d\udd29\ud83d\udce6",
  };

  const emojis = categoryEmoji[category] || "\ud83d\udcbb\u2728";

  if (category === "new_file") {
    return `\ud83c\udf89\ud83c\udf1f Created ${files}! Fresh code incoming! \ud83d\ude80\u2728`;
  }
  if (funcs.length > 0) {
    return `${emojis} Updated ${funcs[0]}() \ud83d\udcaa +${analysis.linesAdded}/-${analysis.linesRemoved} \ud83d\udcca`;
  }

  return `${emojis} ${category === "feat" ? "Added" : "Updated"} ${files} \ud83c\udf1f +${analysis.linesAdded}/-${analysis.linesRemoved} \ud83d\udcaa`;
}

function generateHaiku(analysis: DiffAnalysis): string {
  const category = inferChangeCategory(analysis);

  // Pre-written haikus for different change types
  const haikus: Record<string, string[]> = {
    feat: [
      "New code blossoms bright\nFunctions spring from empty void\nFeatures come alive",
      "Fresh lines of logic\nA garden of functions grows\nShipping something new",
    ],
    fix: [
      "A bug lay hidden\nPatient debugging reveals\nPeace returns to code",
      "Broken tests now pass\nThe error fades like morning\nDew upon the grass",
    ],
    refactor: [
      "Old code swept away\nCleaner patterns now emerge\nSimpler is better",
      "Lines removed with care\nThe garden pruned of dead growth\nClarity remains",
    ],
    docs: [
      "Words describe the code\nFuture readers will give thanks\nDocumentation",
      "Comments fill the gaps\nBetween intention and code\nKnowledge preserved here",
    ],
    test: [
      "Green checks line the screen\nConfidence in every change\nTests guard the castle",
      "Assert and expect\nEach function proves its own worth\nCoverage expands",
    ],
    chore: [
      "Config files align\nThe scaffolding holds it firm\nInfrastructure works",
      "Dependencies shift\nVersions bumped with steady hands\nMaintenance complete",
    ],
  };

  const options = haikus[category] || haikus.fix;
  return options[Math.floor(Math.random() * options.length)];
}

function generateSeniorDev(analysis: DiffAnalysis): string {
  const files = getFilesSummary(analysis.filesChanged);
  const category = inferChangeCategory(analysis);
  const funcs = getFunctionNames(analysis);

  const templates = [
    `Updated ${files}. Don't ask.`,
    `Fixed the thing. You know which thing.`,
    `${analysis.linesAdded} lines added, ${analysis.linesRemoved} removed. Net improvement: debatable.`,
    `Changed ${files} because past me was clearly having a rough day.`,
    `Refactored ${files}. It was fine before. It's fine now. Ship it.`,
    `This commit brought to you by Stack Overflow and caffeine.`,
  ];

  if (category === "new_file") {
    return `Added ${files}. Yes, we needed another file. No, I don't want to talk about it.`;
  }
  if (category === "deletion") {
    return `Deleted ${files}. The best code is no code. You're welcome.`;
  }
  if (funcs.length > 0) {
    return `Renamed/rewrote ${funcs[0]}(). Third time's the charm.`;
  }
  if (analysis.linesAdded === 1 && analysis.linesRemoved === 1) {
    return `Changed one line. Took two hours to figure out which one.`;
  }

  return templates[Math.floor(Math.random() * templates.length)];
}

const generators: Record<string, (analysis: DiffAnalysis) => string> = {
  professional: generateProfessional,
  pirate: generatePirate,
  shakespeare: generateShakespeare,
  "emoji-master": generateEmoji,
  haiku: generateHaiku,
  "senior-dev": generateSeniorDev,
};

export function generateMessages(
  diff: string,
  personaId: string | null
): { messages: GeneratedMessage[]; analysis: DiffAnalysis } {
  const analysis = parseDiff(diff);
  const messages: GeneratedMessage[] = [];

  const targetPersonas = personaId
    ? personas.filter((p) => p.id === personaId)
    : personas;

  for (const persona of targetPersonas) {
    const generator = generators[persona.id];
    if (generator) {
      messages.push({
        personaId: persona.id,
        personaName: persona.name,
        message: generator(analysis),
      });
    }
  }

  return { messages, analysis };
}
