import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckSquare, Calendar, User, Clock, AlertTriangle } from 'lucide-react';
import { Priority, TaskStatus } from '../../types';

export const CreateTaskModal: React.FC = () => {
  const { modalOpen, closeModal, addTask, teamMembers, selectedProjectId, tasks } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('high');
  const [assigneeId, setAssigneeId] = useState(teamMembers[0]?.id || '');
  const [dueDate, setDueDate] = useState('2026-09-25');
  const [startDate, setStartDate] = useState('2026-09-12');
  const [estimatedHours, setEstimatedHours] = useState(35);
  const [expectedProgress, setExpectedProgress] = useState(25);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedReason, setBlockedReason] = useState('');

  if (modalOpen !== 'create-task') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignee = teamMembers.find((m) => m.id === assigneeId) || teamMembers[0];

    addTask({
      projectId: selectedProjectId,
      title: title.trim(),
      description: description.trim() || 'No detailed description provided.',
      status: isBlocked ? 'blocked' : 'in_progress',
      priority,
      assigneeId: assignee.id,
      assigneeName: assignee.name,
      assigneeAvatar: assignee.avatar,
      expectedProgress,
      actualProgress: 0,
      startDate,
      dueDate,
      estimatedHours,
      loggedHours: 0,
      dependencies: [],
      isBlocked,
      blockedReason: isBlocked ? blockedReason : undefined,
    });

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <CheckSquare className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-base">Create New Project Task</h3>
          </div>
          <button onClick={closeModal} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Istio Service Mesh Ingress Proxy Gateway"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description & Acceptance Scope</label>
            <textarea
              rows={3}
              placeholder="Define task deliverables and technical boundaries..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assignee</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500"
              >
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.currentWorkloadHours}h / {m.capacityHours}h)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Estimated Hours</label>
              <input
                type="number"
                min="1"
                max="200"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(parseInt(e.target.value, 10) || 10)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Expected % by Due Date</label>
              <input
                type="number"
                min="1"
                max="100"
                value={expectedProgress}
                onChange={(e) => setExpectedProgress(parseInt(e.target.value, 10) || 100)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBlocked}
                onChange={(e) => setIsBlocked(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
              />
              <span className="font-semibold text-slate-700">Flag as Currently Blocked by Dependency</span>
            </label>

            {isBlocked && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Reason for block (e.g. Awaiting AWS SecOps approval)"
                  value={blockedReason}
                  onChange={(e) => setBlockedReason(e.target.value)}
                  className="w-full border border-rose-300 bg-rose-50/40 rounded-lg p-2 text-xs text-rose-900 focus:ring-2 focus:ring-rose-500"
                />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition shadow-xs"
            >
              Add Task &amp; Recalculate Risk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
