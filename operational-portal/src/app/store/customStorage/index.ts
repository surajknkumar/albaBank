import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

const createLocalStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    }
  };
};

export const customStorage = typeof window !== 'undefined' ? createWebStorage('local') : createLocalStorage();
