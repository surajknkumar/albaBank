'use client';

import { ThemeOptions } from '@mui/material';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#221C35',
      light: '#221C35',
      dark: '#221C35'
    },
    background: {
      default: '#F8F8F8'
    },
    text: {
      primary: '#221C35'
    },
    error: {
      main: '#C21B24',
      light: '#D22727',
      contrastText: '#C21B24'
    },
    warning: {
      main: '#FEA800',
      light: '#FFD980AB'
    },
    info: {
      main: '#11379f'
    },
    success: {
      main: '#38B97A',
      light: '#b8ffe1'
    },
    divider: '#BFBFBF'
  },
  typography: {
    fontFamily: 'Work Sans'
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#363636',
          color: '#f3f3f3'
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: () => ({
          fontStyle: 'normal',
          fontWeight: '500 !important',
          fontSize: '18px',
          lineHeight: '24px !important',
          color: '#221c35 !important',
          marginTop: '26px'
        })
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: () => ({
          '.MuiInputAdornment-root>.MuiTypography-root': {
            fontWeight: 300,
            fontSize: '16px',
            lineHeight: '18px',
            color: '#221C35'
          },
          input: {
            padding: 0,
            height: '100%'
          },
          fieldset: {
            border: 'none'
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
    MuiTableHead: {
      styleOverrides: {
        root: () => ({
          '.MuiTableCell-root': {
            fontSize: '16px',
            fontWeight: 500
          },
          '.MuiTypography-root': {
            fontSize: '16px',
            fontWeight: 500
          }
        })
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: () => ({
          borderBottom: ' 1px solid rgba(34, 28, 53, 0.10)'
        })
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: () => ({
          fontSize: '14px',
          lineHeight: '18px',
          fontWeight: 300,
          padding: '8px',
          border: 'none',
          '&:first-of-type': {
            paddingLeft: '45px'
          },
          '&:last-of-type': {
            paddingRight: '45px'
          }
        })
      }
    },
    MuiDialog: {
      styleOverrides: {
        root: () => ({
          '.MuiDialog-paper': {
            maxWidth: 'none'
          }
        })
      }
    },
    MuiList: {
      styleOverrides: {
        root: () => ({
          '&.MuiMenu-list': {
            background: '#f4f4f4'
          }
        })
      }
    },
    MuiButton: {
      styleOverrides: {
        root: () => ({
          fontSize: '18px',
          fontWeight: '500',
          background: '#00E2D6',
          color: '#221C35',
          boxShadow: 'none',
          borderRadius: '4px',
          transition: 'all 0.3s ease-in-out 0s !important',
          '&:hover': {
            boxShadow: 'none',
            background: '#1bc8be'
          },
          '&.Mui-disabled': {
            backgroundColor: 'rgba(0, 226, 214, 0.9)'
          }
        })
      }
    }
  }
};

const theme = createTheme(themeOptions);
export default responsiveFontSizes(theme);
