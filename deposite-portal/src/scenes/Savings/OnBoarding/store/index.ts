import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AccountDetailsState,
  ConsentDetailsState,
  DepositDetailsState,
  Error,
  OnBoardingState,
  PersonalDetailsResponse,
  PersonalDetailsState,
  alertProps,
  depositDocumentState
} from './types';
import {
  callAccountDetails,
  callPersonalDetails,
  initiateSession,
  submitApplication,
  getDepositProducts,
  getNationalityList
} from './API';
import { RootState } from 'src/app/store';
import { AxiosResponse } from 'axios';
import { IResponse } from 'src/app/types';

const initialState: OnBoardingState = {
  activeStep: 0,
  status: 'idle',
  depositProducts: [],
  nationalities: [],
  depositDetails: {
    depositProduct: '',
    agreementConfirmation: false,
    intendedDepositAmount: '',
    applicantsUKResidenceConfirmation: '',
    privacyNotice: false,
    fairProcessingNotice: false,
    recaptchaResponse: '',
    success: false
  },
  personalDetails: {
    flowState: 'initial_post',
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    nationality: '',
    employmentStatus: '',
    phoneNumber: '',
    email: '',
    confirmEmail: '',
    securityQuestion1: '',
    securityAnswer1: '',
    securityQuestion2: '',
    securityAnswer2: '',
    addresses: [],
    success: false
  },
  addressFormDetails: [],
  accountDetails: {
    sortCode: '',
    accountNumber: '',
    success: false,
    accountHolderOfNominatedAccount: false
  },
  depositDocument: {
    productSummaryUrl: '',
    tncPdfUrl: '',
    fscsPdfUrl: ''
  },
  validateIdentityResponse: {
    clientDetails: null,
    success: false
  },
  consentDetails: {
    contactByPhone: false,
    contactByEmail: false,
    contactByPost: false,
    productConfirmation: false,
    tncConfirmation: false,
    fscsConfirmation: false,
    saveDetailsConfirmation: false,
    success: false,
    consentDetailsResponse: {
      state: '',
      payeeDetails: {
        accountNumber: '',
        beneficiaryName: '',
        reference: '',
        sortCode: ''
      },
      clientAccountNumber: '',
      aer: '',
      documentUploadType: 'POI'
    }
  },
  session: {
    sessionId: ''
  },
  user: {
    authenticationQuestions: null,
    canBeDuplicateCustomer: null
  },
  error: undefined,
  alertDetails: {
    variants: 'standard',
    severitys: 'success',
    message: 'Welcome to ALBA Bank',
    isAlertShow: false
  }
};

const responseHandler = (res: AxiosResponse<IResponse<any>>, rejectWithValue?: any) => {
  let resJson = {};
  try {
    resJson = res.data.data;
  } catch (e) {
    return e;
  }
  if (resJson) return resJson;
  else return rejectWithValue({ code: res.data.code, message: res.data.message });
};

export const postDepositDetails = createAsyncThunk(
  'onBoarding/postDepositDetails',
  async (params: DepositDetailsState, { dispatch }) => {
    const res = await initiateSession({
      ...params,
      intendedDepositAmount: params.intendedDepositAmount.replaceAll(',', ''),
      applicantsUKResidenceConfirmation: params.applicantsUKResidenceConfirmation === 'Yes'
    });
    dispatch(updateAlertDetails({ ...initialState.alertDetails, isAlertShow: false }));
    dispatch(saveDepositDetails(params));
    if (res.data.code !== 0) {
      dispatch(
        updateAlertDetails({
          variants: 'filled',
          severitys: 'error',
          message: res.data.message,
          isAlertShow: true
        })
      );
    }
    return responseHandler(res);
  }
);

export const postPersonalDetails = createAsyncThunk<
  PersonalDetailsResponse,
  PersonalDetailsState,
  { rejectValue: Error; state: RootState }
>('onBoarding/postPersonalDetails', async (params, { dispatch, getState, rejectWithValue }) => {
  const state = getState();
  const sessionId = state.onBoarding.session.sessionId;
  dispatch(savePersonalDetails(params));
  dispatch(updateAlertDetails({ ...initialState.alertDetails, isAlertShow: false }));
  const res = await callPersonalDetails(params, sessionId);
  if (res.data.code === 5001 || res.data.code === 5002) {
    dispatch(selectStep(-1));
    window.location.href = '/savings/contact-us';
  } else if (res.data.code !== 0) {
    dispatch(
      updateAlertDetails({
        variants: 'filled',
        severitys: 'error',
        message: res.data.message,
        isAlertShow: true
      })
    );
  }
  return responseHandler(res, rejectWithValue);
});

export const postPersonalDetailsWithSecurityAnswers = createAsyncThunk<
  PersonalDetailsResponse,
  any,
  { rejectValue: Error; state: RootState }
>('onBoarding/postPersonalDetails', async (params: any, { dispatch, getState, rejectWithValue }) => {
  const state = getState();
  const personalDetails = state.onBoarding.personalDetails;
  const sessionId = state.onBoarding.session.sessionId;
  const combinedParams = { ...personalDetails, ...params };
  dispatch(updateAlertDetails({ ...initialState.alertDetails, isAlertShow: false }));
  const res = await callPersonalDetails(combinedParams, sessionId);
  dispatch(saveDepositDocument(res.data.data?.depositDocument));
  return responseHandler(res, rejectWithValue);
});

export const postAccountDetails = createAsyncThunk<any, any, { state: RootState }>(
  'onBoarding/postAccountDetails',
  async (params: any, { dispatch, getState }) => {
    const state = getState();
    const sessionId = state.onBoarding.session.sessionId;
    dispatch(saveAccountDetails(params));
    dispatch(updateAlertDetails({ ...initialState.alertDetails, isAlertShow: false }));
    const res = await callAccountDetails(params, sessionId);
    if (res.data.code !== 0) {
      dispatch(
        updateAlertDetails({
          variants: 'filled',
          severitys: 'error',
          message: res.data.message,
          isAlertShow: true
        })
      );
    }
    dispatch(saveDepositDocument(res.data.data?.depositDocument));
    return responseHandler(res);
  }
);

export const postApplication = createAsyncThunk<any, any, { state: RootState }>(
  'onBoarding/postApplication',
  async (params: ConsentDetailsState, { dispatch, getState }) => {
    const state = getState();
    const sessionId = state.onBoarding.session.sessionId;
    dispatch(updateAlertDetails({ ...initialState.alertDetails, isAlertShow: false }));
    const res = await submitApplication(params, sessionId);
    if (res.data.code === 5000) {
      dispatch(updateError({ code: res.data.code, message: res.data.message }));
    }
    if (res.data.code !== 0 && res.data.code !== 5000) {
      dispatch(
        updateAlertDetails({
          variants: 'filled',
          severitys: 'error',
          message: res.data.message,
          isAlertShow: true
        })
      );
    }
    return responseHandler(res);
  }
);

export const fetchDepositProducts = createAsyncThunk<any, void, { state: RootState }>(
  'onBoarding/fetchDepositProducts',
  async (params, { dispatch }) => {
    dispatch(updateAlertDetails({ ...initialState.alertDetails, isAlertShow: false }));
    const res = await getDepositProducts();
    if (res.data.code !== 0) {
      dispatch(
        updateAlertDetails({
          variants: 'filled',
          severitys: 'error',
          message: res.data.message,
          isAlertShow: true
        })
      );
    }
    return responseHandler(res);
  }
);

export const fetchNationalityList = createAsyncThunk<any, void, { state: RootState }>(
  'onBoarding/fetchNationalityList',
  async (params: any, { dispatch, getState }) => {
    const state = getState();
    dispatch(updateAlertDetails({ ...initialState.alertDetails, isAlertShow: false }));
    const sessionId = state.onBoarding.session.sessionId;
    const res = await getNationalityList(sessionId);
    if (res.data.code !== 0) {
      dispatch(
        updateAlertDetails({
          variants: 'filled',
          severitys: 'error',
          message: res.data.message,
          isAlertShow: true
        })
      );
    }
    return responseHandler(res);
  }
);

export const onBoardingSlice = createSlice({
  name: 'onBoarding',
  initialState,
  reducers: {
    selectStep: (state: OnBoardingState, action: PayloadAction<number>) => {
      state.activeStep = action.payload;
    },
    showLoader: (state: OnBoardingState, action: PayloadAction<boolean>) => {
      state.status = action.payload ? 'loading' : 'idle';
    },
    saveDepositDetails: (state: OnBoardingState, action: PayloadAction<DepositDetailsState>) => {
      state.depositDetails = action.payload;
    },
    updateAlertDetails: (state: OnBoardingState, action: PayloadAction<alertProps>) => {
      state.alertDetails = action.payload;
    },
    updateError: (state: OnBoardingState, action: PayloadAction<Error>) => {
      state.error = action.payload;
    },
    savePersonalDetails: (state: OnBoardingState, action: PayloadAction<PersonalDetailsState>) => {
      state.personalDetails = action.payload;
    },
    saveAddressFormDetails: (state: OnBoardingState, action: PayloadAction<any[]>) => {
      state.addressFormDetails = action.payload;
    },
    saveAccountDetails: (state: OnBoardingState, action: PayloadAction<AccountDetailsState>) => {
      state.accountDetails = action.payload;
      state.accountDetails.success = true;
    },
    saveDepositDocument: (state: OnBoardingState, action: PayloadAction<depositDocumentState>) => {
      state.depositDocument = action.payload;
    },
    clearStore: (state: OnBoardingState) => {
      state.depositDetails = initialState.depositDetails;
      state.depositDocument = initialState.depositDocument;
      state.personalDetails = initialState.personalDetails;
      state.accountDetails = initialState.accountDetails;
      state.consentDetails = initialState.consentDetails;
      state.validateIdentityResponse = initialState.validateIdentityResponse;
      state.session = initialState.session;
      state.addressFormDetails = initialState.addressFormDetails;
    },
    clearError: (state: OnBoardingState) => {
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepositProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDepositProducts.fulfilled, (state, action) => {
        state.status = 'idle';
        state.depositProducts = action.payload;
      })
      .addCase(fetchDepositProducts.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchNationalityList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNationalityList.fulfilled, (state, action) => {
        state.status = 'idle';
        state.nationalities = action.payload.nationalities;
      })
      .addCase(fetchNationalityList.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(postDepositDetails.pending, (state) => {
        state.depositDetails.success = false;
        state.status = 'loading';
      })
      .addCase(postDepositDetails.fulfilled, (state, action) => {
        state.status = 'idle';
        state.session.sessionId = action.payload.sessionId;
        state.depositDetails.success = true;
      })
      .addCase(postDepositDetails.rejected, (state) => {
        state.depositDetails.success = false;
        state.status = 'failed';
      })
      .addCase(postPersonalDetails.pending, (state) => {
        state.validateIdentityResponse.success = false;
        state.status = 'loading';
      })
      .addCase(postPersonalDetails.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = undefined;
        if (state.personalDetails.flowState === 'authenticate') {
          state.validateIdentityResponse.success = true;
          state.validateIdentityResponse.clientDetails = action.payload.clientDetails;
          state.accountDetails = {
            accountNumber: action.payload.accountNumber,
            sortCode: action.payload.sortCode,
            success: false
          };
        } else {
          state.personalDetails.success = true;
          state.user = action.payload;
          if (action.payload.canBeDuplicateCustomer) {
            state.personalDetails.flowState = 'authenticate';
          } else state.validateIdentityResponse.success = false;
          /* resetting success flag to false in case user goes back to previous screen and 
             enters fresh client details that comes as non-duplicate. This is needed as this flag is
             being used on summary page to show address */
        }
      })
      .addCase(postPersonalDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.validateIdentityResponse.success = false;
        state.error = action.payload;
      })
      .addCase(postAccountDetails.pending, (state) => {
        state.accountDetails.success = false;
        state.status = 'loading';
      })
      .addCase(postAccountDetails.fulfilled, (state, action) => {
        state.status = 'idle';
        state.accountDetails.success = true;
      })
      .addCase(postAccountDetails.rejected, (state) => {
        state.accountDetails.success = false;
        state.status = 'failed';
      })
      .addCase(postApplication.pending, (state) => {
        state.consentDetails.success = false;
        state.status = 'loading';
      })
      .addCase(postApplication.fulfilled, (state, action) => {
        state.status = 'idle';
        state.consentDetails.consentDetailsResponse = action.payload;
        state.consentDetails.success = true;
      })
      .addCase(postApplication.rejected, (state) => {
        state.consentDetails.success = false;
        state.status = 'failed';
      });
  }
});

export const {
  selectStep,
  showLoader,
  savePersonalDetails,
  updateAlertDetails,
  updateError,
  saveDepositDetails,
  saveAccountDetails,
  saveDepositDocument,
  saveAddressFormDetails,
  clearStore,
  clearError
} = onBoardingSlice.actions;

export default onBoardingSlice.reducer;
