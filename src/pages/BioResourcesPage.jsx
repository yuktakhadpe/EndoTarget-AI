import React, { useState, useEffect, useCallback } from 'react';
import { useResearch } from '../context/ResearchContext';
import {
  Database,
  Search,
  ExternalLink,
  Dna,
  Network,
  FlaskConical,
  Layers,
  Activity,
  Sparkles,
  FileText,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

import {
  searchGeoDatasets,
  FEATURED_GSE213216,
  searchNcbiGene,
  searchUniprot,
  fetchStringInteractions,
  getStringEmbedUrl,
  searchChembl,
  searchGwasCatalog,
} from '../services/bioApis';

import {
  ENDOMETDB_METADATA,
  ENDOMETDB_CURATED_GENES,
} from '../data/endometDbData';

const DEFAULT_QUERIES = {
  geo: 'GSE213216',
  endometdb: '',
  gene: 'ESR2',
  uniprot: 'ESR2',
  string: 'ESR2',
  chembl: 'ESR2',
  gwas: 'endometriosis',
};

export function BioResourcesPage() {
  const {
    activeResourceTab,
    setActiveResourceTab,
    resourceQuery,
    setResourceQuery,
    openTargetDetails,
  } = useResearch();

  // Active resource tab: 'geo' | 'endometdb' | 'gene' | 'uniprot' | 'string' | 'chembl' | 'gwas'
  const activeTab = activeResourceTab || 'geo';
  const setActiveTab = setActiveResourceTab;

  // Search input state
  const [searchInput, setSearchInput] = useState(resourceQuery || 'GSE213216');

  // Loading & Error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Results states
  const [geoResults, setGeoResults] = useState([FEATURED_GSE213216]);
  const [geneResults, setGeneResults] = useState([]);
  const [uniprotResults, setUniprotResults] = useState([]);
  const [stringResults, setStringResults] = useState([]);
  const [stringGene, setStringGene] = useState('ESR2');
  const [chemblResults, setChemblResults] = useState({ targets: [], molecules: [] });
  const [gwasResults, setGwasResults] = useState([]);

  // EndometDB filter states
  const [endometSearch, setEndometSearch] = useState('');
  const [selectedTissueFilter, setSelectedTissueFilter] = useState('ALL');

  const executeSearch = useCallback(async (tab, query) => {
    if (tab === 'endometdb') return; // Handled client-side

    const q = (query || '').trim();
    if (!q) return;

    setLoading(true);
    setError(null);

    try {
      if (tab === 'geo') {
        const res = await searchGeoDatasets(q);
        setGeoResults(res);
      } else if (tab === 'gene') {
        const res = await searchNcbiGene(q);
        setGeneResults(res);
      } else if (tab === 'uniprot') {
        const res = await searchUniprot(q);
        setUniprotResults(res);
      } else if (tab === 'string') {
        setStringGene(q.toUpperCase());
        const res = await fetchStringInteractions(q);
        setStringResults(res);
      } else if (tab === 'chembl') {
        const res = await searchChembl(q);
        setChemblResults(res);
      } else if (tab === 'gwas') {
        const res = await searchGwasCatalog(q);
        setGwasResults(res);
      }
    } catch (err) {
      console.error(`Error querying ${tab}:`, err);
      setError(err.message || 'Failed to communicate with public database. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial and reactive load for active tab or context query
  useEffect(() => {
    const q = resourceQuery || DEFAULT_QUERIES[activeTab] || 'endometriosis';
    executeSearch(activeTab, q);
  }, [activeTab, resourceQuery, executeSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    executeSearch(activeTab, searchInput);
  };

  const handlePresetClick = (presetQuery) => {
    setSearchInput(presetQuery);
    setResourceQuery(presetQuery);
    executeSearch(activeTab, presetQuery);
  };

  // Filtered EndometDB genes
  const filteredEndometGenes = ENDOMETDB_CURATED_GENES.filter(g => {
    const matchesSearch =
      g.geneSymbol.toLowerCase().includes(endometSearch.toLowerCase()) ||
      g.geneName.toLowerCase().includes(endometSearch.toLowerCase()) ||
      g.lesionUpregulation.toLowerCase().includes(endometSearch.toLowerCase());

    const matchesTissue =
      selectedTissueFilter === 'ALL' ||
      g.tissueProfile[selectedTissueFilter] === 'High' ||
      g.tissueProfile[selectedTissueFilter] === 'Very High';

    return matchesSearch && matchesTissue;
  });

  const resourceTabs = [
    { id: 'geo', name: 'NCBI GEO', label: 'Expression Datasets', icon: Layers, badge: 'API Live' },
    { id: 'endometdb', name: 'EndometDB', label: 'Endometriosis Cohort', icon: Dna, badge: 'Curated' },
    { id: 'gene', name: 'NCBI Gene', label: 'Gene Information', icon: FileText, badge: 'API Live' },
    { id: 'uniprot', name: 'UniProt', label: 'Protein Knowledgebase', icon: Sparkles, badge: 'API Live' },
    { id: 'string', name: 'STRING', label: 'Protein Interactions', icon: Network, badge: 'API Live' },
    { id: 'chembl', name: 'ChEMBL', label: 'Bioactivities & Drugs', icon: FlaskConical, badge: 'API Live' },
    { id: 'gwas', name: 'GWAS Catalog', label: 'Genetic Associations', icon: Activity, badge: 'API Live' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold mb-1">
            <Database className="w-3.5 h-3.5 text-teal-600" />
            Live Biomedical Data Hub
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">
            Biological Resources & Databases
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Directly search and explore external genomic datasets, interactomes, drug bioactivities, and endometriosis cohorts.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Public APIs Connected (Direct & Keyless)</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs">
        {resourceTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchInput(DEFAULT_QUERIES[tab.id] || '');
                setError(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl font-bold transition-all whitespace-nowrap border-b-2 ${
                isActive
                  ? 'border-teal-600 bg-teal-50/70 text-teal-900 shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
              <span>{tab.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                isActive ? 'bg-teal-200/80 text-teal-900' : 'bg-slate-200 text-slate-600'
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* SEARCH BAR (For API-connected tabs) */}
      {activeTab !== 'endometdb' && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  activeTab === 'geo'
                    ? 'Search NCBI GEO (e.g. GSE213216, endometriosis single cell, peritoneal)...'
                    : activeTab === 'gene'
                    ? 'Search NCBI Gene by symbol or description (e.g. ESR2, PTGS2, VEGFA, MMP9)...'
                    : activeTab === 'uniprot'
                    ? 'Search UniProt by protein or gene (e.g. ESR2, Q92731, Aromatase, COX-2)...'
                    : activeTab === 'string'
                    ? 'Enter gene symbol to map interactors (e.g. ESR2, PTGS2, VEGFA, HDAC6)...'
                    : activeTab === 'chembl'
                    ? 'Search ChEMBL target or drug molecule (e.g. ESR2, Raloxifene, Celecoxib)...'
                    : 'Search GWAS Catalog by disease or gene (e.g. endometriosis, ESR1, WNT4)...'
                }
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:bg-white text-slate-900"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-slate-900 hover:bg-teal-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Search {resourceTabs.find(t => t.id === activeTab)?.name}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 pt-1">
            <span className="font-semibold text-slate-400 text-[11px] mr-1">Suggested Starting Datasets:</span>
            {activeTab === 'geo' && (
              <>
                <button
                  type="button"
                  onClick={() => handlePresetClick('GSE213216')}
                  className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-300 font-bold hover:bg-teal-100 transition-colors flex items-center gap-1 text-[11px]"
                >
                  <Sparkles className="w-3 h-3 text-teal-600" />
                  ★ GSE213216 (Single-cell Atlas)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetClick('endometriosis peritoneal')}
                  className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 text-[11px]"
                >
                  Peritoneal Endometriosis
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetClick('ovarian endometrioma')}
                  className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 text-[11px]"
                >
                  Ovarian Endometrioma
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetClick('endometriosis stromal')}
                  className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 text-[11px]"
                >
                  Endometrial Stromal Cells
                </button>
              </>
            )}

            {(activeTab === 'gene' || activeTab === 'uniprot' || activeTab === 'string' || activeTab === 'chembl') && (
              <>
                {['ESR2', 'PTGS2', 'VEGFA', 'MMP9', 'CYP19A1', 'HDAC6', 'IL6'].map(gene => (
                  <button
                    key={gene}
                    type="button"
                    onClick={() => handlePresetClick(gene)}
                    className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-800 text-[11px] font-mono-code font-semibold"
                  >
                    {gene}
                  </button>
                ))}
              </>
            )}

            {activeTab === 'gwas' && (
              <>
                <button
                  type="button"
                  onClick={() => handlePresetClick('endometriosis')}
                  className="px-2.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-bold hover:bg-teal-100"
                >
                  ★ Endometriosis Risk Loci (Global)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetClick('deep infiltrating endometriosis')}
                  className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 text-[11px]"
                >
                  Deep Infiltrating Subtype
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ERROR BANNER */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-800">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Error Querying Public Database</p>
            <p>{error}</p>
            <p className="text-[11px] text-rose-600">
              Note: Public bioinformatics servers (NCBI, EBI) occasionally rate-limit or experience heavy traffic.
            </p>
          </div>
        </div>
      )}

      {/* LOADING SPINNER */}
      {loading && (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-600">
            Querying public {resourceTabs.find(t => t.id === activeTab)?.name} REST API in real time...
          </p>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. NCBI GEO VIEW */}
      {/* ======================================================== */}
      {!loading && activeTab === 'geo' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Showing {geoResults.length} gene expression datasets from NCBI GEO:</span>
            <span>Query: <strong className="text-slate-800">{searchInput}</strong></span>
          </div>

          <div className="space-y-3">
            {geoResults.map((dataset, idx) => (
              <div
                key={dataset.accession || idx}
                className={`p-5 bg-white rounded-xl border transition-all ${
                  dataset.isFeatured
                    ? 'border-teal-400 bg-gradient-to-r from-teal-50/50 to-white shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono-code font-black text-sm text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {dataset.accession}
                    </span>
                    {dataset.isFeatured && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        Core Endometriosis Benchmark Single-Cell Atlas
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                      {dataset.taxon}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                      {dataset.sampleCount} Samples
                    </span>
                  </div>

                  <a
                    href={dataset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors"
                  >
                    <span>View Record on NCBI GEO</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <h3 className="font-heading font-bold text-sm text-slate-900 mb-2">
                  {dataset.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {dataset.summary}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <span>Type: <strong className="text-slate-700">{dataset.gdsType}</strong></span>
                  <span>Platform: <strong className="text-slate-700">{dataset.platform}</strong></span>
                  <span>Published: <strong className="text-slate-700">{dataset.publishDate}</strong></span>
                </div>
              </div>
            ))}

            {geoResults.length === 0 && (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
                No NCBI GEO expression datasets found matching your search. Try searching for <strong>GSE213216</strong> or <strong>endometriosis</strong>.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ENDOMETDB COHORT EXPLORER VIEW */}
      {/* ======================================================== */}
      {activeTab === 'endometdb' && (
        <div className="space-y-6">
          {/* Overview Hero Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white border border-slate-700 shadow-md">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Specialized Endometriosis Microarray & Clinical Database
                </div>
                <h2 className="text-xl font-heading font-black text-white">
                  {ENDOMETDB_METADATA.name}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {ENDOMETDB_METADATA.summary}
                </p>
                <p className="text-[11px] text-teal-300">
                  Reference: <strong>{ENDOMETDB_METADATA.citation}</strong> ({ENDOMETDB_METADATA.institution})
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href={ENDOMETDB_METADATA.portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg text-xs font-bold transition-all shadow flex items-center gap-1.5"
                >
                  <span>Launch Live EndometDB Tool</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href={ENDOMETDB_METADATA.paperUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-600 transition-colors flex items-center gap-1.5"
                >
                  <span>Read Scientific Data Paper</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Metric counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-800">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Patient Cohort</span>
                <p className="text-lg font-heading font-black text-teal-400 mt-0.5">
                  {ENDOMETDB_METADATA.cohortMetrics.totalPatients} Patients
                </p>
                <p className="text-[10px] text-slate-400">Surgically confirmed endometriosis</p>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Healthy Controls</span>
                <p className="text-lg font-heading font-black text-cyan-400 mt-0.5">
                  {ENDOMETDB_METADATA.cohortMetrics.totalControls} Controls
                </p>
                <p className="text-[10px] text-slate-400">Laparoscopically symptom-free</p>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Transcriptome Coverage</span>
                <p className="text-lg font-heading font-black text-emerald-400 mt-0.5">
                  {ENDOMETDB_METADATA.cohortMetrics.genesProfiled}
                </p>
                <p className="text-[10px] text-slate-400">{ENDOMETDB_METADATA.cohortMetrics.chipPlatform}</p>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Clinical Parameters</span>
                <p className="text-lg font-heading font-black text-purple-400 mt-0.5">
                  6 Core Variables
                </p>
                <p className="text-[10px] text-slate-400">VAS pain, rASRM stage, hormones</p>
              </div>
            </div>
          </div>

          {/* Tissue Subtypes Breakdown */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
            <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600" />
              Tissue Compartments & Lesion Subtypes in EndometDB
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ENDOMETDB_METADATA.cohortMetrics.tissueSubtypes.map(sub => (
                <div key={sub.code} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono-code font-bold text-xs text-teal-700">{sub.code}</span>
                    <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-semibold">
                      Biopsy Cohort
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 leading-snug">{sub.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">{sub.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Curated Differentially Expressed Genes Table */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Dna className="w-4 h-4 text-teal-600" />
                  Key Differentially Expressed Genes in EndometDB
                </h3>
                <p className="text-xs text-slate-500">
                  Curated signature genes with published log2 fold-changes across lesion biopsies vs matched eutopic endometrium.
                </p>
              </div>

              {/* Filter controls */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter genes..."
                  value={endometSearch}
                  onChange={(e) => setEndometSearch(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-slate-800"
                />
                <select
                  value={selectedTissueFilter}
                  onChange={(e) => setSelectedTissueFilter(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-slate-800 font-medium"
                >
                  <option value="ALL">All Tissue Profiles</option>
                  <option value="DIE">High in Deep Infiltrating (DIE)</option>
                  <option value="OMA">High in Ovarian Endometrioma (OMA)</option>
                  <option value="PER">High in Peritoneal (PER)</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                    <th className="py-2.5 px-3">Gene Symbol</th>
                    <th className="py-2.5 px-3">Gene Name</th>
                    <th className="py-2.5 px-3">Log2 Fold Change</th>
                    <th className="py-2.5 px-3">P-Value</th>
                    <th className="py-2.5 px-3">Lesion Profile (EUT / PER / OMA / DIE)</th>
                    <th className="py-2.5 px-3">Clinical Correlation</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEndometGenes.map(gene => (
                    <tr key={gene.geneSymbol} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono-code font-bold text-teal-800">
                        {gene.geneSymbol}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900">
                        {gene.geneName}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono-code font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          +{gene.log2FoldChange}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono-code text-slate-500">
                        {gene.pValue}
                      </td>
                      <td className="py-3 px-3 text-[11px]">
                        <span className="font-mono-code font-medium text-slate-600">
                          {gene.tissueProfile.EUT} → {gene.tissueProfile.PER} / {gene.tissueProfile.OMA} / <strong className="text-teal-700">{gene.tissueProfile.DIE}</strong>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 text-[11px] max-w-xs">
                        {gene.clinicalCorrelation}
                      </td>
                      <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => openTargetDetails(gene.geneSymbol)}
                          className="px-2 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 rounded font-semibold text-[11px] transition-colors"
                        >
                          Target Dossier
                        </button>
                        <a
                          href={`${ENDOMETDB_METADATA.portalUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded font-semibold text-[11px] transition-colors inline-flex items-center gap-1"
                        >
                          <span>EndometDB</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. NCBI GENE VIEW */}
      {/* ======================================================== */}
      {!loading && activeTab === 'gene' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Found {geneResults.length} human genes matching query:</span>
            <span>Database: <strong className="text-slate-800">NCBI Gene (Entrez)</strong></span>
          </div>

          <div className="space-y-3">
            {geneResults.map((gene) => (
              <div
                key={gene.geneId}
                className="p-5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-sm space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono-code font-black text-base text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                      {gene.symbol}
                    </span>
                    <span className="text-xs text-slate-500 font-mono-code bg-slate-100 px-2 py-0.5 rounded">
                      Gene ID: {gene.geneId}
                    </span>
                    <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium">
                      Chr {gene.chromosome} ({gene.mapLocation})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openTargetDetails(gene.symbol)}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                    >
                      Open Target Dossier
                    </button>
                    <a
                      href={gene.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-lg border border-teal-200 transition-colors"
                    >
                      <span>NCBI Gene Record</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <h4 className="font-bold text-xs text-slate-900">
                  {gene.description}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {gene.summary}
                </p>

                {gene.aliases && (
                  <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    Aliases / Other Designations: <span className="font-mono-code text-slate-600">{gene.aliases}</span>
                  </div>
                )}
              </div>
            ))}

            {geneResults.length === 0 && (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
                No genes found matching "{searchInput}". Enter a gene symbol (e.g. <strong>ESR2, PTGS2, VEGFA</strong>).
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. UNIPROT VIEW */}
      {/* ======================================================== */}
      {!loading && activeTab === 'uniprot' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Showing {uniprotResults.length} protein entries from UniProtKB (Homo sapiens):</span>
            <span>Query: <strong className="text-slate-800">{searchInput}</strong></span>
          </div>

          <div className="space-y-3">
            {uniprotResults.map((entry) => (
              <div
                key={entry.accession}
                className="p-5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono-code font-black text-sm text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                      {entry.accession}
                    </span>
                    <span className="font-mono-code text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-bold">
                      {entry.entryName}
                    </span>
                    <span className="text-xs text-teal-700 font-mono-code font-semibold">
                      Gene: {entry.geneSymbol}
                    </span>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Length: {entry.length} aa
                    </span>
                  </div>

                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors"
                  >
                    <span>View on UniProtKB</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-900">
                    {entry.proteinName}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {entry.function}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <span>Subcellular Location: <strong className="text-slate-700">{entry.subcellularLocation}</strong></span>
                  <span>Organism: <strong className="text-slate-700">{entry.organism}</strong></span>
                </div>
              </div>
            ))}

            {uniprotResults.length === 0 && (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
                No protein entries found on UniProt. Try searching for <strong>ESR2, VEGFA, or Q92731</strong>.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. STRING INTERACTOME VIEW */}
      {/* ======================================================== */}
      {!loading && activeTab === 'string' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                <Network className="w-4 h-4 text-teal-600" />
                STRING Protein-Protein Interaction (PPI) Network for {stringGene}
              </h3>
              <p className="text-xs text-slate-500">
                Top interaction partners mapped from verified experimental assays, curated pathways, and co-expression studies.
              </p>
            </div>

            <a
              href={`https://string-db.org/network/${stringGene}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-teal-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm shrink-0"
            >
              <span>Explore Interactive Graph on STRING</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* STRING SVG Graph Preview */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              STRING High-Confidence Network Graph (Homo sapiens)
            </span>
            <div className="p-4 bg-slate-50 rounded-lg flex items-center justify-center min-h-[220px] overflow-hidden">
              <img
                src={getStringEmbedUrl(stringGene)}
                alt={`STRING PPI network for ${stringGene}`}
                className="max-h-72 object-contain rounded"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Edges indicate combined functional associations. Node connectivity generated dynamically by STRING DB.
            </p>
          </div>

          {/* Interactions Table */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-700">
              Top Ranked Interaction Partners ({stringResults.length} Interactors)
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                    <th className="py-2 px-3">Interacting Protein</th>
                    <th className="py-2 px-3">Combined Score</th>
                    <th className="py-2 px-3">Experimental Score</th>
                    <th className="py-2 px-3">Database Score</th>
                    <th className="py-2 px-3">Co-Expression Score</th>
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stringResults.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono-code font-bold text-teal-800">
                        {item.partnerGene}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono-code font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {item.combinedScore}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono-code text-slate-600">
                        {item.experimentalScore}%
                      </td>
                      <td className="py-2.5 px-3 font-mono-code text-slate-600">
                        {item.databaseScore}%
                      </td>
                      <td className="py-2.5 px-3 font-mono-code text-slate-600">
                        {item.coexpressionScore}%
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-1">
                        <button
                          onClick={() => handlePresetClick(item.partnerGene)}
                          className="px-2 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 rounded text-[11px] font-semibold"
                        >
                          Pivot STRING
                        </button>
                        <a
                          href={item.networkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded text-[11px] font-semibold inline-flex items-center gap-0.5"
                        >
                          STRING <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {stringResults.length === 0 && (
              <div className="p-8 text-center bg-white text-slate-500 text-xs">
                No STRING interactors found for "{stringGene}". Please try a standard symbol (e.g. <strong>ESR2, VEGFA</strong>).
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. ChEMBL VIEW */}
      {/* ======================================================== */}
      {!loading && activeTab === 'chembl' && (
        <div className="space-y-6">
          {/* Targets Section */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
            <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-teal-600" />
              ChEMBL Targets ({chemblResults.targets.length} Results)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {chemblResults.targets.map(target => (
                <div key={target.targetChemblId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-code font-bold text-xs text-teal-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {target.targetChemblId}
                    </span>
                    <a
                      href={target.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-teal-700 hover:underline inline-flex items-center gap-0.5"
                    >
                      Target Report <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900">{target.prefName}</h4>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>Type: <strong className="text-slate-700">{target.targetType}</strong></span>
                    <span>Organism: <strong className="text-slate-700">{target.organism}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            {chemblResults.targets.length === 0 && (
              <p className="text-xs text-slate-500 py-3">No direct ChEMBL targets found matching query.</p>
            )}
          </div>

          {/* Molecules Section */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
            <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              ChEMBL Drug Compounds & Bioactive Molecules ({chemblResults.molecules.length} Results)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {chemblResults.molecules.map(mol => (
                <div key={mol.moleculeChemblId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-code font-bold text-xs text-cyan-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {mol.moleculeChemblId}
                    </span>
                    <a
                      href={mol.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-teal-700 hover:underline inline-flex items-center gap-0.5"
                    >
                      Compound Report <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900">{mol.prefName}</h4>

                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                      {mol.maxPhase}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {mol.moleculeType}
                    </span>
                    {mol.firstApproval !== 'N/A' && (
                      <span className="text-slate-500">
                        Approved: {mol.firstApproval}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {chemblResults.molecules.length === 0 && (
              <p className="text-xs text-slate-500 py-3">No small molecules matching query.</p>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. GWAS CATALOG VIEW */}
      {/* ======================================================== */}
      {!loading && activeTab === 'gwas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Showing {gwasResults.length} genetic association studies from NHGRI-EBI GWAS Catalog:</span>
            <span>Trait / Query: <strong className="text-slate-800">{searchInput}</strong></span>
          </div>

          <div className="space-y-3">
            {gwasResults.map((study) => (
              <div
                key={study.accessionId}
                className="p-5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-sm space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono-code font-bold text-xs text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {study.accessionId}
                    </span>
                    <span className="text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-full">
                      Trait: {study.diseaseTrait}
                    </span>
                  </div>

                  <a
                    href={study.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors"
                  >
                    <span>View on GWAS Catalog</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <h4 className="font-heading font-bold text-xs text-slate-900 leading-snug">
                  {study.title}
                </h4>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                  <span>Author: <strong className="text-slate-800">{study.author}</strong></span>
                  <span>Journal: <strong className="text-slate-800">{study.journal}</strong></span>
                  <span>Cohort Size: <strong className="text-slate-800">{study.initialSampleSize}</strong></span>
                </div>
              </div>
            ))}

            {gwasResults.length === 0 && (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
                No GWAS studies found. Try searching for <strong>endometriosis</strong> or an associated gene symbol.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
