import React from 'react';
import { useResearch } from '../context/ResearchContext';
import {
  Dna,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Sliders,
  Network,
  FileText,
  Activity,
  CheckCircle2,
  Layers,
  FlaskConical,
  Scale,
  Microscope,
  Database,
  ExternalLink
} from 'lucide-react';

export function LandingPage() {
  const { navigateTo } = useResearch();

  const handleExplorePlatform = () => {
    navigateTo('dashboard');
  };

  const handleGetStarted = () => {
    navigateTo('login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-teal-500/20">
              <Dna className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900">
                EndoTarget<span className="text-teal-600">.AI</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                Precision Target Discovery
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#about" className="hover:text-teal-600 transition-colors">About Platform</a>
            <a href="#how-it-works" className="hover:text-teal-600 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-teal-600 transition-colors">Key Features</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExplorePlatform}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Live Demo
            </button>
            <button
              onClick={handleGetStarted}
              className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-teal-600 rounded-lg transition-colors shadow-sm flex items-center gap-2 group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-slate-100/60 pt-16 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>AI-Powered Biomedical Research & Target Prioritization Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-slate-950 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Discover. Analyse. Prioritize. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-700">
              Accelerate Endometriosis Drug Discovery.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            EndoTarget AI analyses scientific biomedical literature and biological databases to extract, evaluate, and prioritize high-confidence drug targets for endometriosis using an explainable, multi-parameter AI scoring engine.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-8 py-3.5 text-base font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-lg shadow-teal-600/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleExplorePlatform}
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-800 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Microscope className="w-5 h-5 text-teal-600" />
              <span>Explore Platform (Live Demo)</span>
            </button>
          </div>

          {/* Highlights row */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm">
              <span className="text-2xl font-heading font-extrabold text-teal-600">190M+</span>
              <p className="text-xs text-slate-600 mt-1 font-medium">Affected Patients Globally</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm">
              <span className="text-2xl font-heading font-extrabold text-slate-900">7-10 Yrs</span>
              <p className="text-xs text-slate-600 mt-1 font-medium">Average Diagnosis Delay</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm">
              <span className="text-2xl font-heading font-extrabold text-cyan-600">6-Metric</span>
              <p className="text-xs text-slate-600 mt-1 font-medium">Weighted AI Prioritization</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm">
              <span className="text-2xl font-heading font-extrabold text-emerald-600">100%</span>
              <p className="text-xs text-slate-600 mt-1 font-medium">Literature Traceable Evidence</p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: ABOUT THE PLATFORM */}
      <section id="about" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
              Biomedical Target Discovery Engine
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-slate-950 mt-2">
              Transforming Unstructured Literature into Validated Therapeutic Hypotheses
            </h2>
            <p className="mt-4 text-slate-600 text-sm leading-relaxed">
              Endometriosis is a complex gynaecological disorder characterized by the presence of endometrial-like tissue outside the uterus. Disease pathology involves inflammation, hormonal signaling, immune dysfunction, angiogenesis, and progressive pelvic fibrosis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="font-heading font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                  <Database className="w-5 h-5 text-teal-600" />
                  The Problem: Literature Overload & Translation Gap
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Over 35,000 scientific papers exist for endometriosis, yet over 90% of candidate drugs fail in early development due to overreliance on rodent models that do not naturally menstruate, failing to translate into human efficacy.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="font-heading font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-600" />
                  The Solution: Explainable AI Prioritization
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  EndoTarget AI rigorously weighs human surgical biopsy evidence (25%), direct pathological association (20%), biological pathway centrality (15%), chemical druggability (15%), literature consistency (15%), and research novelty (10%) to highlight the highest-value therapeutic candidates.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl border border-slate-700">
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                  <FlaskConical className="w-4 h-4" />
                  Top 3 Prioritized Targets Sample
                </div>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono-code">
                  Consensus Weights
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="font-mono-code font-bold text-teal-400 text-sm">#1 ESR2</span>
                    <p className="text-slate-300 text-[11px]">Estrogen Receptor Beta • Progesterone Resistance</p>
                  </div>
                  <span className="text-sm font-bold text-teal-400 bg-teal-950 px-2.5 py-1 rounded border border-teal-800">
                    94/100
                  </span>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="font-mono-code font-bold text-cyan-400 text-sm">#2 PTGS2</span>
                    <p className="text-slate-300 text-[11px]">COX-2 • PGE2 Synthesis & Pain Sensitization</p>
                  </div>
                  <span className="text-sm font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
                    91/100
                  </span>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="font-mono-code font-bold text-emerald-400 text-sm">#3 VEGFA</span>
                    <p className="text-slate-300 text-[11px]">VEGF-A • Microvascular Neuroangiogenesis</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                    89/100
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-4 text-center">
                Transparently explains WHY every target received its rank with linked PubMed citations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Systematic Workflow</span>
            <h2 className="text-3xl font-heading font-extrabold text-slate-950 mt-2">
              How EndoTarget AI Accelerates Target Discovery
            </h2>
            <p className="mt-4 text-slate-600 text-sm">
              From PDF scientific literature to actionable preclinical target validation in 5 steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: "01",
                title: "Collect Papers",
                desc: "Ingest PDF papers and connect to PubMed, UniProt, and Open Targets Platform.",
                icon: BookOpen,
              },
              {
                step: "02",
                title: "Extract Entities",
                desc: "Biomedical NLP identifies genes, proteins, receptors, and biological signaling pathways.",
                icon: Dna,
              },
              {
                step: "03",
                title: "Classify Evidence",
                desc: "Distinguish human clinical biopsy studies from animal models and in-vitro assays.",
                icon: ShieldCheck,
              },
              {
                step: "04",
                title: "Rank Targets",
                desc: "Compute multi-parameter priority scores with transparent scientific weightings.",
                icon: Sliders,
              },
              {
                step: "05",
                title: "Generate Reports",
                desc: "Export comprehensive PDF dossiers and interactive pathway visual diagrams.",
                icon: FileText,
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm relative group hover:border-teal-400 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-sm mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono-code font-bold text-teal-600">{item.step}</span>
                  <h3 className="font-heading font-bold text-slate-900 text-sm mt-1">{item.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: KEY FEATURES */}
      <section id="features" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Platform Capabilities</span>
            <h2 className="text-3xl font-heading font-extrabold text-slate-950 mt-2">
              Engineered for Biomedical & Drug Discovery Researchers
            </h2>
            <p className="mt-4 text-slate-600 text-sm">
              Comprehensive tools designed to eliminate blindspots in translational endometriosis pipelines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "AI Research Paper Analyzer",
                desc: "Upload scientific PDF papers to automatically extract objectives, experimental models, identified genes/proteins, and disease mechanisms without hallucinations.",
                icon: BookOpen,
                page: "library",
              },
              {
                title: "Target Discovery & Profiling",
                desc: "Explore potential targets categorized across Inflammation, Hormonal Signaling, Angiogenesis, Fibrosis, and Immune Dysfunction with multi-factor filters.",
                icon: Dna,
                page: "discovery",
              },
              {
                title: "Explainable Target Ranking",
                desc: "Dynamic 6-parameter scoring model. Tweak weights in real-time and inspect transparent, natural-language justifications for every ranking decision.",
                icon: Sliders,
                page: "ranking",
              },
              {
                title: "Human vs Animal Evidence",
                desc: "Strictly separates patient clinical findings and human ectopic tissue biopsies from preclinical animal models to prevent translational attrition.",
                icon: ShieldCheck,
                page: "ranking",
              },
              {
                title: "Interactive Pathway Explorer",
                desc: "Visualize interconnected signaling cascades: Cytokine storm, PGE2 synthesis, ER-beta overexpression, VEGF neovascularization, and TGF-beta fibrosis.",
                icon: Network,
                page: "pathway",
              },
              {
                title: "Dossier & Report Studio",
                desc: "Save promising targets, manage personal lab notes, compare candidates side-by-side, and generate presentation-ready PDF research reports.",
                icon: FileText,
                page: "workspace",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-4 shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading font-bold text-slate-900 text-base mb-2">{feature.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{feature.desc}</p>
                  </div>
                  <button
                    onClick={() => navigateTo(feature.page)}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 self-start"
                  >
                    <span>Launch Feature</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
                  <Dna className="w-5 h-5" />
                </div>
                <span className="font-heading font-bold text-white text-base">EndoTarget AI</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                AI-based drug target identification and prioritization platform accelerating endometriosis translational research.
              </p>
            </div>

            <div>
              <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider mb-3">
                Platform Pages
              </h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigateTo('dashboard')} className="hover:text-white transition-colors">Research Dashboard</button></li>
                <li><button onClick={() => navigateTo('library')} className="hover:text-white transition-colors">Research Library & Analyzer</button></li>
                <li><button onClick={() => navigateTo('discovery')} className="hover:text-white transition-colors">Target Discovery</button></li>
                <li><button onClick={() => navigateTo('ranking')} className="hover:text-white transition-colors">Target Ranking</button></li>
                <li><button onClick={() => navigateTo('pathway')} className="hover:text-white transition-colors">Pathway Explorer</button></li>
                <li><button onClick={() => navigateTo('workspace')} className="hover:text-white transition-colors">Workspace & Reports</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider mb-3">
                Biomedical Databases
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>PubMed & Europe PMC</li>
                <li>UniProt Knowledgebase</li>
                <li>Open Targets Platform</li>
                <li>STRING Protein-Protein Network</li>
                <li>ChEMBL Bioactivity Database</li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider mb-3">
                Scientific Compliance
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Intended exclusively for academic, pharmaceutical, and biotechnology research. Target scores reflect automated literature synthesis and algorithm calibration.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} EndoTarget AI. All rights reserved.</p>
            <p className="text-slate-400 text-center max-w-xl">
              <strong className="text-slate-300">Important Disclaimer:</strong> EndoTarget AI is a research-support platform for biomedical researchers and drug discovery scientists. It is not a diagnostic tool or a medical treatment recommendation system.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
