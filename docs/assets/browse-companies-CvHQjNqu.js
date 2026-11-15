import"./session-C6yT7gL8.js";import"./dom-DcOuyLef.js";import{i as Z}from"./app-shell-PbQyGsAe.js";import"./route-guard-MQy5MPzz.js";const z={directoryName:"Batangas Directory",breadcrumb:["OJT Placement Office","Host Training Establishments","Batangas Directory"],title:"Accredited Partner Establishments",subtitle:"Explore temporary sample host establishments for your OJT placement.",displayedRange:"Showing 1-6 of 12 Companies",totalCompanies:12},X={searchPlaceholder:"Search company name...",defaultProgram:"All Programs",defaultLocation:"All Batangas Locations",defaultAvailability:"All Statuses",helperText:"Showing all accredited Batangas establishments"},Y={sectionLabel:"Section A",programName:"BS Computer Science",partnerCount:6,focusTags:["Web Development","Software Development","IT Support"]},A=[{id:"company-001",initials:"CTI",name:"Central Tech Innovations",location:"Batangas City, Batangas",municipality:"Batangas City",program:"BS Computer Science",availability:"accepting",slotsOpen:8,description:"A fictional technology company sample focused on software solutions, web applications, and information technology services.",acceptedPrograms:["BS Computer Science","BS Information Technology"],opportunityFocus:["Web Development","Software Development","Database Management"],requirements:["Currently enrolled in an eligible academic program","Endorsement from the OJT coordinator","Updated resume"],preferredSkills:["HTML, CSS, and JavaScript","Basic database knowledge","Problem-solving"],contactName:"Jordan Sample",contactRole:"Sample OJT Coordinator",contactPhone:"0900-000-0001",contactEmail:"cti-contact@example.invalid"},{id:"company-002",initials:"SR",name:"Southern Ridge Digital Services",location:"Lipa City, Batangas",municipality:"Lipa City",program:"BS Computer Science",availability:"accepting",slotsOpen:5,description:"A fictional digital services establishment sample providing website development and technical support.",acceptedPrograms:["BS Computer Science","BS Information Technology"],opportunityFocus:["Frontend Development","UI Implementation","Technical Support"],requirements:["Endorsement letter","Updated resume","Completion of required prerequisite subjects"],preferredSkills:["Responsive web design","JavaScript fundamentals","Communication skills"],contactName:"Taylor Example",contactRole:"Sample Training Supervisor",contactPhone:"0900-000-0002",contactEmail:"sr-contact@example.invalid"},{id:"company-003",initials:"LTC",name:"Lakeside Technology Center",location:"Tanauan City, Batangas",municipality:"Tanauan City",program:"BS Computer Science",availability:"not-accepting",slotsOpen:0,description:"A fictional technology center sample used to demonstrate a partner with currently filled OJT slots.",acceptedPrograms:["BS Computer Science","BS Information Technology"],opportunityFocus:["Computer Systems","Network Support","IT Operations"],requirements:["Endorsement letter","Updated resume","School-approved training plan"],preferredSkills:["Computer troubleshooting","Basic networking","Documentation"],contactName:"Morgan Demo",contactRole:"Sample HR Representative",contactPhone:"0900-000-0003",contactEmail:"ltc-contact@example.invalid"},{id:"company-004",initials:"BPC",name:"Batangas Precision Computing",location:"Santo Tomas, Batangas",municipality:"Santo Tomas",program:"BS Computer Science",availability:"accepting",slotsOpen:8,description:"A fictional computing services company sample offering exposure to software testing and database-related tasks.",acceptedPrograms:["BS Computer Science"],opportunityFocus:["Software Testing","Database Management","Quality Assurance"],requirements:["Endorsement from the school","Updated resume","Signed training agreement"],preferredSkills:["SQL fundamentals","Attention to detail","Analytical thinking"],contactName:"Casey Placeholder",contactRole:"Sample OJT Focal Person",contactPhone:"0900-000-0004",contactEmail:"bpc-contact@example.invalid"},{id:"company-005",initials:"FGC",name:"First Gateway Computing",location:"Bauan, Batangas",municipality:"Bauan",program:"BS Computer Science",availability:"not-accepting",slotsOpen:0,description:"A fictional computing company sample demonstrating a partner that is not currently accepting trainees.",acceptedPrograms:["BS Computer Science","BS Information Technology"],opportunityFocus:["Systems Development","Technical Documentation","IT Support"],requirements:["School endorsement","Updated resume","Required academic documents"],preferredSkills:["Programming fundamentals","Technical writing","Teamwork"],contactName:"Riley Mock",contactRole:"Sample Department Contact",contactPhone:"0900-000-0005",contactEmail:"fgc-contact@example.invalid"},{id:"company-006",initials:"MDS",name:"Metro Digital Solutions",location:"Nasugbu, Batangas",municipality:"Nasugbu",program:"BS Computer Science",availability:"not-accepting",slotsOpen:0,description:"A fictional digital solutions company sample included for the six-card directory mockup.",acceptedPrograms:["BS Computer Science"],opportunityFocus:["Web Applications","Software Documentation","System Analysis"],requirements:["School endorsement","Updated resume","Approved OJT schedule"],preferredSkills:["Basic programming","Documentation","Critical thinking"],contactName:"Avery Test",contactRole:"Sample Training Contact",contactPhone:"0900-000-0006",contactEmail:"mds-contact@example.invalid"}];Z();const d=z,S=X,B=Y,h=6,F="Alex Student",tt="2026-0001";let p=1;function o(t){return t.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[e])}function a(t){return document.querySelector(t)}const N=a(".browse-companies-title-row .page-title"),D=a(".browse-companies-title-row .chip"),P=a(".browse-companies-breadcrumb"),O=a(".browse-companies-count"),R=a(".browse-companies-header .page-subtitle");if(N&&D&&P&&O&&R){N.textContent=d.title,D.textContent=d.directoryName,O.textContent=d.displayedRange,R.textContent=d.subtitle,P.innerHTML=d.breadcrumb.map((e,n)=>`${n>0?'<span aria-hidden="true">›</span>':""}<span>${o(e)}</span>`).join("");const t=P.lastElementChild;t&&(t.outerHTML=`<strong>${o(d.breadcrumb[d.breadcrumb.length-1])}</strong>`)}const I=a("#company-program-title"),q=a("#company-program-count"),H=a("#company-program-focus");I&&(I.textContent=`${B.sectionLabel}: ${B.programName}`);q&&(q.textContent=`${B.partnerCount} Partners`);H&&(H.textContent=B.focusTags.join(" • "));const l=a("#company-search"),i=a("#program-filter"),c=a("#location-filter"),s=a("#availability-filter"),J=a(".browse-companies-filter .filter-bar__helper"),x=a("#reset-company-filters");function $(t,e){e.forEach(n=>{const r=document.createElement("option");r.value=n,r.textContent=n,t.appendChild(r)})}l&&i&&c&&s&&(l.placeholder=S.searchPlaceholder,i.options[0].textContent=S.defaultProgram,c.options[0].textContent=S.defaultLocation,s.options[0].textContent=S.defaultAvailability,$(i,[...new Set(A.map(t=>t.program))]),$(c,[...new Set(A.map(t=>t.municipality))]),$(s,["Accepting Applications","Not Accepting Applications"]));J&&(J.textContent=S.helperText);const v=a("#company-grid"),U=a("#company-pagination-summary"),k=a("#company-pagination-numbers"),b=a("#company-previous-page"),C=a("#company-next-page");function K(){const t=(l==null?void 0:l.value.trim().toLowerCase())??"",e=(i==null?void 0:i.value)??"",n=(c==null?void 0:c.value)??"",r=(s==null?void 0:s.value)??"";return A.filter(m=>{const _=!t||m.name.toLowerCase().includes(t)||m.location.toLowerCase().includes(t),y=!e||m.program===e,g=!n||m.municipality===n,V=!r||(r==="Accepting Applications"?m.availability==="accepting":m.availability==="not-accepting");return _&&y&&g&&V})}function et(t){return t.availability==="accepting"?`
      <span class="company-card__availability company-card__availability--accepting">
        Accepting Applications
      </span>
    `:`
    <span class="company-card__availability company-card__availability--closed">
      Not Accepting Applications
    </span>
  `}function at(t){const e=t.availability==="accepting"?`${t.slotsOpen} Slots Open`:"Slots Filled",n=t.availability==="accepting"?"":"company-card__slots--filled";return`
    <article class="company-card">

      <div class="company-card__top">

        <div class="company-card__identity">

          <div class="company-card__initials" aria-hidden="true">
            ${o(t.initials)}
          </div>

          <h3 class="company-card__name">
            ${o(t.name)}
          </h3>

        </div>

        ${et(t)}

      </div>

      <p class="company-card__location">
        &#9906; ${o(t.location)}
      </p>

      <span class="company-card__program">
        ${o(t.program)}
      </span>

      <p class="company-card__slots ${n}">
        ${o(e)}
      </p>

      <div class="company-card__actions">

        <button
          class="btn btn--secondary company-card__view"
          type="button"
          data-company-id="${o(t.id)}"
        >
          View Details
        </button>

      </div>

    </article>
  `}function nt(t){if(!U||!k||!b||!C)return;const n=!!(l!=null&&l.value.trim())||!!(i!=null&&i.value)||!!(c!=null&&c.value)||!!(s!=null&&s.value)?t.length:d.totalCompanies,r=Math.max(1,Math.ceil(n/h));p=Math.min(p,r);const m=n===0?0:(p-1)*h+1,_=Math.min(p*h,n);U.textContent=`Showing ${m} to ${_} of ${n} partner establishments`,b.disabled=p===1,C.disabled=p===r,k.innerHTML="";for(let y=1;y<=r;y+=1){const g=document.createElement("button");g.type="button",g.className="company-pagination__number",g.textContent=String(y),y===p&&g.setAttribute("aria-current","page"),g.addEventListener("click",()=>{p=y,f()}),k.appendChild(g)}}function f(){if(!v)return;const t=K(),e=!!(l!=null&&l.value.trim())||!!(i!=null&&i.value)||!!(c!=null&&c.value)||!!(s!=null&&s.value),n=e?t.length:d.totalCompanies,r=(p-1)*h,m=t.slice(r,r+h);m.length>0?v.innerHTML=m.map(at).join(""):!e&&p>1?v.innerHTML=`
      <div class="company-grid__notice">
        The remaining six partner records are not included in this
        temporary six-company mock dataset.
      </div>
    `:v.innerHTML=`
      <div class="company-grid__empty">
        No partner establishments match your search or filters.
      </div>
    `,n===0&&(p=1),nt(t)}const u=a("#company-details-modal"),j=a("#company-modal-identity"),W=a("#company-modal-body"),w=a("#company-modal-close"),L=a("#company-modal-close-icon"),T=a("#company-modal-apply");function G(t){return`
    <div class="company-modal__tags">
      ${t.map(e=>`
        <span class="company-modal__tag">
          ${o(e)}
        </span>
      `).join("")}
    </div>
  `}function Q(t){return`
    <ul class="company-modal__checklist">
      ${t.map(e=>`
        <li>
          <span class="company-modal__check" aria-hidden="true">✓</span>
          <span>${o(e)}</span>
        </li>
      `).join("")}
    </ul>
  `}function ot(t){if(!u||!j||!W||!T)return;const e=t.availability==="accepting",n=e?`
      <span class="company-card__availability company-card__availability--accepting">
        Accepting Applications
      </span>
    `:`
      <span class="company-card__availability company-card__availability--closed">
        Not Accepting Applications
      </span>
    `;j.innerHTML=`
    <div class="company-modal__initials" aria-hidden="true">
      ${o(t.initials)}
    </div>

    <div class="company-modal__identity-content">

      <h2 class="company-modal__name" id="company-modal-name">
        ${o(t.name)}
      </h2>

      ${n}

      <p class="company-modal__address">
        &#9906; ${o(t.location)}
      </p>

    </div>
  `,W.innerHTML=`
    <section class="company-modal__section">
      <h3>About / Description</h3>
      <p>${o(t.description)}</p>
    </section>

    <section class="company-modal__section">
      <h3>Accepted Academic Programs</h3>
      ${G(t.acceptedPrograms)}
    </section>

    <section class="company-modal__section">
      <h3>OJT Opportunity &amp; Slots</h3>
      <p>
        <strong>
          ${e?`${t.slotsOpen} Slots Open`:"Slots Filled"}
        </strong>
      </p>
      <div style="margin-top: 9px;">
        ${G(t.opportunityFocus)}
      </div>
    </section>

    <section class="company-modal__section">
      <h3>Key Requirements</h3>
      ${Q(t.requirements)}
    </section>

    <section class="company-modal__section">
      <h3>Preferred Skills</h3>
      ${Q(t.preferredSkills)}
    </section>

    <section class="company-modal__section">
      <h3>Contact Person &amp; Information</h3>

      <div class="company-modal__contact">

        <div class="company-modal__contact-item">
          <span class="company-modal__contact-label">
            Contact Person
          </span>
          <span class="company-modal__contact-value">
            ${o(t.contactName)}
          </span>
        </div>

        <div class="company-modal__contact-item">
          <span class="company-modal__contact-label">
            Role
          </span>
          <span class="company-modal__contact-value">
            ${o(t.contactRole)}
          </span>
        </div>

        <div class="company-modal__contact-item">
          <span class="company-modal__contact-label">
            Phone
          </span>
          <span class="company-modal__contact-value">
            ${o(t.contactPhone)}
          </span>
        </div>

        <div class="company-modal__contact-item">
          <span class="company-modal__contact-label">
            Email
          </span>
          <span class="company-modal__contact-value">
            <a href="mailto:${o(t.contactEmail)}">
              ${o(t.contactEmail)}
            </a>
          </span>
        </div>

      </div>
    </section>

    <div class="company-modal__student-status">
      <strong>Student Status: Eligible</strong>
      (${o(F)} •
      ${o(tt)})
      — Requirements Cleared
    </div>
  `,T.disabled=!e,e?T.textContent="Apply Now":T.textContent="Not Accepting Applications",u.showModal()}function M(){u!=null&&u.open&&u.close()}v==null||v.addEventListener("click",t=>{const e=t.target;if(!(e instanceof Element))return;const n=e.closest("[data-company-id]");if(!n)return;const r=n.dataset.companyId,m=A.find(_=>_.id===r);m&&ot(m)});w==null||w.addEventListener("click",M);L==null||L.addEventListener("click",M);u==null||u.addEventListener("click",t=>{t.target===u&&M()});function E(){p=1,f()}l==null||l.addEventListener("input",E);i==null||i.addEventListener("change",E);c==null||c.addEventListener("change",E);s==null||s.addEventListener("change",E);x==null||x.addEventListener("click",()=>{l&&(l.value=""),i&&(i.selectedIndex=0),c&&(c.selectedIndex=0),s&&(s.selectedIndex=0),p=1,f()});b==null||b.addEventListener("click",()=>{p>1&&(p-=1,f())});C==null||C.addEventListener("click",()=>{const t=K(),n=!!(l!=null&&l.value.trim())||!!(i!=null&&i.value)||!!(c!=null&&c.value)||!!(s!=null&&s.value)?t.length:d.totalCompanies,r=Math.max(1,Math.ceil(n/h));p<r&&(p+=1,f())});f();
