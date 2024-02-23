import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import ReactGA from 'react-ga4';

export const Declined: React.FC = () => {
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname, title: 'Declined Applications' });
  }, []);
  return (
    <Box style={{ paddingTop: 30 }}>
      <Box className="title">Thank you for applying for an Alba Bank savings account.</Box>
      <ul>
        <li>I am sorry to say we are unable to open an account on this occasion.</li>
      </ul>
    </Box>
  );
};
