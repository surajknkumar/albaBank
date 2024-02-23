export interface IAuthDetails {
  user_name: string;
  session_expires_on: string;
  user_id: string;
}
export interface IAuthState {
  username: string;
  expiresOn: string;
  userId: string;
  isAccountRefreshed: boolean;
}
