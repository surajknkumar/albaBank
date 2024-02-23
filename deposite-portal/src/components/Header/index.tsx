import * as React from 'react';
import Box from '@mui/material/Box';
import { ImageData } from 'src/resources/images';

function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = React.useState(null);

  React.useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let maxScroll = 0;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      if (maxScroll - scrollY > 50) window.document.documentElement.classList.remove('scrolled-down');
      else if (scrollY > 50) {
        window.document.documentElement.classList.add('scrolled-down');
        if (scrollY > maxScroll) maxScroll = scrollY;
      }
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener('scroll', updateScrollDirection); // add event listener
    return () => {
      window.removeEventListener('scroll', updateScrollDirection); // clean up
    };
  }, [scrollDirection]);

  return scrollDirection;
}

export function Header() {
  const scrollDirection = useScrollDirection();

  return (
    <Box
      id="header"
      sx={{
        width: '100%',
        height: { xs: '54px', md: '90px' },
        background: '#00E2D6',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        zIndex: 2,
        transition: 'all 0.4s ease-in-out 0s,box-shadow 0.4s ease-in-out 0s'
      }}
    >
      <Box component="img" sx={{ height: { xs: '40px', md: '64px' } }} src={ImageData.albaLogo} alt="alba Logo" />
    </Box>
  );
}
