import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Printer,
  Calendar,
  TrendingUp,
  ShieldAlert,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from 'recharts';

export const ReportsPage: React.FC = () => {
  const { projects, teamMembers, tasks, risks } = useApp();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const velocityData = [
    { sprint: 'Sprint 1', plannedPoints: 45, completedPoints: 42, riskScore: 30 },
    { sprint: 'Sprint 2', plannedPoints: 50, completedPoints: 48, riskScore: 28 },
    { sprint: 'Sprint 3', plannedPoints: 55, completedPoints: 46, riskScore: 45 },
    { sprint: 'Sprint 4', plannedPoints: 60, completedPoints: 50, riskScore: 52 },
    { sprint: 'Sprint 5', plannedPoints: 55, completedPoints: 53, riskScore: 35 },
    { sprint: 'Sprint 6 (Curr)', plannedPoints: 65, completedPoints: 58, riskScore: 24 },
  ];

  const categoryRiskData = [
    { category: 'Technical', count: 4, avgScore: 68 },
    { category: 'Schedule', count: 3, avgScore: 60 },
    { category: 'Resource', count: 2, avgScore: 50 },
    { category: 'Dependency', count: 3, avgScore: 75 },
    { category: 'Scope', count: 1, avgScore: 40 },
    { category: 'Budget', count: 1, avgScore: 30 },
  ];

  const handleExport = (type: 'pdf' | 'csv') => {
    setDownloadSuccess(`Generated ProjectPulse_${type.toUpperCase()}_Audit_Report_${new Date().toISOString().slice(0, 10)}`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12" id="page-reports">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Executive Analytics &amp; Delivery Forensics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              Q3 2026 Audit
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Historical sprint velocity trends, automated burn-up projections, risk density distributions, and team throughput.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleExport('csv')}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center space-x-1.5 shadow-2xs transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Audit PDF</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{downloadSuccess} successfully generated and downloaded.</span>
        </div>
      )}

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">Sprint Velocity</span>
          <div className="text-2xl font-black text-slate-900 mt-1">58 pts</div>
          <span className="text-[11px] text-emerald-600 font-semibold">+8.5% sprint-over-sprint</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">Risk Defect Rate</span>
          <div className="text-2xl font-black text-slate-900 mt-1">3.2%</div>
          <span className="text-[11px] text-emerald-600 font-semibold">-1.4% past 30 days</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">Mean Resolution Time</span>
          <div className="text-2xl font-black text-slate-900 mt-1">42h</div>
          <span className="text-[11px] text-slate-500">From risk detection to ticket fix</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">Coverage Health</span>
          <div className="text-2xl font-black text-slate-900 mt-1">98.4%</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Zero orphaned deliverables</span>
        </div>
      </div>

      {/* Velocity & Risk Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Sprint Velocity vs Planned points */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Sprint Throughput: Planned vs Actual Velocity</h3>
            <span className="text-xs text-slate-400 font-mono">Story Points</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 80]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="plannedPoints" name="Planned Points" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completedPoints" name="Delivered Points" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Trend Over Sprints */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Project Risk Exposure Trajectory</h3>
            <span className="text-xs text-slate-400 font-mono">Normalized Score (0-100)</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskReportGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 80]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="riskScore"
                  name="Aggregate Risk Level"
                  stroke="#e11d48"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#riskReportGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Risk by Category Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Risk Concentration by Functional Category</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Active Incidents</th>
                <th className="py-2.5 px-3">Avg Risk Score</th>
                <th className="py-2.5 px-3">Mitigation Readiness</th>
                <th className="py-2.5 px-3 text-right">Trend Direction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categoryRiskData.map((c) => (
                <tr key={c.category} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{c.category}</td>
                  <td className="py-2.5 px-3 font-mono">{c.count} Items</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-rose-700">{c.avgScore} / 100</td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Adequately Staffed
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-600 font-semibold">&darr; Decreasing</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
