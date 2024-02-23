'use client';
import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppSelector } from '@app/store/redux/hooks';
import { getLoading } from '@app/store/redux/selectors';

export function Spinner() {
  const isAppLoading = useAppSelector(getLoading);
  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }} open={isAppLoading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
