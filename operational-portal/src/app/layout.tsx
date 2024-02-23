import './globals.css';
import type { Metadata } from 'next';
import { AppConfig } from '@utils/appConfig';
import ReduxProvider from '@app/store/redux/ReduxProvider';
import { Header, SideNav, Spinner } from '@components';
import styles from './page.module.css';
import { Box, Grid, ThemeProvider } from '@mui/material';
import theme from '@utils/theme';
import CustomSnackbar from './components/customSnackbar';

export const metadata: Metadata = {
  title: AppConfig.title,
  description: AppConfig.description
};
import '@fontsource/work-sans';
import '@fontsource/work-sans/300.css';
import '@fontsource/work-sans/400.css';
import '@fontsource/work-sans/500.css';
import '@fontsource/merriweather';
import '@fontsource/merriweather/400.css';
import '@fontsource/merriweather/700.css';
import React, { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ThemeProvider theme={theme}>
          <ReduxProvider>
            <CustomSnackbar></CustomSnackbar>
            <Grid container className={styles.dashboard}>
              <Grid item xs={4} sm={2.5} sx={{ height: '100%' }} className={styles.sideNav}>
                <SideNav></SideNav>
              </Grid>
              <Grid item xs={8} sm={9.5}>
                <Header />
                <Box sx={{ height: 'calc(100vh - 88px)', overflowY: 'scroll' }}>{children}</Box>
              </Grid>
            </Grid>
            <Spinner />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
