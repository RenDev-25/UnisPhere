
// src/ts/components/kpi-card.ts

import { escapeHtml, icon } from '../utils/dom';

/**
 * Configuration for the reusable KPI card.
 */
export interface KpiCardConfig {
  label: string;
  value: string | number;
  chip?: string;
  caption?: string;
  iconName?: string;
  captionIcon?: string;
  accent?: 'red' | 'navy' | 'amber' | 'grey';
}

/**
 * Configuration for the information tile.
 */
export interface InfoTileConfig {
  label: string;
  value: string | number;
}

/**
 * Render a reusable KPI card.
 */
export function renderKpiCard(c: KpiCardConfig): string {
  const accent = c.accent
    ? ` kpi-card--${c.accent}`
    : '';

  const countTarget = typeof c.value === 'number'
    ? c.value
    : '';

  return `
    <article class="kpi-card${accent}">

      <header class="kpi-card__head">

        <span class="kpi-card__label t-label-sm">
          ${escapeHtml(c.label)}
        </span>

        ${
          c.iconName
            ? `<span class="kpi-card__icon">
                 ${icon(c.iconName)}
               </span>`
            : ''
        }

      </header>

      <div class="kpi-card__body">

        <strong
          class="kpi-card__value t-headline-lg tabular"
          data-js-count-to="${countTarget}"
        >
          ${escapeHtml(String(c.value))}
        </strong>

        ${
          c.chip
            ? `<span class="chip">
                 ${escapeHtml(c.chip)}
               </span>`
            : ''
        }

      </div>

      ${
        c.caption
          ? `<p class="kpi-card__caption t-body-sm">
               ${
                 c.captionIcon
                   ? icon(c.captionIcon, 'kpi-card__caption-icon')
                   : ''
               }
               ${escapeHtml(c.caption)}
             </p>`
          : ''
      }

    </article>
  `;
}

/**
 * Render the information tile used in the student welcome section.
 */
export function renderInfoTile(c: InfoTileConfig): string {
  return `
    <article class="info-tile">

      <span class="info-tile__label t-label-sm">
        ${escapeHtml(c.label)}
      </span>

      <strong class="info-tile__value">
        ${escapeHtml(String(c.value))}
      </strong>

    </article>
  `;
}
