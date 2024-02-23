import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { getPersonalDetails } from './store/selectors';
import { ImageData } from 'src/resources/images';
import { clearStore, selectStep } from './store';
import { ALBA_CONSTANTS } from 'src/resources/constants';

export const ContactUs: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(clearStore());
    dispatch(selectStep(-1));
  }, []);
  const personalDetails = useAppSelector(getPersonalDetails);
  return (
    <Box id="session-expiry">
      <Typography className="title">Please contact us to confirm your identity</Typography>
      <img src={ImageData.contactUsIcon} alt="timer icon" />
      <Typography className="description">
        To confirm your identity and proceed with your application, please call us on{' '}
        <a href={'tel:' + ALBA_CONSTANTS.CUSTOMER_CARE_NUMBER}>{ALBA_CONSTANTS.CUSTOMER_CARE_NUMBER}</a>, or send an
        email to <a href={'mailto:' + ALBA_CONSTANTS.SAVINGS_MAIL_ID}>{ALBA_CONSTANTS.SAVINGS_MAIL_ID}</a>
      </Typography>
    </Box>
  );
};
