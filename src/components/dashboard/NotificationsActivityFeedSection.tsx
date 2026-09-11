import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Activity,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  Tag,
  Clock,
} from 'lucide-react';

export const NotificationsActivityFeedSection: React.FC = () => {
  const { notifications, activities, setCurrentPage, markNotificationRead } = useApp();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" id="section-notifications-and-activity">
      {/* SECTION 8: NOTIFICATIONS PREVIEW */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <Bell className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-900">Notifications &amp; Critical Alerts</h2>
          </div>
          <button
            onClick={() => setCurrentPage('notifications')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {notifications.slice(0, 4).map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                setCurrentPage(n.targetPage);
              }}
              className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-start space-x-2.5 ${
                !n.isRead
                  ? 'bg-rose-50/30 border-rose-200 hover:bg-rose-50/50'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {n.category === 'risk' ? (
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                ) : n.category === 'leave' ? (
                  <UserCheck className="w-4 h-4 text-amber-600" />
                ) : (
                  <Activity className="w-4 h-4 text-indigo-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 truncate">{n.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                    {n.timestamp}
                  </span>
                </div>
                <p className="text-slate-600 mt-1 leading-snug">{n.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 9: RECENT ACTIVITY FEED */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Activity className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-900">Audit &amp; Activity Log</h2>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Immutable Telemetry</span>
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {activities.slice(0, 5).map((act) => (
            <div key={act.id} className="flex items-start space-x-3 text-xs">
              <img
                src={act.userAvatar}
                alt={act.userName}
                className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0 border-b border-slate-100 pb-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate">{act.userName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{act.timestamp}</span>
                </div>
                <p className="text-slate-600 mt-0.5">{act.action}</p>
                <span className="inline-block mt-1 font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                  {act.targetType}: {act.targetId}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
