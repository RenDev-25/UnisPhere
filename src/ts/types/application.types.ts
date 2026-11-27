
/* src/ts/types/application.types.ts */

/* ========================================
   APPLICATION STATUS
======================================== */

export type ApplicationStatus =
  | 'Under Review'
  | 'Accepted'
  | 'Pending Decision'
  | 'Rejected'
  | 'Cancelled';

/* ========================================
   APPLICATION RECORD
======================================== */

export interface ApplicationRecord {
  id: string;
  companyId: string;
  initials: string;
  companyName: string;
  location: string;
  dateApplied: string;
  academicProgram: string;
  status: ApplicationStatus;
  remarks: string;
  nextAction?: string;
  /** Resume snapshot attached to this specific submitted application. */
  resumeFileName?: string;
  resumeMimeType?: 'application/pdf';
  resumeDataUrl?: string;
  resumeSize?: number;
  deploymentRequestedAt?: string;
  deploymentStatus?: 'Not Requested' | 'Requested' | 'Deployed' | 'Undeployed';
}

/* ========================================
   APPLICATION PAGE HEADING
======================================== */

export interface ApplicationPageHeading {
  title: string;
  totalLabel: string;
  subtitle: string;
}

/* ========================================
   APPLICATION FILTERS
======================================== */

export interface ApplicationFilters {
  searchPlaceholder: string;
  statusOptions: ApplicationStatus[];
  sortOptions: {
    label: string;
    value: 'newest' | 'oldest';
  }[];
  defaultSort: 'newest' | 'oldest';
}

/* ========================================
   PLACEMENT NOTICE
======================================== */

export interface ApplicationPlacementNotice {
  title: string;
  message: string;
  linkLabel: string;
  linkHref: string;
}

/* ========================================
   APPLICATION EMPTY STATE
======================================== */

export interface ApplicationEmptyState {
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
}



/* ========================================
   COORDINATOR APPLICATIONS MANAGEMENT
======================================== */

export type CoordinatorApplicationStatus =
  | 'Pending'
  | 'Under Review'
  | 'Accepted'
  | 'Rejected'
  | 'Cancelled';

export interface CoordinatorApplicationSummary {
  total: number;
  pending: number;
  underReview: number;
  accepted: number;
  rejected: number;
}

export interface CoordinatorApplicationRecord {
  id: string;
  studentName: string;
  studentNumber: string;
  academicProgram: 'BSIT' | 'BSCS';
  companyName: string;
  applicationDate: string;
  status: CoordinatorApplicationStatus;
}

export interface CoordinatorApplicationManagementData {
  summary: CoordinatorApplicationSummary;
  records: CoordinatorApplicationRecord[];
  totalRecords: number;
  pageSize: number;
}




/* =========================================================
   STAGE 7.12 — APPLICATION DETAILS
========================================================= */

/* ========================================
   APPLICATION DETAILS HEADER
======================================== */

export interface ApplicationDetailsHeader {
  backLabel: string;
  title: string;
  subtitle: string;
  academicYear: string;
  statusLabel: string;
}

/* ========================================
   STUDENT DETAILS CARD
======================================== */

export interface ApplicationDetailsStudent {
  fullName: string;
  studentNumber: string;
  academicProgram: 'BSIT' | 'BSCS';
  yearLevel: string;
  verificationStatus: string;
}

/* ========================================
   APPLICATION INFORMATION
======================================== */

export interface ApplicationDetailsInformation {
  applicationId: string;
  academicProgram: 'BSIT' | 'BSCS';
  applicationDate: string;
  studentEmail: string;
}

/* ========================================
   COMPANY INFORMATION
======================================== */

export interface ApplicationDetailsCompany {
  companyName: string;
  accreditationLabel: string;
  contactPerson: string;
  location: string;
  contactNumber: string;
}

/* ========================================
   APPLICATION STATUS UPDATE
======================================== */

export interface ApplicationDetailsStatusUpdate {
  initialStatus: CoordinatorApplicationStatus;
  coordinatorRemarks: string;
  maxRemarksLength: number;
}

/* ========================================
   COMPLETE APPLICATION DETAILS DATA
======================================== */

export interface ApplicationDetailsMockData {
  header: ApplicationDetailsHeader;
  student: ApplicationDetailsStudent;
  application: ApplicationDetailsInformation;
  company: ApplicationDetailsCompany;
  statusUpdate: ApplicationDetailsStatusUpdate;
}
