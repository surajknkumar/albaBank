import { Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useAppDispatch } from 'src/app/hooks';
import { clearStore, selectStep } from 'src/scenes/Savings/OnBoarding/store';
import { ImageData } from 'src/resources/images';
import ReactGA from 'react-ga4';
import { ALBA_CONSTANTS } from 'src/resources/constants';

export const ValidationFailed: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(clearStore());
    dispatch(selectStep(-1));
    ReactGA.send({
      hitType: 'pageview',
      page: window.location.pathname,
      title: 'Returning Customer Validation Failed'
    });
  }, []);
  return (
    <Box id="session-expiry">
      <Typography className="title">Validation failed</Typography>
      <img src={ImageData.timerIcon} alt="timer icon" />
      <Typography className="description">
        You have exceeded the maximum limit for validating your account.
        <br />
        <br />
        Please contact us by email at{' '}
        <a href={'mailto:' + ALBA_CONSTANTS.SAVINGS_MAIL_ID}>{ALBA_CONSTANTS.SAVINGS_MAIL_ID}</a>. You can also call us
        on <a href={'tel:' + ALBA_CONSTANTS.CUSTOMER_CARE_NUMBER}>{ALBA_CONSTANTS.CUSTOMER_CARE_NUMBER}</a>. We're open
        Monday to Friday, 9am to 5pm, excluding bank holidays.
      </Typography>
    </Box>
  );
};
