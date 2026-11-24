
/* src/ts/types/chat.types.ts */

import type { Portal } from './user.types';

export interface AssistantPrompt {
  label: string;
  reply: string;
  displayOnly?: boolean;
}

export interface AssistantContext {
  title: string;
  intro: string;
  summary?: string;
  prompts: AssistantPrompt[];
  launcherSubtitle?: string;
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatbotReply {
  text: string;
  isDemo: true;
}

export type AssistantReplyHandler = (
  prompt: AssistantPrompt,
  portal: Portal
) => Promise<ChatbotReply>;
