import React from 'react';
import { useResearch } from '../context/ResearchContext';
import { EvidenceBadge } from './EvidenceBadge';
import { PriorityScoreBar } from './PriorityScoreBar';
import { X, Scale, Plus, Check, ExternalLink, Dna, ArrowRight } from 'lucide-react';

export function TargetComparisonModal() {
  const {
    isComparisonOpen,
    setIsComparisonOpen,
    comparisonTargetIds,
    toggleCompareTarget,
    targets,
    openTargetDetails,
    navigateTo,
  } = useResearch();

  if (!isComparisonOpen) return null;

  const comparedTargets = targets.filter(t => comparisonTargetIds.includes(t.id));
  const availableToAdd = targets.filter(t => !comparisonTargetIds.includes(t.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                Multi-Target Scientific Comparison Matrix
              </h3>
              <p className="text-xs text-slate-400">
                Direct head-to-head evaluation across 6 weighted clinical and biochemical dimensions
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsComparisonOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Selector Pills */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600">Compared Targets:</span>
          {comparedTargets.map(t => (
            <span
              key={t.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-300 rounded-md font-medium text-slate-800 shadow-sm"
            >
              <span className="font-mono-code font-bold text-teal-700">{t.geneSymbol}</span>
              <button
                onClick={() => toggleCompareTarget(t.id)}
                className="text-slate-400 hover:text-rose-600"
              >
                ✕
              </button>
            </span>
          ))}

          {availableToAdd.length > 0 && comparisonTargetIds.length < 4 && (
            <div className="flex items-center gap-1 ml-auto">
              <span className="text-slate-500 text-[11px]">Add target:</span>
              <select
                onChange={(e) => {
                  if (e.target.value) toggleCompareTarget(e.target.value);
                  e.target.value = '';
                }}
                className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-700 focus:outline-none focus:border-teal-500"
                defaultValue=""
              >
                <option value="" disabled>Select target...</option>
                {availableToAdd.map(t => (
                  <option key={t.id} value={t.id}>{t.geneSymbol} – {t.targetName}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-auto p-6">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-3 w-44 font-semibold text-slate-400 uppercase tracking-wider text-[11px] bg-slate-50">
                  Evaluation Metric
                </th>
                {comparedTargets.map(target => (
                  <th key={target.id} className="p-4 bg-slate-50 border-l border-slate-200 text-slate-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-mono-code font-extrabold text-base text-teal-700">
                          {target.geneSymbol}
                        </div>
                        <div className="text-xs font-medium text-slate-600 truncate max-w-[160px]">
                          {target.targetName}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-300">
                        #{target.rank}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Overall AI Score */}
              <tr className="bg-teal-50/40 font-semibold">
                <td className="p-3 font-semibold text-slate-800 bg-teal-50/70">
                  Overall Priority Score
                </td>
                {comparedTargets.map(t => (
                  <td key={t.id} className="p-4 border-l border-slate-200">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-teal-700">{t.calculatedScore}</span>
                      <span className="text-slate-500 text-xs">/ 100</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold ml-auto">
                        {t.priorityTier}
                      </span>
                    </div>
                    <div className="mt-1">
                      <PriorityScoreBar score={t.calculatedScore} showLabel={false} size="sm" />
                    </div>
                  </td>
                ))}
              </tr>

              {/* Biological Category */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50">
                  Biological Category
                </td>
                {comparedTargets.map(t => (
                  <td key={t.id} className="p-4 border-l border-slate-200">
                    <span className="font-medium text-slate-800">{t.biologicalCategory}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{t.targetClass}</p>
                  </td>
                ))}
              </tr>

              {/* Primary Mechanism */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50">
                  Role in Endometriosis
                </td>
                {comparedTargets.map(t => (
                  <td key={t.id} className="p-4 border-l border-slate-200 text-slate-700 leading-relaxed">
                    {t.associatedProcess}
                  </td>
                ))}
              </tr>

              {/* Human Research Evidence */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50">
                  Human Clinical Evidence (25%)
                </td>
                {comparedTargets.map(t => (
                  <td key={t.id} className="p-4 border-l border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800">{t.rawScores.humanEvidence}/100</span>
                      <EvidenceBadge type={t.evidenceType} size="xs" />
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${t.rawScores.humanEvidence}%` }} />
                    </div>
                  </td>
                ))}
              </tr>

              {/* Disease Association */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50">
                  Association with Disease (20%)
                </td>
                {comparedTargets.map(t => (
                  <td key={t.id} className="p-4 border-l border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800">{t.rawScores.endometriosisAssociation}/100</span>
                      <span className="text-[11px] text-slate-500">{t.supportingPaperCount} Papers</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${t.rawScores.endometriosisAssociation}%` }} />
                    </div>
                  </td>
                ))}
              </tr>

              {/* Druggability */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50">
                  Druggability & Tractability (15%)
                </td>
                {comparedTargets.map(t => (
                  <td key={t.id} className="p-4 border-l border-slate-200">
                    <div className="font-semibold text-slate-800 mb-1">{t.druggabilityStatus}</div>
                    <div className="text-[11px] text-slate-500">
                      PDB: <span className="font-mono-code font-bold text-slate-700">{t.pdbId}</span>
                    </div>
                    <div className="mt-1">
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${t.rawScores.druggability}%` }} />
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Research Novelty */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50">
                  Research Novelty (10%)
                </td>
                {comparedTargets.map(t => (
                  <td key={t.id} className="p-4 border-l border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800">{t.rawScores.researchNovelty}/100</span>
                      <span className="text-[10px] text-slate-500">
                        {t.rawScores.researchNovelty > 85 ? 'High Novelty (First-in-class)' : 'Repurposing potential'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${t.rawScores.researchNovelty}%` }} />
                    </div>
                  </td>
                ))}
              </tr>

              {/* Known Chemical Matter */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50">
                  Known Therapeutics / Inhibitors
                </td>
                {comparedTargets.map(t => (
                  <td key={t.id} className="p-4 border-l border-slate-200">
                    <div className="space-y-1">
                      {t.knownDrugs.map((d, i) => (
                        <div key={i} className="text-[11px] bg-slate-100/80 px-2 py-1 rounded flex items-center justify-between">
                          <span className="font-semibold text-slate-800">{d.name}</span>
                          <span className="text-[10px] text-slate-500">{d.type}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Deep Action Button */}
              <tr>
                <td className="p-3 bg-slate-50"></td>
                {comparedTargets.map(t => (
                  <td key={t.id} className="p-4 border-l border-slate-200">
                    <button
                      onClick={() => {
                        setIsComparisonOpen(false);
                        openTargetDetails(t.id);
                      }}
                      className="w-full py-2 px-3 bg-slate-900 hover:bg-teal-600 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <span>Full Target Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
