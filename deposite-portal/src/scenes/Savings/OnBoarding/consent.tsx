import React, { useEffect, useState } from 'react';
import { CommonNextButton, useForm, formatDate } from 'src/components';
import Swal from 'sweetalert2';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { useNavigate } from 'react-router-dom';
import { postApplication, selectStep } from '../OnBoarding/store';
import { Box, Checkbox, FormControl, FormControlLabel, Grid, Link, Typography } from '@mui/material';
import {
  getAccountDetails,
  getConsentDetails,
  getConsentDetailsSuccess,
  getDepositDetails,
  getDepositDocument,
  getDepositProducts,
  getError,
  getPersonalDetails,
  getValidateIdentityResponse
} from './store/selectors';
import { ImageData } from 'src/resources/images';
import { Check, CheckBoxOutlineBlank } from '@mui/icons-material';
import ReactGA from 'react-ga4';

export const Consent: React.FC = () => {
  const depositProducts = useAppSelector(getDepositProducts);
  const depositDetails = useAppSelector(getDepositDetails);
  const personalDetails = useAppSelector(getPersonalDetails);
  const accountDetails = useAppSelector(getAccountDetails);
  const validateIdentityResponse = useAppSelector(getValidateIdentityResponse);
  const consentDetails = useAppSelector(getConsentDetails);
  const consentSuccess = useAppSelector(getConsentDetailsSuccess);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const finalStatus = useAppSelector(getError);
  const [errorCount, setErrorCount] = useState(0);
  const depositDocument = useAppSelector(getDepositDocument);
  const [pdfClicked, setPdfClicked] = useState({ product: false, tnc: false, fscs: false });
  useEffect(() => {
    dispatch(selectStep(3));
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname, title: 'Summary' });
  }, []);

  useEffect(() => {
    if (consentSuccess) navigate('/your-application');
  }, [consentSuccess]);

  const openPdf = (pdfType: string) => {
    setPdfClicked({ ...pdfClicked, [pdfType]: true });
    window.open(
      {
        product: depositDocument.productSummaryUrl,
        tnc: depositDocument.tncPdfUrl,
        fscs: depositDocument.fscsPdfUrl
      }[pdfType] as string,
      '_blank'
    );
  };

  const { handleSubmit, handleChange, data, errors } = useForm({
    validations: {
      productConfirmation: {
        required: {
          value: true,
          message: 'In order to proceed you must certify the statement above is true'
        }
      },
      tncConfirmation: {
        required: {
          value: true,
          message: 'In order to proceed you must certify the statement above is true'
        }
      },
      fscsConfirmation: {
        required: {
          value: true,
          message: 'In order to proceed you must certify the statement above is true'
        }
      },
      saveDetailsConfirmation: {
        required: {
          value: true,
          message: 'In order to proceed you must certify the statement above is true'
        }
      }
    },
    onSubmit: () => handleSubmitClick(),
    initialValues: {
      contactByPhone: consentDetails.contactByPhone,
      contactByEmail: consentDetails.contactByEmail,
      contactByPost: consentDetails.contactByPost,
      productConfirmation: consentDetails.productConfirmation,
      tncConfirmation: consentDetails.tncConfirmation,
      fscsConfirmation: consentDetails.fscsConfirmation,
      saveDetailsConfirmation: consentDetails.saveDetailsConfirmation
    }
  });

  const handleClick = (isNextClick: boolean) => {
    setErrorCount(0);
    if (isNextClick) {
      handleSubmit();
    } else {
      ReactGA.event({
        category: 'Summary',
        action: 'Summary - Previous',
        label: 'Summary - Previous'
      });
      navigate('/account-details');
    }
  };

  const handleSubmitClick = () => {
    setErrorCount(errorCount + 1);
    dispatch(postApplication(data));
    if (validateIdentityResponse.success) {
      ReactGA.event({
        category: 'Returning Customer Summary',
        action: 'Returning Customer Summary - Submit',
        label: 'Returning Customer Summary - Submit'
      });
    } else {
      ReactGA.event({
        category: 'Summary',
        action: 'Summary - Submit',
        label: 'Summary - Submit'
      });
    }
  };
  useEffect(() => {
    if (validateIdentityResponse.success) {
      ReactGA.send({
        hitType: 'pageview',
        page: window.location.pathname,
        title: 'Returning Customer Summary'
      });
    }
  }, [validateIdentityResponse]);
  useEffect(() => {
    if (errorCount > 0) {
      ReactGA.send({
        hitType: 'pageview',
        page: window.location.pathname,
        title: 'Application Processing Error'
      });
      callSwal(
        'Application Processing Error',
        'Sorry, your application could not be processed due to some technical issues. Please try applying again later. We apologize for inconvenience.',
        errorCount === 2 ? 'Back To Home' : 'Retry',
        ImageData.serverErrorIcon
      );
    }
  }, [finalStatus]);

  const callSwal = (title: string, text: string, confirmButtonText: string, icon: string) => {
    Swal.fire({
      title,
      text,
      confirmButtonText,
      iconHtml: `<img src=${icon}>`,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (errorCount === 1) {
          ReactGA.event({
            category: 'Application Processing Error',
            action: 'Application Processing Error - Retry',
            label: 'Application Processing Error - Retry'
          });
          handleSubmitClick();
        } else {
          if (validateIdentityResponse.success) {
            ReactGA.event({
              category: 'Returning Customer Summary',
              action: 'Returning Customer Summary - Previous',
              label: 'Returning Customer Summary - Previous'
            });
          } else {
            ReactGA.event({
              category: 'Summary',
              action: 'Summary Previous',
              label: 'Summary Previous'
            });
          }
          navigate('/deposit-details');
        }
      }
    });
  };
  return (
    <Box id="summary">
      <Box sx={{ margin: { xs: '0 -15px', sm: 0 } }}>
        <Grid container columnSpacing={2.5} rowSpacing={{ xs: 2, sm: 4 }}>
          {validateIdentityResponse.success && (
            <Grid item xs={12}>
              <Box sx={{ background: '#F7D2D1', padding: '22px' }}>
                <Typography sx={{ fontSize: '22px', lineHeight: '22px', fontWeight: 500, marginBottom: '10px' }}>
                  Hi {personalDetails.firstName}
                </Typography>
                <Typography sx={{ fontSize: '18px', lineHeight: '22px' }}>
                  Thank you for confirming your identity. Summarised below are the savings product you applied for,
                  together with the personal details we have on our system. If any are incorrect please{' '}
                  <Link sx={{ color: 'inherit !important' }} href="https://www.albabank.co.uk/contact/" target="_blank">
                    contact us
                  </Link>
                </Typography>
              </Box>
            </Grid>
          )}
          <Grid item xs={12}>
            <Box className="summary-card">
              <Box className="title">Product Details</Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6.5}>
                  <Typography className="field-name">Name</Typography>
                  <Typography className="field-value">
                    {
                      depositProducts.find((product) => product.productKey === depositDetails.depositProduct)
                        ?.displayName
                    }
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={5.5}>
                  <Typography className="field-name">Intended Deposit Amount</Typography>
                  <Typography className="field-value">£ {depositDetails.intendedDepositAmount}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Box className="summary-card">
              <Box className="title">Your Application Details</Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography className="field-name">Name</Typography>
                  <Typography className="field-value">
                    {personalDetails.title + ' ' + personalDetails.firstName + ' ' + personalDetails.lastName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography className="field-name">Date Of Birth</Typography>
                  <Typography className="field-value">{formatDate(personalDetails.dob, 'dd/mm/yyyy')}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Box className="summary-card">
              <Box className="title">Your Address Details</Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography className="field-name">Current Postcode</Typography>
                  <Typography className="field-value">
                    {validateIdentityResponse.success
                      ? validateIdentityResponse.clientDetails?.currentPostCode
                      : personalDetails.addresses[0].postCode}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography className="field-name">Current Address</Typography>
                  <Typography className="field-value">
                    {validateIdentityResponse.success
                      ? validateIdentityResponse.clientDetails?.currentAddress
                      : personalDetails.addresses[0].addressLine1 +
                        ', ' +
                        (personalDetails.addresses[0].addressLine2
                          ? personalDetails.addresses[0].addressLine2 + ', '
                          : '') +
                        personalDetails.addresses[0].town +
                        ', ' +
                        personalDetails.addresses[0].county}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Box className="summary-card">
              <Box className="title">Contact Information</Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography className="field-name">Phone</Typography>
                  <Typography className="field-value">
                    {validateIdentityResponse.success
                      ? validateIdentityResponse.clientDetails?.phoneNumber
                      : personalDetails.phoneNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography className="field-name">Email Address</Typography>
                  <Typography className="field-value" sx={{ wordWrap: 'break-word' }}>
                    {validateIdentityResponse.success
                      ? validateIdentityResponse.clientDetails?.emailId
                      : personalDetails.email}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Box className="summary-card">
              <Box className="title">Nominated Account Information</Box>
              <Typography className="subtitle">The bank details you're funding your account from</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography className="field-name">Sort Code</Typography>
                  <Typography className="field-value">{accountDetails.sortCode}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography className="field-name">Account Number</Typography>
                  <Typography className="field-value">{accountDetails.accountNumber}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Typography className="label">Your Marketing Perference</Typography>
      <Box className="info">
        <img src={ImageData.infoIcon} alt="info icon" />
        Please note – you may withdraw your consent at any time by changing your preferences by contacting our Customer
        Services Team.
      </Box>
      <Typography className="description">
        We would like to be able to send you details of products and services which may be of interest to you. Please
        select your preference using the check boxes below.
      </Typography>
      <Box sx={{ display: 'flex' }} className="marketing-preference">
        <FormControlLabel
          className="checkbox"
          control={
            <Checkbox
              icon={<CheckBoxOutlineBlank />}
              checkedIcon={<Check />}
              checked={data.contactByPost}
              onChange={() => handleChange('contactByPost', !data.contactByPost)}
            />
          }
          label="Contact me by post"
        />
        <FormControlLabel
          className="checkbox"
          control={
            <Checkbox
              icon={<CheckBoxOutlineBlank />}
              checkedIcon={<Check />}
              checked={data.contactByEmail}
              onChange={() => handleChange('contactByEmail', !data.contactByEmail)}
            />
          }
          label="Contact me by email"
        />
        <FormControlLabel
          className="checkbox"
          control={
            <Checkbox
              icon={<CheckBoxOutlineBlank />}
              checkedIcon={<Check />}
              checked={data.contactByPhone}
              onChange={() => handleChange('contactByPhone', !data.contactByPhone)}
            />
          }
          label="Contact me by phone"
        />
      </Box>
      <Box className="divider"></Box>
      <Typography className="label">Terms and Conditions</Typography>
      <Typography className="description">
        These documents contain important information that should be read carefully before completing your application.
        It is important that you download, read and retain copies for your records. Should you have any questions or
        require further information, please contact our Customer Services Team.
      </Typography>
      <Box className="pdf-box" onClick={() => openPdf('product')}>
        <img src={ImageData.pdfIcon} alt="pdf icon" />
        <Typography sx={{ marginLeft: '10px' }}>Product Summary</Typography>
      </Box>
      <Box className="pdf-box" onClick={() => openPdf('tnc')}>
        <img src={ImageData.pdfIcon} alt="pdf icon" />
        <Typography sx={{ marginLeft: '10px' }}>Personal Terms and Conditions</Typography>
      </Box>
      <Box className="checkbox">
        <FormControl className={errors.productConfirmation ? 'error' : ''}>
          <FormControlLabel
            control={
              <Checkbox
                icon={<CheckBoxOutlineBlank />}
                checkedIcon={<Check />}
                checked={data.productConfirmation}
                onChange={() => {
                  !data.productConfirmation && !pdfClicked['product'] && openPdf('product');
                  handleChange('productConfirmation', !data.productConfirmation);
                }}
              />
            }
            label="I confirm that I have downloaded, read and agree to the Product Summary"
          />
          {errors.productConfirmation && <p className="msg">{errors.productConfirmation}</p>}
        </FormControl>
      </Box>
      <Box className="checkbox">
        <FormControl className={errors.tncConfirmation ? 'error' : ''}>
          <FormControlLabel
            control={
              <Checkbox
                icon={<CheckBoxOutlineBlank />}
                checkedIcon={<Check />}
                checked={data.tncConfirmation}
                onChange={() => {
                  !data.tncConfirmation && !pdfClicked['tnc'] && openPdf('tnc');
                  handleChange('tncConfirmation', !data.tncConfirmation);
                }}
              />
            }
            label="I confirm that I have downloaded, read and agree to the Personal Terms and Conditions"
          />
          {errors.tncConfirmation && <p className="msg">{errors.tncConfirmation}</p>}
        </FormControl>
      </Box>
      <Box className="divider"></Box>
      <Typography className="label">Depositor Guarantee Scheme</Typography>
      <Typography className="description">
        Your deposits are protected by the Financial Services Guarantee Scheme (FSCS). It is important that you
        download, read and retain a copy of the FSCS Information Sheet and Exclusions List.
        <Typography className="description">
          Up to £85,000 of your total savings across all accounts you hold with us are protected by the scheme. Balances
          above this amount will only be covered in exceptional circumstances.
        </Typography>
        <Typography className="description">
          You can find out more by visiting the{' '}
          <a href="https://www.fscs.org.uk/" target="_blank">
            FSCS website.
          </a>
        </Typography>
        <Typography className="description">
          You'll find confirmation that we're part of the FSCS by{' '}
          <a href="https://www.fscs.org.uk/check/check-your-money-is-protected/" target="_blank">
            checking the register
          </a>{' '}
          and typing 'Alba Bank'.{' '}
        </Typography>
      </Typography>
      <Box className="pdf-box" onClick={() => openPdf('fscs')}>
        <img src={ImageData.pdfIcon} alt="pdf icon" />
        <Typography sx={{ marginLeft: '10px' }}>FSCS Information Sheet and Exclusions List</Typography>
      </Box>
      <Box className="checkbox">
        <FormControl className={errors.fscsConfirmation ? 'error' : ''}>
          <FormControlLabel
            control={
              <Checkbox
                icon={<CheckBoxOutlineBlank />}
                checkedIcon={<Check />}
                checked={data.fscsConfirmation}
                onChange={() => {
                  !data.fscsConfirmation && !pdfClicked['fscs'] && openPdf('fscs');
                  handleChange('fscsConfirmation', !data.fscsConfirmation);
                }}
              />
            }
            label="I confirm that I have downloaded and read the FSCS Information Sheet and Exclusions List."
          />
          {errors.fscsConfirmation && <p className="msg">{errors.fscsConfirmation}</p>}
        </FormControl>
      </Box>
      <Box className="divider"></Box>
      <Typography className="label">Confirmation</Typography>
      <Box className="checkbox">
        <FormControl className={errors.saveDetailsConfirmation ? 'error' : ''}>
          <FormControlLabel
            control={
              <Checkbox
                icon={<CheckBoxOutlineBlank />}
                checkedIcon={<Check />}
                checked={data.saveDetailsConfirmation}
                onChange={() => handleChange('saveDetailsConfirmation', !data.saveDetailsConfirmation)}
              />
            }
            label="I certify that the above information is correct and give my consent for Alba Bank to use and store my personal details."
          />
          {errors.saveDetailsConfirmation && <p className="msg">{errors.saveDetailsConfirmation}</p>}
        </FormControl>
      </Box>
      <CommonNextButton handleSteps={(e: boolean) => handleClick(e)} />
    </Box>
  );
};
