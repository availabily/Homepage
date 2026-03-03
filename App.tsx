import React, { useState, useEffect, useRef } from 'react';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { FadeIn } from './components/FadeIn';
import AmbientBackground from './components/AmbientBackground';
import GlassCard from './components/GlassCard';

const App: React.FC = () => {
  const theme = 'dark' as const;
  const [auroraActive, setAuroraActive] = useState(false);
  const isDark = theme === 'dark';

  // Refs for intersection observers
  const heroRef = useRef<HTMLElement>(null);

  // Update body background to avoid overscroll color mismatch
  useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#050505' : '#ffffff';
    document.body.style.color = isDark ? '#ffffff' : '#000000';
  }, [isDark]);

  // IntersectionObserver to activate aurora when hero exits viewport
  useEffect(() => {
    if (!heroRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Activate aurora when hero is less than 20% visible
          if (entry.intersectionRatio < 0.2) {
            setAuroraActive(true);
          } else {
            setAuroraActive(false);
          }
        });
      },
      {
        threshold: [0, 0.2, 0.5, 0.8, 1.0],
        rootMargin: '0px',
      }
    );

    observer.observe(heroRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);


  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDark ? 'bg-black text-white selection:bg-gray-800' : 'bg-white text-black selection:bg-gray-200'}`}>

      {/* Ambient Background Layer (activates after hero) */}
      <AmbientBackground isActive={auroraActive} />


      {/* Hero Section */}
      <Hero ref={heroRef} theme={theme} />

      {/* Main Content Wrapper - z-index removed to allow ambient background to show through */}
      <main className="relative w-full max-w-screen-xl mx-auto" style={{ zIndex: 10 }}>

        {/* SECTION 1: Value Propositions */}
        <section className="section-divider" style={{ paddingTop: 'var(--section-padding-y-mobile)', paddingBottom: 'var(--section-padding-y-mobile)' }}>
          <div className="px-6 md:px-12">
            <GlassCard className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-12 p-8 md:p-12" trimAccent="blue">
              <div className="md:col-span-4">
                <FadeIn>
                  <h2 className={`text-xs font-semibold tracking-widest uppercase sticky top-32 transition-colors duration-500 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Why COBOUND
                  </h2>
                </FadeIn>
              </div>

              <div className="md:col-span-8">
                <div className="space-y-16">
                  {[
                    { heading: "Prove it before you ship it.", body: "Check coordination feasibility in linear time before deployment. No more discovering topology failures at runtime." },
                    { heading: "Mathematically guaranteed.", body: "Not tested. Not hoped for. Proven. Every claim is machine-checked by Lean 4's kernel." },
                    { heading: "Built on empirical evidence.", body: "Our formal results explain the 44.2% system design failure rate documented across 7 MAS frameworks in 1,642 execution traces." }
                  ].map((item, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                      <div className="group flex flex-col gap-4">
                        <span className={`text-xs font-mono transition-colors duration-500 ${isDark ? 'text-gray-700' : 'text-gray-300'}`}>
                          {(i + 1).toString().padStart(2, '0')}
                        </span>
                        <p className={`text-2xl md:text-3xl font-light tracking-tight transition-colors duration-500 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                          {item.heading}
                        </p>
                        <p className={`text-sm leading-relaxed transition-colors duration-500 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {item.body}
                        </p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* SECTION 2: Core Result */}
        <section className="section-divider" style={{ paddingTop: 'var(--section-padding-y-desktop)', paddingBottom: 'var(--section-padding-y-desktop)' }}>
          <div className="px-6 md:px-12">
            <GlassCard className="max-w-4xl mx-auto text-center md:text-left p-8 md:p-12">
              <FadeIn>
                <p className={`text-3xl md:text-5xl font-normal tracking-tight leading-[1.15] transition-colors duration-500 ${isDark ? 'text-white' : 'text-black'}`}>
                  Coordination is feasible if and only if the communication graph is a forest.
                </p>
              </FadeIn>
            </GlassCard>
          </div>
        </section>

        {/* SECTION 3: Key Facts */}
        <section className="section-divider" style={{ paddingTop: 'var(--section-padding-y-mobile)', paddingBottom: 'var(--section-padding-y-mobile)' }}>
          <div className="px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-12">
              {/* Left column: Label + Thesis */}
              <div className="md:col-span-4">
                <FadeIn>
                  <div className="sticky top-32 space-y-6">
                    <h2 className={`text-xs font-semibold tracking-widest uppercase transition-colors duration-500 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      The Proof
                    </h2>
                    <p className={`text-sm leading-relaxed transition-colors duration-500 ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
                      Fully verified in Lean 4 using Mathlib — zero unproven goals, zero axioms.
                    </p>
                  </div>
                </FadeIn>
              </div>

              {/* Right column: 2x3 grid of stat cards */}
              <div className="md:col-span-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: "2,433 formally verified theorems", accent: "blue" },
                    { title: "59,782 lines of Lean 4", accent: "pink" },
                    { title: "0 unproven goals", accent: "blue" },
                    { title: "0 axioms", accent: "pink" },
                    { title: "O(n+m) pre-deployment feasibility check", accent: "blue" },
                    { title: "Explains 44.2% of MAS failures (MAST, NeurIPS 2025)", accent: "pink" }
                  ].map((item, index) => (
                    <FadeIn key={index} delay={index * 0.1}>
                      <GlassCard
                        className="p-6 h-full"
                        hover={true}
                        trimAccent={item.accent as 'blue' | 'pink'}
                      >
                        <div className="flex flex-col gap-4 h-full">
                          <div className={`w-8 h-px transition-colors duration-500 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                          <p className={`text-base font-light tracking-tight leading-snug transition-colors duration-500 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                            {item.title}
                          </p>
                        </div>
                      </GlassCard>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Core Insight */}
        <section className="section-divider" style={{ paddingTop: 'var(--section-padding-y-desktop)', paddingBottom: 'var(--section-padding-y-desktop)' }}>
          <div className="px-6 md:px-12">
            <GlassCard className="max-w-3xl mx-auto text-center p-8 md:p-12">
              <div className="space-y-12">
                <FadeIn delay={0}>
                  <div className="space-y-2">
                    <p className={`text-2xl md:text-3xl transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>When communication graphs contain cycles,</p>
                    <p className={`text-2xl md:text-3xl transition-colors duration-500 ${isDark ? 'text-white' : 'text-black'}`}>coordination is mathematically impossible.</p>
                  </div>
                </FadeIn>

                <FadeIn delay={0.2}>
                  <div className={`w-px h-12 mx-auto transition-colors duration-500 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                </FadeIn>

                <FadeIn delay={0.4}>
                  <div className="space-y-2">
                    <p className={`text-2xl md:text-3xl transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Not difficult.</p>
                    <p className={`text-2xl md:text-3xl transition-colors duration-500 ${isDark ? 'text-white' : 'text-black'}`}>Impossible.</p>
                  </div>
                </FadeIn>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* What COBOUND Is */}
        <section className="section-divider" style={{ paddingTop: 'var(--section-padding-y-mobile)', paddingBottom: 'var(--section-padding-y-mobile)' }}>
          <div className="px-6 md:px-12">
            <GlassCard className="max-w-2xl mx-auto text-center p-8 md:p-12" trimAccent="pink">
              <FadeIn>
                <p className={`text-lg leading-relaxed font-light transition-colors duration-500 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                  COBOUND is a mathematical infrastructure project. We apply Čech cohomology to characterize when multi-agent AI coordination is possible. The core theorem: H¹(K) = 0 if and only if the communication topology is acyclic.
                </p>
              </FadeIn>
            </GlassCard>
          </div>
        </section>

        {/* CTA Section */}
        <section id="access-section" className="section-divider" style={{ paddingTop: 'var(--section-padding-y-desktop)', paddingBottom: 'var(--section-padding-y-desktop)' }}>
          <div className="px-6 md:px-12 flex flex-col items-center text-center">
            <GlassCard className="w-full max-w-xl p-8 md:p-12">
              <FadeIn>
                <h3 className={`text-xl font-medium tracking-tight mb-8 transition-colors duration-500 ${isDark ? 'text-white' : 'text-black'}`}>
                  Explore the proof.
                </h3>
              </FadeIn>

              <div className="flex flex-col items-center gap-4 w-full">
                <FadeIn delay={0.2}>
                  <div className="flex flex-col items-center gap-4">
                    <a
                      href="https://github.com/coboundinc-source/cobound"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        px-8 py-3
                        text-sm font-medium tracking-wide
                        border
                        transition-all duration-300
                        min-w-[200px]
                        text-center
                        ${isDark
                          ? 'border-white text-white hover:bg-white hover:text-black'
                          : 'border-black text-black hover:bg-black hover:text-white'
                        }
                      `}
                    >
                      View the Code
                    </a>
                  </div>
                </FadeIn>
              </div>
            </GlassCard>
          </div>
        </section>

      </main>

      <Footer theme={theme} />
    </div>
  );
};

export default App;
