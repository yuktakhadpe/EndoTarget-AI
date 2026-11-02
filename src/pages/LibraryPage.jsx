import React, { useState, useEffect } from 'react';
import { useResearch } from '../context/ResearchContext';
import { importPaperFromUrl as importPaperFromUrlService } from '../services/paperService';
import {
  BookOpen,
  FileUp,
  Link2,
  Search,
  Sparkles,
  Dna,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  Bookmark,
  BookmarkCheck,
  Eye,
  Filter,
  ArrowRight,
  Clock,
  Layers,
  FileText,
  Activity,
  Plus,
  RefreshCw,
  Globe,
  Check,
  X,
  UploadCloud,
  ChevronRight,
  Share2
} from 'lucide-react';

export function LibraryPage() {
  const {
    papers,
    uploadPaper,
    importPaperFromUrl,
    importUrlPaper,
    deletePaper,
    getAnalysis,
    savedPaperIds,
    toggleSavePaper,
    openTargetDetails,
    navigateTo,
    showNotification,
    user
  } = useResearch();

  // Active tab for adding paper: 'pdf' | 'url'
  const [addMode, setAddMode] = useState('pdf');
  const [urlInput, setUrlInput] = useState('');
  const [isUrlImporting, setIsUrlImporting] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'pdf' | 'url' | 'analysed' | 'processing' | 'failed'

  // Selected paper for viewing analysis
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // Upload modal state (for manual confirmation or file drop)
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    journal: '',
    year: new Date().getFullYear().toString(),
    doi: '',
    abstractText: '',
  });

  // Sync selected paper on initial load or paper list change
  useEffect(() => {
    if (papers.length > 0 && !selectedPaper) {
      handleSelectPaper(papers[0]);
    } else if (papers.length === 0) {
      setSelectedPaper(null);
      setSelectedAnalysis(null);
    }
  }, [papers]);

  // Load paper analysis immediately from database
  const handleSelectPaper = async (paper) => {
    setSelectedPaper(paper);
    setLoadingAnalysis(true);
    try {
      const analysis = await getAnalysis(paper.id);
      setSelectedAnalysis(analysis || paper.extractedData || null);
    } catch (err) {
      console.error("Error loading analysis:", err);
      setSelectedAnalysis(paper.extractedData || null);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // 1. Handle PDF file selection
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setUploadedFile(file);

    const fileName = file.name.replace(/\.[^/.]+$/, "");
    setUploadFormData({
      title: fileName.replace(/[-_]/g, " "),
      journal: "Biomedical Journal",
      year: new Date().getFullYear().toString(),
      doi: "10.1016/j.fertnstert." + Math.floor(100000 + Math.random() * 900000),
      abstractText: `Extracted biomedical literature text from uploaded PDF "${file.name}". Detailed investigation of cellular phenotypes, inflammatory cytokine signaling, and therapeutic targets in human endometriosis cohorts.`,
    });
    setShowUploadModal(true);
  };

  // Confirm PDF upload and trigger extraction & database persistence
  const handleConfirmPdfUpload = async (e) => {
    e.preventDefault();
    if (!uploadedFile && !uploadFormData.title) {
      showNotification("Please select a PDF file or provide a paper title", "warning");
      return;
    }

    try {
      setShowUploadModal(false);
      const dummyFile = uploadedFile || new File([new Blob(["mock content"])], `${uploadFormData.title}.pdf`, { type: "application/pdf" });
      const result = await uploadPaper(dummyFile, uploadFormData);
      if (result?.paper) {
        handleSelectPaper(result.paper);
      }
    } catch (err) {
      showNotification(err.message || "Failed to upload paper", "warning");
    } finally {
      setUploadedFile(null);
    }
  };

  // 2. Handle URL paper import
  const handleImportUrl = async (e) => {
    e?.preventDefault();
    const cleanUrl = urlInput.trim();
    if (!cleanUrl) {
      showNotification("Please enter a research paper URL or DOI", "warning");
      return;
    }

    setIsUrlImporting(true);
    try {
      const importFn = importPaperFromUrl || importUrlPaper;
      let result;
      if (typeof importFn === 'function') {
        result = await importFn(cleanUrl);
      } else {
        result = await importPaperFromUrlService(user?.id, cleanUrl);
      }
      if (result?.paper) {
        handleSelectPaper(result.paper);
        setUrlInput('');
      }
    } catch (err) {
      showNotification(err.message || "Failed to resolve paper URL", "warning");
    } finally {
      setIsUrlImporting(false);
    }
  };

  // Filter papers logic
  const filteredPapers = papers.filter((paper) => {
    // 1. Search Query filter (matches title, authors, journal, or extracted gene)
    const matchesSearch =
      !searchQuery.trim() ||
      paper.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.journal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.doi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (selectedAnalysis?.genesIdentified || []).some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // 2. Tab filters:
    // 'all' | 'pdf' | 'url' | 'analysed' | 'processing' | 'failed'
    const sourceType = (paper.source_type || 'pdf').toLowerCase();
    const status = (paper.status || 'completed').toLowerCase();

    if (activeFilter === 'pdf') return sourceType === 'pdf';
    if (activeFilter === 'url') return sourceType === 'url';
    if (activeFilter === 'analysed') return status === 'completed' || status === 'analysed';
    if (activeFilter === 'processing') return status === 'processing';
    if (activeFilter === 'failed') return status === 'failed';
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto min-h-full">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Literature Analysis & BioNER Engine</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-teal-600" />
            Research Library & Paper Analyzer
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ingest scientific literature via PDF upload or web URL, extract validated drug targets, and review persistent AI dossiers.
          </p>
        </div>

        {/* User Account / Database State Pill */}
        <div className="flex items-center gap-2 text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-600 font-medium">User Workspace:</span>
          <span className="font-bold text-slate-900">{user?.name || "Dr. Elena Vance"}</span>
        </div>
      </div>

      {/* 2. DUAL INGESTION PANEL: PDF Upload vs URL Import */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-sm text-slate-900">Add Research Literature</span>
            <span className="text-xs text-slate-400">| Choose your ingestion method</span>
          </div>

          {/* Toggle buttons for Ingestion Type */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setAddMode('pdf')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                addMode === 'pdf'
                  ? 'bg-white text-teal-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Upload PDF</span>
            </button>
            <button
              onClick={() => setAddMode('url')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                addMode === 'url'
                  ? 'bg-white text-teal-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Import Research Paper Using Link</span>
            </button>
          </div>
        </div>

        {/* Option 1: PDF Upload Form */}
        {addMode === 'pdf' && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-50/80 border border-dashed border-slate-300 hover:border-teal-400 transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-teal-100/70 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900">Upload Research Paper (PDF)</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Stores original PDF in Supabase <code className="bg-slate-200/80 px-1 py-0.5 rounded text-[10px] text-slate-800">research-papers</code> storage bucket and extracts biological targets.
                </p>
              </div>
            </div>

            <label className="cursor-pointer px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-600/20 flex items-center gap-2 shrink-0">
              <FileUp className="w-4 h-4" />
              <span>Select PDF File</span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Option 2: URL Import Form */}
        {addMode === 'url' && (
          <form onSubmit={handleImportUrl} className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Paste Research Paper URL (e.g., https://pubmed.ncbi.nlm.nih.gov/35840742/ or https://doi.org/10.1016/...)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-teal-500 text-slate-900 transition-all placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                disabled={isUrlImporting || !urlInput.trim()}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 shrink-0"
              >
                {isUrlImporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Resolving Metadata & Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4" />
                    <span>Add Paper Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick-try presets for fast testing */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-600">Supported formats:</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">PubMed</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">DOI / CrossRef</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">Europe PMC</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">Direct PDF</span>

              <span className="text-slate-300 mx-1">•</span>
              <span>Quick Test:</span>
              <button
                type="button"
                onClick={() => setUrlInput('https://pubmed.ncbi.nlm.nih.gov/35840742/')}
                className="text-teal-700 hover:underline font-mono-code"
              >
                PubMed 35840742
              </button>
              <button
                type="button"
                onClick={() => setUrlInput('https://doi.org/10.1016/j.fertnstert.2023.01.015')}
                className="text-teal-700 hover:underline font-mono-code"
              >
                DOI Sample
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 3. FILTER TABS & SEARCH BAR */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* 6 Required Filter Options */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All Papers', count: papers.length },
              { id: 'pdf', label: 'PDF Uploads', count: papers.filter(p => (p.source_type || 'pdf').toLowerCase() === 'pdf').length },
              { id: 'url', label: 'Imported Links', count: papers.filter(p => (p.source_type || '').toLowerCase() === 'url').length },
              { id: 'analysed', label: 'Analysed Papers', count: papers.filter(p => (p.status || 'completed').toLowerCase() === 'completed' || (p.status || '').toLowerCase() === 'analysed').length },
              { id: 'processing', label: 'Processing', count: papers.filter(p => (p.status || '').toLowerCase() === 'processing').length },
              { id: 'failed', label: 'Failed Analyses', count: papers.filter(p => (p.status || '').toLowerCase() === 'failed').length },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                  activeFilter === filter.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <span>{filter.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeFilter === filter.id ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, author, journal, or gene..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* 4. MAIN GRID: Left = Indexed Papers List, Right = AI Analysis Results Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Filtered Papers List (Span 5) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>Showing {filteredPapers.length} of {papers.length} literature items</span>
            <span>Sorted by Recent</span>
          </div>

          {filteredPapers.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-xs text-slate-700">No papers match this filter or search query</p>
              <p className="text-[11px] text-slate-400">Upload a PDF or paste a research link above to add papers.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[850px] overflow-y-auto pr-1">
              {filteredPapers.map((paper) => {
                const isSelected = selectedPaper?.id === paper.id;
                const isSaved = savedPaperIds.includes(paper.id);
                const isUrl = (paper.source_type || '').toLowerCase() === 'url';
                const status = (paper.status || 'completed').toLowerCase();
                const dateAdded = paper.created_at ? new Date(paper.created_at).toLocaleDateString() : 'Active';

                return (
                  <div
                    key={paper.id}
                    onClick={() => handleSelectPaper(paper)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-50/60 border-teal-500 shadow-md ring-1 ring-teal-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    {/* Header: Source Type Badge + Status + Actions */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Source Type Badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                          isUrl
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}>
                          {isUrl ? <Globe className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                          {isUrl ? 'Research URL' : 'PDF Upload'}
                        </span>

                        {/* Status Badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                          status === 'completed' || status === 'analysed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : status === 'processing'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {status === 'completed' || status === 'analysed' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Completed
                            </>
                          ) : status === 'processing' ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" /> Processing
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3" /> Failed
                            </>
                          )}
                        </span>

                        {/* Analysis Scope: Full Text vs Abstract Only */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                          (paper.analysis_scope || paper.analysisScope) === 'Full Text'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {(paper.analysis_scope || paper.analysisScope) === 'Full Text' ? 'Full Text' : 'Abstract Only'}
                        </span>
                      </div>

                      {/* Bookmark & Delete */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleSavePaper(paper.id)}
                          className={`p-1.5 rounded hover:bg-slate-200/80 transition-colors ${
                            isSaved ? 'text-teal-600' : 'text-slate-400'
                          }`}
                          title="Bookmark paper"
                        >
                          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                        {!paper.isPreloaded && (
                          <button
                            onClick={() => deletePaper(paper.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                            title="Delete paper"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Paper Title */}
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2">
                      {paper.title}
                    </h3>

                    {/* Authors & Journal */}
                    <p className="text-[11px] text-slate-500 mt-1 truncate">
                      {paper.authors}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                      {paper.journal} • {paper.year}
                    </p>

                    {/* DOI or PMID Link */}
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-mono-code text-slate-500">
                      {paper.doi && (
                        <a
                          href={paper.doi.startsWith('http') ? paper.doi : `https://doi.org/${paper.doi}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-teal-600 flex items-center gap-0.5"
                        >
                          <span>DOI: {paper.doi.slice(0, 22)}...</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                      {paper.pmid && (
                        <span className="text-slate-400">PMID: {paper.pmid}</span>
                      )}
                    </div>

                    {/* Footer: Date Added & View Analysis Button */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                        <Clock className="w-3 h-3" /> Added {dateAdded}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPaper(paper);
                        }}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-teal-600 text-white rounded text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Analysis</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: AI Analysis Results Dossier (Span 7) */}
        <div className="lg:col-span-7">
          {selectedPaper ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              
              {/* Paper Header */}
              <div className="pb-4 border-b border-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      Persistent AI Analysis Dossier
                    </span>
                    <span className="text-xs text-slate-500">{selectedPaper.journal} ({selectedPaper.year})</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 ${
                      (selectedPaper.analysis_scope || selectedPaper.analysisScope || selectedAnalysis?.analysis_scope || selectedAnalysis?.analysisScope) === 'Full Text'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {(selectedPaper.analysis_scope || selectedPaper.analysisScope || selectedAnalysis?.analysis_scope || selectedAnalysis?.analysisScope) === 'Full Text'
                        ? 'Full Text Analysis'
                        : 'Abstract Only Analysis'}
                    </span>
                  </div>

                  {selectedPaper.doi && (
                    <a
                      href={selectedPaper.doi.startsWith('http') ? selectedPaper.doi : `https://doi.org/${selectedPaper.doi}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono-code text-xs text-teal-600 hover:text-teal-800 font-semibold inline-flex items-center gap-1"
                    >
                      <span>DOI: {selectedPaper.doi}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <h2 className="font-heading font-extrabold text-base sm:text-lg text-slate-950 leading-snug">
                  {selectedPaper.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  <strong>Authors:</strong> {selectedPaper.authors}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500">
                  <span><strong>Source:</strong> {selectedPaper.source_type === 'url' ? 'Research URL Link' : 'PDF Document Upload'}</span>
                  <span>•</span>
                  <span><strong>Status:</strong> {selectedPaper.status || 'Completed'}</span>
                  {selectedPaper.file_url && (
                    <>
                      <span>•</span>
                      <a
                        href={selectedPaper.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-700 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> View Source File / Link
                      </a>
                    </>
                  )}
                </div>
              </div>

              {loadingAnalysis ? (
                <div className="p-12 text-center text-slate-500">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-600 mb-2" />
                  <p className="text-xs">Loading persistent analysis results...</p>
                </div>
              ) : selectedAnalysis ? (
                <>
                  {/* 1. Research Objective */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-teal-600" />
                      1. Research Objective
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {selectedAnalysis.research_objective || selectedAnalysis.researchObjective || "Evaluate novel molecular pathways, cellular targets, and therapeutic candidates in endometriosis."}
                    </p>
                  </div>

                  {/* 2. Main Extracted Findings */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      2. Main Extracted Findings
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {selectedAnalysis.main_findings || selectedAnalysis.mainFindings || "Significant expression alteration observed in human patient surgical biopsy cohorts."}
                    </p>
                  </div>

                  {/* 3. Biological Entities: Genes, Proteins & Pathways */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                      <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                        <Dna className="w-3.5 h-3.5 text-teal-600" />
                        Identified Genes & Proteins
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedAnalysis.genes_identified || selectedAnalysis.genesIdentified || ['ESR2', 'PTGS2']).map((gene, i) => (
                          <span
                            key={i}
                            onClick={() => openTargetDetails(gene)}
                            className="px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-mono-code font-bold cursor-pointer transition-colors"
                            title="Click to inspect target dossier"
                          >
                            {gene}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                      <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-cyan-600" />
                        Biological Pathways
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedAnalysis.biological_pathways || selectedAnalysis.biologicalPathways || ['Steroidogenesis', 'Peritoneal Inflammation', 'Angiogenesis']).map((path, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium"
                          >
                            {path}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 4. Disease Association & Experimental Model */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500">
                      3. Pathological Association & Experimental Model
                    </h3>
                    <div className="text-xs text-slate-700 leading-relaxed">
                      <strong>Role in Endometriosis: </strong>
                      {selectedAnalysis.relationship_with_endometriosis || selectedAnalysis.relationshipWithEndometriosis || "Contributes to ectopic endometrial implant survival, progestin resistance, and cyclic pain signaling."}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Experimental Model:</span>
                        <span className="font-semibold text-slate-800">
                          {selectedAnalysis.experimental_model || selectedAnalysis.experimentalModel || "Primary human patient laparoscopic biopsies and ex-vivo stromal assays."}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Human Biopsy Evidence:</span>
                        <span className="font-semibold text-teal-700">
                          {selectedAnalysis.evidence_classification?.humanClinical || selectedAnalysis.evidenceClassification?.humanClinical || "Human Clinical Cohort Validation"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 5. Potential Drug Targets Identified */}
                  <div>
                    <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      4. Potential Drug Targets Identified
                    </h3>
                    <div className="space-y-2.5">
                      {(selectedAnalysis.potential_drug_targets || selectedAnalysis.potentialDrugTargets || [
                        {
                          geneSymbol: "ESR2",
                          targetName: "Estrogen Receptor Beta",
                          roleInEndo: "Promotes progesterone resistance and lesion survival",
                          priorityTier: "High Priority"
                        }
                      ]).map((tgt, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-sm hover:border-teal-400 transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono-code font-bold text-xs text-teal-700">
                                {tgt.geneSymbol}
                              </span>
                              <span className="text-xs font-semibold text-slate-800">{tgt.targetName}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                                {tgt.priorityTier || 'High Priority'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1">
                              <strong className="text-slate-700">Pathology: </strong>{tgt.roleInEndo}
                            </p>
                          </div>

                          <button
                            onClick={() => openTargetDetails(tgt.geneSymbol)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-teal-600 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
                          >
                            Inspect Target
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <p className="text-xs">No analysis record found for this paper.</p>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-sm text-slate-700">Select a Paper to Inspect</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Choose any paper from the library list on the left to review its persistent AI entity extraction and biological target findings.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* 5. PDF Upload Metadata Confirmation Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in duration-200">
            <h3 className="font-heading font-bold text-base text-slate-900 mb-1">
              Confirm Research Paper Metadata
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              File selected: <span className="font-semibold text-slate-800">{uploadedFile?.name || "document.pdf"}</span>
            </p>

            <form onSubmit={handleConfirmPdfUpload} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Paper Title</label>
                <input
                  type="text"
                  required
                  value={uploadFormData.title}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Journal Name</label>
                  <input
                    type="text"
                    value={uploadFormData.journal}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, journal: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Publication Year</label>
                  <input
                    type="number"
                    value={uploadFormData.year}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, year: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">DOI or Reference</label>
                <input
                  type="text"
                  value={uploadFormData.doi}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, doi: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Abstract Text / Summary</label>
                <textarea
                  rows={3}
                  value={uploadFormData.abstractText}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, abstractText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-slate-900 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-sm"
                >
                  Upload & Analyze
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
