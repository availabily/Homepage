import React from 'react';
import GlassCard from './GlassCard';
import { FadeIn } from './FadeIn';

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
    description: 'Every certificate is permanent, tamper-evident, and independently verifiable. Used as audit evidence across AI Act, FDA, and financial services contexts.',
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
                Live Now
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

            <div className="border border-green-400/20 rounded-xl p-5 bg-green-400/[0.03]">
              <p className="text-sm font-medium text-green-300/90 mb-1">
                Prova is live.
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Paste any AI reasoning chain and get your first certificate in seconds. No account required.
              </p>
              <a
                href="https://prova.cobound.dev"
                className="inline-block px-6 py-3 text-sm font-medium tracking-wide whitespace-nowrap border border-green-400/30 text-green-300 hover:border-green-400/60 hover:bg-green-400/5 transition-all duration-300 rounded-lg"
              >
                Open Prova →
              </a>
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

        {/* Live certificate preview */}
        <FadeIn delay={0.15}>
          <GlassCard className="p-6 md:p-8 mb-12" trimAccent="green">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-1">Certificate</p>
                <p className="text-lg font-mono font-bold text-white">PRV-2026-58D8</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Verdict</p>
                <p className="text-lg font-bold text-green-400">VALID</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/10 pt-4 mb-4">
              <div><p className="text-xs text-gray-500">confidence</p><p className="text-sm text-white">100/100</p></div>
              <div><p className="text-xs text-gray-500">prova</p><p className="text-sm text-white">v1.0.0</p></div>
              <div><p className="text-xs text-gray-500">validator</p><p className="text-sm text-white">v0.1.0</p></div>
              <div><p className="text-xs text-gray-500">theorems</p><p className="text-sm text-white">2,400+</p></div>
            </div>
            <a href="https://prova.cobound.dev/certificate/PRV-2026-58D8" target="_blank" rel="noopener noreferrer" className="text-sm text-green-400 hover:text-green-300 transition-colors">
              View full certificate at prova.cobound.dev →
            </a>
          </GlassCard>
        </FadeIn>

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
              <p className="text-base font-light text-white mb-1">Try Prova now</p>
              <p className="text-sm text-gray-500 mb-6">Get your first certificate in seconds. No account required.</p>
              <a
                href="https://prova.cobound.dev"
                className="inline-block px-8 py-3 text-sm font-medium tracking-wide border border-green-400/30 text-green-300 hover:border-green-400/60 hover:bg-green-400/5 transition-all duration-300 rounded-lg"
              >
                Open Prova →
              </a>
            </GlassCard>
          </div>
        </FadeIn>

      </div>
    </section>
  );
};

export default ProvaSection;
