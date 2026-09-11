import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Trash2,
  ArrowRight,
  User,
} from 'lucide-react';
import { TaskStatus, Priority } from '../types';

export const TasksPage: React.FC = () => {
  const {
    tasks,
    selectedProjectId,
    selectedProject,
    setActiveTaskDrawerId,
    openModal,
    deleteTask,
    updateTaskProgress,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>('');

  const projTasks = tasks.filter((t) => t.projectId === selectedProjectId);

  const filteredTasks = projTasks.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (
      localSearch.trim() &&
      !t.title.toLowerCase().includes(localSearch.toLowerCase()) &&
      !t.description.toLowerCase().includes(localSearch.toLowerCase()) &&
      !t.assigneeName.toLowerCase().includes(localSearch.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const total = projTasks.length;
  const inProgress = projTasks.filter((t) => t.status === 'in_progress').length;
  const blocked = projTasks.filter((t) => t.status === 'blocked').length;
  const overdue = projTasks.filter((t) => t.status === 'overdue').length;
  const completed = projTasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="space-y-6 pb-12" id="page-tasks">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Task Portfolio &amp; Critical Path Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold font-mono">
              {projTasks.length} Deliverables
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sprint work packages with continuous velocity audits, dependency mapping, and automated risk propagation.
          </p>
        </div>

        <button
          onClick={() => openModal('create-task')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs flex items-center space-x-2 shadow-xs transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project Task</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-3 rounded-xl border text-left transition ${
            statusFilter === 'all'
              ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase block">All Tasks</span>
          <span className="text-2xl font-black text-slate-900">{total}</span>
        </button>

        <button
          onClick={() => setStatusFilter('in_progress')}
          className={`p-3 rounded-xl border text-left transition ${
            statusFilter === 'in_progress'
              ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/20'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-[11px] font-bold text-blue-700 uppercase block">In Progress</span>
          <span className="text-2xl font-black text-blue-950">{inProgress}</span>
        </button>

        <button
          onClick={() => setStatusFilter('blocked')}
          className={`p-3 rounded-xl border text-left transition ${
            statusFilter === 'blocked'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-[11px] font-bold text-amber-700 uppercase block">Blocked</span>
          <span className="text-2xl font-black text-amber-950">{blocked}</span>
        </button>

        <button
          onClick={() => setStatusFilter('overdue')}
          className={`p-3 rounded-xl border text-left transition ${
            statusFilter === 'overdue'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-[11px] font-bold text-rose-700 uppercase block">Overdue</span>
          <span className="text-2xl font-black text-rose-950">{overdue}</span>
        </button>

        <button
          onClick={() => setStatusFilter('completed')}
          className={`p-3 rounded-xl border text-left transition ${
            statusFilter === 'completed'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-[11px] font-bold text-emerald-700 uppercase block">Completed</span>
          <span className="text-2xl font-black text-emerald-950">{completed}</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search task title, owner, or description..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="flex items-center space-x-1 text-xs">
            <span className="text-slate-500 font-medium">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-2 py-1 text-xs bg-slate-50 text-slate-700"
            >
              <option value="all">All</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Task ID</th>
                <th className="py-3 px-4">Task Title &amp; Details</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4">Progress (Actual / Expected)</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((t) => {
                const isGapHigh = t.expectedProgress - t.actualProgress >= 20;

                return (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/80 transition cursor-pointer group"
                    onClick={() => setActiveTaskDrawerId(t.id)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700 shrink-0">
                      {t.id}
                    </td>

                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {t.title}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{t.description}</p>
                      {t.isBlocked && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded mt-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Blocked: {t.blockedReason}</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          t.priority === 'critical'
                            ? 'bg-rose-100 text-rose-700'
                            : t.priority === 'high'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <img
                          src={t.assigneeAvatar}
                          alt={t.assigneeName}
                          className="w-6 h-6 rounded-full object-cover border border-slate-200"
                        />
                        <span className="font-semibold text-slate-800 truncate max-w-[120px]">
                          {t.assigneeName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 w-44" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                        <span className="font-bold text-slate-900">{t.actualProgress}%</span>
                        <span className="text-slate-400">Target: {t.expectedProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden flex">
                        <div
                          className={`h-1.5 ${isGapHigh ? 'bg-amber-500' : 'bg-indigo-600'}`}
                          style={{ width: `${t.actualProgress}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px] whitespace-nowrap">
                      {t.dueDate}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          t.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.status === 'blocked'
                            ? 'bg-rose-100 text-rose-800'
                            : t.status === 'overdue'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td
                      className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setActiveTaskDrawerId(t.id)}
                        className="px-2 py-1 text-indigo-600 hover:bg-indigo-50 rounded font-semibold text-xs transition"
                      >
                        Edit / Drawer
                      </button>
                      <button
                        onClick={() => deleteTask(t.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
