import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  Tag,
  User,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

export const AIInsightsPage: React.FC = () => {
  const { aiRecommendations, acceptRecommendation, openModal } = useApp();
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filtered = aiRecommendations.filter((r) => {
    if (filterPriority !== 'all' && r.priority !== filterPriority) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12" id="page-ai-insights">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Explainable AI Intelligence &amp; Recommendations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold">
              {aiRecommendations.length} Prescriptive Insights
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Auditable mathematical recommendations identifying friction, predicting deliverable slippages, and calculating optimal staffing reallocation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-white text-slate-700 shadow-2xs font-medium"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
          </select>
        </div>
      </div>

      {/* Structured Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map((rec) => (
          <div
            key={rec.id}
            className={`bg-white rounded-xl border p-5 shadow-2xs space-y-4 transition ${
              rec.accepted
                ? 'border-emerald-200 bg-emerald-50/20'
                : 'border-slate-200 hover:border-indigo-300'
            }`}
          >
            {/* Header info */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                  {rec.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    rec.priority === 'critical'
                      ? 'bg-rose-100 text-rose-700'
                      : rec.priority === 'high'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {rec.priority} Priority
                </span>
              </div>

              {rec.accepted ? (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Applied</span>
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 font-mono">Awaiting Review</span>
              )}
            </div>

            <h3 className="text-base font-bold text-slate-900 leading-snug">{rec.title}</h3>

            {/* 3 Question Structure */}
            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  1. What is happening?
                </span>
                <p className="text-slate-700 leading-relaxed">{rec.whatIsHappening}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  2. Why is it important?
                </span>
                <p className="text-slate-700 leading-relaxed">{rec.whyIsImportant}</p>
              </div>

              <div className="bg-indigo-50/70 p-3 rounded-lg border border-indigo-100">
                <span className="text-[10px] uppercase font-bold text-indigo-700 block mb-0.5">
                  3. Prescribed Remediation Action:
                </span>
                <p className="text-indigo-950 font-semibold leading-relaxed">
                  {rec.recommendedAction}
                </p>
              </div>
            </div>

            {/* Responsible Owner & Impact */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Designated Technical Owner:
                </span>
                <span className="font-bold text-slate-800">{rec.responsibleOwnerName}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Projected Velocity Impact:
                </span>
                <span className="font-bold text-emerald-700">{rec.expectedImpact}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => acceptRecommendation(rec.id)}
                disabled={rec.accepted}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  rec.accepted
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{rec.accepted ? 'Recommendation Executed' : 'Accept & Deploy'}</span>
              </button>

              <button
                onClick={() => openModal('create-ticket')}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Open Risk Ticket</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
