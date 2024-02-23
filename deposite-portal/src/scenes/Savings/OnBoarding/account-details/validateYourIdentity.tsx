import { Box, Button, Dialog, FormControl, FormGroup, FormLabel, Grid, Input, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import { CommonNextButton, useForm } from 'src/components';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { securityQuestionsList } from 'src/resources/form/data/staticList';
import { getError, getPersonalDetails } from '../store/selectors';
import { ImageData } from 'src/resources/images';
import { clearStore } from '../store';
import ReactGA from 'react-ga4';

type ValidateYourIdentityProps = {
  userInfo: any;
  handleSubmitClick: (isSecurityAnswersCall: boolean, data: any) => void;
  navigateToPreviousPage: () => void;
};
export const ValidateYourIdentity = ({
  userInfo,
  handleSubmitClick,
  navigateToPreviousPage
}: ValidateYourIdentityProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [wrongAttempt, setWrongAttempt] = useState(userInfo.previousAttempts);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const personalDetails = useAppSelector(getPersonalDetails);
  const error = useAppSelector(getError);

  const { handleSubmit, handleChange, data, errors } = useForm({
    validations: {
      securityAnswer1: {
        required: {
          value: true,
          message: 'This field is required'
        },
        pattern: {
          value: /^[A-Za-z0-9\s-']*$/,
          message: 'Field can only contain alphanumeric, hyphens(-), apostrophes (’) and spaces'
        }
      },
      securityAnswer2: {
        required: {
          value: true,
          message: 'This field is required'
        },
        pattern: {
          value: /^[A-Za-z0-9\s-']*$/,
          message: 'Field can only contain alphanumeric, hyphens(-), apostrophes (’) and spaces'
        }
      },
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
      }
    },
    onSubmit: () => handleSubmitClick(true, data),
    initialValues: {
      securityAnswer1: '',
      securityAnswer2: '',
      accountNumber: ''
    }
  });

  const [securityQuestionsArray, setSecurityQuestionsArray] = useState<any>([]);

  useEffect(() => {
    let tmpArrayList: any = [];
    userInfo.authenticationQuestions.forEach((info: any) => {
      securityQuestionsList.forEach((securityQuestion) => {
        if (info.key === securityQuestion.key) {
          tmpArrayList.push(securityQuestion.name);
        }
      });
    });
    setSecurityQuestionsArray([...tmpArrayList]);
  }, [securityQuestionsArray, userInfo]);

  useEffect(() => {
    ReactGA.send({
      hitType: 'pageview',
      page: window.location.pathname,
      title: 'Step 3a - Returning Customer Validation'
    });
  }, []);

  useEffect(() => {
    if (error) {
      if (error.code === 10003 || error.code === 5001 || error.code === 5002) {
        // wrong answer
        const count = wrongAttempt + 1;
        if (count >= 3) navigate('/validation-failed');
        setWrongAttempt(count);
        setShowErrorMessage(true);
      } else if (error.code === 10041) {
        setOpenDialog(true);
        ReactGA.send({
          hitType: 'pageview',
          page: window.location.pathname,
          title: 'Returning Customer in Refer Status'
        });
      } // 10041 -> Last Application is in refer stage
    }
  }, [error]);

  const goToHome = () => {
    dispatch(clearStore());
    ReactGA.event({
      category: 'Returning Customer in Refer Status',
      action: 'Returning Customer in Refer Status - Back to Home',
      label: 'Returning Customer in Refer Status - Back to Home'
    });
    navigate('/deposit-details');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <p className="title">Hello {personalDetails.firstName}</p>
      <Typography
        sx={{
          fontSize: { xs: '14px', md: '18px' },
          lineHeight: '24px',
          fontWeight: 300,
          marginTop: '13px'
        }}
      >
        Please provide the answers to the questions below so we can check your identity
      </Typography>
      <Box>
        <Form noValidate>
          {showErrorMessage && (
            <Grid container>
              <Grid
                item
                xs={12}
                md={8}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#EB0000',
                  height: '34px',
                  padding: '8px',
                  marginTop: '28px',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '18px',
                  color: '#fff'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <img style={{ marginRight: '8px' }} src={ImageData.infoIcon} alt="info icon" />
                  Sorry, one of your answer appears to be incorrect.
                </Box>
                <Typography sx={{ fontWeight: 500 }}>
                  Attempt {wrongAttempt}/{userInfo.allowedAttempts}
                </Typography>
              </Grid>
            </Grid>
          )}
          {userInfo.authenticationQuestions.map((eachQuestion: any, index: any) => (
            <FormGroup key={index}>
              <FormControl
                fullWidth
                variant="standard"
                required
                className={errors[`securityAnswer${index + 1}`] ? 'error' : ''}
              >
                <FormLabel className="label">{eachQuestion.securityQuestionDisplay}</FormLabel>
                <Grid container>
                  <Grid item xs={12} md={4}>
                    <Input
                      value={data[`securityAnswer${index + 1}`]}
                      fullWidth
                      disableUnderline
                      name={`securityAnswer${index + 1}`}
                      className="input"
                      onChange={(e) => handleChange(`securityAnswer${index + 1}`, e.target.value)}
                    />
                  </Grid>
                </Grid>
                {errors[`securityAnswer${index + 1}`] ? (
                  <p className="msg">{errors[`securityAnswer${index + 1}`]}</p>
                ) : null}
              </FormControl>
            </FormGroup>
          ))}
          <FormGroup>
            <FormControl fullWidth variant="standard" required className={errors[`accountNumber`] && 'error'}>
              <FormLabel className="label">Your nominated bank account number</FormLabel>
              <Grid container>
                <Grid item xs={12} md={4}>
                  <Input
                    value={data.accountNumber}
                    fullWidth
                    disableUnderline
                    name="accountNumber"
                    className="input"
                    onChange={(e) => handleChange('accountNumber', e.target.value)}
                  />
                </Grid>
              </Grid>
              {Object.keys(errors).length !== 0 && errors[`accountNumber`] ? (
                <p className="msg">{errors[`accountNumber`]}</p>
              ) : null}
            </FormControl>
          </FormGroup>
        </Form>
      </Box>
      <CommonNextButton handleSteps={(isSubmit: boolean) => (isSubmit ? handleSubmit() : navigateToPreviousPage())} />
      <Dialog open={openDialog} disableEscapeKeyDown>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '885px',
            padding: '94px 60px 60px'
          }}
        >
          <img src={ImageData.errorIcon} alt="error" />
          <Typography
            sx={{
              fontFamily: 'Merriweather',
              fontWeight: 700,
              fontSize: '28px',
              lineHeight: '34px',
              textAlign: 'center',
              marginTop: '25px',
              marginBottom: '18px',
              color: '#221c35'
            }}
          >
            Application already under process
          </Typography>
          <Typography sx={{ textAlign: 'center', fontSize: '18px', lineHeight: '30px' }}>
            An application from you is already being processed by our bank. Please check the email sent by Alba Bank for
            further instructions. Once your current application has been processed, you will be able to apply for the
            new product.
          </Typography>
          <Button sx={{ width: '332px', height: '35px', marginTop: '33px' }} onClick={goToHome}>
            Back to Home
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};
