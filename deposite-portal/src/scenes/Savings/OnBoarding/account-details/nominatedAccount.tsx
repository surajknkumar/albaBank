import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Input,
  Typography
} from '@mui/material';
import React from 'react';
import { Form } from 'react-router-dom';
import { SortCode, CommonNextButton, useForm } from 'src/components';
import { useAppSelector } from 'src/app/hooks';
import { getAccountDetails } from '../store/selectors';
import { Check, CheckBoxOutlineBlank } from '@mui/icons-material';
import ReactGA from 'react-ga4';

type NominatedAccountProps = {
  handleSubmitClick: (isSecurityAnswersCall: boolean, data: any) => void;
  navigateToPreviousPage: () => void;
};

export const NominatedAccount = ({ handleSubmitClick, navigateToPreviousPage }: NominatedAccountProps) => {
  const accountDetails = useAppSelector(getAccountDetails);

  const { handleSubmit, handleChange, data, errors } = useForm({
    validations: {
      accountNumber: {
        required: {
          value: true,
          message: 'This field is required'
        },
        pattern: {
          value: /^[0-9]+$/,
          message: 'Please enter a valid account number'
        },
        custom: {
          isValid: (value: string) => value.length === 8,
          message: 'Please enter a valid account number'
        }
      },
      sortCode: {
        required: {
          value: true,
          message: 'This field is required'
        },
        pattern: {
          value: /^[0-9]+$/,
          message: 'Please enter a valid sort code'
        },
        custom: {
          isValid: (value: string) => value.length === 6,
          message: 'Please enter a valid sort code'
        }
      },
      accountHolderOfNominatedAccount: {
        required: {
          value: true,
          message: 'You need to tick the box above to proceed'
        }
      }
    },
    onSubmit: () => handleSubmitClick(false, data),
    initialValues: {
      sortCode: accountDetails.sortCode,
      accountNumber: accountDetails.accountNumber,
      accountHolderOfNominatedAccount: accountDetails.accountHolderOfNominatedAccount
    }
  });

  return (
    <Box>
      <Box sx={{ paddingTop: 5 }}>
        <ul>
          <li>
            Please nominate an account which you will use to send deposits to Alba. Any withdrawals will also be sent to
            the nominated account, which should be in your name, held with a UK Bank or Building Society, and capable of
            receiving electronic transfers.
          </li>
          <li>
            Using a nominated account protects your money. We won’t send withdrawals anywhere else. Deposits from other
            sources will be returned.
          </li>
        </ul>
      </Box>
      <Box className="nominated-account">
        <Box className="title">Account Details</Box>
        <Form onSubmit={handleSubmit} noValidate>
          <Box sx={{ direction: 'flex', flexDirection: 'column' }}>
            <FormGroup>
              <FormControl fullWidth variant="standard" required className={errors.sortCode ? 'error' : ''}>
                <FormLabel className="label">Sort Code</FormLabel>
                <SortCode
                  value={data.sortCode}
                  valueLength={3}
                  onChange={(sortcode) => handleChange('sortCode', sortcode)}
                />
                {errors.sortCode && <Typography className="msg">{errors.sortCode}</Typography>}{' '}
              </FormControl>
            </FormGroup>
            <Grid container>
              <Grid item xs={12} sm={4}>
                <FormGroup>
                  <FormControl fullWidth variant="standard" required className={errors.accountNumber ? 'error' : ''}>
                    <FormLabel className="label">Account number</FormLabel>
                    <Input
                      value={data.accountNumber}
                      disableUnderline
                      className="input"
                      type="number"
                      name="accountNumber"
                      onChange={(e) => handleChange('accountNumber', e.target.value)}
                      onKeyDown={(evt) => evt.key === 'e' && evt.preventDefault()}
                    />
                    {errors.accountNumber && <p className="msg">{errors.accountNumber}</p>}{' '}
                  </FormControl>
                </FormGroup>
              </Grid>
            </Grid>
            <Box className="checkbox" sx={{ marginTop: '35px' }}>
              <FormGroup>
                <FormControl className={errors.accountHolderOfNominatedAccount ? 'error' : ''}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlineBlank />}
                        checkedIcon={<Check />}
                        checked={data.accountHolderOfNominatedAccount}
                      />
                    }
                    label="I am an account holder of the nominated account above"
                    onChange={() =>
                      handleChange('accountHolderOfNominatedAccount', !data.accountHolderOfNominatedAccount)
                    }
                  />
                  {errors.accountHolderOfNominatedAccount && (
                    <p className="msg">{errors.accountHolderOfNominatedAccount}</p>
                  )}
                </FormControl>
              </FormGroup>
            </Box>
          </Box>
        </Form>
      </Box>
      <CommonNextButton handleSteps={(isSubmit: boolean) => (isSubmit ? handleSubmit() : navigateToPreviousPage())} />
    </Box>
  );
};
