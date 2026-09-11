import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { RiskSeverity } from '../../types';
import { calculateRiskScore } from '../../utils/riskScoring';

export const CreateRiskModal: React.FC = () => {
  const { modalOpen, closeModal, addRisk, teamMembers, tasks, selectedProjectId } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Technical' | 'Schedule' | 'Resource' | 'Scope' | 'Dependency' | 'Budget'>('Technical');
  const [severity, setSeverity] = useState<RiskSeverity>('high');
  const [relatedTaskId, setRelatedTaskId] = useState('');
  const [ownerId, setOwnerId] = useState(teamMembers[0]?.id || '');
  const [dueDate, setDueDate] = useState('2026-09-28');
  const [explanation, setExplanation] = useState('');
  const [mitigationPlan, setMitigationPlan] = useState('');

  // Breakdown checkboxes
  const [gapRule, setGapRule] = useState(true);
  const [overloadRule, setOverloadRule] = useState(false);
  const [deadlineRule, setDeadlineRule] = useState(false);
  const [depRule, setDepRule] = useState(false);
  const [unavailRule, setUnavailRule] = useState(false);
  const [commsRule, setCommsRule] = useState(false);
  const [ownerRule, setOwnerRule] = useState(false);

  if (modalOpen !== 'create-risk') return null;

  const currentBreakdown = calculateRiskScore({
    progressGapAbove20: gapRule,
    workloadExceedsCapacity: overloadRule,
    dueWithin2Days: deadlineRule,
    blockedDependency: depRule,
    memberUnavailable: unavailRule,
    communicationDelay: commsRule,
    missingOwner: ownerRule,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const owner = teamMembers.find((m) => m.id === ownerId) || teamMembers[0];
    const task = tasks.find((t) => t.id === relatedTaskId);

    addRisk({
      projectId: selectedProjectId,
      title: title.trim(),
      category,
      severity,
      riskScore: currentBreakdown.totalScore,
      relatedTaskId: task ? task.id : undefined,
      relatedTaskTitle: task ? task.title : undefined,
      ownerId: owner.id,
      ownerName: owner.name,
      ownerAvatar: owner.avatar,
      dueDate,
      status: 'monitoring',
      explanation: explanation.trim() || 'Identified during active sprint risk monitoring session.',
      mitigationPlan: mitigationPlan.trim() || 'Assign dedicated technical pairing and monitor progress daily.',
      scoreBreakdown: currentBreakdown,
    });

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-base">Register Risk Item</h3>
          </div>
          <button onClick={closeModal} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Risk Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Memory leak during certificate rotation on Istio ingress"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Risk Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white text-slate-900"
              >
                <option value="Technical">Technical</option>
                <option value="Schedule">Schedule</option>
                <option value="Resource">Resource</option>
                <option value="Dependency">Dependency</option>
                <option value="Scope">Scope</option>
                <option value="Budget">Budget</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as RiskSeverity)}
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
              <label className="block font-semibold text-slate-700 mb-1">Linked Task</label>
              <select
                value={relatedTaskId}
                onChange={(e) => setRelatedTaskId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white text-slate-900"
              >
                <option value="">-- No specific task --</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id}: {t.title.slice(0, 30)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Risk Owner</label>
              <select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white text-slate-900"
              >
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role.slice(0, 20)}...)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Root Cause &amp; Explanation</label>
            <textarea
              rows={2}
              placeholder="Why does this risk exist and what are the potential consequences?"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mitigation Action Plan</label>
            <textarea
              rows={2}
              placeholder="What immediate corrective action will be executed?"
              value={mitigationPlan}
              onChange={(e) => setMitigationPlan(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
            />
          </div>

          {/* Rule-based Scoring Matrix preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Rule-Based Scoring Breakdown:</span>
              <span className="font-black text-sm text-indigo-700">
                Calculated Score: {currentBreakdown.totalScore} / 100
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gapRule}
                  onChange={(e) => setGapRule(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Progress Gap &gt; 20% (+30)</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={overloadRule}
                  onChange={(e) => setOverloadRule(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Workload Overload (+25)</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deadlineRule}
                  onChange={(e) => setDeadlineRule(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Critical Due &le; 2 Days (+25)</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={depRule}
                  onChange={(e) => setDepRule(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Blocked Dependency (+20)</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={unavailRule}
                  onChange={(e) => setUnavailRule(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Member Unavailable (+20)</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ownerRule}
                  onChange={(e) => setOwnerRule(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Missing Technical Owner (+15)</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={commsRule}
                  onChange={(e) => setCommsRule(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Communication Delay &gt; 72h (+10)</span>
              </label>
            </div>
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
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition shadow-xs"
            >
              Log Risk &amp; Start Monitoring
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
