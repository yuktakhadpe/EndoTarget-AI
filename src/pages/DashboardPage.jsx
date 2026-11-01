import React from 'react';
import { useResearch } from '../context/ResearchContext';
import { EvidenceBadge, CategoryBadge } from '../components/EvidenceBadge';
import { PriorityScoreBar } from '../components/PriorityScoreBar';
import {
  BookOpen,
  Dna,
  Sliders,
  Network,
  ArrowRight,
  TrendingUp,
  BookmarkCheck,
  FileUp,
  Search,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export function DashboardPage() {
  const {
    user,
    navigateTo,
    targets,
    papers,
    savedTargetIds,
    savedPaperIds,
    openTargetDetails,
    weights,
  } = useResearch();

  const top5Targets = targets.slice(0, 5);

  const stats = [
    {
      label: "Research Papers Analysed",
      value: papers.length,
      unit: "Peer-reviewed publications",
      change: "+2 this week",
      icon: BookOpen,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      label: "Potential Targets Identified",
      value: targets.length,
      unit: "Genes & protein targets",
      change: "Indexed in UniProt/NCBI",
      icon: Dna,
      color: "text-teal-600 bg-teal-50 border-teal-200",
    },
    {
      label: "Targets Prioritized",
      value: targets.filter(t => t.calculatedScore >= 80).length,
      unit: "High priority candidates (Score ≥ 80)",
      change: "6-metric AI algorithm",
      icon: Sliders,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      label: "Workspace Items Saved",
      value: savedTargetIds.length + savedPaperIds.length,
      unit: `${savedTargetIds.length} targets, ${savedPaperIds.length} papers`,
      change: "Active research dossier",
      icon: BookmarkCheck,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto min-h-full">
      
      {/* 1. WELCOME SECTION */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-6 sm:p-8 text-white shadow-lg border border-slate-700">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Biomedical Drug Discovery Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white">
            Welcome to EndoTarget AI, {user?.name || "Researcher"}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Your centralized platform for extracting, evaluating, and prioritizing therapeutic targets for endometriosis from unstructured scientific literature and biological databases.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigateTo('ranking')}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-2 group"
            >
              <span>Inspect Prioritized Targets</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => navigateTo('library')}
              className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-600 transition-colors flex items-center gap-2"
            >
              <FileUp className="w-3.5 h-3.5 text-teal-400" />
              <span>Upload Scientific Paper</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative DNA background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-teal-500/10 to-transparent pointer-events-none hidden md:block" />
      </div>

      {/* 2. RESEARCH STATISTICS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            Research Platform Statistics
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">Real-time repository counts</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500">{stat.label}</span>
                  <div className={`p-2 rounded-lg border ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-heading font-extrabold text-slate-900">{stat.value}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600">{stat.unit}</span>
                  <span className="text-teal-700 font-semibold">{stat.change}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. TOP 5 PRIORITIZED TARGETS & QUICK ACCESS BUTTONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Top 5 Prioritized Targets (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-600" />
                Top 5 Prioritized Drug Targets
              </h2>
              <p className="text-xs text-slate-500">
                Ranked by AI weighted multi-parameter scoring engine
              </p>
            </div>
            <button
              onClick={() => navigateTo('ranking')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <span>View All 12 Targets</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Target / Gene</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 w-40">Priority Score</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {top5Targets.map((target) => (
                    <tr key={target.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-bold font-mono-code text-xs flex items-center justify-center">
                          #{target.rank}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono-code font-bold text-slate-900 text-xs hover:text-teal-700 cursor-pointer" onClick={() => openTargetDetails(target.id)}>
                          {target.geneSymbol}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{target.targetName}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <CategoryBadge category={target.biologicalCategory} />
                      </td>
                      <td className="py-3.5 px-4">
                        <PriorityScoreBar score={target.calculatedScore} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openTargetDetails(target.id)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-teal-600 text-white rounded text-[11px] font-medium transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Access Buttons & Disease Phenotypes */}
        <div className="space-y-6">
          <div>
            <h2 className="font-heading font-bold text-base text-slate-900 mb-3">
              Quick Access Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {[
                {
                  label: "Upload Research Paper",
                  desc: "Extract genes, pathways & evidence from PDF",
                  icon: FileUp,
                  action: () => navigateTo('library'),
                  color: "hover:border-blue-400 group-hover:text-blue-600",
                },
                {
                  label: "Discover Drug Targets",
                  desc: "Filter by inflammation, fibrosis & hormones",
                  icon: Search,
                  action: () => navigateTo('discovery'),
                  color: "hover:border-teal-400 group-hover:text-teal-600",
                },
                {
                  label: "View Target Rankings",
                  desc: "Tweak weights and inspect explainable AI",
                  icon: Sliders,
                  action: () => navigateTo('ranking'),
                  color: "hover:border-emerald-400 group-hover:text-emerald-600",
                },
                {
                  label: "Explore Biological Pathways",
                  desc: "Interactive signaling network visualization",
                  icon: Network,
                  action: () => navigateTo('pathway'),
                  color: "hover:border-purple-400 group-hover:text-purple-600",
                },
              ].map((btn, i) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={i}
                    onClick={btn.action}
                    className="w-full p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left transition-all shadow-sm group flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs text-slate-900 group-hover:text-teal-700 transition-colors">
                        {btn.label}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{btn.desc}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 mt-1" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Endometriosis Clinical Phenotypes Overview */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <h4 className="font-heading font-bold text-slate-900 mb-2">Endometriosis Sub-Phenotypes</h4>
            <div className="space-y-2 text-slate-600 text-[11px]">
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-200">
                <span>Peritoneal Superficial Lesions:</span>
                <span className="font-bold text-slate-800">PTGS2, TNF, IL6</span>
              </div>
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-200">
                <span>Ovarian Endometriomas (Chocolate Cysts):</span>
                <span className="font-bold text-slate-800">ESR2, HDAC6, ARID1A</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Deep Infiltrating Endometriosis (DIE):</span>
                <span className="font-bold text-slate-800">VEGFA, MMP9, TGFB1</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 4. RECENT RESEARCH ACTIVITY */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-heading font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-600" />
          Recent Research Activity & Literature Ingestion
        </h3>
        <div className="divide-y divide-slate-100 text-xs">
          {papers.slice(0, 3).map((paper) => (
            <div key={paper.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-teal-50 text-teal-700 rounded border border-teal-200 shrink-0 mt-0.5">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 leading-snug">{paper.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {paper.authors} • <span className="font-medium text-slate-700">{paper.journal} ({paper.year})</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  AI Extracted
                </span>
                <button
                  onClick={() => navigateTo('library')}
                  className="px-2.5 py-1 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded text-xs font-semibold"
                >
                  View Analysis
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
