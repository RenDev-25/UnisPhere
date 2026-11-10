
/* src/ts/utils/dom.ts */

export function qs<T extends Element = HTMLElement>(
    selector: string,
    root: ParentNode = document
): T {
    const el = root.querySelector<T>(selector);

    if (!el) {
        throw new Error(`Element not found: ${selector}`);
    }

    return el;
}

export function qsa<T extends Element = HTMLElement>(
    selector: string,
    root: ParentNode = document
): T[] {
    return Array.from(root.querySelectorAll<T>(selector));
}

const ESCAPES: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
};

/** Always use this (or textContent) before putting data into HTML. */
export function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);
}

export function icon(name: string, extraClass = ""): string {
    return `<span class="icon ${extraClass}" aria-hidden="true">${escapeHtml(name)}</span>`;
}
