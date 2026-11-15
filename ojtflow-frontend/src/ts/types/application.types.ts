
/* src/ts/types/application.types.ts */

/* ========================================
   APPLICATION STATUS
======================================== */

export type ApplicationStatus =
  | 'Under Review'
  | 'Accepted'
  | 'Pending Decision'
  | 'Rejected';

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
