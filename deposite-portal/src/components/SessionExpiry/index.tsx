import { Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useAppDispatch } from 'src/app/hooks';
import { clearStore, selectStep } from 'src/scenes/Savings/OnBoarding/store';
import { ImageData } from 'src/resources/images';
import ReactGA from 'react-ga4';
import { useNavigate } from 'react-router-dom';

export const SessionExpiry: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(clearStore());
    dispatch(selectStep(-1));
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname, title: 'Session Expired' });
  }, []);

  const clickHare = () => {
    ReactGA.event({
      category: 'Session Expired',
      action: 'Session Expired - Click Here',
      label: 'Session Expired - Click Here'
    });
    navigate('/savings/');
  };
  return (
    <Box id="session-expiry">
      <Typography className="title">Your Session Has Expired</Typography>
      <img src={ImageData.timerIcon} alt="timer icon" />
      <Typography className="description">
        We've noticed you haven't updated your details for the last 10 minutes, so to make sure your information is
        safe, we've closed this application. To start a new application, please{' '}
        <a href="javascript:void(0)" onClick={clickHare}>
          click here
        </a>
        .
      </Typography>
    </Box>
  );
};
