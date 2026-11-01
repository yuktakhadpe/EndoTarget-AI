import React, { useState } from 'react';
import { useResearch } from '../context/ResearchContext';
import { EvidenceBadge, CategoryBadge } from '../components/EvidenceBadge';
import { PriorityScoreBar } from '../components/PriorityScoreBar';
import {
  X,
  Dna,
  Bookmark,
  BookmarkCheck,
  Scale,
  Network,
  Download,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  FileText,
  Activity,
  Layers,
  FlaskConical,
  CheckCircle2,
  Printer,
  Database
} from 'lucide-react';

export function TargetDetailsModal() {
  const {
    selectedTarget,
    closeTargetDetails,
    savedTargetIds,
    toggleSaveTarget,
    comparisonTargetIds,
    toggleCompareTarget,
    setIsComparisonOpen,
    navigateTo,
    showNotification,
    openResourceExplorer,
  } = useResearch();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'evidence' | 'druggability' | 'ai-explanation' | 'gaps'

  if (!selectedTarget) return null;

  const isSaved = savedTargetIds.includes(selectedTarget.id);
  const isCompared = comparisonTargetIds.includes(selectedTarget.id);

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 font-bold">
              <Dna className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-mono-code font-extrabold text-white">
                  {selectedTarget.geneSymbol}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Rank #{selectedTarget.rank} of Prioritized Targets
                </span>
                <CategoryBadge category={selectedTarget.biologicalCategory} />
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {selectedTarget.targetName} • {selectedTarget.proteinName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintDossier}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
              title="Print / Save PDF Dossier"
            >
              <Printer className="w-3.5 h-3.5 text-teal-400" />
              <span>Export Dossier</span>
            </button>

            <button
              onClick={closeTargetDetails}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Quick biological identifiers */}
          <div className="flex items-center gap-4 text-slate-500">
            <span>
              UniProt: <a href={`https://www.uniprot.org/uniprotkb/${selectedTarget.uniprotId}`} target="_blank" rel="noreferrer" className="font-mono-code text-teal-700 font-semibold hover:underline inline-flex items-center gap-0.5">{selectedTarget.uniprotId} <ExternalLink className="w-2.5 h-2.5" /></a>
            </span>
            <span>
              Ensembl: <span className="font-mono-code text-slate-700">{selectedTarget.ensemblId}</span>
            </span>
            <span>
              PDB: <span className="font-mono-code text-slate-700 font-semibold">{selectedTarget.pdbId}</span>
            </span>
          </div>

          {/* Interactive buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveTarget(selectedTarget.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors border ${
                isSaved
                  ? 'bg-teal-50 text-teal-800 border-teal-300'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-teal-600" /> : <Bookmark className="w-3.5 h-3.5 text-slate-400" />}
              <span>{isSaved ? 'Saved in Workspace' : 'Save Target'}</span>
            </button>

            <button
              onClick={() => {
                toggleCompareTarget(selectedTarget.id);
                setIsComparisonOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg font-medium border border-slate-300 transition-colors"
            >
              <Scale className="w-3.5 h-3.5 text-cyan-600" />
              <span>Compare Target</span>
            </button>

            <button
              onClick={() => {
                closeTargetDetails();
                navigateTo('pathway');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              <Network className="w-3.5 h-3.5" />
              <span>Explore Pathway</span>
            </button>

            <button
              onClick={() => {
                closeTargetDetails();
                openResourceExplorer('uniprot', selectedTarget.geneSymbol);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors shadow-sm"
              title="Query public biological databases for this target"
            >
              <Database className="w-3.5 h-3.5 text-teal-400" />
              <span>Bio Resources</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 flex gap-6 bg-white overflow-x-auto text-xs font-medium">
          {[
            { id: 'overview', label: '1. Target Overview & Biology' },
            { id: 'evidence', label: `2. Research Evidence (${selectedTarget.evidenceMatrix.length} Studies)` },
            { id: 'druggability', label: '3. Druggability & Compounds' },
            { id: 'ai-explanation', label: '4. AI Prioritization Explanation' },
            { id: 'gaps', label: '5. Critical Research Gaps' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-teal-600 text-teal-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800 text-sm">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Score Highlight Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                    AI Prioritization Score
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-heading font-black text-teal-900">
                      {selectedTarget.calculatedScore}
                    </span>
                    <span className="text-slate-500 font-medium">/ 100</span>
                    <span className="ml-2 text-xs font-bold text-teal-800 bg-teal-200/60 px-2 py-0.5 rounded-full">
                      {selectedTarget.priorityTier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Calculated using multi-variable clinical evidence, disease pathology weighting, and molecular tractability.
                  </p>
                </div>
                <div className="w-full md:w-64 shrink-0 bg-white p-3 rounded-lg border border-teal-100 shadow-sm">
                  <PriorityScoreBar score={selectedTarget.calculatedScore} showLabel={false} size="md" />
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span>Rank: <strong className="text-slate-800">#{selectedTarget.rank}</strong></span>
                    <span>Supporting Papers: <strong className="text-slate-800">{selectedTarget.supportingPaperCount}</strong></span>
                  </div>
                </div>
              </div>

              {/* Cross-Database Live Query Links */}
              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
                <span className="font-bold text-teal-900 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-teal-600" />
                  Explore {selectedTarget.geneSymbol} in live public databases:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => { closeTargetDetails(); openResourceExplorer('gene', selectedTarget.geneSymbol); }}
                    className="px-2 py-1 bg-white hover:bg-teal-600 hover:text-white text-slate-700 border border-slate-200 rounded text-[11px] font-semibold transition-colors shadow-xs"
                  >
                    NCBI Gene
                  </button>
                  <button
                    onClick={() => { closeTargetDetails(); openResourceExplorer('uniprot', selectedTarget.geneSymbol); }}
                    className="px-2 py-1 bg-white hover:bg-teal-600 hover:text-white text-slate-700 border border-slate-200 rounded text-[11px] font-semibold transition-colors shadow-xs"
                  >
                    UniProt
                  </button>
                  <button
                    onClick={() => { closeTargetDetails(); openResourceExplorer('string', selectedTarget.geneSymbol); }}
                    className="px-2 py-1 bg-white hover:bg-teal-600 hover:text-white text-slate-700 border border-slate-200 rounded text-[11px] font-semibold transition-colors shadow-xs"
                  >
                    STRING PPI
                  </button>
                  <button
                    onClick={() => { closeTargetDetails(); openResourceExplorer('chembl', selectedTarget.geneSymbol); }}
                    className="px-2 py-1 bg-white hover:bg-teal-600 hover:text-white text-slate-700 border border-slate-200 rounded text-[11px] font-semibold transition-colors shadow-xs"
                  >
                    ChEMBL
                  </button>
                  <button
                    onClick={() => { closeTargetDetails(); openResourceExplorer('endometdb', selectedTarget.geneSymbol); }}
                    className="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded text-[11px] font-semibold transition-colors shadow-xs"
                  >
                    EndometDB
                  </button>
                  <button
                    onClick={() => { closeTargetDetails(); openResourceExplorer('geo', `${selectedTarget.geneSymbol} endometriosis`); }}
                    className="px-2 py-1 bg-white hover:bg-teal-600 hover:text-white text-slate-700 border border-slate-200 rounded text-[11px] font-semibold transition-colors shadow-xs"
                  >
                    NCBI GEO
                  </button>
                  <button
                    onClick={() => { closeTargetDetails(); openResourceExplorer('gwas', selectedTarget.geneSymbol); }}
                    className="px-2 py-1 bg-white hover:bg-teal-600 hover:text-white text-slate-700 border border-slate-200 rounded text-[11px] font-semibold transition-colors shadow-xs"
                  >
                    GWAS
                  </button>
                </div>
              </div>

              {/* Biological Function Section */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-heading font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600" />
                  Normal Physiological Function in the Human Body
                </h4>
                <p className="text-xs leading-relaxed text-slate-700">
                  {selectedTarget.normalFunction}
                </p>
              </div>

              {/* Specific Role in Endometriosis */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-heading font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                  <Dna className="w-4 h-4 text-rose-600" />
                  Pathological Role in Endometriosis Disease Development
                </h4>
                <p className="text-xs leading-relaxed text-slate-700">
                  {selectedTarget.roleInEndometriosis}
                </p>
              </div>

              {/* Key Parameters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Target Class</span>
                  <p className="font-semibold text-slate-800 text-xs mt-0.5">{selectedTarget.targetClass}</p>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Primary Evidence Type</span>
                  <div className="mt-1">
                    <EvidenceBadge type={selectedTarget.evidenceType} size="xs" />
                  </div>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Chemical Tractability</span>
                  <p className="font-semibold text-slate-800 text-xs mt-0.5">{selectedTarget.druggabilityStatus}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EVIDENCE MATRIX */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-slate-900 text-sm">
                    Classified Scientific Evidence Matrix
                  </h4>
                  <p className="text-xs text-slate-500">
                    Sourced peer-reviewed findings categorized by experimental model validity
                  </p>
                </div>
                <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
                  {selectedTarget.supportingPaperCount} Indexed Publications
                </span>
              </div>

              <div className="space-y-3">
                {selectedTarget.evidenceMatrix.map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-200 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <EvidenceBadge type={item.type} size="xs" />
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{item.journal}</span>
                        <span>({item.year})</span>
                        {item.doi && (
                          <a
                            href={`https://doi.org/${item.doi}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono-code text-teal-600 hover:text-teal-800 inline-flex items-center gap-1 font-semibold"
                          >
                            DOI: {item.doi} <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <h5 className="font-bold text-xs text-slate-900 leading-snug mb-1">
                      {item.title}
                    </h5>
                    <div className="bg-white p-2.5 rounded border border-slate-200/80 text-xs text-slate-700 mt-2">
                      <strong className="text-slate-900">Key Extracted Finding: </strong>
                      {item.findings}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DRUGGABILITY & PHARMACOLOGY */}
          {activeTab === 'druggability' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Druggability Tier Assessment
                    </span>
                    <h4 className="font-heading font-bold text-base text-slate-900">
                      {selectedTarget.druggabilityStatus}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-heading font-bold text-teal-700">
                      {selectedTarget.rawScores.druggability}
                    </span>
                    <span className="text-xs text-slate-400">/100</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Calculated based on 3D crystal structure availability (PDB entry <strong className="font-mono-code text-slate-900">{selectedTarget.pdbId}</strong>), verified ligand binding pockets, and clinical trial safety history in other indications.
                </p>
              </div>

              {/* Known Drugs / Ligands */}
              <div>
                <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
                  Known Chemical Matter & Clinical Repurposing Candidates
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedTarget.knownDrugs.map((drug, i) => (
                    <div key={i} className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900">{drug.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {drug.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-teal-700 font-medium mt-1">
                        {drug.status}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cross-Database Live Query Links */}
              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
                <span className="font-bold text-teal-900 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-teal-600" />
                  Explore {selectedTarget.geneSymbol} in live public databases:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => { closeTargetDetails(); openResourceExplorer('gene', selectedTarget.geneSymbol); }}
                    className="px-2 py-1 bg-white hover:bg-teal-600 hover:text-white text-slate-700 border border-slate-200 rounded text-[11px] font-semibold transition-colors shadow-xs"
                  >
                    NCBI Gene
                  </button>
                  <button
                    onClick={() => { closeTargetDetails(); openResourceExplorer('uniprot', selectedTarget.geneSymbol); }}
                    className="px-2 py-1 bg-white hover:bg-teal-600 hover:text-white text-slate-700 border border-slate-200 rounded text-[11px] font-semibold transition-colors shadow-xs"
                  >
                    UniProt
                  </button>
                  <button
                    onClick={() => { closeTargetDetails(); openResourceExplorer('string', selectedTarget.geneSymbol); }}
                    className="px-2 py-1 bg-white hover:bg-teal-600 hover:text-white text-slate-700 border border-slate-200 rounded text-[11px] font-semibold transition-colors shadow-xs"
                  >
                    STRING PPI
                  </button>
                  <button
                    onClick={() => { closeTargetDetails(); openResourceExplorer('chembl', selectedTarget.geneSymbol); }}
                    className="px-2 py-1 bg-white hover:bg-teal-600 hover:text-white text-slate-700 border border-slate-200 rounded text-[11px] font-semibold transition-colors shadow-xs"
                  >
                    ChEMBL
                  </button>
                  <button
                    onClick={() => { closeTargetDetails(); openResourceExplorer('endometdb', selectedTarget.geneSymbol); }}
                    className="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded text-[11px] font-semibold transition-colors shadow-xs"
                  >
                    EndometDB
                  </button>
                  <button
                    onClick={() => { closeTargetDetails(); openResourceExplorer('geo', `${selectedTarget.geneSymbol} endometriosis`); }}
                    className="px-2 py-1 bg-white hover:bg-teal-600 hover:text-white text-slate-700 border border-slate-200 rounded text-[11px] font-semibold transition-colors shadow-xs"
                  >
                    NCBI GEO
                  </button>
                  <button
                    onClick={() => { closeTargetDetails(); openResourceExplorer('gwas', selectedTarget.geneSymbol); }}
                    className="px-2 py-1 bg-white hover:bg-teal-600 hover:text-white text-slate-700 border border-slate-200 rounded text-[11px] font-semibold transition-colors shadow-xs"
                  >
                    GWAS
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI PRIORITIZATION EXPLANATION */}
          {activeTab === 'ai-explanation' && (
            <div className="space-y-6">
              <div className="p-4 bg-teal-950 text-white rounded-xl border border-teal-800 shadow-md">
                <div className="flex items-center gap-2 mb-2 text-teal-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  Explainable AI Ranking Justification
                </div>
                <p className="text-xs leading-relaxed text-teal-100">
                  {selectedTarget.aiExplanation}
                </p>
              </div>

              {/* Parameter Scoring Breakdown */}
              <div>
                <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
                  6-Parameter Scoring Metric Breakdown
                </h5>
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {[
                    { label: "Human Research Evidence (25%)", score: selectedTarget.rawScores.humanEvidence, color: "bg-teal-500" },
                    { label: "Endometriosis Pathological Association (20%)", score: selectedTarget.rawScores.endometriosisAssociation, color: "bg-cyan-500" },
                    { label: "Biological Pathway Relevance (15%)", score: selectedTarget.rawScores.pathwayRelevance, color: "bg-blue-500" },
                    { label: "Druggability & Tractability (15%)", score: selectedTarget.rawScores.druggability, color: "bg-emerald-500" },
                    { label: "Strength & Consistency of Literature (15%)", score: selectedTarget.rawScores.evidenceStrength, color: "bg-amber-500" },
                    { label: "Research Novelty / Non-Hormonal Innovation (10%)", score: selectedTarget.rawScores.researchNovelty, color: "bg-purple-500" },
                  ].map((param, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-medium text-slate-700">{param.label}</span>
                        <span className="font-bold text-slate-900 font-mono-code">{param.score}/100</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className={`h-2 rounded-full ${param.color}`} style={{ width: `${param.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CRITICAL RESEARCH GAPS */}
          {activeTab === 'gaps' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  Identified Scientific Blindspots & Translation Hurdles
                </div>
                <p className="text-xs leading-relaxed text-amber-900">
                  {selectedTarget.researchGaps}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
                <h5 className="font-bold text-slate-900">Recommended Next Experiments for Drug Discovery Teams:</h5>
                <ul className="list-disc pl-5 space-y-1.5 leading-relaxed text-slate-600">
                  <li>Quantify target expression in primary patient deep infiltrating endometriotic lesions (rectovaginal and bladder) versus superficial peritoneal lesions.</li>
                  <li>Perform pharmacokinetic testing with local sustained-release formulations (e.g. intrauterine or nanoparticle delivery) to minimize systemic liabilities.</li>
                  <li>Evaluate long-term ovarian follicular reserve and endometrial receptivity in reproductive-age animal models.</li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Source: PubMed, UniProt, Open Targets Platform & ChEMBL databases
          </span>
          <button
            onClick={closeTargetDetails}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
}
