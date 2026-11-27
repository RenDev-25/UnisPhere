import { ENV } from '../core/env';
import type { DeploymentData } from '../types/deployment.types';
const KEY = 'ojtflow_deployments';
export interface StoredDeployment { id:string; studentId:string; status:'Placement Confirmed'|'Deployed'|'Not Yet Deployed'|'Undeployed'; companyId?:string; companyName?:string; location?:string; applicationId?:string; program?:string; deploymentDate?:string; deploymentStartDate?:string; deploymentEndDate?:string; companySupervisor?:string; requiredOjtHours?:number; accumulatedOjtHours?:number; undeployedAt?:string; undeploymentRemarks?:string }
export function getStoredDeployments(): StoredDeployment[] { try { const value:unknown=JSON.parse(localStorage.getItem(KEY)||'[]'); return Array.isArray(value)?value as StoredDeployment[]:[]; } catch { return []; } }
function duration(start?:string,end?:string):string|null { if(!start||!end)return null; const days=Math.floor((new Date(`${end}T00:00:00`).getTime()-new Date(`${start}T00:00:00`).getTime())/86400000)+1; return Number.isFinite(days)&&days>0?`${days} calendar days`:null; }
export async function getMyDeployment(): Promise<DeploymentData> {
 if(!ENV.useMocks) throw new Error('Deployment API integration is not available yet.');
 const { getSession }=await import('../core/session');
 const user=getSession()?.user;
 const records=user?.portal==='student'
   ? getStoredDeployments().filter(item=>item.studentId===user.id).sort((a,b)=>{
       const aDate=a.undeployedAt||a.deploymentStartDate||a.deploymentDate||'';
       const bDate=b.undeployedAt||b.deploymentStartDate||b.deploymentDate||'';
       return bDate.localeCompare(aDate);
     })
   : [];
 // Only records explicitly marked Deployed are current assignments. Undeployed
 // records are retained separately as history and must never be rendered active.
 const active=records.filter(item=>item.status==='Deployed');
 const latest=records[0];
 const deployment=active[0] || latest;
 const isUndeployed=active.length===0 && Boolean(latest && latest.status==='Undeployed');
 const start=deployment?.deploymentStartDate||deployment?.deploymentDate||'';
 const history=records.map(item=>({
   id:item.id,
   companyName:item.companyName||'Company not recorded',
   location:item.location||null,
   deploymentStartDate:item.deploymentStartDate||item.deploymentDate||null,
   deploymentEndDate:item.deploymentEndDate||null,
   status:item.status,
   undeployedAt:item.undeployedAt||null,
   undeploymentRemarks:item.undeploymentRemarks||null,
   accumulatedOjtHours:Number(item.accumulatedOjtHours||0),
 }));
 return {
  heading:{title:'My Deployment',subtitle:'View your official OJT company assignment and deployment schedule.'},
  deployments:active.map(item=>({companyName:item.companyName||'Not assigned',location:item.location||null,deploymentStartDate:item.deploymentStartDate||item.deploymentDate||null,deploymentEndDate:item.deploymentEndDate||null,applicationId:item.applicationId||null})),
  history,
  placement:deployment?{
   status:{
     title:'Deployment Status',
     status:isUndeployed?'Undeployed':'Deployed',
     message:isUndeployed
       ? 'Your previous deployment has ended. Submit a new company application and complete the offer and coordinator review process before being deployed again.'
       : active.length>1
         ? `You have ${active.length} active company deployments officially confirmed by the OJT Coordinator.`
         : 'You have been officially deployed by the OJT Coordinator.'
   },
   company:{
     companyName:isUndeployed?'Previous deployment ended (historical information only)':deployment.companyName||'Not assigned',
     location:isUndeployed?null:deployment.location||null
   },
   information:{
     academicProgram:deployment.program||null,
     companySupervisor:isUndeployed?null:deployment.companySupervisor||null,
     deploymentDate:isUndeployed?null:start||null,
     deploymentEndDate:isUndeployed?null:deployment.deploymentEndDate||null,
     deploymentDuration:isUndeployed?null:duration(start, deployment.deploymentEndDate),
     ojtCoordinator:'OJT Coordinator',
     requiredOjtHours:500,
     accumulatedOjtHours:Number(deployment.accumulatedOjtHours||0)
   },
   progress:isUndeployed?'undeployed':'deployed',
   placementStatus:isUndeployed?'Previous Deployment Ended':'Officially Deployed',
   previousDeploymentEnded:isUndeployed,
   undeploymentRemarks:isUndeployed ? deployment.undeploymentRemarks || null : null
  }:null
 } as DeploymentData;
}
