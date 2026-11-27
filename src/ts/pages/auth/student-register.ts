
import { registerStudent } from '../../services/auth.service';

const registrationForm =
  document.querySelector<HTMLFormElement>(
    '#student-registration-form'
  );

registrationForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name =
    document.querySelector<HTMLInputElement>(
      '#student-name'
    )?.value.trim() ?? '';

  const email =
    document.querySelector<HTMLInputElement>(
      '#student-email'
    )?.value.trim() ?? '';

  const password =
    document.querySelector<HTMLInputElement>(
      '#student-password'
    )?.value ?? '';

  const studentNumber =
    document.querySelector<HTMLInputElement>(
      '#student-number'
    )?.value.trim() ?? '';

  const program =
    document.querySelector<HTMLSelectElement>(
      '#student-program'
    )?.value ?? '';

  try {
    await registerStudent({
      name,
      email,
      password,
      studentNumber,
      program,
    });

    alert(
      'Account successfully created! You can now log in.'
    );

    window.location.href =
      '/pages/auth/student-login.html';

  } catch (error) {
    alert(
      error instanceof Error
        ? error.message
        : 'Unable to create account.'
    );
  }
});
