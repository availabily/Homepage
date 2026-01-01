import React, { useState, useEffect, useRef } from 'react';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { FadeIn } from './components/FadeIn';
import AmbientBackground from './components/AmbientBackground';
import GlassCard from './components/GlassCard';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showForm, setShowForm] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
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

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API submission
    setTimeout(() => {
      setFormSuccess(true);
    }, 500);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDark ? 'bg-black text-white selection:bg-gray-800' : 'bg-white text-black selection:bg-gray-200'}`}>

      {/* Ambient Background Layer (activates after hero) */}
      <AmbientBackground isActive={auroraActive} />

      {/* Lamp Icon / Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-2 text-gray-500 hover:text-gray-400 transition-colors focus:outline-none"
        aria-label="Toggle theme"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v8" />
          <path d="M5.7 10h12.6c.9 0 1.2.9.7 1.6l-2.9 4.4a5 5 0 0 1-8.2 0l-2.9-4.4c-.5-.7-.2-1.6.7-1.6Z" />
        </svg>
      </button>

      {/* Hero Section */}
      <Hero ref={heroRef} theme={theme} onRequestAccess={() => setShowForm(true)} />

      {/* Main Content Wrapper - z-index removed to allow ambient background to show through */}
      <main className="relative w-full max-w-screen-xl mx-auto" style={{ zIndex: 10 }}>

        {/* SECTION 1: Manifesto / Philosophy */}
        <section className="section-divider" style={{ paddingTop: 'var(--section-padding-y-mobile)', paddingBottom: 'var(--section-padding-y-mobile)' }}>
          <div className="px-6 md:px-12">
            <GlassCard className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-12 p-8 md:p-12" trimAccent="blue">
            <div className="md:col-span-4">
              <FadeIn>
                <h2 className={`text-xs font-semibold tracking-widest uppercase sticky top-32 transition-colors duration-500 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Manifesto
                </h2>
              </FadeIn>
            </div>

            <div className="md:col-span-8">
              <div className="space-y-16">
                {[
                  "AI should not wait to be prompted.",
                  "Software should not require constant supervision.",
                  "Intelligence should persist, compound, and act."
                ].map((text, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div className="group flex flex-col gap-4">
                      <span className={`text-xs font-mono transition-colors duration-500 ${isDark ? 'text-gray-700' : 'text-gray-300'}`}>
                        {(i + 1).toString().padStart(2, '0')}
                      </span>
                      <p className={`text-2xl md:text-3xl font-light tracking-tight transition-colors duration-500 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        {text}
                      </p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </GlassCard>
          </div>
        </section>

        {/* SECTION 2: Mission Statement */}
        <section className="section-divider" style={{ paddingTop: 'var(--section-padding-y-desktop)', paddingBottom: 'var(--section-padding-y-desktop)' }}>
          <div className="px-6 md:px-12">
            <GlassCard className="max-w-4xl mx-auto text-center md:text-left p-8 md:p-12">
            <FadeIn>
              <p className={`text-3xl md:text-5xl font-normal tracking-tight leading-[1.15] transition-colors duration-500 ${isDark ? 'text-white' : 'text-black'}`}>
                We build systems designed to move work forward on their own.
              </p>
            </FadeIn>
            </GlassCard>
          </div>
        </section>

        {/* SECTION 3: Capabilities - PREMIUM REFACTOR */}
        <section className="section-divider" style={{ paddingTop: 'var(--section-padding-y-mobile)', paddingBottom: 'var(--section-padding-y-mobile)' }}>
          <div className="px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-12">
              {/* Left column: Label + Thesis */}
              <div className="md:col-span-4">
                <FadeIn>
                  <div className="sticky top-32 space-y-6">
                    <h2 className={`text-xs font-semibold tracking-widest uppercase transition-colors duration-500 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Capabilities
                    </h2>
                    <p className={`text-sm leading-relaxed transition-colors duration-500 ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
                      Building the infrastructure for autonomous intelligence that persists and executes.
                    </p>
                  </div>
                </FadeIn>
              </div>

              {/* Right column: 2x2 grid of capability cards */}
              <div className="md:col-span-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: "AI Operating System Foundations", accent: "blue" },
                    { title: "Autonomous Execution Layers", accent: "pink" },
                    { title: "Persistent Intelligence Infrastructure", accent: "blue" },
                    { title: "Internal Systems that Plan, Reason, and Act Over Time", accent: "pink" }
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

        {/* Why This Matters */}
        <section className="section-divider" style={{ paddingTop: 'var(--section-padding-y-desktop)', paddingBottom: 'var(--section-padding-y-desktop)' }}>
          <div className="px-6 md:px-12">
            <GlassCard className="max-w-3xl mx-auto text-center p-8 md:p-12">
            <div className="space-y-12">
              <FadeIn delay={0}>
                <div className="space-y-2">
                  <p className={`text-2xl md:text-3xl transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Most AI responds.</p>
                  <p className={`text-2xl md:text-3xl transition-colors duration-500 ${isDark ? 'text-white' : 'text-black'}`}>Ours operates.</p>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className={`w-px h-12 mx-auto transition-colors duration-500 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="space-y-2">
                  <p className={`text-2xl md:text-3xl transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Most systems generate output.</p>
                  <p className={`text-2xl md:text-3xl transition-colors duration-500 ${isDark ? 'text-white' : 'text-black'}`}>We focus on continuity and execution.</p>
                </div>
              </FadeIn>
            </div>
            </GlassCard>
          </div>
        </section>

        {/* Who It's For */}
        <section className="section-divider" style={{ paddingTop: 'var(--section-padding-y-mobile)', paddingBottom: 'var(--section-padding-y-mobile)' }}>
          <div className="px-6 md:px-12">
            <GlassCard className="max-w-2xl mx-auto text-center p-8 md:p-12" trimAccent="pink">
            <FadeIn>
              <p className={`text-lg leading-relaxed font-light transition-colors duration-500 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                Insinuate is for operators and early adopters who understand where intelligent systems are heading — and want to be early.
              </p>
            </FadeIn>
            </GlassCard>
          </div>
        </section>

        {/* Access / CTA Section */}
        <section id="access-section" className="section-divider" style={{ paddingTop: 'var(--section-padding-y-desktop)', paddingBottom: 'var(--section-padding-y-desktop)' }}>
          <div className="px-6 md:px-12 flex flex-col items-center text-center">
            <GlassCard className="w-full max-w-xl p-8 md:p-12">
            <FadeIn>
              <h3 className={`text-xl font-medium tracking-tight mb-8 transition-colors duration-500 ${isDark ? 'text-white' : 'text-black'}`}>
                We are selectively opening early access to<br className="hidden md:block" /> internal systems and experiments.
              </h3>
            </FadeIn>

            <div className="flex flex-col items-center gap-4 w-full">
              {!showForm && !formSuccess && (
                <FadeIn delay={0.2}>
                  <div className="flex flex-col items-center gap-4">
                    <button
                      onClick={() => setShowForm(true)}
                      className={`
                        px-8 py-4
                        text-sm font-medium tracking-wide
                        transition-colors duration-300
                        min-w-[200px]
                        ${isDark
                          ? 'bg-white text-black hover:bg-gray-200'
                          : 'bg-black text-white hover:bg-gray-800'
                        }
                      `}
                    >
                      Request early access
                    </button>
                    <span className={`text-xs font-medium mt-2 transition-colors duration-500 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Not all requests are accepted.
                    </span>
                  </div>
                </FadeIn>
              )}

              {showForm && !formSuccess && (
                 <FadeIn>
                   <form onSubmit={handleFormSubmit} className="flex flex-col gap-6 w-full max-w-sm mx-auto mt-4 text-left">
                     <div>
                       <label htmlFor="name" className="sr-only">Name</label>
                       <input
                         type="text"
                         id="name"
                         placeholder="NAME"
                         required
                         className={`w-full bg-transparent border-b p-3 text-sm focus:outline-none transition-colors duration-300 ${
                           isDark
                             ? 'border-gray-800 focus:border-white text-white placeholder-gray-600'
                             : 'border-gray-200 focus:border-black text-black placeholder-gray-400'
                         }`}
                       />
                     </div>
                     <div>
                       <label htmlFor="email" className="sr-only">Email</label>
                       <input
                         type="email"
                         id="email"
                         placeholder="EMAIL"
                         required
                         className={`w-full bg-transparent border-b p-3 text-sm focus:outline-none transition-colors duration-300 ${
                           isDark
                             ? 'border-gray-800 focus:border-white text-white placeholder-gray-600'
                             : 'border-gray-200 focus:border-black text-black placeholder-gray-400'
                         }`}
                       />
                     </div>
                     <div className="pt-4 flex justify-center">
                       <button
                        type="submit"
                        className={`
                          px-8 py-3
                          text-sm font-medium tracking-wide
                          border
                          transition-all duration-300
                          ${isDark
                            ? 'border-white text-white hover:bg-white hover:text-black'
                            : 'border-black text-black hover:bg-black hover:text-white'
                          }
                        `}
                       >
                         Submit Request
                       </button>
                     </div>
                   </form>
                 </FadeIn>
              )}

              {formSuccess && (
                <FadeIn>
                  <div className={`p-8 border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                    <p className={`text-lg font-light ${isDark ? 'text-white' : 'text-black'}`}>
                      Request received.
                    </p>
                    <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      We will be in touch if there is a fit.
                    </p>
                  </div>
                </FadeIn>
              )}
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
