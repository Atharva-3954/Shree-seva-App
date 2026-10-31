import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Type-safe wrapper around AsyncStorage for storing and retrieving JSON values.
 */

/**
 * Get a typed value from AsyncStorage
 */
export const getStorageItem = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) {
      return null;
    }
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Error reading storage key "${key}":`, error);
    return null;
  }
};

/**
 * Set a typed value in AsyncStorage
 */
export const setStorageItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    const serialized = JSON.stringify(value);
    await AsyncStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Error writing storage key "${key}":`, error);
  }
};

/**
 * Remove a value from AsyncStorage
 */
export const removeStorageItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing storage key "${key}":`, error);
  }
};

/**
 * Get a raw string value from AsyncStorage
 */
export const getStorageString = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`Error reading storage key "${key}":`, error);
    return null;
  }
};

/**
 * Set a raw string value in AsyncStorage
 */
export const setStorageString = async (
  key: string,
  value: string,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error writing storage key "${key}":`, error);
  }
};

/**
 * Clear all values from AsyncStorage
 */
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

/**
 * Get multiple values from AsyncStorage
 */
export const getMultipleStorageItems = async (
  keys: string[],
): Promise<Record<string, string | null>> => {
  try {
    const pairs = await AsyncStorage.multiGet(keys);
    const result: Record<string, string | null> = {};
    pairs.forEach(([key, value]) => {
      result[key] = value;
    });
    return result;
  } catch (error) {
    console.error('Error reading multiple storage keys:', error);
    return {};
  }
};
