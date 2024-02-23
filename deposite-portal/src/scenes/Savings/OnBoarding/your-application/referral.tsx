import React, { useEffect } from 'react';
import { Box, Button } from '@mui/material';
import ReactGA from 'react-ga4';
import { ALBA_CONSTANTS } from 'src/resources/constants';
type referralProps = {
  productName?: string;
  verificationUrl?: string;
  acceptableDocumentUrl?: string;
  documentUploadType: 'POI' | 'POI_POA';
};
export const Referral = ({
  productName,
  verificationUrl,
  acceptableDocumentUrl,
  documentUploadType
}: referralProps) => {
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname, title: 'Referred Applications' });
  }, []);
  return verificationUrl ? (
    <Box>
      <Box className="title">Your Alba Bank savings account</Box>
      <ul>
        <li>
          Thank you for applying for a {productName} savings account. To finalise the application process, please
          provide additional documentation to verify your identity.
        </li>
        <li>
          Please upload an ID document (passport, driving license or ID card)
          {documentUploadType === 'POI_POA' ? ', selfie and proof of address ' : ' and Selfie'} using the link{' '}
          <a href={verificationUrl} target="_blank">
            here
          </a>
          . Either a scan or photo will be fine.
        </li>
        <li>
          To understand the documents we can accept, please see our acceptable documents link{' '}
          <a href={acceptableDocumentUrl} target="_blank">
            here
          </a>
        </li>
        <li>
          Once we confirm your identity, we’ll open your account, send the account details and let you know how to make
          a deposit.
        </li>
        <li>
          To ensure you receive the interest rate you applied for, please send these documents in the next 7 calendar
          days.
        </li>
        <li>
          If you need any help, please email us at{' '}
          <a href={'mailto:' + ALBA_CONSTANTS.SAVINGS_MAIL_ID}>{ALBA_CONSTANTS.SAVINGS_MAIL_ID}</a>. You can also call
          us on <a href={'tel:' + ALBA_CONSTANTS.CUSTOMER_CARE_NUMBER}>{ALBA_CONSTANTS.CUSTOMER_CARE_NUMBER}</a>. We're
          open Monday to Friday, 9am to 5pm, excluding bank holidays.
        </li>
      </ul>
    </Box>
  ) : (
    <Box>
      <Box className="title">Thank you for applying for an Alba Bank savings account.</Box>
      <ul>
        <li>
          We are reviewing the details you provided and will email you within 2 working days. If you have not received
          an email within the time, please check your junk folder or contact us.
        </li>
        <li>
          If you need any help, please email us at{' '}
          <a href={'mailto:' + ALBA_CONSTANTS.SAVINGS_MAIL_ID}>{ALBA_CONSTANTS.SAVINGS_MAIL_ID}</a> or call us on{' '}
          <a href={'tel:' + ALBA_CONSTANTS.CUSTOMER_CARE_NUMBER}>{ALBA_CONSTANTS.CUSTOMER_CARE_NUMBER}</a>. We're open
          Monday to Friday, 9am to 5pm, excluding bank holidays.
        </li>
      </ul>
    </Box>
  );
};
