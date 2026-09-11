import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Plus,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Eye,
  ArrowRight,
  TrendingDown,
  Info,
} from 'lucide-react';
import { getRiskSeverity } from '../utils/riskScoring';

export const RiskMonitorPage: React.FC = () => {
  const {
    risks,
    selectedProjectId,
    selectedProject,
    openModal,
    setActiveBreakdownRisk,
    resolveRisk,
    setActiveTaskDrawerId,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const projRisks = risks.filter((r) => r.projectId === selectedProjectId);

  const filteredRisks = projRisks.filter((r) => {
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    if (severityFilter !== 'all' && r.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  const criticalCount = projRisks.filter((r) => r.severity === 'critical').length;
  const highCount = projRisks.filter((r) => r.severity === 'high').length;
  const mediumCount = projRisks.filter((r) => r.severity === 'medium').length;
  const resolvedCount = projRisks.filter((r) => r.status === 'resolved').length;

  return (
    <div className="space-y-6 pb-12" id="page-risk-monitor">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Enterprise Risk Monitor &amp; Heuristic Matrix
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold font-mono">
              {projRisks.length} Logged Risks
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Explainable rule-based risk quantification matrix evaluating progress gaps, resource friction, and upstream dependencies.
          </p>
        </div>

        <button
          onClick={() => openModal('create-risk')}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs flex items-center space-x-2 shadow-xs transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Risk</span>
        </button>
      </div>

      {/* 7 Rule Scoring Logic Infographic Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-5 border border-indigo-900/50 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm text-white">
              Deterministic 7-Factor Risk Scoring Engine
            </h3>
          </div>
          <span className="text-[11px] font-mono text-indigo-300 bg-indigo-900/60 px-2.5 py-1 rounded border border-indigo-700">
            Audit Standard ISO-31000
          </span>
        </div>

        <p className="text-xs text-slate-300 mb-4 max-w-3xl">
          Risk points are calculated through rule-based evaluation. Click on any score badge across the platform to inspect mathematical step-by-step reasoning.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs">
          <div className="bg-white/10 rounded-lg p-2.5 border border-white/10">
            <span className="text-amber-400 font-black block text-sm">+30 pts</span>
            <span className="text-[11px] text-slate-200 font-medium leading-tight block mt-1">
              Progress Gap &gt; 20%
            </span>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 border border-white/10">
            <span className="text-amber-400 font-black block text-sm">+25 pts</span>
            <span className="text-[11px] text-slate-200 font-medium leading-tight block mt-1">
              Workload Overload
            </span>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 border border-white/10">
            <span className="text-amber-400 font-black block text-sm">+25 pts</span>
            <span className="text-[11px] text-slate-200 font-medium leading-tight block mt-1">
              Due Within &le; 2 Days
            </span>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 border border-white/10">
            <span className="text-amber-400 font-black block text-sm">+20 pts</span>
            <span className="text-[11px] text-slate-200 font-medium leading-tight block mt-1">
              Blocked Dependency
            </span>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 border border-white/10">
            <span className="text-amber-400 font-black block text-sm">+20 pts</span>
            <span className="text-[11px] text-slate-200 font-medium leading-tight block mt-1">
              Member on Leave
            </span>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 border border-white/10">
            <span className="text-amber-400 font-black block text-sm">+15 pts</span>
            <span className="text-[11px] text-slate-200 font-medium leading-tight block mt-1">
              Missing Technical Owner
            </span>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 border border-white/10">
            <span className="text-amber-400 font-black block text-sm">+10 pts</span>
            <span className="text-[11px] text-slate-200 font-medium leading-tight block mt-1">
              Comms Delay &gt; 72h
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5">
          <span className="text-[11px] font-bold text-rose-800 uppercase block">Critical Risks</span>
          <div className="text-2xl font-black text-rose-950 mt-1">{criticalCount}</div>
          <span className="text-[11px] text-rose-700">Immediate action needed</span>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
          <span className="text-[11px] font-bold text-amber-800 uppercase block">High Severity</span>
          <div className="text-2xl font-black text-amber-950 mt-1">{highCount}</div>
          <span className="text-[11px] text-amber-700">Sprint trajectory impact</span>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5">
          <span className="text-[11px] font-bold text-blue-800 uppercase block">Medium Severity</span>
          <div className="text-2xl font-black text-blue-950 mt-1">{mediumCount}</div>
          <span className="text-[11px] text-blue-700">Under active monitoring</span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
          <span className="text-[11px] font-bold text-emerald-800 uppercase block">Resolved Risks</span>
          <div className="text-2xl font-black text-emerald-950 mt-1">{resolvedCount}</div>
          <span className="text-[11px] text-emerald-700">Mitigated successfully</span>
        </div>
      </div>

      {/* Filter controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-wrap items-center gap-3 shadow-2xs text-xs">
        <span className="font-bold text-slate-700">Filter By:</span>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs bg-slate-50 text-slate-700"
        >
          <option value="all">All Categories</option>
          <option value="Technical">Technical</option>
          <option value="Schedule">Schedule</option>
          <option value="Resource">Resource</option>
          <option value="Dependency">Dependency</option>
          <option value="Scope">Scope</option>
          <option value="Budget">Budget</option>
        </select>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs bg-slate-50 text-slate-700"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs bg-slate-50 text-slate-700"
        >
          <option value="all">All Statuses</option>
          <option value="monitoring">Monitoring</option>
          <option value="escalated">Escalated</option>
          <option value="mitigating">Mitigating</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Risks Table with Full Detail */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Risk ID</th>
                <th className="py-3 px-4">Risk Title &amp; Explanation</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Related Task</th>
                <th className="py-3 px-4">Mitigation Plan</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRisks.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{r.id}</td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-bold text-slate-900">{r.title}</div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{r.explanation}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {r.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        r.severity === 'critical'
                          ? 'bg-rose-100 text-rose-700'
                          : r.severity === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {r.severity}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setActiveBreakdownRisk(r)}
                      className="font-mono font-black text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-indigo-600 hover:text-white border border-slate-200 transition"
                      title="Inspect Scoring Breakdown"
                    >
                      {r.riskScore}
                    </button>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1.5">
                      <img
                        src={r.ownerAvatar}
                        alt={r.ownerName}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-slate-800 font-semibold truncate max-w-[100px]">{r.ownerName}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 max-w-[130px] truncate">
                    {r.relatedTaskId ? (
                      <button
                        onClick={() => setActiveTaskDrawerId(r.relatedTaskId!)}
                        className="text-indigo-600 hover:underline font-medium text-[11px] truncate block"
                      >
                        {r.relatedTaskId}: {r.relatedTaskTitle}
                      </button>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">General Risk</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 max-w-xs text-[11px] text-slate-600 truncate" title={r.mitigationPlan}>
                    {r.mitigationPlan}
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => setActiveBreakdownRisk(r)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 rounded transition"
                    >
                      Audit
                    </button>
                    {r.status !== 'resolved' && (
                      <button
                        onClick={() => resolveRisk(r.id)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50 rounded transition"
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
