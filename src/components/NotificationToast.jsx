import React from 'react';
import { useResearch } from '../context/ResearchContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function NotificationToast() {
  const { notification, showNotification } = useResearch();

  if (!notification) return null;

  const isSuccess = notification.type === 'success';
  const isWarning = notification.type === 'warning';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md ${
        isSuccess 
          ? 'bg-slate-900/95 border-teal-500/50 text-white' 
          : isWarning 
            ? 'bg-slate-900/95 border-amber-500/50 text-white' 
            : 'bg-slate-900/95 border-slate-700 text-white'
      }`}>
        <div className="mt-0.5 shrink-0">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-teal-400" />}
          {isWarning && <AlertCircle className="w-5 h-5 text-amber-400" />}
          {!isSuccess && !isWarning && <Info className="w-5 h-5 text-cyan-400" />}
        </div>
        <div className="flex-1 text-sm leading-snug">
          {notification.message}
        </div>
        <button
          onClick={() => showNotification(null)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
