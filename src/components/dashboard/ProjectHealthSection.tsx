import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Clock,
  TrendingDown,
  Info,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const ProjectHealthSection: React.FC = () => {
  const { selectedProject, calculatedHealthScore, setActiveBreakdownRisk, risks } = useApp();

  if (!selectedProject) return null;

  const actualProgress = selectedProject.actualProgress;
  const expectedProgress = selectedProject.expectedProgress;
  const progressGap = expectedProgress - actualProgress;
  const scheduleVariance = progressGap > 15 ? '-18 days' : progressGap > 5 ? '-6 days' : '+2 days';

  const statusLabel =
    calculatedHealthScore >= 80 ? 'Healthy' : calculatedHealthScore >= 60 ? 'At Risk' : 'Critical';

  // Realistic historic 6-week trend data
  const trendData = [
    { week: 'W31', score: 88, expected: 85 },
    { week: 'W32', score: 84, expected: 86 },
    { week: 'W33', score: 79, expected: 88 },
    { week: 'W34', score: 74, expected: 89 },
    { week: 'W35', score: 68, expected: 90 },
    { week: 'Current (W36)', score: calculatedHealthScore, expected: 92 },
  ];

  const firstCriticalRisk = risks.find(
    (r) => r.projectId === selectedProject.id && (r.severity === 'critical' || r.severity === 'high')
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-5" id="section-project-health">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Activity className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900">Project Health &amp; Variance Overview</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic composite health score derived from task velocity, dependency friction, and resource loads.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {firstCriticalRisk && (
            <button
              onClick={() => setActiveBreakdownRisk(firstCriticalRisk)}
              className="text-xs font-semibold px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition flex items-center space-x-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Audit Calculation Rules</span>
            </button>
          )}

          <div
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 ${
              statusLabel === 'Healthy'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : statusLabel === 'At Risk'
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-rose-100 text-rose-800 border border-rose-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                statusLabel === 'Healthy'
                  ? 'bg-emerald-600'
                  : statusLabel === 'At Risk'
                  ? 'bg-amber-600'
                  : 'bg-rose-600 animate-ping'
              }`}
            />
            <span>{statusLabel}</span>
          </div>
        </div>
      </div>

      {/* Main Metric Visual Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Overall Score */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Overall Health Score
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-black text-slate-900">{calculatedHealthScore}</span>
            <span className="text-xs text-slate-400 font-medium">/ 100</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Formula: 100 − Avg Task Risk
          </span>
        </div>

        {/* Progress Comparison */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Actual vs Expected
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{actualProgress}%</span>
            <span className="text-xs text-slate-400">of {expectedProgress}% exp</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden flex">
            <div className="bg-indigo-600 h-1.5" style={{ width: `${actualProgress}%` }} />
            <div
              className="bg-slate-400/40 h-1.5"
              style={{ width: `${Math.max(0, expectedProgress - actualProgress)}%` }}
            />
          </div>
        </div>

        {/* Progress Gap */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Schedule Progress Gap
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span
              className={`text-2xl font-black ${
                progressGap > 20
                  ? 'text-rose-600'
                  : progressGap > 0
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}
            >
              {progressGap > 0 ? `-${progressGap}%` : `+${Math.abs(progressGap)}%`}
            </span>
            <span className="text-xs text-slate-500 font-medium">variance</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Schedule Delay: {scheduleVariance}
          </span>
        </div>

        {/* Forecast Completion */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Forecast Completion
          </span>
          <div className="text-sm font-bold text-slate-900 mt-1 truncate">
            {selectedProject.forecastEndDate}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Target: {selectedProject.targetEndDate}</span>
          </div>
        </div>
      </div>

      {/* Health Trend Recharts Graph */}
      <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Health Index Trajectory vs Target Expectation (Past 6 Sprints)
          </span>
          <div className="flex items-center space-x-3 text-[11px]">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span className="text-slate-600">Calculated Health</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-0.5 bg-slate-400" />
              <span className="text-slate-500">Benchmark Baseline</span>
            </div>
          </div>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#healthGrad)" />
              <Area type="monotone" dataKey="expected" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1.5} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
