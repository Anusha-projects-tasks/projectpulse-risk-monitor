import { RiskScoreBreakdown, Task, TeamMember } from '../types';

export interface ScoringParams {
  progressGapAbove20: boolean;
  workloadExceedsCapacity: boolean;
  dueWithin2Days: boolean;
  blockedDependency: boolean;
  memberUnavailable: boolean;
  communicationDelay: boolean;
  missingOwner: boolean;
}

export function calculateRiskScore(params: ScoringParams): RiskScoreBreakdown {
  const progressGap = params.progressGapAbove20 ? 30 : 0;
  const workloadOverload = params.workloadExceedsCapacity ? 25 : 0;
  const nearDeadline = params.dueWithin2Days ? 25 : 0;
  const blockedDependency = params.blockedDependency ? 20 : 0;
  const memberUnavailable = params.memberUnavailable ? 20 : 0;
  const communicationDelay = params.communicationDelay ? 10 : 0;
  const missingOwner = params.missingOwner ? 15 : 0;

  const raw = progressGap + workloadOverload + nearDeadline + blockedDependency + memberUnavailable + communicationDelay + missingOwner;
  const totalScore = Math.min(100, raw);

  return {
    progressGap,
    workloadOverload,
    nearDeadline,
    blockedDependency,
    memberUnavailable,
    communicationDelay,
    missingOwner,
    totalScore,
  };
}

export function getRiskSeverity(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 81) return 'critical';
  if (score >= 61) return 'high';
  if (score >= 31) return 'medium';
  return 'low';
}

export function computeTaskRiskBreakdown(
  task: Task,
  teamMembers: TeamMember[],
  hasBlockedDependency: boolean,
  hasRecentComms: boolean = true
): RiskScoreBreakdown {
  const gap = Math.max(0, task.expectedProgress - task.actualProgress);
  const progressGapAbove20 = gap > 20;

  const assignee = teamMembers.find((m) => m.id === task.assigneeId);
  const workloadExceedsCapacity = assignee ? assignee.currentWorkloadHours > assignee.capacityHours : false;
  const memberUnavailable = assignee ? assignee.availabilityStatus === 'on_leave' || assignee.availabilityStatus === 'limited' : false;
  const missingOwner = !task.assigneeId || !assignee;

  // Check if due within 2 days or already overdue
  const now = new Date('2026-09-11T00:00:00Z').getTime();
  const due = new Date(task.dueDate).getTime();
  const diffDays = (due - now) / (1000 * 60 * 60 * 24);
  const dueWithin2Days = (diffDays <= 2 || diffDays < 0) && task.status !== 'completed';

  const blockedDependency = task.isBlocked || hasBlockedDependency;
  const communicationDelay = !hasRecentComms;

  return calculateRiskScore({
    progressGapAbove20,
    workloadExceedsCapacity,
    dueWithin2Days,
    blockedDependency,
    memberUnavailable,
    communicationDelay,
    missingOwner,
  });
}
