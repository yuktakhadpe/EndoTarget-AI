import React, { useState } from 'react';
import { useResearch } from '../context/ResearchContext';
import { EvidenceBadge, CategoryBadge } from '../components/EvidenceBadge';
import { PriorityScoreBar } from '../components/PriorityScoreBar';
import { BIOLOGICAL_CATEGORIES, TARGET_CLASSES } from '../data/targetsData';
import {
  Search,
  Filter,
  Dna,
  ArrowRight,
  Sliders,
  Scale,
  Bookmark,
  BookmarkCheck,
  Download,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  Grid,
  List
} from 'lucide-react';

export function TargetDiscoveryPage() {
  const {
    targets,
    openTargetDetails,
    savedTargetIds,
    toggleSaveTarget,
    comparisonTargetIds,
    toggleCompareTarget,
    setIsComparisonOpen,
    navigateTo,
    showNotification,
  } = useResearch();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedEvidence, setSelectedEvidence] = useState('All Evidence');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [selectedForBatch, setSelectedForBatch] = useState([]);

  // Filter logic
  const filteredTargets = targets.filter(target => {
    const matchesSearch =
      target.geneSymbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      target.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      target.associatedProcess.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All Categories' || target.biologicalCategory === selectedCategory;

    const matchesClass =
      selectedClass === 'All Classes' || target.targetClass === selectedClass;

    const matchesEvidence =
      selectedEvidence === 'All Evidence' ||
      target.evidenceType.toLowerCase().includes(selectedEvidence.toLowerCase());

    return matchesSearch && matchesCategory && matchesClass && matchesEvidence;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedForBatch(filteredTargets.map(t => t.id));
    } else {
      setSelectedForBatch([]);
    }
  };

  const handleToggleBatch = (id) => {
    setSelectedForBatch(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleExportCSV = () => {
    const headers = ["Rank", "Gene Symbol", "Target Name", "Category", "Class", "Priority Score", "Evidence Type", "Papers", "Druggability"];
    const rows = filteredTargets.map(t => [
      t.rank,
      t.geneSymbol,
      `"${t.targetName}"`,
      `"${t.biologicalCategory}"`,
      `"${t.targetClass}"`,
      t.calculatedScore,
      `"${t.evidenceType}"`,
      t.supportingPaperCount,
      `"${t.druggabilityStatus}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EndoTarget_AI_Discovery_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification("Exported filtered targets to CSV successfully", "success");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto min-h-full">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="font-heading font-black text-2xl text-slate-900 flex items-center gap-2.5">
            <Search className="w-6 h-6 text-teal-600" />
            Target Discovery & Profiling
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Systematically identify and evaluate candidate genes, receptors, and enzymes associated with endometriosis pathology.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => navigateTo('ranking')}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Open Target Ranking</span>
          </button>
        </div>
      </div>

      {/* Biological Category Filter Pills */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Biological Processes & Pathological Hallmarks
        </div>
        <div className="flex flex-wrap gap-1.5">
          {BIOLOGICAL_CATEGORIES.map(category => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm font-semibold'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search gene, protein, or mechanism..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-slate-900"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Target Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-teal-500"
          >
            {TARGET_CLASSES.map(tc => (
              <option key={tc} value={tc}>{tc}</option>
            ))}
          </select>

          {/* Evidence Type Filter */}
          <select
            value={selectedEvidence}
            onChange={(e) => setSelectedEvidence(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-teal-500"
          >
            <option value="All Evidence">All Evidence Levels</option>
            <option value="Human Clinical">Human Clinical</option>
            <option value="Tissue">Human Tissue Ex-Vivo</option>
            <option value="Animal">Animal In-Vivo</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden ml-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 transition-colors ${viewMode === 'table' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:text-slate-800'}`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:text-slate-800'}`}
              title="Card grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Batch Action Bar if items selected */}
      {selectedForBatch.length > 0 && (
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between text-xs animate-in fade-in duration-200">
          <span className="font-semibold text-teal-900">
            {selectedForBatch.length} target(s) selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                selectedForBatch.forEach(id => toggleSaveTarget(id));
                setSelectedForBatch([]);
              }}
              className="px-3 py-1 bg-white hover:bg-slate-50 border border-teal-300 text-teal-800 rounded font-semibold"
            >
              Save All to Workspace
            </button>
            <button
              onClick={() => {
                if (selectedForBatch.length >= 2) {
                  // Set first 2-4 in comparison
                  selectedForBatch.slice(0, 4).forEach(id => {
                    if (!comparisonTargetIds.includes(id)) toggleCompareTarget(id);
                  });
                  setIsComparisonOpen(true);
                } else {
                  showNotification("Select at least 2 targets to compare", "warning");
                }
              }}
              className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded font-bold"
            >
              Compare Selected
            </button>
          </div>
        </div>
      )}

      {/* TARGETS DISPLAY: Table or Grid */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3 w-8">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedForBatch.length === filteredTargets.length && filteredTargets.length > 0}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                  </th>
                  <th className="py-3 px-3 w-12">Rank</th>
                  <th className="py-3 px-4">Target & Symbol</th>
                  <th className="py-3 px-4">Biological Category</th>
                  <th className="py-3 px-4">Associated Biological Process</th>
                  <th className="py-3 px-4">Evidence Level</th>
                  <th className="py-3 px-4 w-36">Priority Score</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTargets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      No targets match the current filter selection. Try resetting filters.
                    </td>
                  </tr>
                ) : (
                  filteredTargets.map((target) => {
                    const isSaved = savedTargetIds.includes(target.id);
                    const isChecked = selectedForBatch.includes(target.id);

                    return (
                      <tr key={target.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleBatch(target.id)}
                            className="rounded text-teal-600 focus:ring-teal-500"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold font-mono-code text-xs flex items-center justify-center">
                            #{target.rank}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div
                            onClick={() => openTargetDetails(target.id)}
                            className="font-mono-code font-bold text-slate-900 text-xs hover:text-teal-700 cursor-pointer flex items-center gap-1.5"
                          >
                            <span>{target.geneSymbol}</span>
                            <span className="text-[10px] text-slate-400 font-normal">({target.targetClass})</span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-xs">{target.targetName}</div>
                        </td>
                        <td className="py-3 px-4">
                          <CategoryBadge category={target.biologicalCategory} />
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={target.associatedProcess}>
                          {target.associatedProcess}
                        </td>
                        <td className="py-3 px-4">
                          <EvidenceBadge type={target.evidenceType} size="xs" />
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {target.supportingPaperCount} papers
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <PriorityScoreBar score={target.calculatedScore} size="sm" />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
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
                              className="px-2.5 py-1 bg-slate-900 hover:bg-teal-600 text-white rounded text-[11px] font-semibold transition-colors"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTargets.map((target) => {
            const isSaved = savedTargetIds.includes(target.id);
            return (
              <div
                key={target.id}
                className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-teal-400 shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono-code font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      Rank #{target.rank}
                    </span>
                    <button
                      onClick={() => toggleSaveTarget(target.id)}
                      className={`p-1 rounded ${isSaved ? 'text-teal-600' : 'text-slate-400 hover:text-slate-700'}`}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <h3
                      onClick={() => openTargetDetails(target.id)}
                      className="font-mono-code font-extrabold text-base text-slate-900 hover:text-teal-700 cursor-pointer"
                    >
                      {target.geneSymbol}
                    </h3>
                    <span className="text-xs text-slate-500 truncate">{target.targetName}</span>
                  </div>

                  <div className="my-2.5 flex flex-wrap gap-1.5">
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
                  <span className="text-[11px] text-slate-500 font-medium">
                    {target.supportingPaperCount} Papers Indexed
                  </span>
                  <button
                    onClick={() => openTargetDetails(target.id)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-teal-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
