import { initAppShell } from '../../core/app-shell';
import { getSupervisorAcceptedStudents } from '../../services/application.service';
import { getStoredDeployments } from '../../services/deployment.service';
initAppShell();
const root=document.querySelector<HTMLElement>('#sup-accepted-list');
async function render(){ if(!root)return; const rows=await getSupervisorAcceptedStudents(); const deployments=getStoredDeployments(); root.innerHTML=rows.map(a=>{const deployed=deployments.some(d=>d.applicationId===a.id&&d.status==='Deployed');return `<article class="sup-application"><div><strong>${a.studentName}</strong><p>${a.studentNumber} · ${a.academicProgram}</p><small>${a.studentEmail}</small></div><span class="sup-pill sup-pill--success">Accepted</span><p class="sup-muted">${deployed?'Already Deployed':'Awaiting Official Coordinator Deployment'}</p></article>`;}).join('')||'<p>No accepted students yet.</p>'; }
void render().catch(e=>{if(root)root.textContent=e instanceof Error?e.message:'Unable to load accepted students.'});

window.addEventListener('storage', event => { if (event.key === 'ojtflow_deployments') void render(); });
window.addEventListener('focus', () => void render());
window.setInterval(() => void render(), 5000);
