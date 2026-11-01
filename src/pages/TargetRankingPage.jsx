import React, { useState } from 'react';
import { useResearch } from '../context/ResearchContext';
import { EvidenceBadge, CategoryBadge } from '../components/EvidenceBadge';
import { PriorityScoreBar } from '../components/PriorityScoreBar';
import { INITIAL_WEIGHTS } from '../data/targetsData';
import {
  Sliders,
  Sparkles,
  Scale,
  RotateCcw,
  Info,
  ChevronDown,
  ChevronUp,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  HelpCircle,
  Dna,
  Filter,
  Layers
} from 'lucide-react';

export function TargetRankingPage() {
  const {
    targets,
    weights,
    updateWeights,
    resetWeights,
    openTargetDetails,
    savedTargetIds,
    toggleSaveTarget,
    comparisonTargetIds,
    toggleCompareTarget,
    setIsComparisonOpen,
    showNotification,
  } = useResearch();

  const [expandedExplanationId, setExpandedExplanationId] = useState('ESR2');
  const [priorityFilter, setPriorityFilter] = useState('All'); // 'All' | 'High' | 'Moderate' | 'Exploratory'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showWeightSliders, setShowWeightSliders] = useState(true);

  // Compute total weight
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  const handleSliderChange = (param, val) => {
    updateWeights({
      ...weights,
      [param]: parseInt(val) || 0,
    });
  };

  // Filtered targets
  const filteredRankedTargets = targets.filter(t => {
    const matchesPriority =
      priorityFilter === 'All' ||
      (priorityFilter === 'High' && t.calculatedScore >= 85) ||
      (priorityFilter === 'Moderate' && t.calculatedScore >= 75 && t.calculatedScore < 85) ||
      (priorityFilter === 'Exploratory' && t.calculatedScore < 75);

    const matchesCategory =
      categoryFilter === 'All' || t.biologicalCategory === categoryFilter;

    return matchesPriority && matchesCategory;
  });

  const weightParameters = [
    {
      key: 'humanEvidence',
      label: 'Human Research Evidence',
      defaultWeight: 25,
      description: 'Prioritizes targets with direct surgical biopsy and patient clinical trial validation over animal models.',
      color: 'accent-teal-600',
    },
    {
      key: 'endometriosisAssociation',
      label: 'Association with Endometriosis',
      defaultWeight: 20,
      description: 'Specific mechanistic link to ectopic lesion survival, pain sensitization, or endometrial tissue attachment.',
      color: 'accent-cyan-600',
    },
    {
      key: 'pathwayRelevance',
      label: 'Biological Pathway Relevance',
      defaultWeight: 15,
      description: 'Centrality in key cascades: cytokine storms, steroidogenesis, angiogenesis, and fibrosis.',
      color: 'accent-blue-600',
    },
    {
      key: 'druggability',
      label: 'Druggability & Chemical Tractability',
      defaultWeight: 15,
      description: 'Known ligand pockets, PDB 3D crystal structures, and availability of selective small molecules or biologics.',
      color: 'accent-emerald-600',
    },
    {
      key: 'evidenceStrength',
      label: 'Strength & Consistency of Evidence',
      defaultWeight: 15,
      description: 'Reproducibility across independent multi-center laboratories and published peer-reviewed literature.',
      color: 'accent-amber-600',
    },
    {
      key: 'researchNovelty',
      label: 'Research Novelty / Non-Hormonal Innovation',
      defaultWeight: 10,
      description: 'Rewards novel targets that avoid menopausal hypoestrogenic side effects common to standard GnRH therapies.',
      color: 'accent-purple-600',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto min-h-full">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Core Decision Engine
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">
            Target Ranking & Prioritization
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Explainable AI prioritization engine evaluating candidate drug targets using multi-factor weighted scoring.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsComparisonOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Scale className="w-4 h-4 text-cyan-400" />
            <span>Multi-Target Compare ({comparisonTargetIds.length})</span>
          </button>
        </div>
      </div>

      {/* A. CONFIGURABLE AI WEIGHTED SCORING MODEL */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-400" />
              Calibrate Prioritization Algorithm Weights
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize weights according to your drug discovery focus (e.g. non-hormonal novelty vs approved drug repurposing).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-lg text-xs font-mono-code font-bold flex items-center gap-1.5 ${
              totalWeight === 100 
                ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300' 
                : 'bg-amber-950/80 border border-amber-500/50 text-amber-300'
            }`}>
              <span>Total Weight:</span>
              <span className="text-sm">{totalWeight}%</span>
              {totalWeight === 100 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </div>

            <button
              onClick={resetWeights}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              title="Reset to scientific consensus default weights"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Defaults</span>
            </button>

            <button
              onClick={() => setShowWeightSliders(!showWeightSliders)}
              className="p-1.5 text-slate-400 hover:text-white"
            >
              {showWeightSliders ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        {showWeightSliders && (
          <div className="p-6 bg-slate-50/70 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {weightParameters.map(param => (
              <div key={param.key} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">{param.label}</span>
                  <span className="font-mono-code font-extrabold text-teal-700 text-sm bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {weights[param.key]}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={weights[param.key]}
                  onChange={(e) => handleSliderChange(param.key, e.target.value)}
                  className={`w-full cursor-pointer h-2 bg-slate-200 rounded-lg ${param.color}`}
                />

                <p className="text-[11px] text-slate-500 leading-snug">
                  {param.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">Filter Tier:</span>
          {['All', 'High', 'Moderate', 'Exploratory'].map(tier => (
            <button
              key={tier}
              onClick={() => setPriorityFilter(tier)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                priorityFilter === tier
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {tier === 'All' ? 'All Priority Targets' : `${tier} Priority`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs focus:outline-none focus:border-teal-500"
          >
            <option value="All">All Biological Categories</option>
            <option value="Hormonal Signalling">Hormonal Signalling</option>
            <option value="Inflammation">Inflammation</option>
            <option value="Angiogenesis">Angiogenesis</option>
            <option value="Tissue Remodelling">Tissue Remodelling</option>
            <option value="Immune Dysfunction">Immune Dysfunction</option>
            <option value="Fibrosis">Fibrosis</option>
            <option value="Cell Proliferation">Cell Proliferation</option>
          </select>
        </div>
      </div>

      {/* B & C. RANKING TABLE WITH INTEGRATED EXPLAINABLE AI */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-base text-slate-900">
            Top Prioritized Targets ({filteredRankedTargets.length})
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Scores dynamically recalculated based on active weights
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 w-16">Rank</th>
                  <th className="py-3.5 px-4">Target & Gene Symbol</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 w-44">Priority Score</th>
                  <th className="py-3.5 px-4">Evidence Level</th>
                  <th className="py-3.5 px-4">Primary Pathological Role</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRankedTargets.map((target) => {
                  const isSaved = savedTargetIds.includes(target.id);
                  const isCompared = comparisonTargetIds.includes(target.id);
                  const isExpanded = expandedExplanationId === target.id;

                  return (
                    <React.Fragment key={target.id}>
                      <tr className={`transition-colors ${isExpanded ? 'bg-teal-50/40' : 'hover:bg-slate-50/70'}`}>
                        <td className="py-4 px-4">
                          <span className={`w-8 h-8 rounded-xl font-bold font-mono-code text-xs flex items-center justify-center border shadow-sm ${
                            target.rank === 1
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : target.rank === 2
                                ? 'bg-slate-100 text-slate-800 border-slate-300'
                                : target.rank === 3
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}>
                            #{target.rank}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <div
                            onClick={() => openTargetDetails(target.id)}
                            className="font-mono-code font-extrabold text-slate-900 text-sm hover:text-teal-700 cursor-pointer flex items-center gap-1.5"
                          >
                            <span>{target.geneSymbol}</span>
                            <span className="text-[10px] font-sans font-normal text-slate-400">({target.targetClass})</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium truncate max-w-xs">
                            {target.targetName}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <CategoryBadge category={target.biologicalCategory} />
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-baseline justify-between mb-1">
                            <span className="font-extrabold text-sm text-teal-800 font-heading">
                              {target.calculatedScore}
                              <span className="text-slate-400 font-normal text-xs">/100</span>
                            </span>
                            <span className="text-[10px] font-bold text-teal-700 bg-teal-100/70 px-1.5 py-0.5 rounded">
                              {target.priorityTier}
                            </span>
                          </div>
                          <PriorityScoreBar score={target.calculatedScore} showLabel={false} size="sm" />
                        </td>

                        <td className="py-4 px-4">
                          <EvidenceBadge type={target.evidenceType} size="xs" />
                          <div className="text-[10px] text-slate-400 mt-1">
                            {target.supportingPaperCount} literature sources
                          </div>
                        </td>

                        <td className="py-4 px-4 text-slate-600 max-w-xs leading-snug">
                          {target.associatedProcess}
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setExpandedExplanationId(isExpanded ? null : target.id)}
                              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                                isExpanded
                                  ? 'bg-teal-700 text-white'
                                  : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
                              }`}
                              title="Why did this target receive this ranking?"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>{isExpanded ? 'Hide AI' : 'Explain AI'}</span>
                            </button>

                            <button
                              onClick={() => toggleCompareTarget(target.id)}
                              className={`p-1.5 rounded transition-colors ${
                                isCompared ? 'bg-cyan-50 text-cyan-700 border border-cyan-300' : 'text-slate-400 hover:text-slate-700'
                              }`}
                              title={isCompared ? "In Comparison" : "Add to Comparison"}
                            >
                              <Scale className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => toggleSaveTarget(target.id)}
                              className={`p-1.5 rounded transition-colors ${
                                isSaved ? 'text-teal-600 bg-teal-50' : 'text-slate-400 hover:text-slate-700'
                              }`}
                              title={isSaved ? "Saved" : "Save Target"}
                            >
                              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                            </button>

                            <button
                              onClick={() => openTargetDetails(target.id)}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-teal-600 text-white rounded text-xs font-semibold transition-colors"
                            >
                              Dossier
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* D. EXPLAINABLE AI EXPANDABLE ACCORDION ROW */}
                      {isExpanded && (
                        <tr className="bg-slate-900 text-slate-100 animate-in fade-in duration-150">
                          <td colSpan={7} className="p-6">
                            <div className="max-w-5xl mx-auto space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-teal-400" />
                                  <h4 className="font-heading font-bold text-sm text-white">
                                    Explainable AI Prioritization Breakdown: Why Did {target.geneSymbol} Rank #{target.rank}?
                                  </h4>
                                </div>
                                <span className="text-xs text-teal-300 font-mono-code">
                                  Overall Score: {target.calculatedScore}/100 • {target.priorityTier}
                                </span>
                              </div>

                              {/* Natural language AI explanation */}
                              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 leading-relaxed">
                                {target.aiExplanation}
                              </div>

                              {/* Answers to Key Scientific Questions */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
                                  <span className="font-bold text-teal-400 block mb-1">
                                    Connection to Endometriosis:
                                  </span>
                                  <p className="text-slate-300 text-[11px] leading-relaxed">
                                    {target.roleInEndometriosis.slice(0, 160)}...
                                  </p>
                                </div>

                                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
                                  <span className="font-bold text-cyan-400 block mb-1">
                                    Human vs Animal Evidence:
                                  </span>
                                  <p className="text-slate-300 text-[11px] leading-relaxed">
                                    Supported by {target.supportingPaperCount} papers with primary classification as <strong className="text-white">{target.evidenceType}</strong>.
                                  </p>
                                </div>

                                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
                                  <span className="font-bold text-emerald-400 block mb-1">
                                    Chemical Druggability:
                                  </span>
                                  <p className="text-slate-300 text-[11px] leading-relaxed">
                                    {target.druggabilityStatus}. Crystal structure PDB: <strong className="font-mono-code text-white">{target.pdbId}</strong>.
                                  </p>
                                </div>
                              </div>

                              <div className="flex justify-end gap-3 pt-2">
                                <button
                                  onClick={() => openTargetDetails(target.id)}
                                  className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                                >
                                  <span>View Complete Evidence Dossier</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
