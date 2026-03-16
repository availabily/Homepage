import React, { useState } from 'react';
import GlassCard from './GlassCard';
import { FadeIn } from './FadeIn';
import { motion, AnimatePresence } from 'framer-motion';

interface FeatureItem {
  emoji: string;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    emoji: '🪞',
    title: 'Reflect',
    description: 'Talk to Mirror about anything — your day, your decisions, your doubts. It listens without judgment.',
  },
  {
    emoji: '📝',
    title: 'Journal',
    description: 'Write freely and get AI insight on your entries. Patterns surface that you never noticed.',
  },
  {
    emoji: '🧭',
    title: 'Compass',
    description: "Decision clarity when you're at a crossroads. Mirror helps you see what you actually want.",
  },
  {
    emoji: '📊',
    title: 'Growth Map',
    description: "Track your personal growth over time. See how far you've come and where you're headed.",
  },
];

interface PricingTier {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlight?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    features: [
      '3 reflects per week',
      'No memory between sessions',
      'Gentle tone only',
    ],
  },
  {
    name: 'Mirror+',
    price: '$9.99',
    period: '/mo',
    features: [
      'Unlimited reflections',
      '30-day memory',
      'All honesty levels',
      'Daily nudges',
      'Compass mode',
    ],
    highlight: true,
  },
  {
    name: 'Mirror Deep',
    price: '$19.99',
    period: '/mo',
    features: [
      'Everything in Mirror+',
      'Full pattern dashboard',
      'Unlimited memory (forever)',
      'Growth Map + monthly reports',
      'Priority AI',
      'Export your data',
    ],
  },
];

// ── Waitlist form ─────────────────────────────────────────────────────────────

const WaitlistForm: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'lg' }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    // Submit to Formspree (replace YOUR_FORM_ID or use mailto fallback)
    try {
      await fetch('https://formspree.io/f/myknnnjq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, source: 'cobound-mirror-section' }),
      });
    } catch {
      // Non-blocking — still show success
    }

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3"
      >
        <span className="text-lg">✓</span>
        <span className={`${size === 'lg' ? 'text-base' : 'text-sm'} text-amber-300`}>
          You're on the list. We'll reach out when Mirror opens.
        </span>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex ${size === 'lg' ? 'flex-col sm:flex-row' : 'flex-row'} gap-3`}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className={`
          ${size === 'lg' ? 'flex-1 px-4 py-3 text-sm' : 'flex-1 px-3 py-2 text-xs'}
          bg-transparent border border-white/10 rounded-lg text-white
          placeholder-white/30 focus:outline-none focus:border-amber-400/40
          transition-colors duration-300
        `}
      />
      <button
        type="submit"
        disabled={loading}
        className={`
          ${size === 'lg' ? 'px-6 py-3 text-sm' : 'px-4 py-2 text-xs'}
          font-medium tracking-wide whitespace-nowrap
          border border-amber-400/30 text-amber-300
          hover:border-amber-400/60 hover:bg-amber-400/5
          transition-all duration-300 rounded-lg
          disabled:opacity-50
        `}
      >
        {loading ? 'Joining...' : 'Join waitlist'}
      </button>
    </form>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────

const MirrorSection: React.FC = () => {
  return (
    <section
      id="mirror"
      className="section-divider relative"
      style={{ zIndex: 10, paddingTop: 'var(--section-padding-y-desktop)', paddingBottom: 'var(--section-padding-y-desktop)' }}
    >
      <div className="w-full max-w-screen-xl mx-auto px-6 md:px-12">

        {/* Section header */}
        <FadeIn>
          <div className="mb-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-400/70 block mb-3">
              Introducing Mirror
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white">
                MIRROR — Your AI Reflection Partner
              </h2>
              {/* Early access badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-400/25 bg-amber-400/8 text-amber-400 text-xs font-semibold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Early Access
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Hero quote + early access notice */}
        <FadeIn delay={0.1}>
          <GlassCard className="p-8 md:p-12 mb-10" trimAccent="pink">
            <blockquote className="text-xl md:text-2xl font-light text-gray-200 leading-relaxed mb-6">
              "Most people go their whole life without truly seeing themselves. Mirror changes that."
            </blockquote>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-3xl mb-8">
              Mirror is an AI that helps you understand who you are, how you show up, and who you're becoming.
              It reflects your patterns, tracks your growth, and asks the questions you've been avoiding.
            </p>

            {/* Early access callout */}
            <div className="border border-amber-400/20 rounded-xl p-5 bg-amber-400/[0.03]">
              <p className="text-sm font-medium text-amber-300/90 mb-1">
                Mirror is in private early access.
              </p>
              <p className="text-sm text-gray-400 mb-4">
                We're onboarding users personally to make sure the experience is right. Leave your email and we'll reach out directly.
              </p>
              <WaitlistForm size="lg" />
            </div>
          </GlassCard>
        </FadeIn>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.08}>
              <GlassCard className="p-6 h-full" hover={true} trimAccent="pink">
                <div className="text-2xl mb-3">{feature.emoji}</div>
                <h3 className="text-base font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </GlassCard>
            </FadeIn>
          ))}
        </div>

        {/* Pricing section */}
        <FadeIn delay={0.1}>
          <div className="mb-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-gray-500">Pricing</span>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {pricingTiers.map((tier, i) => (
            <FadeIn key={tier.name} delay={i * 0.1}>
              <GlassCard
                className={`p-7 h-full flex flex-col${tier.highlight ? ' mirror-pricing-highlight' : ''}`}
                hover={true}
                trimAccent={tier.highlight ? 'pink' : 'none'}
              >
                {tier.highlight && (
                  <div className="mb-3">
                    <span className="text-xs font-semibold tracking-widest uppercase text-amber-400/80">Most Popular</span>
                  </div>
                )}
                <div className="mb-5">
                  <h3 className="text-lg font-medium text-white mb-1">{tier.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-light text-white">{tier.price}</span>
                    <span className="text-sm text-gray-500">{tier.period}</span>
                  </div>
                </div>
                <ul className="flex-1 space-y-2 mb-7">
                  {tier.features.map((f) => (
                    <li key={f} className="text-sm text-gray-400 flex items-start gap-2">
                      <span className="text-amber-400/60 mt-0.5 flex-shrink-0">·</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {/* Waitlist instead of broken CTA */}
                <div className="pt-1 border-t border-white/[0.06]">
                  <p className="text-xs text-gray-600 mb-2">Notify me when this launches</p>
                  <WaitlistForm size="sm" />
                </div>
              </GlassCard>
            </FadeIn>
          ))}
        </div>

        {/* Privacy promise */}
        <FadeIn delay={0.2}>
          <GlassCard className="p-6 md:p-8 mb-12">
            <div className="flex items-start gap-4">
              <span className="text-xl flex-shrink-0 mt-0.5">🔒</span>
              <div>
                <h4 className="text-sm font-semibold text-white mb-2 tracking-wide">Mirror's Privacy Promise</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Your conversations are encrypted. We never sell your data. We never train AI on your words.
                  You can delete everything, anytime.
                </p>
              </div>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Final CTA — waitlist, not broken link */}
        <FadeIn delay={0.3}>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-6">
              Mirror is being built carefully. Early users get lifetime pricing.
            </p>
            <GlassCard className="inline-block px-10 py-8 md:py-10 w-full max-w-lg">
              <p className="text-base font-light text-white mb-1">Get early access to Mirror</p>
              <p className="text-sm text-gray-500 mb-6">We'll email you when your spot is ready.</p>
              <WaitlistForm size="lg" />
            </GlassCard>
          </div>
        </FadeIn>

      </div>
    </section>
  );
};

export default MirrorSection;
