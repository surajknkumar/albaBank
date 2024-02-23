import './App.css';
import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppLoading, AppRouter, Header, Footer, ScrollButton, AlertComponent, getCookiesInfo } from 'src/components';
import '@fontsource/merriweather';
import '@fontsource/merriweather/700.css';
import '@fontsource/work-sans';
import '@fontsource/work-sans/300.css';
import '@fontsource/work-sans/500.css';
import { Box } from '@mui/material';
import { CookieNotice } from './components/cookie-notice';

const App: React.FC = () => {
  return (
    <ThemeProvider
      theme={createTheme({
        typography: {
          fontFamily: 'Work Sans'
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: () => ({
                backgroundColor: '#00E2D6',
                textTransform: 'none',
                color: '#221c35',
                border: '0 !important',
                borderRadius: 0,
                transition: 'all 0.3s ease-in-out 0s !important',
                '&:hover': {
                  backgroundColor: '#1bc8be'
                }
              })
            }
          },
          MuiCheckbox: {
            styleOverrides: {
              root: () => ({
                color: '#00e2d6 !important',
                '&.Mui-checked': {
                  svg: {
                    background: '#00e2d6',
                    color: 'black'
                  }
                },
                svg: {
                  width: '20px',
                  height: '20px',
                  color: '#F4F4F4',
                  background: '#F4F4F4'
                }
              })
            }
          },
          MuiInputBase: {
            styleOverrides: {
              root: () => ({
                height: '40px',
                background: '#f4f4f4',
                borderRadius: '0 !important',
                padding: '8px 5px 8px 12px',
                fontWeight: 300,
                fontSize: '14px',
                lineHeight: '24px',
                color: '#221C35',
                outline: 'none',
                '&.Mui-focused': {
                  border: '1px solid #00e2d6',
                  backgroundColor: '#fff',
                  '.MuiSelect-select': {
                    backgroundColor: 'transparent'
                  }
                },
                '.MuiInputAdornment-root>.MuiTypography-root': {
                  fontWeight: 300,
                  fontSize: '14px',
                  lineHeight: '24px',
                  color: '#221C35'
                },
                input: {
                  padding: 0,
                  height: '100%'
                },
                'svg[data-testid="KeyboardArrowDownIcon"]': {
                  marginRight: '16px'
                }
              })
            }
          },
          MuiRadio: {
            styleOverrides: {
              root: () => ({
                color: '#00e2d6 !important',
                '&>span:nth-of-type(1)': {
                  width: '22px',
                  height: '22px',
                  margin: '1px',
                  background: '#f1f1f1',
                  color: '#f1f1f1',
                  borderRadius: '50%'
                },
                svg: {
                  width: '24px',
                  height: '24px'
                },
                '&.Mui-checked': {
                  '&>span:nth-of-type(1)': {
                    width: '24px',
                    height: '24px',
                    margin: 0,
                    background: '#fff'
                  },
                  'svg[data-testid="RadioButtonUncheckedIcon"]': {
                    fill: '#00e2d6'
                  },
                  'svg[data-testid="RadioButtonCheckedIcon"]': {
                    fill: '#221C35'
                  }
                }
              })
            }
          },
          MuiFormControlLabel: {
            styleOverrides: {
              root: () => ({
                marginLeft: 0
              })
            }
          },
          MuiMenuItem: {
            styleOverrides: {
              root: () => ({
                minHeight: '40px !important',
                '&:hover': {
                  background: '#00E2D6 !important'
                }
              })
            }
          },
          MuiFormControl: {
            styleOverrides: {
              root: () => ({
                label: {
                  marginRight: 0
                }
              })
            }
          },
          MuiStepper: {
            styleOverrides: {
              root: ({ theme }) => ({
                '&.MuiStepper-horizontal': {
                  margin: '0 -10%'
                },
                [theme.breakpoints.down('md')]: {
                  '&.MuiStepper-horizontal': {
                    margin: '0 -8%',
                    '.MuiStepLabel-labelContainer': {
                      display: 'none'
                    }
                  }
                }
              })
            }
          }
        }
      })}
    >
      <AlertComponent />
      <Header />
      <Box sx={{ paddingTop: { xs: '54px', md: '90px' } }}>
        <AppRouter />
      </Box>
      <Footer />
      <AppLoading />
      <ScrollButton />
      <CookieNotice />
    </ThemeProvider>
  );
};

export default App;
