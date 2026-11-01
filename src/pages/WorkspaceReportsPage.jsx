import React, { useState } from 'react';
import { useResearch } from '../context/ResearchContext';
import { EvidenceBadge, CategoryBadge } from '../components/EvidenceBadge';
import { PriorityScoreBar } from '../components/PriorityScoreBar';
import {
  FolderKanban,
  Bookmark,
  BookmarkCheck,
  FileText,
  Trash2,
  Plus,
  Scale,
  Printer,
  Download,
  Dna,
  ExternalLink,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';

export function WorkspaceReportsPage() {
  const {
    user,
    targets,
    papers,
    savedTargetIds,
    toggleSaveTarget,
    savedPaperIds,
    toggleSavePaper,
    notes,
    addNote,
    deleteNote,
    openTargetDetails,
    comparisonTargetIds,
    setIsComparisonOpen,
    showNotification,
  } = useResearch();

  const [activeTab, setActiveTab] = useState('saved-targets'); // 'saved-targets' | 'saved-papers' | 'notes' | 'report-builder'

  // Notes Form State
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    targetId: 'ESR2',
    category: 'Target Validation',
  });

  // Report Builder Configuration State
  const [reportConfig, setReportConfig] = useState({
    projectTitle: "Endometriosis Non-Hormonal Drug Target Prioritization Dossier",
    investigator: user?.name || "Biomedical Researcher",
    organization: user?.institution || user?.role || "EndoTarget AI Research Workspace",
    selectedTargetIds: savedTargetIds.length > 0 ? savedTargetIds : ['ESR2', 'PTGS2', 'VEGFA'],
    includeExecutiveSummary: true,
    includeRankings: true,
    includeMechanism: true,
    includeEvidenceMatrix: true,
    includeDruggability: true,
    includeResearchGaps: true,
    includeBibliography: true,
  });

  const savedTargets = targets.filter(t => savedTargetIds.includes(t.id));
  const savedPapers = papers.filter(p => savedPaperIds.includes(p.id));

  const handleCreateNote = (e) => {
    e.preventDefault();
    if (!noteForm.title || !noteForm.content) {
      showNotification("Please fill in note title and observations", "warning");
      return;
    }
    addNote(noteForm);
    setNoteForm({ title: '', content: '', targetId: 'ESR2', category: 'Target Validation' });
    setShowNoteModal(false);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const reportData = {
      meta: {
        title: reportConfig.projectTitle,
        investigator: reportConfig.investigator,
        organization: reportConfig.organization,
        generatedAt: new Date().toISOString(),
        platform: "EndoTarget AI v2.4",
      },
      targets: targets.filter(t => reportConfig.selectedTargetIds.includes(t.id)),
      notes: notes,
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `EndoTarget_Dossier_${Date.now()}.json`);
    dlAnchorElem.click();
    showNotification("Downloaded Research Dossier JSON", "success");
  };

  const toggleTargetInReport = (id) => {
    setReportConfig(prev => {
      const exists = prev.selectedTargetIds.includes(id);
      return {
        ...prev,
        selectedTargetIds: exists
          ? prev.selectedTargetIds.filter(tId => tId !== id)
          : [...prev.selectedTargetIds, id]
      };
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto min-h-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold mb-1">
            <FolderKanban className="w-3.5 h-3.5 text-teal-600" />
            Investigator Workspace
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">
            Research Workspace & Reports Studio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your saved targets, bookmarked scientific papers, research notes, and generate exportable reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('report-builder')}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate Lab Report</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 overflow-x-auto text-xs font-semibold no-print">
        {[
          { id: 'saved-targets', label: `Saved Targets (${savedTargets.length})`, icon: BookmarkCheck },
          { id: 'saved-papers', label: `Bookmarked Papers (${savedPapers.length})`, icon: BookOpen },
          { id: 'notes', label: `Research Notes (${notes.length})`, icon: FileText },
          { id: 'report-builder', label: `Report Studio & Export`, icon: Printer },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-teal-600 text-teal-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SAVED TARGETS */}
      {activeTab === 'saved-targets' && (
        <div className="space-y-4 no-print">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Personal Saved Targets Portfolio ({savedTargets.length})
            </h3>
            <span className="text-xs text-slate-500">Shortlisted for downstream wet-lab validation</span>
          </div>

          {savedTargets.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-3">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No targets saved to workspace yet.</p>
              <p className="text-xs text-slate-500">Browse Target Discovery or Ranking to bookmark promising drug targets.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedTargets.map((target) => (
                <div
                  key={target.id}
                  className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-teal-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-mono-code font-bold text-xs bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
                        Rank #{target.rank}
                      </span>
                      <button
                        onClick={() => toggleSaveTarget(target.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4
                      onClick={() => openTargetDetails(target.id)}
                      className="font-mono-code font-black text-lg text-slate-900 hover:text-teal-700 cursor-pointer"
                    >
                      {target.geneSymbol}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium">{target.targetName}</p>

                    <div className="my-3 flex flex-wrap gap-1.5">
                      <CategoryBadge category={target.biologicalCategory} />
                      <EvidenceBadge type={target.evidenceType} size="xs" />
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {target.associatedProcess}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <PriorityScoreBar score={target.calculatedScore} size="sm" />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setNoteForm(prev => ({ ...prev, targetId: target.id }));
                        setShowNoteModal(true);
                      }}
                      className="text-slate-600 hover:text-teal-700 font-medium inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Note
                    </button>
                    <button
                      onClick={() => openTargetDetails(target.id)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-teal-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      Dossier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED PAPERS */}
      {activeTab === 'saved-papers' && (
        <div className="space-y-4 no-print">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Bookmarked Scientific Papers ({savedPapers.length})
            </h3>
            <span className="text-xs text-slate-500">Supporting literature library</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
            {savedPapers.map((paper) => (
              <div key={paper.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 text-[10px]">
                      {paper.journal} ({paper.year})
                    </span>
                    {paper.doi && (
                      <span className="font-mono-code text-slate-400 text-[10px]">DOI: {paper.doi}</span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{paper.title}</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">{paper.authors}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleSavePaper(paper.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RESEARCH NOTES NOTEBOOK */}
      {activeTab === 'notes' && (
        <div className="space-y-4 no-print">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Personal Research Observations & Lab Notes ({notes.length})
              </h3>
              <p className="text-xs text-slate-500">Attach clinical hypotheses and pharmacology notes to specific targets</p>
            </div>
            <button
              onClick={() => setShowNoteModal(true)}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Observation Note</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <div key={note.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      {note.category}
                    </span>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="font-heading font-bold text-slate-900 text-xs mb-1">
                    {note.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {note.content}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Linked Target: <strong className="font-mono-code text-teal-700 font-bold">{note.targetId}</strong></span>
                  <span>{note.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REPORT BUILDER STUDIO & PRINTABLE DOSSIER */}
      {activeTab === 'report-builder' && (
        <div className="space-y-8">
          
          {/* Builder Controls (hidden during print) */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-5 no-print">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Scientific Report Configuration
                </h3>
                <p className="text-xs text-slate-500">
                  Select targets and sections to compile into an exportable research dossier
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportJSON}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Download JSON</span>
                </button>
                <button
                  onClick={handlePrintReport}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF Report</span>
                </button>
              </div>
            </div>

            {/* Target Selectors */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Include Targets in Dossier:
              </label>
              <div className="flex flex-wrap gap-2">
                {targets.map(t => {
                  const isChecked = reportConfig.selectedTargetIds.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTargetInReport(t.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                        isChecked
                          ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}{t.geneSymbol} ({t.calculatedScore}/100)
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section Toggles */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2">
              {[
                { key: 'includeExecutiveSummary', label: 'Executive Summary' },
                { key: 'includeRankings', label: 'Prioritization Table' },
                { key: 'includeMechanism', label: 'Biological Mechanisms' },
                { key: 'includeEvidenceMatrix', label: 'Human vs Animal Evidence' },
                { key: 'includeDruggability', label: 'Druggability & Ligands' },
                { key: 'includeResearchGaps', label: 'Research Gaps & Blindspots' },
              ].map(sec => (
                <label key={sec.key} className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={reportConfig[sec.key]}
                    onChange={(e) => setReportConfig({ ...reportConfig, [sec.key]: e.target.checked })}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>{sec.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* LIVE REPORT PREVIEW CONTAINER (Formatted for Print) */}
          <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-300 shadow-xl max-w-4xl mx-auto space-y-8 print:border-none print:shadow-none print:p-0">
            
            {/* Report Header */}
            <div className="border-b-2 border-slate-900 pb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-teal-700 font-heading font-black text-xl">
                  <Dna className="w-6 h-6 text-teal-600" />
                  <span>EndoTarget AI</span>
                </div>
                <span className="text-xs text-slate-500 font-mono-code">
                  Generated: {new Date().toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-2xl font-heading font-black text-slate-950 leading-tight">
                {reportConfig.projectTitle}
              </h1>
              <p className="text-xs text-slate-600 mt-2">
                Principal Investigator: <strong className="text-slate-900">{reportConfig.investigator}</strong> • {reportConfig.organization}
              </p>
            </div>

            {/* Section: Executive Summary */}
            {reportConfig.includeExecutiveSummary && (
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                  1. Executive Summary & Clinical Background
                </h3>
                <p className="text-xs leading-relaxed text-slate-700">
                  Endometriosis affects ~190 million women worldwide. Current clinical management relying on GnRH agonists or surgical ablation faces severe recurrence rates (&gt;50%) and debilitating hypoestrogenic side effects. This dossier synthesizes biomedical literature using EndoTarget AI's 6-parameter scoring model to evaluate non-hormonal and selective therapeutic targets.
                </p>
              </div>
            )}

            {/* Section: Prioritization Table */}
            {reportConfig.includeRankings && (
              <div className="space-y-3">
                <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                  2. Evaluated Candidate Target Rankings
                </h3>
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2 border-b">Rank</th>
                      <th className="p-2 border-b">Symbol</th>
                      <th className="p-2 border-b">Target Name</th>
                      <th className="p-2 border-b">Category</th>
                      <th className="p-2 border-b">Score</th>
                      <th className="p-2 border-b">Evidence Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {targets
                      .filter(t => reportConfig.selectedTargetIds.includes(t.id))
                      .map((t) => (
                        <tr key={t.id}>
                          <td className="p-2 font-mono-code font-bold">#{t.rank}</td>
                          <td className="p-2 font-mono-code font-bold text-teal-800">{t.geneSymbol}</td>
                          <td className="p-2">{t.targetName}</td>
                          <td className="p-2">{t.biologicalCategory}</td>
                          <td className="p-2 font-bold">{t.calculatedScore}/100</td>
                          <td className="p-2">{t.evidenceType}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Section: Target Profiles Detail */}
            {reportConfig.includeMechanism && (
              <div className="space-y-6">
                <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                  3. Detailed Biological Profiling & Disease Pathology
                </h3>
                {targets
                  .filter(t => reportConfig.selectedTargetIds.includes(t.id))
                  .map((t) => (
                    <div key={t.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-heading font-bold text-slate-900 text-sm">
                          {t.geneSymbol} – {t.targetName}
                        </h4>
                        <span className="font-mono-code font-bold text-teal-700">Score {t.calculatedScore}/100</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        <strong className="text-slate-900">Pathological Role: </strong>{t.roleInEndometriosis}
                      </p>
                      <div className="text-[11px] text-slate-600 pt-1">
                        <strong className="text-slate-800">Druggability Assessment: </strong>{t.druggabilityStatus} (PDB: {t.pdbId})
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Scientific Disclaimer */}
            <div className="pt-6 border-t border-slate-200 text-[10px] text-slate-500 leading-relaxed">
              <strong className="text-slate-700">Scientific Disclaimer:</strong> This document was generated automatically by EndoTarget AI for preclinical translational research. Findings and scores reflect automated literature synthesis and algorithm calibration. Not intended for direct clinical prescribing.
            </div>

          </div>

        </div>
      )}

      {/* New Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in duration-200">
            <h3 className="font-heading font-bold text-base text-slate-900 mb-1">
              Add Research Observation
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Record experimental notes and associate them with a candidate target.
            </p>

            <form onSubmit={handleCreateNote} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Note Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. In-vitro HESC migration assay results"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Associated Target</label>
                  <select
                    value={noteForm.targetId}
                    onChange={(e) => setNoteForm({ ...noteForm, targetId: e.target.value })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    {targets.map(t => (
                      <option key={t.id} value={t.id}>{t.geneSymbol}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={noteForm.category}
                    onChange={(e) => setNoteForm({ ...noteForm, category: e.target.value })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Target Validation">Target Validation</option>
                    <option value="Pharmacology">Pharmacology</option>
                    <option value="Pipeline Development">Pipeline Development</option>
                    <option value="Clinical Translation">Clinical Translation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Observations / Hypothesis</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Document biological observations, binding affinity data, or translational hypotheses..."
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-slate-900 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
