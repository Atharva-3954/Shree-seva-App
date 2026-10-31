/**
 * Format a number as Indian Rupee currency string
 * @param amount - The amount to format
 * @returns Formatted price string (e.g., "₹1,299.00")
 */
export const formatPrice = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format a number as Indian Rupee without decimals
 * @param amount - The amount to format
 * @returns Formatted price string (e.g., "₹1,299")
 */
export const formatPriceShort = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

/**
 * Format an ISO date string into a human-readable format
 * @param dateString - ISO date string
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string (e.g., "15 Jan 2025")
 */
export const formatDate = (
  dateString: string,
  options?: Intl.DateTimeFormatOptions,
): string => {
  const date = new Date(dateString);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  };
  return date.toLocaleDateString('en-IN', defaultOptions);
};

/**
 * Format an ISO date string with time
 * @param dateString - ISO date string
 * @returns Formatted date-time string (e.g., "15 Jan 2025, 2:30 PM")
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Get relative time string (e.g., "2 hours ago", "3 days ago")
 * @param dateString - ISO date string
 * @returns Relative time string
 */
export const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'just now';
  }
  if (diffMins < 60) {
    return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }
  if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
  return formatDate(dateString);
};

/**
 * Truncate text to a specified length with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength).trimEnd()}...`;
};

/**
 * Calculate discount percentage between original and sale price
 * @param originalPrice - Original price
 * @param salePrice - Sale price
 * @returns Discount percentage (e.g., 25)
 */
export const calculateDiscount = (
  originalPrice: number,
  salePrice: number,
): number => {
  if (originalPrice <= 0 || salePrice >= originalPrice) {
    return 0;
  }
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

/**
 * Format a phone number for display
 * @param phone - Raw phone number string
 * @returns Formatted phone string
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};
