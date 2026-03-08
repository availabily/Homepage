import React from 'react';
import GlassCard from './GlassCard';
import { FadeIn } from './FadeIn';

const MIRROR_URL = 'https://mirror.cobound.dev';

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
  cta: string;
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
    cta: 'Start Free',
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
    cta: 'Start Free',
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
      'Audio summaries',
      'Export your data',
    ],
    cta: 'Start Free',
  },
];

const MirrorSection: React.FC = () => {
  return (
    <section id="mirror" className="section-divider relative" style={{ zIndex: 10, paddingTop: 'var(--section-padding-y-desktop)', paddingBottom: 'var(--section-padding-y-desktop)' }}>
      <div className="w-full max-w-screen-xl mx-auto px-6 md:px-12">

        {/* Section header */}
        <FadeIn>
          <div className="mb-12 md:mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-400/70 block mb-3">
              Introducing Mirror
            </span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white">
              MIRROR — Your AI Reflection Partner
            </h2>
          </div>
        </FadeIn>

        {/* Hero quote + description */}
        <FadeIn delay={0.1}>
          <GlassCard className="p-8 md:p-12 mb-10" trimAccent="pink">
            <blockquote className="text-xl md:text-2xl font-light text-gray-200 leading-relaxed mb-6">
              "Most people go their whole life without truly seeing themselves. Mirror changes that."
            </blockquote>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-3xl">
              Mirror is an AI that helps you understand who you are, how you show up, and who you're becoming.
              It reflects your patterns, tracks your growth, and asks the questions you've been avoiding.
            </p>
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
                <a
                  href={MIRROR_URL}
                  className="mirror-cta-btn text-sm font-medium text-center block"
                >
                  {tier.cta}
                </a>
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

        {/* Primary CTA */}
        <FadeIn delay={0.3}>
          <div className="text-center">
            <a
              href={MIRROR_URL}
              className="inline-block px-10 py-4 text-sm font-medium tracking-wide text-white border border-amber-400/30 hover:border-amber-400/60 hover:bg-amber-400/5 transition-all duration-300 rounded-none"
            >
              Start seeing yourself clearly →
            </a>
          </div>
        </FadeIn>

      </div>
    </section>
  );
};

export default MirrorSection;
