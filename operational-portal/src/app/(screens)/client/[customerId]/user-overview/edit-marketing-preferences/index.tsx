'use client';
import { Box, FormControlLabel, FormGroup, Switch, styled } from '@mui/material';
import React from 'react';
import { AppModal } from '@app/components/pop-up';
import { useAppDispatch } from '@app/store/redux/hooks';
import { marketingPreferences } from '@app/store';

interface EditMarketingPreferencesProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  customerId: {};
}

const LocalSwitch = styled(Switch)(({ theme }) => ({
  width: 50,
  height: 25,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    color: '#F4F4F4',
    '&.Mui-checked': {
      transform: 'translateX(25px)',
      color: '#00E2D6',
      '& + .MuiSwitch-track': {
        backgroundColor: '#CBF1EF',
        opacity: 1,
        border: 0
      }
    }
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#D9D9D9',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500
    })
  }
}));

export function EditMarketingPreferences({ open, setOpen, customerId }: EditMarketingPreferencesProps) {
  const dispatch = useAppDispatch();
  const marketPreferences = {
    contactByEmail: false,
    contactByPhone: false,
    contactByPost: false
  };
  const callBackFunction = () => {
    const res = dispatch(marketingPreferences({ ...customerId, req: marketPreferences }));
  };

  return (
    <AppModal
      isCloseButton={true}
      callBack={() => callBackFunction()}
      ButtonName={'Submit'}
      open={open}
      setOpen={setOpen}
      title={'Edit Marketing Preferences'}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', paddingY: 3 }}>
        <Box
          sx={{
            background: '#E4F4F3',
            fontWeight: 300,
            fontSize: '18px',
            marginX: -1,
            padding: 4
          }}
        >
          Recorded Marketing Preferences
        </Box>
        <Box
          sx={{
            padding: 4
          }}
        >
          <Box sx={{ fontWeight: 500, fontSize: '18px' }}>Edit Marketing Preferences</Box>
          <Box>
            <FormGroup>
              <ul style={{ listStylePosition: 'inside', fontSize: '28px' }}>
                <li>
                  <FormControlLabel
                    style={{ margin: 0 }}
                    labelPlacement="start"
                    sx={{ justifyContent: 'space-between' }}
                    value={marketPreferences.contactByPhone}
                    control={
                      <LocalSwitch
                        onChange={() => (marketPreferences.contactByPhone = !marketPreferences.contactByPhone)}
                      />
                    }
                    label="Contact me by mobile"
                  />
                </li>
                <li>
                  <FormControlLabel
                    style={{ margin: 0 }}
                    labelPlacement="start"
                    value={marketPreferences.contactByPost}
                    control={
                      <LocalSwitch
                        onChange={() => (marketPreferences.contactByPost = !marketPreferences.contactByPost)}
                      />
                    }
                    label="Contact me by post"
                  />
                </li>
                <li>
                  <FormControlLabel
                    style={{ margin: 0 }}
                    labelPlacement="start"
                    value={marketPreferences.contactByEmail}
                    control={
                      <LocalSwitch
                        onChange={() => (marketPreferences.contactByEmail = !marketPreferences.contactByEmail)}
                      />
                    }
                    label="Contact me by email"
                  />
                </li>
              </ul>
            </FormGroup>
          </Box>
        </Box>
      </Box>
    </AppModal>
  );
}
