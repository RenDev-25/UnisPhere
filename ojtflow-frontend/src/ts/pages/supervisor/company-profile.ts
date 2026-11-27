import { initAppShell } from '../../core/app-shell';
import { createCompany, getSupervisorCompany, updateCompany, publishSupervisorCompany, type NewCompanyInput } from '../../services/company.service';
initAppShell();
const form=document.querySelector<HTMLFormElement>('#sup-company-form');
const message=document.querySelector<HTMLElement>('#sup-company-message');
const publish=document.querySelector<HTMLButtonElement>('#sup-publish');
const logoInput=document.querySelector<HTMLInputElement>('#company-logo-file');
const logoPreview=document.querySelector<HTMLImageElement>('#company-logo-preview');
let companyId='';
let logoDataUrl='';
function showMessage(text:string){if(message)message.textContent=text;}
function fill(company:any){
 if(!form)return;
 const values:any={name:company.name,companyEmail:company.companyEmail,companyPhone:company.companyPhone,website:company.website,address:company.companyAddress,municipality:company.municipality,province:company.province,contactName:company.contactName,contactRole:company.contactRole,contactPersonEmail:company.contactPersonEmail,contactPhone:company.contactPhone,slotsOpen:company.totalSlots ?? company.availableSlots,acceptedPrograms:(company.acceptedPrograms||[]).join(', '),partnershipRemarks:company.partnershipRemarks,keyRequirements:(company.requirements||[]).join('\n'),preferredSkills:(company.preferredSkills||[]).join('\n')};
 Object.entries(values).forEach(([key,value])=>{const el=form.elements.namedItem(key) as HTMLInputElement|HTMLTextAreaElement|null;if(el)el.value=String(value??'');});
 companyId=company.id; logoDataUrl=company.logoDataUrl||'';
 const slotSummary=document.querySelector<HTMLElement>('#sup-company-slot-summary');
 if(slotSummary)slotSummary.textContent=`Registered capacity: ${company.totalSlots ?? company.availableSlots} · Occupied: ${company.occupiedSlots ?? 0} · Available: ${company.availableSlots ?? 0}`;
 if(logoPreview){logoPreview.src=logoDataUrl;logoPreview.hidden=!logoDataUrl;}
 if(publish){publish.disabled=false;publish.textContent=company.published?'Unpublish Company':'Publish Company';}
}
getSupervisorCompany().then(company=>{if(company)fill(company);else if(publish)publish.disabled=true;}).catch(e=>showMessage(e instanceof Error?e.message:'Unable to load company profile.'));
logoInput?.addEventListener('change',()=>{
 const file=logoInput.files?.[0]; if(!file)return;
 const allowed=['image/png','image/jpeg','image/webp'];
 if(!allowed.includes(file.type)){logoInput.value='';showMessage('Invalid logo format. Choose a PNG, JPG, or WebP image.');return;}
 if(file.size===0||file.size>2*1024*1024){logoInput.value='';showMessage('Company logo must be a valid image no larger than 2 MB.');return;}
 const reader=new FileReader(); reader.onload=()=>{if(typeof reader.result!=='string'){showMessage('Unable to read the selected logo.');return;}logoDataUrl=reader.result;if(logoPreview){logoPreview.src=logoDataUrl;logoPreview.hidden=false;}showMessage('Logo preview ready. Save the profile to store it.');};reader.onerror=()=>showMessage('Unable to read the selected logo.');reader.readAsDataURL(file);
});
form?.addEventListener('submit',async e=>{
 e.preventDefault();if(!form.reportValidity())return;
 if(!logoDataUrl){showMessage('Company logo is required. Please select a PNG, JPG, or WebP logo before saving.');logoInput?.focus();return;}
 const d=new FormData(form);
 const input:NewCompanyInput={name:String(d.get('name')||''),companyEmail:String(d.get('companyEmail')||''),companyPhone:String(d.get('companyPhone')||''),website:String(d.get('website')||''),address:String(d.get('address')||''),municipality:String(d.get('municipality')||''),province:String(d.get('province')||''),contactName:String(d.get('contactName')||''),contactRole:String(d.get('contactRole')||''),contactPersonEmail:String(d.get('contactPersonEmail')||''),contactPhone:String(d.get('contactPhone')||''),slotsOpen:Number(d.get('slotsOpen')||0),acceptedPrograms:String(d.get('acceptedPrograms')||'').split(',').map(x=>x.trim()).filter(Boolean),status:'Active',partnershipRemarks:String(d.get('partnershipRemarks')||''),keyRequirements:String(d.get('keyRequirements')||'').split(/\n|,/).map(x=>x.trim()).filter(Boolean),preferredSkills:String(d.get('preferredSkills')||'').split(/\n|,/).map(x=>x.trim()).filter(Boolean),logoDataUrl};
 try{const saved=companyId?await updateCompany(companyId,input):await createCompany(input);fill(saved);showMessage('Company profile and logo saved. Review the details, then publish it when ready.');}catch(err){showMessage(err instanceof Error?err.message:'Unable to save company profile.');}
});
publish?.addEventListener('click',async()=>{try{const current=await getSupervisorCompany();const updated=await publishSupervisorCompany(!(current?.published));if(publish)publish.textContent=updated.published?'Unpublish Company':'Publish Company';showMessage(updated.published?'Your company is now published and visible to students.':'Your company is unpublished and hidden from students.');}catch(e){showMessage(e instanceof Error?e.message:'Unable to change publication status.');}});

window.addEventListener('storage', event => {
 if (event.key === 'ojtflow_company_records_updated' || event.key === 'ojtflow_deployments') {
   void getSupervisorCompany().then(company => { if (company) fill(company); });
 }
});
