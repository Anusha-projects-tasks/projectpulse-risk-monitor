import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  AlertCircle,
  Calendar,
  ArrowRight,
  TrendingUp,
  UserCheck,
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

export const TeamWorkloadSection: React.FC = () => {
  const { teamMembers, setCurrentPage, openModal } = useApp();

  const chartData = teamMembers.map((m) => ({
    name: m.name.split(' ')[0],
    Workload: m.currentWorkloadHours,
    Capacity: m.capacityHours,
    utilization: Math.round((m.currentWorkloadHours / m.capacityHours) * 100),
  }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4" id="section-team-workload">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Users className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900">Team Workload &amp; Capacity Balancing</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Resource allocation, sprint commitments, overload warnings, and planned leave coverage.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => openModal('create-leave')}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow-2xs"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Manage Leave</span>
          </button>
          <button
            onClick={() => setCurrentPage('team')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
          >
            <span>Full Roster</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid: Roster & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Team Member Utilization Grid */}
        <div className="lg:col-span-7 space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {teamMembers.map((m) => {
            const utilization = Math.round((m.currentWorkloadHours / m.capacityHours) * 100);
            const isOverloaded = m.availabilityStatus === 'overloaded' || utilization > 105;
            const isOnLeave = m.availabilityStatus === 'on_leave';

            return (
              <div
                key={m.id}
                className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 text-xs ${
                  isOverloaded
                    ? 'bg-rose-50/40 border-rose-200'
                    : isOnLeave
                    ? 'bg-amber-50/40 border-amber-200'
                    : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    {isOverloaded && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 truncate">{m.name}</span>
                      {isOverloaded && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded-full">
                          OVERLOADED
                        </span>
                      )}
                      {isOnLeave && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full">
                          ON LEAVE
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 truncate block">{m.role}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 shrink-0">
                  <div className="text-right">
                    <div className="font-bold text-slate-900">
                      {m.currentWorkloadHours}h{' '}
                      <span className="text-slate-400 font-normal">/ {m.capacityHours}h</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {m.assignedTasksCount} assigned • {m.completedTasksCount} done
                    </div>
                  </div>

                  <div className="w-16 text-right">
                    <span
                      className={`font-black text-xs ${
                        isOverloaded
                          ? 'text-rose-600'
                          : isOnLeave
                          ? 'text-amber-600'
                          : 'text-indigo-600'
                      }`}
                    >
                      {utilization}%
                    </span>
                    <div className="w-16 bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${
                          isOverloaded ? 'bg-rose-500' : isOnLeave ? 'bg-amber-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${Math.min(100, utilization)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Recharts Capacity Comparison BarChart */}
        <div className="lg:col-span-5 border border-slate-200 rounded-xl p-4 bg-slate-50/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Workload vs Standard Capacity (Hours)
            </span>
            <span className="text-[11px] text-slate-500">Weekly Target 40h</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 60]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                <Bar dataKey="Workload" fill="#4f46e5" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Capacity" fill="#94a3b8" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-500 mt-2 border-t border-slate-200/80 pt-2">
            Engineers exceeding 110% capacity trigger automatic +25 risk points on assigned critical path deliverables.
          </p>
        </div>
      </div>
    </div>
  );
};
