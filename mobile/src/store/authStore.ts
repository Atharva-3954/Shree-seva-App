import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../types/auth.types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (user, token) => {
    await AsyncStorage.setItem('auth_token', token);
    await AsyncStorage.setItem('auth_user', JSON.stringify(user));
    set({user, token, isAuthenticated: true, isLoading: false});
  },

  logout: async () => {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('auth_user');
    set({user: null, token: null, isAuthenticated: false, isLoading: false});
  },

  loadStoredAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userStr = await AsyncStorage.getItem('auth_user');
      if (token && userStr) {
        const user = JSON.parse(userStr) as User;
        set({user, token, isAuthenticated: true, isLoading: false});
      } else {
        set({isLoading: false});
      }
    } catch {
      set({isLoading: false});
    }
  },

  updateUser: (updates) => {
    const {user} = get();
    if (user) {
      const updatedUser = {...user, ...updates};
      AsyncStorage.setItem('auth_user', JSON.stringify(updatedUser));
      set({user: updatedUser});
    }
  },
}));
