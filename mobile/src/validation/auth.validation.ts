/**
 * Validation schemas for authentication forms.
 *
 * These use simple validation functions instead of Zod to avoid
 * adding an extra dependency. If you want to use Zod, install it
 * and replace these with z.object() schemas.
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate email format
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate login form data
 */
export const validateLogin = (data: {
  email: string;
  password: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate registration form data
 */
export const validateRegister = (data: {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone?: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.fullName.trim()) {
    errors.fullName = 'Full name is required';
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters';
  } else if (data.fullName.trim().length > 100) {
    errors.fullName = 'Full name must not exceed 100 characters';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  } else if (data.password.length > 128) {
    errors.password = 'Password must not exceed 128 characters';
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (data.phone && data.phone.trim()) {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit Indian phone number';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate forgot password form data
 */
export const validateForgotPassword = (data: {
  email: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate change password form data
 */
export const validateChangePassword = (data: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.currentPassword) {
    errors.currentPassword = 'Current password is required';
  }

  if (!data.newPassword) {
    errors.newPassword = 'New password is required';
  } else if (data.newPassword.length < 6) {
    errors.newPassword = 'New password must be at least 6 characters';
  } else if (data.newPassword.length > 128) {
    errors.newPassword = 'New password must not exceed 128 characters';
  }

  if (data.newPassword !== data.confirmNewPassword) {
    errors.confirmNewPassword = 'Passwords do not match';
  }

  if (data.currentPassword === data.newPassword) {
    errors.newPassword = 'New password must be different from current password';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
