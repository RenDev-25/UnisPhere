import type { CoordinatorDashboardMock } from '../types/analytics.types';
// Static labels only. All metrics and chart series are populated by dashboard.service.ts.
export const mockCoordinatorDashboard: CoordinatorDashboardMock = {
 heading:{ college:'College of Informatics and Computing Sciences', portalLabel:'OJT Coordinator Portal', title:'Dashboard', subtitle:'Monitor student eligibility, applications, placements, and deployment across CICS.', academicCycle:'A.Y. 2026-2027', programs:['All Programs (CICS)','BSIT','BSCS'] },
 kpis:[
  {label:'Total OJT Students',value:0,chip:'Registered',accent:'navy'},
  {label:'Eligible Students',value:0,chip:'Cleared',accent:'red'},
  {label:'Pending Applications',value:0,chip:'In Queue',accent:'amber'},
  {label:'Available Company Slots',value:0,chip:'Open Cap',accent:'grey'},
  {label:'Placement Confirmed',value:0,chip:'Confirmed',accent:'navy'},
  {label:'Students Deployed',value:0,chip:'Deployed',accent:'red'},
  {label:'Total Companies',value:0,chip:'Registered',accent:'grey'},
 ], statusDistribution:[], monthlyAnalytics:[], velocityLabel:'No trend data yet', chartSubtitle:'Application and placement activity will appear when dated records exist.', chartFootnote:'No projected or sample figures are displayed.', deploymentTarget:'Deployment targets will be shown when configured.',
};
