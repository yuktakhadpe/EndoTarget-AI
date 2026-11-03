import React, { useState, useEffect } from 'react';
import { useResearch } from '../context/ResearchContext';
import { generateTop10Targets, getHumanModelQueries, deleteHumanModelQuery } from '../services/humanModelService';
import { CategoryBadge } from '../components/EvidenceBadge';
import { PriorityScoreBar } from '../components/PriorityScoreBar';
import {
  Brain,
  Sparkles,
  Search,
  ChevronDown,
  Dna,
  Layers,
  Activity,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Scale,
  Network,
  RefreshCw,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileText,
  Trash2,
  FlaskConical,
  HelpCircle,
  Info
} from 'lucide-react';

export function HumanModelPage() {
  const {
    papers,
    weights,
    user,
    savedTargetIds,
    toggleSaveTarget,
    openTargetDetails,
    navigateTo,
    showNotification,
  } = useResearch();

  // Research Question Input state
  const [questionInput, setQuestionInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Active generation results
  const [currentResult, setCurrentResult] = useState(null);
  const [selectedTargetSymbol, setSelectedTargetSymbol] = useState(null);

  // Saved query history
  const [queryHistory, setQueryHistory] = useState([]);

  // Load history on mount or user switch
  useEffect(() => {
    if (user?.id) {
      const history = getHumanModelQueries(user.id);
      setQueryHistory(history);
      if (history.length > 0 && !currentResult) {
        // Load the latest query by default
        setCurrentResult(history[0]);
        setSelectedTargetSymbol(history[0].selectedTargetId || history[0].top10Targets?.[0]?.geneSymbol || null);
      }
    }
  }, [user?.id]);

  // Preset scientific research questions for rapid evaluation
  const PRESET_QUESTIONS = [
    {
      title: "Fibrosis & Extracellular Matrix",
      query: "Which inflammatory signaling pathways and molecular targets contribute to endometriosis-associated fibrosis?",
    },
    {
      title: "Peritoneal Inflammation & Pain",
      query: "What are the key cytokine and prostaglandin regulators driving cyclic pelvic pain in human peritoneal implants?",
    },
    {
      title: "Hypoxia & Angiogenesis",
      query: "Which angiogenic growth factors and vascular recruitment mechanisms enable deep infiltrating lesion survival?",
    },
    {
      title: "Progesterone Resistance",
      query: "What epigenetic determinants and nuclear receptor alterations cause progesterone resistance in endometriotic stroma?",
    },
  ];

  // Submit and generate Top 10 targets
  const handleGenerate = async (e) => {
    e?.preventDefault();
    const trimmed = questionInput.trim();
    if (!trimmed) {
      setErrorMessage("Please enter a biological or biomedical research question.");
      return;
    }
    if (trimmed.length < 8) {
      setErrorMessage("Please enter a more detailed research question (at least 8 characters).");
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);

    try {
      const result = await generateTop10Targets(trimmed, {
        papers,
        weights,
        userId: user?.id,
      });

      setCurrentResult(result);
      setSelectedTargetSymbol(result.top10Targets[0]?.geneSymbol || null);

      // Refresh history
      if (user?.id) {
        setQueryHistory(getHumanModelQueries(user.id));
      }

      showNotification(`Generated Top 10 targets for your research question`, 'success');
    } catch (err) {
      console.error("Target generation error:", err);
      setErrorMessage(err.message || "Failed to analyze research question. Please try again.");
      showNotification(err.message || "Generation failed", 'warning');
    } finally {
      setIsGenerating(false);
    }
  };

  // Switch to a previous query from history
  const handleSelectHistoryItem = (item) => {
    setCurrentResult(item);
    setSelectedTargetSymbol(item.selectedTargetId || item.top10Targets?.[0]?.geneSymbol || null);
    setQuestionInput(item.question);
    setErrorMessage(null);
  };

  // Delete a query from history
  const handleDeleteHistoryItem = (e, queryId) => {
    e.stopPropagation();
    if (!user?.id) return;
    const updated = deleteHumanModelQuery(user.id, queryId);
    setQueryHistory(updated);
    if (currentResult?.id === queryId) {
      if (updated.length > 0) {
        setCurrentResult(updated[0]);
        setSelectedTargetSymbol(updated[0].selectedTargetId || updated[0].top10Targets?.[0]?.geneSymbol || null);
      } else {
        setCurrentResult(null);
        setSelectedTargetSymbol(null);
      }
    }
    showNotification("Query removed from history", "info");
  };

  // Find the currently selected target object from the Top 10 list
  const selectedTarget = currentResult?.top10Targets?.find(
    (t) => t.geneSymbol === selectedTargetSymbol
  ) || currentResult?.top10Targets?.[0] || null;

  const isSavedInWorkspace = selectedTarget ? savedTargetIds.includes(selectedTarget.id) : false;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto min-h-full">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold mb-1.5">
            <Brain className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Discovery • Human Model Target Prioritization</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900 flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-teal-600" />
            Human Model & Target Discovery
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Formulate biological research questions to generate an evidence-ranked Top 10 list of therapeutic targets, cross-referenced against your uploaded papers and the curated human endometriosis literature.
          </p>
        </div>

        {/* User Account Pill */}
        <div className="flex items-center gap-2 text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-slate-500 font-medium">Session:</span>
          <span className="font-bold text-slate-900">{user?.name || "Dr. Elena Vance"}</span>
        </div>
      </div>

      {/* 2. RESEARCH QUESTION INPUT CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold">
              <HelpCircle className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-base text-slate-900">
                Enter Your Research Question
              </h2>
              <p className="text-xs text-slate-500">
                Describe a pathological process, molecular mechanism, signaling pathway, or phenotypic challenge.
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            BioNER & Pathway Reasoning Active
          </span>
        </div>

        <form onSubmit={handleGenerate} className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={questionInput}
              onChange={(e) => {
                setQuestionInput(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Example: Which inflammatory signaling pathways and molecular targets contribute to endometriosis-associated fibrosis?"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-500 text-sm text-slate-900 leading-relaxed placeholder:text-slate-400 transition-all resize-y min-h-[90px]"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Preset Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-500" /> Sample Questions:
            </span>
            {PRESET_QUESTIONS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuestionInput(preset.query);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-600 border border-slate-200 hover:border-teal-300 transition-colors cursor-pointer text-left font-medium"
              >
                {preset.title}
              </button>
            ))}
          </div>

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Analyzes question against {papers.length} library papers and curated clinical datasets.</span>
            </p>

            <button
              type="submit"
              disabled={isGenerating || !questionInput.trim()}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Mechanisms & Prioritizing...</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  <span>Generate Top 10 Targets</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 3. GENERATION PROGRESS / LOADING BANNER */}
      {isGenerating && (
        <div className="p-8 bg-white rounded-2xl border border-teal-200 shadow-sm text-center space-y-3 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center mx-auto text-teal-600">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Evaluating Biological Axes & Prioritizing Drug Targets...
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Scanning molecular mechanisms, cross-referencing your uploaded research papers, and ranking candidates via the multi-factor scoring model.
            </p>
          </div>
        </div>
      )}

      {/* 4. RESULTS SECTION: DROPDOWN & TARGET DETAILS */}
      {!isGenerating && currentResult && currentResult.top10Targets?.length > 0 && (
        <div className="space-y-6">

          {/* Dropdown Selector Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Top 10 Targets Ready
                  </span>
                  <span className="text-xs text-slate-500">
                    Category: <strong className="text-slate-800">{currentResult.dominantCategory}</strong>
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-semibold mt-1 italic">
                  "{currentResult.question}"
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-rank Targets</span>
              </button>
            </div>

            {/* THE DROPDOWN SELECTOR (Primary Requirement) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                Select a Potential Target (Ranked Top 10)
              </label>

              <div className="relative">
                <select
                  value={selectedTargetSymbol || ''}
                  onChange={(e) => setSelectedTargetSymbol(e.target.value)}
                  className="w-full appearance-none px-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border-2 border-teal-500/80 focus:border-teal-600 rounded-xl text-sm font-semibold text-slate-900 shadow-sm transition-all cursor-pointer pr-10 focus:outline-none"
                >
                  {currentResult.top10Targets.map((target) => (
                    <option key={target.geneSymbol} value={target.geneSymbol} className="py-2 text-slate-900">
                      {target.formattedRank}. {target.geneSymbol} – {target.targetName} (Relevance: {target.relevanceScore}%)
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-teal-700">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Quick-Switch Target Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Direct Select:</span>
              {currentResult.top10Targets.map((t) => {
                const isSelected = t.geneSymbol === selectedTargetSymbol;
                return (
                  <button
                    key={t.geneSymbol}
                    type="button"
                    onClick={() => setSelectedTargetSymbol(t.geneSymbol)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-mono-code font-bold transition-all border ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-slate-50 hover:bg-teal-50 text-slate-700 border-slate-200 hover:border-teal-300'
                    }`}
                  >
                    #{t.rank} {t.geneSymbol}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. SELECTED TARGET DETAILS CARD */}
          {selectedTarget && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-200">
              
              {/* Header Banner */}
              <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 font-bold shrink-0">
                    <Dna className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-2xl font-mono-code font-black text-white">
                        {selectedTarget.geneSymbol}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        Rank #{selectedTarget.rank} of 10
                      </span>
                      <CategoryBadge category={selectedTarget.biologicalCategory} />
                      {selectedTarget.hasPaperEvidence && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Validated in Your Library
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 font-medium mt-1">
                      {selectedTarget.targetName} • {selectedTarget.proteinName}
                    </p>
                  </div>
                </div>

                {/* Relevance Score Pill */}
                <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 px-4 py-2 rounded-xl shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Question Relevance</div>
                    <div className="text-xl font-heading font-black text-teal-400">{selectedTarget.relevanceScore}%</div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-300 font-bold text-xs">
                    Score
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3 text-slate-600">
                  <span><strong>Class:</strong> {selectedTarget.targetClass || "Therapeutic Target"}</span>
                  <span>•</span>
                  <span><strong>UniProt:</strong> <code className="font-mono-code font-bold text-teal-700">{selectedTarget.uniprotId || "N/A"}</code></span>
                  <span>•</span>
                  <span><strong>Druggability:</strong> {selectedTarget.druggabilityStatus || "Preclinical Candidate"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSaveTarget(selectedTarget.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                      isSavedInWorkspace
                        ? 'bg-teal-100 text-teal-900 border border-teal-300'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {isSavedInWorkspace ? <BookmarkCheck className="w-3.5 h-3.5 text-teal-600" /> : <Bookmark className="w-3.5 h-3.5" />}
                    <span>{isSavedInWorkspace ? 'Saved in Workspace' : 'Save Target'}</span>
                  </button>

                  <button
                    onClick={() => openTargetDetails(selectedTarget.geneSymbol)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Full Dossier</span>
                  </button>

                  <button
                    onClick={() => navigateTo('pathway')}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Network className="w-3.5 h-3.5 text-teal-600" />
                    <span>Pathway Explorer</span>
                  </button>
                </div>
              </div>

              {/* Main Content Body */}
              <div className="p-6 space-y-6">

                {/* 1. Relevance to Submitted Research Question */}
                <div className="p-4 rounded-xl bg-teal-50/80 border border-teal-200">
                  <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-teal-900 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    Relevance to Your Research Question
                  </h3>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {selectedTarget.questionRelevanceExplanation}
                  </p>
                </div>

                {/* 2. Three-Column Biological Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  
                  {/* Column A: Associated Pathways */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-teal-600" />
                      Associated Pathways
                    </h4>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedTarget.associatedProcess || "Involved in critical signal transduction cascades in endometriotic lesions."}
                    </p>
                  </div>

                  {/* Column B: Role in Endometriosis */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-rose-600" />
                      Role in Endometriosis
                    </h4>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedTarget.roleInEndometriosis || selectedTarget.normalFunction || "Exhibits altered expression and dysregulated activity in human endometriosis cohorts."}
                    </p>
                  </div>

                  {/* Column C: Therapeutic Significance */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <FlaskConical className="w-3.5 h-3.5 text-cyan-600" />
                      Therapeutic Significance
                    </h4>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedTarget.aiExplanation || "Promising intervention point to mitigate chronic pain, inflammation, and lesion progression without systemic adverse events."}
                    </p>
                  </div>

                </div>

                {/* 3. Evidence Matrix & Supporting Research References */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-teal-600" />
                      Supporting Research Evidence & Paper References
                    </h3>

                    <span className="text-[11px] font-semibold text-slate-500">
                      Classification: <span className="text-teal-700 font-bold">{selectedTarget.evidenceClassification}</span>
                    </span>
                  </div>

                  {/* Evidence Items */}
                  {selectedTarget.supportingEvidence && selectedTarget.supportingEvidence.length > 0 ? (
                    <div className="space-y-2.5">
                      {selectedTarget.supportingEvidence.slice(0, 3).map((ev, i) => (
                        <div
                          key={i}
                          className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                            ev.isUserPaper
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                              : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              ev.isUserPaper ? 'bg-emerald-200/80 text-emerald-900' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {ev.type}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {ev.journal} ({ev.year}) {ev.doi && `• DOI: ${ev.doi}`}
                            </span>
                          </div>

                          <div className="font-semibold text-slate-900 text-xs mb-1">
                            "{ev.title}"
                          </div>

                          <p className="text-slate-600 text-[11px]">
                            <strong>Findings: </strong>{ev.findings}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>AI-Suggested Exploratory Target: </strong>
                        Direct peer-reviewed biopsy data is currently limited in the local repository. This target was identified via downstream pathway cross-talk and requires laboratory in-vitro or biopsy confirmation.
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Score Bar & Known Drugs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-1 font-semibold text-[11px]">Algorithmic Prioritization Score:</span>
                    <PriorityScoreBar score={selectedTarget.calculatedScore || selectedTarget.relevanceScore} />
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-1 font-semibold text-[11px]">Known Pharmacological Modulators:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTarget.knownDrugs && selectedTarget.knownDrugs.length > 0 ? (
                        selectedTarget.knownDrugs.map((drug, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 text-[11px] font-medium">
                            {drug.name} <span className="text-[10px] text-slate-500 font-normal">({drug.status})</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">No approved selective small molecule modulators currently documented.</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* 6. QUERY HISTORY DRAWER / PREVIOUS INQUIRIES */}
      {queryHistory.length > 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              Your Research Inquiry History ({queryHistory.length})
            </h3>
            <span className="text-[11px] text-slate-400">Per-user isolated storage</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {queryHistory.map((item) => {
              const isCurrent = currentResult?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectHistoryItem(item)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start justify-between gap-2 ${
                    isCurrent
                      ? 'bg-teal-50 border-teal-300 text-teal-950 font-semibold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-900">{item.question}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{item.top10Targets?.length || 10} Targets</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteHistoryItem(e, item.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                    title="Remove from history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-slate-400 pt-1">
            * Note: Query history and generated results are saved to your browser session (localStorage persistence) and isolated by user account.
          </p>
        </div>
      )}

    </div>
  );
}

