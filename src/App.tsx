/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { TasksPage } from './pages/TasksPage';
import { TeamPage } from './pages/TeamPage';
import { RiskMonitorPage } from './pages/RiskMonitorPage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { RiskTicketsPage } from './pages/RiskTicketsPage';
import { CommunicationPage } from './pages/CommunicationPage';
import { LeaveHandoverPage } from './pages/LeaveHandoverPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { ImpactVerificationPage } from './pages/ImpactVerificationPage';
import { SettingsPage } from './pages/SettingsPage';

// Modals & Drawers
import { RiskScoreBreakdownModal } from './components/modals/RiskScoreBreakdownModal';
import { TaskDrawer } from './components/modals/TaskDrawer';
import { CreateTaskModal } from './components/modals/CreateTaskModal';
import { CreateRiskModal } from './components/modals/CreateRiskModal';
import { CreateTicketModal } from './components/modals/CreateTicketModal';
import { LeaveRequestModal } from './components/modals/LeaveRequestModal';

const AppShell: React.FC = () => {
  const { currentPage, sidebarCollapsed } = useApp();

  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'tasks':
        return <TasksPage />;
      case 'team':
        return <TeamPage />;
      case 'risk-monitor':
        return <RiskMonitorPage />;
      case 'ai-insights':
        return <AIInsightsPage />;
      case 'risk-tickets':
        return <RiskTicketsPage />;
      case 'communication':
        return <CommunicationPage />;
      case 'leave-handover':
        return <LeaveHandoverPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'impact-verification':
        return <ImpactVerificationPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-18' : 'md:ml-64'
        }`}
      >
        {/* Sticky Top Header */}
        <Header />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <RiskScoreBreakdownModal />
      <TaskDrawer />
      <CreateTaskModal />
      <CreateRiskModal />
      <CreateTicketModal />
      <LeaveRequestModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
