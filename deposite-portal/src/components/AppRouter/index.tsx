import * as React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import {
  DepositDetails,
  PersonalDetails,
  AccountDetails,
  Consent,
  YourApplication,
  ContactUs
} from 'src/scenes/Savings/OnBoarding';
import { Savings } from 'src/scenes/Savings';
import { SessionExpiry, RequireSession } from 'src/components';
import { ValidationFailed } from '../validation-failed';

export const AppRouter: React.FC = () => {
  const router = createBrowserRouter(
    [
      {
        path: '',
        element: <Savings />,
        children: [
          {
            path: 'deposit-details',
            index: true,
            element: <DepositDetails />
          },
          {
            path: 'personal-details',
            element: (
              <RequireSession>
                <PersonalDetails />
              </RequireSession>
            )
          },
          {
            path: 'account-details',
            element: (
              <RequireSession>
                <AccountDetails />
              </RequireSession>
            )
          },
          {
            path: 'consent',
            element: (
              <RequireSession>
                <Consent />
              </RequireSession>
            )
          },
          {
            path: 'contact-us',
            element: <ContactUs />
          },
          {
            path: 'your-application',
            element: <YourApplication />
          },
          {
            path: 'session-expired',
            element: <SessionExpiry />
          },
          {
            path: 'validation-failed',
            element: <ValidationFailed />
          }
        ]
      },
      { path: '*', element: <Navigate to={'/deposit-details'} replace /> }
    ],
    {
      basename: '/savings'
    }
  );
  return <RouterProvider router={router} />;
};
