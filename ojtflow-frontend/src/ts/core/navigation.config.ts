
/* src/ts/core/navigation.config.ts */

import type { Portal } from '../types/user.types';

/* ========================================
   NAVIGATION TYPES
======================================== */

export interface NavigationLink {
  label: string;
  href: string;
  icon: string;
  pageKey: string;
  type: 'link';
}

export interface NavigationAction {
  label: string;
  icon: string;
  pageKey: string;
  type: 'action';
  action: 'logout';
}

export type NavigationItem = NavigationLink | NavigationAction;

/* ========================================
   STUDENT NAVIGATION
======================================== */
export const studentNavigation: NavigationLink[] = [
  {
    label: 'Dashboard',
    href: '/pages/student/dashboard.html',
    icon: 'dashboard',
    pageKey: 'student-dashboard',
    type: 'link'
  },
    {
      label: 'Browse Companies',
      href: '/pages/student/browse-companies.html',
      icon: 'domain',
      pageKey: 'student-browse-companies',
      type: 'link'
    },
  {
    label: 'My Applications',
    href: '/pages/student/my-applications.html',
    icon: 'fact_check',
    pageKey: 'student-applications',
    type: 'link'
  },
  {
    label: 'OJT Requirements',
    href: '/pages/student/ojt-requirements.html',
    icon: 'inventory_2',
    pageKey: 'student-requirements',
    type: 'link'
  },
  {
    label: 'My Deployment',
    href: '/pages/student/my-deployment.html',
    icon: 'engineering',
    pageKey: 'student-deployment',
    type: 'link'
  }
];
/* ========================================
   COORDINATOR NAVIGATION
======================================== */

export const coordinatorNavigation: NavigationLink[] = [
  {
    label: 'Dashboard',
    href: '/pages/coordinator/dashboard.html',
    icon: 'grid_view',
    pageKey: 'coordinator-dashboard',
    type: 'link'
  },
  {
    label: 'Student Management',
    href: '/pages/coordinator/student-management.html',
    icon: 'group',
    pageKey: 'coordinator-student-management',
    type: 'link'
  },
  {
    label: 'Company Management',
    href: '/pages/coordinator/company-management.html',
    icon: 'apartment',
    pageKey: 'coordinator-company-management',
    type: 'link'
  },
  {
    label: 'Eligibility & Requirements',
    href: '/pages/coordinator/eligibility-requirements.html',
    icon: 'fact_check',
    pageKey: 'coordinator-eligibility-requirements',
    type: 'link'
  },
  {
    label: 'Applications Management',
    href: '/pages/coordinator/applications-management.html',
    icon: 'assignment_turned_in',
    pageKey: 'coordinator-applications-management',
    type: 'link'
  }
];


/* ========================================
   LOGOUT ACTION
======================================== */

export const logoutNavigationItem: NavigationAction = {
  label: 'Log Out',
  icon: 'logout',
  pageKey: 'logout',
  type: 'action',
  action: 'logout'
};

/* ========================================
   PORTAL NAVIGATION CONFIGURATION
======================================== */

export const navigationConfig: Record<Portal, NavigationLink[]> = {
  student: studentNavigation,
  coordinator: coordinatorNavigation
};

/* ========================================
   NAVIGATION HELPERS
======================================== */

export function getNavigationItems(
  portal: Portal
): NavigationLink[] {
  return navigationConfig[portal];
}

export function getPortalSectionLabel(portal: Portal): string {
  return portal === 'student'
    ? 'ACADEMIC WORKFLOW'
    : 'MAIN MENU';
}
