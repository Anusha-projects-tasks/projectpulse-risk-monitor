import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  ShieldAlert,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Users,
  Calendar,
  Tag,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from 'lucide-react';
import { PageId } from '../../types';

export const TopSummaryCards: React.FC = () => {
  const {
    tasks,
    risks,
    tickets,
    teamMembers,
    calculatedHealthScore,
    selectedProjectId,
    selectedProject,
    setCurrentPage,
    setActiveBreakdownRisk,
  } = useApp();

  // Project-filtered metrics
  const projTasks = tasks.filter((t) => t.projectId === selectedProjectId);
  const projRisks = risks.filter((r) => r.projectId === selectedProjectId && r.status !== 'resolved');

  const totalTasks = projTasks.length;
  const completedTasks = projTasks.filter((t) => t.status === 'completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const overdueTasks = projTasks.filter((t) => t.status === 'overdue' || t.status === 'blocked').length;
  const activeRisksCount = projRisks.length;
  const criticalRisksCount = projRisks.filter((r) => r.severity === 'critical' || r.severity === 'high').length;

  const totalCapacity = teamMembers.reduce((acc, m) => acc + m.capacityHours, 0);
  const totalWorkload = teamMembers.reduce((acc, m) => acc + m.currentWorkloadHours, 0);
  const workloadRate = totalCapacity > 0 ? Math.round((totalWorkload / totalCapacity) * 100) : 100;

  // Upcoming deadlines in next 7 days
  const now = new Date('2026-09-11T00:00:00Z').getTime();
  const upcomingDeadlines = projTasks.filter((t) => {
    if (t.status === 'completed') return false;
    const due = new Date(t.dueDate).getTime();
    const diff = (due - now) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 14;
  }).length;

  const openTicketsCount = tickets.filter(
    (t) => t.projectId === selectedProjectId && (t.status === 'open' || t.status === 'assigned' || t.status === 'in_progress')
  ).length;

  const cards: {
    id: string;
    title: string;
    value: string | number;
    sublabel: string;
    trend: string;
    trendType: 'up' | 'down' | 'neutral';
    statusColor: string;
    icon: React.ElementType;
    targetPage: PageId;
    action?: () => void;
  }[] = [
    {
      id: 'health-card',
      title: 'Project Health Index',
      value: `${calculatedHealthScore}/100`,
      sublabel: calculatedHealthScore >= 80 ? 'Healthy' : calculatedHealthScore >= 60 ? 'At Risk' : 'Critical',
      trend: '+3.4 pts vs last sprint',
      trendType: calculatedHealthScore >= 70 ? 'up' : 'down',
      statusColor:
        calculatedHealthScore >= 80
          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
          : calculatedHealthScore >= 60
          ? 'text-amber-700 bg-amber-50 border-amber-200'
          : 'text-rose-700 bg-rose-50 border-rose-200',
      icon: Activity,
      targetPage: 'dashboard',
    },
    {
      id: 'active-risks-card',
      title: 'Active Project Risks',
      value: activeRisksCount,
      sublabel: `${projRisks.filter((r) => r.status === 'escalated').length} escalated to lead`,
      trend: '+1 new identified',
      trendType: 'down',
      statusColor: 'text-amber-700 bg-amber-50 border-amber-200',
      icon: ShieldAlert,
      targetPage: 'risk-monitor',
    },
    {
      id: 'critical-risks-card',
      title: 'Critical Risk Items',
      value: criticalRisksCount,
      sublabel: 'Require immediate triage',
      trend: '2 pending mitigation',
      trendType: 'down',
      statusColor: 'text-rose-700 bg-rose-50 border-rose-200',
      icon: AlertOctagon,
      targetPage: 'risk-monitor',
    },
    {
      id: 'completion-card',
      title: 'Task Completion Rate',
      value: `${completionRate}%`,
      sublabel: `${completedTasks} of ${totalTasks} tasks closed`,
      trend: '+12% velocity',
      trendType: 'up',
      statusColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      icon: CheckCircle2,
      targetPage: 'tasks',
    },
    {
      id: 'delayed-tasks-card',
      title: 'Delayed & Blocked Tasks',
      value: overdueTasks,
      sublabel: 'Impacting critical path',
      trend: '-1 vs yesterday',
      trendType: 'up',
      statusColor: overdueTasks > 0 ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-slate-700 bg-slate-50 border-slate-200',
      icon: Clock,
      targetPage: 'tasks',
    },
    {
      id: 'workload-card',
      title: 'Team Capacity Workload',
      value: `${workloadRate}%`,
      sublabel: `${teamMembers.filter((m) => m.availabilityStatus === 'overloaded').length} engineers overloaded`,
      trend: '8 hrs above target',
      trendType: 'down',
      statusColor: workloadRate > 105 ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-blue-700 bg-blue-50 border-blue-200',
      icon: Users,
      targetPage: 'team',
    },
    {
      id: 'deadlines-card',
      title: 'Upcoming Deadlines',
      value: upcomingDeadlines,
      sublabel: 'Due within next 14 days',
      trend: 'Next: Sep 14 (Aurora)',
      trendType: 'neutral',
      statusColor: 'text-purple-700 bg-purple-50 border-purple-200',
      icon: Calendar,
      targetPage: 'tasks',
    },
    {
      id: 'tickets-card',
      title: 'Open Risk Tickets',
      value: openTicketsCount,
      sublabel: 'Active mitigation queue',
      trend: '1 resolved this sprint',
      trendType: 'up',
      statusColor: 'text-blue-700 bg-blue-50 border-blue-200',
      icon: Tag,
      targetPage: 'risk-tickets',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5" id="dashboard-top-summary-cards">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            onClick={() => {
              if (c.action) c.action();
              else setCurrentPage(c.targetPage);
            }}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-md hover:border-indigo-300 transition cursor-pointer group flex flex-col justify-between"
            id={`card-${c.id}`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  {c.title}
                </span>
                <div className="text-2xl font-black text-slate-900 tracking-tight">{c.value}</div>
              </div>
              <div className={`p-2.5 rounded-xl border ${c.statusColor} transition group-hover:scale-105`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium truncate max-w-[150px]">{c.sublabel}</span>
              <div className="flex items-center space-x-1 text-[11px] font-semibold text-slate-500 shrink-0">
                {c.trendType === 'up' ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                ) : c.trendType === 'down' ? (
                  <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                ) : null}
                <span
                  className={
                    c.trendType === 'up'
                      ? 'text-emerald-700'
                      : c.trendType === 'down'
                      ? 'text-rose-700'
                      : 'text-slate-500'
                  }
                >
                  {c.trend}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
