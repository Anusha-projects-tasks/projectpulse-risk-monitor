import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  Clock,
  AlertOctagon,
  Calendar,
  Flag,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const ProjectProgressSection: React.FC = () => {
  const { tasks, selectedProjectId, setCurrentPage, setActiveTaskDrawerId } = useApp();

  const projTasks = tasks.filter((t) => t.projectId === selectedProjectId);

  const completed = projTasks.filter((t) => t.status === 'completed');
  const inProgress = projTasks.filter((t) => t.status === 'in_progress');
  const blocked = projTasks.filter((t) => t.status === 'blocked');
  const overdue = projTasks.filter((t) => t.status === 'overdue');

  // Comparison data for tasks
  const chartData = projTasks.slice(0, 6).map((t) => ({
    name: t.id,
    Actual: t.actualProgress,
    Expected: t.expectedProgress,
    title: t.title,
  }));

  // Priority distribution counts
  const criticalCount = projTasks.filter((t) => t.priority === 'critical').length;
  const highCount = projTasks.filter((t) => t.priority === 'high').length;
  const mediumCount = projTasks.filter((t) => t.priority === 'medium').length;
  const lowCount = projTasks.filter((t) => t.priority === 'low').length;

  // Milestone timeline
  const milestones = [
    { name: 'M1: Architecture Blueprint & SecOps Approval', date: 'Aug 15, 2026', status: 'completed' },
    { name: 'M2: Multi-Region Database Sharding & Peering', date: 'Sep 14, 2026', status: 'at_risk' },
    { name: 'M3: Istio Mesh mTLS Ingress Gateway Cutover', date: 'Sep 25, 2026', status: 'delayed' },
    { name: 'M4: Tenant Migration Self-Service Alpha Launch', date: 'Oct 15, 2026', status: 'upcoming' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-5" id="section-project-progress">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <CheckSquare className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900">Project Progress &amp; Milestone Velocity</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Deliverable completion ratios, milestone gating progress, and upcoming sprint deadlines.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('tasks')}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
        >
          <span>View All Tasks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Task Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-3">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            Completed Tasks
          </span>
          <div className="text-2xl font-black text-emerald-950 mt-1">{completed.length}</div>
          <span className="text-[11px] text-emerald-700">Verified by QA</span>
        </div>

        <div className="bg-blue-50/50 border border-blue-200/80 rounded-xl p-3">
          <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
            In Progress
          </span>
          <div className="text-2xl font-black text-blue-950 mt-1">{inProgress.length}</div>
          <span className="text-[11px] text-blue-700">Actively being coded</span>
        </div>

        <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-3">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
            Blocked Tasks
          </span>
          <div className="text-2xl font-black text-amber-950 mt-1">{blocked.length}</div>
          <span className="text-[11px] text-amber-700">Awaiting external dependency</span>
        </div>

        <div className="bg-rose-50/50 border border-rose-200/80 rounded-xl p-3">
          <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
            Overdue Tasks
          </span>
          <div className="text-2xl font-black text-rose-950 mt-1">{overdue.length}</div>
          <span className="text-[11px] text-rose-700">Past target date</span>
        </div>
      </div>

      {/* Main Charts & Milestones Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Expected vs Actual Recharts BarChart */}
        <div className="lg:col-span-7 border border-slate-200 rounded-xl p-4 bg-slate-50/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Task Velocity: Actual % vs Expected %
            </span>
            <span className="text-[11px] text-slate-500">Key Active Tasks</span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Actual" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expected" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Milestone Timeline & Priority Distribution */}
        <div className="lg:col-span-5 space-y-4">
          {/* Milestone Timeline */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/30">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
              Project Milestone Timeline
            </span>

            <div className="space-y-3">
              {milestones.map((m, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 text-xs">
                  <div className="mt-0.5 shrink-0">
                    {m.status === 'completed' ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">
                        ✓
                      </span>
                    ) : m.status === 'at_risk' ? (
                      <span className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-white text-[10px] font-bold">
                        !
                      </span>
                    ) : m.status === 'delayed' ? (
                      <span className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-white text-[10px] font-bold">
                        ✕
                      </span>
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-400 bg-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800 leading-tight truncate">{m.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
                      <span>{m.date}</span>
                      <span
                        className={`text-[10px] font-bold uppercase ${
                          m.status === 'completed'
                            ? 'text-emerald-700'
                            : m.status === 'at_risk'
                            ? 'text-amber-700'
                            : m.status === 'delayed'
                            ? 'text-rose-700'
                            : 'text-slate-500'
                        }`}
                      >
                        {m.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/30">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Task Priority Distribution
            </span>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-1.5 bg-rose-50 rounded border border-rose-200">
                <span className="font-bold text-rose-700 block">{criticalCount}</span>
                <span className="text-[10px] text-rose-600">Critical</span>
              </div>
              <div className="p-1.5 bg-amber-50 rounded border border-amber-200">
                <span className="font-bold text-amber-700 block">{highCount}</span>
                <span className="text-[10px] text-amber-600">High</span>
              </div>
              <div className="p-1.5 bg-blue-50 rounded border border-blue-200">
                <span className="font-bold text-blue-700 block">{mediumCount}</span>
                <span className="text-[10px] text-blue-600">Medium</span>
              </div>
              <div className="p-1.5 bg-slate-100 rounded border border-slate-200">
                <span className="font-bold text-slate-700 block">{lowCount}</span>
                <span className="text-[10px] text-slate-500">Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
