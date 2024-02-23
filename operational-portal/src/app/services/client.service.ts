import http from './http.service';
import { IResponse } from '../store/types';
import {
  CustomerVerification,
  MarketingPreferences,
  QuestionVerification
} from '@app/models/interfaces/clients.interface';
import { sweetAlertCall } from '@app/utils/helpers';

const getClientList = (searchParam: string, value: string) => {
  return http.get<IResponse<any>>('/client-search' + `?searchParam=${searchParam}&&value=${value}`);
};

// GET {customerId}
const getCustomerOverview = (customerId: string) => {
  return http.get<IResponse<any>>(`/clients/${customerId}/user-overview`);
};

// GET {customer-id}/verification/
const getClientVerificationDetails = (customerId: string) => {
  return http.get<IResponse<any>>(`/clients/${customerId}/verification`);
};

// POST {customer-id}/verification/question
const verifyQuestion = (customerId: string, req: QuestionVerification) => {
  return http.post<IResponse<any>>(`/clients/${customerId}/verification/question`, req);
};

// POST {customer-id}/verification/
const verifyIdentity = (customerId: string, req: CustomerVerification) => {
  return http.post<IResponse<any>>(`/clients/${customerId}/verification`, req);
};

// GET {customer-id}/verification/history
const getVerificationHistory = (customerId: string) => {
  return http.get<IResponse<any>>(`/clients/${customerId}/verification/history`);
};

// POST {customer-id}/marketing-preferences
const updateMarketingPreferences = (customerId: string, req: MarketingPreferences) => {
  return http.post<IResponse<any>>(`/clients/${customerId}/marketing-preferences`, req);
};

// GET {customer-id}/notes
const getClientsNotes = (customerId: string) => {
  return http.get<IResponse<any>>(`/clients/${customerId}/notes`);
};

// POST {customer-id}/notes
const addClientNotes = (customerId: string, note: string) => {
  return http.post<IResponse<any>>(`/clients/${customerId}/notes`, { note });
};

const clientService = {
  getClientList,
  getCustomerOverview,
  getClientVerificationDetails,
  verifyQuestion,
  verifyIdentity,
  getVerificationHistory,
  updateMarketingPreferences,
  getClientsNotes,
  addClientNotes
};

export default clientService;
