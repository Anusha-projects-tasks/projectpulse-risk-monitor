import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  Tag,
  ArrowRight,
  User,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const AIInsightsSection: React.FC = () => {
  const {
    aiRecommendations,
    acceptRecommendation,
    openModal,
    setCurrentPage,
    selectedProjectId,
  } = useApp();

  const activeRecs = aiRecommendations.filter(
    (r) => r.projectId === selectedProjectId || aiRecommendations.length <= 4
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4" id="section-ai-insights">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Explainable AI Recommendations &amp; Strategic Interventions
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Prescriptive intelligence with auditable reasoning, designated owners, and quantified velocity impacts.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('ai-insights')}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
        >
          <span>View All AI Insights</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Structured Recommendation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {activeRecs.map((rec) => (
          <div
            key={rec.id}
            className={`border rounded-xl p-4 transition shadow-2xs flex flex-col justify-between ${
              rec.accepted
                ? 'bg-emerald-50/40 border-emerald-200'
                : 'bg-white border-slate-200 hover:border-indigo-200'
            }`}
          >
            <div>
              {/* Header pill & priority */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                  {rec.id}
                </span>

                <div className="flex items-center space-x-2">
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

                  {rec.accepted && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Accepted
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-3 leading-snug">{rec.title}</h3>

              {/* 5-part Structured Breakdown */}
              <div className="space-y-2.5 text-xs">
                {/* 1. What is happening? */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                  <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider mb-0.5">
                    1. What is happening?
                  </span>
                  <p className="text-slate-600 leading-relaxed">{rec.whatIsHappening}</p>
                </div>

                {/* 2. Why is it important? */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                  <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider mb-0.5">
                    2. Why is it important?
                  </span>
                  <p className="text-slate-600 leading-relaxed">{rec.whyIsImportant}</p>
                </div>

                {/* 3. Recommended action */}
                <div className="bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100">
                  <span className="font-bold text-indigo-900 block text-[11px] uppercase tracking-wider mb-0.5">
                    3. Recommended Action
                  </span>
                  <p className="text-indigo-950 font-medium leading-relaxed">{rec.recommendedAction}</p>
                </div>

                {/* Meta details: Owner & Impact */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="flex items-center space-x-2 text-[11px] text-slate-600">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Responsible Owner:</span>
                      <strong className="text-slate-800">{rec.responsibleOwnerName}</strong>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] text-slate-600">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Expected Impact:</span>
                      <strong className="text-slate-800 truncate block">{rec.expectedImpact}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
              <button
                onClick={() => acceptRecommendation(rec.id)}
                disabled={rec.accepted}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  rec.accepted
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{rec.accepted ? 'Action Executed' : 'Accept Recommendation'}</span>
              </button>

              <button
                onClick={() => openModal('create-ticket')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow-2xs"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Create Risk Ticket</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
