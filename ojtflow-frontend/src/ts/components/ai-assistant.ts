
/* ========================================
   OJTFLOW AI ASSISTANT
   src/ts/components/ai-assistant.ts
======================================== */

import type { Portal } from '../types/user.types';

import type {
  AssistantContext,
  AssistantPrompt,
  AssistantReplyHandler
} from '../types/chat.types';

import {
  escapeHtml,
  icon
} from '../utils/dom';

import {
  getFreeTextReply
} from '../mocks/chatbot.mock';

/* ========================================
   ASSISTANT INITIALIZATION
======================================== */

export function initAssistant(
  portal: Portal,
  context: AssistantContext,
  reply: AssistantReplyHandler
): void {

  // Prevent duplicate assistant instances.
  if (document.querySelector('.assistant')) {
    return;
  }

  const host = document.createElement('div');

  const isStudent = portal === 'student';

  host.className = isStudent
    ? 'assistant assistant--dialog'
    : 'assistant assistant--drawer';

  const launcherSubtitle =
    context.launcherSubtitle ?? '';

  /* ========================================
     SUGGESTED PROMPTS
  ======================================== */

  const promptsHTML = context.prompts
    .map((prompt, index) => `
      <li class="assistant__prompt-item">
        <button
          type="button"
          class="assistant__prompt"
          data-js-prompt="${index}"
        >
          <span class="assistant__prompt-text">
            ${escapeHtml(prompt.label)}
          </span>

          <span class="assistant__prompt-arrow">
            ${icon('arrow_forward', 'icon--16')}
          </span>
        </button>
      </li>
    `)
    .join('');

  /* ========================================
     HEADER
  ======================================== */

  const headerHTML = `
    <header class="assistant__header">

      <div class="assistant__header-brand">

        <div class="assistant__robot">
          ${icon('smart_toy', 'icon--24')}
        </div>

        <div class="assistant__header-info">

          <strong>OJTFlow AI Assistant</strong>

          <span class="assistant__online">
            <span class="assistant__online-dot"></span>
            Online • ${escapeHtml(context.title)}
          </span>

        </div>

      </div>

      <button
        type="button"
        class="assistant__close"
        data-js-assistant-close
        aria-label="Close assistant"
      >
        ${icon('close')}
      </button>

    </header>
  `;

  /* ========================================
     CONTEXT SUMMARY
  ======================================== */

  const summaryHTML =
    !isStudent && context.summary
      ? `
        <div class="assistant__summary">

          <span class="assistant__summary-label">
            PAGE CONTEXT
          </span>

          <p>
            ${escapeHtml(context.summary)}
          </p>

        </div>
      `
      : '';

  /* ========================================
     INTRODUCTION
  ======================================== */

  const introHTML = `
    <div class="assistant__intro">

      <div class="assistant__bot-avatar">
        ${icon('smart_toy', 'icon--20')}
      </div>

      <div class="assistant__intro-content">

        <p>
          ${escapeHtml(context.intro)}
        </p>

        <span class="assistant__demo-label">
          Demo Assistant
        </span>

      </div>

    </div>
  `;

  /* ========================================
     LAUNCH BUTTON
  ======================================== */

  const launcherHTML = `
    <button
      type="button"
      class="assistant__launch"
      data-js-assistant-open
      aria-expanded="false"
      aria-label="Open OJTFlow AI Assistant"
    >

      <span class="assistant__launch-icon">
        ${icon('smart_toy', 'icon--22')}
      </span>

      <span class="assistant__launch-label">

        <strong>Ask OJTFlow AI</strong>

        ${
          launcherSubtitle
            ? `<small>${escapeHtml(launcherSubtitle)}</small>`
            : ''
        }

      </span>

      <span class="assistant__launch-arrow">
        ${icon('keyboard_arrow_up')}
      </span>

    </button>
  `;

  /* ========================================
     PANEL CONTENT
  ======================================== */

  host.innerHTML = `

    <section
      class="assistant__panel"
      role="dialog"
      aria-label="OJTFlow AI Assistant"
      aria-modal="false"
      hidden
    >

      ${headerHTML}

      ${summaryHTML}

      <div class="assistant__body">

        ${introHTML}

        <section class="assistant__suggestions">

          <div class="assistant__section-heading">

            <strong>
              ${isStudent ? 'Suggested questions' : 'Suggested actions'}
            </strong>

            <span>
              ${context.prompts.length} suggestions
            </span>

          </div>

          <ul class="assistant__prompts">
            ${promptsHTML}
          </ul>

        </section>

        <div
          class="assistant__messages"
          data-js-assistant-messages
          aria-live="polite"
          aria-relevant="additions"
        ></div>

      </div>

      <form
        class="assistant__composer"
        data-js-assistant-form
      >

        <label
          class="assistant__input-label"
          for="assistant-message-input"
        >
          Ask a question
        </label>

        <div class="assistant__input-wrap">

          <input
            type="text"
            id="assistant-message-input"
            class="assistant__input"
            data-js-assistant-input
            placeholder="Type your question..."
            autocomplete="off"
            maxlength="300"
          />

          <button
            type="submit"
            class="assistant__send"
            data-js-assistant-send
            aria-label="Send message"
          >
            ${icon('send')}
          </button>

        </div>

        ${
          isStudent
            ? `
              <p class="assistant__disclaimer">
                AI responses are demonstrations and may not reflect official records.
              </p>
            `
            : `
              <p class="assistant__footer">
                Powered by BatStateU CICS OJTFlow Intelligence
              </p>
            `
        }

      </form>

    </section>

    ${launcherHTML}

  `;

  document.body.appendChild(host);

  /* ========================================
     ELEMENT REFERENCES
  ======================================== */

  const panel = host.querySelector<HTMLElement>(
    '.assistant__panel'
  );

  const launcher = host.querySelector<HTMLButtonElement>(
    '[data-js-assistant-open]'
  );

  const closeButton = host.querySelector<HTMLButtonElement>(
    '[data-js-assistant-close]'
  );

  const messages = host.querySelector<HTMLElement>(
    '[data-js-assistant-messages]'
  );

  const form = host.querySelector<HTMLFormElement>(
    '[data-js-assistant-form]'
  );

  const input = host.querySelector<HTMLInputElement>(
    '[data-js-assistant-input]'
  );

  const sendButton = host.querySelector<HTMLButtonElement>(
    '[data-js-assistant-send]'
  );

  // Validate all required elements.
  if (
    !panel ||
    !launcher ||
    !closeButton ||
    !messages ||
    !form ||
    !input ||
    !sendButton
  ) {
    host.remove();
    return;
  }

  /*
   * Explicitly typed references.
   * These eliminate nullable element errors
   * inside nested functions and event handlers.
   */

  const panelElement: HTMLElement = panel;
  const launcherElement: HTMLButtonElement = launcher;
  const closeButtonElement: HTMLButtonElement = closeButton;
  const messagesElement: HTMLElement = messages;
  const formElement: HTMLFormElement = form;
  const inputElement: HTMLInputElement = input;
  const sendButtonElement: HTMLButtonElement = sendButton;

  let isResponding = false;

  /* ========================================
     OPEN PANEL
  ======================================== */

  function openPanel(): void {

    panelElement.hidden = false;

    launcherElement.setAttribute(
      'aria-expanded',
      'true'
    );

    launcherElement.classList.add(
      'assistant__launch--active'
    );

    inputElement.focus();
  }

  /* ========================================
     CLOSE PANEL
  ======================================== */

  function closePanel(): void {

    panelElement.hidden = true;

    launcherElement.setAttribute(
      'aria-expanded',
      'false'
    );

    launcherElement.classList.remove(
      'assistant__launch--active'
    );

    launcherElement.focus();
  }

  /* ========================================
     BUTTON EVENTS
  ======================================== */

  launcherElement.addEventListener(
    'click',
    () => {

      if (panelElement.hidden) {
        openPanel();
      } else {
        closePanel();
      }

    }
  );

  closeButtonElement.addEventListener(
    'click',
    closePanel
  );

  /* ========================================
     ESCAPE KEY
  ======================================== */

  function handleEscape(event: KeyboardEvent): void {

    if (
      event.key === 'Escape' &&
      !panelElement.hidden
    ) {
      closePanel();
    }

  }

  document.addEventListener(
    'keydown',
    handleEscape
  );

  /* ========================================
     MESSAGE RENDERING
  ======================================== */

  function appendMessage(
    sender: 'user' | 'assistant',
    content: string,
    isDemo = false
  ): void {

    const message = document.createElement('div');

    message.className =
      `assistant__message assistant__message--${sender}`;

    const messageContent = document.createElement('div');

    messageContent.className =
      'assistant__message-content';

    const text = document.createElement('p');

    // textContent prevents HTML injection.
    text.textContent = content;

    messageContent.appendChild(text);

    if (sender === 'assistant' && isDemo) {

      const label = document.createElement('span');

      label.className =
        'assistant__message-label';

      label.textContent = 'Demo response';

      messageContent.appendChild(label);
    }

    message.appendChild(messageContent);

    messagesElement.appendChild(message);

    messagesElement.scrollTop =
      messagesElement.scrollHeight;
  }

  /* ========================================
     TYPING INDICATOR
  ======================================== */

  function showTyping(): HTMLElement {

    const typing = document.createElement('div');

    typing.className = 'assistant__typing';

    typing.setAttribute(
      'aria-label',
      'Assistant is typing'
    );

    typing.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;

    messagesElement.appendChild(typing);

    messagesElement.scrollTop =
      messagesElement.scrollHeight;

    return typing;
  }

  /* ========================================
     RESPONSE AREA
  ======================================== */

  function appendResponse(answer: string): void {

    const response = document.createElement('div');

    response.className = 'assistant__response';

    const heading = document.createElement('strong');

    heading.textContent = 'Response:';

    const content = document.createElement('p');

    content.textContent = answer;

    const demo = document.createElement('span');

    demo.className = 'assistant__message-label';

    demo.textContent = 'Demo response';

    response.append(
      heading,
      content,
      demo
    );

    messagesElement.appendChild(response);

    messagesElement.scrollTop =
      messagesElement.scrollHeight;
  }

  /* ========================================
     LOADING STATE
  ======================================== */

  function setLoading(loading: boolean): void {

    isResponding = loading;

    inputElement.disabled = loading;

    sendButtonElement.disabled = loading;

    host.querySelectorAll<HTMLButtonElement>(
      '[data-js-prompt]'
    ).forEach((button) => {
      button.disabled = loading;
    });

  }

  /* ========================================
     HANDLE SUGGESTED PROMPT
  ======================================== */

  async function handlePrompt(
    prompt: AssistantPrompt
  ): Promise<void> {

    if (isResponding) return;

    setLoading(true);

    appendMessage(
      'user',
      prompt.label
    );

    const typing = showTyping();

    try {

      const result = await reply(prompt, portal);

      typing.remove();

      appendResponse(result.text);

    } catch {

      typing.remove();

      appendResponse(
        'Sorry, the demonstration assistant could not process this request. Please try again.'
      );

    } finally {

      setLoading(false);

      if (!panelElement.hidden) {
        inputElement.focus();
      }

    }

  }

  /* ========================================
     SUGGESTED PROMPT EVENTS
  ======================================== */

  host.querySelectorAll<HTMLButtonElement>(
    '[data-js-prompt]'
  ).forEach((button) => {

    button.addEventListener(
      'click',
      () => {

        const index = Number(
          button.dataset.jsPrompt
        );

        if (!Number.isInteger(index)) return;

        const prompt = context.prompts[index];

        if (!prompt) return;

        void handlePrompt(prompt);

      }
    );

  });

  /* ========================================
     FREE-TEXT MESSAGE
  ======================================== */

  async function handleFreeText(
    message: string
  ): Promise<void> {

    const trimmedMessage = message.trim();

    if (
      isResponding ||
      !trimmedMessage
    ) {
      return;
    }

    setLoading(true);

    appendMessage(
      'user',
      trimmedMessage
    );

    const typing = showTyping();

    try {

      const result = await getFreeTextReply(
        trimmedMessage,
        portal
      );

      typing.remove();

      appendResponse(result.text);

    } catch {

      typing.remove();

      appendResponse(
        'Sorry, something went wrong. Please try again.'
      );

    } finally {

      setLoading(false);

      if (!panelElement.hidden) {
        inputElement.focus();
      }

    }

  }

  /* ========================================
     FORM SUBMISSION
  ======================================== */

  formElement.addEventListener(
    'submit',
    (event: SubmitEvent) => {

      event.preventDefault();

      const message = inputElement.value.trim();

      if (
        !message ||
        isResponding
      ) {
        return;
      }

      inputElement.value = '';

      void handleFreeText(message);

    }
  );

}
