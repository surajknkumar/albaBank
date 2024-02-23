import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  WithdrawalDetail,
  WithdrawalRequestTaskData,
  WithdrawalState
} from '@app/models/interfaces/withdrawal.interface';
import { BALANCE_STATUS, TASK_STATUS } from '@app/models/enum/client.enum';
import withdrawalService from '@app/services/withdrawal.service';
import { clientOverviewDetails } from './client.store';
import { convertDDtoMMDate } from '../utils/helpers';
import { errorHandler, responseHandler } from './common';

const initialState: WithdrawalState = {
  withdrawalRequestList: [],
  withdrawalDetails: [],
  showLoader: false,
  status: 'idle',
  saveRequestStatus: '',
  errorMessage: null
};

export const createWithdrawalRequest = createAsyncThunk<
  any,
  { accountId: string; req: WithdrawalDetail },
  { state: any }
>('withdrawal/create-withdrawal-request', async (params, { dispatch, rejectWithValue }) => {
  return await withdrawalService
    .postWithdrawalRequest(params.accountId, params.req)
    .then((data) => responseHandler(data, rejectWithValue))
    .catch((e) => errorHandler(e, rejectWithValue));
});

export const withdrawalRequestByAccountId = createAsyncThunk<any, any, { state: any }>(
  'withdrawal/withdrawal-request-by-account-id',
  async (params, { dispatch, rejectWithValue }) => {
    return await withdrawalService
      .getWithdrawalRequest(params)
      .then((data) => responseHandler(data))
      .catch((e) => errorHandler(e, rejectWithValue));
  }
);

export const createAndGetWithdrawalRequest = createAsyncThunk<any, any, { state: any }>(
  'client/create-and-get-withdrawal-request',
  async (params: { accountId: string; req: any; customerId: string }, { dispatch }) => {
    await dispatch(createWithdrawalRequest(params));
    return await dispatch(clientOverviewDetails(params.customerId));
  }
);

export const editWithdrawalRequest = createAsyncThunk<
  any,
  { accountId: string; req: WithdrawalDetail },
  { state: any }
>('withdrawal/edit-withdrawal-request', async (params, { dispatch, rejectWithValue }) => {
  return await withdrawalService
    .putWithdrawalRequest(params.accountId, params.req)
    .then((data) => responseHandler(data, rejectWithValue))
    .catch((e) => errorHandler(e, rejectWithValue));
});

export const fetchWithdrawalRequestTaskList = createAsyncThunk<any, { status: TASK_STATUS }, { state: any }>(
  'withdrawal/Get-tasks-list',
  async (params, { dispatch, rejectWithValue }) => {
    return await withdrawalService
      .getWithdrawalRequestTaskList(params.status)
      .then((data) => responseHandler(data))
      .catch((e) => errorHandler(e, rejectWithValue));
  }
);

export const WithdrawalSlice = createSlice({
  name: 'withdrawal',
  initialState,
  reducers: {
    sortWithdrawalRequestList: (
      state: WithdrawalState,
      action: PayloadAction<{ sortBy: keyof WithdrawalRequestTaskData; ascending: boolean }>
    ) => {
      state.withdrawalRequestList = state.withdrawalRequestList
        .map((item) => {
          return { ...item, taskData: { ...item.taskData, balanceStatus: BALANCE_STATUS.IDLE } };
        })
        .sort((item1, item2) => {
          let a, b;
          switch (action.payload.sortBy) {
            case 'balance':
            case 'withdrawalAmount':
              a = parseFloat(item1.taskData[action.payload.sortBy]);
              b = parseFloat(item2.taskData[action.payload.sortBy]);
              break;
            case 'withdrawalDate':
              a = new Date(convertDDtoMMDate(item1.taskData[action.payload.sortBy]));
              b = new Date(convertDDtoMMDate(item2.taskData[action.payload.sortBy]));
              break;
            default:
              a = item1.taskData[action.payload.sortBy];
              b = item2.taskData[action.payload.sortBy];
          }
          if (action.payload.ascending) return a >= b ? 1 : -1;
          return a <= b ? 1 : -1;
        });
      state.sortBy = action.payload.sortBy;
      state.ascending = action.payload.ascending;
    },
    setWithdrawalStatus: (state: WithdrawalState, action: PayloadAction<'loading' | 'idle' | 'failed'>) => {
      state.status = action.payload;
    },
    setErrorMessage: (state: WithdrawalState, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    },
    clearWithdrawalStore: (state: WithdrawalState) => {
      state.showLoader = initialState.showLoader;
    },
    clearSaveRequestStatus: (state: WithdrawalState) => {
      state.saveRequestStatus = initialState.saveRequestStatus;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createWithdrawalRequest.pending, (state) => {
        state.status = 'loading';
        state.saveRequestStatus = 'pending';
      })
      .addCase(createWithdrawalRequest.fulfilled, (state, action) => {
        state.status = 'idle';
        state.saveRequestStatus = 'success';
      })
      .addCase(createWithdrawalRequest.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.saveRequestStatus = 'failed';
        state.errorMessage = action.payload.message;
      })
      .addCase(withdrawalRequestByAccountId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(withdrawalRequestByAccountId.fulfilled, (state, action: PayloadAction<WithdrawalDetail[]>) => {
        state.withdrawalDetails = action.payload.map((detail) => {
          return {
            ...detail,
            requestDate: convertDDtoMMDate(detail.requestDate),
            withdrawalDate: convertDDtoMMDate(detail.withdrawalDate),
            amount: parseFloat(detail.amount).toFixed(2),
            edit: false
          };
        });
        state.status = 'idle';
      })
      .addCase(withdrawalRequestByAccountId.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(editWithdrawalRequest.pending, (state) => {
        state.status = 'loading';
        state.saveRequestStatus = 'pending';
      })
      .addCase(editWithdrawalRequest.fulfilled, (state) => {
        state.status = 'idle';
        state.saveRequestStatus = 'success';
      })
      .addCase(editWithdrawalRequest.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.saveRequestStatus = 'failed';
        state.errorMessage = action.payload.message;
      })
      .addCase(fetchWithdrawalRequestTaskList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWithdrawalRequestTaskList.fulfilled, (state, action) => {
        state.status = 'idle';
        state.withdrawalRequestList = action.payload;
      })
      .addCase(fetchWithdrawalRequestTaskList.rejected, (state) => {
        state.status = 'failed';
      });
  }
});

export const {
  sortWithdrawalRequestList,
  setErrorMessage,
  clearWithdrawalStore,
  clearSaveRequestStatus,
  setWithdrawalStatus
} = WithdrawalSlice.actions;

export const withdrawalReducer = WithdrawalSlice.reducer;
