import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import authService from '../services/auth.service';

import { responseHandler } from './common';
import { IAuthDetails, IAuthState } from '@app/models/interfaces/auth.interface';

const initialState: IAuthState = {
  username: '',
  expiresOn: '',
  userId: '',
  isAccountRefreshed: false
};

export const fetchAuthDetails = createAsyncThunk('fetchAuthDetails', async () => {
  return await authService.getAuthDetails().then((data) => responseHandler(data));
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthDetails.pending, (state) => {
        state.isAccountRefreshed = false;
      })
      .addCase(fetchAuthDetails.fulfilled, (state, action: PayloadAction<IAuthDetails>) => {
        state.username = action.payload.user_name;
        state.expiresOn = action.payload.session_expires_on;
        state.userId = action.payload.user_id;
        state.isAccountRefreshed = true;
      })
      .addCase(fetchAuthDetails.rejected, (state) => {
        state.isAccountRefreshed = false;
      });
  }
});

export const authReducer = authSlice.reducer;
