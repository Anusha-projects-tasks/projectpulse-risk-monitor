import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Calendar,
  AlertCircle,
  UserCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ListChecks,
} from 'lucide-react';
import { TeamMember, Task } from '../../types';

export const LeaveRequestModal: React.FC = () => {
  const { modalOpen, closeModal, submitLeaveRequest, teamMembers, tasks, selectedProjectId } = useApp();

  const [memberId, setMemberId] = useState(teamMembers[0]?.id || '');
  const [startDate, setStartDate] = useState('2026-09-18');
  const [endDate, setEndDate] = useState('2026-09-28');
  const [reason, setReason] = useState('Planned annual rest & recuperation leave');

  // Checklist items
  const [checklistItems, setChecklistItems] = useState<string[]>([
    'Transfer cloud production credentials and tokens',
    'Document operational procedures and runbooks',
    'Schedule handoff walkthrough session',
    'Assign emergency on-call backup rotation',
  ]);
  const [newChecklistText, setNewChecklistText] = useState('');

  // Selected member's active incomplete tasks
  const memberTasks = useMemo(() => {
    return tasks.filter((t) => t.assigneeId === memberId && t.status !== 'completed');
  }, [tasks, memberId]);

  // Skill-based & workload-based replacement recommendation algorithm
  const taskReassignments = useMemo(() => {
    const applicant = teamMembers.find((m) => m.id === memberId);
    const availableOthers = teamMembers.filter((m) => m.id !== memberId && m.availabilityStatus !== 'on_leave');

    return memberTasks.map((task) => {
      // Find team member with matching skills and lowest current workload
      const sortedCandidates = [...availableOthers].sort((a, b) => {
        const aSkillMatch = a.skills.some((s) => task.title.toLowerCase().includes(s.toLowerCase())) ? 1 : 0;
        const bSkillMatch = b.skills.some((s) => task.title.toLowerCase().includes(s.toLowerCase())) ? 1 : 0;
        if (aSkillMatch !== bSkillMatch) return bSkillMatch - aSkillMatch;
        // lowest workload
        return a.currentWorkloadHours - b.currentWorkloadHours;
      });

      const bestCandidate = sortedCandidates[0] || availableOthers[0];

      return {
        taskId: task.id,
        taskTitle: task.title,
        recommendedReplacementId: bestCandidate ? bestCandidate.id : '',
        recommendedReplacementName: bestCandidate ? bestCandidate.name : 'Unassigned',
        action: 'reassign' as 'reassign' | 'split' | 'postpone',
        targetDate: task.dueDate,
        status: 'accepted' as 'pending' | 'accepted' | 'customized',
      };
    });
  }, [memberTasks, memberId, teamMembers]);

  const [customAssignments, setCustomAssignments] = useState(taskReassignments);

  // Sync state if applicant changes
  React.useEffect(() => {
    setCustomAssignments(taskReassignments);
  }, [taskReassignments]);

  if (modalOpen !== 'create-leave') return null;

  const handleActionChange = (taskId: string, action: 'reassign' | 'split' | 'postpone') => {
    setCustomAssignments((prev) =>
      prev.map((item) => (item.taskId === taskId ? { ...item, action, status: 'customized' } : item))
    );
  };

  const handleReplacementChange = (taskId: string, newReplacementId: string) => {
    const member = teamMembers.find((m) => m.id === newReplacementId);
    setCustomAssignments((prev) =>
      prev.map((item) =>
        item.taskId === taskId
          ? {
              ...item,
              recommendedReplacementId: newReplacementId,
              recommendedReplacementName: member ? member.name : 'Unknown',
              status: 'customized',
            }
          : item
      )
    );
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    setChecklistItems((prev) => [...prev, newChecklistText.trim()]);
    setNewChecklistText('');
  };

  const handleRemoveChecklist = (index: number) => {
    setChecklistItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLeaveRequest({
      memberId,
      startDate,
      endDate,
      reason,
      checklist: checklistItems,
      taskAssignments: customAssignments,
    });
    closeModal();
  };

  const selectedMember = teamMembers.find((m) => m.id === memberId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-semibold text-base">Submit Leave &amp; Automated Handover</h3>
              <p className="text-xs text-slate-400">
                AI Skill-Matching, Workload Balancing &amp; Handover Workflow
              </p>
            </div>
          </div>
          <button onClick={closeModal} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs max-h-[80vh] overflow-y-auto">
          {/* Employee & Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block font-semibold text-slate-700 mb-1">Team Member</label>
              <select
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white text-slate-900"
              >
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Reason for Leave</label>
            <input
              type="text"
              required
              placeholder="e.g. Annual family vacation, medical appointment, conference speaker"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
            />
          </div>

          {/* AI Task Impact Analysis Section */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-slate-900">
                  Automated Task Impact &amp; Workload Analysis
                </span>
              </div>
              <span className="text-[11px] font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                {memberTasks.length} Incomplete Task{memberTasks.length === 1 ? '' : 's'} Affected
              </span>
            </div>

            <p className="text-[11px] text-slate-600">
              The engine analyzed deadlines, critical path dependencies, and colleague skill sets to
              recommend seamless handover targets while {selectedMember?.name} is on leave.
            </p>

            {memberTasks.length === 0 ? (
              <div className="p-3 bg-white rounded-lg border border-indigo-100 text-center text-slate-500">
                No active tasks assigned to this team member. No reassignments required.
              </div>
            ) : (
              <div className="space-y-3">
                {customAssignments.map((assignment) => (
                  <div
                    key={assignment.taskId}
                    className="p-3 bg-white rounded-lg border border-indigo-100 shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded mr-2">
                          {assignment.taskId}
                        </span>
                        <span className="font-bold text-slate-900">{assignment.taskTitle}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shrink-0 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" /> Best Skill Match
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                          Mitigation Action:
                        </label>
                        <select
                          value={assignment.action}
                          onChange={(e) => handleActionChange(assignment.taskId, e.target.value as any)}
                          className="w-full border border-slate-200 rounded p-1.5 text-xs bg-slate-50 text-slate-800"
                        >
                          <option value="reassign">Reassign to Replacement</option>
                          <option value="split">Split Deliverable &amp; Delegate</option>
                          <option value="postpone">Postpone Deadline Past Return Date</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                          Designated Coverage Engineer:
                        </label>
                        <select
                          value={assignment.recommendedReplacementId}
                          onChange={(e) => handleReplacementChange(assignment.taskId, e.target.value)}
                          disabled={assignment.action === 'postpone'}
                          className="w-full border border-slate-200 rounded p-1.5 text-xs bg-slate-50 text-slate-800 disabled:opacity-50"
                        >
                          {teamMembers
                            .filter((m) => m.id !== memberId)
                            .map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name} ({m.currentWorkloadHours}h workload)
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Handover Checklist Section */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-slate-900">
                <ListChecks className="w-4 h-4 text-indigo-600" />
                <span>Handover Verification Checklist</span>
              </div>
              <span className="text-[11px] text-slate-500">
                {checklistItems.length} Verification Item{checklistItems.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="space-y-1.5">
              {checklistItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-slate-700"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklist(idx)}
                    className="text-slate-400 hover:text-rose-600 transition text-xs"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add custom checklist action item..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                className="flex-1 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
              />
              <button
                type="button"
                onClick={handleAddChecklist}
                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg text-xs"
              >
                Add Item
              </button>
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
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition shadow-xs flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>Submit Leave &amp; Rebalance Workload</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
