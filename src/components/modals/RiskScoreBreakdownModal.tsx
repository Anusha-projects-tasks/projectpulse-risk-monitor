import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, Info, HelpCircle } from 'lucide-react';
import { getRiskSeverity } from '../../utils/riskScoring';

export const RiskScoreBreakdownModal: React.FC = () => {
  const { activeBreakdownRisk, setActiveBreakdownRisk } = useApp();

  if (!activeBreakdownRisk) return null;

  const b = activeBreakdownRisk.scoreBreakdown || {
    progressGap: 30,
    workloadOverload: 25,
    nearDeadline: 0,
    blockedDependency: 20,
    memberUnavailable: 0,
    communicationDelay: 0,
    missingOwner: 0,
    totalScore: activeBreakdownRisk.riskScore,
  };

  const severity = getRiskSeverity(activeBreakdownRisk.riskScore);

  const factorList = [
    {
      label: 'Progress Gap > 20%',
      rule: 'Schedule variance threshold exceeded (>20% gap between expected & actual)',
      points: '+30',
      active: b.progressGap > 0,
      detail: b.progressGap > 0 ? 'Active: Lagging significantly behind scheduled sprint target.' : 'Pass: Progress is within allowable 20% tolerance.',
    },
    {
      label: 'Workload Exceeds Capacity',
      rule: 'Assignee allocated hours exceed weekly capacity (>40h/wk baseline)',
      points: '+25',
      active: b.workloadOverload > 0,
      detail: b.workloadOverload > 0 ? 'Active: Primary engineer has severe concurrent task overload.' : 'Pass: Team member workload within 100% capacity.',
    },
    {
      label: 'Critical Due Within 2 Days',
      rule: 'Target delivery deadline due within 48h while incomplete',
      points: '+25',
      active: b.nearDeadline > 0,
      detail: b.nearDeadline > 0 ? 'Active: Imminent deadline with incomplete acceptance criteria.' : 'Pass: Sufficient runway before scheduled delivery.',
    },
    {
      label: 'Blocked Dependency',
      rule: 'Unresolved upstream prerequisite or external approval block',
      points: '+20',
      active: b.blockedDependency > 0,
      detail: b.blockedDependency > 0 ? 'Active: Impeded by upstream dependency or SecOps verification.' : 'Pass: No blocking upstream dependencies.',
    },
    {
      label: 'Team Member Unavailable',
      rule: 'Assignee on approved leave, limited bandwith, or unconfirmed backup',
      points: '+20',
      active: b.memberUnavailable > 0,
      detail: b.memberUnavailable > 0 ? 'Active: Resource absence directly impacts delivery velocity.' : 'Pass: Owner actively available and on duty.',
    },
    {
      label: 'Missing Owner / Unassigned',
      rule: 'Task or risk lacks a designated responsible technical owner',
      points: '+15',
      active: b.missingOwner > 0,
      detail: b.missingOwner > 0 ? 'Active: Accountability vacuum; no engineer assigned to lead.' : 'Pass: Clearly designated technical owner.',
    },
    {
      label: 'Communication Delay',
      rule: 'No progress update, PR review, or standup note recorded in 72+ hours',
      points: '+10',
      active: b.communicationDelay > 0,
      detail: b.communicationDelay > 0 ? 'Active: Communication silence creates blind spots in triage.' : 'Pass: Regular communication logs and standup notes.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">Risk Score Calculation Breakdown</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Deterministic Rule-Based Risk Engine Audit • ID: {activeBreakdownRisk.id}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveBreakdownRisk(null)}
            className="text-slate-400 hover:text-white transition p-1 rounded-md hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Risk Title & Badge */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">
                  {activeBreakdownRisk.category} Risk • Owner: {activeBreakdownRisk.ownerName}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1">{activeBreakdownRisk.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{activeBreakdownRisk.explanation}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-3xl font-black text-slate-900">{activeBreakdownRisk.riskScore}</div>
                <span
                  className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1 uppercase ${
                    severity === 'critical'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : severity === 'high'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : severity === 'medium'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {severity} Risk
                </span>
              </div>
            </div>
          </div>

          {/* Transparent Scoring Formula */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-600" />
                Rule Evaluation Factor Matrix
              </h5>
              <span className="text-xs font-medium text-slate-500">
                Score Range: 0 (Min) – 100 (Max)
              </span>
            </div>

            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 text-xs">
              {factorList.map((f, idx) => (
                <div
                  key={idx}
                  className={`p-3 flex items-start justify-between gap-3 transition ${
                    f.active ? 'bg-amber-50/50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {f.active ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${f.active ? 'text-slate-900' : 'text-slate-600'}`}>
                          {f.label}
                        </span>
                        <span className="text-[11px] text-slate-400 font-normal">({f.rule})</span>
                      </div>
                      <p className={`mt-0.5 text-[11px] ${f.active ? 'text-amber-900 font-medium' : 'text-slate-400'}`}>
                        {f.detail}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                        f.active
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {f.active ? f.points : '+0'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Classification & Health Score Logic Legend */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-lg p-3 text-xs text-indigo-950 space-y-1.5">
            <div className="font-semibold flex items-center gap-1.5 text-indigo-900">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              Standard Classification & Health Impact
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="bg-white p-2 rounded border border-indigo-100 text-center">
                <span className="text-emerald-700 font-bold block">0 – 30</span>
                <span className="text-slate-500 text-[10px]">Low Risk</span>
              </div>
              <div className="bg-white p-2 rounded border border-indigo-100 text-center">
                <span className="text-blue-700 font-bold block">31 – 60</span>
                <span className="text-slate-500 text-[10px]">Medium Risk</span>
              </div>
              <div className="bg-white p-2 rounded border border-indigo-100 text-center">
                <span className="text-amber-700 font-bold block">61 – 80</span>
                <span className="text-slate-500 text-[10px]">High Risk</span>
              </div>
              <div className="bg-white p-2 rounded border border-indigo-100 text-center">
                <span className="text-rose-700 font-bold block">81 – 100</span>
                <span className="text-slate-500 text-[10px]">Critical Risk</span>
              </div>
            </div>
            <p className="text-[11px] text-indigo-800 pt-1">
              <strong>Project Health Score Formula:</strong> Health = 100 − average active task risk score. A rise in this risk directly penalizes project portfolio health index.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setActiveBreakdownRisk(null)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
          >
            Close Audit Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
