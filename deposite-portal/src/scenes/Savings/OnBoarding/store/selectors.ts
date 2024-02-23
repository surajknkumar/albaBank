import { RootState } from 'src/app/store';

export const getActiveStep = (state: RootState) => state.onBoarding.activeStep;

export const getDepositProducts = (state: RootState) => state.onBoarding.depositProducts;

export const getNationalities = (state: RootState) => state.onBoarding.nationalities;

export const getAlertDetails = (state: RootState) => state.onBoarding.alertDetails;

export const getDepositSuccess = (state: RootState) =>
  state.onBoarding.depositDetails && state.onBoarding.depositDetails.success
    ? state.onBoarding.depositDetails.success
    : false;

export const getSessionToken = (state: RootState) =>
  state.onBoarding.session.sessionId ? state.onBoarding.session.sessionId : null;

export const getDepositDetails = (state: RootState) => state.onBoarding.depositDetails;

export const getPersonalDetails = (state: RootState) => {
  return state.onBoarding.personalDetails;
};

export const getAccountDetails = (state: RootState) => state.onBoarding.accountDetails;

export const getDepositDocument = (state: RootState) => state.onBoarding.depositDocument;

export const getConsentDetails = (state: RootState) => {
  return state.onBoarding.consentDetails;
};
export const getConsentDetailsResponse = (state: RootState) => {
  return state.onBoarding.consentDetails.consentDetailsResponse;
};

export const getError = (state: RootState) => {
  return state.onBoarding.error;
};

export const getPersonalDetailsSuccess = (state: RootState) =>
  state.onBoarding.personalDetails && state.onBoarding.personalDetails.success
    ? state.onBoarding.personalDetails.success
    : false;

export const getValidateIdentityResponse = (state: RootState) => state.onBoarding.validateIdentityResponse;

export const getValidateIdentitySuccess = (state: RootState) => state.onBoarding.validateIdentityResponse.success;

export const getAddressFormDetails = (state: RootState) => {
  return state.onBoarding.addressFormDetails;
};

export const getUserInfo = (state: RootState) => {
  return state.onBoarding.user;
};

export const getAccountDetailsSuccess = (state: RootState) =>
  state.onBoarding.accountDetails && state.onBoarding.accountDetails.success
    ? state.onBoarding.accountDetails.success
    : false;

export const getConsentDetailsSuccess = (state: RootState) =>
  state.onBoarding.consentDetails && state.onBoarding.consentDetails.success
    ? state.onBoarding.consentDetails.success
    : false;
