import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  ShieldAlert,
  Sparkles,
  Tag,
  MessageSquare,
  CalendarCheck,
  Bell,
  BarChart3,
  CheckCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
} from 'lucide-react';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  badge?: number;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    sidebarCollapsed,
    setSidebarCollapsed,
    unreadNotifsCount,
    risks,
    tickets,
    messages,
    leaveRequests,
  } = useApp();

  const activeCriticalRisks = risks.filter(
    (r) => (r.severity === 'critical' || r.severity === 'high') && r.status !== 'resolved'
  ).length;
  const openTickets = tickets.filter((t) => t.status === 'open' || t.status === 'assigned').length;
  const unreadMessages = messages.filter((m) => !m.isRead).length;
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'pending_review').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'team', label: 'Resources / Team', icon: Users },
    {
      id: 'risk-monitor',
      label: 'Risk Monitor',
      icon: ShieldAlert,
      badge: activeCriticalRisks > 0 ? activeCriticalRisks : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'ai-insights', label: 'AI Insights', icon: Sparkles },
    {
      id: 'risk-tickets',
      label: 'Risk Tickets',
      icon: Tag,
      badge: openTickets > 0 ? openTickets : undefined,
      badgeColor: 'bg-indigo-600 text-white',
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: MessageSquare,
      badge: unreadMessages > 0 ? unreadMessages : undefined,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'leave-handover',
      label: 'Leave & Handover',
      icon: CalendarCheck,
      badge: pendingLeaves > 0 ? pendingLeaves : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'impact-verification', label: 'Impact Verification', icon: CheckCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-slate-950 text-slate-300 border-r border-slate-800/80 transition-all duration-300 flex flex-col ${
        sidebarCollapsed ? 'w-18' : 'w-64'
      }`}
      id="main-app-sidebar"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950/60">
        <div
          onClick={() => setCurrentPage('dashboard')}
          className="flex items-center space-x-3 cursor-pointer overflow-hidden"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/30 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          {!sidebarCollapsed && (
            <div className="truncate">
              <span className="font-black text-sm tracking-wider text-white block uppercase leading-tight">
                ProjectPulse
              </span>
              <span className="text-[10px] tracking-widest text-indigo-400 font-semibold uppercase block">
                Risk &amp; Productivity
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition shrink-0 hidden md:block"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
        {!sidebarCollapsed && (
          <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Enterprise Navigation
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center rounded-lg text-xs font-medium transition-all group relative ${
                sidebarCollapsed ? 'justify-center p-2.5 my-1' : 'px-3 py-2.5 space-x-3'
              } ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs shadow-indigo-900/40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/90'
              }`}
              id={`nav-${item.id}`}
            >
              <Icon
                className={`shrink-0 transition ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                } ${sidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4'}`}
              />

              {!sidebarCollapsed && (
                <span className="flex-1 text-left truncate tracking-tight">{item.label}</span>
              )}

              {!sidebarCollapsed && item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                    item.badgeColor || 'bg-slate-700 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {sidebarCollapsed && item.badge !== undefined && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Status Footer */}
      {!sidebarCollapsed && (
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/70">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-medium">Engine Mode</span>
              <span className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Monitoring
              </span>
            </div>
            <div className="text-[11px] text-slate-400 leading-tight">
              Rule-based Risk Scoring &amp; AI Telemetry Active
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
