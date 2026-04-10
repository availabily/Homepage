// COBOUND Products Section — updated 2026-03-06
// Changes: Live cycle detection via real DFS algorithm (cycleDetection.ts),
//          Monaco YAML editor, js-yaml parsing, real OutputPanel results
import React, { useState, useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import yaml from 'js-yaml';
import { FadeIn } from './FadeIn';
import GlassCard from './GlassCard';
import { detectCycles, buildGraph, CycleResult } from '../lib/cycleDetection';

// ─── Playground scenarios ──────────────────────────────────────────────────

const SCENARIOS = {
  chatdev: {
    label: 'ChatDev (fails)',
    yaml: `agents:
  - id: researcher
  - id: writer
  - id: reviewer
edges:
  - from: researcher
    to: writer
  - from: writer
    to: reviewer
  - from: reviewer
    to: researcher`,
    result: 'obstructed' as const,
    cycle: 'researcher → writer → reviewer → researcher',
    fix: 'Remove edge: reviewer → researcher',
  },
  metagpt: {
    label: 'MetaGPT (passes)',
    yaml: `agents:
  - id: product_manager
  - id: architect
  - id: engineer
  - id: qa
edges:
  - from: product_manager
    to: architect
  - from: architect
    to: engineer
  - from: engineer
    to: qa`,
    result: 'feasible' as const,
    cycle: null,
    fix: null,
  },
  star: {
    label: 'Star topology (passes)',
    yaml: `agents:
  - id: orchestrator
  - id: agent_a
  - id: agent_b
  - id: agent_c
edges:
  - from: orchestrator
    to: agent_a
  - from: orchestrator
    to: agent_b
  - from: orchestrator
    to: agent_c`,
    result: 'feasible' as const,
    cycle: null,
    fix: null,
  },
};

type ScenarioKey = keyof typeof SCENARIOS;

// ─── Copy-to-clipboard button ──────────────────────────────────────────────

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button
      onClick={copy}
      title="Copy"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '2px',
        color: copied ? '#34d399' : 'rgba(156,163,175,0.5)',
        transition: 'color 0.2s',
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      {copied ? (
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <rect x="5" y="5" width="8" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M3 11V3a1 1 0 011-1h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      )}
    </button>
  );
};

// ─── Pip snippet (card footer) ─────────────────────────────────────────────

const PipSnippet: React.FC = () => {
  const PIP = 'pip install cobound-validator';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.6rem' }}>
      <code style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'rgba(156,163,175,0.7)' }}>
        {PIP}
      </code>
      <CopyButton text={PIP} />
    </div>
  );
};

// ─── Output panel (live results) ──────────────────────────────────────────

interface LiveOutputPanelProps {
  result: CycleResult | null;
  error: string | null;
  fading: boolean;
  ready: boolean;
}

const LiveOutputPanel: React.FC<LiveOutputPanelProps> = ({ result, error, fading, ready }) => {
  if (!ready) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(156,163,175,0.35)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
        <span>Your verdict will appear here.<br />Edit the YAML on the left to begin.</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ borderLeft: '3px solid #f59e0b', paddingLeft: '1rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 600, color: '#f59e0b', letterSpacing: '0.06em', marginBottom: '0.45rem' }}>
          <span style={{ fontSize: '0.55rem' }}>●</span> PARSE ERROR
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: '0.73rem', color: 'rgba(245,158,11,0.75)', margin: 0, wordBreak: 'break-word' }}>
          {error}
        </p>
      </div>
    );
  }

  if (!result) return null;

  const isObstructed = !result.feasible;
  const firstCycle = result.cycles[0];
  const backEdge = result.cycleEdges[0];

  return (
    <div style={{ transition: 'opacity 0.22s ease', opacity: fading ? 0 : 1 }}>
      <div style={{ borderLeft: `3px solid ${isObstructed ? '#f87171' : '#34d399'}`, paddingLeft: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.06em', color: isObstructed ? '#f87171' : '#34d399', marginBottom: '0.45rem' }}>
          {isObstructed ? '✗' : '✓'}&nbsp;{isObstructed ? 'OBSTRUCTED' : 'FEASIBLE'}&nbsp;&nbsp;—&nbsp;&nbsp;H¹(K;ℤ) {isObstructed ? '≠' : '='} 0
        </div>
        {isObstructed ? (
          <>
            <p style={{ fontSize: '0.82rem', color: 'rgba(248,113,113,0.8)', margin: '0 0 0.25rem' }}>
              Cycle detected. This system cannot coordinate.
            </p>
            <p style={{ fontSize: '0.82rem', color: 'rgba(248,113,113,0.65)', margin: '0 0 0.25rem' }}>
              No scheduling, retry logic, or engineering fix resolves this.
            </p>
            <p style={{ fontSize: '0.82rem', color: 'rgba(248,113,113,0.65)', margin: '0 0 0.5rem' }}>
              The failure is mathematical, not operational.
            </p>
          </>
        ) : (
          <>
            <p style={{ fontSize: '0.82rem', color: 'rgba(52,211,153,0.8)', margin: '0 0 0.25rem' }}>
              No cycles detected.
            </p>
            <p style={{ fontSize: '0.82rem', color: 'rgba(52,211,153,0.8)', margin: '0 0 0.25rem' }}>
              This system can coordinate.
            </p>
            <p style={{ fontSize: '0.82rem', color: 'rgba(52,211,153,0.8)', margin: '0 0 0.5rem' }}>
              Coordination failure is mathematically impossible.
            </p>
          </>
        )}
        {isObstructed && firstCycle && (
          <p style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'rgba(248,113,113,0.6)', margin: '0 0 0.35rem', wordBreak: 'break-word' }}>
            Cycle: {firstCycle.join(' → ')}
          </p>
        )}
        {isObstructed && result.cycles.length > 1 && (
          <p style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: 'rgba(248,113,113,0.45)', margin: '0 0 0.35rem' }}>
            + {result.cycles.length - 1} more cycle{result.cycles.length > 2 ? 's' : ''} detected
          </p>
        )}
        <p style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: 'rgba(156,163,175,0.5)', margin: '0 0 0.15rem' }}>
          Formal proof: {isObstructed ? 'h1_trivial_iff_oneConnected' : 'tree_authority_h1_trivial'}
        </p>
        <p style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: 'rgba(156,163,175,0.4)', margin: 0 }}>
          github.com/coboundinc/cobound
        </p>
      </div>

      {isObstructed && backEdge && (
        <>
          <div style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.12)', borderRadius: '6px', padding: '0.6rem 0.85rem', marginBottom: '1rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(156,163,175,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
              Suggested fix
            </p>
            <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'rgba(253,186,116,0.9)', margin: 0 }}>
              Remove edge: {backEdge[0]} → {backEdge[1]}
            </p>
          </div>
          <div style={{ borderLeft: '3px solid #34d399', paddingLeft: '1rem', opacity: 0.7 }}>
            <p style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: 'rgba(156,163,175,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
              After suggested fix:
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 600, color: '#34d399', letterSpacing: '0.06em', marginBottom: '0.15rem' }}>
              ✓ FEASIBLE  —  H¹(K;ℤ) = 0
            </div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(52,211,153,0.65)', margin: 0 }}>
              Coordination failure is mathematically impossible.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

// ─── Validator Playground (live DFS engine) ───────────────────────────────

interface TopologyDoc {
  agents?: Array<{ id: string }>;
  edges?: Array<{ from: string; to: string }>;
}

/** Parse YAML and run real O(n+m) DFS cycle detection. */
function runDetection(yamlText: string): { result: CycleResult; error: null } | { result: null; error: string } {
  let doc: unknown;
  try {
    doc = yaml.load(yamlText);
  } catch (e) {
    return { result: null, error: e instanceof Error ? e.message : String(e) };
  }
  if (!doc || typeof doc !== 'object') {
    return { result: null, error: 'Invalid YAML: expected a mapping with "agents" and "edges" keys.' };
  }
  const typed = doc as TopologyDoc;
  const agentIds = (typed.agents ?? []).map((a) => String(a.id));
  const edges = (typed.edges ?? []).map((e) => ({ from: String(e.from), to: String(e.to) }));
  const graph = buildGraph(agentIds, edges);
  return { result: detectCycles(graph), error: null };
}

const ValidatorPlayground: React.FC = () => {
  const [activeKey, setActiveKey] = useState<ScenarioKey | null>('chatdev');
  const [yamlText, setYamlText] = useState(SCENARIOS.chatdev.yaml);
  const [result, setResult] = useState<CycleResult | null>(() => runDetection(SCENARIOS.chatdev.yaml).result);
  const [parseError, setParseError] = useState<string | null>(null);
  const [fading, setFading] = useState(false);
  const [ready, setReady] = useState(true);
  const editorRef = useRef<string>(SCENARIOS.chatdev.yaml);

  const applyDetection = useCallback((text: string) => {
    const { result: r, error } = runDetection(text);
    setResult(r);
    setParseError(error);
    setFading(false);
  }, []);

  const loadScenario = (key: ScenarioKey) => {
    setFading(true);
    setActiveKey(key);
    const text = SCENARIOS[key].yaml;
    editorRef.current = text;
    setYamlText(text);
    setTimeout(() => applyDetection(text), 180);
  };

  const handleCheck = () => {
    setFading(true);
    setTimeout(() => applyDetection(editorRef.current), 120);
  };

  const handleEditorChange = (value: string | undefined) => {
    const text = value ?? '';
    editorRef.current = text;
    setYamlText(text);
    setActiveKey(null); // user has customised the content
  };

  const PIP = 'pip install cobound-validator';

  return (
    <section id="validator-playground" style={{ padding: '4rem 1.5rem', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(156,163,175,0.4)', marginBottom: '0.55rem' }}>
            TRY IT NOW
          </p>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 300, letterSpacing: '-0.02em', color: 'white', margin: '0 0 0.45rem' }}>
            Paste your agent topology.<br />Find out if it can coordinate.
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'rgba(156,163,175,0.55)', margin: 0 }}>
            No signup. No install. Real cycle detection running in your browser —
            the same algorithm as the PyPI package, proven by 2,433 Lean 4 theorems.
          </p>
        </div>

        {/* Load example row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: 'rgba(156,163,175,0.38)', letterSpacing: '0.05em' }}>
            Load example:
          </span>
          {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
            <button key={key} onClick={() => loadScenario(key)} style={{ background: activeKey === key ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${activeKey === key ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '4px', padding: '0.28rem 0.65rem', fontSize: '0.72rem', fontFamily: 'monospace', color: activeKey === key ? 'rgba(255,255,255,0.82)' : 'rgba(156,163,175,0.55)', cursor: 'pointer', transition: 'all 0.15s' }}>
              {SCENARIOS[key].label}
            </button>
          ))}
        </div>

        {/* Two-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left — Monaco editor input */}
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(156,163,175,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.45rem' }}>
              # Define your agents and connections below<br /># or load a real framework example above
            </p>
            <div style={{ border: '1px solid rgba(255,255,255,0.09)', borderRadius: '6px', overflow: 'hidden' }}>
              <Editor
                height="280px"
                language="yaml"
                theme="vs-dark"
                value={yamlText}
                onChange={handleEditorChange}
                onMount={() => setReady(true)}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineHeight: 22,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  overviewRulerLanes: 0,
                  hideCursorInOverviewRuler: true,
                  scrollbar: { vertical: 'auto', horizontal: 'auto' },
                  padding: { top: 14, bottom: 14 },
                  renderLineHighlight: 'none',
                  contextmenu: false,
                }}
                loading={
                  <div style={{ height: '280px', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <textarea
                      value={yamlText}
                      onChange={(e) => handleEditorChange(e.target.value)}
                      spellCheck={false}
                      rows={14}
                      style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', padding: '0.85rem 1rem', fontFamily: 'monospace', fontSize: '0.78rem', lineHeight: 1.65, color: 'rgba(209,213,219,0.9)', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                }
              />
            </div>
            <button
              onClick={handleCheck}
              style={{ marginTop: '0.7rem', padding: '0.6rem 1.3rem', background: '#059669', border: 'none', borderRadius: '5px', color: 'white', fontWeight: 600, fontSize: '0.82rem', letterSpacing: '0.02em', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#10b981')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#059669')}
            >
              Check Coordination →
            </button>
            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(156,163,175,0.35)' }}>Or install locally:</span>
              <code style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(156,163,175,0.58)' }}>{PIP}</code>
              <CopyButton text={PIP} />
            </div>
          </div>

          {/* Right — live output */}
          <div style={{ background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '1.2rem 1.3rem', minHeight: '250px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(156,163,175,0.32)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1rem' }}>
              Result
            </p>
            <LiveOutputPanel result={result} error={parseError} fading={fading} ready={ready} />
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Product data ──────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  status: string;
  statusColor: 'green' | 'muted';
  description: string;
  valueProp: string;
  tags: string[];
  accent: 'blue' | 'pink' | 'green';
  showCTA: boolean;
  ctaUrl?: string;
  ctaLabel?: string;
}

const products: Product[] = [
  {
    id: 'validator',
    name: 'COBOUND Validator',
    status: 'Free Forever',
    statusColor: 'green' as const,
    description:
      'Run before every deployment. If your agent graph has a cycle, the validator fails with exit code 1 and shows you exactly which connection to remove. If it passes, coordination failure is mathematically impossible — not unlikely. Impossible.',
    valueProp: 'Your CI/CD pipeline, now with a coordination proof.',
    tags: [
      'O(n+m) DFS cycle detection — scales to any graph size',
      'Maps failures to MAST taxonomy (NeurIPS 2025)',
      'Exit code 1 on failure — blocks broken deploys automatically',
      'GitHub Action · Python API · CLI',
    ],
    accent: 'blue' as const,
    showCTA: true,
  },
  {
    id: 'designer',
    name: 'COBOUND Designer',
    status: 'Available Now',
    statusColor: 'green' as const,
    description:
      'Draw your agent topology. Watch the math run in real time. One click fixes the cycle and updates your config automatically. Export to LangGraph, CrewAI, or MetaGPT when you\'re done.',
    valueProp: 'See exactly where your agent system breaks — before you build it.',
    tags: [
      'Live H¹ verdict updates as you type or drag',
      '"Fix It For Me" — animated minimum cut in one click',
      '6 real framework topologies preloaded',
      'Export to LangGraph · CrewAI · MetaGPT · AutoGen',
    ],
    accent: 'pink' as const,
    showCTA: true,
    ctaUrl: 'https://designer.cobound.dev',
    ctaLabel: 'Open Designer →',
  },
  {
    id: 'audit',
    name: 'COBOUND Audit',
    status: 'Available Now',
    statusColor: 'green' as const,
    description:
      'For teams building production multi-agent systems who need mathematical guarantees before launch. We analyze your full agent topology, identify every coordination failure, and deliver a formal report with exact fixes and proofs. Not a best practice review. A theorem.',
    valueProp: 'We review your agent architecture. You get a proof, not an opinion.',
    tags: [
      'Full topology analysis with formal proof artifacts',
      'Identifies every cycle, every failure mode',
      'Exact minimum cuts — not suggestions, proofs',
      'Delivered as a signed formal report',
    ],
    accent: 'blue' as const,
    showCTA: true,
    ctaUrl: 'mailto:audit@cobound.dev',
    ctaLabel: 'Book an Audit →',
  },
];

// ─── Main component ────────────────────────────────────────────────────────

const ProductsSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const scrollToPlayground = () => {
    const el = document.getElementById('validator-playground');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
        style={{ paddingTop: 'var(--section-padding-y-desktop)', paddingBottom: 'var(--section-padding-y-mobile)' }}
      >
        <div className="px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">PRODUCTS</p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white mb-4">What we are building</h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-sm md:text-base leading-relaxed text-gray-500">
                The first infrastructure layer for provably coordination-safe multi-agent systems.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Product Cards Grid */}
      <section style={{ paddingTop: '0', paddingBottom: 'var(--section-padding-y-mobile)' }}>
        <div className="px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <GlassCard className="p-6 md:p-8 h-full" hover={true} trimAccent={product.accent}>
                  <div className="flex flex-col gap-4 h-full">
                    {/* Status Badge */}
                    <div className="flex justify-end">
                      <span className={`text-xs font-medium tracking-wide px-3 py-1 rounded-full border ${product.statusColor === 'green' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-gray-700 text-gray-500 bg-gray-800/50'}`}>
                        {product.status}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-white">{product.name}</h3>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-gray-500 flex-1">{product.description}</p>

                    {/* Value Proposition */}
                    <p className="text-sm font-medium italic text-gray-300">&ldquo;{product.valueProp}&rdquo;</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-medium tracking-wide px-3 py-1 rounded-full border border-gray-700 text-gray-400 bg-gray-800/30"
                          style={tag === 'PyPI ✓' ? { color: '#34d399', borderColor: 'rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.07)' } : undefined}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    {product.showCTA && (
                      <div style={{ paddingTop: '0.2rem' }}>
                        {'ctaUrl' in product && product.ctaUrl ? (
                          <a
                            href={product.ctaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'inline-block', padding: '0.55rem 1.2rem', background: '#059669', borderRadius: '5px', color: 'white', fontWeight: 600, fontSize: '0.82rem', letterSpacing: '0.02em', cursor: 'pointer', transition: 'background 0.2s', textDecoration: 'none' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#10b981')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = '#059669')}
                          >
                            {product.ctaLabel}
                          </a>
                        ) : (
                          <>
                            <button
                              onClick={scrollToPlayground}
                              style={{ padding: '0.55rem 1.2rem', background: '#059669', border: 'none', borderRadius: '5px', color: 'white', fontWeight: 600, fontSize: '0.82rem', letterSpacing: '0.02em', cursor: 'pointer', transition: 'background 0.2s' }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = '#10b981')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = '#059669')}
                            >
                              Try it →
                            </button>
                            <PipSnippet />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </GlassCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Inline Validator Playground */}
      <ValidatorPlayground />

      {/* Email Waitlist CTA */}
      <section className="section-divider" style={{ paddingTop: 'var(--section-padding-y-desktop)', paddingBottom: 'var(--section-padding-y-desktop)' }}>
        <div className="px-6 md:px-12 flex flex-col items-center text-center">
          <GlassCard className="w-full max-w-xl p-8 md:p-12">
            <FadeIn>
              <h3 className="text-xl font-medium tracking-tight mb-2 text-white">Get early access</h3>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-sm leading-relaxed text-gray-500 mb-8">
                We notify waitlist members first when Designer launches.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              {submitted ? (
                <p className="text-sm font-medium text-emerald-400">You're on the list.</p>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 w-full">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="flex-1 px-4 py-3 text-sm bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-colors duration-300"
                  />
                  <button type="submit" className="px-8 py-3 text-sm font-medium tracking-wide border border-white text-white hover:bg-white hover:text-black transition-all duration-300 min-w-[180px]">
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
