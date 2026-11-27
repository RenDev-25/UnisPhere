import { initAppShell } from '../../core/app-shell';
import { getSupervisorDeployedInterns } from '../../services/application.service';
initAppShell();
const root=document.querySelector<HTMLElement>('#sup-interns-list');
async function render(){if(!root)return;const rows=await getSupervisorDeployedInterns();root.innerHTML=rows.length?`<div class="deployment-table-wrap"><table class="deployment-table"><thead><tr><th>Student Name</th><th>Student ID</th><th>Academic Program</th><th>Start Date</th><th>End Date</th><th>Required OJT Hours</th><th>Accumulated Hours</th><th>Status</th></tr></thead><tbody>${rows.map(item=>`<tr><td>${item.studentName}</td><td>${item.studentNumber}</td><td>${item.program}</td><td>${item.deploymentStartDate}</td><td>${item.deploymentEndDate}</td><td>500 HOURS</td><td>${item.accumulatedOjtHours ?? 0}</td><td><span class="sup-pill sup-pill--success">${item.status}</span></td></tr>`).join('')}</tbody></table></div>`:'<p class="sup-muted">No officially deployed interns have been assigned to your company yet.</p>';}
void render().catch(error=>{if(root)root.textContent=error instanceof Error?error.message:'Unable to load deployed interns.'});
window.addEventListener('storage', event => { if (event.key === 'ojtflow_deployments') void render(); });
window.addEventListener('focus', () => void render());
window.setInterval(() => void render(), 5000);
