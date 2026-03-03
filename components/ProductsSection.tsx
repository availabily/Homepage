// COBOUND Products Section — added 2026-03-03
import React, { useState } from 'react';
import { FadeIn } from './FadeIn';
import GlassCard from './GlassCard';

const products = [
  {
    name: 'COBOUND VALIDATOR',
    status: 'Coming Q2 2026',
    statusColor: 'muted' as const,
    description:
      'CLI tool and GitHub Action that checks your agent communication topology for coordination feasibility before deployment. Pass your graph. Get a verdict in milliseconds. Integrates into any CI/CD pipeline.',
    valueProp: 'Zero configuration. Linear time. Mathematically guaranteed.',
    tags: ['CLI', 'GitHub Action', 'Free tier'],
    accent: 'blue' as const,
  },
  {
    name: 'COBOUND DESIGNER',
    status: 'Coming Q3 2026',
    statusColor: 'muted' as const,
    description:
      'Visual topology designer for multi-agent architectures. Draw your agents, draw your communication edges, and watch the coordination feasibility indicator update in real time. One-click export to AG2, LangGraph, CrewAI, and MetaGPT.',
    valueProp: 'Design coordination-safe systems before writing a single line of code.',
    tags: ['Web App', 'Visual', 'Team collaboration'],
    accent: 'pink' as const,
  },
  {
    name: 'COBOUND AUDIT',
    status: 'Available Now',
    statusColor: 'green' as const,
    description:
      'We analyze your multi-agent system architecture, map it to its communication complex, compute H\u00B9, and deliver a formal report identifying every coordination obstruction and the exact topology changes required to eliminate them.',
    valueProp: 'For teams that need more than a hunch about why their MAS fails.',
    tags: ['Enterprise', 'Formal report', 'Starting at $25K'],
    accent: 'blue' as const,
  },
];

const ProductsSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      console.log('Waitlist submission:', email);
      setSubmitted(true);
    }
  };

  return (
    <>
      {/* Products Section Header */}
      <section
        className="section-divider"
        style={{
          paddingTop: 'var(--section-padding-y-desktop)',
          paddingBottom: 'var(--section-padding-y-mobile)',
        }}
      >
        <div className="px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
                PRODUCTS
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white mb-4">
                What we are building
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-sm md:text-base leading-relaxed text-gray-500">
                The first infrastructure layer for provably coordination-safe
                multi-agent systems.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Product Cards Grid */}
      <section
        style={{
          paddingTop: '0',
          paddingBottom: 'var(--section-padding-y-mobile)',
        }}
      >
        <div className="px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <GlassCard
                  className="p-6 md:p-8 h-full"
                  hover={true}
                  trimAccent={product.accent}
                >
                  <div className="flex flex-col gap-4 h-full">
                    {/* Status Badge */}
                    <div className="flex justify-end">
                      <span
                        className={`text-xs font-medium tracking-wide px-3 py-1 rounded-full border ${
                          product.statusColor === 'green'
                            ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                            : 'border-gray-700 text-gray-500 bg-gray-800/50'
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-white">
                      {product.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-gray-500 flex-1">
                      {product.description}
                    </p>

                    {/* Value Proposition */}
                    <p className="text-sm font-medium italic text-gray-300">
                      &ldquo;{product.valueProp}&rdquo;
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-medium tracking-wide px-3 py-1 rounded-full border border-gray-700 text-gray-400 bg-gray-800/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Email Waitlist CTA */}
      <section
        className="section-divider"
        style={{
          paddingTop: 'var(--section-padding-y-desktop)',
          paddingBottom: 'var(--section-padding-y-desktop)',
        }}
      >
        <div className="px-6 md:px-12 flex flex-col items-center text-center">
          <GlassCard className="w-full max-w-xl p-8 md:p-12">
            <FadeIn>
              <h3 className="text-xl font-medium tracking-tight mb-2 text-white">
                Get early access
              </h3>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-sm leading-relaxed text-gray-500 mb-8">
                We notify waitlist members first when Validator and Designer
                launch.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              {submitted ? (
                <p className="text-sm font-medium text-emerald-400">
                  You're on the list.
                </p>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col md:flex-row gap-4 w-full"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="flex-1 px-4 py-3 text-sm bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-colors duration-300"
                  />
                  <button
                    type="submit"
                    className="px-8 py-3 text-sm font-medium tracking-wide border border-white text-white hover:bg-white hover:text-black transition-all duration-300 min-w-[180px]"
                  >
                    Join the waitlist
                  </button>
                </form>
              )}
            </FadeIn>
          </GlassCard>
        </div>
      </section>
    </>
  );
};

export default ProductsSection;
