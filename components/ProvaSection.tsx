import React, { useState } from 'react';
import GlassCard from './GlassCard';
import { FadeIn } from './FadeIn';
import { motion } from 'framer-motion';

// ── Waitlist form (green-styled, same pattern as Mirror) ────────────────────

const ProvaWaitlistForm: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'lg' }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    try {
      await fetch('https://formspree.io/f/myknnnjq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, source: 'cobound-prova-section' }),
      });
    } catch {
      // Non-blocking
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
        <span className={`${size === 'lg' ? 'text-base' : 'text-sm'} text-green-300`}>
          You're on the list. We'll notify you when Prova launches.
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
          placeholder-white/30 focus:outline-none focus:border-green-400/40
          transition-colors duration-300
        `}
      />
      <button
        type="submit"
        disabled={loading}
        className={`
          ${size === 'lg' ? 'px-6 py-3 text-sm' : 'px-4 py-2 text-xs'}
          font-medium tracking-wide whitespace-nowrap
          border border-green-400/30 text-green-300
          hover:border-green-400/60 hover:bg-green-400/5
          transition-all duration-300 rounded-lg
          disabled:opacity-50
        `}
      >
        {loading ? 'Joining...' : 'Join waitlist'}
      </button>
    </form>
  );
};

// ── Feature data ────────────────────────────────────────────────────────────

interface FeatureItem {
  emoji: string;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    emoji: '📜',
    title: 'Verify',
    description: 'Paste any AI reasoning chain. Get a formal certificate in seconds. VALID or INVALID, with a precise diagnosis.',
  },
  {
    emoji: '🔍',
    title: 'Diagnose',
    description: 'When reasoning fails, Prova shows exactly where: circular reasoning, contradictions, or unsupported leaps.',
  },
  {
    emoji: '🛡️',
    title: 'Certify',
    description: 'Every certificate is permanent, tamper-evident, and independently verifiable. Built for EU AI Act, FDA, and SEC compliance.',
  },
  {
    emoji: '🔗',
    title: 'Integrate',
    description: 'One API call. Works with any AI model: Claude, GPT-4, Gemini, Llama. Drop into LangGraph, CrewAI, or any pipeline.',
  },
];

interface UseCase {
  title: string;
  description: string;
}

const useCases: UseCase[] = [
  { title: 'Medical AI', description: 'Verify diagnostic reasoning before it reaches patients.' },
  { title: 'Legal AI', description: 'Prove contract analysis reasoning is structurally sound.' },
  { title: 'Financial AI', description: 'Certify that lending decisions follow valid logic.' },
];

interface Step {
  number: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  { number: '01', title: 'Paste reasoning', description: 'Any AI chain-of-thought output. Numbered steps, prose, conditional branches.' },
  { number: '02', title: 'Prova analyzes', description: 'Extracts the logical dependency graph. Runs cohomological analysis. H1(K;Z) = 0 means valid.' },
  { number: '03', title: 'Get your certificate', description: 'A permanent, SHA-256 verified certificate with the verdict, the argument graph, and failure diagnosis if invalid.' },
];

// ── Main component ──────────────────────────────────────────────────────────

const ProvaSection: React.FC = () => {
  return (
    <section
      id="prova"
      className="section-divider relative"
      style={{ zIndex: 10, paddingTop: 'var(--section-padding-y-desktop)', paddingBottom: 'var(--section-padding-y-desktop)' }}
    >
      <div className="w-full max-w-screen-xl mx-auto px-6 md:px-12">

        {/* Section header */}
        <FadeIn>
          <div className="mb-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-green-400/70 block mb-3">
              Introducing Prova
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white">
                PROVA -- Formally Verified AI Reasoning
              </h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-green-400/25 bg-green-400/8 text-green-400 text-xs font-semibold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Coming Soon
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Hero quote + early access notice */}
        <FadeIn delay={0.1}>
          <GlassCard className="p-8 md:p-12 mb-10" trimAccent="green">
            <blockquote className="text-xl md:text-2xl font-light text-gray-200 leading-relaxed mb-6">
              "Every AI decision leaves a trail. Prova proves the reasoning was sound."
            </blockquote>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-3xl mb-8">
              Prova takes any AI chain-of-thought reasoning and produces a formal certificate of logical validity.
              Not a probability score. A mathematical proof. Backed by 2,400+ Lean 4 theorems and Cech cohomology.
            </p>

            {/* Early access callout */}
            <div className="border border-green-400/20 rounded-xl p-5 bg-green-400/[0.03]">
              <p className="text-sm font-medium text-green-300/90 mb-1">
                Prova is launching soon.
              </p>
              <p className="text-sm text-gray-400 mb-4">
                We're building the first formally verified reasoning engine for AI. Leave your email and we'll notify you when Prova opens for early access.
              </p>
              <ProvaWaitlistForm size="lg" />
            </div>
          </GlassCard>
        </FadeIn>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.08}>
              <GlassCard className="p-6 h-full" hover={true} trimAccent="green">
                <div className="text-2xl mb-3">{feature.emoji}</div>
                <h3 className="text-base font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </GlassCard>
            </FadeIn>
          ))}
        </div>

        {/* Use case cards */}
        <FadeIn delay={0.1}>
          <div className="mb-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-gray-500">Use Cases</span>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {useCases.map((uc, i) => (
            <FadeIn key={uc.title} delay={i * 0.1}>
              <GlassCard className="p-6 h-full" hover={true} trimAccent="green">
                <h3 className="text-base font-medium text-white mb-2">{uc.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{uc.description}</p>
              </GlassCard>
            </FadeIn>
          ))}
        </div>

        {/* How it works */}
        <FadeIn delay={0.1}>
          <div className="mb-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-gray-500">How It Works</span>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {steps.map((step, i) => (
            <FadeIn key={step.number} delay={i * 0.1}>
              <GlassCard className="p-6 h-full" hover={true} trimAccent="green">
                <span className="text-xs font-mono text-gray-700 block mb-3">{step.number}</span>
                <h3 className="text-base font-medium text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
              </GlassCard>
            </FadeIn>
          ))}
        </div>

        {/* Final CTA */}
        <FadeIn delay={0.3}>
          <div className="text-center">
            <GlassCard className="inline-block px-10 py-8 md:py-10 w-full max-w-lg">
              <p className="text-base font-light text-white mb-1">Get early access to Prova</p>
              <p className="text-sm text-gray-500 mb-6">We'll email you when Prova launches.</p>
              <ProvaWaitlistForm size="lg" />
            </GlassCard>
          </div>
        </FadeIn>

      </div>
    </section>
  );
};

export default ProvaSection;
