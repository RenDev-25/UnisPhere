import { initAppShell } from '../../core/app-shell';
import { getSupervisorApplications } from '../../services/application.service';
import { getSupervisorCompany } from '../../services/company.service';
import { getSupervisorDeployedInterns } from '../../services/application.service';
import { escapeHtml } from '../../utils/dom';
initAppShell();
let rendering = false;
async function render(): Promise<void> {
 if (rendering) return;
 rendering = true;
 try {
 const [company,apps,interns]=await Promise.all([getSupervisorCompany(),getSupervisorApplications(),getSupervisorDeployedInterns()]);
 const accepted=apps.filter(a=>a.status==='Accepted').length;
 const pending=apps.filter(a=>a.status==='Pending Decision'||a.status==='Under Review').length;
 const available=Number(company?.availableSlots ?? 0);
 const k=document.querySelector<HTMLElement>('#sup-kpis');
 if(k) k.innerHTML=[
  ['Total Applications',apps.length],['Pending Review',pending],['Accepted Students',accepted],
  ['Currently Deployed',interns.length],['Available Company Slots',available],
 ].map(([label,value])=>`<article class="card sup-kpi"><span>${label}</span><strong>${value}</strong></article>`).join('');
 const c=document.querySelector<HTMLElement>('#sup-company-status');
 if(c) c.innerHTML=company?`<strong>${escapeHtml(company.name)}</strong><p>${company.published?'Published and visible to students':'Not published yet'}</p><p>Capacity: ${company.totalSlots ?? company.availableSlots} · Occupied: ${company.occupiedSlots ?? 0} · Available: ${available}</p>`:'<p>You have not created a company profile yet.</p>';
 const recent=document.querySelector<HTMLElement>('#sup-recent-applications');
 if(recent) recent.innerHTML=apps.slice(0,5).map(a=>`<p>${escapeHtml(a.studentName)} — ${escapeHtml(a.companyName)} <span class="sup-pill">${escapeHtml(a.status)}</span></p>`).join('')||'<p>No applications yet.</p>';
 } finally { rendering = false; }
}
void render().catch(e=>{const c=document.querySelector<HTMLElement>('#sup-company-status'); if(c)c.textContent=e instanceof Error?e.message:'Unable to load dashboard.';});
window.addEventListener('focus',()=>void render());
window.addEventListener('storage',event=>{
 if(['ojtflow_applications','ojtflow_deployments','ojtflow_company_records','ojtflow_company_records_updated'].includes(event.key||'')) void render();
});
