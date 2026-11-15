import{r as y}from"./route-guard-MQy5MPzz.js";import{g as m,c as f}from"./session-C6yT7gL8.js";import{e as t,i as l}from"./dom-DcOuyLef.js";const $=[{label:"Dashboard",href:"/pages/student/dashboard.html",icon:"dashboard",pageKey:"student-dashboard",type:"link"},{label:"Browse Companies",href:"/pages/student/browse-companies.html",icon:"domain",pageKey:"student-browse-companies",type:"link"},{label:"My Applications",href:"/pages/student/my-applications.html",icon:"fact_check",pageKey:"student-applications",type:"link"},{label:"OJT Requirements",href:"/pages/student/ojt-requirements.html",icon:"inventory_2",pageKey:"student-requirements",type:"link"},{label:"My Deployment",href:"/pages/student/my-deployment.html",icon:"engineering",pageKey:"student-deployment",type:"link"}],k=[{label:"Dashboard",href:"/pages/coordinator/dashboard.html",icon:"grid_view",pageKey:"coordinator-dashboard",type:"link"},{label:"Student Management",href:"/pages/coordinator/students.html",icon:"group",pageKey:"coordinator-students",type:"link"},{label:"Company Management",href:"/pages/coordinator/companies.html",icon:"apartment",pageKey:"coordinator-companies",type:"link"},{label:"Eligibility & Requirements",href:"/pages/coordinator/eligibility.html",icon:"fact_check",pageKey:"coordinator-eligibility",type:"link"},{label:"Applications Management",href:"/pages/coordinator/applications.html",icon:"assignment_turned_in",pageKey:"coordinator-applications",type:"link"}],p={label:"Log Out",icon:"logout"},S={student:$,coordinator:k};function g(a){return S[a]}function A(a){return a==="student"?"ACADEMIC WORKFLOW":"MAIN MENU"}const N={student:"/pages/auth/student-login.html",coordinator:"/pages/auth/coordinator-login.html"},T={student:"STUDENT PORTAL",coordinator:"OJT COORDINATOR PORTAL"};function v(a){return a.trim().split(/\s+/).filter(Boolean).slice(0,2).map(e=>e.charAt(0).toUpperCase()).join("")}function C(a){f(),window.location.replace(N[a])}function O(a){return`
    <div class="sidebar-brand">

      <div class="sidebar-brand__logo"
           aria-hidden="true">
        O
      </div>

      <div class="sidebar-brand__details">

        <p class="sidebar-brand__name">
          OJTFlow
        </p>

        <p class="sidebar-brand__portal">
          ${T[a]}
        </p>

      </div>

    </div>
  `}function L(a,e){const i=g(a).map(r=>{const o=e===r.pageKey;return`
      <li class="sidebar-nav-item">

        <a
          href="${t(r.href)}"
          class="sidebar-nav-link${o?" sidebar-nav-link--active":""}"
          ${o?'aria-current="page"':""}
          data-page-key="${t(r.pageKey)}"
        >

          ${l(r.icon,"icon--20")}

          <span class="sidebar-nav-link__label">
            ${t(r.label)}
          </span>

        </a>

      </li>
    `}).join("");return`
    <nav
      class="sidebar-navigation"
      aria-label="Main navigation"
    >

      <p class="sidebar-section-label">
        ${A(a)}
      </p>

      <ul class="sidebar-nav-list">
        ${i}
      </ul>

    </nav>
  `}function u(){return`
    <button
      type="button"
      class="sidebar-logout"
      data-js-sidebar-logout
    >

      ${l(p.icon,"icon--20")}

      <span>
        ${t(p.label)}
      </span>

    </button>
  `}function E(a,e,n){const i=v(a);return`
    <div class="sidebar-user">

      <div
        class="sidebar-user__avatar"
        aria-label="${t(a)}"
      >
        ${t(i)}
      </div>

      <div class="sidebar-user__details">

        <p class="sidebar-user__name">
          ${t(a)}
        </p>

        <p class="sidebar-user__meta">
          Student ID: ${t(e||"N/A")}
        </p>

        <p class="sidebar-user__meta">
          ${t(n||"Program not specified")}
        </p>

      </div>

    </div>
  `}function P(a,e){const n=v(a);return`
    <div class="sidebar-user">

      <div
        class="sidebar-user__avatar"
        aria-label="${t(a)}"
      >
        ${t(n)}
      </div>

      <div class="sidebar-user__details">

        <p class="sidebar-user__name">
          ${t(a)}
        </p>

        <p class="sidebar-user__meta">
          ${t(e)}
        </p>

      </div>

    </div>
  `}function D(a){const e=document.body.dataset.portal;if(e!=="student"&&e!=="coordinator"){console.error("Sidebar initialization failed: invalid data-portal.");return}const n=e,i=m();if(!i||i.user.portal!==n){console.error("Sidebar initialization failed: invalid user session.");return}const r=document.body.dataset.page||"",o=i.user,d=n==="student"?E(o.name,o.identifier??"",o.program??""):P(o.name,o.roleLabel),c=n==="student"?`${d}${u()}`:`${u()}${d}`;a.innerHTML=`
    ${O(n)}

    ${L(n,r)}

    <div class="sidebar-bottom">
      ${c}
    </div>
  `;const s=a.querySelector("[data-js-sidebar-logout]");s==null||s.addEventListener("click",()=>{C(n)})}const b={label:"A.Y. 2026-2027",semester:"First Semester"},h=[{id:"NOTIF-001",title:"4 New Student Clearance Submissions",detail:"Students have submitted their clearance documents for review.",relativeTime:"10 minutes ago",isNew:!0},{id:"NOTIF-002",title:"HTE Partner Capacity Confirmed",detail:"Your partner establishment has confirmed its available slots.",relativeTime:"1 hour ago",isNew:!0}],I=h.filter(a=>a.isNew).length;function K(){const a=h.map(e=>`
    <article class="dropdown-notification${e.isNew?" dropdown-notification--new":""}">

      <div class="dropdown-notification__indicator"></div>

      <div class="dropdown-notification__content">

        <h4 class="dropdown-notification__title">
          ${t(e.title)}
        </h4>

        <p class="dropdown-notification__detail">
          ${t(e.detail)}
        </p>

        <span class="dropdown-notification__time">
          ${t(e.relativeTime)}
        </span>

      </div>

    </article>
  `).join("");return`
    <div
    id="notification-menu"
    class="dropdown-panel notification-dropdown"
    data-dropdown-panel="notifications"
    hidden
  >

      <div class="dropdown-header">

        <h3 class="dropdown-header__title">
          Notifications
        </h3>

        <span class="dropdown-count">
          ${I} New
        </span>

      </div>

      <div class="dropdown-list">
        ${a}
      </div>

      <div class="dropdown-footer">
        <span>You're all caught up on recent updates.</span>
      </div>

    </div>
  `}function j(){return`
    <button
      type="button"
      class="topbar-icon-button topbar-notification-button"
      data-dropdown-trigger="notifications"
      aria-label="Open notifications"
      aria-expanded="false"
      aria-controls="notification-menu"
    >
      ${l("notifications","icon--20")}

      <span
        class="topbar-notification-dot"
        aria-hidden="true"
      ></span>

    </button>
  `}const q="/pages/auth/coordinator-login.html";function _(a){return a.trim().split(/\s+/).filter(Boolean).slice(0,2).map(e=>e.charAt(0).toUpperCase()).join("")}function M(a){const e=_(a.name);return`
    <button
      type="button"
      class="topbar-user-button"
      data-dropdown-trigger="profile"
      aria-label="Open profile menu"
      aria-expanded="false"
      aria-controls="profile-menu"
    >

      <span class="topbar-user-avatar">
        ${t(e)}
      </span>

      <span class="topbar-user-details">

        <span class="topbar-user-name">
          ${t(a.name)}
        </span>

        <span class="topbar-user-role">
          ${t(a.roleLabel)}
        </span>

      </span>

      ${l("keyboard_arrow_down","icon--18")}

    </button>
  `}function R(a){const e=_(a.name);return`
    <div
    id="profile-menu"
    class="dropdown-panel profile-dropdown"
    data-dropdown-panel="profile"
    hidden
  >

      <div class="profile-dropdown__identity">

        <span class="profile-dropdown__avatar">
          ${t(e)}
        </span>

        <div class="profile-dropdown__details">

          <p class="profile-dropdown__name">
            ${t(a.name)}
          </p>

          <p class="profile-dropdown__email">
            ${t(a.email)}
          </p>

        </div>

      </div>

      <div class="dropdown-divider"></div>

      <div class="profile-dropdown__menu">

        <button
          type="button"
          class="dropdown-menu-item"
          disabled
          title="Not available yet"
        >
          ${l("manage_accounts","icon--20")}
          <span>Profile Settings</span>
          <span class="dropdown-menu-item__disabled-label">
            Soon
          </span>
        </button>

        <button
          type="button"
          class="dropdown-menu-item"
          disabled
          title="Not available yet"
        >
          ${l("history","icon--20")}
          <span>Audit Logs</span>
          <span class="dropdown-menu-item__disabled-label">
            Soon
          </span>
        </button>

      </div>

      <div class="dropdown-divider"></div>

      <button
        type="button"
        class="dropdown-menu-item dropdown-menu-item--danger"
        data-js-profile-logout
      >
        ${l("logout","icon--20")}
        <span>Sign out</span>
      </button>

    </div>
  `}function U(a){const e=a.querySelector("[data-js-profile-logout]");e==null||e.addEventListener("click",()=>{f(),window.location.replace(q)})}function B(a){const e=Array.from(a.querySelectorAll("[data-dropdown-trigger]")),n=Array.from(a.querySelectorAll("[data-dropdown-panel]"));function i(){n.forEach(o=>{o.hidden=!0}),e.forEach(o=>{o.setAttribute("aria-expanded","false")})}function r(o){i();const d=e.find(s=>s.dataset.dropdownTrigger===o),c=n.find(s=>s.dataset.dropdownPanel===o);!d||!c||(c.hidden=!1,d.setAttribute("aria-expanded","true"))}e.forEach(o=>{o.addEventListener("click",d=>{d.stopPropagation();const c=o.dataset.dropdownTrigger,s=n.find(w=>w.dataset.dropdownPanel===c);!c||!s||(s.hidden?r(c):i())})}),document.addEventListener("click",o=>{const d=o.target;if(!(d instanceof Node))return;[...e,...n].some(s=>s.contains(d))||i()}),document.addEventListener("keydown",o=>{o.key==="Escape"&&i()})}function z(a,e){const n=g(a).find(i=>i.pageKey===e);return n?n.label:a==="coordinator"?"Coordinator Workspace":"Portal Console"}function F(a){return a.trim().split(/\s+/).filter(Boolean).slice(0,2).map(e=>e.charAt(0).toUpperCase()).join("")}function x(a,e){return a==="coordinator"?`
      <nav
        class="topbar-breadcrumb"
        aria-label="Breadcrumb"
      >

        <span>BatStateU Portal</span>

        ${l("chevron_right","icon--16")}

        <span>Coordinator Workspace</span>

        ${l("chevron_right","icon--16")}

        <strong>${t(e)}</strong>

      </nav>
    `:`
    <nav
      class="topbar-breadcrumb topbar-breadcrumb--student"
      aria-label="Breadcrumb"
    >

      <span>BatStateU OJTFlow</span>

      ${l("chevron_right","icon--16")}

      <span>Portal Console</span>

      ${l("chevron_right","icon--16")}

      <strong>${t(e)}</strong>

    </nav>
  `}function Y(){return`
    <div class="topbar-academic-year">

      ${l("calendar_month","icon--18")}

      <span>
        ${t(b.label)}
        <span class="topbar-academic-year__separator">•</span>
        ${t(b.semester)}
      </span>

    </div>
  `}function H(a){return`
    <div class="topbar-student-user">

      <span class="topbar-user-avatar">
        ${t(F(a.name))}
      </span>

      <span class="topbar-user-details">

        <span class="topbar-user-name">
          ${t(a.name)}
        </span>

        <span class="topbar-user-role">
          ${t(a.roleLabel)}
        </span>

      </span>

    </div>
  `}function J(a){const e=document.body.dataset.portal;if(e!=="student"&&e!=="coordinator"){console.error("Topbar initialization failed: invalid data-portal.");return}const n=e,i=m();if(!i||i.user.portal!==n){console.error("Topbar initialization failed: invalid user session.");return}const r=i.user,o=document.body.dataset.page||"",d=z(n,o),c=n==="coordinator"?M(r):H(r),s=n==="coordinator"?R(r):"";a.innerHTML=`
    <div class="topbar-inner">

      <div class="topbar-left">
        ${x(n,d)}
      </div>

      <div class="topbar-right">

        ${Y()}

        <div class="topbar-control">
          ${j()}
          ${K()}
        </div>

        <div class="topbar-control topbar-profile-control">
          ${c}
          ${s}
        </div>

      </div>

    </div>
  `,B(a),n==="coordinator"&&U(a)}function Q(){const a=document.body.dataset.portal;if(a!=="student"&&a!=="coordinator")throw new Error("Application shell initialization failed: invalid data-portal.");if(!y(a))return;const i=document.querySelector("[data-js-sidebar]"),r=document.querySelector("[data-js-topbar]");if(!i||!r)throw new Error("Application shell initialization failed: sidebar or topbar container is missing.");D(i),J(r)}export{Q as i};
