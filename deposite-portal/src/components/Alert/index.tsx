import * as React from 'react';
import { Alert, Box, Grow, Stack } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { getAlertDetails } from 'src/scenes/Savings/OnBoarding/store/selectors';
import { clearError } from 'src/scenes/Savings/OnBoarding/store';

export const AlertComponent = () => {
  const alertDetails = useAppSelector(getAlertDetails);
  const dispatch = useAppDispatch();
  const [timeOut, setTimeOut] = React.useState(alertDetails.isAlertShow);

  React.useEffect(() => {
    setTimeOut(alertDetails.isAlertShow);
  }, [alertDetails]);

  setTimeout(() => {
    setTimeOut(false);
    dispatch(clearError());
  }, 5000);

  return timeOut ? (
    <Grow style={{ transformOrigin: '0 0 0' }} {...(true ? { timeout: 1000 } : {})} in={true}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          right: 0,
          zIndex: 100
        }}
      >
        <Stack sx={{ width: '100%', padding: 1 }} spacing={1}>
          <Alert
            variant={alertDetails.variants}
            severity={alertDetails.severitys}
            color={alertDetails.severitys}
            onClose={() => setTimeOut(false)}
          >
            {alertDetails.message}
          </Alert>
        </Stack>
      </Box>
    </Grow>
  ) : null;
};
