'use client';
import { Provider } from 'react-redux';
import { store, persistor } from '@app/store/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import React, { ReactNode, useEffect, useState } from 'react';
import permissionsService from '@app/services/permission.service';
import { Box } from '@mui/material';
import { LOGO } from '@svgs';
import Image from 'next/image';

export default function ReduxProvider({ children }: { children: ReactNode }) {
  const [isPermissionMapping, setIsPermissionMapping] = useState(false);
  useEffect(() => {
    permissionsService.getPermissions().then((response) => {
      if (response.code === 0) {
        localStorage.setItem('permission', JSON.stringify(response.data));
        setIsPermissionMapping(true);
      }
    });
  });
  return isPermissionMapping ? (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  ) : (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        justifyContent: 'center',
        background: '#00e2d6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Image height={200} width={200} src={LOGO} alt="SUN WITH FACE" priority />
      <Box className="flip-square"></Box>
    </Box>
  );
}
