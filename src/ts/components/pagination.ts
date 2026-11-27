
// src/ts/components/pagination.ts

export interface PaginationOptions {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function renderPagination(
  container: HTMLElement,
  options: PaginationOptions
): void {
  const pageSize = Math.max(1, options.pageSize);
  const totalPages = Math.max(
    1,
    Math.ceil(options.totalItems / pageSize)
  );

  const currentPage = Math.min(
    Math.max(1, options.currentPage),
    totalPages
  );

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  container.innerHTML = `
    <button
      type="button"
      class="pagination__button"
      data-js-page-prev
      ${currentPage <= 1 ? 'disabled' : ''}
      aria-label="Previous page"
    >
      Previous
    </button>

    <div class="pagination__numbers">
      ${pages.map((page) => `
        <button
          type="button"
          class="pagination__button ${page === currentPage ? 'is-active' : ''}"
          data-js-page-number="${page}"
          ${page === currentPage ? 'aria-current="page"' : ''}
        >
          ${page}
        </button>
      `).join('')}
    </div>

    <button
      type="button"
      class="pagination__button"
      data-js-page-next
      ${currentPage >= totalPages ? 'disabled' : ''}
      aria-label="Next page"
    >
      Next
    </button>
  `;

  container.querySelector('[data-js-page-prev]')
    ?.addEventListener('click', () => {
      if (currentPage > 1) {
        options.onPageChange(currentPage - 1);
      }
    });

  container.querySelector('[data-js-page-next]')
    ?.addEventListener('click', () => {
      if (currentPage < totalPages) {
        options.onPageChange(currentPage + 1);
      }
    });

  container.querySelectorAll<HTMLButtonElement>(
    '[data-js-page-number]'
  ).forEach((button) => {
    button.addEventListener('click', () => {
      const page = Number(button.dataset.jsPageNumber);

      if (Number.isInteger(page)) {
        options.onPageChange(page);
      }
    });
  });
}

export function updatePaginationSummary(
  element: HTMLElement,
  from: number,
  to: number,
  total: number
): void {
  element.textContent = `Showing ${from}-${to} of ${total}`;
}
