import React, { useState } from 'react';
import { Provider } from 'react-redux';
import App from './App';
import AzureAD, { AuthenticationState } from 'react-aad-msal';
import { authProvider } from './authProvider';
import { store } from './app/store';
import { Box } from '@mui/material';
import { ImageData } from './resources/images';

export const ReactAAD: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <>
      {window.location.hostname === 'localhost' ? (
        <Provider store={store}>
          <App />
        </Provider>
      ) : (
        <>
          {!authenticated && (
            <Box
              sx={{
                width: '100%',
                height: '100vh',
                background: '#00e2d6',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Box
                component="img"
                sx={{
                  height: { xs: '40px', md: '150px' },
                  margin: '200px 0 80px'
                }}
                src={ImageData.albaLogo}
                alt="alba Logo"
              ></Box>
              <Box className="flip-square"></Box>
            </Box>
          )}
          <AzureAD provider={authProvider} forceLogin={true}>
            {({ login, logout, authenticationState, error, accountInfo }: any) => {
              if (authenticationState === AuthenticationState.Authenticated) {
                setAuthenticated(true);
                return (
                  <Provider store={store}>
                    <App />
                  </Provider>
                );
              }
            }}
          </AzureAD>
        </>
      )}
    </>
  );
};
