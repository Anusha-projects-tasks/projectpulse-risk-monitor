import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  Clock,
  TrendingDown,
  Users,
  ShieldAlert,
  ArrowRight,
  PlusCircle,
  Eye,
} from 'lucide-react';

export const EarlyWarningSignalsSection: React.FC = () => {
  const { earlyWarnings, openModal, setActiveTaskDrawerId, setCurrentPage } = useApp();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Progress Drop':
        return <TrendingDown className="w-4 h-4 text-rose-600" />;
      case 'Workload Overload':
        return <Users className="w-4 h-4 text-amber-600" />;
      case 'Dependency Block':
        return <ShieldAlert className="w-4 h-4 text-purple-600" />;
      case 'Deadline Pressure':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4" id="section-early-warnings">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900">Early Warning Signals &amp; Friction Triggers</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Heuristic detection system capturing micro-slippages before they escalate into critical project milestones.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('risk-monitor')}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
        >
          <span>Open Risk Monitor</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Category Signal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {earlyWarnings.map((sig) => (
          <div
            key={sig.id}
            className="border border-slate-200 rounded-xl p-4 bg-slate-50/40 hover:bg-slate-50 transition shadow-2xs flex flex-col justify-between"
          >
            <div>
              {/* Top Row: Category, Severity, Score */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="p-1 bg-white rounded-md border border-slate-200 shadow-2xs">
                    {getCategoryIcon(sig.category)}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-800">{sig.category}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Detected: {sig.detectionDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      sig.severity === 'critical'
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {sig.severity}
                  </span>
                  <span className="text-xs font-black font-mono text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    Score: {sig.riskScore}
                  </span>
                </div>
              </div>

              {/* Affected Task/Area */}
              <div className="text-xs font-bold text-indigo-950 mb-1.5 flex items-center gap-1.5">
                <span className="text-indigo-600">Affected:</span>
                <span className="truncate">{sig.affectedTaskTitle}</span>
              </div>

              {/* Explanation */}
              <p className="text-xs text-slate-600 leading-relaxed mb-3">{sig.explanation}</p>

              {/* Recommended Action */}
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-800 mb-3">
                <span className="font-bold text-indigo-700 block text-[11px] uppercase tracking-wider mb-0.5">
                  Recommended Action:
                </span>
                <p className="text-slate-600 leading-tight">{sig.recommendedAction}</p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  if (sig.affectedTaskId) setActiveTaskDrawerId(sig.affectedTaskId);
                  else setCurrentPage('tasks');
                }}
                className="text-slate-700 hover:text-slate-900 font-semibold flex items-center space-x-1"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>View Details</span>
              </button>

              <button
                onClick={() => openModal('create-ticket')}
                className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center space-x-1 transition shadow-2xs text-[11px]"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create Risk Ticket</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
