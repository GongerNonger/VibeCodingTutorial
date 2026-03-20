// Role-specific opening templates
const roleOpenings: Record<string, string[]> = {
  "best man": [
    "Good evening, everyone! For those who don't know me, I'm {speaker}, and I've had the honor — and occasionally the misfortune — of being {name1}'s best man.",
    "Ladies and gentlemen, I'm {speaker}, {name1}'s best man. When {name1} asked me to give this speech, I said yes immediately — before realizing I'd actually have to say something intelligent.",
    "Hello everyone! I'm {speaker}, the best man. {name1} chose me for this role because I know all the embarrassing stories — and tonight, I'm contractually obligated to share at least one.",
  ],
  "maid of honor": [
    "Hi everyone! I'm {speaker}, and I'm so honored to stand here today as {name1}'s maid of honor.",
    "Good evening! For those I haven't met, I'm {speaker}, {name1}'s maid of honor and longtime confidant. Standing here today is truly one of the greatest honors of my life.",
    "Hello, beautiful people! I'm {speaker}, the maid of honor. {name1} and I have shared so many memories, and I'm thrilled to be here celebrating the biggest one yet.",
  ],
  "father of bride": [
    "Good evening, everyone. I'm {speaker}, {name1}'s father, and I'd like to welcome you all to this wonderful celebration.",
    "Thank you all for being here today. I'm {speaker}, and as {name1}'s dad, I have to say — this is a day I've been both looking forward to and dreading in equal measure.",
    "Ladies and gentlemen, I'm {speaker}. As the father of the bride, they told me to keep this short. But when it comes to my {name1}, I have a lot to say.",
  ],
  "mother of bride": [
    "Hello, everyone. I'm {speaker}, {name1}'s mother, and my heart is so full today seeing these two wonderful people begin their journey together.",
    "Good evening! I'm {speaker}, and watching my {name1} walk down that aisle today was one of the most beautiful moments of my life.",
    "Thank you all for being here. I'm {speaker}, {name1}'s mom. From the moment {name1} told me about {name2}, I knew something special was happening.",
  ],
  "friend": [
    "Hi everyone! I'm {speaker}, and I've been lucky enough to call {name1} and {name2} my dear friends.",
    "Good evening! For those who don't know me, I'm {speaker}. I've had the pleasure of watching {name1} and {name2}'s love story unfold from the very beginning.",
    "Hello! I'm {speaker}, a close friend of this amazing couple. When they asked me to speak tonight, I was deeply touched.",
  ],
  "sibling": [
    "Hi everyone! I'm {speaker}, {name1}'s sibling, and I have to say — growing up with {name1} prepared me for a lot of things, but this speech wasn't one of them.",
    "Good evening! I'm {speaker}. As {name1}'s sibling, I've had a front-row seat to their life, and I can honestly say that finding {name2} was the best thing that ever happened to them.",
    "Hello, everyone! I'm {speaker}, and yes, I'm the sibling. I've known {name1} literally their entire life — so trust me when I say {name2} is exactly what they needed.",
  ],
  "other": [
    "Good evening, everyone! I'm {speaker}, and I'm honored to say a few words about {name1} and {name2} on this special day.",
    "Hi everyone! I'm {speaker}, and it's truly a privilege to be here celebrating {name1} and {name2}'s love.",
    "Hello! I'm {speaker}. Thank you for giving me the chance to share some thoughts about these two incredible people.",
  ],
};

// Tone-specific anecdote transitions
const anecdoteTransitions: Record<string, string[]> = {
  heartfelt: [
    "One memory that I hold especially close to my heart is",
    "There's a moment I'll never forget that truly captures who they are together.",
    "When I think about what makes their bond so special, one memory always comes to mind.",
  ],
  funny: [
    "Now, let me tell you about the time that still makes me laugh every single time I think about it.",
    "I have to share this story because it perfectly captures the beautiful chaos of their relationship.",
    "Buckle up, because this next part is too good not to share.",
  ],
  formal: [
    "I would like to share an anecdote that I believe speaks to the character of this remarkable couple.",
    "There is a particular memory that exemplifies the depth of their connection.",
    "Allow me to recount a moment that truly illustrates the nature of their bond.",
  ],
  casual: [
    "So here's the thing — there's this one story I just have to tell you all.",
    "Okay, story time. This one's too good to keep to myself.",
    "Let me paint a picture for you all.",
  ],
};

// Tone-specific quality descriptions
const qualityPhrases: Record<string, Record<string, string[]>> = {
  heartfelt: {
    funny: ["their ability to find joy and laughter in every moment", "the way they light up a room with their shared sense of humor"],
    adventurous: ["their brave and adventurous spirits that push each other to grow", "the way they embrace life's adventures hand in hand"],
    kind: ["the boundless kindness they show to everyone around them", "their gentle and caring hearts"],
    loyal: ["the unwavering loyalty they have for each other", "the deep and steadfast commitment they share"],
    hardworking: ["their incredible dedication and work ethic", "the way they pour their hearts into everything they do"],
    creative: ["the beautiful creativity they bring to their lives together", "their imaginative and inspired approach to life"],
    supportive: ["the way they lift each other up unconditionally", "their constant support and encouragement for one another"],
    inspiring: ["the way they inspire everyone around them", "how they motivate each other to be better every day"],
  },
  funny: {
    funny: ["they're both absolutely hilarious — honestly, it's exhausting keeping up with them", "together they're like a two-person comedy show that never ends"],
    adventurous: ["they're the couple who will try absolutely anything once — and usually twice if it goes wrong the first time", "their idea of a quiet weekend is something that would terrify most people"],
    kind: ["they're disgustingly kind — like, aggressively nice to everyone", "they're so kind it actually makes the rest of us look bad"],
    loyal: ["they're ride-or-die loyal — like, witness-protection-program level loyal", "their loyalty to each other is frankly a little intimidating"],
    hardworking: ["they work so hard it makes the rest of us feel like we need to step it up", "their work ethic is honestly offensive to lazy people like me"],
    creative: ["they're so creative they probably planned their wedding on a vision board", "their creative energy is unmatched — they probably have a Pinterest board for everything"],
    supportive: ["they're each other's biggest cheerleaders, and honestly it's adorable", "they support each other so much it's basically a mutual hype squad"],
    inspiring: ["they inspire people just by existing, which is frankly unfair", "they're so inspiring it makes you want to be a better person — annoying, right?"],
  },
  formal: {
    funny: ["their delightful sense of humor that brings warmth to all who know them", "their wit and levity, which create an atmosphere of joy"],
    adventurous: ["their commendable spirit of adventure and exploration", "their courageous approach to life's many opportunities"],
    kind: ["their exemplary kindness and compassion for others", "the generosity of spirit that defines their characters"],
    loyal: ["their admirable devotion and faithfulness to one another", "the steadfast loyalty that forms the foundation of their relationship"],
    hardworking: ["their commendable dedication and industriousness", "the remarkable work ethic they bring to all their endeavors"],
    creative: ["their extraordinary creativity and vision", "the imaginative spirit they bring to their shared life"],
    supportive: ["their unwavering mutual support and encouragement", "the remarkable way they champion one another's aspirations"],
    inspiring: ["the truly inspirational example they set for us all", "their capacity to inspire and elevate those around them"],
  },
  casual: {
    funny: ["they crack each other up constantly — it's the best", "they're honestly the funniest couple I know"],
    adventurous: ["they're always off on some wild adventure together", "they're the couple who says 'yes' to everything"],
    kind: ["they're just genuinely good people, you know?", "they're the kind of people who make the world a better place"],
    loyal: ["they've always got each other's backs, no matter what", "their loyalty to each other is rock solid"],
    hardworking: ["they hustle like nobody else — total power couple", "they put in the work and it shows"],
    creative: ["they're super creative together — always coming up with cool stuff", "their creativity as a couple is next level"],
    supportive: ["they're always there for each other, which is awesome to see", "they lift each other up in the best way"],
    inspiring: ["they honestly make you want to be better just by being around them", "they're the kind of couple that gives you hope"],
  },
};

// Advice/wishes by tone
const adviceTemplates: Record<string, string[]> = {
  heartfelt: [
    "As you begin this beautiful new chapter together, remember that love is not just a feeling — it's a choice you make every single day. Choose each other, even on the hard days. Especially on the hard days.",
    "My wish for you both is simple: may you never lose the wonder you feel for each other right now. May your love grow deeper with every passing year, and may you always find your way back to each other.",
    "Love is a journey, not a destination. There will be mountaintops and valleys, but as long as you walk through them together, hand in hand, you'll find that every step was worth it.",
  ],
  funny: [
    "My advice? Never go to bed angry. Stay up and argue — just kidding. But seriously, always remember to laugh together. A marriage without laughter is like a car without gas — it's not going anywhere.",
    "Here's my unsolicited marriage advice: {name2}, {name1} is always right. {name1}, remember that {name2} is always right too. Congratulations, you're both right, and you're both in trouble.",
    "The secret to a happy marriage? Two words: separate blankets. Trust me on this one. Also, never stop dating each other — even if those dates involve sweatpants and takeout on the couch.",
  ],
  formal: [
    "As you embark upon this new chapter of your lives together, I would encourage you to nurture your partnership with patience, understanding, and grace. A strong marriage is built upon mutual respect and shared purpose.",
    "May your union be blessed with enduring happiness and prosperity. Cherish one another, honor your commitments, and may your love serve as an inspiration to all who are privileged to witness it.",
    "I would offer this counsel: let your marriage be a partnership of equals, built upon a foundation of trust, communication, and unwavering devotion. The journey ahead is one of life's greatest adventures.",
  ],
  casual: [
    "Look, marriage isn't always easy, but with you two? I'm not worried at all. Just keep being yourselves, keep laughing, and keep showing up for each other.",
    "My advice is pretty simple: don't sweat the small stuff, always say 'I love you' before bed, and never underestimate the power of a good pizza night together.",
    "Here's the deal — you two are already amazing together. Just keep doing what you're doing. Talk to each other, support each other, and never stop being each other's favorite person.",
  ],
};

// Toast/closing by tone
const toastTemplates: Record<string, string[]> = {
  heartfelt: [
    "So please raise your glasses with me. To {name1} and {name2} — may your love story be long, beautiful, and filled with more happiness than you ever imagined. Here's to a lifetime of love. Cheers!",
    "Please join me in raising a glass to {name1} and {name2}. May every day bring you closer together, and may your love be a light that guides you through all of life's moments. To the happy couple!",
    "To {name1} and {name2} — may your marriage be filled with all the love and joy you so richly deserve. You are a beautiful couple, and the world is better because of your love. Cheers!",
  ],
  funny: [
    "So raise your glasses, everyone! To {name1} and {name2} — may your love be modern enough to survive social media and old-fashioned enough to last forever. Cheers!",
    "Everyone, glasses up! To {name1} and {name2} — may your biggest fight be over who loves the other one more. And may you always have good Wi-Fi. Cheers!",
    "Let's raise a toast! To {name1} and {name2} — may you grow old together and may the last voice you hear at night always be each other's... and not the smoke alarm. Cheers!",
  ],
  formal: [
    "I would ask you all to please stand and raise your glasses. To {name1} and {name2} — may your marriage be blessed with joy, prosperity, and enduring love. To the bride and groom!",
    "Ladies and gentlemen, please join me in toasting {name1} and {name2}. May their union be a source of strength, happiness, and inspiration for years to come. To the happy couple!",
    "If you would all be so kind as to raise your glasses. To {name1} and {name2} — may your partnership flourish and your love endure through all seasons of life. Cheers!",
  ],
  casual: [
    "Alright everyone, grab your drinks! To {name1} and {name2} — you two are the real deal, and I couldn't be happier for you. Cheers!",
    "Glasses up, people! To {name1} and {name2} — here's to love, laughter, and a lifetime of awesome adventures together. Cheers!",
    "Let's do this! To {name1} and {name2} — may your life together be as amazing as you both are. Love you guys. Cheers!",
  ],
};

// Length targets
const lengthConfig: Record<string, { targetWords: number; minutes: number }> = {
  short: { targetWords: 300, minutes: 2 },
  medium: { targetWords: 600, minutes: 4 },
  long: { targetWords: 900, minutes: 6 },
};

function pickRandom<T>(arr: T[], seed?: number): T {
  const idx = seed !== undefined ? Math.abs(seed) % arr.length : Math.floor(Math.random() * arr.length);
  return arr[idx];
}

function hashStr(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function buildAnecdoteSection(
  howYouKnow: string,
  favoriteMemory: string,
  name1: string,
  name2: string,
  tone: string,
  extended: boolean
): string {
  const transition = pickRandom(anecdoteTransitions[tone] || anecdoteTransitions.heartfelt);
  let section = `${transition} ${howYouKnow}`;

  if (extended) {
    section += ` And that brings me to my favorite memory: ${favoriteMemory}`;
    section += tone === "funny"
      ? ` I mean, you can't make this stuff up! That's ${name1} and ${name2} in a nutshell.`
      : tone === "formal"
      ? ` This moment, I believe, truly captures the essence of ${name1} and ${name2}'s relationship.`
      : tone === "casual"
      ? ` Honestly, that's just so them. Classic ${name1} and ${name2}.`
      : ` And in that moment, I could see just how deeply ${name1} and ${name2} care for each other.`;
  } else {
    section += ` My favorite memory? ${favoriteMemory}`;
  }

  return section;
}

function buildQualitiesSection(
  qualities: string[],
  name1: string,
  name2: string,
  tone: string,
  extended: boolean
): string {
  const toneQualities = qualityPhrases[tone] || qualityPhrases.heartfelt;
  const descriptions = qualities
    .filter((q) => toneQualities[q])
    .map((q) => pickRandom(toneQualities[q]));

  if (descriptions.length === 0) {
    return `What makes ${name1} and ${name2} so special is the love and joy they bring to everyone around them.`;
  }

  let section: string;
  if (tone === "formal") {
    section = `Among the many admirable qualities that ${name1} and ${name2} possess, I would highlight ${descriptions.join(", and ")}.`;
  } else if (tone === "funny") {
    section = `What can I say about ${name1} and ${name2}? Well, ${descriptions.join(". Oh, and ")}.`;
  } else if (tone === "casual") {
    section = `What I love about ${name1} and ${name2} is that ${descriptions.join(", and ")}.`;
  } else {
    section = `What makes ${name1} and ${name2} truly remarkable is ${descriptions.join(", and ")}.`;
  }

  if (extended) {
    section += tone === "heartfelt"
      ? ` These qualities have not only strengthened their bond but have touched the lives of everyone around them. Watching their love grow has been one of the great joys of my life.`
      : tone === "funny"
      ? ` Honestly, they set the bar impossibly high for the rest of us. Thanks for that, guys.`
      : tone === "formal"
      ? ` These attributes serve as a testament to the strength of their character and the depth of their commitment to one another.`
      : ` Seriously, these two are the whole package. It's not even fair.`;
  }

  return section;
}

export function generateSpeech(input: {
  speakerRole: string;
  speakerName: string;
  coupleName1: string;
  coupleName2: string;
  howYouKnow: string;
  favoriteMemory: string;
  coupleQualities: string[];
  tone: string;
  length: string;
}): { speech: string; wordCount: number; estimatedMinutes: number } {
  const {
    speakerRole,
    speakerName,
    coupleName1,
    coupleName2,
    howYouKnow,
    favoriteMemory,
    coupleQualities,
    tone,
    length,
  } = input;

  const config = lengthConfig[length] || lengthConfig.medium;
  const seed = hashStr(`${speakerName}${coupleName1}${coupleName2}${tone}${length}`);
  const roleKey = Object.keys(roleOpenings).includes(speakerRole) ? speakerRole : "other";

  const extended = length !== "short";
  const isLong = length === "long";

  // Build sections
  const openingTemplates = roleOpenings[roleKey];
  let opening = pickRandom(openingTemplates, seed)
    .replace(/{speaker}/g, speakerName)
    .replace(/{name1}/g, coupleName1)
    .replace(/{name2}/g, coupleName2);

  if (isLong) {
    opening += tone === "heartfelt"
      ? ` This day has been a long time coming, and I'm grateful to be standing here to celebrate the union of two truly wonderful people.`
      : tone === "funny"
      ? ` I've been preparing this speech for weeks, and I'm still not sure I'm ready. But here goes nothing!`
      : tone === "formal"
      ? ` It is with great pleasure and profound gratitude that I address you all on this momentous occasion.`
      : ` I've been looking forward to this day for so long, and I'm so happy to finally be here.`;
  }

  const anecdote = buildAnecdoteSection(howYouKnow, favoriteMemory, coupleName1, coupleName2, tone, extended);

  const qualities = buildQualitiesSection(coupleQualities, coupleName1, coupleName2, tone, extended);

  let advice = pickRandom(adviceTemplates[tone] || adviceTemplates.heartfelt, seed + 1)
    .replace(/{name1}/g, coupleName1)
    .replace(/{name2}/g, coupleName2);

  if (isLong) {
    const extraAdvice = pickRandom(adviceTemplates[tone] || adviceTemplates.heartfelt, seed + 3)
      .replace(/{name1}/g, coupleName1)
      .replace(/{name2}/g, coupleName2);
    if (extraAdvice !== advice) {
      advice += " " + extraAdvice;
    }
  }

  const toast = pickRandom(toastTemplates[tone] || toastTemplates.heartfelt, seed + 2)
    .replace(/{name1}/g, coupleName1)
    .replace(/{name2}/g, coupleName2);

  // Assemble speech
  const sections = [opening, anecdote, qualities, advice, toast];
  const speech = sections.join("\n\n");
  const wordCount = speech.split(/\s+/).filter(Boolean).length;
  const estimatedMinutes = config.minutes;

  return { speech, wordCount, estimatedMinutes };
}
