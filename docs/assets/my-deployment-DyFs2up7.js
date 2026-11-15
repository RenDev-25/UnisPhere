import"./session-C6yT7gL8.js";import{e as a,i as d,q as u}from"./dom-DcOuyLef.js";import{i as v}from"./app-shell-PbQyGsAe.js";import"./route-guard-MQy5MPzz.js";function y(t){const e=t.trim();if(e.startsWith("/")||e.startsWith("#")||e.startsWith("./")||e.startsWith("../"))return e;try{const n=new URL(e);if(n.protocol==="https:"||n.protocol==="http:"||n.protocol==="mailto:")return e}catch{}return""}function i(t){const e=a(t.label),n=t.value==null?"":String(t.value).trim();if(!(n.length>0))return`
            <div class="info-field">
                <span class="info-field__label">${e}</span>
                <span class="info-field__value info-field__value--empty">
                    <em>Not provided</em>
                </span>
            </div>
        `;const s=a(n),l=["info-field__value",t.monospace?"info-field__value--monospace":"",t.href?"info-field__value--link":""].filter(Boolean).join(" "),o=t.href?y(t.href):"";let r=s;o?r=`
            <a
                class="${l}"
                href="${a(o)}"
                ${o.startsWith("http")?'target="_blank" rel="noopener noreferrer"':""}
            >
                ${s}
            </a>
        `:r=`
            <span class="${l}">
                ${s}
            </span>
        `;const _=t.copyable?`
            <span
                class="info-field__copy-hint"
                title="Click to copy"
                aria-label="Copyable value"
                data-copy-value="${s}"
            >
                Copy
            </span>
        `:"";return`
        <div class="info-field">
            <span class="info-field__label">${e}</span>

            <div class="info-field__content">
                ${r}
                ${_}
            </div>
        </div>
    `}function h(t){return`
        <ol class="placement-stepper" aria-label="Placement progress">
            ${t.steps.map((e,n)=>{const c=`placement-stepper__step--${e.state}`,s=e.state==="done"?d("check"):String(n+1),l=e.state==="active"?' aria-current="step"':"";return`
                    <li class="placement-stepper__step ${c}"${l}>
                        <span class="placement-stepper__marker" aria-hidden="true">
                            ${s}
                        </span>

                        <span class="placement-stepper__label">
                            ${a(e.label)}
                        </span>
                    </li>
                `}).join("")}
        </ol>
    `}function f(t){const e=t.actionLabel?`
            <div class="empty-state__action">
                <a
                    class="btn btn--secondary"
                    href="${a(t.actionHref??"#")}"
                >
                    ${a(t.actionLabel)}
                </a>
            </div>
        `:"";return`
        <div class="empty-state">
            <span class="empty-state__icon">
                ${d(t.iconName)}
            </span>

            <h3 class="empty-state__title">
                ${a(t.title)}
            </h3>

            ${t.text?`
                        <p class="empty-state__description">
                            ${a(t.text)}
                        </p>
                    `:""}

            ${e}
        </div>
    `}const p={heading:{title:"My Deployment",subtitle:"View your OJT placement information and deployment status."},placement:{status:{title:"Deployment Status",status:"Placement Confirmed",message:"Your OJT placement has been confirmed by the OJT Coordinator."},company:{companyName:"Businessaide System and Accounting Solutions Co."},information:{academicProgram:null,companySupervisor:null,deploymentDate:null,ojtCoordinator:null,requiredOjtHours:null}}};v();const m=u("#deployment-content"),$=u("#deployment-heading");$.innerHTML=`
  <section class="page-header">

    <div class="page-heading">

      <h1 class="page-title">
        ${a(p.heading.title)}
      </h1>

      <p class="page-subtitle">
        ${a(p.heading.subtitle)}
      </p>

    </div>

  </section>
`;if(!p.placement)m.innerHTML=`
    <div class="deployment-content">

      ${f({iconName:"work_outline",title:"No placement yet"})}

    </div>
  `;else{let t=function(r){return[{label:"Application Accepted",state:"done"},{label:"Placement Confirmed",state:"done"},{label:"Deployed",state:"pending"}]};const e=p.placement,n=`

    <section class="section-card deployment-status-card">

      <div class="section-card__header">

        <div class="section-card__heading">

          <h2 class="section-card__title">
            ${a(e.status.title)}
          </h2>

        </div>

      </div>

      <div class="deployment-status__body">

        <div class="deployment-status__heading">

          <h3 class="deployment-status__value">
            ${a(e.status.status)}
          </h3>

          <span class="badge badge--approved">
            <span class="badge__dot"></span>
            Confirmed
          </span>

        </div>

        <p class="deployment-status__message">
          ${a(e.status.message)}
        </p>

      </div>

    </section>

  `,c=`

    <section class="section-card deployment-company-card">

      <div class="section-card__header">

        <div class="section-card__heading">

          <h2 class="section-card__title">
            Company Assignment
          </h2>

        </div>

      </div>

      <div class="deployment-company">

        <span class="deployment-company__icon">
          ${d("business")}
        </span>

        <div class="deployment-company__details">

          <h3 class="deployment-company__name">
            ${a(e.company.companyName)}
          </h3>

          <div class="deployment-company__location">

            ${d("location_on")}

            <span>
              ${a("Not provided")}
            </span>

          </div>

        </div>

      </div>

    </section>

  `,s=e.information,l=`

    <section class="section-card deployment-information-card">

      <div class="section-card__header">

        <div class="section-card__heading">

          <h2 class="section-card__title">
            Deployment Information
          </h2>

        </div>

      </div>

      <div class="info-grid">

        ${i({label:"Academic Program",value:s.academicProgram})}

        ${i({label:"Company Supervisor",value:s.companySupervisor})}

        ${i({label:"Deployment Date",value:s.deploymentDate})}

        ${i({label:"OJT Coordinator",value:s.ojtCoordinator})}

        ${i({label:"Required OJT Hours",value:s.requiredOjtHours})}

      </div>

    </section>

  `,o=`

    <section class="section-card deployment-progress-card">

      <div class="section-card__header">

        <div class="section-card__heading">

          <h2 class="section-card__title">
            Placement Status
          </h2>

        </div>

      </div>

      ${h({steps:t()})}

      
            <p class="deployment-stepper-message">
              Your actual OJT deployment is pending.
            </p>
          

    </section>

  `;m.innerHTML=`

    <div class="deployment-content">

      ${n}

      ${c}

      ${l}

      ${o}

    </div>

  `}
