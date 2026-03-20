export interface Wall {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  wallId: string;
  author: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  avatarUrl?: string;
  createdAt: string;
}

export const walls = new Map<string, Wall>();
export const testimonials = new Map<string, Testimonial[]>();

let counter = 0;
export function newId(): string {
  counter++;
  return `tw_${Date.now()}_${counter}`;
}

// Pre-seed sample data so the page isn't empty on first load
const sampleWallId = "tw_sample_1";

walls.set(sampleWallId, {
  id: sampleWallId,
  name: "Acme SaaS",
  description: "Customer testimonials for our flagship product",
  createdAt: new Date().toISOString(),
});

testimonials.set(sampleWallId, [
  {
    id: "tw_seed_1",
    wallId: sampleWallId,
    author: "Sarah Chen",
    role: "CTO",
    company: "TechFlow",
    text: "TestimonialWall made it incredibly easy to collect and showcase our customer feedback. We saw a 30% increase in conversions after embedding the wall on our landing page.",
    rating: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "tw_seed_2",
    wallId: sampleWallId,
    author: "Marcus Johnson",
    role: "Head of Marketing",
    company: "GrowthLab",
    text: "The embed widget is beautifully designed and took under 2 minutes to set up. Our clients love the polished look.",
    rating: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "tw_seed_3",
    wallId: sampleWallId,
    author: "Emily Rodriguez",
    role: "Founder",
    company: "PixelCraft",
    text: "We switched from a clunky spreadsheet of testimonials to TestimonialWall. Night and day difference for our sales team.",
    rating: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: "tw_seed_4",
    wallId: sampleWallId,
    author: "David Park",
    role: "Product Manager",
    company: "CloudBase",
    text: "Simple, fast, and effective. Exactly what we needed to build social proof on our pricing page.",
    rating: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "tw_seed_5",
    wallId: sampleWallId,
    author: "Aisha Patel",
    role: "CEO",
    company: "NovaBrand",
    text: "Love the masonry layout and dark theme options. Fits perfectly with our brand.",
    rating: 4,
    createdAt: new Date().toISOString(),
  },
]);
