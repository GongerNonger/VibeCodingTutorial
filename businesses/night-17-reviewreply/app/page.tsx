"use client";

import { useState, useEffect } from "react";

interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  reviewText: string;
  platform: string;
  businessName: string;
}

interface GeneratedResponse {
  id: string;
  reviewId: string;
  tone: string;
  response: string;
  createdAt: string;
}

const platforms = ["Google", "Yelp", "TripAdvisor", "Facebook"];
const tones = ["professional", "friendly", "empathetic", "apologetic"] as const;

function StarRating({
  rating,
  onRate,
  interactive = false,
}: {
  rating: number;
  onRate?: (r: number) => void;
  interactive?: boolean;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          className={`text-2xl transition-colors ${
            interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
          } ${
            star <= (hover || rating)
              ? "text-orange-500"
              : "text-gray-600"
          }`}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate?.(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function SentimentBadge({ rating }: { rating: number }) {
  if (rating >= 4) {
    return (
      <span className="px-2 py-0.5 text-xs rounded-full bg-green-900/50 text-green-400 border border-green-800">
        Positive
      </span>
    );
  }
  if (rating <= 2) {
    return (
      <span className="px-2 py-0.5 text-xs rounded-full bg-red-900/50 text-red-400 border border-red-800">
        Negative
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-900/50 text-yellow-400 border border-yellow-800">
      Neutral
    </span>
  );
}

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [platform, setPlatform] = useState("Google");
  const [businessName, setBusinessName] = useState("");
  const [selectedTone, setSelectedTone] = useState<string>("professional");
  const [generatedResponse, setGeneratedResponse] = useState<GeneratedResponse | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    const res = await fetch("/api/reviews");
    const data = await res.json();
    setReviews(data);
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewerName || !reviewText || !businessName) return;

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewerName, rating, reviewText, platform, businessName }),
    });

    if (res.ok) {
      const newReview = await res.json();
      setReviews((prev) => [...prev, newReview]);
      setReviewerName("");
      setRating(5);
      setReviewText("");
      setSelectedReview(newReview);
      handleGenerateResponse(newReview.id, selectedTone);
    }
  }

  async function handleGenerateResponse(reviewId: string, tone: string) {
    setLoading(true);
    setGeneratedResponse(null);
    const res = await fetch(`/api/reviews/${reviewId}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tone }),
    });
    if (res.ok) {
      const data = await res.json();
      setGeneratedResponse(data);
    }
    setLoading(false);
  }

  async function handleCopy() {
    if (!generatedResponse) return;
    await navigator.clipboard.writeText(generatedResponse.response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSelectReview(review: Review) {
    setSelectedReview(review);
    setGeneratedResponse(null);
    handleGenerateResponse(review.id, selectedTone);
  }

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-lg">
              R
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ReviewReply</h1>
              <p className="text-xs text-gray-500">Professional Review Response Writer</p>
            </div>
          </div>
          <span className="text-sm text-gray-500">$19/mo per location</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Add Review</h2>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  placeholder="Your Business Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Reviewer Name</label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  placeholder="John D."
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Star Rating</label>
                <StarRating rating={rating} onRate={setRating} interactive />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                >
                  {platforms.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Review Text</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
                  placeholder="Paste the customer review here..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                Add Review & Generate Response
              </button>
            </form>
          </div>

          {/* Tone Selector */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Response Tone</h2>
            <div className="grid grid-cols-2 gap-2">
              {tones.map((tone) => (
                <button
                  key={tone}
                  onClick={() => {
                    setSelectedTone(tone);
                    if (selectedReview) {
                      handleGenerateResponse(selectedReview.id, tone);
                    }
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    selectedTone === tone
                      ? "bg-orange-500 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300 border border-gray-700"
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column: Generated Response */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 min-h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Generated Response</h2>
              {generatedResponse && (
                <span className="text-xs text-gray-500 capitalize">
                  Tone: {generatedResponse.tone}
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : generatedResponse ? (
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4 whitespace-pre-wrap text-sm text-gray-300 leading-relaxed">
                  {generatedResponse.response}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition-colors text-sm"
                  >
                    {copied ? "Copied!" : "Copy Response"}
                  </button>
                  <button
                    onClick={() => {
                      if (selectedReview) {
                        const nextToneIndex = (tones.indexOf(selectedTone as typeof tones[number]) + 1) % tones.length;
                        const nextTone = tones[nextToneIndex];
                        setSelectedTone(nextTone);
                        handleGenerateResponse(selectedReview.id, nextTone);
                      }
                    }}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-2 rounded-lg transition-colors text-sm border border-gray-700"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-600 text-sm">
                Select a review or add a new one to generate a response
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Review History */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Review History{" "}
              <span className="text-sm text-gray-500 font-normal">({reviews.length})</span>
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {reviews.length === 0 ? (
                <p className="text-gray-600 text-sm">No reviews yet</p>
              ) : (
                reviews.map((review) => (
                  <button
                    key={review.id}
                    onClick={() => handleSelectReview(review)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedReview?.id === review.id
                        ? "bg-gray-800 border border-orange-500/50"
                        : "bg-gray-800/50 border border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">
                        {review.reviewerName}
                      </span>
                      <SentimentBadge rating={review.rating} />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-gray-500">{review.platform}</span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {review.reviewText}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{review.businessName}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
