
/* src/ts/components/progress-bar.ts */

/**
 * Calculates the percentage of completed work.
 * Returns 0 if the maximum value is zero or negative.
 */
export function percentOf(value: number, max: number): number {
    if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) {
        return 0;
    }

    const percentage = Math.round((value / max) * 100);

    return Math.min(100, Math.max(0, percentage));
}

/**
 * Renders a progress bar.
 *
 * Example:
 * renderProgressBar(6, 8) displays 75% progress.
 */
export function renderProgressBar(
    value: number,
    max: number
): string {
    const percent = percentOf(value, max);
    const done = percent >= 100 ? " progress--done" : "";

    return `
        <div
            class="progress progress--bar${done}"
            role="progressbar"
            aria-label="Completion progress"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow="${percent}"
        >
            <div
                class="progress__fill"
                style="width: ${percent}%"
            ></div>
        </div>
    `;
}
