export interface Speech {
  id: string;
  speakerRole: string;
  speakerName: string;
  coupleName1: string;
  coupleName2: string;
  howYouKnow: string;
  favoriteMemory: string;
  coupleQualities: string[];
  tone: string;
  length: string;
  generatedSpeech: string;
  wordCount: number;
  estimatedMinutes: number;
  createdAt: string;
}

export const speeches: Speech[] = [
  {
    id: "sample-1",
    speakerRole: "best man",
    speakerName: "Marcus",
    coupleName1: "Jake",
    coupleName2: "Emily",
    howYouKnow: "Jake and I have been best friends since college. We were roommates freshman year and instantly bonded over our terrible cooking skills.",
    favoriteMemory: "The time Jake tried to impress Emily by cooking her dinner and accidentally set off every smoke alarm in the building. She still married him anyway.",
    coupleQualities: ["funny", "adventurous", "loyal"],
    tone: "funny",
    length: "medium",
    generatedSpeech: `Good evening, everyone! For those who don't know me, I'm Marcus, and I've had the questionable honor of being Jake's best friend since college. We were roommates freshman year, and let me tell you — our dorm room was a health hazard. Neither of us could cook to save our lives.

Speaking of cooking disasters, let me tell you about the night Jake decided to impress Emily with a homemade dinner. Picture this: Jake, wearing an apron he borrowed from his mom, standing in a smoke-filled kitchen while every single alarm in the building went off. The fire department showed up. The entire building was evacuated. And there was Emily, standing in the parking lot, laughing so hard she was crying. That was the moment I knew she was the one for him — anyone who can laugh through that kind of chaos is a keeper.

What makes Jake and Emily so special together is how funny they are as a couple. They're always cracking each other up, even in the tough moments. They're adventurous — always planning the next road trip or trying some new hobby together. And above all, they're loyal to each other and to the people they love. I've watched Jake become a better version of himself since Emily came into his life.

If I could offer one piece of advice, it would be this: never stop laughing together. The world can be serious enough — your marriage doesn't have to be. Keep being each other's favorite adventure, and keep being the kind of partners who show up for each other, smoke alarms and all.

So please raise your glasses to Jake and Emily — may your love be as resilient as your smoke detectors and as endless as your laughter. Cheers!`,
    wordCount: 262,
    estimatedMinutes: 2,
    createdAt: new Date().toISOString(),
  },
];

let nextId = 2;

export function addSpeech(speech: Omit<Speech, "id" | "createdAt">): Speech {
  const newSpeech: Speech = {
    ...speech,
    id: `speech-${nextId++}`,
    createdAt: new Date().toISOString(),
  };
  speeches.push(newSpeech);
  return newSpeech;
}

export function getSpeech(id: string): Speech | undefined {
  return speeches.find((s) => s.id === id);
}

export function getAllSpeeches(): Speech[] {
  return [...speeches].reverse();
}
