import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { Verified } from './verified';
import { Declined } from './declined';
import { Referral } from './referral';
import { Box, Button, Grid } from '@mui/material';
import { getConsentDetailsResponse, getDepositDetails, getDepositProducts } from '../store/selectors';
import { clearStore, selectStep } from '../store';
import { useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';

export const YourApplication: React.FC = () => {
  const finalStatus = useAppSelector(getConsentDetailsResponse);
  const depositProducts = useAppSelector(getDepositProducts);
  const depositDetails = useAppSelector(getDepositDetails);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(selectStep(4));
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname, title: 'Application Decision' });
    history.pushState(null, 'null', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
    return () => {
      dispatch(clearStore());
    };
  }, []);

  const goToHome = () => {
    ReactGA.event({
      category: 'Application Decision',
      action: 'Application Decision - Back to Home',
      label: 'Application Decision - Back to Home'
    });
    window.open('https://albabank.co.uk', '_self');
  };

  return (
    <Box id="your-application">
      {finalStatus.state === 'verified' ? (
        <Verified
          productName={
            depositProducts.find((product) => product.productKey === depositDetails.depositProduct)?.displayName || ''
          }
          clientAccountNumber={finalStatus.clientAccountNumber}
          sortCode={finalStatus.payeeDetails.sortCode}
          accountNumber={finalStatus.payeeDetails.accountNumber}
          beneficiaryName={finalStatus.payeeDetails.beneficiaryName}
          reference={finalStatus.payeeDetails.reference}
          aer={finalStatus.aer}
        />
      ) : finalStatus.state === 'referral' ? (
        <Referral
          productName={
            depositProducts.find((product) => product.productKey === depositDetails.depositProduct)?.displayName || ''
          }
          verificationUrl={finalStatus.verificationUrl}
          acceptableDocumentUrl={finalStatus.acceptableDocumentUrl}
          documentUploadType={finalStatus.documentUploadType}
        />
      ) : (
        <Declined />
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: ['row'],
          paddingTop: 5,
          justifyContent: 'center',
          maxWidth: '100% !important'
        }}
        className="custom-btn"
      >
        <Button onClick={goToHome}>BACK TO HOME</Button>
      </Box>
    </Box>
  );
};
