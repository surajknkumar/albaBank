import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ClientState, ClientSearchDetails, ClientDetails } from '@app/models/interfaces/clients.interface';
import clientService from '@services/client.service';
import { responseHandler } from './common';
import { AxiosError } from 'axios';
import { IResponse } from '.';
import { sweetAlertCall } from '@app/utils/helpers';

const initialState: ClientState = {
  status: 'idle',
  searchClientList: [],
  clientDetails: {
    personalInfo: {
      name: '',
      dob: '',
      customerId: ''
    },
    contactDetails: {
      mobileNumber: '',
      emailId: '',
      addresses: ['']
    },
    marketingPreferences: {
      contactByEmail: false,
      contactByPhone: true,
      contactByPost: false
    },
    generalDetails: {
      createdDate: '',
      lastModifiedDate: '',
      clientState: '',
      activationDate: '',
      approvedDate: ''
    },
    userSince: '',
    tags: [],
    accounts: [],
    notesHistory: [],
    addNoteStatus: ''
  },
  questionVerification: {
    questions: [],
    cvhId: '',
    additional: {
      dob: '',
      emailId: '',
      mobileNumber: '',
      postcode: ''
    },

    userSince: '',
    tags: []
  },
  historyVerificationList: [],
  alertDetails: {
    open: false,
    severity: 'success',
    message: ''
  }
};

export const searchClient = createAsyncThunk<any, any, { state: any }>('client/list', async (params) => {
  return await clientService.getClientList(params.searchParam, params.value).then((data) => responseHandler(data));
});
export const clientOverviewDetails = createAsyncThunk<any, any, { state: any }>('client/overview', async (params) => {
  return await clientService.getCustomerOverview(params).then((data) => responseHandler(data));
});
export const fetchClientVerificationDetails = createAsyncThunk<any, any, { state: any }>(
  'client/verification-details',
  async (params, { dispatch, rejectWithValue }) => {
    return await clientService.getClientVerificationDetails(params).then(
      (data) => {
        if (data.data.code === 0) dispatch(historyVerification(params));
        return responseHandler(data, rejectWithValue);
      },
      (error: AxiosError<IResponse<any>>) => {
        // Note: Any http error here should be shown in a popup with redirection to search page
        sweetAlertCall(
          error.response?.data.message || 'Something went wrong, please try again',
          '',
          'error',
          'Ok',
          true,
          () => (window.location.href = '/')
        );
        throw error;
      }
    );
  }
);

export const customerVerification = createAsyncThunk<any, any, { state: any }>(
  'client/customer-verification',
  async (params) => {
    return await clientService.verifyIdentity(params.customerId, params.req).then((data) => responseHandler(data));
  }
);
export const historyVerification = createAsyncThunk<any, any, { state: any }>(
  'client/history-verification',
  async (params) => {
    return await clientService.getVerificationHistory(params).then((data) => responseHandler(data));
  }
);

export const marketingPreferences = createAsyncThunk<any, any, { state: any }>(
  'clients/marketing-preferences',
  async (params) => {
    return await clientService
      .updateMarketingPreferences(params.customerId, params.req)
      .then((data) => responseHandler(data));
  }
);
export const clientsNotes = createAsyncThunk<any, any, { state: any }>('client/get-note', async (params) => {
  return await clientService.getClientsNotes(params.customerId).then((data) => responseHandler(data));
});
export const addClientNotes = createAsyncThunk<any, any, { state: any }>('client/send-note', async (params) => {
  return await clientService.addClientNotes(params.customerId, params.note).then((data) => responseHandler(data));
});
export const updateAndGetClientNotes = createAsyncThunk<any, any, { state: any }>(
  'client/update-and-get-notes',
  async (params, { dispatch }) => {
    await dispatch(addClientNotes(params));
    return await dispatch(clientsNotes(params));
  }
);

export const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    setClientStatus: (state: ClientState, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
    setClientList: (state: ClientState, action: PayloadAction<any>) => {
      state.searchClientList = action.payload;
    },
    setAlertDetails: (state: ClientState, action: PayloadAction<any>) => {
      state.alertDetails = action.payload;
    },
    setSelectedClient: (state: ClientState, action: PayloadAction<ClientSearchDetails>) => {
      state.clientDetails.personalInfo.name = action.payload.name;
      state.clientDetails.contactDetails.mobileNumber = action.payload.mobileNumber;
      state.clientDetails.personalInfo.customerId = action.payload.customerId;
    },
    setClientOverview: (state: ClientState, action: PayloadAction<ClientDetails>) => {
      state.clientDetails = { ...state.clientDetails, ...action.payload };
    },

    clearClientStore: (state: ClientState) => {
      state = initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(historyVerification.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(historyVerification.fulfilled, (state, action) => {
        state.status = 'idle';
        state.historyVerificationList = action.payload.records;
      })
      .addCase(historyVerification.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(marketingPreferences.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(marketingPreferences.fulfilled, (state, action) => {
        state.status = 'idle';
        state.clientDetails.marketingPreferences = action.payload;
      })
      .addCase(marketingPreferences.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(searchClient.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchClient.fulfilled, (state, action) => {
        state.status = 'idle';
        state.searchClientList = action.payload.clients;
      })
      .addCase(searchClient.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(clientOverviewDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(clientOverviewDetails.fulfilled, (state, action) => {
        state.status = 'idle';
        state.clientDetails = { ...state.clientDetails, ...action.payload };
      })
      .addCase(clientOverviewDetails.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchClientVerificationDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClientVerificationDetails.fulfilled, (state, action) => {
        state.status = 'idle';
        state.questionVerification = action.payload;
        state.clientDetails.personalInfo.name = action.payload.name;
        state.clientDetails.contactDetails.mobileNumber = action.payload.additional.mobileNumber;
        state.clientDetails.tags = action.payload.tags;
        state.clientDetails.userSince = action.payload.userSince;
      })
      .addCase(fetchClientVerificationDetails.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(addClientNotes.pending, (state) => {
        state.status = 'loading';
        state.clientDetails.addNoteStatus = 'pending';
      })
      .addCase(addClientNotes.fulfilled, (state) => {
        state.status = 'idle';
        state.clientDetails.addNoteStatus = 'success';
      })
      .addCase(addClientNotes.rejected, (state) => {
        state.status = 'failed';
        state.clientDetails.addNoteStatus = 'failed';
      })
      .addCase(clientsNotes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(clientsNotes.fulfilled, (state, action) => {
        state.status = 'idle';
        state.clientDetails.notesHistory = action.payload;
      })
      .addCase(clientsNotes.rejected, (state) => {
        state.status = 'failed';
      });
  }
});

export const {
  setClientList,
  setAlertDetails,
  clearClientStore,
  setClientStatus,
  setSelectedClient,
  setClientOverview
} = clientSlice.actions;

export const clientReducer = clientSlice.reducer;
