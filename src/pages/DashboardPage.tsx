import React from 'react';
import { TopSummaryCards } from '../components/dashboard/TopSummaryCards';
import { ProjectHealthSection } from '../components/dashboard/ProjectHealthSection';
import { ProjectProgressSection } from '../components/dashboard/ProjectProgressSection';
import { EarlyWarningSignalsSection } from '../components/dashboard/EarlyWarningSignalsSection';
import { AIInsightsSection } from '../components/dashboard/AIInsightsSection';
import { RiskMonitorSummarySection } from '../components/dashboard/RiskMonitorSummarySection';
import { TeamWorkloadSection } from '../components/dashboard/TeamWorkloadSection';
import { CommunicationActivitySection } from '../components/dashboard/CommunicationActivitySection';
import { NotificationsActivityFeedSection } from '../components/dashboard/NotificationsActivityFeedSection';
import { RiskTicketSummarySection } from '../components/dashboard/RiskTicketSummarySection';
import { useApp } from '../context/AppContext';
import { Sparkles, Activity, ShieldCheck, RefreshCw } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { selectedProject, calculatedHealthScore } = useApp();

  return (
    <div className="space-y-6 pb-12" id="page-dashboard">
      {/* Page Title & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Executive Project Health &amp; Risk Cockpit
            </h1>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold font-mono">
              {selectedProject?.code}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-dimensional project risk telemetry, automated workload balancing, and heuristic early-warning alarms.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex items-center space-x-2 text-xs font-semibold text-slate-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Real-time sync active</span>
          </div>
        </div>
      </div>

      {/* 8 Metric Top Summary Cards */}
      <TopSummaryCards />

      {/* SECTION 1: PROJECT HEALTH OVERVIEW */}
      <ProjectHealthSection />

      {/* SECTION 2: PROJECT PROGRESS */}
      <ProjectProgressSection />

      {/* SECTION 3: EARLY WARNING SIGNALS */}
      <EarlyWarningSignalsSection />

      {/* SECTION 4: AI INSIGHTS AND RECOMMENDATIONS */}
      <AIInsightsSection />

      {/* SECTION 5: RISK MONITOR SUMMARY */}
      <RiskMonitorSummarySection />

      {/* SECTION 6: TEAM WORKLOAD AND RESOURCES */}
      <TeamWorkloadSection />

      {/* SECTION 7: COMMUNICATION ACTIVITY */}
      <CommunicationActivitySection />

      {/* SECTION 8 & 9: NOTIFICATIONS PREVIEW & RECENT ACTIVITY FEED */}
      <NotificationsActivityFeedSection />

      {/* SECTION 10: RISK TICKET SUMMARY */}
      <RiskTicketSummarySection />
    </div>
  );
};
