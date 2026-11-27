
/* src/ts/components/status-badge.ts */

import { STATUS_VARIANTS } from "../core/constants";
import type { BadgeVariant } from "../core/constants";
import { escapeHtml } from "../utils/dom";

/**
 * Converts a status label into a consistent key.
 * Example: "For Review" becomes "for_review".
 */
export function normalizeStatus(label: string): string {
    return label.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

/**
 * Renders a status label using the matching badge style.
 * Unknown labels use the neutral "draft" variant.
 */
export function renderStatusBadge(label: string): string {
    const key = normalizeStatus(label);
    const known = Object.prototype.hasOwnProperty.call(
        STATUS_VARIANTS,
        key
    );

    if (!known) {
        console.warn(`Unknown status label: ${label}`);
    }

    const variant: BadgeVariant = known
        ? STATUS_VARIANTS[key]
        : "draft";

    return `
        <span class="badge badge--${variant}">
            <span class="badge__dot"></span>
            ${escapeHtml(label)}
        </span>
    `;
}
