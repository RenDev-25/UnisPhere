import { login } from '../../services/auth.service';
import { qs } from '../../utils/dom';
import { isEmail } from '../../utils/validators';

const form = qs<HTMLFormElement>('#login-form');
const email = qs<HTMLInputElement>('[data-js-email-input]');
const password = qs<HTMLInputElement>('[data-js-password-input]');
const remember = qs<HTMLInputElement>('input[name="remember"]');
const toggle = qs<HTMLButtonElement>('[data-js-toggle-password]');
const submit = qs<HTMLButtonElement>('button[type="submit"]', form);

// Show or hide the password.
toggle.addEventListener('click', () => {
  const hidden = password.type === 'password';

  password.type = hidden ? 'text' : 'password';
  toggle.textContent = hidden ? 'Hide' : 'Show';
  toggle.setAttribute('aria-label', hidden ? 'Hide password' : 'Show password');
  toggle.setAttribute('aria-pressed', String(hidden));
});

// Show or clear the error under a field.
function setFieldError(name: 'email' | 'password', message: string): void {
  const field = qs(`[data-js-field="${name}"]`);
  const box = qs('[data-js-error]', field);

  field.classList.toggle('field--error', message !== '');
  box.textContent = message;
  box.hidden = message === '';
}

// Show or clear the sign in error below the form.
function setLoginError(message: string): void {
  let box = form.querySelector<HTMLElement>('[data-js-auth-error]');

  if (!box) {
    box = document.createElement('p');
    box.dataset.jsAuthError = '';
    box.className = 'field__error';
    box.setAttribute('role', 'alert');
    form.append(box);
  }

  box.textContent = message;
  box.hidden = message === '';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const emailValue = email.value.trim();
  const emailError =
    !emailValue || isEmail(emailValue) !== ''
      ? 'Please enter a valid email address.'
      : '';
  const passwordError = password.value.trim()
    ? ''
    : 'Please enter your password.';

  setFieldError('email', emailError);
  setFieldError('password', passwordError);
  setLoginError('');

  if (emailError || passwordError) return;

  submit.disabled = true;

  try {
    await login({
      email: emailValue,
      password: password.value,
      portal: 'supervisor',
      rememberMe: remember.checked,
    });

    window.location.href = '/pages/supervisor/dashboard.html';
  } catch (error) {
    setLoginError(
      error instanceof Error
        ? error.message
        : 'Unable to sign in. Please try again.'
    );
  } finally {
    submit.disabled = false;
  }
});