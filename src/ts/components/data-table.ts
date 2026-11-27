
// src/ts/components/data-table.ts

export interface TableQuery<T> {
  search: string;
  searchFields: (keyof T)[];
  filters: Partial<Record<keyof T, string>>;
  page: number;
  pageSize: number;
}

export interface TablePage<T> {
  rows: T[];
  total: number;
  from: number;
  to: number;
  page: number;
  pageSize: number;
  pages: number;
}

export function queryRows<T extends Record<string, unknown>>(
  all: T[],
  query: TableQuery<T>
): TablePage<T> {
  const term = query.search.trim().toLowerCase();

  const filtered = all.filter((row) => {
    const matchesSearch =
      term === '' ||
      query.searchFields.some((field) =>
        String(row[field] ?? '').toLowerCase().includes(term)
      );

    const matchesFilters = (
      Object.keys(query.filters) as (keyof T)[]
    ).every((key) => {
      const wanted = query.filters[key];

      return !wanted || String(row[key] ?? '') === wanted;
    });

    return matchesSearch && matchesFilters;
  });

  const total = filtered.length;
  const pageSize = Math.max(1, query.pageSize);
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, query.page), pages);
  const start = (page - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);

  return {
    rows,
    total,
    from: total === 0 ? 0 : start + 1,
    to: total === 0 ? 0 : start + rows.length,
    page,
    pageSize,
    pages
  };
}

export function getTableRangeText<T>(
  result: TablePage<T>
): string {
  return `Showing ${result.from}-${result.to} of ${result.total}`;
}

export function renderNoResultsRow(
  columnCount: number,
  message = 'No matching results found.'
): string {
  const safeColumnCount = Math.max(1, columnCount);

  return `
    <tr data-js-no-results>
      <td colspan="${safeColumnCount}">
        <div class="empty-state">
          <p>${message}</p>
        </div>
      </td>
    </tr>
  `;
}
