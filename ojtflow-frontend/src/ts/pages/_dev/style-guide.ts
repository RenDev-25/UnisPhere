
/* src/ts/pages/_dev/style-guide.ts */
import {
    renderStepper,
    renderStepNumber
} from '../../components/stepper';


const rootStyles = getComputedStyle(document.documentElement);

function getTokenValue(tokenName: string): string {
    return rootStyles.getPropertyValue(tokenName).trim();
}

function createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className: string,
    text: string
): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
}

function renderColorTokens(): void {
    const container = document.querySelector("#color-token-list");

    if (!container) return;

    const colorTokens = [
        "--color-surface",
        "--color-surface-dim",
        "--color-surface-bright",
        "--color-surface-container-lowest",
        "--color-surface-container-low",
        "--color-surface-container",
        "--color-surface-container-high",
        "--color-surface-container-highest",
        "--color-on-surface",
        "--color-on-surface-variant",
        "--color-inverse-surface",
        "--color-inverse-on-surface",
        "--color-outline",
        "--color-outline-variant",
        "--color-surface-tint",
        "--color-primary",
        "--color-on-primary",
        "--color-primary-container",
        "--color-on-primary-container",
        "--color-inverse-primary",
        "--color-secondary",
        "--color-on-secondary",
        "--color-secondary-container",
        "--color-on-secondary-container",
        "--color-tertiary",
        "--color-on-tertiary",
        "--color-tertiary-container",
        "--color-on-tertiary-container",
        "--color-error",
        "--color-on-error",
        "--color-error-container",
        "--color-on-error-container",
        "--color-primary-fixed",
        "--color-primary-fixed-dim",
        "--color-on-primary-fixed",
        "--color-on-primary-fixed-variant",
        "--color-secondary-fixed",
        "--color-secondary-fixed-dim",
        "--color-on-secondary-fixed",
        "--color-on-secondary-fixed-variant",
        "--color-tertiary-fixed",
        "--color-tertiary-fixed-dim",
        "--color-on-tertiary-fixed",
        "--color-on-tertiary-fixed-variant",
        "--color-background",
        "--color-on-background",
        "--color-surface-variant",
        "--color-brand",
        "--color-brand-hover",
        "--color-brand-pressed",
        "--color-charcoal",
        "--color-navy",
        "--color-canvas",
        "--color-canvas-alt",
        "--color-border",
        "--color-input-border",
        "--color-text-muted",
        "--color-text-label",
        "--color-success",
        "--color-warning",
        "--color-critical",
        "--color-info",
        "--badge-approved-bg",
        "--badge-approved-text",
        "--badge-approved-border",
        "--badge-pending-bg",
        "--badge-pending-text",
        "--badge-pending-border",
        "--badge-rejected-bg",
        "--badge-rejected-text",
        "--badge-rejected-border",
        "--badge-draft-bg",
        "--badge-draft-text",
        "--badge-draft-border"
    ];

    colorTokens.forEach((tokenName) => {
        const value = getTokenValue(tokenName);

        const item = createElement("div", "token-item", "");
        const swatch = createElement("div", "token-swatch", "");
        const details = createElement("div", "token-details", "");

        swatch.style.backgroundColor = value;

        const name = createElement("span", "token-name", tokenName);
        const tokenValue = createElement("span", "token-value", value || "MISSING");

        details.append(name, tokenValue);
        item.append(swatch, details);
        container.append(item);
    });
}

function renderValueTokens(
    containerId: string,
    tokenNames: string[]
): void {
    const container = document.getElementById(containerId);

    if (!container) return;

    tokenNames.forEach((tokenName) => {
        const value = getTokenValue(tokenName);

        const item = createElement("div", "value-item", "");
        const name = createElement("span", "token-name", tokenName);
        const tokenValue = createElement(
            "span",
            "token-value",
            value || "MISSING"
        );

        item.append(name, tokenValue);
        container.append(item);
    });
}

function renderTypography(): void {
    const container = document.querySelector("#type-token-list");

    if (!container) return;

    const typeTokens = [
        {
            name: "display-lg",
            size: "36px",
            lineHeight: "44px",
            weight: "700",
            spacing: "-0.02em"
        },
        {
            name: "display-lg-mobile",
            size: "28px",
            lineHeight: "36px",
            weight: "700",
            spacing: "-0.01em"
        },
        {
            name: "headline-lg",
            size: "28px",
            lineHeight: "36px",
            weight: "600",
            spacing: "-0.01em"
        },
        {
            name: "headline-lg-mobile",
            size: "22px",
            lineHeight: "30px",
            weight: "600",
            spacing: "-0.005em"
        },
        {
            name: "headline-md",
            size: "20px",
            lineHeight: "28px",
            weight: "600",
            spacing: "normal"
        },
        {
            name: "headline-sm",
            size: "18px",
            lineHeight: "26px",
            weight: "600",
            spacing: "normal"
        },
        {
            name: "title-md",
            size: "16px",
            lineHeight: "24px",
            weight: "600",
            spacing: "normal"
        },
        {
            name: "title-sm",
            size: "14px",
            lineHeight: "20px",
            weight: "600",
            spacing: "normal"
        },
        {
            name: "body-lg",
            size: "16px",
            lineHeight: "24px",
            weight: "400",
            spacing: "normal"
        },
        {
            name: "body-md",
            size: "14px",
            lineHeight: "20px",
            weight: "400",
            spacing: "normal"
        },
        {
            name: "body-sm",
            size: "12px",
            lineHeight: "16px",
            weight: "400",
            spacing: "normal"
        },
        {
            name: "label-lg",
            size: "14px",
            lineHeight: "20px",
            weight: "500",
            spacing: "0.01em"
        },
        {
            name: "label-md",
            size: "12px",
            lineHeight: "16px",
            weight: "500",
            spacing: "0.02em"
        },
        {
            name: "label-sm",
            size: "11px",
            lineHeight: "14px",
            weight: "600",
            spacing: "0.04em"
        }
    ];

    typeTokens.forEach((token) => {
        const item = createElement("div", "type-item", "");
        const sample = createElement(
            "div",
            "type-item__sample",
            "OJTFlow Design System"
        );

        sample.style.fontFamily = "var(--font-family)";
        sample.style.fontSize = token.size;
        sample.style.lineHeight = token.lineHeight;
        sample.style.fontWeight = token.weight;
        sample.style.letterSpacing = token.spacing;

        const details = createElement(
            "div",
            "type-item__details",
            `${token.name} · ${token.size} / ${token.lineHeight} · Weight ${token.weight} · Letter spacing ${token.spacing}`
        );

        item.append(sample, details);
        container.append(item);
    });
}

renderColorTokens();
renderTypography();

renderValueTokens("spacing-token-list", [
    "--space-1",
    "--space-2",
    "--space-4",
    "--space-6",
    "--space-8",
    "--space-12",
    "--gutter",
    "--gutter-mobile",
    "--margin",
    "--margin-mobile"
]);

renderValueTokens("radius-token-list", [
    "--radius-sm",
    "--radius",
    "--radius-md",
    "--radius-lg",
    "--radius-xl",
    "--radius-full"
]);

renderValueTokens("layout-token-list", [
    "--sidebar-width",
    "--sidebar-width-rail",
    "--topbar-height",
    "--content-max",
    "--modal-backdrop-blur"
]);

renderValueTokens("shadow-token-list", [
    "--shadow-1",
    "--shadow-2",
    "--shadow-3",
    "--backdrop",
    "--focus-ring"
]);


function renderIconTokens(): void {
    const container = document.querySelector("#icon-token-list");

    if (!container) return;

    // These names appear explicitly in Listing 8.1.
    const iconNames = ["close", "smart_toy"];

    iconNames.forEach((iconName) => {
        const item = createElement("div", "icon-item", "");

        const iconElement = createElement("span", "icon icon--24", iconName);
        const name = createElement(
            "span",
            "icon-item__name",
            iconName
        );

        item.append(iconElement, name);
        container.append(item);
    });
}

renderIconTokens();





// Stepper component examples

// Stepper component examples
const stepperDemo = document.querySelector('#stepper-renderer-demo');

if (stepperDemo) {
    stepperDemo.innerHTML = `
        <div class="card">
            ${renderStepper({
                steps: [
                    { label: 'Application Accepted', state: 'done' },
                    { label: 'Placement Confirmed', state: 'active' },
                    {
                        label: 'Pre-Deployment Requirements',
                        state: 'pending'
                    }
                ]
            })}
        </div>
    `;
}

// Numbered section badge examples
const numberedSectionDemo = document.querySelector(
    '#numbered-section-renderer-demo'
);

if (numberedSectionDemo) {
    numberedSectionDemo.innerHTML = `
        <div class="numbered-section">
            ${renderStepNumber(1)}
            <span>Company Information</span>
        </div>

        <div class="numbered-section">
            ${renderStepNumber(2)}
            <span>Contact Information</span>
        </div>

        <div class="numbered-section">
            ${renderStepNumber(3)}
            <span>Company Requirements</span>
        </div>
    `;
}
