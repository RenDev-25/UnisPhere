/* =========================================================
   UNISphere — Eligibility Types
   Stage 7.9: Eligibility & Requirements
   ========================================================= */

export type EligibilityStatus =
  | 'Eligible'
  | 'For Review'
  | 'Incomplete'
  | 'Not Eligible';

// Coordinator's saved decision; kept separate from the calculated list status.
export type EligibilityDecision = 'Eligible' | 'Not Eligible' | 'For Review';

export interface EligibilitySummary {
  totalStudents: number;
  forReview: number;
  eligible: number;
  incompleteRequirements: number;
}

export interface EligibilityRecord {
  id: string;
  studentName: string;
  studentNumber: string;
  program: string;
  requirements: string;
  status: EligibilityStatus;
}

export interface EligibilityPageData {
  summary: EligibilitySummary;
  records: EligibilityRecord[];
  programs: string[];
  statuses: EligibilityStatus[];
}

/* =========================================================
   UNISphere — Eligibility Details Types
   Stage 7.10: Student Eligibility Details
   ========================================================= */

export type RequirementVerificationStatus = 'Passed' | 'Pending' | 'Missing';

export interface EligibilityStudentDetails {
  studentName: string;
  studentNumber: string;
  program: string;
  yearLevel: string;
  section: string;
  studentType: string;
  eligibilityStatus: 'Eligible' | 'For Review' | 'Incomplete' | 'Not Eligible';
}

export interface EligibilityRequirementItem {
  id: string;
  number: number;
  title: string;
  description: string;
  status: RequirementVerificationStatus;
}

export interface EligibilityOverview {
  completedRequirements: number;
  totalRequirements: number;
  completionPercentage: number;
  standardLabel: string;
  completionMessage: string;
}

export interface CoordinatorEligibilityRemarks {
  remarks: string;
}

export interface EligibilityDetailsData {
  student: EligibilityStudentDetails;
  overview: EligibilityOverview;
  requirements: EligibilityRequirementItem[];
  coordinatorRemarks: CoordinatorEligibilityRemarks;
}

