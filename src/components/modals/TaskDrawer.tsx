import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  Send,
  Link,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { getRiskSeverity } from '../../utils/riskScoring';

export const TaskDrawer: React.FC = () => {
  const {
    tasks,
    activeTaskDrawerId,
    setActiveTaskDrawerId,
    updateTask,
    addTaskComment,
    teamMembers,
    setActiveBreakdownRisk,
    risks,
    setCurrentPage,
  } = useApp();

  const [commentText, setCommentText] = useState('');

  if (!activeTaskDrawerId) return null;

  const task = tasks.find((t) => t.id === activeTaskDrawerId);
  if (!task) return null;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTask(task.id, { status: e.target.value as any });
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const member = teamMembers.find((m) => m.id === e.target.value);
    if (member) {
      updateTask(task.id, {
        assigneeId: member.id,
        assigneeName: member.name,
        assigneeAvatar: member.avatar,
      });
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10) || 0;
    updateTask(task.id, { actualProgress: Math.min(100, Math.max(0, val)) });
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addTaskComment(task.id, commentText.trim());
    setCommentText('');
  };

  const relatedRisk = risks.find((r) => r.relatedTaskId === task.id);
  const severity = getRiskSeverity(task.riskScore);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 border-l border-slate-200"
        id="task-details-drawer"
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded">
              {task.id}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                task.priority === 'critical'
                  ? 'bg-rose-100 text-rose-700'
                  : task.priority === 'high'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {task.priority} Priority
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTaskDrawerId(null)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200 transition"
              id="close-task-drawer-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">{task.title}</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{task.description}</p>
          </div>

          {/* Quick Risk Alert Banner if high/critical */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
              task.riskScore > 60
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldAlert
                className={`w-6 h-6 shrink-0 ${
                  task.riskScore > 60 ? 'text-rose-600' : 'text-indigo-600'
                }`}
              />
              <div>
                <div className="text-xs font-bold">
                  Task Computed Risk Index: {task.riskScore} / 100 ({severity.toUpperCase()})
                </div>
                <div className="text-[11px] opacity-80 mt-0.5">
                  Schedule Gap: {task.expectedProgress - task.actualProgress}% •{' '}
                  {task.isBlocked ? 'Blocked Dependency Detected' : 'Operational'}
                </div>
              </div>
            </div>

            {relatedRisk && (
              <button
                onClick={() => {
                  setActiveBreakdownRisk(relatedRisk);
                }}
                className="text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 hover:bg-slate-100 transition shrink-0"
              >
                Inspect Score Rule
              </button>
            )}
          </div>

          {/* Status & Assignment Fields */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Current Status
              </label>
              <select
                value={task.status}
                onChange={handleStatusChange}
                className="w-full bg-white border border-slate-300 rounded-lg text-xs font-medium px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="blocked">Blocked</option>
                <option value="overdue">Overdue</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Assigned Owner
              </label>
              <select
                value={task.assigneeId}
                onChange={handleAssigneeChange}
                className="w-full bg-white border border-slate-300 rounded-lg text-xs font-medium px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500"
              >
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role.slice(0, 20)}...)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Start & Due Dates
              </label>
              <div className="text-xs text-slate-700 font-medium py-1">
                {task.startDate} <span className="text-slate-400 mx-1">→</span> {task.dueDate}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Logged / Estimated
              </label>
              <div className="text-xs text-slate-700 font-medium py-1">
                <span className="font-bold text-slate-900">{task.loggedHours}h</span> logged of{' '}
                {task.estimatedHours}h est.
              </div>
            </div>
          </div>

          {/* Progress Control */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-700">Actual Completion Progress</span>
              <span className="text-indigo-600 font-bold">{task.actualProgress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={task.actualProgress}
              onChange={handleProgressChange}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Expected: {task.expectedProgress}%</span>
              <span
                className={
                  task.actualProgress < task.expectedProgress
                    ? 'text-rose-600 font-semibold'
                    : 'text-emerald-600'
                }
              >
                Variance: {task.actualProgress - task.expectedProgress}%
              </span>
            </div>
          </div>

          {/* Blocked Reason if applicable */}
          {task.isBlocked && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Dependency Blocker:</strong>
                {task.blockedReason || 'Work is currently stalled awaiting prerequisite verification.'}
              </div>
            </div>
          )}

          {/* Comments & Discussion */}
          <div className="border-t border-slate-200 pt-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Activity & Comments ({task.comments.length})
            </h3>

            <div className="space-y-3">
              {task.comments.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No notes logged yet on this task.</p>
              ) : (
                task.comments.map((c) => (
                  <div key={c.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <img
                          src={c.authorAvatar}
                          alt={c.authorName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-semibold text-slate-800">{c.authorName}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{c.timestamp}</span>
                    </div>
                    <p className="text-slate-600 mt-1">{c.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleSendComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Post a comment or technical update..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              setCurrentPage('communication');
              setActiveTaskDrawerId(null);
            }}
            className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
          >
            <span>Open in Communication Room</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTaskDrawerId(null)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
