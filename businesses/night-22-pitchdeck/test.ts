import { generateDeck, StartupInput, DeckStyle, SLIDE_NAMES } from './lib/generator';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

const sampleInput: StartupInput = {
  name: 'TestStartup',
  industry: 'FinTech',
  problem: 'Small businesses struggle with invoicing. Manual processes waste hours every week.',
  solution: 'Automated invoicing platform that sends and tracks invoices in seconds.',
  targetMarket: 'Small and medium businesses',
  businessModel: 'SaaS subscription at $29/mo',
  traction: '500 paying customers, $15K MRR, 20% MoM growth',
  team: 'Jane (ex-Stripe), John (ex-Square)',
  fundingAsk: '$2M seed round',
};

console.log('\n=== PitchDeck Generator Tests ===\n');

// --- Test 1: Basic deck generation ---
console.log('Test Group 1: Basic Deck Generation');
const deck = generateDeck(sampleInput, 'yc-style');

assert(deck.id.startsWith('deck_'), 'Deck ID has correct prefix');
assert(deck.startupName === 'TestStartup', 'Startup name is set correctly');
assert(deck.style === 'yc-style', 'Deck style is set correctly');
assert(deck.slides.length === 10, 'Deck has exactly 10 slides');
assert(typeof deck.createdAt === 'string' && deck.createdAt.length > 0, 'Created timestamp exists');

// --- Test 2: Slide structure ---
console.log('\nTest Group 2: Slide Structure');
for (const slide of deck.slides) {
  assert(slide.bullets.length >= 2, `Slide "${slide.title}" has at least 2 bullets`);
}
assert(deck.slides[0].talkingPoints.length >= 2, 'Title slide has talking points');
assert(deck.slides[0].suggestedVisuals.length >= 2, 'Title slide has suggested visuals');

// --- Test 3: Slide titles match expected ---
console.log('\nTest Group 3: Slide Titles');
const expectedTitles = ['TestStartup', 'The Problem', 'Our Solution', 'Market Size', 'Business Model', 'Traction', 'Competition', 'Team', 'Financials', 'The Ask'];
assert(deck.slides[0].title === expectedTitles[0], 'Title slide uses startup name');
assert(deck.slides[1].title === expectedTitles[1], 'Problem slide title is correct');
assert(deck.slides[2].title === expectedTitles[2], 'Solution slide title is correct');
assert(deck.slides[9].title === expectedTitles[9], 'Ask slide title is correct');

// --- Test 4: Content contains startup details ---
console.log('\nTest Group 4: Content Personalization');
const allText = deck.slides.map(s => [...s.bullets, ...s.talkingPoints].join(' ')).join(' ');
assert(allText.includes('TestStartup'), 'Deck content includes startup name');
assert(allText.includes('FinTech') || allText.includes('fintech'), 'Deck content references industry');
assert(allText.includes('Small and medium businesses') || allText.includes('small and medium'), 'Deck content references target market');

// --- Test 5: Style variations ---
console.log('\nTest Group 5: Style Variations');
const classicDeck = generateDeck(sampleInput, 'classic');
const storyDeck = generateDeck(sampleInput, 'storytelling');

assert(classicDeck.style === 'classic', 'Classic deck has correct style');
assert(storyDeck.style === 'storytelling', 'Storytelling deck has correct style');

// YC-style title vs storytelling title should differ
assert(
  deck.slides[1].bullets[0] !== storyDeck.slides[1].bullets[0],
  'YC and storytelling problem slides have different content'
);
assert(
  classicDeck.slides[2].bullets[0] !== storyDeck.slides[2].bullets[0],
  'Classic and storytelling solution slides differ'
);

// --- Test 6: Unique IDs ---
console.log('\nTest Group 6: Unique IDs');
const deck2 = generateDeck(sampleInput, 'yc-style');
assert(deck.id !== deck2.id, 'Each generated deck has a unique ID');

// --- Test 7: SLIDE_NAMES constant ---
console.log('\nTest Group 7: Constants');
assert(SLIDE_NAMES.length === 10, 'SLIDE_NAMES has 10 entries');
assert(SLIDE_NAMES[0] === 'Title', 'First slide name is Title');
assert(SLIDE_NAMES[9] === 'The Ask', 'Last slide name is The Ask');

// --- Test 8: Edge cases ---
console.log('\nTest Group 8: Edge Cases');
const minimalInput: StartupInput = {
  name: 'MinimalCo',
  industry: 'Tech',
  problem: 'A problem',
  solution: 'A solution',
  targetMarket: '',
  businessModel: '',
  traction: '',
  team: '',
  fundingAsk: '',
};
const minDeck = generateDeck(minimalInput, 'yc-style');
assert(minDeck.slides.length === 10, 'Minimal input still generates 10 slides');
assert(minDeck.slides[0].title === 'MinimalCo', 'Minimal deck uses correct name');
assert(minDeck.slides[0].bullets.length >= 1, 'Minimal deck title slide has bullets');

// --- Summary ---
console.log(`\n=== Results: ${passed} passed, ${failed} failed out of ${passed + failed} assertions ===\n`);

if (failed > 0) {
  process.exit(1);
}
