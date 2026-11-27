
/* src/ts/components/info-field.ts */

import { escapeHtml } from "../utils/dom";

export interface InfoFieldConfig {
    label: string;
    value?: string | number | null;
    monospace?: boolean;
    href?: string;
    copyable?: boolean;
}

/**
 * Allows safe web, email, and internal links.
 * Other protocols, such as javascript:, are rejected.
 */
function getSafeHref(href: string): string {
    const trimmed = href.trim();

    if (
        trimmed.startsWith("/") ||
        trimmed.startsWith("#") ||
        trimmed.startsWith("./") ||
        trimmed.startsWith("../")
    ) {
        return trimmed;
    }

    try {
        const url = new URL(trimmed);

        if (
            url.protocol === "https:" ||
            url.protocol === "http:" ||
            url.protocol === "mailto:"
        ) {
            return trimmed;
        }
    } catch {
        // Invalid URL: render the value as plain text.
    }

    return "";
}

/**
 * Renders a label and its corresponding value.
 */
export function renderInfoField(
    config: InfoFieldConfig
): string {
    const label = escapeHtml(config.label);
    const rawValue = config.value == null
        ? ""
        : String(config.value).trim();

    const hasValue = rawValue.length > 0;

    if (!hasValue) {
        return `
            <div class="info-field">
                <span class="info-field__label">${label}</span>
                <span class="info-field__value info-field__value--empty">
                    <em>Not provided</em>
                </span>
            </div>
        `;
    }

    const value = escapeHtml(rawValue);

    const valueClasses = [
        "info-field__value",
        config.monospace ? "info-field__value--monospace" : "",
        config.href ? "info-field__value--link" : ""
    ]
        .filter(Boolean)
        .join(" ");

    const safeHref = config.href
        ? getSafeHref(config.href)
        : "";

    let valueContent = value;

    if (safeHref) {
        valueContent = `
            <a
                class="${valueClasses}"
                href="${escapeHtml(safeHref)}"
                ${safeHref.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}
            >
                ${value}
            </a>
        `;
    } else {
        valueContent = `
            <span class="${valueClasses}">
                ${value}
            </span>
        `;
    }

    const copyHint = config.copyable
        ? `
            <span
                class="info-field__copy-hint"
                title="Click to copy"
                aria-label="Copyable value"
                data-copy-value="${value}"
            >
                Copy
            </span>
        `
        : "";

    return `
        <div class="info-field">
            <span class="info-field__label">${label}</span>

            <div class="info-field__content">
                ${valueContent}
                ${copyHint}
            </div>
        </div>
    `;
}
