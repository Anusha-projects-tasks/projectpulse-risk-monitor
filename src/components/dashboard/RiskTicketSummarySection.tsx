import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Tag,
  ArrowRight,
  Plus,
  CheckCircle2,
  Clock,
  User,
  ShieldAlert,
} from 'lucide-react';
import { TicketStatus } from '../../types';

export const RiskTicketSummarySection: React.FC = () => {
  const { tickets, selectedProjectId, setCurrentPage, openModal, updateTicketStatus } = useApp();

  const projTickets = tickets.filter((t) => t.projectId === selectedProjectId);

  const openList = projTickets.filter((t) => t.status === 'open');
  const assignedList = projTickets.filter((t) => t.status === 'assigned');
  const inProgressList = projTickets.filter((t) => t.status === 'in_progress');
  const resolvedList = projTickets.filter((t) => t.status === 'resolved');
  const closedList = projTickets.filter((t) => t.status === 'closed');

  const columns: { status: TicketStatus; label: string; count: number; color: string; items: typeof projTickets }[] = [
    { status: 'open', label: 'Open', count: openList.length, color: 'border-slate-300 text-slate-700 bg-slate-50', items: openList },
    { status: 'assigned', label: 'Assigned', count: assignedList.length, color: 'border-blue-300 text-blue-800 bg-blue-50', items: assignedList },
    { status: 'in_progress', label: 'In Progress', count: inProgressList.length, color: 'border-indigo-300 text-indigo-800 bg-indigo-50', items: inProgressList },
    { status: 'resolved', label: 'Resolved', count: resolvedList.length, color: 'border-emerald-300 text-emerald-800 bg-emerald-50', items: resolvedList },
    { status: 'closed', label: 'Closed', count: closedList.length, color: 'border-slate-200 text-slate-500 bg-slate-50/50', items: closedList },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4" id="section-risk-tickets-summary">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Tag className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Risk Ticket Remediation Board (Mini Kanban)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational triage tasks created to resolve active project risks and unblock delivery.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => openModal('create-ticket')}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Open Ticket</span>
          </button>
          <button
            onClick={() => setCurrentPage('risk-tickets')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
          >
            <span>Open Complete Tickets View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mini Kanban Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {columns.map((col) => (
          <div key={col.status} className="bg-slate-50/70 border border-slate-200 rounded-xl p-3 flex flex-col">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
              <span className="text-xs font-bold text-slate-800">{col.label}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${col.color}`}>
                {col.count}
              </span>
            </div>

            <div className="space-y-2 flex-1 min-h-[140px] overflow-y-auto max-h-60">
              {col.items.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[11px] text-slate-400 italic text-center py-4">
                  No tickets
                </div>
              ) : (
                col.items.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs text-xs space-y-1.5 hover:border-indigo-300 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-indigo-600">{ticket.id}</span>
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

                    <div className="font-semibold text-slate-900 leading-tight line-clamp-2">
                      {ticket.title}
                    </div>

                    {ticket.linkedRiskId && (
                      <span className="text-[10px] text-amber-700 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        <span>Risk: {ticket.linkedRiskId}</span>
                      </span>
                    )}

                    <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center space-x-1">
                        <img
                          src={ticket.ownerAvatar}
                          alt={ticket.ownerName}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="truncate max-w-[65px]">{ticket.ownerName.split(' ')[0]}</span>
                      </div>
                      <span className="font-mono text-[10px]">{ticket.dueDate}</span>
                    </div>

                    {/* Quick move action */}
                    {col.status !== 'closed' && (
                      <div className="pt-1 flex justify-end">
                        <button
                          onClick={() => {
                            const nextStatus: TicketStatus =
                              col.status === 'open'
                                ? 'assigned'
                                : col.status === 'assigned'
                                ? 'in_progress'
                                : col.status === 'in_progress'
                                ? 'resolved'
                                : 'closed';
                            updateTicketStatus(ticket.id, nextStatus);
                          }}
                          className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          Advance &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
