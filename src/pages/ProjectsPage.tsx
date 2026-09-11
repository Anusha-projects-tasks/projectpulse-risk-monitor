import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderKanban,
  Plus,
  Activity,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    setCurrentPage,
    addProject,
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTargetDate, setNewTargetDate] = useState('2026-11-30');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addProject({
      name: newTitle.trim(),
      code: newCode.trim() || 'PROJ-NEW',
      description: newDesc.trim() || 'Enterprise workload modernization program.',
      healthScore: 85,
      status: 'healthy',
      actualProgress: 10,
      expectedProgress: 15,
      targetEndDate: newTargetDate,
      forecastEndDate: newTargetDate,
      totalTasks: 5,
      completedTasks: 0,
      activeRisks: 1,
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewCode('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6 pb-12" id="page-projects">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Enterprise Project Portfolios
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              {projects.length} Portfolios
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Global monitoring across core cloud migrations, payment gateways, and security compliance initiatives.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs flex items-center space-x-2 shadow-xs transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Project Initiative</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((p) => {
          const isSelected = p.id === selectedProjectId;
          const statusColor =
            p.status === 'healthy'
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : p.status === 'at_risk'
              ? 'text-amber-700 bg-amber-50 border-amber-200'
              : 'text-rose-700 bg-rose-50 border-rose-200';

          return (
            <div
              key={p.id}
              onClick={() => {
                setSelectedProjectId(p.id);
                setCurrentPage('dashboard');
              }}
              className={`bg-white rounded-xl border p-5 transition cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-md ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {p.code}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${statusColor}`}>
                    {p.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{p.name}</h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{p.description}</p>

                {/* Score & Progress */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Health Index:</span>
                    <span className="font-black text-slate-900 font-mono text-sm">
                      {p.healthScore} / 100
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span>Actual: {p.actualProgress}%</span>
                      <span>Target: {p.expectedProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                      <div className="bg-indigo-600 h-2" style={{ width: `${p.actualProgress}%` }} />
                      <div
                        className="bg-slate-300 h-2"
                        style={{ width: `${Math.max(0, p.expectedProgress - p.actualProgress)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Target: {p.targetEndDate}</span>
                <span className="font-semibold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition">
                  {isSelected ? 'Active Cockpit' : 'Switch Project'} &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">Add New Project Portfolio</h3>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FedRAMP High Compliance Certification"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Portfolio Code</label>
                  <input
                    type="text"
                    placeholder="e.g. SEC-801"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target End Date</label>
                  <input
                    type="date"
                    value={newTargetDate}
                    onChange={(e) => setNewTargetDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold shadow-xs"
                >
                  Create Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
