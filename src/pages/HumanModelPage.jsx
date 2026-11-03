import React, { useState, useEffect } from 'react';
import { useResearch } from '../context/ResearchContext';
import {
  generateTop10Targets,
  getHumanModelQueries,
  deleteHumanModelQuery,
  evaluateExperimentalModels,
  getModelRecommendation,
  saveModelRecommendation
} from '../services/humanModelService';
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
  Info,
  Copy,
  Check,
  Download,
  Microscope,
  Sliders,
  Award,
  ChevronRight
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

  // Experimental Model Recommendation state
  const [modelRecommendation, setModelRecommendation] = useState(null);
  const [isRecommendingModel, setIsRecommendingModel] = useState(false);
  const [activeModelTab, setActiveModelTab] = useState('priority'); // 'priority' | 'alternatives' | 'strategy' | 'citations'
  const [copiedStrategy, setCopiedStrategy] = useState(false);

  // Check for cached recommendation whenever selected target or user changes
  useEffect(() => {
    if (user?.id && selectedTargetSymbol) {
      const cached = getModelRecommendation(user.id, selectedTargetSymbol);
      if (cached) {
        setModelRecommendation(cached);
      } else {
        setModelRecommendation(null);
      }
    } else {
      setModelRecommendation(null);
    }
  }, [selectedTargetSymbol, user?.id]);

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

  // Trigger experimental model evaluation for the selected target
  const handleRecommendModel = () => {
    if (!selectedTarget) return;
    setIsRecommendingModel(true);

    setTimeout(() => {
      try {
        const rec = evaluateExperimentalModels(selectedTarget, currentResult?.question || '', {
          userId: user?.id
        });
        setModelRecommendation(rec);
        showNotification(`Recommended ${rec.recommendedPriorityModel.modelName} for ${selectedTarget.geneSymbol}`, 'success');

        // Smooth scroll to the recommendation section
        setTimeout(() => {
          const el = document.getElementById('experimental-model-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } catch (err) {
        console.error("Model recommendation failed:", err);
        showNotification("Failed to evaluate experimental models", "warning");
      } finally {
        setIsRecommendingModel(false);
      }
    }, 300);
  };

  // Copy experimental strategy protocol to clipboard
  const handleCopyStrategy = () => {
    if (!modelRecommendation) return;
    const { targetSymbol, targetName, recommendedPriorityModel, suggestedExperimentalStrategy } = modelRecommendation;
    const strat = suggestedExperimentalStrategy;

    const markdownText = `# Experimental Model Strategy Brief: ${targetSymbol} (${targetName})
## Priority Model: ${recommendedPriorityModel.modelName} (Suitability Score: ${recommendedPriorityModel.suitabilityScore}%)
Category: ${recommendedPriorityModel.modelCategory}

### Why this model is suitable:
${recommendedPriorityModel.targetSpecificSuitabilityReason}

### Key Biological Mechanisms Studied:
${recommendedPriorityModel.biologicalMechanisms.map((m) => `- ${m}`).join('\n')}

### Suggested Quantitative Readouts:
${recommendedPriorityModel.suggestedReadouts.map((r) => `- ${r}`).join('\n')}

### Clinical Translational Impact:
${recommendedPriorityModel.expectedResearchValue}

### Practical Considerations & Limitations:
${recommendedPriorityModel.practicalConsiderations}

---
## Actionable 4-Step Experimental Protocol Roadmap:
### ${strat.step1.title}
${strat.step1.description}
${strat.step1.protocols.map((p) => `  * ${p}`).join('\n')}

### ${strat.step2.title}
${strat.step2.description}
${strat.step2.protocols.map((p) => `  * ${p}`).join('\n')}

### ${strat.step3.title}
${strat.step3.description}
${strat.step3.protocols.map((p) => `  * ${p}`).join('\n')}

### ${strat.step4.title}
${strat.step4.description}
${strat.step4.protocols.map((p) => `  * ${p}`).join('\n')}

---
## Literature Benchmark Citations:
${recommendedPriorityModel.literatureEvidence.map((c) => `- ${c.authors} (${c.year}). "${c.title}" ${c.journal}. PMID: ${c.pmid}, DOI: ${c.doi}`).join('\n')}
`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(markdownText).then(() => {
        setCopiedStrategy(true);
        showNotification("Experimental strategy copied to clipboard", "success");
        setTimeout(() => setCopiedStrategy(false), 2500);
      }).catch(() => {
        showNotification("Clipboard access denied", "warning");
      });
    }
  };

  // Download experimental strategy brief as text file
  const handleDownloadStrategy = () => {
    if (!modelRecommendation) return;
    const { targetSymbol, targetName, recommendedPriorityModel, suggestedExperimentalStrategy } = modelRecommendation;
    const strat = suggestedExperimentalStrategy;

    const fileContent = `================================================================================
ENDOTARGET AI - TARGET-SPECIFIC EXPERIMENTAL MODEL RECOMMENDATION
================================================================================
Target: ${targetSymbol} (${targetName})
Evaluation Date: ${new Date(modelRecommendation.evaluationDate).toLocaleString()}
Dominant Biological Theme: ${modelRecommendation.dominantTheme}

RECOMMENDED PRIORITY MODEL (#1):
Model: ${recommendedPriorityModel.modelName}
Suitability Score: ${recommendedPriorityModel.suitabilityScore}%
Category: ${recommendedPriorityModel.modelCategory}

WHY THIS MODEL IS SUITABLE:
${recommendedPriorityModel.targetSpecificSuitabilityReason}

BIOLOGICAL MECHANISMS STUDIED:
${recommendedPriorityModel.biologicalMechanisms.map((m, i) => `${i + 1}. ${m}`).join('\n')}

SUGGESTED QUANTITATIVE READOUTS:
${recommendedPriorityModel.suggestedReadouts.map((r, i) => `${i + 1}. ${r}`).join('\n')}

CLINICAL TRANSLATIONAL IMPACT:
${recommendedPriorityModel.expectedResearchValue}

PRACTICAL CONSIDERATIONS & LIMITATIONS:
${recommendedPriorityModel.practicalConsiderations}

================================================================================
ACTIONABLE EXPERIMENTAL ROADMAP (4-STEP PROTOCOL)
================================================================================

${strat.step1.title}:
${strat.step1.description}
${strat.step1.protocols.map((p) => `  - ${p}`).join('\n')}

${strat.step2.title}:
${strat.step2.description}
${strat.step2.protocols.map((p) => `  - ${p}`).join('\n')}

${strat.step3.title}:
${strat.step3.description}
${strat.step3.protocols.map((p) => `  - ${p}`).join('\n')}

${strat.step4.title}:
${strat.step4.description}
${strat.step4.protocols.map((p) => `  - ${p}`).join('\n')}

================================================================================
ALTERNATIVE MODEL COMPARISON MATRIX (ALL 4 MODELS)
================================================================================
${modelRecommendation.rankedModels.map((m) => `
Rank #${m.rank}: ${m.modelName} (Score: ${m.suitabilityScore}%)
- Main Advantage: ${m.mainAdvantage}
- Main Limitation: ${m.mainLimitation}
- Rationale: ${m.targetSpecificSuitabilityReason}
`).join('\n')}

================================================================================
PEER-REVIEWED LITERATURE CITATIONS
================================================================================
${recommendedPriorityModel.literatureEvidence.map((c) => `
- ${c.authors} (${c.year}). "${c.title}" ${c.journal}. PMID: ${c.pmid} | DOI: ${c.doi}
  Key Finding: ${c.findings}
`).join('\n')}
`;

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EndoTarget_${targetSymbol}_Experimental_Model_Strategy.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification(`Downloaded ${targetSymbol} Experimental Strategy Brief`, "success");
  };

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
                    onClick={handleRecommendModel}
                    disabled={isRecommendingModel}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg font-bold text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    title="Evaluate the 4 experimental models for this target"
                  >
                    {isRecommendingModel ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Evaluating Models...</span>
                      </>
                    ) : (
                      <>
                        <FlaskConical className="w-3.5 h-3.5 text-cyan-200" />
                        <span>Recommend Experimental Model</span>
                      </>
                    )}
                  </button>

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

                {/* 5. EXPERIMENTAL MODEL RECOMMENDATION CALLOUT BANNER */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-500/30 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shrink-0">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-xs text-white flex items-center gap-2">
                        <span>Target-Specific Experimental Model Recommendation</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/30 text-teal-300 border border-teal-400/30">
                          4 Human Models
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                        Evaluate patient tissue explants, primary cells, organ-on-chip, and organoids to discover the optimal validation system for <strong className="text-teal-300 font-mono-code">{selectedTarget.geneSymbol}</strong>.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRecommendModel}
                    disabled={isRecommendingModel}
                    className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {isRecommendingModel ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Evaluating 4 Models...</span>
                      </>
                    ) : (
                      <>
                        <FlaskConical className="w-4 h-4 text-slate-950" />
                        <span>{modelRecommendation ? 'Re-evaluate Models' : 'Recommend Experimental Model'}</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* 6. TARGET-SPECIFIC EXPERIMENTAL MODEL RECOMMENDATION SECTION */}
          {modelRecommendation && selectedTarget && modelRecommendation.targetSymbol === selectedTarget.geneSymbol && (
            <div id="experimental-model-section" className="bg-white rounded-2xl border border-teal-200 shadow-md overflow-hidden animate-in fade-in duration-300">
              
              {/* Header Banner */}
              <div className="p-6 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white border-b border-teal-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 uppercase tracking-wider flex items-center gap-1.5">
                      <FlaskConical className="w-3.5 h-3.5 text-teal-400" />
                      Experimental Model Recommendation Engine
                    </span>
                    <span className="text-xs text-slate-400">
                      Target: <strong className="text-white font-mono-code">{modelRecommendation.targetSymbol}</strong>
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-teal-300 font-semibold">{modelRecommendation.dominantTheme}</span>
                  </div>
                  <h2 className="font-heading font-black text-xl text-white flex items-center gap-2">
                    <span>Recommended Priority Model:</span>
                    <span className="text-teal-400">{modelRecommendation.recommendedPriorityModel.modelName}</span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                    Evaluated 4 human experimental model systems using 5 biological criteria: biological relevance, disease mechanism reproduction, readout suitability, translational relevance, and technical feasibility.
                  </p>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyStrategy}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      copiedStrategy
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700'
                    }`}
                    title="Copy formatted markdown strategy protocol"
                  >
                    {copiedStrategy ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-teal-400" />}
                    <span>{copiedStrategy ? 'Copied Protocol!' : 'Copy Protocol'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadStrategy}
                    className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-600/30 cursor-pointer"
                    title="Download experimental strategy brief (.txt)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Brief</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRecommendModel}
                    disabled={isRecommendingModel}
                    className="p-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                    title="Re-run model evaluation"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRecommendingModel ? 'animate-spin text-teal-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs">
                {[
                  { id: 'priority', label: 'Recommended Priority Model', icon: Award, badge: 'Rank #1' },
                  { id: 'alternatives', label: 'Alternative Model Rankings', icon: Layers, badge: 'All 4 Models' },
                  { id: 'strategy', label: 'Actionable Experimental Strategy', icon: Sliders, badge: '4-Step Protocol' },
                  { id: 'citations', label: 'Peer-Reviewed Citations', icon: ShieldCheck, badge: 'Literature' },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeModelTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveModelTab(tab.id)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-teal-600'}`} />
                      <span>{tab.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                        isActive ? 'bg-teal-800 text-teal-100' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {tab.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* TAB CONTENT */}
              <div className="p-6">
                
                {/* ------------------------------------------------------------- */}
                {/* TAB 1: RECOMMENDED PRIORITY MODEL (RANK #1)                  */}
                {/* ------------------------------------------------------------- */}
                {activeModelTab === 'priority' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    
                    {/* Top Highlight Card */}
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-50 via-cyan-50/50 to-emerald-50/40 border-2 border-teal-500/40 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-teal-200/60">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-600/30 shrink-0">
                            <Award className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-600 text-white">
                                Rank #1 Recommended Priority Model
                              </span>
                              <span className="text-xs text-slate-500 font-medium">
                                Category: <strong>{modelRecommendation.recommendedPriorityModel.modelCategory}</strong>
                              </span>
                            </div>
                            <h3 className="font-heading font-black text-xl text-slate-900 mt-1">
                              {modelRecommendation.recommendedPriorityModel.modelName}
                            </h3>
                          </div>
                        </div>

                        {/* Suitability Score Gauge */}
                        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-teal-200 shadow-xs shrink-0">
                          <div className="text-right">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Suitability Score</span>
                            <span className="text-2xl font-heading font-black text-teal-600">
                              {modelRecommendation.recommendedPriorityModel.suitabilityScore}%
                            </span>
                          </div>
                          <div className="w-11 h-11 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-xs">
                            Top
                          </div>
                        </div>
                      </div>

                      {/* 5-Criteria Progress Bars */}
                      <div className="pt-4 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                          Evaluation Criteria Breakdown (0–100%):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                          {[
                            { label: "Biological Relevance", score: modelRecommendation.recommendedPriorityModel.scoresBreakdown.biologicalRelevance, weight: "35%" },
                            { label: "Disease Mechanism Reproduction", score: modelRecommendation.recommendedPriorityModel.scoresBreakdown.diseaseMechanismReproduction, weight: "25%" },
                            { label: "Readout Suitability", score: modelRecommendation.recommendedPriorityModel.scoresBreakdown.readoutSuitability, weight: "20%" },
                            { label: "Translational Relevance", score: modelRecommendation.recommendedPriorityModel.scoresBreakdown.translationalRelevance, weight: "15%" },
                            { label: "Technical Feasibility", score: modelRecommendation.recommendedPriorityModel.scoresBreakdown.technicalFeasibility, weight: "5%" },
                          ].map((crit, idx) => (
                            <div key={idx} className="bg-white/80 p-2.5 rounded-xl border border-teal-200/80">
                              <div className="flex justify-between items-center text-[11px] mb-1">
                                <span className="font-medium text-slate-600 truncate mr-1">{crit.label}</span>
                                <span className="font-bold text-teal-700">{crit.score}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-teal-600 rounded-full" style={{ width: `${crit.score}%` }} />
                              </div>
                              <span className="text-[9px] text-slate-400 block mt-0.5">Weight: {crit.weight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Why this model is suitable */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                      <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-teal-800 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-teal-600" />
                        Why This Model is Suitable for {modelRecommendation.targetSymbol} ({modelRecommendation.targetName})
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {modelRecommendation.recommendedPriorityModel.targetSpecificSuitabilityReason}
                      </p>
                    </div>

                    {/* 2-Column: Biological Mechanisms & Suggested Readouts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      
                      {/* Biological Mechanisms */}
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-emerald-600" />
                          Biological Mechanisms Studied in This Model
                        </h4>
                        <ul className="space-y-2">
                          {modelRecommendation.recommendedPriorityModel.biologicalMechanisms.map((mech, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{mech}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Suggested Experimental Readouts */}
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                          <Microscope className="w-4 h-4 text-cyan-600" />
                          Suggested Quantitative Readouts
                        </h4>
                        <ul className="space-y-2">
                          {modelRecommendation.recommendedPriorityModel.suggestedReadouts.map((ro, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                              <span className="w-4 h-4 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <span>{ro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* 2-Column: Research Value & Practical Considerations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      
                      {/* Expected Research Value */}
                      <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-2">
                        <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-teal-900 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-teal-600" />
                          Expected Research Value & Translational Impact
                        </h4>
                        <p className="text-slate-700 leading-relaxed">
                          {modelRecommendation.recommendedPriorityModel.expectedResearchValue}
                        </p>
                      </div>

                      {/* Practical Considerations */}
                      <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                        <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          Practical Considerations & Technical Limitations
                        </h4>
                        <p className="text-slate-700 leading-relaxed">
                          {modelRecommendation.recommendedPriorityModel.practicalConsiderations}
                        </p>
                      </div>
                    </div>

                    {/* Quick Link to 4-Step Strategy */}
                    <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Sliders className="w-4 h-4 text-teal-600" />
                        <span>Ready to run this assay? Review the actionable 4-step experimental protocol roadmap.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveModelTab('strategy')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        <span>View 4-Step Protocol</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 2: ALTERNATIVE MODEL RANKINGS (ALL 4 MODELS)             */}
                {/* ------------------------------------------------------------- */}
                {activeModelTab === 'alternatives' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div>
                      <h3 className="font-heading font-bold text-sm text-slate-900">
                        Comparative Evaluation of All 4 Experimental Model Systems
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Evaluated specifically for <strong className="text-slate-800">{modelRecommendation.targetSymbol}</strong>. Ranks indicate biological suitability, readout feasibility, and disease fidelity.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {modelRecommendation.rankedModels.map((model) => {
                        const isRank1 = model.rank === 1;
                        return (
                          <div
                            key={model.modelId}
                            className={`p-5 rounded-2xl border transition-all ${
                              isRank1
                                ? 'bg-gradient-to-r from-teal-50/70 via-white to-emerald-50/40 border-2 border-teal-500/80 shadow-sm'
                                : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
                              <div className="flex items-center gap-3">
                                <span className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 ${
                                  isRank1 ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-200 text-slate-700'
                                }`}>
                                  #{model.rank}
                                </span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-heading font-black text-sm text-slate-900">
                                      {model.modelName}
                                    </h4>
                                    {isRank1 && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                        Recommended Priority
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-slate-500 font-medium">
                                    {model.modelCategory}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <div className="text-right">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Suitability Score</span>
                                  <span className={`text-lg font-heading font-black ${isRank1 ? 'text-teal-600' : 'text-slate-700'}`}>
                                    {model.suitabilityScore}%
                                  </span>
                                </div>
                                <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${isRank1 ? 'bg-teal-600' : 'bg-slate-500'}`} style={{ width: `${model.suitabilityScore}%` }} />
                                </div>
                              </div>
                            </div>

                            {/* Rationale */}
                            <p className="text-xs text-slate-700 leading-relaxed font-medium mt-3">
                              <strong>Ranking Rationale: </strong>{model.targetSpecificSuitabilityReason}
                            </p>

                            {/* Main Advantage & Limitation */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 text-xs">
                              <div className="p-3 rounded-xl bg-white border border-emerald-200 text-emerald-950 flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                  <strong>Main Advantage: </strong>{model.mainAdvantage}
                                </div>
                              </div>

                              <div className="p-3 rounded-xl bg-white border border-amber-200 text-amber-950 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                  <strong>Main Limitation: </strong>{model.mainLimitation}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 3: ACTIONABLE EXPERIMENTAL STRATEGY (4-STEP ROADMAP)     */}
                {/* ------------------------------------------------------------- */}
                {activeModelTab === 'strategy' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-heading font-bold text-sm text-slate-900">
                          Actionable 4-Step Experimental Roadmap
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Standard Operating Procedure (SOP) to validate <strong className="text-slate-800">{modelRecommendation.targetSymbol}</strong> using <strong>{modelRecommendation.recommendedPriorityModel.modelName}</strong>.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopyStrategy}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                        >
                          {copiedStrategy ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-teal-600" />}
                          <span>{copiedStrategy ? 'Copied!' : 'Copy Roadmap'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleDownloadStrategy}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Protocol</span>
                        </button>
                      </div>
                    </div>

                    {/* Step Cards */}
                    <div className="space-y-4 text-xs">
                      {[
                        modelRecommendation.suggestedExperimentalStrategy.step1,
                        modelRecommendation.suggestedExperimentalStrategy.step2,
                        modelRecommendation.suggestedExperimentalStrategy.step3,
                        modelRecommendation.suggestedExperimentalStrategy.step4,
                      ].map((step, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                              0{step.stepNumber}
                            </span>
                            <div>
                              <h4 className="font-heading font-black text-sm text-slate-900">
                                {step.title}
                              </h4>
                              <p className="text-slate-500 text-[11px]">
                                {step.description}
                              </p>
                            </div>
                          </div>

                          <div className="pl-10 space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              Standard Operating Protocol (SOP):
                            </span>
                            <ul className="space-y-1.5">
                              {step.protocols.map((protocol, pIdx) => (
                                <li key={pIdx} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                                  <ChevronRight className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                                  <span>{protocol}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Proviso / Safety Note */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        {modelRecommendation.provisionalValidationNote}
                      </p>
                    </div>

                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 4: PEER-REVIEWED CITATIONS & EVIDENCE                   */}
                {/* ------------------------------------------------------------- */}
                {activeModelTab === 'citations' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    
                    {/* Literature vs AI distinction header */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-800">
                          Evidence Classification
                        </h4>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          Seminal peer-reviewed benchmarks establishing model validity in endometriosis.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Published Literature Grounding
                        </span>
                        <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-cyan-100 text-cyan-800 border border-cyan-300 flex items-center gap-1">
                          <Brain className="w-3 h-3 text-cyan-700" />
                          AI Protocol Adaptation
                        </span>
                      </div>
                    </div>

                    {/* Benchmark Citations for Priority Model */}
                    <div className="space-y-4 text-xs">
                      <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-teal-600" />
                        Peer-Reviewed Model Citations for {modelRecommendation.recommendedPriorityModel.modelName}
                      </h4>

                      {modelRecommendation.recommendedPriorityModel.literatureEvidence.map((cit, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-bold text-slate-900 text-xs">
                              {cit.authors} ({cit.year})
                            </span>
                            <span className="text-[11px] text-teal-700 font-semibold">
                              {cit.journal}
                            </span>
                          </div>

                          <div className="font-semibold text-slate-800 text-xs italic">
                            "{cit.title}"
                          </div>

                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            <strong>Key Findings & Methodology Relevance: </strong>{cit.findings}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
                            {cit.pmid && (
                              <a
                                href={`https://pubmed.ncbi.nlm.nih.gov/${cit.pmid}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-mono-code font-bold underline"
                              >
                                <span>PMID: {cit.pmid}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {cit.doi && (
                              <a
                                href={`https://doi.org/${cit.doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 font-mono-code font-semibold"
                              >
                                <span>DOI: {cit.doi}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

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

