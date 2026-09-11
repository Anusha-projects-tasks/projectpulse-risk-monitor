import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCircle2,
  ShieldAlert,
  Clock,
  UserCheck,
  CheckSquare,
  AlertTriangle,
  Filter,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentPage,
    unreadNotifsCount,
  } = useApp();

  const [filterCat, setFilterCat] = useState<string>('all');
  const [onlyUnread, setOnlyUnread] = useState(false);

  const filtered = notifications.filter((n) => {
    if (onlyUnread && n.isRead) return false;
    if (filterCat !== 'all' && n.category !== filterCat) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12" id="page-notifications">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Enterprise Alert Stream &amp; Notifications
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {unreadNotifsCount} Action Items
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time critical events, deadline proximity warnings, workload overload triggers, and handover requests.
          </p>
        </div>

        {unreadNotifsCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs flex items-center space-x-2 shadow-xs transition shrink-0"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark All as Acknowledged</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterCat('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filterCat === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Alerts
          </button>
          <button
            onClick={() => setFilterCat('risk')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filterCat === 'risk' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Risk Triggers
          </button>
          <button
            onClick={() => setFilterCat('task')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filterCat === 'task' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tasks &amp; Milestones
          </button>
          <button
            onClick={() => setFilterCat('leave')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filterCat === 'leave' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Leave &amp; Staffing
          </button>
        </div>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyUnread}
            onChange={(e) => setOnlyUnread(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
          />
          <span className="font-semibold text-slate-700">Show Unread Only</span>
        </label>
      </div>

      {/* Notifications Feed */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
            No notifications matching your filter criteria.
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                setCurrentPage(n.targetPage);
              }}
              className={`p-4 hover:bg-slate-50 transition cursor-pointer flex items-start space-x-3.5 ${
                !n.isRead ? 'bg-indigo-50/40' : 'bg-white'
              }`}
            >
              <div className="mt-1 shrink-0">
                {n.category === 'risk' ? (
                  <div className="p-2 bg-rose-100 text-rose-700 rounded-lg">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                ) : n.category === 'leave' ? (
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                    <UserCheck className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                  <span className="font-mono text-[10px] text-slate-400 shrink-0">
                    {n.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.description}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-indigo-600 hover:underline">
                    View in {n.targetPage} &rarr;
                  </span>
                  {!n.isRead && (
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-rose-100 text-rose-700">
                      Unacknowledged
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
