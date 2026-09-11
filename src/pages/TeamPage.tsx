import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  CalendarCheck,
  Plus,
  Mail,
  CheckCircle2,
  AlertCircle,
  Tag,
  Clock,
  Sparkles,
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

export const TeamPage: React.FC = () => {
  const { teamMembers, openModal, leaveRequests } = useApp();

  const [selectedDept, setSelectedDept] = useState<string>('all');

  const filteredMembers = teamMembers.filter((m) => {
    if (selectedDept !== 'all' && m.department !== selectedDept) return false;
    return true;
  });

  const chartData = teamMembers.map((m) => ({
    name: m.name.split(' ')[0],
    Workload: m.currentWorkloadHours,
    Capacity: m.capacityHours,
    utilization: Math.round((m.currentWorkloadHours / m.capacityHours) * 100),
  }));

  const overloadedCount = teamMembers.filter((m) => m.availabilityStatus === 'overloaded').length;
  const onLeaveCount = teamMembers.filter((m) => m.availabilityStatus === 'on_leave').length;

  return (
    <div className="space-y-6 pb-12" id="page-team">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Engineering Resources &amp; Capacity Balancer
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              {teamMembers.length} Staff Engineers
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Skill matching engine, sprint commitments, cognitive load balancing, and automated handover orchestration.
          </p>
        </div>

        <button
          onClick={() => openModal('create-leave')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs flex items-center space-x-2 shadow-xs transition shrink-0"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Submit Leave &amp; Handover</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block">Total Roster</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{teamMembers.length}</div>
          <span className="text-[11px] text-slate-500">Distributed across 4 regions</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-bold text-rose-700 uppercase block">Overloaded</span>
          <div className="text-2xl font-black text-rose-900 mt-1">{overloadedCount}</div>
          <span className="text-[11px] text-rose-600">&gt; 105% Weekly Capacity</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-bold text-amber-700 uppercase block">On Leave / Scheduled</span>
          <div className="text-2xl font-black text-amber-900 mt-1">{onLeaveCount}</div>
          <span className="text-[11px] text-amber-600">Handover coverage active</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase block">Average Utilization</span>
          <div className="text-2xl font-black text-emerald-950 mt-1">94%</div>
          <span className="text-[11px] text-emerald-600">Optimal target band</span>
        </div>
      </div>

      {/* Capacity Comparison Graph */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Sprint Capacity vs Committed Workload</h3>
            <p className="text-xs text-slate-500">Comparison of allocated engineering hours against 40h standard threshold.</p>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 60]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
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
              <Bar dataKey="Workload" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Capacity" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((m) => {
          const util = Math.round((m.currentWorkloadHours / m.capacityHours) * 100);
          const isOver = m.availabilityStatus === 'overloaded' || util > 105;
          const isLeave = m.availabilityStatus === 'on_leave';

          return (
            <div
              key={m.id}
              className={`bg-white rounded-xl border p-4.5 space-y-3.5 shadow-2xs transition ${
                isOver
                  ? 'border-rose-200'
                  : isLeave
                  ? 'border-amber-200'
                  : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              {/* Profile Top */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        isOver ? 'bg-rose-500' : isLeave ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>
                    <span className="text-[11px] text-slate-500 block">{m.role}</span>
                    <span className="text-[10px] text-indigo-600 font-medium">{m.department}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    isOver
                      ? 'bg-rose-100 text-rose-700'
                      : isLeave
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {m.availabilityStatus.replace('_', ' ')}
                </span>
              </div>

              {/* Workload Progress */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-500">Utilization:</span>
                  <span className={`font-black ${isOver ? 'text-rose-600' : 'text-slate-900'}`}>
                    {util}% ({m.currentWorkloadHours}h / {m.capacityHours}h)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 ${isOver ? 'bg-rose-500' : isLeave ? 'bg-amber-500' : 'bg-indigo-600'}`}
                    style={{ width: `${Math.min(100, util)}%` }}
                  />
                </div>
              </div>

              {/* Tasks Breakdown */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs py-1 border-y border-slate-100">
                <div className="p-1.5 bg-slate-50 rounded">
                  <span className="font-black text-slate-800 text-sm block">{m.assignedTasksCount}</span>
                  <span className="text-[10px] text-slate-500">Assigned Tasks</span>
                </div>
                <div className="p-1.5 bg-slate-50 rounded">
                  <span className="font-black text-emerald-700 text-sm block">{m.completedTasksCount}</span>
                  <span className="text-[10px] text-slate-500">Completed</span>
                </div>
              </div>

              {/* Skills Tags */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                  Core Competencies &amp; Skills:
                </span>
                <div className="flex flex-wrap gap-1">
                  {m.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
