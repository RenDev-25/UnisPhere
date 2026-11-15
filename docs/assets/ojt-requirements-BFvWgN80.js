import"./session-C6yT7gL8.js";import{e as t,i as d}from"./dom-DcOuyLef.js";import{i as $}from"./app-shell-PbQyGsAe.js";import"./route-guard-MQy5MPzz.js";const R={title:"OJT Requirements",progressLabel:"PROGRESS: 75% COMPLETED",subtitle:"Monitor your required OJT documents and verification progress.",curriculum:"BSCS Practicum 411",hoursTarget:500},w={academicYear:"AY 2024-2025",completed:6,total:8,actionNeeded:2,status:"In Progress",minimumThreshold:100,stage:"Pre-Deployment Clearances"},p=[{id:"REQ-001",number:1,title:"Student Information Sheet",category:"Student Information",description:"Student information document for OJT record verification.",icon:"assignment_ind",status:"Verified",submittedDate:"—",submissionNote:"Temporary sample entry",documentId:"—"},{id:"REQ-002",number:2,title:"Medical Certificate",category:"Mandatory Clearance",description:"Medical certificate submitted for pre-deployment clearance.",icon:"medical_services",status:"Verified",submittedDate:"—",submissionNote:"Temporary sample entry",documentId:"—"},{id:"REQ-003",number:3,title:"Parent's Consent Form",category:"Mandatory Clearance",description:"Parent or guardian consent document for OJT participation.",icon:"family_restroom",status:"Verified",submittedDate:"—",submissionNote:"Temporary sample entry",documentId:"—"},{id:"REQ-004",number:4,title:"Resume / Curriculum Vitae",category:"Personal Document",description:"Updated resume or curriculum vitae for internship records.",icon:"description",status:"Verified",submittedDate:"—",submissionNote:"Temporary sample entry",documentId:"—"},{id:"REQ-005",number:5,title:"Certificate of Registration",category:"Academic Document",description:"Certificate of Registration for the applicable academic term.",icon:"school",status:"Verified",submittedDate:"—",submissionNote:"Temporary sample entry",documentId:"—"},{id:"REQ-006",number:6,title:"Insurance Document",category:"Mandatory Clearance",description:"Insurance document required for OJT deployment processing.",icon:"health_and_safety",status:"Verified",submittedDate:"—",submissionNote:"Temporary sample entry",documentId:"—"},{id:"REQ-007",number:7,title:"Endorsement Letter",category:"Institutional Document",description:"Institutional endorsement letter required for the host training establishment.",icon:"approval",status:"Not Submitted",submittedDate:"—",submissionNote:"No document submitted",documentId:"—",actionRequired:"Action Required"},{id:"REQ-008",number:8,title:"Company Acceptance Letter",category:"Company Document",description:"Acceptance letter issued by the selected host training establishment.",icon:"business_center",status:"Pending Review",submittedDate:"—",submissionNote:"Awaiting coordinator review",documentId:"—"}],C={title:"Need Assistance with your Endorsement Letter?",description:"The OJT office processes letters every Tuesday and Thursday.",buttonLabel:"Submit Request"},T={requirementId:"REQ-002",category:"Mandatory Clearance",documentId:"—",title:"Medical Certificate",icon:"medical_services",status:"Verified",description:"Medical certificate submitted for pre-deployment clearance.",evaluationStatus:"Verified",evaluationNote:"Other possible evaluation states include Pending Review and Not Submitted.",dateChecked:"—",coordinatorName:"—",remarks:"No coordinator remarks supplied in the available Stage 6.4 excerpt."};$();const a=document.querySelector(".ojt-requirements-header"),o=document.querySelector(".requirements-completion-section"),r=document.querySelector(".requirements-list-section"),c=document.querySelector(".requirements-assistance-section"),n=document.querySelector("#requirement-detail-view");function _(e){switch(e){case"Verified":return"badge--approved";case"Pending Review":return"badge--pending";case"Not Submitted":return"badge--rejected";default:return"badge--draft"}}function v(e){return`
    <span class="badge ${_(e)}">
      <span class="badge__dot"></span>
      ${t(e)}
    </span>
  `}function k(){if(!a)return;const e=R;a.innerHTML=`

    <div class="page-header">

      <div class="page-heading">

        <div class="requirements-title-row">

          <h1 class="page-title">
            ${t(e.title)}
          </h1>

          <span class="requirements-progress-chip">
            ${t(e.progressLabel)}
          </span>

        </div>

        <p class="page-subtitle">
          ${t(e.subtitle)}
        </p>

      </div>

      <div class="page-actions">

        <div class="requirements-curriculum-chip">

          <span>Curriculum</span>

          <strong>
            ${t(e.curriculum)}
            &bull;
            ${e.hoursTarget} Hours Target
          </strong>

        </div>

      </div>

    </div>

  `}function I(){if(!o)return;const e=w,i=Math.round(e.completed/e.total*100);o.innerHTML=`

    <section class="section-card requirements-completion-card">

      <div class="requirements-completion-header">

        <h2 class="requirements-completion-title">
          Requirements Completion
        </h2>

        <span class="chip requirements-year-chip">
          ${t(e.academicYear)}
        </span>

      </div>


      <div class="requirements-completion-summary">

        <strong class="requirements-completion-count">
          ${e.completed} of ${e.total} Completed (${i}%)
        </strong>

        <span class="requirements-completion-percent">
          ${i}%
        </span>

      </div>


      <div
        class="progress progress--bar requirements-completion-progress"
        role="progressbar"
        aria-label="Requirements completion"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${i}"
      >

        <span
          class="progress__fill"
          style="width: ${i}%"
        ></span>

      </div>


      <div class="requirements-progress-helper">

        <span>
          Minimum threshold for deployment eligibility:
          <strong>${e.minimumThreshold}%</strong>
        </span>

        <span>
          Stage:
          <strong>${t(e.stage)}</strong>
        </span>

      </div>


      <div class="requirements-stat-grid">

        <div class="requirements-stat-tile">

          <span class="requirements-stat-label">
            Total
          </span>

          <strong class="requirements-stat-value">
            ${e.total}
          </strong>

        </div>


        <div class="requirements-stat-tile">

          <span class="requirements-stat-label">
            Completed
          </span>

          <strong class="requirements-stat-value">
            ${e.completed}
          </strong>

        </div>


        <div class="requirements-stat-tile">

          <span class="requirements-stat-label">
            Action Needed
          </span>

          <strong class="requirements-stat-value requirements-stat-value--critical">
            ${e.actionNeeded}
          </strong>

        </div>


        <div class="requirements-stat-tile">

          <span class="requirements-stat-label">
            Status
          </span>

          <strong class="requirements-stat-value requirements-stat-value--status">
            ${t(e.status)}
          </strong>

        </div>

      </div>

    </section>

  `}function N(e){const i=e.status==="Not Submitted"?"requirement-row--action":"",s=e.actionRequired?`
        <div class="requirement-row__action-required">
          ${d("error_outline")}
          <span>${t(e.actionRequired)}</span>
        </div>
      `:"";return`

    <article
      class="requirement-row ${i}"
      data-requirement-id="${t(e.id)}"
    >

      <div class="requirement-row__icon">
        ${d(e.icon)}
      </div>


      <div class="requirement-row__main">

        <div class="requirement-row__title-line">

          <span class="requirement-row__number">
            ${e.number}.
          </span>

          <h3 class="requirement-row__title">
            ${t(e.title)}
          </h3>

          <span class="requirement-category">
            ${t(e.category)}
          </span>

        </div>


        <p class="requirement-row__description">
          ${t(e.description)}
        </p>


        <p class="requirement-row__submission">

          <strong>Submitted:</strong>

          ${t(e.submittedDate)}

          &bull;

          ${t(e.submissionNote)}

        </p>

        ${s}

      </div>


      <div class="requirement-row__side">

        ${v(e.status)}

        <button
          class="btn btn--ghost requirement-row__details"
          type="button"
          data-view-requirement="${t(e.id)}"
          aria-label="View details for ${t(e.title)}"
        >
          View Details
          ${d("arrow_forward")}
        </button>

      </div>

    </article>

  `}function D(){r&&(r.innerHTML=`

    <section class="section-card requirements-list-card">

      <div class="requirements-list-heading">

        <div>

          <h2 class="requirements-list-title">
            Required Verification Documents
          </h2>

          <p class="requirements-list-subtitle">
            Review the documents required for your OJT clearance.
          </p>

        </div>

        <span class="requirements-checklist-label">
          BATSTATEU CICS INTERNSHIP CHECKLIST
        </span>

      </div>


      <div class="requirements-list">

        ${p.map(e=>N(e)).join("")}

      </div>

    </section>

  `)}function S(){if(!c)return;const e=C;c.innerHTML=`

    <div class="requirements-assistance-card">

      <div class="requirements-assistance-content">

        <div class="requirements-assistance-icon">
          ${d("support_agent")}
        </div>

        <div>

          <h2 class="requirements-assistance-title">
            ${t(e.title)}
          </h2>

          <p class="requirements-assistance-description">
            ${t(e.description)}
          </p>

        </div>

      </div>


      <div class="requirements-assistance-action">

        <button
          class="btn btn--primary"
          type="button"
          id="submit-endorsement-request"
        >
          ${t(e.buttonLabel)}
          ${d("arrow_forward")}
        </button>

      </div>

    </div>

  `}function E(e){if(!n)return;const i=T,s=e.id===i.requirementId,u=s?i.title:e.title,l=s?i.category:e.category,m=s?i.documentId:e.documentId,g=s?i.description:e.description,b=s?i.status:e.status,q=`Item ${e.number} of ${p.length}`,h=s?i.dateChecked:"—",f=s?i.coordinatorName:"—",y=s?i.remarks:"No coordinator remarks supplied in the available Stage 6.4 excerpt.";n.innerHTML=`

    <button
      class="btn btn--ghost requirement-detail-back"
      type="button"
      id="back-to-requirements"
    >
      ${d("arrow_back")}
      Back to Requirements List
    </button>


    <section class="section-card requirement-detail-card">

      <div class="requirement-detail-topline">

        <span class="requirement-detail-item-label">
          ${t(q)}
        </span>

        ${v(b)}

      </div>


      <div class="requirement-detail-heading">

        <div class="requirement-detail-icon">
          ${d(s?i.icon:e.icon)}
        </div>

        <div>

          <h1 class="requirement-detail-title">
            ${t(u)}
          </h1>

          <div class="requirement-detail-meta">

            <span class="requirement-category">
              ${t(l)}
            </span>

            <span class="requirement-detail-document-id">
              Document ID: ${t(m)}
            </span>

          </div>

        </div>

      </div>


      <section class="requirement-detail-block">

        <h3>Requirement Description</h3>

        <p>
          ${t(g)}
        </p>

      </section>


      <section class="requirement-detail-block">

        <h3>Evaluation Status</h3>

        <p>
          ${t(s?i.evaluationStatus:b)}
        </p>

        <p class="requirement-detail-note">
          ${t(s?i.evaluationNote:"Other possible evaluation states include Pending Review and Not Submitted.")}
        </p>

      </section>


      <section class="requirement-detail-block">

        <h3>Date Checked by Coordinator</h3>

        <div class="requirement-detail-info-grid">

          <div class="requirement-detail-info">

            <span>Date Checked</span>

            <strong>
              ${t(h)}
            </strong>

          </div>


          <div class="requirement-detail-info">

            <span>Coordinator</span>

            <strong>
              ${t(f)}
            </strong>

          </div>

        </div>

      </section>


      <section class="requirement-detail-block">

        <h3>Coordinator Remarks &amp; Validation</h3>

        <p>
          ${t(y)}
        </p>

      </section>

    </section>

  `,L()}function L(){a==null||a.setAttribute("hidden",""),o==null||o.setAttribute("hidden",""),r==null||r.setAttribute("hidden",""),c==null||c.setAttribute("hidden",""),n&&(n.hidden=!1),window.scrollTo({top:0,behavior:"smooth"})}function A(){a&&(a.hidden=!1),o&&(o.hidden=!1),r&&(r.hidden=!1),c&&(c.hidden=!1),n&&(n.hidden=!0),window.scrollTo({top:0,behavior:"smooth"})}function M(){r==null||r.addEventListener("click",e=>{const s=e.target.closest("[data-view-requirement]");if(!s)return;const u=s.dataset.viewRequirement;if(!u)return;const l=p.find(m=>m.id===u);l&&E(l)}),n==null||n.addEventListener("click",e=>{e.target.closest("#back-to-requirements")&&A()})}function V(){if(!a||!o||!r||!c||!n){console.error("OJT Requirements page: One or more required page sections are missing.");return}k(),I(),D(),S(),n.hidden=!0,M()}V();
