import React, { useState } from 'react';
import { useResearch } from '../context/ResearchContext';
import {
  Search,
  Scale,
  Sparkles,
  Sliders,
  BookmarkCheck,
  Bell,
  Menu,
  X,
  Dna,
  LogOut,
  ChevronRight,
  Database
} from 'lucide-react';

export function Navbar({ onMobileMenuToggle, isMobileMenuOpen }) {
  const {
    currentPage,
    navigateTo,
    targets,
    openTargetDetails,
    comparisonTargetIds,
    setIsComparisonOpen,
    savedTargetIds,
    user,
    logout,
  } = useResearch();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const filteredTargets = searchQuery.trim()
    ? targets.filter(t =>
        t.geneSymbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.biologicalCategory.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const pageNames = {
    dashboard: 'Research Dashboard',
    library: 'Research Library & Paper Analyzer',
    discovery: 'Target Discovery',
    ranking: 'Target Ranking & Prioritization',
    pathway: 'Biological Pathway Explorer',
    workspace: 'Research Workspace & Reports',
    resources: 'Biological Resources & Databases',
    'human-model': 'Human Model & Target Discovery',
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
      {/* Left: Mobile hamburger + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className="text-teal-700 font-semibold flex items-center gap-1">
            <Dna className="w-3.5 h-3.5" /> EndoTarget AI
          </span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-semibold">{pageNames[currentPage] || 'Research Hub'}</span>
        </div>
      </div>

      {/* Middle: Fast Target Search */}
      <div className="relative max-w-md w-full mx-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Quick search gene / target (e.g. ESR2, VEGFA, COX-2, MMP9)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs rounded-lg border border-slate-200 focus:border-teal-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-800"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSearchResults(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && searchQuery.trim() && (
          <div className="absolute top-full mt-1.5 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50">
            <div className="p-2 bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex justify-between">
              <span>Matching Identified Targets ({filteredTargets.length})</span>
              <button
                onClick={() => setShowSearchResults(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                Close
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
              {filteredTargets.length === 0 ? (
                <div className="p-4 text-xs text-center text-slate-500">
                  No targets found for "{searchQuery}". Try ESR2, PTGS2, VEGFA, MMP9, or IL6.
                </div>
              ) : (
                filteredTargets.map((target) => (
                  <button
                    key={target.id}
                    onClick={() => {
                      openTargetDetails(target.id);
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-2.5 hover:bg-teal-50/60 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono-code font-bold text-xs text-slate-900 group-hover:text-teal-700">
                          {target.geneSymbol}
                        </span>
                        <span className="text-xs text-slate-600">{target.targetName}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-xs">{target.biologicalCategory} • {target.targetClass}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Score {target.calculatedScore}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        {/* Quick Comparison Shortcut */}
        <button
          onClick={() => setIsComparisonOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
          title="Compare selected targets"
        >
          <Scale className="w-3.5 h-3.5 text-teal-600" />
          <span className="hidden sm:inline">Compare</span>
          <span className="bg-teal-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            {comparisonTargetIds.length}
          </span>
        </button>

        {/* Quick link to Saved Workspace */}
        <button
          onClick={() => navigateTo('workspace')}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
          title="Saved Targets & Notes"
        >
          <BookmarkCheck className="w-4 h-4" />
          {savedTargetIds.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-500" />
          )}
        </button>

        {/* User Pill */}
        <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-teal-400 font-semibold text-xs flex items-center justify-center shadow-inner">
            {(user?.name || "User").split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'U'}
          </div>
          <div className="text-left text-xs">
            <p className="font-semibold text-slate-800 leading-tight">{user?.name || "Researcher"}</p>
            <p className="text-[10px] text-slate-500">{user?.role || "Biomedical Investigator"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
