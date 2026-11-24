
/* =========================================================
   OJTFlow — Coordinator Student Details
   Phase 11: Service Layer Integration
========================================================= */

import { initAppShell } from '../../core/app-shell';
import { getRequiredQueryParam } from '../../core/query-params';
import { getCoordinatorStudents } from '../../services/student.service';

// Initialize the shared Coordinator Portal shell.
initAppShell();

// Helper for safely updating text elements.
function setText(selector: string, value: string): void {
  const element = document.querySelector<HTMLElement>(selector);

  if (element) {
    element.textContent = value;
  }
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
  const studentData = await getCoordinatorStudents();

  const student = studentData.records.find(
    (record) => record.id === studentId,
  );

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
  setText('[data-student-email]', student.email);

  // Update the OJT information.
  setText('[data-student-eligibility]', student.eligibilityStatus);
  setText('[data-student-ojt-status]', student.ojtStatus);

  // Update the page heading with the selected student.
  document.title = `${student.fullName} | Student Details | OJTFlow`;

  // Log the selected record for testing.
  console.log('Selected Student Record:', student);
}

void initStudentDetails().catch((error: unknown) => {
  console.error('Failed to load student details:', error);
});
