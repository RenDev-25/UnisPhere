
/* =========================================================
   UNISphere — Coordinator Student Details
   Phase 11: Service Layer Integration
========================================================= */

import { initAppShell } from '../../core/app-shell';
import { getRequiredQueryParam } from '../../core/query-params';
import { getCoordinatorStudentDetails } from '../../services/student.service';

// Initialize the shared Coordinator Portal shell.
initAppShell();

// Helper for safely updating text elements.
function setText(selector: string, value: string): void {
  document.querySelectorAll<HTMLElement>(selector).forEach(element => {
    element.textContent = value;
  });
}

// Helper for student initials.
function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

// Load and display the selected student.
async function initStudentDetails(): Promise<void> {
  const studentId = getRequiredQueryParam('id');
  const student = await getCoordinatorStudentDetails(studentId);

  // Handle an invalid or unknown student ID.
  if (!student) {
    const page = document.querySelector<HTMLElement>(
      '.student-details-page',
    );

    if (page) {
      page.innerHTML = `
        <section class="section-card">
          <h1 class="page-title">Student Not Found</h1>
          <p>
            The student record could not be found.
            Please return to Student Management and select a valid record.
          </p>
          <a class="btn btn--secondary" href="student-management.html">
            Back to Student Records
          </a>
        </section>
      `;
    }

    return;
  }

  // Update the student identity.
  setText('[data-student-name]', student.fullName);
  setText('[data-student-initials]', getInitials(student.fullName));
  setText('[data-student-number]', student.studentNumber);

  // Update the personal information.
  setText('[data-student-program]', student.program);
  setText('[data-student-email]', student.institutionalEmail);

  // Update the OJT information.
  setText('[data-student-eligibility]', student.ojtInformation.eligibilityStatus);
  setText('[data-student-ojt-status]', student.ojtInformation.deploymentStatus);
  setText('[data-student-academic-year]', student.ojtInformation.academicYear);
  setText('[data-student-requirements-progress]', `${student.ojtInformation.approvedRequirements} of ${student.ojtInformation.totalRequirements} Approved (${student.ojtInformation.completionPercentage}%)`);
  setText('[data-student-application-status]', student.ojtInformation.applicationStatus);
  const progress = document.querySelector<HTMLElement>('[data-student-requirements-bar]');
  if (progress) progress.style.width = `${student.ojtInformation.completionPercentage}%`;
  const progressTrack = progress?.parentElement;
  if (progressTrack) progressTrack.setAttribute('aria-valuenow', String(student.ojtInformation.completionPercentage));
  const missingLink = document.querySelector<HTMLAnchorElement>('[data-student-missing-link]');
  if (missingLink) {
    missingLink.textContent = `View ${student.ojtInformation.incompleteRequirements.length} Missing`;
    missingLink.href = `eligibility-details.html?id=${encodeURIComponent(studentId)}`;
    missingLink.hidden = student.ojtInformation.incompleteRequirements.length === 0;
    missingLink.title = student.ojtInformation.incompleteRequirements.map(item => `${item.title} (${item.status})`).join(', ');
  }
  const missingDetails = document.querySelector<HTMLElement>('[data-student-missing-details]');
  if (missingDetails) {
    missingDetails.innerHTML = student.ojtInformation.incompleteRequirements.map(item =>
      `<li>${item.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')} — ${item.status}</li>`
    ).join('');
    missingDetails.hidden = student.ojtInformation.incompleteRequirements.length === 0;
  }

  // Update the page heading with the selected student.
  document.title = `${student.fullName} | Student Details | UNISphere`;

  // Log the selected record for testing.
  console.log('Selected Student Record:', student);
}

void initStudentDetails().catch((error: unknown) => {
  console.error('Failed to load student details:', error);
  const page = document.querySelector<HTMLElement>('.student-details-page');
  if (page) page.innerHTML = `<section class=\"section-card\"><h1 class=\"page-title\">Unable to Load Student</h1><p>${error instanceof Error ? error.message : 'Please try again.'}</p><a class=\"btn btn--secondary\" href=\"student-management.html\">Back to Student Records</a></section>`;
});
