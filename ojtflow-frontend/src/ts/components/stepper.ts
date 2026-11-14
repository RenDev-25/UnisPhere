// src/ts/components/stepper.ts

import { escapeHtml, icon } from '../utils/dom';

export type StepState = 'done' | 'active' | 'pending';

export interface StepperStep {
    label: string;
    state: StepState;
}

export interface StepperConfig {
    steps: StepperStep[];
}

/**
 * Renders a horizontal stepper.
 * Each step can be done, active, or pending.
 */
export function renderStepper(config: StepperConfig): string {
    return `
        <ol class="placement-stepper" aria-label="Placement progress">
            ${config.steps.map((step, index) => {
                const stateClass = `placement-stepper__step--${step.state}`;

                const marker = step.state === 'done'
                    ? icon('check')
                    : String(index + 1);

                const current = step.state === 'active'
                    ? ' aria-current="step"'
                    : '';

                return `
                    <li class="placement-stepper__step ${stateClass}"${current}>
                        <span class="placement-stepper__marker" aria-hidden="true">
                            ${marker}
                        </span>
                        <span class="placement-stepper__label">
                            ${escapeHtml(step.label)}
                        </span>
                    </li>
                `;
            }).join('')}
        </ol>
    `;
}

/**
 * Renders the numbered circular badge used
 * beside numbered sections in company forms.
 */
export function renderStepNumber(number: number): string {
    if (!Number.isInteger(number) || number < 1) {
        console.warn(`Invalid step number: ${number}`);
        return '';
    }

    return `
        <span class="step-number" aria-label="Section ${number}">
            ${number}
        </span>
    `;
}