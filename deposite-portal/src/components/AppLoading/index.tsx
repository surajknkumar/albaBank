import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppSelector } from 'src/app/hooks';
import { appLoading } from 'src/app/selectors';

export const AppLoading = () => {
  const isAppLoading = useAppSelector(appLoading);
  return (
    <div>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isAppLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};
