/* UNISphere application presentation defaults. No sample application records. */
import type { ApplicationPageHeading, ApplicationFilters, ApplicationEmptyState, ApplicationPlacementNotice } from '../types/application.types';

export const mockApplicationHeading: ApplicationPageHeading = {
  title: 'My Applications', totalLabel: 'TOTAL APPLICATIONS: 00',
  subtitle: 'Track and manage your submitted OJT applications across verified Host Training Establishments.',
};
export const mockApplicationFilters: ApplicationFilters = {
  searchPlaceholder: 'Search company or location...',
  statusOptions: ['Pending Decision', 'Under Review', 'Accepted', 'Rejected', 'Cancelled'],
  sortOptions: [{ label: 'Newest First', value: 'newest' }, { label: 'Oldest First', value: 'oldest' }],
  defaultSort: 'newest',
};
export const mockApplicationEmptyState: ApplicationEmptyState = {
  title: "You haven't submitted any applications yet.",
  description: 'Explore verified Host Training Establishments and submit your first OJT application to get started.',
  buttonLabel: 'Browse Companies', buttonHref: '/pages/student/browse-companies.html',
};
export const mockApplicationPlacementNotice: ApplicationPlacementNotice = {
  title: 'Institutional Placement Notice',
  message: 'An Accepted application does not constitute a confirmed OJT placement. Final placement confirmation is subject to institutional processing and official deployment approval.',
  linkLabel: 'My Deployment', linkHref: '/pages/student/my-deployment.html',
};
