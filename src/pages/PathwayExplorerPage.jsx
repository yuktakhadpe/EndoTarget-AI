import React, { useState } from 'react';
import { useResearch } from '../context/ResearchContext';
import { PATHWAY_CATEGORIES, PATHWAY_NODES, PATHWAY_EDGES } from '../data/pathwaysData';
import { EvidenceBadge, CategoryBadge } from '../components/EvidenceBadge';
import { PriorityScoreBar } from '../components/PriorityScoreBar';
import {
  Network,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Info,
  Dna,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Share2
} from 'lucide-react';

export function PathwayExplorerPage() {
  const { openTargetDetails, navigateTo } = useResearch();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNodeId, setSelectedNodeId] = useState('ESR2');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [nodeSearch, setNodeSearch] = useState('');

  // Selected node object
  const selectedNode = PATHWAY_NODES.find(n => n.id === selectedNodeId) || PATHWAY_NODES[0];

  // Filter nodes based on category & search
  const visibleNodes = PATHWAY_NODES.filter(node => {
    const matchesCat = selectedCategory === 'all' || node.pathwayId === selectedCategory;
    const matchesSearch =
      node.symbol.toLowerCase().includes(nodeSearch.toLowerCase()) ||
      node.name.toLowerCase().includes(nodeSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const visibleNodeIds = new Set(visibleNodes.map(n => n.id));

  // Filter edges where both from and to are visible
  const visibleEdges = PATHWAY_EDGES.filter(
    edge => visibleNodeIds.has(edge.from) && visibleNodeIds.has(edge.to)
  );

  const handleZoom = (delta) => {
    setZoomLevel(prev => Math.min(1.8, Math.max(0.6, Math.round((prev + delta) * 10) / 10)));
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto min-h-full">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold mb-1">
            <Network className="w-3.5 h-3.5 text-teal-600" />
            Signaling Cascade Topology
          </div>
          <h1 className="font-heading font-black text-2xl text-slate-900">
            Biological Pathway Explorer
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visually trace how candidate genes, receptors, and cytokines interact across key endometriosis disease cascades.
          </p>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
          <button
            onClick={() => handleZoom(-0.1)}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono-code font-bold text-slate-700 px-2">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => handleZoom(0.1)}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={resetZoom}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border-l border-slate-200 ml-1"
            title="Reset Zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pathway Categories Tabs */}
      <div className="flex flex-wrap gap-2">
        {PATHWAY_CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white font-bold shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Interactive Network Graph + Node Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* INTERACTIVE CANVAS (Span 8) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col relative min-h-[580px]">
          
          {/* Canvas Top Bar */}
          <div className="p-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="font-semibold text-white">Interactive Network Canvas</span>
              <span className="text-slate-500">• Click any node to inspect biological connections</span>
            </div>

            {/* Quick node search */}
            <div className="relative w-40">
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Find node..."
                value={nodeSearch}
                onChange={(e) => setNodeSearch(e.target.value)}
                className="w-full pl-7 pr-2 py-1 text-[11px] bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          {/* SVG Canvas Area */}
          <div className="flex-1 overflow-auto p-4 flex items-center justify-center relative select-none">
            <div
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
              className="transition-transform duration-200 relative w-[950px] h-[680px]"
            >
              <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 950 680">
                <defs>
                  {/* Arrowhead marker for activation */}
                  <marker
                    id="arrowhead-activates"
                    viewBox="0 0 10 10"
                    refX="20"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#14b8a6" />
                  </marker>
                  {/* Marker for inhibition */}
                  <marker
                    id="marker-inhibits"
                    viewBox="0 0 10 10"
                    refX="16"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <rect x="0" y="0" width="3" height="10" fill="#f43f5e" />
                  </marker>
                </defs>

                {/* Render Edges */}
                {visibleEdges.map((edge, idx) => {
                  const source = PATHWAY_NODES.find(n => n.id === edge.from);
                  const target = PATHWAY_NODES.find(n => n.id === edge.to);
                  if (!source || !target) return null;

                  const isConnectedToSelected =
                    edge.from === selectedNodeId || edge.to === selectedNodeId;

                  const strokeColor = edge.type === 'inhibits'
                    ? '#f43f5e'
                    : isConnectedToSelected
                      ? '#2dd4bf'
                      : '#475569';

                  const markerId = edge.type === 'inhibits'
                    ? 'url(#marker-inhibits)'
                    : 'url(#arrowhead-activates)';

                  return (
                    <g key={idx}>
                      <line
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={strokeColor}
                        strokeWidth={isConnectedToSelected ? 2.5 : 1.5}
                        strokeDasharray={edge.type === 'induces' ? '4,4' : 'none'}
                        markerEnd={markerId}
                        className="transition-all duration-300"
                      />
                      {isConnectedToSelected && (
                        <text
                          x={(source.x + target.x) / 2}
                          y={(source.y + target.y) / 2 - 6}
                          fill="#99f6e4"
                          fontSize="10"
                          textAnchor="middle"
                          className="font-medium bg-slate-900"
                        >
                          {edge.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Render Nodes as Interactive HTML Elements */}
              {visibleNodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                let bgClasses = "bg-slate-800 border-slate-700 text-white";

                if (node.category === "Hormonal Signalling") {
                  bgClasses = isSelected ? "bg-fuchsia-600 border-white text-white shadow-lg shadow-fuchsia-500/50" : "bg-fuchsia-950/90 border-fuchsia-700 text-fuchsia-200 hover:border-fuchsia-400";
                } else if (node.category === "Inflammation") {
                  bgClasses = isSelected ? "bg-rose-600 border-white text-white shadow-lg shadow-rose-500/50" : "bg-rose-950/90 border-rose-700 text-rose-200 hover:border-rose-400";
                } else if (node.category === "Angiogenesis") {
                  bgClasses = isSelected ? "bg-emerald-600 border-white text-white shadow-lg shadow-emerald-500/50" : "bg-emerald-950/90 border-emerald-700 text-emerald-200 hover:border-emerald-400";
                } else if (node.category === "Fibrosis" || node.category === "Tissue Remodelling") {
                  bgClasses = isSelected ? "bg-cyan-600 border-white text-white shadow-lg shadow-cyan-500/50" : "bg-cyan-950/90 border-cyan-700 text-cyan-200 hover:border-cyan-400";
                } else if (node.category === "Immune Dysfunction") {
                  bgClasses = isSelected ? "bg-amber-600 border-white text-white shadow-lg shadow-amber-500/50" : "bg-amber-950/90 border-amber-700 text-amber-200 hover:border-amber-400";
                }

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{ left: `${node.x}px`, top: `${node.y}px` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-xl border cursor-pointer transition-all duration-200 text-center select-none ${bgClasses} ${
                      isSelected ? 'scale-110 ring-2 ring-teal-400 z-30' : 'hover:scale-105 z-10'
                    }`}
                  >
                    <div className="font-mono-code font-extrabold text-xs tracking-wide">
                      {node.symbol}
                    </div>
                    <div className="text-[10px] opacity-80 truncate max-w-[90px]">
                      {node.name}
                    </div>
                    {node.priorityScore && (
                      <div className="mt-1">
                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-black/40 rounded-full">
                          Score {node.priorityScore}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Canvas Bottom Legend */}
          <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-teal-400 inline-block" /> Activation / Upregulation
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-rose-500 inline-block" /> Pathological Inhibition
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t border-dashed border-slate-400 inline-block" /> Transcriptional Induction
              </span>
            </div>
            <span>Showing {visibleNodes.length} nodes & {visibleEdges.length} interactions</span>
          </div>

        </div>

        {/* NODE INSPECTOR PANEL (Span 4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">
                  Target Node Inspector
                </span>
                <h3 className="font-heading font-extrabold text-xl text-slate-900 font-mono-code">
                  {selectedNode.symbol}
                </h3>
                <p className="text-xs text-slate-500">{selectedNode.name}</p>
              </div>

              {selectedNode.priorityScore && (
                <div className="text-right">
                  <span className="text-xl font-heading font-extrabold text-teal-700">
                    {selectedNode.priorityScore}
                  </span>
                  <span className="text-xs text-slate-400">/100</span>
                  <p className="text-[10px] text-teal-800 font-semibold">Priority Score</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              <CategoryBadge category={selectedNode.category} />
              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 font-medium">
                {selectedNode.role}
              </span>
            </div>

            {/* Description */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <h5 className="font-bold text-slate-900 mb-1">Biological Mechanism:</h5>
              {selectedNode.description}
            </div>

            {/* Upstream & Downstream Connections */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                  Upstream Activators / Regulators:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.upstream.map((up, i) => (
                    <span key={i} className="px-2 py-0.5 bg-teal-50 text-teal-800 rounded border border-teal-200 text-[11px] font-medium">
                      {up}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                  Downstream Pathological Effectors:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.downstream.map((down, i) => (
                    <span key={i} className="px-2 py-0.5 bg-cyan-50 text-cyan-800 rounded border border-cyan-200 text-[11px] font-medium">
                      {down}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Scientific literature citation */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px]">
              <span className="font-bold text-slate-800 block mb-0.5">Literature Source:</span>
              <p className="text-slate-600 font-mono-code">{selectedNode.keyRef}</p>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={() => openTargetDetails(selectedNode.id)}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 group"
          >
            <span>Open Complete Scientific Dossier</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

        </div>

      </div>

    </div>
  );
}
