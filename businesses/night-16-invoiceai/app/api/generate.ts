import { LineItem } from './store';

interface ParsedInvoice {
  lineItems: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
}

const HOURLY_KEYWORDS = [
  'hours', 'hour', 'hrs', 'hr', 'hourly', 'per hour', '/hr', '/hour',
  'consulting', 'development', 'design', 'coding', 'programming',
  'meetings', 'meeting', 'training', 'support', 'debugging',
  'review', 'reviewing', 'planning', 'research', 'testing',
  'writing', 'editing', 'analysis', 'management', 'coaching',
];

const FIXED_KEYWORDS = [
  'fixed', 'flat', 'one-time', 'setup', 'installation', 'install',
  'deployment', 'deploy', 'migration', 'integration', 'audit',
  'license', 'subscription', 'package', 'bundle', 'project',
  'retainer', 'maintenance', 'hosting', 'domain', 'ssl',
  'optimization', 'strategy', 'consultation', 'assessment',
];

const UNIT_KEYWORDS = [
  'units', 'unit', 'items', 'item', 'pieces', 'piece', 'each',
  'pages', 'page', 'emails', 'email', 'posts', 'post',
  'images', 'image', 'icons', 'icon', 'illustrations',
  'articles', 'article', 'videos', 'video', 'copies', 'copy',
  'prints', 'print', 'cards', 'card', 'banners', 'banner',
  'templates', 'template', 'screens', 'screen', 'components',
];

function detectPricingType(text: string): 'hourly' | 'fixed' | 'per-unit' {
  const lower = text.toLowerCase();
  const hourlyScore = HOURLY_KEYWORDS.filter((k) => lower.includes(k)).length;
  const fixedScore = FIXED_KEYWORDS.filter((k) => lower.includes(k)).length;
  const unitScore = UNIT_KEYWORDS.filter((k) => lower.includes(k)).length;

  if (unitScore > hourlyScore && unitScore > fixedScore) return 'per-unit';
  if (fixedScore > hourlyScore) return 'fixed';
  return 'hourly';
}

function extractNumber(text: string): number | null {
  const patterns = [
    /(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)/i,
    /(\d+(?:\.\d+)?)\s*(?:units?|items?|pieces?|pages?|copies|prints?|cards?)/i,
    /(\d+(?:\.\d+)?)\s*x\s/i,
    /x\s*(\d+(?:\.\d+)?)/i,
    /\b(\d+(?:\.\d+)?)\b/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return parseFloat(match[1]);
  }
  return null;
}

function extractRate(text: string): number | null {
  const patterns = [
    /\$(\d+(?:\.\d+)?)\s*(?:\/|\s*per)\s*(?:hour|hr|unit|item|page|each)/i,
    /(?:at|@)\s*\$?(\d+(?:\.\d+)?)\s*(?:\/|\s*per)?\s*(?:hour|hr|each)?/i,
    /\$(\d+(?:\.\d+)?)/i,
    /(\d+(?:\.\d+)?)\s*(?:dollars|usd|eur|gbp|cad)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return parseFloat(match[1]);
  }
  return null;
}

function estimateRate(description: string, type: 'hourly' | 'fixed' | 'per-unit'): number {
  const lower = description.toLowerCase();

  if (type === 'hourly') {
    if (lower.includes('senior') || lower.includes('architect') || lower.includes('lead')) return 175;
    if (lower.includes('design') || lower.includes('ui') || lower.includes('ux')) return 125;
    if (lower.includes('develop') || lower.includes('coding') || lower.includes('program')) return 150;
    if (lower.includes('consult') || lower.includes('strategy')) return 200;
    if (lower.includes('meeting') || lower.includes('planning')) return 100;
    if (lower.includes('test') || lower.includes('qa')) return 100;
    if (lower.includes('writing') || lower.includes('content')) return 85;
    if (lower.includes('support') || lower.includes('maintenance')) return 90;
    return 120;
  }

  if (type === 'fixed') {
    if (lower.includes('setup') || lower.includes('install')) return 500;
    if (lower.includes('deploy') || lower.includes('migration')) return 1500;
    if (lower.includes('integration') || lower.includes('api')) return 2000;
    if (lower.includes('audit') || lower.includes('review')) return 1000;
    if (lower.includes('hosting') || lower.includes('domain')) return 200;
    if (lower.includes('license') || lower.includes('subscription')) return 300;
    return 1000;
  }

  // per-unit
  if (lower.includes('page') || lower.includes('screen')) return 150;
  if (lower.includes('email') || lower.includes('template')) return 75;
  if (lower.includes('icon') || lower.includes('image')) return 50;
  if (lower.includes('article') || lower.includes('post')) return 200;
  if (lower.includes('card') || lower.includes('print')) return 0.50;
  if (lower.includes('video')) return 500;
  return 100;
}

function splitIntoSegments(description: string): string[] {
  // Split on common separators: newlines, semicolons, bullet points, numbered lists
  let segments = description
    .split(/[\n;]|(?:\d+\.\s)|(?:[-*]\s)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);

  // If only one segment, try splitting on commas followed by action words
  if (segments.length <= 1) {
    segments = description
      .split(/,\s*(?=(?:and\s+)?(?:\d|[a-z]+(?:ed|ing|tion|ment)))/i)
      .map((s) => s.trim().replace(/^and\s+/i, ''))
      .filter((s) => s.length > 3);
  }

  // Still one? Try splitting on "and"
  if (segments.length <= 1) {
    segments = description
      .split(/\s+and\s+/i)
      .map((s) => s.trim())
      .filter((s) => s.length > 3);
  }

  // Last resort: use the whole description as one item
  if (segments.length === 0) {
    segments = [description];
  }

  return segments;
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function parseDescription(description: string, taxRate: number): ParsedInvoice {
  const segments = splitIntoSegments(description);
  const lineItems: LineItem[] = [];

  for (const segment of segments) {
    const type = detectPricingType(segment);
    const extractedQty = extractNumber(segment);
    const extractedRate = extractRate(segment);

    const rate = extractedRate ?? estimateRate(segment, type);
    let quantity: number;

    if (extractedQty !== null) {
      quantity = extractedQty;
    } else if (type === 'fixed') {
      quantity = 1;
    } else if (type === 'hourly') {
      quantity = 8; // default to a day
    } else {
      quantity = 1;
    }

    const amount = Math.round(quantity * rate * 100) / 100;

    lineItems.push({
      description: capitalizeFirst(segment.replace(/^\s*[-*]\s*/, '')),
      quantity,
      rate,
      amount,
      type,
    });
  }

  const subtotal = Math.round(lineItems.reduce((sum, item) => sum + item.amount, 0) * 100) / 100;
  const tax = Math.round(subtotal * (taxRate / 100) * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  return { lineItems, subtotal, tax, total };
}

export function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '\u20ac',
    GBP: '\u00a3',
    CAD: 'CA$',
  };
  const symbol = symbols[currency] || '$';
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
