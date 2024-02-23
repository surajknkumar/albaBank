import { combineReducers } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';
import { authReducer } from '../auth';
import { clientReducer } from '../client.store';
import { customStorage } from '../customStorage';
import { withdrawalReducer } from '../withdrawal.store';
import { permissionsReducer } from '../permission.store';

const clientReducerConfig = {
  key: 'client',
  storage: customStorage,
  whitelist: ['permissionsDetails']
};

export const appReducers = combineReducers({
  auth: authReducer,
  permissions: permissionsReducer,
  client: persistReducer(clientReducerConfig, clientReducer),
  withdrawal: withdrawalReducer
});
