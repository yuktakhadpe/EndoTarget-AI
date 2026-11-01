import React from 'react';

export function PriorityScoreBar({ score, showLabel = true, size = 'md' }) {
  let barColor = "bg-teal-500";
  let textColor = "text-teal-700";
  let bgTrack = "bg-teal-100/60";

  if (score >= 90) {
    barColor = "bg-gradient-to-r from-teal-500 to-emerald-500";
    textColor = "text-teal-800 font-bold";
    bgTrack = "bg-teal-100";
  } else if (score >= 80) {
    barColor = "bg-gradient-to-r from-cyan-500 to-teal-500";
    textColor = "text-cyan-800 font-bold";
    bgTrack = "bg-cyan-100";
  } else if (score >= 70) {
    barColor = "bg-gradient-to-r from-amber-500 to-orange-400";
    textColor = "text-amber-800 font-semibold";
    bgTrack = "bg-amber-100";
  } else {
    barColor = "bg-slate-400";
    textColor = "text-slate-700";
    bgTrack = "bg-slate-200";
  }

  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        {showLabel && (
          <span className="text-xs font-medium text-slate-500">Priority Score</span>
        )}
        <span className={`text-xs ${textColor}`}>
          {score}<span className="text-slate-400 font-normal">/100</span>
        </span>
      </div>
      <div className={`w-full ${bgTrack} rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} rounded-full ${barColor} transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  );
}
