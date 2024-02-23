import { ACCOUNT_STATUS, TagType, VerificationType, WITHDRAWAL_ACTION } from '../enum/client.enum';

export interface ClientSearchDetails {
  name: string;
  emailId: string;
  customerId: string;
  mobileNumber: string;
  accountId: string;
}

export interface SearchDisplayItems {
  first: keyof ClientSearchDetails;
  second: keyof ClientSearchDetails;
}

export interface PersonalDetails {
  name: string;
  dob: string;
  customerId: string;
}

export interface ContactDetails {
  mobileNumber: string;
  emailId: string;
  addresses: string[];
}

export interface GeneralDetails {
  createdDate: string;
  lastModifiedDate: string;
  clientState: string;
  activationDate: string;
  approvedDate: string;
}

export interface MarketingPreferences {
  contactByEmail: boolean;
  contactByPhone: boolean;
  contactByPost: boolean;
}

export interface AccountDetails {
  name: string;
  type: string;
  amount: string; //balance
  state: ACCOUNT_STATUS;
  accountId: string;
  actions?: WITHDRAWAL_ACTION[];
  noticeDays: number;
  maturityDate: string;
}

export interface Tag {
  displayValue: string;
  type: TagType;
}

export interface WithdrawalConfig {
  requestDateLeftOffset: number;
  requestDateRightOffset: number;
  withdrawalDateLeftOffset: number;
  withdrawalDateRightOffset: number;
}

export interface ClientDetails {
  accounts: AccountDetails[];
  personalInfo: PersonalDetails;
  contactDetails: ContactDetails;
  marketingPreferences: MarketingPreferences;
  generalDetails: GeneralDetails;
  poaDetails?: any;
  userSince: string;
  tags: Tag[];
  notesHistory: Notes[];
  config?: { withdrawalRequest: WithdrawalConfig };
  addNoteStatus: '' | 'pending' | 'failed' | 'success';
}
interface VerificationHistoryEntity {
  performedAt: string;
  agentName: string;
  status: VerificationType;
}

export interface Notes {
  createdAt: string;
  agentName: string;
  note: string;
}

export interface Question {
  question: string;
  qvId: string;
  answerMasked: string;
  askedCharNumber: 0;
}

export interface ClientState {
  status: string;
  errorMessage?: string | null | undefined;
  searchClientList: ClientSearchDetails[];
  clientDetails: ClientDetails;
  historyVerificationList: VerificationHistoryEntity[];
  questionVerification: {
    questions: Question[];
    cvhId: string;
    additional: {
      dob: string;
      emailId: string;
      mobileNumber: string;
      postcode: string;
    };

    userSince: string;
    tags: Tag[];
  };

  alertDetails: {
    open: boolean;
    severity: 'success' | 'info' | 'warning' | 'error';
    message: string;
  };
}

export interface QuestionVerification {
  qvId: string;
  answer: string;
}

export interface ClientWithdrawalRequest {
  requestDate: string;
  withdrawalDate: string;
  amount: string;
  comment: string;
  withdrawalRequestId?: string;
}
export interface AdditionalVerification {
  dob: string | null;
  emailId: string | null;
  mobileNumber: string | null;
  postcode: string | null;
}
export interface CustomerVerification {
  cvhId: string;
  additional: AdditionalVerification;
  bypass: boolean;
  bypassReason: string;
}

export interface MarketingPreferences {
  contactByEmail: boolean;
  contactByPhone: boolean;
  contactByPost: boolean;
}
