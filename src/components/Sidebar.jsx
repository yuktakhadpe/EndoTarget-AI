import React from 'react';
import { useResearch } from '../context/ResearchContext';
import {
  LayoutDashboard,
  BookOpen,
  Search,
  Sliders,
  Network,
  FolderKanban,
  Dna,
  LogOut,
  ExternalLink,
  Scale,
  Sparkles,
  BookmarkCheck,
  Database,
  Brain
} from 'lucide-react';

export function Sidebar() {
  const {
    currentPage,
    navigateTo,
    user,
    logout,
    targets,
    papers,
    savedTargetIds,
    comparisonTargetIds,
    setIsComparisonOpen,
  } = useResearch();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Research Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'library',
      label: 'Research Library',
      sublabel: '& Paper Analyzer',
      icon: BookOpen,
      badge: `${papers.length} Papers`,
    },
    {
      id: 'discovery',
      label: 'Target Discovery',
      icon: Search,
      badge: `${targets.length} Identified`,
    },
    {
      id: 'ranking',
      label: 'Target Ranking',
      sublabel: '& Prioritization',
      icon: Sliders,
      badge: 'Algorithm Live',
      highlight: true,
    },
    {
      id: 'human-model',
      label: 'Human Model',
      sublabel: '& Target Generation',
      icon: Brain,
      badge: 'AI Discovery',
      highlight: true,
    },
    {
      id: 'pathway',
      label: 'Pathway Explorer',
      icon: Network,
      badge: 'Interactive',
    },
    {
      id: 'workspace',
      label: 'Research Workspace',
      sublabel: '& Reports Studio',
      icon: FolderKanban,
      badge: `${savedTargetIds.length} Saved`,
    },
    {
      id: 'resources',
      label: 'Bio Resources Hub',
      sublabel: '& Public Databases',
      icon: Database,
      badge: '7 Databases',
      highlight: true,
    },
  ];

  return (
    <div className="w-64 bg-slate-900 flex flex-col h-full text-slate-300 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <button
          onClick={() => navigateTo('landing')}
          className="flex items-center gap-3 text-left group w-full"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <Dna className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-base tracking-tight text-white">
                EndoTarget<span className="text-teal-400">.AI</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Endometriosis Drug Discovery</p>
          </div>
        </button>
      </div>

      {/* Platform Status Badge */}
      <div className="px-4 py-3 bg-slate-950/50 border-b border-slate-800/80 flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1.5 text-teal-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
          AI Scoring Model Active
        </span>
        <span className="text-[10px] text-slate-400 font-mono-code bg-slate-800 px-1.5 py-0.5 rounded">v2.4-PRO</span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Research Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3 truncate text-left">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-slate-950' : item.highlight ? 'text-teal-400' : 'text-slate-400 group-hover:text-teal-300'
                  }`}
                />
                <div className="truncate">
                  <div className="truncate leading-tight">{item.label}</div>
                  {item.sublabel && (
                    <div className={`text-[10px] font-normal leading-tight ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                      {item.sublabel}
                    </div>
                  )}
                </div>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ml-1.5 ${
                    isActive
                      ? 'bg-slate-900/30 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Tools Divider */}
        <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Scientific Utilities
        </div>

        {/* Quick Compare Trigger */}
        <button
          onClick={() => setIsComparisonOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Scale className="w-4 h-4 text-cyan-400" />
            <span>Target Compare Tool</span>
          </div>
          <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.5 rounded">
            {comparisonTargetIds.length} queued
          </span>
        </button>

        {/* View Landing Page link */}
        <button
          onClick={() => navigateTo('landing')}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-slate-400" />
          <span>Public Landing Page</span>
        </button>
      </nav>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-teal-900/80 border border-teal-500/30 flex items-center justify-center text-teal-300 font-bold text-xs shrink-0">
              {(user?.name || "Researcher").split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'R'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate leading-tight">{user?.name || "Researcher"}</p>
              <p className="text-[10px] text-teal-400 truncate">{user?.role || "Biomedical Investigator"}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
