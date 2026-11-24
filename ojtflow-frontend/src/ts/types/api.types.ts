
/**
 * OJTFlow — API Types
 * Phase 11: Frontend TypeScript Functionality
 *
 * Shared response, error, and pagination contracts.
 * These types prepare the frontend for future API integration.
 */

/**
 * Standard API response wrapper.
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/**
 * Standard API error structure.
 */
export interface ApiError {
  success: false;
  message: string;
  statusCode?: number;
  errors?: ApiFieldError[];
}

/**
 * Individual field validation error.
 */
export interface ApiFieldError {
  field: string;
  message: string;
}

/**
 * Pagination metadata.
 */
export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Paginated API response.
 */
export interface Paginated<T> {
  items: T[];
  pagination: PaginationMeta;
}
