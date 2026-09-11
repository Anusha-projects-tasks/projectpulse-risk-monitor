import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Calendar,
  Settings,
  Plus,
  ChevronDown,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FolderKanban,
  CheckSquare,
  Tag,
  UserCheck,
  Menu,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    notifications,
    unreadNotifsCount,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentPage,
    openModal,
    sidebarCollapsed,
    setSidebarCollapsed,
  } = useApp();

  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const projRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (projRef.current && !projRef.current.contains(e.target as Node)) {
        setProjectMenuOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setDateMenuOpen(false);
      }
      if (actionRef.current && !actionRef.current.contains(e.target as Node)) {
        setQuickActionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dateOptions = [
    'Current Sprint (Q3 W2)',
    'Sprint Q3 W1 (Historic)',
    'Next Sprint (Q3 W3 Target)',
    'Full Quarter (Q3 2026)',
    'Year-to-Date 2026',
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between gap-3 shadow-2xs">
      {/* Left side: Mobile Toggle & Project Selector */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Project Selector Dropdown */}
        <div className="relative" ref={projRef}>
          <button
            onClick={() => setProjectMenuOpen((prev) => !prev)}
            className="flex items-center space-x-2.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 transition"
            id="project-selector-btn"
          >
            <FolderKanban className="w-4 h-4 text-indigo-600" />
            <span className="max-w-[140px] sm:max-w-[200px] truncate">{selectedProject?.name}</span>
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                selectedProject?.status === 'critical'
                  ? 'bg-rose-500'
                  : selectedProject?.status === 'at_risk'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {projectMenuOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Switch Active Project
              </div>
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedProjectId(p.id);
                    setProjectMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                    p.id === selectedProjectId ? 'bg-indigo-50/70 font-semibold text-indigo-900' : 'text-slate-700'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="font-mono text-[10px] text-slate-400 mr-1.5">{p.code}</span>
                    <span className="truncate">{p.name}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <span className="text-[11px] font-mono text-slate-500">{p.healthScore}h</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        p.status === 'critical'
                          ? 'bg-rose-500'
                          : p.status === 'at_risk'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                </button>
              ))}
              <div className="border-t border-slate-100 px-3 pt-2 pb-1">
                <button
                  onClick={() => {
                    setProjectMenuOpen(false);
                    setCurrentPage('projects');
                  }}
                  className="text-xs text-indigo-600 font-semibold hover:text-indigo-800"
                >
                  Manage all projects &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Date Range Selector Dropdown */}
        <div className="relative hidden lg:block" ref={dateRef}>
          <button
            onClick={() => setDateMenuOpen((prev) => !prev)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{dateRange}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {dateMenuOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
              {dateOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setDateRange(opt);
                    setDateMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 transition ${
                    dateRange === opt ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-slate-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md mx-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Global search tasks, risks, tickets, engineers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
            id="global-search-input"
          />
        </div>
      </div>

      {/* Right side: Quick Action, Notifications, Settings, Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Quick Action Button */}
        <div className="relative" ref={actionRef}>
          <button
            onClick={() => setQuickActionOpen((prev) => !prev)}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition"
            id="quick-action-btn"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Action</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {quickActionOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
              <button
                onClick={() => {
                  setQuickActionOpen(false);
                  openModal('create-task');
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2"
              >
                <CheckSquare className="w-4 h-4 text-indigo-600" />
                <span>Create New Task</span>
              </button>
              <button
                onClick={() => {
                  setQuickActionOpen(false);
                  openModal('create-risk');
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2"
              >
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Register Risk Item</span>
              </button>
              <button
                onClick={() => {
                  setQuickActionOpen(false);
                  openModal('create-ticket');
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2"
              >
                <Tag className="w-4 h-4 text-blue-600" />
                <span>Open Risk Ticket</span>
              </button>
              <button
                onClick={() => {
                  setQuickActionOpen(false);
                  openModal('create-leave');
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2"
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Submit Leave &amp; Handover</span>
              </button>
            </div>
          )}
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifDropdownOpen((prev) => !prev)}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            id="header-notifs-bell"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Notifications</h4>
                  <p className="text-[10px] text-slate-500">{unreadNotifsCount} unread alerts</p>
                </div>
                {unreadNotifsCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      setCurrentPage(n.targetPage);
                      setNotifDropdownOpen(false);
                    }}
                    className={`p-3 hover:bg-slate-50 cursor-pointer transition flex items-start space-x-2.5 ${
                      !n.isRead ? 'bg-indigo-50/40' : 'bg-white'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {n.category === 'risk' ? (
                        <ShieldAlert className="w-4 h-4 text-rose-500" />
                      ) : n.category === 'task' ? (
                        <CheckSquare className="w-4 h-4 text-amber-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-indigo-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 truncate">{n.title}</div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{n.description}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                <button
                  onClick={() => {
                    setCurrentPage('notifications');
                    setNotifDropdownOpen(false);
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  View all notifications &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings Icon */}
        <button
          onClick={() => setCurrentPage('settings')}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
          title="Platform Settings"
          id="header-settings-btn"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Profile */}
        <div
          onClick={() => setCurrentPage('team')}
          className="flex items-center space-x-2 pl-2 border-l border-slate-200 cursor-pointer group"
          id="user-profile-header"
        >
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Current User"
              className="w-8 h-8 rounded-full object-cover border border-slate-300 group-hover:ring-2 group-hover:ring-indigo-500 transition"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-tight">Sarah Jenkins</div>
            <div className="text-[10px] text-slate-400 font-medium">Engineering Lead</div>
          </div>
        </div>
      </div>
    </header>
  );
};
