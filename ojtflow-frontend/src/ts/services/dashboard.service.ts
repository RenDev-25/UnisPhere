import { getCoordinatorPublishedCompanies, getCoordinatorCompanyStats } from './company.service';
import { getCoordinatorStudents, getStudentProfile } from './student.service';
import { getCoordinatorApplications, getStudentApplications } from './application.service';
import { getEligibilityPage } from './eligibility.service';
import { getStudentRequirements } from './requirement.service';
import { getMyDeployment, getStoredDeployments } from './deployment.service';
import { ENV } from '../core/env';
import { mockCoordinatorDashboard } from '../mocks/coordinator-dashboard.mock';
import type { StudentDashboardData } from '../types/student.types';
import type { CoordinatorDashboardMock } from '../types/analytics.types';

export async function getStudentDashboard():Promise<StudentDashboardData>{
 if(!ENV.useMocks) throw new Error('Dashboard API integration is not available yet.');
 const {getSession}=await import('../core/session'); const user=getSession()?.user;
 const [student,appData,requirementData,deployment]=await Promise.all([
   getStudentProfile(), getStudentApplications(), getStudentRequirements(), getMyDeployment(),
 ]);
 const studentApps=appData.records;
 const uploaded=requirementData.records.filter(x=>x.status==='Passed').length;
 const eligibilityMap=(()=>{try{return JSON.parse(localStorage.getItem('ojtflow_student_eligibility')||'{}') as Record<string,{status?:string}>;}catch{return {};}})();
 const studentEligibility=user?.id?eligibilityMap[user.id]?.status||'For Review':'For Review';
 const deployed=Boolean(deployment.placement && deployment.placement.status.status==='Deployed');
 return {
  student, eligibility:studentEligibility, deploymentStatus:deployed?'Deployed':'Not Yet Deployed',
  applications:{
   total:studentApps.length,
   underReview:studentApps.filter(x=>x.status==='Under Review').length,
   accepted:studentApps.filter(x=>x.status==='Accepted').length,
   rejected:studentApps.filter(x=>x.status==='Rejected').length,
   pending:studentApps.filter(x=>x.status==='Pending Decision').length,
   cancelled:studentApps.filter(x=>x.status==='Cancelled').length,
  },
  requirements:{
   total:requirementData.records.length, completed:uploaded,
   pendingVerification:requirementData.records.filter(x=>x.status==='Pending').length, forRevision:requirementData.records.filter(x=>x.status==='Missing').length,
  },
 };
}
export async function getCoordinatorDashboard(selectedProgram = 'All Programs (CICS)'):Promise<CoordinatorDashboardMock>{
 if(!ENV.useMocks) throw new Error('Dashboard API integration is not available yet.');
 const [students,apps,eligibility,companies,companyStats]=await Promise.all([
   getCoordinatorStudents(),getCoordinatorApplications(),getEligibilityPage(),getCoordinatorPublishedCompanies(),getCoordinatorCompanyStats(selectedProgram),
 ]);
 const isAll = !selectedProgram || selectedProgram.toLocaleLowerCase() === 'all programs (cics)';
 const selected = selectedProgram.trim().toLocaleLowerCase();
 const matchesProgram = (value: string) => isAll || value.trim().toLocaleLowerCase() === selected;
 const filteredStudents = students.records.filter(record => matchesProgram(record.program));
 const filteredEligibility = eligibility.records.filter(record => matchesProgram(record.program));
 const filteredApps = apps.records.filter(record => matchesProgram(record.academicProgram));
 const filteredCompanies = companies.records.filter(record => (record.acceptedPrograms || [record.program]).some(matchesProgram));
 const deployments=getStoredDeployments().filter(item => isAll || matchesProgram(String(item.program || '')));
 const eligibleCount = filteredEligibility.filter(item => item.status === 'Eligible').length;
 const reviewCount = filteredEligibility.filter(item => item.status === 'For Review').length;
 const incompleteCount = filteredEligibility.filter(item => item.status === 'Incomplete').length;
 const values:Record<string,number>={
  'Total OJT Students':filteredStudents.length,
  'Eligible Students':eligibleCount,
  'Pending Applications':filteredApps.filter(item => item.status === 'Pending' || item.status === 'Under Review').length,
  'Available Company Slots':filteredCompanies.filter(item => item.status === 'Active').reduce((sum,item)=>sum+Number(item.availableSlots||0),0),
  'Placement Confirmed':deployments.filter(item=>item.status==='Placement Confirmed').length,
  'Students Deployed':deployments.filter(item=>item.status==='Deployed').length,
  'Total Companies':companyStats.totalCompanies,
 };
 const dashboard=JSON.parse(JSON.stringify(mockCoordinatorDashboard)) as CoordinatorDashboardMock;
 dashboard.kpis=dashboard.kpis.map(kpi=>({...kpi,value:values[kpi.label]??0}));
 const counts=[
  {label:'Eligible',value:eligibleCount,color:'#2A9D8F'},
  {label:'For Review',value:reviewCount,color:'#E5A000'},
  {label:'Incomplete',value:incompleteCount,color:'#D95D5D'},
  {label:'Other Students',value:Math.max(0,filteredStudents.length-filteredEligibility.length),color:'#8B95A5'},
 ].filter(x=>x.value>0);
 dashboard.statusDistribution=counts;
 dashboard.monthlyAnalytics=[];
 dashboard.velocityLabel='Trend unavailable';
 return dashboard;
}
