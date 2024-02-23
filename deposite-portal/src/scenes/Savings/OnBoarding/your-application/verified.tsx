import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { ALBA_CONSTANTS } from 'src/resources/constants';
type verifiedProps = {
  sortCode: string;
  accountNumber: string;
  beneficiaryName: string;
  reference: string;
  clientAccountNumber: string;
  productName: string;
  aer: string;
};
import ReactGA from 'react-ga4';

export const Verified = ({
  sortCode,
  accountNumber,
  beneficiaryName,
  reference,
  clientAccountNumber,
  productName,
  aer
}: verifiedProps) => {
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname, title: 'Approved Applications' });
  }, []);
  return (
    <Box>
      <Box className="title">Your Alba Bank savings account – Welcome</Box>
      <ul>
        <li>
          Thanks for opening a <span style={{ fontWeight: 500 }}>{productName}</span> savings account, paying interest
          rate {aer}.
        </li>
        <li>
          Your Alba Bank account number is <span style={{ fontWeight: 500 }}>{clientAccountNumber}</span>.
        </li>
        <li>
          You have 14 calendar days to make any deposits from your nominated account. Deposits can be made
          electronically by Faster Payment online or by contacting your bank or building society with the following
          details:
          <ol>
            <li>
              Sort code – <span style={{ fontWeight: 500 }}> {sortCode}</span>
            </li>
            <li>
              Account number – <span style={{ fontWeight: 500 }}>{accountNumber}</span>
            </li>
            <li>
              Beneficiary name – <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{beneficiaryName}</span>
            </li>
            <li>
              Reference – <span style={{ fontWeight: 500 }}>{reference}</span>
            </li>
          </ol>
        </li>
        <li>
          You can make as many deposits as you wish during this period. We will email you within 1 working day when we
          receive them. The minimum balance and deposit amount is £{ALBA_CONSTANTS.MIN_DEPOSIT_AMOUNT} and the maximum
          is £{ALBA_CONSTANTS.MAX_DEPOSIT_AMOUNT} across all your savings accounts held with us.
        </li>
        <li>
          We have also sent these details to your email address, together with copies of the Terms and Conditions, the
          FSCS Information Sheet, our Complaints Policy and the Account Summary Sheet. Please keep these documents safe.
        </li>
        <li>
          We don’t offer online banking just yet, so if you need any help, please email us at{' '}
          <a href={'mailto:' + ALBA_CONSTANTS.SAVINGS_MAIL_ID}>{ALBA_CONSTANTS.SAVINGS_MAIL_ID}</a>. You can also call
          us on <a href={'tel:' + ALBA_CONSTANTS.CUSTOMER_CARE_NUMBER}>{ALBA_CONSTANTS.CUSTOMER_CARE_NUMBER}</a>. We're
          open Monday to Friday, 9am to 5pm, excluding bank holidays.
        </li>
      </ul>
    </Box>
  );
};
