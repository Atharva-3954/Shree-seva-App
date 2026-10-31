import {Platform} from 'react-native';

// Android emulator uses 10.0.2.2 to reach host localhost
// iOS simulator uses localhost directly
export const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:3000/api',
  ios: 'http://localhost:3000/api',
  default: 'http://localhost:3000/api',
});

export const APP_CONFIG = {
  appName: 'Shree Seva',
  version: '1.0.0',
  pagination: {
    defaultPageSize: 20,
  },
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
} as const;
