export const colors = {
  primary: '#FFD600',
  danger: '#E50914',
  white: '#FFFFFF',
  black: '#202020',
  grey: '#777777',
  success: '#168A43',

  // Extended palette
  background: '#FFFFFF',
  surface: '#F5F5F5',
  textPrimary: '#202020',
  textSecondary: '#777777',
  textInverse: '#FFFFFF',
  border: '#E0E0E0',
  disabled: '#CCCCCC',
  overlay: 'rgba(32, 32, 32, 0.5)',

  // Status colors
  statusPending: '#FFD600',
  statusConfirmed: '#168A43',
  statusCancelled: '#E50914',
  statusProcessing: '#2196F3',
} as const;

export type ColorKey = keyof typeof colors;
