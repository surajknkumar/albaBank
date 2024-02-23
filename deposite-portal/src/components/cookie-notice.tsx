import React, { useEffect, useState } from 'react';
import { Box, Button, Link, Typography } from '@mui/material';
import ReactGA from 'react-ga4';
import { getCookiesInfo } from './helpers/common';
export const CookieNotice: React.FC = () => {
  const TRACKING_ID = 'G-MHRQ1GEJGK';
  const [showNotice, setShowNotice] = useState(false);
  useEffect(() => {
    if (getCookiesInfo('cookieNotice') === 'accepted') ReactGA.initialize(TRACKING_ID);
    if (getCookiesInfo('cookieNotice') !== 'accepted' && getCookiesInfo('cookieNotice') !== 'declined')
      setShowNotice(true);
  }, []);

  const acceptCookie = (accepted: boolean) => {
    document.cookie = `cookieNotice=${accepted ? 'accepted' : 'declined'}`;
    if (accepted) ReactGA.initialize(TRACKING_ID);
    setShowNotice(false);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        bottom: showNotice ? 0 : '-100%',
        zIndex: 1000,
        opacity: 1,
        background: '#fff',
        maxWidth: { md: '460px' },
        boxShadow: '0 0 15px 0 rgba(0,0,0,0.05)',
        transition: 'bottom 1s ease-in-out 0.2s,opacity 0.75s ease-in-out 0.1s,box-shadow 1s ease-in-out 0.2s'
      }}
    >
      <Box sx={{ padding: { xs: '15px', md: '30px' }, letterSpacing: '-0.45px', color: '#221c35' }}>
        <Typography sx={{ fontSize: '18px', lineHeight: '20px' }}>Cookie Notice</Typography>
        <div style={{ marginTop: '5px' }}>
          <Typography sx={{ fontSize: '18px', lineHeight: '25px', fontWeight: 300 }}>
            This website uses cookies to collect analytical data to improve user experience. Continuing to use this
            website gives consent to cookies being used. Please see more information in our{' '}
            <Link
              target="blank"
              sx={{ textDecoration: 'none', color: '#00e2d6', ':hover': { textDecoration: 'underline' } }}
              href="https://albabank.co.uk/privacy-policy/"
              title="Privacy Policy"
            >
              Privacy Policy
            </Link>
            .&nbsp;
          </Typography>
        </div>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Button
            sx={{
              padding: '7px 10px',
              marginTop: '15px',
              fontSize: '16px',
              lineHeight: '24px',
              border: '1px solid #00e2d6 !important',
              background: '#fff',
              letterSpacing: '-0.45px'
            }}
            onClick={() => acceptCookie(false)}
          >
            Reject
          </Button>
          <Button
            sx={{
              padding: '7px 10px',
              marginTop: '15px',
              fontSize: '16px',
              lineHeight: '24px',
              border: '1px solid transparent !important',
              background: '#00e2d6',
              letterSpacing: '-0.45px'
            }}
            onClick={() => acceptCookie(true)}
          >
            Accept Cookies
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
