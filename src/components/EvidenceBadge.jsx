import React from 'react';

export function EvidenceBadge({ type, size = 'sm' }) {
  let colorClasses = "bg-slate-100 text-slate-700 border-slate-300";
  let dotColor = "bg-slate-400";

  const lower = (type || '').toLowerCase();
  if (lower.includes('clinical') || lower.includes('human clinical')) {
    colorClasses = "bg-teal-50 text-teal-800 border-teal-300/80";
    dotColor = "bg-teal-500";
  } else if (lower.includes('tissue') || lower.includes('ex-vivo')) {
    colorClasses = "bg-sky-50 text-sky-800 border-sky-300/80";
    dotColor = "bg-sky-500";
  } else if (lower.includes('animal') || lower.includes('in-vivo')) {
    colorClasses = "bg-amber-50 text-amber-800 border-amber-300/80";
    dotColor = "bg-amber-500";
  } else if (lower.includes('vitro') || lower.includes('in-vitro') || lower.includes('cell')) {
    colorClasses = "bg-purple-50 text-purple-800 border-purple-300/80";
    dotColor = "bg-purple-500";
  }

  const sizeClasses = size === 'xs' 
    ? "text-[11px] px-2 py-0.5 gap-1.5" 
    : "text-xs px-2.5 py-1 gap-1.5";

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${colorClasses} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      <span>{type}</span>
    </span>
  );
}

export function CategoryBadge({ category }) {
  const map = {
    "Inflammation": "bg-rose-50 text-rose-700 border-rose-200",
    "Hormonal Signalling": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
    "Immune Dysfunction": "bg-amber-50 text-amber-700 border-amber-200",
    "Angiogenesis": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Fibrosis": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "Cell Proliferation": "bg-blue-50 text-blue-700 border-blue-200",
    "Oxidative Stress": "bg-orange-50 text-orange-700 border-orange-200",
    "Tissue Remodelling": "bg-cyan-50 text-cyan-700 border-cyan-200",
  };

  const style = map[category] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${style}`}>
      {category}
    </span>
  );
}
