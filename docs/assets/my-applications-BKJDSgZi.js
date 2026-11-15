import"./session-C6yT7gL8.js";import{e as c,i as T}from"./dom-DcOuyLef.js";import{i as k}from"./app-shell-PbQyGsAe.js";import"./route-guard-MQy5MPzz.js";const _={title:"My Applications",subtitle:"Track and manage your submitted OJT applications across verified Host Training Establishments."},f={searchPlaceholder:"Search company or location...",statusOptions:["Pending Decision","Under Review","Accepted","Rejected"],sortOptions:[{label:"Newest First",value:"newest"},{label:"Oldest First",value:"oldest"}],defaultSort:"newest"},y=[{id:"application-001",companyId:"company-001",initials:"CTI",companyName:"Central Tech Innovations",location:"Batangas City, Batangas",dateApplied:"2026-11-12",academicProgram:"BS Computer Science",status:"Under Review",remarks:"Your application has been received and is currently being reviewed by the HTE Coordinator. Please wait for further updates regarding your application."},{id:"application-002",companyId:"company-002",initials:"SR",companyName:"Southern Ridge Digital Services",location:"Lipa City, Batangas",dateApplied:"2026-11-10",academicProgram:"BS Computer Science",status:"Accepted",remarks:"Your application has been accepted by the Host Training Establishment. Please coordinate with your OJT Coordinator regarding the next steps for institutional placement processing.",nextAction:"Monitor My Deployment for official placement confirmation and deployment instructions."},{id:"application-003",companyId:"company-004",initials:"BPC",companyName:"Batangas Precision Computing",location:"Santo Tomas, Batangas",dateApplied:"2026-11-08",academicProgram:"BS Computer Science",status:"Pending Decision",remarks:"Your application has been submitted successfully. The establishment has not yet provided a final decision."},{id:"application-004",companyId:"company-003",initials:"LTC",companyName:"Lakeside Technology Center",location:"Tanauan City, Batangas",dateApplied:"2026-11-05",academicProgram:"BS Computer Science",status:"Rejected",remarks:"The establishment has decided not to proceed with your application at this time. You may explore other verified Host Training Establishments."}],v={title:"You haven't submitted any applications yet.",description:"Explore verified Host Training Establishments and submit your first OJT application to get started.",buttonLabel:"Browse Companies",buttonHref:"/pages/student/browse-companies.html"},S={title:"Institutional Placement Notice",message:"An Accepted application does not constitute a confirmed OJT placement. Final placement confirmation is subject to institutional processing and official deployment approval.",linkLabel:"My Deployment",linkHref:"/pages/student/my-deployment.html"};k();const l=document.querySelector("#application-search"),p=document.querySelector("#application-status-filter"),r=document.querySelector("#application-sort"),C=document.querySelector("#reset-application-filters"),m=document.querySelector("#applications-list"),i=document.querySelector("#applications-empty"),A=document.querySelector("#applications-total"),s=document.querySelector("#application-details-modal");function w(t){return{"Under Review":"application-status--under-review",Accepted:"application-status--accepted","Pending Decision":"application-status--pending-decision",Rejected:"application-status--rejected"}[t]}function q(t){const e=new Date(`${t}T00:00:00`);return Number.isNaN(e.getTime())?t:new Intl.DateTimeFormat("en-PH",{month:"short",day:"numeric",year:"numeric"}).format(e)}function P(){const t=document.querySelector(".applications-title-row .page-title"),e=document.querySelector(".applications-header .page-subtitle");t&&(t.textContent=_.title),e&&(e.textContent=_.subtitle),A&&(A.textContent=`TOTAL APPLICATIONS: ${String(y.length).padStart(2,"0")}`)}function $(){l&&(l.placeholder=f.searchPlaceholder),p&&(p.innerHTML=`
      <option value="all">All Statuses</option>

      ${f.statusOptions.map(t=>`
        <option value="${c(t)}">
          ${c(t)}
        </option>
      `).join("")}
    `),r&&(r.innerHTML=f.sortOptions.map(t=>`
        <option value="${t.value}">
          ${c(t.label)}
        </option>
      `).join(""),r.value=f.defaultSort)}function H(t){const e=w(t.status);return`

    <article
      class="application-card"
      data-application-id="${c(t.id)}"
    >

      <div class="application-card__main">

        <div
          class="application-card__initials"
          aria-hidden="true"
        >
          ${c(t.initials)}
        </div>

        <div class="application-card__information">

          <h2 class="application-card__company">
            ${c(t.companyName)}
          </h2>

          <div class="application-card__meta">

            <span class="application-card__meta-item">

              ${T("location_on","application-card__meta-icon")}

              ${c(t.location)}

            </span>

            <span class="application-card__meta-item">

              ${T("calendar_today","application-card__meta-icon")}

              Applied:
              ${c(q(t.dateApplied))}

            </span>

          </div>

        </div>

      </div>


      <div class="application-card__actions">

        <span
          class="application-status ${e}"
        >
          ${c(t.status)}
        </span>

        <button
          class="btn btn--secondary btn--small application-card__view"
          type="button"
          data-view-application="${c(t.id)}"
        >
          View Details
        </button>

      </div>

    </article>

  `}function N(){const t=(l==null?void 0:l.value.trim().toLowerCase())??"",e=(p==null?void 0:p.value)??"all",n=(r==null?void 0:r.value)??"newest";let a=[...y];return t&&(a=a.filter(o=>o.companyName.toLowerCase().includes(t)||o.location.toLowerCase().includes(t))),e!=="all"&&(a=a.filter(o=>o.status===e)),a.sort((o,h)=>{const d=new Date(o.dateApplied).getTime(),u=new Date(h.dateApplied).getTime();return n==="oldest"?d-u:u-d}),a}function g(){if(!m||!i)return;const t=N();if(A&&(A.textContent=`TOTAL APPLICATIONS: ${String(y.length).padStart(2,"0")}`),y.length===0){m.innerHTML="",i.hidden=!1;return}if(i.hidden=!0,t.length===0){m.innerHTML=`
      <div class="applications-no-results">
        No matching applications found.
      </div>
    `;return}m.innerHTML=t.map(H).join(""),m.querySelectorAll("[data-view-application]").forEach(e=>{e.addEventListener("click",()=>{const n=e.dataset.viewApplication;if(!n)return;const a=y.find(o=>o.id===n);a&&O(a)})})}function O(t){if(!s)return;const e=document.querySelector("#application-modal-company"),n=document.querySelector("#application-modal-date"),a=document.querySelector("#application-modal-program"),o=document.querySelector("#application-modal-status"),h=document.querySelector("#application-modal-remarks"),d=document.querySelector("#application-modal-next-action"),u=document.querySelector("#application-modal-next-action-text");!e||!n||!a||!o||!h||!d||!u||(e.textContent=t.companyName,n.textContent=q(t.dateApplied),a.textContent=t.academicProgram,o.innerHTML=`

    <span class="application-status ${w(t.status)}">

      ${c(t.status)}

    </span>

  `,h.textContent=t.remarks,t.status==="Accepted"&&t.nextAction?(d.hidden=!1,u.textContent=t.nextAction):(d.hidden=!0,u.textContent=""),s.open||s.showModal())}function b(){s!=null&&s.open&&s.close()}var x;(x=document.querySelector("#application-modal-close"))==null||x.addEventListener("click",b);var L;(L=document.querySelector("#application-modal-close-icon"))==null||L.addEventListener("click",b);s==null||s.addEventListener("click",t=>{t.target===s&&b()});function D(){l&&(l.value=""),p&&(p.value="all"),r&&(r.value=f.defaultSort),g()}C==null||C.addEventListener("click",D);l==null||l.addEventListener("input",g);p==null||p.addEventListener("change",g);r==null||r.addEventListener("change",g);function E(){const t=document.querySelector(".applications-notice__title"),e=document.querySelector(".applications-notice__text");if(!t||!e)return;t.textContent=S.title,e.textContent=S.message+" ";const n=document.createElement("a");n.href=S.linkHref,n.textContent=S.linkLabel,e.appendChild(n),e.appendChild(document.createTextNode(" page for your official placement status and deployment information."))}function M(){const t=i==null?void 0:i.querySelector(".empty-state__title"),e=i==null?void 0:i.querySelector(".empty-state__description"),n=i==null?void 0:i.querySelector(".empty-state__action a");t&&(t.textContent=v.title),e&&(e.textContent=v.description),n&&(n.textContent=v.buttonLabel,n.href=v.buttonHref)}function B(){P(),$(),M(),E(),g()}B();
