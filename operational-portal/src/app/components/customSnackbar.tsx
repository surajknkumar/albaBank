'use client';
import React, { Fragment, useEffect, useState } from 'react';
import { Snackbar, IconButton, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector } from '../store/redux/hooks';
import { getAlertDetails } from '../store/redux/selectors';

export default function CustomSnackbar() {
  const [open, setOpen] = useState(false);
  const alertDetail = useAppSelector(getAlertDetails);
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };
  useEffect(() => {
    setOpen(alertDetail.open);
    setTimeout(() => {
      setOpen(false);
    }, 6000);
  }, [alertDetail]);
  const action = (
    <Fragment>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  );
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      action={action}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ maxWidth: '50%' }}
    >
      <Alert onClose={handleClose} severity={alertDetail.severity} sx={{ width: '100%' }}>
        {alertDetail.message}
      </Alert>
    </Snackbar>
  );
}
