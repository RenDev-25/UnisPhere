
/* src/ts/components/empty-state.ts */

import { escapeHtml, icon } from "../utils/dom";

export interface EmptyStateConfig {
    iconName: string;
    title: string;
    text?: string;
    actionLabel?: string;
    actionHref?: string;
}

/**
 * Renders an empty-state message.
 *
 * The action link is optional.
 */
export function renderEmptyState(
    config: EmptyStateConfig
): string {
    const action = config.actionLabel
        ? `
            <div class="empty-state__action">
                <a
                    class="btn btn--secondary"
                    href="${escapeHtml(config.actionHref ?? "#")}"
                >
                    ${escapeHtml(config.actionLabel)}
                </a>
            </div>
        `
        : "";

    return `
        <div class="empty-state">
            <span class="empty-state__icon">
                ${icon(config.iconName)}
            </span>

            <h3 class="empty-state__title">
                ${escapeHtml(config.title)}
            </h3>

            ${
                config.text
                    ? `
                        <p class="empty-state__description">
                            ${escapeHtml(config.text)}
                        </p>
                    `
                    : ""
            }

            ${action}
        </div>
    `;
}
