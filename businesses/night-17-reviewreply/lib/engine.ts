// ReviewReply Engine — Sentiment Analysis & Response Generation

export type Sentiment = "positive" | "negative" | "mixed";
export type Tone = "professional" | "friendly" | "empathetic" | "assertive";
export type Length = "brief" | "standard" | "detailed";

export interface ReviewAnalysis {
  sentiment: Sentiment;
  starRating: number;
  themes: string[];
  keyPhrases: string[];
}

export interface BusinessProfile {
  id: string;
  name: string;
  type: string;
  personality: string;
}

export interface GeneratedResponse {
  text: string;
  tone: Tone;
  length: Length;
  sentiment: Sentiment;
}

// --- Sentiment Analysis ---

const positiveWords = [
  "great", "excellent", "amazing", "wonderful", "fantastic", "love", "loved",
  "best", "awesome", "perfect", "outstanding", "superb", "friendly", "helpful",
  "delicious", "beautiful", "clean", "fast", "quick", "recommend", "recommended",
  "impressed", "pleasant", "enjoy", "enjoyed", "happy", "satisfied", "thank",
  "thanks", "incredible", "phenomenal", "stellar", "top-notch", "exceptional",
  "nice", "good", "comfortable", "welcoming",
];

const negativeWords = [
  "bad", "terrible", "horrible", "awful", "worst", "hate", "hated", "poor",
  "disappointing", "disappointed", "rude", "slow", "dirty", "cold", "overpriced",
  "expensive", "mediocre", "unprofessional", "disgusting", "unacceptable",
  "never", "avoid", "waste", "complaint", "problem", "issue", "broken",
  "wrong", "mistake", "incompetent", "frustrating", "frustrated", "annoyed",
  "angry", "upset", "lacking", "subpar", "dreadful",
];

const themePatterns: Record<string, RegExp[]> = {
  "customer service": [/service/i, /staff/i, /employee/i, /server/i, /waiter/i, /waitress/i, /manager/i, /team/i, /help/i, /friendly/i, /rude/i, /attentive/i],
  "food quality": [/food/i, /meal/i, /dish/i, /taste/i, /flavor/i, /delicious/i, /fresh/i, /cook/i, /chef/i, /menu/i, /portion/i],
  "atmosphere": [/atmosphere/i, /ambiance/i, /decor/i, /music/i, /vibe/i, /environment/i, /cozy/i, /clean/i, /noise/i, /seating/i],
  "value": [/price/i, /value/i, /worth/i, /expensive/i, /cheap/i, /overpriced/i, /affordable/i, /cost/i, /money/i, /deal/i],
  "wait time": [/wait/i, /slow/i, /fast/i, /quick/i, /time/i, /hour/i, /minute/i, /long/i, /prompt/i, /delay/i],
  "product quality": [/quality/i, /product/i, /item/i, /material/i, /durable/i, /broke/i, /broken/i, /defect/i, /craftsmanship/i],
  "location": [/location/i, /parking/i, /convenient/i, /access/i, /find/i, /area/i, /neighborhood/i],
  "cleanliness": [/clean/i, /dirty/i, /hygiene/i, /sanitary/i, /mess/i, /spotless/i, /tidy/i, /filthy/i],
};

export function detectStarRating(text: string): number {
  // Try to detect explicit star rating
  const starMatch = text.match(/(\d)\s*(?:\/\s*5|stars?|⭐|★)/i);
  if (starMatch) {
    const rating = parseInt(starMatch[1]);
    if (rating >= 1 && rating <= 5) return rating;
  }

  // Infer from sentiment
  const lower = text.toLowerCase();
  const words = lower.split(/\W+/);
  let posCount = 0;
  let negCount = 0;

  for (const word of words) {
    if (positiveWords.includes(word)) posCount++;
    if (negativeWords.includes(word)) negCount++;
  }

  const total = posCount + negCount;
  if (total === 0) return 3;

  const ratio = posCount / total;
  if (ratio >= 0.85) return 5;
  if (ratio >= 0.65) return 4;
  if (ratio >= 0.4) return 3;
  if (ratio >= 0.2) return 2;
  return 1;
}

export function analyzeSentiment(text: string): Sentiment {
  const lower = text.toLowerCase();
  const words = lower.split(/\W+/);
  let posCount = 0;
  let negCount = 0;

  for (const word of words) {
    if (positiveWords.includes(word)) posCount++;
    if (negativeWords.includes(word)) negCount++;
  }

  if (posCount === 0 && negCount === 0) return "mixed";
  if (posCount > 0 && negCount > 0) {
    const ratio = posCount / (posCount + negCount);
    if (ratio > 0.65) return "positive";
    if (ratio < 0.35) return "negative";
    return "mixed";
  }
  if (posCount > 0) return "positive";
  return "negative";
}

export function extractThemes(text: string): string[] {
  const found: string[] = [];
  for (const [theme, patterns] of Object.entries(themePatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        found.push(theme);
        break;
      }
    }
  }
  return found.length > 0 ? found : ["general experience"];
}

export function extractKeyPhrases(text: string): string[] {
  const phrases: string[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  for (const sentence of sentences.slice(0, 5)) {
    const trimmed = sentence.trim();
    if (trimmed.length > 5 && trimmed.length < 120) {
      phrases.push(trimmed);
    }
  }
  return phrases.length > 0 ? phrases : [text.trim().slice(0, 80)];
}

export function analyzeReview(text: string): ReviewAnalysis {
  return {
    sentiment: analyzeSentiment(text),
    starRating: detectStarRating(text),
    themes: extractThemes(text),
    keyPhrases: extractKeyPhrases(text),
  };
}

// --- Response Generation ---

const greetings: Record<Tone, string[]> = {
  professional: [
    "Thank you for taking the time to share your feedback.",
    "We appreciate you sharing your experience with us.",
    "Thank you for your review.",
  ],
  friendly: [
    "Thanks so much for sharing your thoughts with us!",
    "We really appreciate you taking the time to write this review!",
    "Hey, thanks for the feedback!",
  ],
  empathetic: [
    "Thank you for sharing your experience — we truly value your honest feedback.",
    "We appreciate you letting us know about your experience, and we hear you.",
    "Thank you for bringing this to our attention — your feedback matters to us.",
  ],
  assertive: [
    "Thank you for your review. We take all feedback seriously.",
    "We appreciate your candid review.",
    "Thank you for this feedback. We want to address your points directly.",
  ],
};

const positiveMiddle: Record<Tone, string[]> = {
  professional: [
    "We are delighted to hear that you had a positive experience.",
    "It is gratifying to know that our efforts met your expectations.",
    "We are pleased that you enjoyed your experience with us.",
  ],
  friendly: [
    "It makes our day to hear that you had such a great experience!",
    "We're thrilled that you enjoyed your visit!",
    "So glad we could make your experience a great one!",
  ],
  empathetic: [
    "It warms our hearts to know that we could make your experience special.",
    "Knowing that you had a wonderful experience truly means the world to us.",
    "We are so grateful that your experience was a positive one.",
  ],
  assertive: [
    "We are proud to consistently deliver the quality you described.",
    "Your positive experience reflects our commitment to excellence.",
    "We work hard to maintain these standards, and your review validates that effort.",
  ],
};

const negativeMiddle: Record<Tone, string[]> = {
  professional: [
    "We sincerely apologize for the experience you described. This does not reflect our standards.",
    "We regret that your experience did not meet the high standards we set for ourselves.",
    "We are sorry to hear about the issues you encountered.",
  ],
  friendly: [
    "We're really sorry to hear that things didn't go as well as we'd hoped.",
    "Oh no, we're sorry your visit wasn't up to par!",
    "We hate to hear that your experience wasn't great.",
  ],
  empathetic: [
    "We are deeply sorry for the disappointing experience. We understand how frustrating that must have been.",
    "We sincerely apologize and want you to know that we understand your frustration.",
    "Your disappointment is completely understandable, and we are truly sorry.",
  ],
  assertive: [
    "We acknowledge the issues you raised and take full responsibility.",
    "We do not take these concerns lightly and are addressing them immediately.",
    "This falls short of our standards, and we are taking corrective action.",
  ],
};

const mixedMiddle: Record<Tone, string[]> = {
  professional: [
    "We appreciate the positive aspects you mentioned, and we acknowledge the areas where we can improve.",
    "Thank you for recognizing what went well while also highlighting areas for improvement.",
  ],
  friendly: [
    "We're glad some things went well, and we totally hear you on the rest!",
    "Thanks for sharing both the good and the not-so-good — it helps us improve!",
  ],
  empathetic: [
    "We are glad there were bright spots in your visit, and we sincerely want to address the concerns you raised.",
    "We appreciate your balanced perspective and understand that the experience was not entirely what you hoped for.",
  ],
  assertive: [
    "We value your balanced feedback. While we appreciate the positive remarks, we are focused on addressing the shortcomings.",
    "We hear both the praise and the criticism, and we are committed to improving where we fell short.",
  ],
};

const themeResponses: Record<string, Record<Sentiment, string>> = {
  "customer service": {
    positive: "Our team takes great pride in providing excellent service, and your kind words will certainly be shared with them.",
    negative: "We are addressing the service concerns you raised with our team to ensure this does not happen again.",
    mixed: "We are glad some of our team members impressed you, and we will work to bring the entire team up to that standard.",
  },
  "food quality": {
    positive: "Our kitchen team works hard to ensure every dish is exceptional, and we are glad it showed.",
    negative: "We have shared your feedback with our kitchen team and are reviewing our quality standards.",
    mixed: "We are glad you enjoyed some dishes and will work to ensure consistency across our menu.",
  },
  "atmosphere": {
    positive: "We put a lot of effort into creating the right atmosphere, and it is wonderful to hear it enhanced your experience.",
    negative: "We are reviewing our environment to ensure it provides the comfortable experience our guests deserve.",
    mixed: "We appreciate your thoughts on our atmosphere and will consider your suggestions for improvement.",
  },
  "value": {
    positive: "We strive to provide excellent value, and we are glad you felt it was money well spent.",
    negative: "We understand value is important and are reviewing our pricing to ensure fairness.",
    mixed: "We are continually working to provide the best possible value for our customers.",
  },
  "wait time": {
    positive: "We are glad the service was prompt and met your expectations for timeliness.",
    negative: "We apologize for the wait and are taking steps to improve our efficiency and reduce wait times.",
    mixed: "We are working on improving consistency in our service times.",
  },
  "product quality": {
    positive: "We are committed to quality in everything we offer, and your feedback reinforces that mission.",
    negative: "We take product quality very seriously and are investigating the issues you described.",
    mixed: "We are glad some products met expectations and are working to ensure consistent quality.",
  },
  "location": {
    positive: "We are glad you found our location convenient and accessible.",
    negative: "We appreciate your feedback on our location and are looking into ways to improve accessibility.",
    mixed: "We are always looking for ways to improve the experience around our location.",
  },
  "cleanliness": {
    positive: "Maintaining a clean environment is a top priority for us, and we are glad it showed.",
    negative: "We sincerely apologize for the cleanliness issues. We have addressed this with our maintenance team immediately.",
    mixed: "We are reinforcing our cleaning protocols to ensure a consistently clean experience.",
  },
  "general experience": {
    positive: "We are committed to providing the best possible experience for every guest.",
    negative: "We are committed to improving and hope you will give us another opportunity to serve you better.",
    mixed: "We value your feedback and are always working to enhance the overall experience.",
  },
};

const closings: Record<Tone, Record<Sentiment, string[]>> = {
  professional: {
    positive: [
      "We look forward to welcoming you again soon.",
      "We hope to see you again in the near future.",
    ],
    negative: [
      "We would appreciate the opportunity to make things right. Please contact us directly so we can resolve this.",
      "Please reach out to us so we can address your concerns personally.",
    ],
    mixed: [
      "We hope to have the opportunity to provide a fully satisfying experience on your next visit.",
      "We look forward to improving your experience next time.",
    ],
  },
  friendly: {
    positive: [
      "Can't wait to see you again! 😊",
      "Hope to see you back real soon!",
    ],
    negative: [
      "We'd love a chance to make it up to you — drop us a line anytime!",
      "Please come back and let us show you the experience we know we can deliver!",
    ],
    mixed: [
      "We hope your next visit will be even better!",
      "Come back and let us wow you next time!",
    ],
  },
  empathetic: {
    positive: [
      "Your support means the world to us. We look forward to creating more wonderful memories together.",
      "We are grateful for your trust and look forward to welcoming you back.",
    ],
    negative: [
      "We truly want to make this right. Please reach out — we care deeply about your experience.",
      "Your satisfaction is our priority, and we would love the chance to restore your trust in us.",
    ],
    mixed: [
      "We genuinely appreciate your honesty and are committed to doing better for you.",
      "We hope to earn your full satisfaction on your next visit.",
    ],
  },
  assertive: {
    positive: [
      "We remain committed to maintaining these high standards. See you again soon.",
      "Your loyalty is valued. We will continue to deliver excellence.",
    ],
    negative: [
      "We are taking immediate steps to address these issues. Contact us directly for a resolution.",
      "We are committed to resolving this. Please reach out so we can act on your concerns.",
    ],
    mixed: [
      "We are taking action on the areas that fell short and will maintain what works well.",
      "Expect improvements on your next visit. We hold ourselves accountable.",
    ],
  },
};

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}

export function generateResponse(
  review: string,
  analysis: ReviewAnalysis,
  tone: Tone,
  length: Length,
  business?: BusinessProfile
): GeneratedResponse {
  const seed = hashString(review + tone + length);
  const { sentiment, themes } = analysis;

  const parts: string[] = [];

  // Greeting
  parts.push(pick(greetings[tone], seed));

  // Business personalization
  if (business) {
    parts.push(`At ${business.name}, ${business.personality.toLowerCase().includes("we") ? business.personality : "we strive to " + business.personality.toLowerCase()}.`);
  }

  // Sentiment-specific middle
  const middleMap = sentiment === "positive" ? positiveMiddle : sentiment === "negative" ? negativeMiddle : mixedMiddle;
  parts.push(pick(middleMap[tone], seed + 1));

  // Theme-specific responses
  if (length !== "brief") {
    const themeCount = length === "detailed" ? Math.min(themes.length, 3) : Math.min(themes.length, 1);
    for (let i = 0; i < themeCount; i++) {
      const theme = themes[i];
      const resp = themeResponses[theme];
      if (resp) {
        parts.push(resp[sentiment]);
      }
    }
  }

  // Detailed: add key phrase reference
  if (length === "detailed" && analysis.keyPhrases.length > 0) {
    const phrase = analysis.keyPhrases[0];
    if (sentiment === "positive") {
      parts.push(`We especially appreciate your comment: "${phrase.length > 60 ? phrase.slice(0, 60) + '...' : phrase}".`);
    } else if (sentiment === "negative") {
      parts.push(`Regarding your concern about "${phrase.length > 60 ? phrase.slice(0, 60) + '...' : phrase}" — we want you to know this is being addressed.`);
    }
  }

  // Closing
  parts.push(pick(closings[tone][sentiment], seed + 2));

  // Sign off
  if (business) {
    parts.push(`\nWarm regards,\nThe ${business.name} Team`);
  }

  return {
    text: parts.join(" ").replace(/ +\n/g, "\n"),
    tone,
    length,
    sentiment,
  };
}
