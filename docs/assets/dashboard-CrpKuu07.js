import"./session-C6yT7gL8.js";import{e as l,i as u,q as t}from"./dom-DcOuyLef.js";import{i as f}from"./app-shell-PbQyGsAe.js";import"./route-guard-MQy5MPzz.js";function s(e){return new Intl.NumberFormat("en-US").format(e)}function p(e){const n=e.accent?` kpi-card--${e.accent}`:"",i=typeof e.value=="number"?e.value:"";return`
    <article class="kpi-card${n}">

      <header class="kpi-card__head">

        <span class="kpi-card__label t-label-sm">
          ${l(e.label)}
        </span>

        ${e.iconName?`<span class="kpi-card__icon">
                 ${u(e.iconName)}
               </span>`:""}

      </header>

      <div class="kpi-card__body">

        <strong
          class="kpi-card__value t-headline-lg tabular"
          data-js-count-to="${i}"
        >
          ${l(String(e.value))}
        </strong>

        ${e.chip?`<span class="chip">
                 ${l(e.chip)}
               </span>`:""}

      </div>

      ${e.caption?`<p class="kpi-card__caption t-body-sm">
               ${e.captionIcon?u(e.captionIcon,"kpi-card__caption-icon"):""}
               ${l(e.caption)}
             </p>`:""}

    </article>
  `}function o(e){return`
    <article class="info-tile">

      <span class="info-tile__label t-label-sm">
        ${l(e.label)}
      </span>

      <strong class="info-tile__value">
        ${l(String(e.value))}
      </strong>

    </article>
  `}function _(e,n){if(!Number.isFinite(e)||!Number.isFinite(n)||n<=0)return 0;const i=Math.round(e/n*100);return Math.min(100,Math.max(0,i))}function y(e,n){const i=_(e,n);return`
        <div
            class="progress progress--bar${i>=100?" progress--done":""}"
            role="progressbar"
            aria-label="Completion progress"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow="${i}"
        >
            <div
                class="progress__fill"
                style="width: ${i}%"
            ></div>
        </div>
    `}const m={eligible:"approved",for_review:"pending",incomplete:"rejected",not_eligible:"rejected",pending:"pending",pending_decision:"pending",under_review:"info",accepted:"approved",rejected:"rejected",pending_verification:"pending",awaiting_company_confirmation:"pending",approved:"approved",pending_review:"pending",not_submitted:"rejected",for_correction:"rejected",for_revision:"rejected",placement_confirmed:"info",deployed:"approved",not_yet_deployed:"draft",placed:"info",applying:"info",awaiting_assignment:"pending",not_yet_eligible:"draft",review_queue:"pending",active:"approved",inactive:"draft",accepting_applications:"approved",not_accepting_applications:"rejected",slots_filled:"rejected"};function $(e){return e.trim().toLowerCase().replace(/[\s-]+/g,"_")}function g(e){const n=$(e),i=Object.prototype.hasOwnProperty.call(m,n);return i||console.warn(`Unknown status label: ${e}`),`
        <span class="badge badge--${i?m[n]:"draft"}">
            <span class="badge__dot"></span>
            ${l(e)}
        </span>
    `}const h={student:{name:"Juan Dela Cruz",firstName:"Juan",studentNumber:"22-12345",college:"College of Informatics and Computing Sciences",program:"BS Information Technology",academicYear:"2026-2027"},eligibility:"Eligible",deploymentStatus:"Not Yet Deployed",applications:{total:4,underReview:2,accepted:1,rejected:0,pending:1},requirements:{total:8,completed:6,pendingVerification:1,forRevision:1}};f();const{student:c,eligibility:v,deploymentStatus:w,applications:r,requirements:a}=h,d=_(a.completed,a.total),j=a.total-a.completed;t("#welcome").innerHTML=`

  <h1 class="t-display-lg">
    Welcome back, ${l(c.firstName)}!
  </h1>

  <p class="dashboard-welcome__subtitle">
    Here's an overview of your OJT journey and current progress.
  </p>

`;t("#welcome-pills").innerHTML=`

  <div class="welcome__status welcome__status--eligibility">

    <span class="welcome__status-label">
      OJT Eligibility:
    </span>

    ${g(v)}

  </div>


  <div class="welcome__status welcome__status--deployment">

    <span class="welcome__status-label">
      Deployment Status:
    </span>

    ${g(w)}

  </div>

`;t("#student-info").innerHTML=[o({label:"Student Name",value:c.name}),o({label:"Student Number",value:c.studentNumber}),o({label:"College",value:c.college}),o({label:"Program",value:c.program}),o({label:"Academic Year",value:c.academicYear})].join("");t("#kpis").innerHTML=[p({label:"OJT Eligibility",value:v,chip:"Qualified",caption:"Current qualification status",iconName:"school",accent:"red"}),p({label:"Applications",value:r.total,caption:"Total submitted company applications",iconName:"folder_open",accent:"navy"}),p({label:"Requirements",value:`${a.completed}/${a.total}`,chip:`${d}%`,caption:"Completed requirements",iconName:"description",accent:"red"}),p({label:"Deployment Status",value:"Not Yet",chip:"Pending",caption:"Current deployment status",iconName:"work",accent:"amber"})].join("");t("#application-total-chip").textContent=`Total: ${s(r.total)}`;t("#chart-total").textContent=s(r.total);t("#application-total-footer").textContent=s(r.total);const N=[{label:"Under Review",value:r.underReview,color:"review"},{label:"Accepted",value:r.accepted,color:"accepted"},{label:"Rejected",value:r.rejected,color:"rejected"},{label:"Pending Decision",value:r.pending,color:"pending"}];t("#application-legend").innerHTML=N.map(e=>`

    <div class="dashboard-legend__item">

      <span
        class="dashboard-legend__dot dashboard-legend__dot--${e.color}"
        aria-hidden="true"
      ></span>

      <span class="dashboard-legend__label">
        ${l(e.label)}
      </span>

      <strong class="dashboard-legend__value">
        ${s(e.value)}
      </strong>

    </div>

  `).join("");t("#requirements-percentage").textContent=`${d}%`;t("#requirements-progress").innerHTML=y(a.completed,a.total);t("#requirements-summary").innerHTML=[o({label:"Total",value:a.total}),o({label:"Completed",value:a.completed}),o({label:"Incomplete",value:j}),o({label:"Rate",value:`${d}%`})].join("");t("#requirements-completed").textContent=s(a.completed);t("#requirements-pending").textContent=s(a.pendingVerification);t("#requirements-revision").textContent=s(a.forRevision);
