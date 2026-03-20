import { Review } from "./store";

export type Tone = "professional" | "friendly" | "empathetic" | "apologetic";
export type Sentiment = "positive" | "neutral" | "negative";

const negativeKeywords = [
  "terrible", "awful", "horrible", "worst", "rude", "disgusting",
  "disappointed", "waste", "never coming back", "poor", "bad",
  "unacceptable", "cold", "wrong", "slow", "dirty", "overpriced",
  "waited", "hair", "bug", "complaint",
];

const positiveKeywords = [
  "amazing", "excellent", "fantastic", "wonderful", "love", "best",
  "outstanding", "perfect", "great", "friendly", "delicious",
  "awesome", "incredible", "recommend", "definitely", "favorite",
  "beautiful", "clean", "fast", "helpful",
];

export function analyzeSentiment(review: Review): Sentiment {
  const text = review.reviewText.toLowerCase();
  const rating = review.rating;

  let positiveScore = 0;
  let negativeScore = 0;

  for (const kw of positiveKeywords) {
    if (text.includes(kw)) positiveScore++;
  }
  for (const kw of negativeKeywords) {
    if (text.includes(kw)) negativeScore++;
  }

  // Rating is the primary factor
  if (rating >= 4 && negativeScore <= positiveScore) return "positive";
  if (rating <= 2 || negativeScore > positiveScore + 1) return "negative";
  return "neutral";
}

function getGreeting(tone: Tone, reviewerName: string): string {
  switch (tone) {
    case "professional":
      return `Dear ${reviewerName},`;
    case "friendly":
      return `Hi ${reviewerName}!`;
    case "empathetic":
      return `Dear ${reviewerName},`;
    case "apologetic":
      return `Dear ${reviewerName},`;
  }
}

function getSignoff(tone: Tone, businessName: string): string {
  switch (tone) {
    case "professional":
      return `Best regards,\nThe ${businessName} Team`;
    case "friendly":
      return `Thanks again! Hope to see you soon!\n- The ${businessName} Team`;
    case "empathetic":
      return `Warm regards,\nThe ${businessName} Team`;
    case "apologetic":
      return `With sincere apologies,\nThe ${businessName} Team`;
  }
}

function generatePositiveResponse(review: Review, tone: Tone): string {
  const greeting = getGreeting(tone, review.reviewerName);
  const signoff = getSignoff(tone, review.businessName);

  const bodies: Record<Tone, string> = {
    professional: `Thank you for your ${review.rating}-star review. We are delighted to hear about your positive experience at ${review.businessName}. Your feedback is greatly appreciated and motivates our team to continue delivering exceptional service. We look forward to welcoming you back soon.`,
    friendly: `Wow, thank you so much for the kind words! We're thrilled you had such a great time at ${review.businessName}! Your ${review.rating}-star review made our day. We can't wait to have you back for another visit!`,
    empathetic: `Thank you so much for taking the time to share your experience with us. It truly means the world to our team at ${review.businessName} to know we made a positive impact on your visit. We put our hearts into what we do, and reviews like yours remind us why. We'd love to welcome you back anytime.`,
    apologetic: `Thank you for your generous ${review.rating}-star review of ${review.businessName}. We're grateful for your kind words and for choosing us. We strive to provide the best possible experience, and we're glad we met your expectations. We hope to serve you again soon.`,
  };

  return `${greeting}\n\n${bodies[tone]}\n\n${signoff}`;
}

function generateNegativeResponse(review: Review, tone: Tone): string {
  const greeting = getGreeting(tone, review.reviewerName);
  const signoff = getSignoff(tone, review.businessName);

  const bodies: Record<Tone, string> = {
    professional: `Thank you for bringing this matter to our attention. We sincerely regret that your experience at ${review.businessName} did not meet the standards we strive to uphold. We take your feedback seriously and will review the issues you've raised with our team. We would appreciate the opportunity to make things right. Please don't hesitate to contact us directly so we can address your concerns personally.`,
    friendly: `Thank you for letting us know about your experience. We're really sorry things didn't go as planned during your visit to ${review.businessName}. That's not the experience we want for anyone! We'd love the chance to make it up to you. Please reach out to us directly and we'll do everything we can to turn things around.`,
    empathetic: `We are truly sorry to hear about your experience at ${review.businessName}. We understand how frustrating it must have been, and we want you to know that your feelings are completely valid. No guest should have to go through what you described. We are taking your feedback to heart and making changes to ensure this doesn't happen again. If you're willing, we'd love the chance to welcome you back and show you the experience you deserve.`,
    apologetic: `We owe you a sincere apology for the experience you had at ${review.businessName}. There is no excuse for what happened, and we are deeply sorry. We have already begun addressing the issues you mentioned with our team. We understand if you're hesitant to return, but we would be grateful for another chance to serve you properly. Please contact us directly, and we will personally ensure your next visit exceeds your expectations.`,
  };

  return `${greeting}\n\n${bodies[tone]}\n\n${signoff}`;
}

function generateNeutralResponse(review: Review, tone: Tone): string {
  const greeting = getGreeting(tone, review.reviewerName);
  const signoff = getSignoff(tone, review.businessName);

  const bodies: Record<Tone, string> = {
    professional: `Thank you for your honest feedback about your visit to ${review.businessName}. We appreciate you taking the time to share your thoughts. While we're glad certain aspects of your experience were satisfactory, we recognize there is room for improvement. We are committed to enhancing every aspect of our service, and your review helps us identify where we can do better. We hope to exceed your expectations on your next visit.`,
    friendly: `Thanks for sharing your thoughts about ${review.businessName}! We're glad some things hit the mark, and we hear you on the areas where we can step up our game. We're always working to make things even better, and feedback like yours really helps! We'd love to see you again and give you an even better experience next time.`,
    empathetic: `Thank you for sharing your experience at ${review.businessName}. We appreciate your balanced perspective and understand that while some aspects were enjoyable, others may not have fully met your expectations. We genuinely care about every guest's experience, and we want to make sure your next visit is even better. Your feedback gives us valuable insight into how we can improve.`,
    apologetic: `Thank you for your candid review of ${review.businessName}. We appreciate your honesty and are sorry that your experience wasn't entirely what you hoped for. We take all feedback to heart and are actively working on the areas you've mentioned. We hope you'll give us another chance to provide you with a truly outstanding experience.`,
  };

  return `${greeting}\n\n${bodies[tone]}\n\n${signoff}`;
}

export function generateResponse(review: Review, tone: Tone): string {
  const sentiment = analyzeSentiment(review);

  switch (sentiment) {
    case "positive":
      return generatePositiveResponse(review, tone);
    case "negative":
      return generateNegativeResponse(review, tone);
    case "neutral":
      return generateNeutralResponse(review, tone);
  }
}
