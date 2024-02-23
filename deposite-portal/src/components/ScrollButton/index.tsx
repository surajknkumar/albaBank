import { Box, Button } from '@mui/material';
import React, { useState } from 'react';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

export const ScrollButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  window.addEventListener('scroll', () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  });

  return (
    <Box
      sx={{
        position: { lg: 'fixed' },
        height: '60px',
        right: 1,
        bottom: visible ? 0 : '-60px',
        zIndex: 1,
        cursor: 'pointer',
        transition: 'bottom 0.3s ease-in-out 0s'
      }}
    >
      <Button
        onClick={scrollToTop}
        sx={{
          display: 'block',
          width: { xs: '100%', lg: '60px' },
          minWidth: '60px',
          height: '60px'
        }}
      >
        <ArrowDropUpIcon fontSize="large" />
      </Button>
    </Box>
  );
};
