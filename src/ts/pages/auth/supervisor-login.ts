import { login } from '../../services/auth.service';
const form = document.querySelector<HTMLFormElement>('#sup-login-form');
const message = document.querySelector<HTMLElement>('#sup-auth-message');
form?.addEventListener('submit', async event => { event.preventDefault(); if (!form.reportValidity()) return; const data = new FormData(form); if (message) message.textContent = 'Signing in...'; try { await login({ email: String(data.get('email') || ''), password: String(data.get('password') || ''), portal: 'supervisor', rememberMe: true }); window.location.replace('/pages/supervisor/dashboard.html'); } catch (error) { if (message) message.textContent = error instanceof Error ? error.message : 'Unable to sign in.'; } });
