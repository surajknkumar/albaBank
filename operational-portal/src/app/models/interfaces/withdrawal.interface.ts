import { APPROVAL_STATUS, BALANCE_STATUS, TASK_STATUS } from '../enum/client.enum';

export interface WithdrawalState {
  withdrawalRequestList: WithdrawalRequestTask[];
  sortBy?: keyof WithdrawalRequestTaskData;
  ascending?: boolean;
  withdrawalDetails: WithdrawalDetail[];
  showLoader: boolean;
  status: 'loading' | 'idle' | 'failed';
  saveRequestStatus: '' | 'pending' | 'success' | 'failed';
  errorMessage?: string | null | undefined;
}

export interface WithdrawalRequestTask {
  taskType: string;
  taskData: WithdrawalRequestTaskData;
  refreshLoading?: boolean;
}

export interface WithdrawalRequestTaskData {
  taskId: string;
  customerName: string;
  customerId: string;
  withdrawalDate: string;
  balance: string;
  balanceLastUpdatedOn: string;
  withdrawalAmount: string;
  maker: string;
  accountId: string;
  accountName: string;
  comment: string;
  balanceStatus: BALANCE_STATUS;
  taskActionStatus: string;
  withdrawalStatus: APPROVAL_STATUS;
}

export interface WithdrawalDetail {
  requestDate: string;
  withdrawalDate: string;
  comment: string;
  amount: string;
  withdrawalRequestId?: string;
  edit?: boolean;
  status?: TASK_STATUS;
  error?: {
    requestDate?: string;
    withdrawalDate?: string;
    comment?: string;
    amount?: string;
  };
}
