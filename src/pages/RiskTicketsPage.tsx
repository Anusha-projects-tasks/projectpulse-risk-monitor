import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Tag,
  Plus,
  ShieldAlert,
  CheckSquare,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { TicketStatus, Priority } from '../types';

export const RiskTicketsPage: React.FC = () => {
  const {
    tickets,
    selectedProjectId,
    openModal,
    updateTicketStatus,
    setActiveTaskDrawerId,
    setActiveBreakdownRisk,
    risks,
  } = useApp();

  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const projTickets = tickets.filter((t) => {
    if (t.projectId !== selectedProjectId) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    return true;
  });

  const columns: {
    status: TicketStatus;
    title: string;
    description: string;
    color: string;
    border: string;
  }[] = [
    {
      status: 'open',
      title: 'Open Queue',
      description: 'Newly logged risk interventions',
      color: 'bg-slate-100 text-slate-700',
      border: 'border-slate-200',
    },
    {
      status: 'assigned',
      title: 'Assigned',
      description: 'Assigned to technical owner',
      color: 'bg-blue-100 text-blue-800',
      border: 'border-blue-200',
    },
    {
      status: 'in_progress',
      title: 'In Progress',
      description: 'Active engineering remediation',
      color: 'bg-indigo-100 text-indigo-800',
      border: 'border-indigo-200',
    },
    {
      status: 'resolved',
      title: 'Resolved / Verification',
      description: 'Fix deployed & awaiting signoff',
      color: 'bg-emerald-100 text-emerald-800',
      border: 'border-emerald-200',
    },
    {
      status: 'closed',
      title: 'Closed Archive',
      description: 'Impact measured & signed off',
      color: 'bg-slate-200 text-slate-600',
      border: 'border-slate-300',
    },
  ];

  return (
    <div className="space-y-6 pb-12" id="page-risk-tickets">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Risk Mitigation &amp; Remediation Kanban
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              {projTickets.length} Remediation Tickets
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch, track, and verify engineering interventions linked directly to active project risks and dependencies.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white text-slate-700 font-medium"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button
            onClick={() => openModal('create-ticket')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs flex items-center space-x-2 shadow-xs transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Risk Ticket</span>
          </button>
        </div>
      </div>

      {/* Full 5-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {columns.map((col) => {
          const colTickets = projTickets.filter((t) => t.status === col.status);

          return (
            <div
              key={col.status}
              className={`bg-slate-50/80 rounded-xl border ${col.border} p-3.5 flex flex-col min-h-[480px] shadow-2xs`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{col.title}</h3>
                  <span className="text-[10px] text-slate-400 block">{col.description}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.color}`}>
                  {colTickets.length}
                </span>
              </div>

              {/* Tickets Stack */}
              <div className="space-y-3 flex-1">
                {colTickets.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-xs text-slate-400 italic text-center">
                    No tickets in this phase
                  </div>
                ) : (
                  colTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs space-y-2.5 hover:border-indigo-400 hover:shadow-xs transition group"
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                          {ticket.id}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            ticket.priority === 'critical'
                              ? 'bg-rose-100 text-rose-700'
                              : ticket.priority === 'high'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h4 className="font-bold text-xs text-slate-900 leading-snug">
                        {ticket.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{ticket.description}</p>

                      {/* Linked Risk / Task Badges */}
                      {(ticket.linkedRiskId || ticket.linkedTaskId) && (
                        <div className="space-y-1 pt-1 border-t border-slate-100">
                          {ticket.linkedRiskId && (
                            <div className="text-[10px] text-amber-800 flex items-center gap-1 font-medium truncate">
                              <ShieldAlert className="w-3 h-3 text-amber-600 shrink-0" />
                              <span className="truncate">Risk: {ticket.linkedRiskId}</span>
                            </div>
                          )}
                          {ticket.linkedTaskId && (
                            <div
                              onClick={() => setActiveTaskDrawerId(ticket.linkedTaskId!)}
                              className="text-[10px] text-indigo-700 flex items-center gap-1 font-medium hover:underline cursor-pointer truncate"
                            >
                              <CheckSquare className="w-3 h-3 text-indigo-600 shrink-0" />
                              <span className="truncate">Task: {ticket.linkedTaskId}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Owner & Date */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                        <div className="flex items-center space-x-1.5">
                          <img
                            src={ticket.ownerAvatar}
                            alt={ticket.ownerName}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span className="font-medium truncate max-w-[80px]">{ticket.ownerName}</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400">{ticket.dueDate}</span>
                      </div>

                      {/* Transition Buttons */}
                      <div className="pt-2 border-t border-slate-100 flex justify-between gap-1 text-[10px]">
                        {col.status !== 'open' && (
                          <button
                            onClick={() => {
                              const prev: TicketStatus =
                                col.status === 'closed'
                                  ? 'resolved'
                                  : col.status === 'resolved'
                                  ? 'in_progress'
                                  : col.status === 'in_progress'
                                  ? 'assigned'
                                  : 'open';
                              updateTicketStatus(ticket.id, prev);
                            }}
                            className="text-slate-400 hover:text-slate-700 px-1 py-0.5 rounded"
                          >
                            &larr; Back
                          </button>
                        )}
                        <span className="flex-1" />
                        {col.status !== 'closed' && (
                          <button
                            onClick={() => {
                              const next: TicketStatus =
                                col.status === 'open'
                                  ? 'assigned'
                                  : col.status === 'assigned'
                                  ? 'in_progress'
                                  : col.status === 'in_progress'
                                  ? 'resolved'
                                  : 'closed';
                              updateTicketStatus(ticket.id, next);
                            }}
                            className="text-indigo-600 hover:text-indigo-800 font-bold px-1.5 py-0.5 rounded bg-indigo-50"
                          >
                            Move &rarr;
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
