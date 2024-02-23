import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { appReducers } from './reducer';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import storage from 'redux-persist/lib/storage/session'; // defaults to localStorage for web

const persistConfig = {
  key: 'root',
  storage
};
const persistedReducer = persistReducer(persistConfig, appReducers);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
