import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  ArrowRight,
  Plus,
  HelpCircle,
  CheckCircle2,
  AlertOctagon,
  Eye,
} from 'lucide-react';
import { getRiskSeverity } from '../../utils/riskScoring';

export const RiskMonitorSummarySection: React.FC = () => {
  const {
    risks,
    selectedProjectId,
    setCurrentPage,
    setActiveBreakdownRisk,
    openModal,
    setActiveTaskDrawerId,
    resolveRisk,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const projRisks = risks.filter((r) => r.projectId === selectedProjectId);

  const filteredRisks = projRisks.filter((r) => {
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    if (severityFilter !== 'all' && r.severity !== severityFilter) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4" id="section-risk-monitor-summary">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900">Active Risk Log &amp; Scoring Matrix</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent enterprise risk inventory evaluated against our deterministic 7-factor scoring engine.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => openModal('create-risk')}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Risk</span>
          </button>
          <button
            onClick={() => setCurrentPage('risk-monitor')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
          >
            <span>Full Risk Monitor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider mr-1">
          Quick Filters:
        </span>
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
      </div>

      {/* Professional Risk Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-3.5">Risk ID</th>
              <th className="py-3 px-3.5">Risk Title &amp; Category</th>
              <th className="py-3 px-3.5">Severity</th>
              <th className="py-3 px-3.5 text-center">Risk Score</th>
              <th className="py-3 px-3.5">Related Task</th>
              <th className="py-3 px-3.5">Owner</th>
              <th className="py-3 px-3.5">Target Date</th>
              <th className="py-3 px-3.5">Status</th>
              <th className="py-3 px-3.5 text-right">Audit Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredRisks.map((r) => {
              const severity = getRiskSeverity(r.riskScore);
              return (
                <tr key={r.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-3.5 font-mono font-bold text-indigo-700">{r.id}</td>

                  <td className="py-3 px-3.5 max-w-xs">
                    <div className="font-semibold text-slate-900 truncate" title={r.title}>
                      {r.title}
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">{r.category}</span>
                  </td>

                  <td className="py-3 px-3.5">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
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

                  <td className="py-3 px-3.5 text-center">
                    <button
                      onClick={() => setActiveBreakdownRisk(r)}
                      className="font-mono font-black text-xs px-2 py-0.5 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 transition"
                      title="Inspect Scoring Breakdown"
                    >
                      {r.riskScore}
                    </button>
                  </td>

                  <td className="py-3 px-3.5 max-w-[140px] truncate">
                    {r.relatedTaskId ? (
                      <button
                        onClick={() => setActiveTaskDrawerId(r.relatedTaskId!)}
                        className="text-indigo-600 hover:underline font-medium text-[11px] truncate block"
                      >
                        {r.relatedTaskId}: {r.relatedTaskTitle || 'Task'}
                      </button>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">General</span>
                    )}
                  </td>

                  <td className="py-3 px-3.5">
                    <div className="flex items-center space-x-1.5">
                      <img
                        src={r.ownerAvatar}
                        alt={r.ownerName}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-slate-800 font-medium truncate max-w-[100px]">{r.ownerName}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3.5 text-slate-600 font-mono text-[11px]">{r.dueDate}</td>

                  <td className="py-3 px-3.5">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                        r.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'escalated'
                          ? 'bg-rose-100 text-rose-800 font-bold'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="py-3 px-3.5 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => setActiveBreakdownRisk(r)}
                      className="px-2 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 rounded transition"
                    >
                      Audit
                    </button>
                    {r.status !== 'resolved' && (
                      <button
                        onClick={() => resolveRisk(r.id)}
                        className="px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50 rounded transition"
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
