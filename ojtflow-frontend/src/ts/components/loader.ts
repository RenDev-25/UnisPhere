
/* =========================================================
   OJTFLOW — LOADER COMPONENT
   Phase 12 — Stage 12.2
   ========================================================= */

export type SkeletonType =
  | 'kpi'
  | 'table'
  | 'chart'
  | 'detail';

export interface LoaderOptions {
  rows?: number;
  columns?: number;
  message?: string;
}

/* =========================================================
   ESCAPE HTML
========================================================= */


/* =========================================================
   KPI SKELETON
========================================================= */

function renderKpiSkeleton(): string {
  return `
    <div class="skeleton-kpi" aria-hidden="true">
      <span class="skeleton skeleton-kpi__icon"></span>
      <span class="skeleton skeleton-kpi__value"></span>
      <span class="skeleton skeleton-kpi__label"></span>
    </div>
  `;
}

/* =========================================================
   TABLE SKELETON
========================================================= */

function renderTableSkeleton(
  rows = 5,
  columns = 4,
): string {

  const cell = `
    <span class="skeleton skeleton-table__cell"></span>
  `;

  const renderRow = (): string => `
    <div class="skeleton-table__row">
      ${Array.from(
        { length: columns },
        () => cell,
      ).join('')}
    </div>
  `;

  return `
    <div class="skeleton-table" aria-hidden="true">
      <div class="skeleton-table__header">
        ${Array.from(
          { length: columns },
          () => cell,
        ).join('')}
      </div>

      ${Array.from(
        { length: rows },
        renderRow,
      ).join('')}
    </div>
  `;
}

/* =========================================================
   CHART SKELETON
========================================================= */

function renderChartSkeleton(): string {
  return `
    <div class="skeleton-chart" aria-hidden="true">
      <span class="skeleton skeleton-chart__title"></span>
      <span class="skeleton skeleton-chart__visual"></span>
    </div>
  `;
}

/* =========================================================
   DETAIL SKELETON
========================================================= */

function renderDetailSkeleton(): string {
  return `
    <div class="skeleton-detail" aria-hidden="true">
      <span class="skeleton skeleton-detail__heading"></span>
      <span class="skeleton skeleton-detail__line"></span>
      <span class="skeleton skeleton-detail__line skeleton-detail__line--short"></span>
      <span class="skeleton skeleton-detail__line"></span>
      <span class="skeleton skeleton-detail__line skeleton-detail__line--short"></span>
    </div>
  `;
}

/* =========================================================
   RENDER SKELETON
========================================================= */

export function renderSkeleton(
  type: SkeletonType,
  options: LoaderOptions = {},
): string {

  switch (type) {

    case 'kpi':
      return renderKpiSkeleton();

    case 'table':
      return renderTableSkeleton(
        options.rows ?? 5,
        options.columns ?? 4,
      );

    case 'chart':
      return renderChartSkeleton();

    case 'detail':
      return renderDetailSkeleton();

    default:
      return '';
  }
}

/* =========================================================
   SHOW LOADING STATE
========================================================= */

export function showLoading(
  container: HTMLElement,
  type: SkeletonType,
  options: LoaderOptions = {},
): void {

  container.setAttribute('aria-busy', 'true');

  container.dataset.jsLoadingRegion = '';

  container.innerHTML = renderSkeleton(type, options);
}

/* =========================================================
   HIDE LOADING STATE
========================================================= */

export function hideLoading(
  container: HTMLElement,
): void {

  container.removeAttribute('aria-busy');
}

/* =========================================================
   SHOW ERROR STATE WITH RETRY
========================================================= */

export function showLoadingError(
  container: HTMLElement,
  retry: () => void | Promise<void>,
  message = 'Unable to load this section.',
): void {

  container.removeAttribute('aria-busy');

  container.innerHTML = '';

  const wrapper = document.createElement('div');

  wrapper.className = 'state-error';

  const messageElement = document.createElement('p');

  messageElement.className = 'state-error__message';

  messageElement.textContent = message;

  const retryButton = document.createElement('button');

  retryButton.type = 'button';
  retryButton.className = 'btn btn--secondary';
  retryButton.textContent = 'Retry';

  retryButton.addEventListener('click', async () => {
    retryButton.disabled = true;
    retryButton.textContent = 'Retrying...';

    try {
      await retry();
    } catch {
      retryButton.disabled = false;
      retryButton.textContent = 'Retry';
    }
  });

  wrapper.append(messageElement, retryButton);

  container.replaceChildren(wrapper);
}

/* =========================================================
   LOAD DATA WITH SKELETON AND ERROR STATE
========================================================= */

export async function loadWithSkeleton<T>(
  container: HTMLElement,
  type: SkeletonType,
  request: () => Promise<T>,
  render: (data: T) => void,
  options: LoaderOptions = {},
): Promise<void> {

  showLoading(container, type, options);

  try {

    const data = await request();

    hideLoading(container);

    render(data);

  } catch (error) {

    console.error(
      'OJTFlow: Failed to load region.',
      error,
    );

    showLoadingError(
      container,
      () => loadWithSkeleton(
        container,
        type,
        request,
        render,
        options,
      ),
      options.message ?? 'Unable to load this section.',
    );
  }
}

/* =========================================================
   TESTING — TWO SECOND LOADING DELAY
========================================================= */

export function withTestDelay<T>(
  request: () => Promise<T>,
  delay = 2000,
): Promise<T> {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      request().then(resolve).catch(reject);
    }, delay);
  });
}