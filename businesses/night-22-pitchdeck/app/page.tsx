'use client';

import { useState } from 'react';

interface Slide {
  title: string;
  bullets: string[];
  talkingPoints: string[];
  suggestedVisuals: string[];
}

interface Deck {
  id: string;
  startupName: string;
  style: string;
  slides: Slide[];
  createdAt: string;
}

type DeckStyle = 'yc-style' | 'classic' | 'storytelling';

const STYLE_OPTIONS: { value: DeckStyle; label: string; desc: string }[] = [
  { value: 'yc-style', label: 'YC-Style', desc: 'Concise, data-driven, metrics-focused' },
  { value: 'classic', label: 'Classic', desc: 'Professional, thorough, business fundamentals' },
  { value: 'storytelling', label: 'Storytelling', desc: 'Narrative, emotionally compelling' },
];

const SLIDE_ICONS = ['🎯', '😤', '💡', '📊', '💰', '🚀', '⚔️', '👥', '📈', '🤝'];

export default function Home() {
  const [form, setForm] = useState({
    name: '',
    industry: '',
    problem: '',
    solution: '',
    targetMarket: '',
    businessModel: '',
    traction: '',
    team: '',
    fundingAsk: '',
  });
  const [style, setStyle] = useState<DeckStyle>('yc-style');
  const [deck, setDeck] = useState<Deck | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, style }),
      });
      const data = await res.json();
      setDeck(data);
      setCurrentSlide(0);
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatSlideText = (slide: Slide) => {
    let text = `## ${slide.title}\n\n`;
    text += `**Key Points:**\n${slide.bullets.map(b => `- ${b}`).join('\n')}\n\n`;
    text += `**Talking Points:**\n${slide.talkingPoints.map(t => `- ${t}`).join('\n')}\n\n`;
    text += `**Suggested Visuals:**\n${slide.suggestedVisuals.map(v => `- ${v}`).join('\n')}`;
    return text;
  };

  const formatFullDeck = () => {
    if (!deck) return '';
    let text = `# ${deck.startupName} — Pitch Deck Outline (${deck.style})\n\n`;
    deck.slides.forEach((slide, i) => {
      text += `---\n\nSlide ${i + 1}: ${formatSlideText(slide)}\n\n`;
    });
    return text;
  };

  const fields = [
    { name: 'name', label: 'Startup Name', type: 'input', placeholder: 'e.g., PitchDeck', required: true },
    { name: 'industry', label: 'Industry', type: 'input', placeholder: 'e.g., SaaS, FinTech, HealthTech', required: true },
    { name: 'problem', label: 'Problem', type: 'textarea', placeholder: 'What problem are you solving?', required: true },
    { name: 'solution', label: 'Solution', type: 'textarea', placeholder: 'How does your product solve it?', required: true },
    { name: 'targetMarket', label: 'Target Market', type: 'input', placeholder: 'e.g., SMBs, enterprise, consumers' },
    { name: 'businessModel', label: 'Business Model', type: 'input', placeholder: 'e.g., SaaS subscription, marketplace fees' },
    { name: 'traction', label: 'Traction', type: 'textarea', placeholder: 'Key metrics, users, revenue, growth' },
    { name: 'team', label: 'Team', type: 'textarea', placeholder: 'Founders and key team members' },
    { name: 'fundingAsk', label: 'Funding Ask', type: 'input', placeholder: 'e.g., $2M seed round' },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-orange-500">PitchDeck</span>
        </h1>
        <p className="text-gray-400 text-lg">AI Pitch Deck Outline Generator</p>
        <p className="text-gray-500 text-sm mt-1">
          Describe your startup, get a structured pitch deck outline with talking points
        </p>
        <div className="mt-3 flex justify-center gap-4 text-sm text-gray-500">
          <span className="bg-gray-800 px-3 py-1 rounded-full">$19 per deck</span>
          <span className="bg-gray-800 px-3 py-1 rounded-full">$39/mo unlimited</span>
        </div>
      </div>

      {!deck ? (
        /* Input Form */
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-5">
          {/* Style Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">Deck Style</label>
            <div className="grid grid-cols-3 gap-3">
              {STYLE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStyle(opt.value)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    style === opt.value
                      ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <div className="font-medium text-sm">{opt.label}</div>
                  <div className="text-xs mt-1 opacity-70">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {fields.map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {field.label}
                {field.required && <span className="text-orange-500 ml-1">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
                />
              ) : (
                <input
                  type="text"
                  name={field.name}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Generating Your Pitch Deck...' : 'Generate Pitch Deck Outline'}
          </button>
        </form>
      ) : (
        /* Deck Viewer */
        <div>
          {/* Deck Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{deck.startupName}</h2>
              <p className="text-gray-500 text-sm">
                {deck.style} style &middot; {deck.slides.length} slides
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => copyToClipboard(formatFullDeck(), 'deck')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {copied === 'deck' ? 'Copied!' : 'Copy Full Outline'}
              </button>
              <button
                onClick={() => { setDeck(null); setCurrentSlide(0); }}
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                New Deck
              </button>
            </div>
          </div>

          {/* Slide Navigator */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {deck.slides.map((slide, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                  currentSlide === i
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                    : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                }`}
              >
                <span>{SLIDE_ICONS[i]}</span>
                <span>{slide.title}</span>
              </button>
            ))}
          </div>

          {/* Current Slide */}
          {deck.slides[currentSlide] && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{SLIDE_ICONS[currentSlide]}</span>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Slide {currentSlide + 1} of {deck.slides.length}
                    </p>
                    <h3 className="text-2xl font-bold text-orange-400">
                      {deck.slides[currentSlide].title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(formatSlideText(deck.slides[currentSlide]), `slide-${currentSlide}`)
                  }
                  className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                >
                  {copied === `slide-${currentSlide}` ? 'Copied!' : 'Copy Slide'}
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
                    Key Points
                  </h4>
                  <ul className="space-y-2">
                    {deck.slides[currentSlide].bullets.map((b, i) => (
                      <li key={i} className="flex gap-2 text-gray-300">
                        <span className="text-orange-500 mt-1">&#x2022;</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
                    Talking Points
                  </h4>
                  <ul className="space-y-2">
                    {deck.slides[currentSlide].talkingPoints.map((t, i) => (
                      <li key={i} className="flex gap-2 text-gray-400">
                        <span className="text-orange-500/60 mt-1">&#x25B8;</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
                    Suggested Visuals
                  </h4>
                  <ul className="space-y-2">
                    {deck.slides[currentSlide].suggestedVisuals.map((v, i) => (
                      <li key={i} className="flex gap-2 text-gray-400">
                        <span className="text-orange-500/40 mt-1">&#x25A0;</span>
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Slide Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
                <button
                  onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                  disabled={currentSlide === 0}
                  className="text-sm text-gray-400 hover:text-orange-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous Slide
                </button>
                <button
                  onClick={() => setCurrentSlide(Math.min(deck.slides.length - 1, currentSlide + 1))}
                  disabled={currentSlide === deck.slides.length - 1}
                  className="text-sm text-gray-400 hover:text-orange-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                  Next Slide →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
