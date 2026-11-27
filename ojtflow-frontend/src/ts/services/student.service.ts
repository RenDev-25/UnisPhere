import { ENV } from '../core/env';
import { getSession } from '../core/session';
import { mockCoordinatorStudentsPage, coordinatorStudentDetailsMock } from '../mocks/coordinator-students.mock';
import type { StudentDashboardData } from '../types/student.types';
import type { User } from '../types/user.types';
import type { RegisteredStudentRecord } from '../types/student.types';
import { getCoordinatorStudentRequirementRecords } from './requirement.service';
const ACCOUNTS='ojtflow_student_accounts';
type StoredAccount={user:User;passwordHash:string};
function getRegisteredStudents():User[]{try{const raw=localStorage.getItem(ACCOUNTS);if(!raw)return[];const accounts=JSON.parse(raw) as StoredAccount[];return Array.isArray(accounts)?accounts.filter(a=>a?.user?.portal==='student'&&typeof a.user.email==='string').map(a=>a.user):[];}catch(error){console.error('Unable to read registered student accounts:',error);return[];}}
export async function getStudentProfile():Promise<StudentDashboardData['student']>{
 if(!ENV.useMocks)throw new Error('Student API integration is not available yet.');
 const session=getSession(); const user=session?.user;
 if(!user||user.portal!=='student')throw new Error('Student session not found.');
 const accounts=getRegisteredStudents();
 const current=accounts.find(account=>account.id===user.id) || user;
 return {name:current.name,firstName:current.name.trim().split(/\s+/)[0]||'Student',studentNumber:current.identifier||'Not provided',college:'CICS',program:current.program||'Not provided',academicYear:'A.Y. 2026-2027'};
}
export async function getCoordinatorStudents(){if(!ENV.useMocks)throw new Error('Student API integration is not available yet.');const active=getSession()?.user;if(!active||active.portal!=='coordinator')throw new Error('Coordinator access is required.');const eligibility=(()=>{try{return JSON.parse(localStorage.getItem('ojtflow_student_eligibility')||'{}') as Record<string,{status?:string}>;}catch{return {};}})();

const deployments=(()=>{try{return JSON.parse(localStorage.getItem('ojtflow_deployments')||'[]') as Array<{studentId:string;status:string}>;}catch{return [];}})();
const records:RegisteredStudentRecord[]=getRegisteredStudents().map(user=>{const eligibilityStatus=eligibility[user.id]?.status==='Eligible'?'Eligible':eligibility[user.id]?.status==='Not Eligible'?'Not Eligible':'For Review';const hasDeployment=deployments.some(x=>x.studentId===user.id&&x.status==='Deployed');return {id:user.id,fullName:user.name,email:user.email,studentNumber:user.identifier||'Not provided',program:user.program||'Not provided',eligibilityStatus,ojtStatus:hasDeployment?'In Progress':'Not Started'};});const eligible=records.filter(x=>x.eligibilityStatus==='Eligible').length;return {...mockCoordinatorStudentsPage,summary:{totalStudents:records.length,eligibleStudents:eligible,notYetEligibleStudents:records.length-eligible},recordsCard:{...mockCoordinatorStudentsPage.recordsCard,totalChip:`${records.length} Students`,syncNote:'Registered student accounts synchronized'},programs:[...new Set(records.map(x=>x.program))],records};}
export async function getCoordinatorStudentDetails(id?:string){
 if(!ENV.useMocks)throw new Error('Student API integration is not available yet.');
 const active=getSession()?.user;if(!active||active.portal!=='coordinator')throw new Error('Coordinator access is required.');
 const studentId=id||new URLSearchParams(window.location.search).get('id')||'';
 const user=getRegisteredStudents().find(x=>x.id===studentId);if(!user)throw new Error('Student record was not found.');
 const requirements=getCoordinatorStudentRequirementRecords(studentId);
 const approved=requirements.filter(item=>item.status==='Passed').length;
 const incomplete=requirements.filter(item=>item.status!=='Passed');
 const eligibility=(()=>{try{return JSON.parse(localStorage.getItem('ojtflow_student_eligibility')||'{}') as Record<string,{status?:string}>;}catch{return {};}})();
 const applications=(()=>{try{const raw=JSON.parse(localStorage.getItem('ojtflow_applications')||'[]');return Array.isArray(raw)?raw.filter((x:any)=>x&&x.studentId===studentId):[];}catch{return [];}})();
 const deployments=(()=>{try{const raw=JSON.parse(localStorage.getItem('ojtflow_deployments')||'[]');return Array.isArray(raw)?raw.filter((x:any)=>x&&x.studentId===studentId):[];}catch{return [];}})();
 const activeDeployment=deployments.find((x:any)=>x.status==='Deployed');
 const applicationStatus=applications.length?applications.map((item:any)=>{
   if(item.status==='Accepted'&&item.deploymentStatus==='Deployed')return 'Officially Deployed';
   if(item.status==='Accepted'&&item.deploymentStatus==='Requested')return 'Accepted by Student — Awaiting Official Coordinator Deployment';
   if(item.status==='Accepted')return 'Awaiting Student Response to Offer';
   if(item.status==='Pending Decision'||item.status==='Under Review')return 'Pending Supervisor Review';
   return String(item.status||'Unknown');
 }).filter((value:string,index:number,all:string[])=>all.indexOf(value)===index).join('; '):'No Applications';
 const eligibilityStatus=eligibility[studentId]?.status||'For Review';
 return {
   ...coordinatorStudentDetailsMock,studentNumber:user.identifier||'Not provided',fullName:user.name,
   program:user.program||'Not provided',institutionalEmail:user.email,
   ojtInformation:{
     academicYear:'A.Y. 2026–2027',eligibilityStatus,
     approvedRequirements:approved,totalRequirements:requirements.length,
     completionPercentage:requirements.length?Math.round(approved/requirements.length*100):0,
     incompleteRequirements:incomplete.map(item=>({id:item.id,title:item.title,status:item.status})),
     applicationStatus,
     deploymentStatus:activeDeployment?'Officially Deployed':deployments.some((x:any)=>x.status==='Undeployed')?'Previously Deployed — Undeployed':'Not Yet Deployed',
   }
 };
}
export function getRegisteredStudentAccounts():User[]{return getRegisteredStudents();}
