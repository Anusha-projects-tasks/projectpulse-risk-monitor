import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  Clock,
  Users,
  Award,
  ArrowRight,
} from 'lucide-react';

export const ImpactVerificationPage: React.FC = () => {
  const { risks, aiRecommendations, tickets } = useApp();

  const verificationRecords = [
    {
      id: 'VER-401',
      actionName: 'Offload Cross-Region DB Sharding to Database Specialist',
      riskId: 'RSK-102',
      dateVerified: '2026-09-10',
      beforeScore: 85,
      afterScore: 20,
      workloadReducedHours: 12,
      scheduleDaysRecovered: 6,
      verifiedBy: 'Sarah Jenkins (Eng Lead)',
      status: 'verified',
      summary:
        'Transferring Aurora clustering unblocked backend team, resulting in a 65-point reduction in project risk.',
    },
    {
      id: 'VER-402',
      actionName: 'Approve Elena Rostova 5-Day Leave & Deploy Automated Handover',
      riskId: 'RSK-105',
      dateVerified: '2026-09-09',
      beforeScore: 70,
      afterScore: 15,
      workloadReducedHours: 8,
      scheduleDaysRecovered: 3,
      verifiedBy: 'David Kim (Architect)',
      status: 'verified',
      summary:
        'Marcus Vance absorbed Istio TLS canary verification seamlessly with zero milestone slippage.',
    },
    {
      id: 'VER-403',
      actionName: 'Hotfix gRPC Connection Multiplexing on Gateway Proxies',
      riskId: 'RSK-101',
      dateVerified: '2026-09-08',
      beforeScore: 90,
      afterScore: 30,
      workloadReducedHours: 15,
      scheduleDaysRecovered: 4,
      verifiedBy: 'Alex Rivera (Staff SRE)',
      status: 'verified',
      summary:
        'Envoy proxy patch cleared high latency spikes; API failure rate plummeted from 4.8% to 0.02%.',
    },
  ];

  return (
    <div className="space-y-6 pb-12" id="page-impact-verification">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Impact Verification &amp; Resolution Forensics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              Quantified Outcomes Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Empirical before-vs-after validation proving whether mitigations, AI reallocations, and tickets achieved targeted risk reduction.
          </p>
        </div>
      </div>

      {/* Aggregate Impact Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">Average Risk Reduction</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">-58 pts</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Across all mitigations</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">Engineering Hours Saved</span>
          <div className="text-2xl font-black text-indigo-950 mt-1">142 hrs</div>
          <span className="text-[11px] text-indigo-600 font-semibold">Via proactive triage</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">Schedule Days Recovered</span>
          <div className="text-2xl font-black text-slate-900 mt-1">13 days</div>
          <span className="text-[11px] text-slate-500">Critical path protection</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">Verification Signoff Rate</span>
          <div className="text-2xl font-black text-emerald-950 mt-1">100%</div>
          <span className="text-[11px] text-emerald-600 font-semibold">All signed off by Leads</span>
        </div>
      </div>

      {/* Verification Records Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Audited Remediation Evidence Log
        </h3>

        <div className="space-y-4">
          {verificationRecords.map((rec) => {
            const delta = rec.beforeScore - rec.afterScore;

            return (
              <div
                key={rec.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {rec.id}
                      </span>
                      <span className="font-mono text-xs text-slate-400">Target Risk: {rec.riskId}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified &amp; Sealed
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{rec.actionName}</h4>
                  </div>

                  <div className="text-right text-xs">
                    <span className="text-slate-400 block font-mono text-[10px]">
                      Verified on {rec.dateVerified}
                    </span>
                    <span className="font-semibold text-slate-700">{rec.verifiedBy}</span>
                  </div>
                </div>

                {/* Score Comparison Visualizer */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Risk Score Impact:
                    </span>
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <span className="text-xs text-slate-400 block font-mono">Before</span>
                        <span className="text-lg font-black text-rose-600">{rec.beforeScore}</span>
                      </div>
                      <span className="text-slate-400 font-bold">&rarr;</span>
                      <div className="text-center">
                        <span className="text-xs text-slate-400 block font-mono">After</span>
                        <span className="text-lg font-black text-emerald-600">{rec.afterScore}</span>
                      </div>
                      <div className="pl-2 border-l border-slate-200">
                        <span className="text-xs font-bold text-emerald-700 block">-{delta} pts</span>
                        <span className="text-[10px] text-emerald-600">Risk Deflated</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Workload Relief:
                    </span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-xl font-black text-indigo-900">
                        -{rec.workloadReducedHours} hrs
                      </span>
                      <span className="text-slate-500 text-[11px]">unblocked</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Shifted away from bottlenecked engineers
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Schedule Velocity Recovery:
                    </span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-xl font-black text-slate-900">
                        +{rec.scheduleDaysRecovered} days
                      </span>
                      <span className="text-slate-500 text-[11px]">buffer</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Milestone delivery back on track
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{rec.summary}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
