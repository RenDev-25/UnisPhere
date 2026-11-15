
/* src/ts/types/requirement.types.ts */

/* ========================================
   REQUIREMENT TYPES
======================================== */

export type RequirementStatus =
  | 'Verified'
  | 'Pending Review'
  | 'Not Submitted';

export interface RequirementHeading {
  title: string;
  progressLabel: string;
  progressPercent: number;
  subtitle: string;
  curriculum: string;
  hoursTarget: number;
}

export interface RequirementCompletion {
  academicYear: string;
  completed: number;
  total: number;
  actionNeeded: number;
  status: string;
  minimumThreshold: number;
  stage: string;
}

export interface RequirementRecord {
  id: string;
  number: number;
  title: string;
  category: string;
  description: string;
  icon: string;
  status: RequirementStatus;
  submittedDate: string;
  submissionNote: string;
  documentId: string;
  actionRequired?: string;
}

export interface RequirementAssistance {
  title: string;
  description: string;
  schedule: string;
  buttonLabel: string;
}

export interface RequirementDetail {
  requirementId: string;
  itemLabel: string;
  category: string;
  documentId: string;
  title: string;
  icon: string;
  status: RequirementStatus;
  description: string;
  evaluationStatus: string;
  evaluationNote: string;
  dateChecked: string;
  coordinatorName: string;
  remarks: string;
}
