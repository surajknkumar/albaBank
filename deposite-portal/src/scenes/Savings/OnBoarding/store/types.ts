export interface DepositDetailsState {
  depositProduct: string;
  agreementConfirmation: boolean;
  intendedDepositAmount: string;
  applicantsUKResidenceConfirmation: string;
  privacyNotice: boolean;
  fairProcessingNotice: boolean;
  recaptchaResponse: string;
  success: boolean;
}

export interface AddressState {
  type: any;
  addressLine1: string;
  addressLine2: string;
  town: string;
  county: string;
  postCode: string;
  postTown: string;
  residenceYears: number;
  residenceMonths: number;
  summaryLine: string;
}

export interface PersonalDetailsState {
  flowState: 'initial_post' | 'authenticate';
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  nationality: string;
  employmentStatus: string;
  addresses: Array<AddressState> | [];
  phoneNumber: string;
  email: string;
  confirmEmail: string;
  securityQuestion1: string;
  securityAnswer1: string;
  securityQuestion2: string;
  securityAnswer2: string;
  success: boolean;
}

export interface AccountDetailsState {
  accountHolderOfNominatedAccount?: any;
  sortCode: string;
  accountNumber: string;
  success: boolean;
}

export interface ConsentDetailsState {
  contactByPhone: boolean;
  contactByEmail: boolean;
  contactByPost: boolean;
  productConfirmation: boolean;
  tncConfirmation: boolean;
  fscsConfirmation: boolean;
  saveDetailsConfirmation: boolean;
  success: boolean;
  consentDetailsResponse: {
    clientAccountNumber: string;
    state: string;
    payeeDetails?: any;
    verificationUrl?: string;
    acceptableDocumentUrl?: string;
    aer: string;
    documentUploadType: 'POI' | 'POI_POA';
  };
}

export interface Session {
  sessionId: string;
}

export interface alertProps {
  variants: 'outlined' | 'standard' | 'filled';
  severitys: 'error' | 'warning' | 'info' | 'success';
  message: string;
  isAlertShow: boolean;
}

export interface DepositProducts {
  displayName: string;
  productKey: string;
}

export interface Nationality {
  key: string;
  value: string;
}

export interface ClientDetailsResponse {
  emailId: string;
  phoneNumber: string;
  currentPostCode: string;
  currentAddress: string;
}

export interface depositDocumentState {
  productSummaryUrl: string;
  tncPdfUrl: string;
  fscsPdfUrl: string;
}

export interface AuthenticationQuestion {
  securityQuestionDisplay: string;
  securityQuestionKey: string;
}

export interface PersonalDetailsResponse {
  authenticationQuestions: AuthenticationQuestion[];
  canBeDuplicateCustomer: boolean;
  accountNumber: string;
  sortCode: string;
  clientDetails: ClientDetailsResponse;
}

export interface Error {
  code: number;
  message: string;
}

export interface OnBoardingState {
  activeStep: number;
  status: 'idle' | 'loading' | 'failed';
  error: Error | undefined;
  depositProducts: DepositProducts[];
  depositDetails: DepositDetailsState;
  personalDetails: PersonalDetailsState;
  accountDetails: AccountDetailsState;
  depositDocument: depositDocumentState;
  validateIdentityResponse: {
    clientDetails: ClientDetailsResponse | null;
    success: boolean;
  };
  consentDetails: ConsentDetailsState;
  session: Session;
  addressFormDetails: any[];
  nationalities: Nationality[];
  user: {
    authenticationQuestions: AuthenticationQuestion[] | null;
    canBeDuplicateCustomer: any;
  };
  alertDetails: alertProps;
}
