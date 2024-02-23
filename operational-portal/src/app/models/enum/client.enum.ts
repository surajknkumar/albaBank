export enum VerificationType {
  'PENDING' = 'pending',
  'VERIFIED' = 'verified',
  'BYPASSED' = 'bypassed',
  'PARTIAL' = 'partial',
  'FAILED' = 'failed'
}
export enum TagType {
  'DECEASED' = 'deceased',
  'DORMANCY' = 'dormancy',
  'FRAUD' = 'fraud',
  'VULNERABILITY' = 'vulnerability'
}

export enum WITHDRAWAL_ACTION {
  VIEW = 'view_withdrawal_request',
  CREATE = 'create_withdrawal_request'
}

export enum ACCOUNT_STATUS {
  REFERRED = 'Referred',
  APPROVED = 'Approved',
  ACTIVE = 'Active',
  CLOSED = 'Closed',
  MATURED = 'Matured',
  DORMANT = 'Dormant',
  LOCKED = 'Locked',
  CLOSED_WITHDRAWN = 'Closed_Withdrawn'
}
export enum TASK_STATUS {
  APPROVED = 'approved',
  PENDING = 'pending'
}

export enum BALANCE_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  LOADED = 'loaded',
  FAILED = 'failed'
}
export enum APPROVAL_STATUS {
  PENDING = 'Pending',
  SUCCESS = 'Success',
  FAILED = 'Failed',
  APPROVED = 'Approved',
  QUEUE = 'In Queue'
}

export enum QuestionVerification {
  'FAILED' = 'failed',
  'VERIFIED' = 'verified',
  'PENDING' = 'pending'
}
