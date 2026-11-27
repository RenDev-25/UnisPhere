import { ENV } from '../core/env';

import {
  getAssistantContext,
  getChatbotReply,
  getFreeTextReply,
} from '../mocks/chatbot.mock';

import type { Portal } from '../types/user.types';
import type { AssistantPrompt } from '../types/chat.types';

function ensureMockMode(): void {
  if (!ENV.useMocks) {
    throw new Error(
      'Assistant API integration is not available yet.',
    );
  }
}

export async function getPageAssistantContext(
  portal: Portal,
  pageKey: string,
) {
  ensureMockMode();

  return getAssistantContext(portal, pageKey);
}

export async function getAssistantPromptReply(
  prompt: AssistantPrompt,
  portal: Portal,
) {
  ensureMockMode();

  return getChatbotReply(prompt, portal);
}

export async function getAssistantFreeTextReply(
  message: string,
  portal: Portal,
) {
  ensureMockMode();

  return getFreeTextReply(message, portal);
}