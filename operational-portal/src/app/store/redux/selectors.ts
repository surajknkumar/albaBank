import { RootState } from './store';

export const getLoading = (state: RootState) =>
  state.client.status === 'loading' || state.withdrawal.status === 'loading' || !state.auth.isAccountRefreshed;
export const getClientList = (state: RootState) => state.client.searchClientList;
export const getClientDetails = (state: RootState) => state.client.clientDetails;
export const getQuestionVerification = (state: RootState) => state.client.questionVerification;
export const getAddNoteStatus = (state: RootState) => state.client.clientDetails.addNoteStatus;
export const getUserName = (state: RootState) => state.auth.username;
export const getHistoryList = (state: RootState) => state.client.historyVerificationList;
export const getAlertDetails = (state: RootState) => state.client.alertDetails;
export const getWithdrawalRequestList = (state: RootState) => state.withdrawal.withdrawalRequestList;
export const getCurrentSortBy = (state: RootState) => state.withdrawal.sortBy;
export const getIsCurrentSortAscending = (state: RootState) => state.withdrawal.ascending;
export const getWithdrawalDetails = (state: RootState) => state.withdrawal.withdrawalDetails;
export const getSaveWithdrawalRequestStatus = (state: RootState) => state.withdrawal.saveRequestStatus;
export const getPermissionsMapping = (state: RootState) => state.permissions.permissionsDetails;
export const getWithdrawalErrorMessage = (state: RootState) => state.withdrawal.errorMessage;
export const getAccountRefreshedStatus = (state: RootState) => state.auth.isAccountRefreshed;
export const getWithdrawalConfig = (state: RootState) => state.client.clientDetails.config?.withdrawalRequest;
