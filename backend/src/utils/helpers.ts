/**
 * Generate a unique order number.
 * Format: SS-YYYYMMDD-XXXXXX (e.g. SS-20241031-A3F8B2)
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const datePart = now.getFullYear().toString()
    + (now.getMonth() + 1).toString().padStart(2, '0')
    + now.getDate().toString().padStart(2, '0');

  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `SS-${datePart}-${randomPart}`;
}

/**
 * Generate a URL-friendly slug from a name.
 * Handles unicode, multiple spaces, and special characters.
 *
 * @example generateSlug("Organic Wheat Flour 5kg") => "organic-wheat-flour-5kg"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')    // Remove non-word characters (except spaces and hyphens)
    .replace(/[\s_]+/g, '-')     // Replace spaces and underscores with hyphens
    .replace(/-+/g, '-')         // Collapse multiple hyphens
    .replace(/^-+|-+$/g, '');    // Remove leading/trailing hyphens
}

/**
 * Calculate pagination offset and limit from page and perPage params.
 *
 * @param page - Current page number (1-indexed, defaults to 1)
 * @param limit - Items per page (defaults to 20, max 100)
 * @returns Object with offset, limit, and page
 */
export function paginate(page: number = 1, limit: number = 20): {
  offset: number;
  limit: number;
  page: number;
} {
  const sanitizedPage = Math.max(1, Math.floor(page));
  const sanitizedLimit = Math.min(100, Math.max(1, Math.floor(limit)));

  return {
    offset: (sanitizedPage - 1) * sanitizedLimit,
    limit: sanitizedLimit,
    page: sanitizedPage,
  };
}
