export type PageId =
  | 'dashboard'
  | 'projects'
  | 'tasks'
  | 'team'
  | 'risk-monitor'
  | 'ai-insights'
  | 'risk-tickets'
  | 'communication'
  | 'leave-handover'
  | 'notifications'
  | 'reports'
  | 'impact-verification'
  | 'settings';

export type TaskStatus = 'not_started' | 'in_progress' | 'blocked' | 'completed' | 'overdue';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';
export type RiskStatus = 'identified' | 'monitoring' | 'escalated' | 'mitigating' | 'resolved';
export type TicketStatus = 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
export type HandoverStatus = 'draft' | 'pending_review' | 'in_handover' | 'completed';
export type ImpactTag = 'improved' | 'partially_improved' | 'unresolved';

export interface Project {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'healthy' | 'at_risk' | 'critical';
  healthScore: number;
  actualProgress: number;
  expectedProgress: number;
  startDate: string;
  targetEndDate: string;
  forecastEndDate: string;
  budgetAllocated: number;
  budgetSpent: number;
  leadName: string;
  leadAvatar: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  avatar: string;
  assignedTasksCount: number;
  completedTasksCount: number;
  capacityHours: number; // e.g. 40 hrs/wk
  currentWorkloadHours: number; // e.g. 48 hrs/wk
  skills: string[];
  availabilityStatus: 'available' | 'overloaded' | 'on_leave' | 'limited';
  leaveDates?: { start: string; end: string };
  backupMemberId?: string;
}

export interface TaskComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar: string;
  expectedProgress: number; // 0 - 100
  actualProgress: number; // 0 - 100
  startDate: string;
  dueDate: string;
  estimatedHours: number;
  loggedHours: number;
  dependencies: string[]; // task IDs
  isBlocked: boolean;
  blockedReason?: string;
  riskScore: number;
  comments: TaskComment[];
}

export interface RiskScoreBreakdown {
  progressGap: number; // +30 if gap > 20%
  workloadOverload: number; // +25 if assignee overloaded
  nearDeadline: number; // +25 if due within 2 days & not completed
  blockedDependency: number; // +20 if dependency blocked
  memberUnavailable: number; // +20 if assignee on leave/limited
  communicationDelay: number; // +10 if no updates in 3+ days
  missingOwner: number; // +15 if unassigned
  totalScore: number;
}

export interface RiskItem {
  id: string;
  projectId: string;
  title: string;
  category: 'Technical' | 'Schedule' | 'Resource' | 'Scope' | 'Dependency' | 'Budget';
  severity: RiskSeverity;
  riskScore: number; // 0 - 100
  relatedTaskId?: string;
  relatedTaskTitle?: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  dueDate: string;
  status: RiskStatus;
  detectedDate: string;
  explanation: string;
  mitigationPlan: string;
  scoreBreakdown: RiskScoreBreakdown;
  ticketId?: string;
}

export interface EarlyWarningSignal {
  id: string;
  category: 'Progress Drop' | 'Workload Overload' | 'Dependency Block' | 'Deadline Pressure';
  severity: RiskSeverity;
  affectedTaskTitle: string;
  affectedTaskId?: string;
  projectId: string;
  detectionDate: string;
  explanation: string;
  riskScore: number;
  recommendedAction: string;
}

export interface AIRecommendation {
  id: string;
  projectId: string;
  title: string;
  whatIsHappening: string;
  whyIsImportant: string;
  recommendedAction: string;
  responsibleOwnerId: string;
  responsibleOwnerName: string;
  expectedImpact: string;
  priority: Priority;
  accepted: boolean;
  relatedTaskId?: string;
  relatedRiskId?: string;
  dateGenerated: string;
}

export interface RiskTicket {
  id: string;
  projectId: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  dueDate: string;
  createdDate: string;
  linkedRiskId?: string;
  linkedRiskTitle?: string;
  linkedTaskId?: string;
  linkedTaskTitle?: string;
  comments: {
    id: string;
    authorName: string;
    authorAvatar: string;
    timestamp: string;
    text: string;
  }[];
  activityHistory: {
    timestamp: string;
    action: string;
    actorName: string;
  }[];
}

export interface MessageAttachment {
  type: 'task' | 'risk' | 'ticket' | 'leave';
  id: string;
  title: string;
}

export interface Message {
  id: string;
  channelId: string; // 'general', 'proj-alpha', 'risk-triage', or 'dm-user1-user2'
  channelName?: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  recipientId?: string; // for DMs
  content: string;
  timestamp: string;
  isRead: boolean;
  isPinned?: boolean;
  isHelpRequest?: boolean;
  mentions?: string[];
  attachment?: MessageAttachment;
  replyToId?: string;
}

export interface NotificationItem {
  id: string;
  category: 'task' | 'risk' | 'communication' | 'leave' | 'ai' | 'ticket';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  targetPage: PageId;
  targetId?: string;
  urgency: 'info' | 'warning' | 'critical';
}

export interface HandoverTaskAssignment {
  taskId: string;
  taskTitle: string;
  recommendedReplacementId: string;
  recommendedReplacementName: string;
  action: 'reassign' | 'split' | 'postpone';
  targetDate?: string;
  status: 'pending' | 'accepted' | 'customized';
}

export interface LeaveRequest {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  memberRole: string;
  startDate: string;
  endDate: string;
  reason: string;
  submittedAt: string;
  status: HandoverStatus;
  handoverChecklist: { id: string; item: string; done: boolean }[];
  taskAssignments: HandoverTaskAssignment[];
  impactAssessment: {
    incompleteTasksCount: number;
    highRiskTasksCount: number;
    blockedDependenciesCount: number;
  };
}

export interface ImpactVerification {
  id: string;
  title: string;
  riskTitle: string;
  riskScoreBefore: number;
  riskScoreAfter: number;
  healthScoreBefore: number;
  healthScoreAfter: number;
  scheduleVarianceBefore: string; // e.g. "-12 days"
  scheduleVarianceAfter: string; // e.g. "-2 days"
  correctiveAction: string;
  responsibleOwner: string;
  verificationDate: string;
  tag: ImpactTag;
  notes: string;
}

export interface ActivityEvent {
  id: string;
  type:
    | 'task_completed'
    | 'task_reassigned'
    | 'risk_detected'
    | 'ticket_created'
    | 'message_sent'
    | 'leave_approved'
    | 'dependency_resolved'
    | 'ai_accepted'
    | 'handover_completed';
  title: string;
  description: string;
  timestamp: string;
  actorName: string;
  actorAvatar: string;
  relatedPage?: PageId;
}
