/**
 * Storage utilities for localStorage
 */

export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return localStorage.getItem(key);
    }
  },

  set: (key, value) => {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  remove: (key) => {
    localStorage.removeItem(key);
  },

  clear: () => {
    localStorage.clear();
  },
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
};
