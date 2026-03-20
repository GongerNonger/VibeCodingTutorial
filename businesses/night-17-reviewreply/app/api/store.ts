export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  reviewText: string;
  platform: string;
  businessName: string;
}

export interface GeneratedResponse {
  id: string;
  reviewId: string;
  tone: string;
  response: string;
  createdAt: string;
}

const reviews: Review[] = [
  {
    id: "1",
    reviewerName: "Sarah M.",
    rating: 5,
    reviewText: "Absolutely amazing experience! The staff was incredibly friendly and the food was outstanding. Will definitely be coming back!",
    platform: "Google",
    businessName: "Bella's Kitchen",
  },
  {
    id: "2",
    reviewerName: "James T.",
    rating: 2,
    reviewText: "Waited over 45 minutes for our food. When it finally arrived, the order was wrong. Very disappointed with the service.",
    platform: "Yelp",
    businessName: "Bella's Kitchen",
  },
  {
    id: "3",
    reviewerName: "Emily R.",
    rating: 4,
    reviewText: "Great atmosphere and good food, but the prices are a bit high for the portion sizes. Service was friendly though.",
    platform: "TripAdvisor",
    businessName: "Bella's Kitchen",
  },
  {
    id: "4",
    reviewerName: "Mike D.",
    rating: 1,
    reviewText: "Terrible experience. Found a hair in my soup and the manager was rude when I complained. Never coming back.",
    platform: "Google",
    businessName: "Bella's Kitchen",
  },
  {
    id: "5",
    reviewerName: "Lisa K.",
    rating: 3,
    reviewText: "Average experience. Nothing special but nothing terrible either. The pasta was decent.",
    platform: "Facebook",
    businessName: "Bella's Kitchen",
  },
];

const responses: GeneratedResponse[] = [];

let nextReviewId = 6;
let nextResponseId = 1;

export function getReviews(): Review[] {
  return [...reviews];
}

export function getReviewById(id: string): Review | undefined {
  return reviews.find((r) => r.id === id);
}

export function addReview(review: Omit<Review, "id">): Review {
  const newReview: Review = { ...review, id: String(nextReviewId++) };
  reviews.push(newReview);
  return newReview;
}

export function addResponse(resp: Omit<GeneratedResponse, "id" | "createdAt">): GeneratedResponse {
  const newResp: GeneratedResponse = {
    ...resp,
    id: String(nextResponseId++),
    createdAt: new Date().toISOString(),
  };
  responses.push(newResp);
  return newResp;
}

export function getResponsesForReview(reviewId: string): GeneratedResponse[] {
  return responses.filter((r) => r.reviewId === reviewId);
}
