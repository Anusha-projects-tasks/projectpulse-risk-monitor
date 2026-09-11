import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PageId,
  Project,
  TeamMember,
  Task,
  RiskItem,
  EarlyWarningSignal,
  AIRecommendation,
  RiskTicket,
  Message,
  NotificationItem,
  LeaveRequest,
  ImpactVerification,
  ActivityEvent,
  TaskStatus,
  TicketStatus,
  RiskStatus,
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_TASKS,
  INITIAL_RISKS,
  INITIAL_EARLY_WARNING_SIGNALS,
  INITIAL_AI_RECOMMENDATIONS,
  INITIAL_RISK_TICKETS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_IMPACT_VERIFICATIONS,
  INITIAL_ACTIVITIES,
} from '../data/initialData';
import { computeTaskRiskBreakdown, getRiskSeverity } from '../utils/riskScoring';

interface AppContextType {
  // Navigation & View
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Global filters
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  selectedProject: Project | undefined;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;

  // Projects
  projects: Project[];
  addProject: (p: Omit<Project, 'id' | 'healthScore' | 'actualProgress'>) => void;

  // Team
  teamMembers: TeamMember[];
  updateMember: (id: string, updates: Partial<TeamMember>) => void;

  // Tasks
  tasks: Task[];
  addTask: (t: Omit<Task, 'id' | 'riskScore' | 'comments'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addTaskComment: (taskId: string, commentText: string) => void;
  activeTaskDrawerId: string | null;
  setActiveTaskDrawerId: (id: string | null) => void;

  // Risks
  risks: RiskItem[];
  addRisk: (r: Omit<RiskItem, 'id' | 'detectedDate'>) => void;
  updateRisk: (id: string, updates: Partial<RiskItem>) => void;
  resolveRisk: (id: string) => void;
  escalateRisk: (id: string) => void;
  activeBreakdownRisk: RiskItem | null;
  setActiveBreakdownRisk: (risk: RiskItem | null) => void;

  // Early Warnings & AI
  earlyWarnings: EarlyWarningSignal[];
  aiRecommendations: AIRecommendation[];
  acceptRecommendation: (id: string) => void;

  // Tickets
  tickets: RiskTicket[];
  addTicket: (t: Omit<RiskTicket, 'id' | 'ticketNumber' | 'createdDate' | 'comments' | 'activityHistory'>) => void;
  updateTicketStatus: (id: string, status: TicketStatus) => void;
  addTicketComment: (ticketId: string, text: string) => void;

  // Communication
  messages: Message[];
  sendMessage: (channelId: string, content: string, recipientId?: string, attachment?: any, replyToId?: string) => void;
  togglePinMessage: (id: string) => void;
  markMessageRead: (id: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;

  // Leave & Handover
  leaveRequests: LeaveRequest[];
  submitLeaveRequest: (data: {
    memberId: string;
    startDate: string;
    endDate: string;
    reason: string;
    checklist: string[];
    taskAssignments: any[];
  }) => void;
  approveLeaveRequest: (id: string) => void;
  completeHandover: (id: string) => void;

  // Impact Verification
  impactVerifications: ImpactVerification[];
  addImpactVerification: (iv: Omit<ImpactVerification, 'id' | 'verificationDate'>) => void;

  // Activities
  activities: ActivityEvent[];
  addActivity: (act: Omit<ActivityEvent, 'id' | 'timestamp'>) => void;

  // Metrics
  calculatedHealthScore: number;

  // Modal Control
  modalOpen: string | null;
  openModal: (modalName: string) => void;
  closeModal: () => void;

  // Reset
  resetToInitialData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'projectpulse_v1_';

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
  } catch {
    // Ignore quota errors in private browsing
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-apex');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('Current Sprint (Q3 W2)');

  // Data states
  const [projects, setProjects] = useState<Project[]>(() => getStored('projects', INITIAL_PROJECTS));
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => getStored('team', INITIAL_TEAM_MEMBERS));
  const [tasks, setTasks] = useState<Task[]>(() => getStored('tasks', INITIAL_TASKS));
  const [risks, setRisks] = useState<RiskItem[]>(() => getStored('risks', INITIAL_RISKS));
  const [earlyWarnings, setEarlyWarnings] = useState<EarlyWarningSignal[]>(() =>
    getStored('warnings', INITIAL_EARLY_WARNING_SIGNALS)
  );
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>(() =>
    getStored('ai_recs', INITIAL_AI_RECOMMENDATIONS)
  );
  const [tickets, setTickets] = useState<RiskTicket[]>(() => getStored('tickets', INITIAL_RISK_TICKETS));
  const [messages, setMessages] = useState<Message[]>(() => getStored('messages', INITIAL_MESSAGES));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    getStored('notifications', INITIAL_NOTIFICATIONS)
  );
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() =>
    getStored('leave_requests', INITIAL_LEAVE_REQUESTS)
  );
  const [impactVerifications, setImpactVerifications] = useState<ImpactVerification[]>(() =>
    getStored('impact_verifications', INITIAL_IMPACT_VERIFICATIONS)
  );
  const [activities, setActivities] = useState<ActivityEvent[]>(() => getStored('activities', INITIAL_ACTIVITIES));

  // Modals & Drawers
  const [activeTaskDrawerId, setActiveTaskDrawerId] = useState<string | null>(null);
  const [activeBreakdownRisk, setActiveBreakdownRisk] = useState<RiskItem | null>(null);
  const [modalOpen, setModalOpen] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => setStored('projects', projects), [projects]);
  useEffect(() => setStored('team', teamMembers), [teamMembers]);
  useEffect(() => setStored('tasks', tasks), [tasks]);
  useEffect(() => setStored('risks', risks), [risks]);
  useEffect(() => setStored('warnings', earlyWarnings), [earlyWarnings]);
  useEffect(() => setStored('ai_recs', aiRecommendations), [aiRecommendations]);
  useEffect(() => setStored('tickets', tickets), [tickets]);
  useEffect(() => setStored('messages', messages), [messages]);
  useEffect(() => setStored('notifications', notifications), [notifications]);
  useEffect(() => setStored('leave_requests', leaveRequests), [leaveRequests]);
  useEffect(() => setStored('impact_verifications', impactVerifications), [impactVerifications]);
  useEffect(() => setStored('activities', activities), [activities]);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Rule-based Health Score: 100 - average active task risk score
  const activeTasksForProj = tasks.filter(
    (t) => t.projectId === selectedProjectId && t.status !== 'completed'
  );
  const calculatedHealthScore =
    activeTasksForProj.length > 0
      ? Math.max(
          10,
          Math.min(
            100,
            Math.round(
              100 -
                activeTasksForProj.reduce((acc, t) => acc + t.riskScore, 0) /
                  activeTasksForProj.length
            )
          )
        )
      : selectedProject?.healthScore || 85;

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  const openModal = (name: string) => setModalOpen(name);
  const closeModal = () => setModalOpen(null);

  const addActivity = (act: Omit<ActivityEvent, 'id' | 'timestamp'>) => {
    const newAct: ActivityEvent = {
      ...act,
      id: 'act-' + Date.now(),
      timestamp: 'Just now',
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const addProject = (p: Omit<Project, 'id' | 'healthScore' | 'actualProgress'>) => {
    const newProject: Project = {
      ...p,
      id: 'proj-' + Date.now(),
      healthScore: 85,
      actualProgress: 10,
    };
    setProjects((prev) => [newProject, ...prev]);
    setSelectedProjectId(newProject.id);
    addActivity({
      type: 'task_reassigned',
      title: 'Project Initiated',
      description: `Created project ${newProject.name}`,
      actorName: 'Elena Rostova',
      actorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      relatedPage: 'projects',
    });
  };

  const updateMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const addTask = (t: Omit<Task, 'id' | 'riskScore' | 'comments'>) => {
    const id = `TSK-${Math.floor(100 + Math.random() * 900)}`;
    const breakdown = computeTaskRiskBreakdown(
      { ...t, id, riskScore: 0, comments: [] },
      teamMembers,
      false
    );
    const newTask: Task = {
      ...t,
      id,
      riskScore: breakdown.totalScore,
      comments: [],
    };
    setTasks((prev) => [newTask, ...prev]);
    addActivity({
      type: 'task_reassigned',
      title: `Task Created: ${id}`,
      description: `${newTask.title} assigned to ${newTask.assigneeName}`,
      actorName: 'System User',
      actorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      relatedPage: 'tasks',
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const merged = { ...t, ...updates };
        const breakdown = computeTaskRiskBreakdown(merged, teamMembers, false);
        return { ...merged, riskScore: breakdown.totalScore };
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addTaskComment = (taskId: string, commentText: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const newC = {
          id: 'c-' + Date.now(),
          authorId: 'current-user',
          authorName: 'You (Manager)',
          authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          timestamp: 'Just now',
          content: commentText,
        };
        return { ...t, comments: [...t.comments, newC] };
      })
    );
  };

  const addRisk = (r: Omit<RiskItem, 'id' | 'detectedDate'>) => {
    const id = `RSK-${Math.floor(800 + Math.random() * 200)}`;
    const newRisk: RiskItem = {
      ...r,
      id,
      detectedDate: new Date().toISOString().split('T')[0],
    };
    setRisks((prev) => [newRisk, ...prev]);
    addActivity({
      type: 'risk_detected',
      title: `Risk Logged: ${id}`,
      description: newRisk.title,
      actorName: newRisk.ownerName,
      actorAvatar: newRisk.ownerAvatar,
      relatedPage: 'risk-monitor',
    });
  };

  const updateRisk = (id: string, updates: Partial<RiskItem>) => {
    setRisks((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const resolveRisk = (id: string) => {
    setRisks((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'resolved' as RiskStatus, riskScore: 0 } : r))
    );
    addActivity({
      type: 'dependency_resolved',
      title: 'Risk Resolved',
      description: `Risk item ${id} was marked as resolved`,
      actorName: 'You (Manager)',
      actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      relatedPage: 'risk-monitor',
    });
  };

  const escalateRisk = (id: string) => {
    setRisks((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'escalated' as RiskStatus, severity: 'critical' } : r))
    );
    addActivity({
      type: 'risk_detected',
      title: 'Risk Escalated to Critical',
      description: `Risk item ${id} was escalated for leadership triage`,
      actorName: 'You (Manager)',
      actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      relatedPage: 'risk-monitor',
    });
  };

  const acceptRecommendation = (id: string) => {
    setAiRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, accepted: true } : rec))
    );
    const rec = aiRecommendations.find((r) => r.id === id);
    if (rec) {
      addActivity({
        type: 'ai_accepted',
        title: 'AI Recommendation Accepted',
        description: rec.title,
        actorName: 'You (Manager)',
        actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        relatedPage: 'ai-insights',
      });
    }
  };

  const addTicket = (
    t: Omit<RiskTicket, 'id' | 'ticketNumber' | 'createdDate' | 'comments' | 'activityHistory'>
  ) => {
    const num = String(tickets.length + 1).padStart(3, '0');
    const id = `TCK-${Math.floor(200 + Math.random() * 800)}`;
    const newTicket: RiskTicket = {
      ...t,
      id,
      ticketNumber: `RSK-TICK-${num}`,
      createdDate: new Date().toISOString().split('T')[0],
      comments: [],
      activityHistory: [
        {
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          action: 'Ticket created',
          actorName: 'You (Manager)',
        },
      ],
    };
    setTickets((prev) => [newTicket, ...prev]);
    addActivity({
      type: 'ticket_created',
      title: `Ticket ${newTicket.ticketNumber} Created`,
      description: newTicket.title,
      actorName: 'You (Manager)',
      actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      relatedPage: 'risk-tickets',
    });
  };

  const updateTicketStatus = (id: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return {
          ...t,
          status,
          activityHistory: [
            ...t.activityHistory,
            {
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
              action: `Status moved to ${status.replace('_', ' ').toUpperCase()}`,
              actorName: 'You (Manager)',
            },
          ],
        };
      })
    );
  };

  const addTicketComment = (ticketId: string, text: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          comments: [
            ...t.comments,
            {
              id: 'tc-' + Date.now(),
              authorName: 'You (Manager)',
              authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              timestamp: 'Just now',
              text,
            },
          ],
        };
      })
    );
  };

  const sendMessage = (
    channelId: string,
    content: string,
    recipientId?: string,
    attachment?: any,
    replyToId?: string
  ) => {
    const newMsg: Message = {
      id: 'msg-' + Date.now(),
      channelId,
      channelName: channelId.startsWith('proj')
        ? `#${selectedProject?.code.toLowerCase()}-stream`
        : channelId === 'risk-triage'
        ? '#risk-incident-triage'
        : channelId === 'general'
        ? '#general-announcements'
        : 'Direct Message',
      senderId: 'current-user',
      senderName: 'You (Engineering Lead)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      senderRole: 'Engineering Manager',
      recipientId,
      content,
      timestamp: 'Just now',
      isRead: true,
      attachment,
      replyToId,
    };
    setMessages((prev) => [newMsg, ...prev]);
    addActivity({
      type: 'message_sent',
      title: 'Message Posted',
      description: `Posted in ${newMsg.channelName}: "${content.slice(0, 36)}..."`,
      actorName: 'You',
      actorAvatar: newMsg.senderAvatar,
      relatedPage: 'communication',
    });
  };

  const togglePinMessage = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isPinned: !m.isPinned } : m))
    );
  };

  const markMessageRead = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const submitLeaveRequest = (data: {
    memberId: string;
    startDate: string;
    endDate: string;
    reason: string;
    checklist: string[];
    taskAssignments: any[];
  }) => {
    const member = teamMembers.find((m) => m.id === data.memberId);
    if (!member) return;

    const newReq: LeaveRequest = {
      id: 'leave-' + Date.now(),
      memberId: member.id,
      memberName: member.name,
      memberAvatar: member.avatar,
      memberRole: member.role,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'pending_review',
      handoverChecklist: data.checklist.map((c, i) => ({
        id: `chk-${Date.now()}-${i}`,
        item: c,
        done: false,
      })),
      taskAssignments: data.taskAssignments,
      impactAssessment: {
        incompleteTasksCount: data.taskAssignments.length,
        highRiskTasksCount: 1,
        blockedDependenciesCount: 0,
      },
    };

    setLeaveRequests((prev) => [newReq, ...prev]);
    addActivity({
      type: 'leave_approved',
      title: 'Leave Request Submitted',
      description: `${member.name} submitted leave request for ${data.startDate} - ${data.endDate}`,
      actorName: member.name,
      actorAvatar: member.avatar,
      relatedPage: 'leave-handover',
    });
  };

  const approveLeaveRequest = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((lr) => {
        if (lr.id !== id) return lr;
        return { ...lr, status: 'in_handover' };
      })
    );
  };

  const completeHandover = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((lr) => {
        if (lr.id !== id) return lr;
        return { ...lr, status: 'completed' };
      })
    );
    addActivity({
      type: 'handover_completed',
      title: 'Handover Completed',
      description: `Handover verification finalized for leave record ${id}`,
      actorName: 'You (Manager)',
      actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      relatedPage: 'leave-handover',
    });
  };

  const addImpactVerification = (iv: Omit<ImpactVerification, 'id' | 'verificationDate'>) => {
    const newIV: ImpactVerification = {
      ...iv,
      id: 'IMP-' + Math.floor(10 + Math.random() * 90),
      verificationDate: new Date().toISOString().split('T')[0],
    };
    setImpactVerifications((prev) => [newIV, ...prev]);
    addActivity({
      type: 'dependency_resolved',
      title: 'Impact Verification Logged',
      description: `Closed-loop verification added for ${newIV.title}`,
      actorName: newIV.responsibleOwner,
      actorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      relatedPage: 'impact-verification',
    });
  };

  const resetToInitialData = () => {
    localStorage.clear();
    setProjects(INITIAL_PROJECTS);
    setTeamMembers(INITIAL_TEAM_MEMBERS);
    setTasks(INITIAL_TASKS);
    setRisks(INITIAL_RISKS);
    setEarlyWarnings(INITIAL_EARLY_WARNING_SIGNALS);
    setAiRecommendations(INITIAL_AI_RECOMMENDATIONS);
    setTickets(INITIAL_RISK_TICKETS);
    setMessages(INITIAL_MESSAGES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setImpactVerifications(INITIAL_IMPACT_VERIFICATIONS);
    setActivities(INITIAL_ACTIVITIES);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        sidebarCollapsed,
        setSidebarCollapsed,
        selectedProjectId,
        setSelectedProjectId,
        selectedProject,
        searchQuery,
        setSearchQuery,
        dateRange,
        setDateRange,
        projects,
        addProject,
        teamMembers,
        updateMember,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        addTaskComment,
        activeTaskDrawerId,
        setActiveTaskDrawerId,
        risks,
        addRisk,
        updateRisk,
        resolveRisk,
        escalateRisk,
        activeBreakdownRisk,
        setActiveBreakdownRisk,
        earlyWarnings,
        aiRecommendations,
        acceptRecommendation,
        tickets,
        addTicket,
        updateTicketStatus,
        addTicketComment,
        messages,
        sendMessage,
        togglePinMessage,
        markMessageRead,
        notifications,
        unreadNotifsCount,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        leaveRequests,
        submitLeaveRequest,
        approveLeaveRequest,
        completeHandover,
        impactVerifications,
        addImpactVerification,
        activities,
        addActivity,
        calculatedHealthScore,
        modalOpen,
        openModal,
        closeModal,
        resetToInitialData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
