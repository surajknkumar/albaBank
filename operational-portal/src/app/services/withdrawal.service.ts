import http from './http.service';
import { IResponse } from '@app/store';
import { TASK_STATUS } from '@app/models/enum/client.enum';
import { ClientWithdrawalRequest } from '@app/models/interfaces/clients.interface';

const postWithdrawalRequest = (accountId: string, req: ClientWithdrawalRequest) => {
  return http.post<IResponse<any>>(`/deposit-account/${accountId}/withdrawal-request`, req);
};

const getWithdrawalRequest = (accountId: string) => {
  return http.get<IResponse<any>>(`/deposit-account/${accountId}/withdrawal-request`);
};

const putWithdrawalRequest = (accountId: string, req: ClientWithdrawalRequest) => {
  return http.put<IResponse<any>>(`/deposit-account/${accountId}/withdrawal-request`, req);
};

const getWithdrawalRequestTaskList = (status: TASK_STATUS) => {
  return getTask('withdrawal_request', status);
};

const getTask = (type: any, status: TASK_STATUS) => {
  return http.get<IResponse<any>>(`/tasks?taskType=${type}&status=${status}`);
};

const getTaskStatus = (taskId: string) => {
  return http.get<IResponse<any>>(`/tasks/${taskId}/status`);
};

const approveWithdrawalRequest = (taskId: string) => {
  return http.put<IResponse<any>>(`/tasks/${taskId}/approve`);
};

const getWithdrawalBalance = (accountId: string) => {
  return http.get<IResponse<any>>(`/deposit-account/${accountId}/balance`);
};

const withdrawalService = {
  postWithdrawalRequest,
  getWithdrawalRequest,
  putWithdrawalRequest,
  getWithdrawalRequestTaskList,
  getTaskStatus,
  approveWithdrawalRequest,
  getWithdrawalBalance
};

export default withdrawalService;
