//my-app/src/authProvider.js
import { MsalAuthProvider, LoginType } from 'react-aad-msal';

// Msal Configurations
const config = {
  auth: {
    authority: 'https://login.microsoftonline.com/3f4c0ed8-c953-4057-ae61-ff13c51e1cc6',
    clientId: import.meta.env.VITE_AZURE_APPLICATION_ID,
    redirectUri: window.location.origin + '/savings/'
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false
  }
};

// Authentication Parameters
const authenticationParameters = {
  scopes: ['user.read']
};

// Options
const options = {
  loginType: LoginType.Redirect,
  tokenRefreshUri: window.location.origin + '/auth.html'
};

export const authProvider = new MsalAuthProvider(config, authenticationParameters, options);
