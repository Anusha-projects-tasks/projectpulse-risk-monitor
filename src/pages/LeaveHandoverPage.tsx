import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarCheck,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  UserCheck,
  ArrowRight,
  ListChecks,
  AlertTriangle,
  Users,
} from 'lucide-react';

export const LeaveHandoverPage: React.FC = () => {
  const { leaveRequests, openModal, teamMembers, tasks, approveLeaveRequest } = useApp();

  return (
    <div className="space-y-6 pb-12" id="page-leave-handover">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Intelligent Leave &amp; Autonomous Handover Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              Skill &amp; Load Balancing Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated impact modeling when engineers step out: matches vacant tasks against colleague skills and manages verification checklists.
          </p>
        </div>

        <button
          onClick={() => openModal('create-leave')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs flex items-center space-x-2 shadow-xs transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Leave &amp; Handover</span>
        </button>
      </div>

      {/* How It Works Infographic */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-md">
        <h3 className="text-sm font-bold mb-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Automated Continuity Pipeline Workflow
        </h3>
        <p className="text-xs text-slate-400 mb-4 max-w-2xl">
          When an engineer books leave, ProjectPulse inspects open milestones, verifies colleague availability, and automatically prevents deadline slippage.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <span className="text-indigo-400 font-bold block mb-1">1. Deliverable Scan</span>
            <p className="text-slate-300 text-[11px]">
              Finds all active sprint tasks assigned to applicant with due dates within absence window.
            </p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <span className="text-indigo-400 font-bold block mb-1">2. Skill Matrix Match</span>
            <p className="text-slate-300 text-[11px]">
              Evaluates colleague competencies (Golang, Kubernetes, Rust) to identify ideal backup coverage.
            </p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <span className="text-indigo-400 font-bold block mb-1">3. Capacity Protection</span>
            <p className="text-slate-300 text-[11px]">
              Verifies target replacement has bandwidth below 35h/wk to prevent cascading burnout risks.
            </p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <span className="text-indigo-400 font-bold block mb-1">4. Handoff Verification</span>
            <p className="text-slate-300 text-[11px]">
              Enforces runbook links, secret key sharing, and pair-review signoff before absence starts.
            </p>
          </div>
        </div>
      </div>

      {/* Leave Requests Directory */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Active &amp; Scheduled Leave Coverage Records ({leaveRequests.length})
        </h3>

        <div className="space-y-4">
          {leaveRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4"
            >
              {/* Request Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <img
                    src={req.memberAvatar}
                    alt={req.memberName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{req.memberName}</span>
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {req.id}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{req.reason}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Absence Window:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {req.startDate} &rarr; {req.endDate}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                      req.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'in_handover'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {req.status.replace('_', ' ')}
                  </span>

                  {req.status !== 'approved' && (
                    <button
                      onClick={() => approveLeaveRequest(req.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition"
                    >
                      Approve &amp; Reassign
                    </button>
                  )}
                </div>
              </div>

              {/* Task Delegations & Replacements Grid */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Automated Task Reassignments &amp; Replacement Coverage ({req.taskAssignments.length}):
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {req.taskAssignments.map((task) => (
                    <div
                      key={task.taskId}
                      className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-2"
                    >
                      <div>
                        <span className="font-mono text-[10px] font-bold text-indigo-600 mr-1.5">
                          {task.taskId}
                        </span>
                        <span className="font-semibold text-slate-800">{task.taskTitle}</span>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                          <span>Action:</span>
                          <span className="font-bold capitalize text-indigo-900">{task.action}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 block uppercase">Replacement:</span>
                        <span className="font-bold text-slate-900">
                          {task.recommendedReplacementName}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold block">
                          Coverage Confirmed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Handover Checklist Progress */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <ListChecks className="w-4 h-4 text-indigo-600" />
                    <span>Handoff Verification Checklist</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {req.checklist.length} Mandatory Signoffs
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {req.checklist.map((item, cIdx) => (
                    <div
                      key={cIdx}
                      className="flex items-center space-x-2 p-2 rounded bg-slate-50 border border-slate-200/80 text-slate-700 text-[11px]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
