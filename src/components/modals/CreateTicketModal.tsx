import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Tag, User, Calendar, ShieldAlert } from 'lucide-react';
import { Priority } from '../../types';

export const CreateTicketModal: React.FC = () => {
  const { modalOpen, closeModal, addTicket, teamMembers, risks, tasks, selectedProjectId } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('high');
  const [ownerId, setOwnerId] = useState(teamMembers[0]?.id || '');
  const [dueDate, setDueDate] = useState('2026-09-20');
  const [linkedRiskId, setLinkedRiskId] = useState('');
  const [linkedTaskId, setLinkedTaskId] = useState('');

  if (modalOpen !== 'create-ticket') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const owner = teamMembers.find((m) => m.id === ownerId) || teamMembers[0];
    const risk = risks.find((r) => r.id === linkedRiskId);
    const task = tasks.find((t) => t.id === linkedTaskId);

    addTicket({
      projectId: selectedProjectId,
      title: title.trim(),
      description: description.trim() || 'Remediation task created to mitigate project risk.',
      status: 'open',
      priority,
      ownerId: owner.id,
      ownerName: owner.name,
      ownerAvatar: owner.avatar,
      dueDate,
      linkedRiskId: risk ? risk.id : undefined,
      linkedRiskTitle: risk ? risk.title : undefined,
      linkedTaskId: task ? task.id : undefined,
      linkedTaskTitle: task ? task.title : undefined,
    });

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Tag className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-base">Create Risk Mitigation Ticket</h3>
          </div>
          <button onClick={closeModal} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Ticket Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Backport Envoy wasm filter fix to canary nodes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Action Description &amp; Verification Steps</label>
            <textarea
              rows={3}
              placeholder="Detail required engineering interventions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Owner</label>
              <select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white text-slate-900"
              >
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role.slice(0, 18)}...)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white text-slate-900"
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
              <label className="block font-semibold text-slate-700 mb-1">Link to Active Risk</label>
              <select
                value={linkedRiskId}
                onChange={(e) => setLinkedRiskId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white text-slate-900"
              >
                <option value="">-- None / General --</option>
                {risks.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.id}: {r.title.slice(0, 28)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Link to Task</label>
              <select
                value={linkedTaskId}
                onChange={(e) => setLinkedTaskId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white text-slate-900"
              >
                <option value="">-- None / General --</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id}: {t.title.slice(0, 28)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Resolution Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
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
              Dispatch Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
