import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { Box } from '@mui/material';
import '../Onboarding.scss';
import { ValidateYourIdentity } from './validateYourIdentity';
import { NominatedAccount } from './nominatedAccount';
import { getAccountDetailsSuccess, getValidateIdentitySuccess, getUserInfo } from '../store/selectors';
import { postAccountDetails, postPersonalDetailsWithSecurityAnswers, selectStep } from '../store';
import { useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';

export const AccountDetails: React.FC = () => {
  const userInfo = useAppSelector(getUserInfo);
  const dispatch = useAppDispatch();
  const [isSubmit, setIsSubmit] = useState(false);
  const validateIdentitySuccess = useAppSelector(getValidateIdentitySuccess);
  const accountDetailsSuccess = useAppSelector(getAccountDetailsSuccess);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(selectStep(2));
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname, title: 'Nominated Account' });
  }, []);

  useEffect(() => {
    if ((validateIdentitySuccess || accountDetailsSuccess) && isSubmit) {
      navigate('/consent');
    }
  }, [validateIdentitySuccess, accountDetailsSuccess, isSubmit]);

  const navigateToPreviousPage = () => {
    ReactGA.event({
      category: userInfo.canBeDuplicateCustomer ? 'Returning Customer Validation' : 'Nominated Account ',
      action: userInfo.canBeDuplicateCustomer
        ? 'Returning Customer Validation - Previous'
        : 'Nominated Account - Previous',
      label: userInfo.canBeDuplicateCustomer
        ? 'Returning Customer Validation - Previous'
        : 'Nominated Account - Previous'
    });
    navigate('../personal-details');
  };

  const handleSubmitClick = (isSecurityAnswersCall: boolean, data: any) => {
    if (isSecurityAnswersCall) {
      const securityAnswers: any[] = [];
      let params = { securityAnswers };
      userInfo.authenticationQuestions?.forEach((each: { securityQuestionKey: any }, index: number) => {
        params.securityAnswers.push({
          questionKey: each.securityQuestionKey,
          answer: data[`securityAnswer${index + 1}`]
        });
      });
      dispatch(
        postPersonalDetailsWithSecurityAnswers({
          ...params,
          accountNumber: data.accountNumber,
          flowState: 'authenticate'
        })
      );
    } else {
      dispatch(postAccountDetails(data));
    }
    ReactGA.event({
      category: userInfo.canBeDuplicateCustomer ? 'Returning Customer Validation' : 'Nominated Account ',
      action: userInfo.canBeDuplicateCustomer ? 'Returning Customer Validation - Next' : 'Nominated Account - Next',
      label: userInfo.canBeDuplicateCustomer ? 'Returning Customer Validation - Next' : 'Nominated Account - Next'
    });
    setIsSubmit(true);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: ['column'],
        justifyContent: 'flex-start',
        width: '100%'
      }}
      className="nominated-account"
    >
      {userInfo.canBeDuplicateCustomer ? (
        <ValidateYourIdentity
          userInfo={userInfo}
          handleSubmitClick={handleSubmitClick}
          navigateToPreviousPage={navigateToPreviousPage}
        />
      ) : (
        <NominatedAccount handleSubmitClick={handleSubmitClick} navigateToPreviousPage={navigateToPreviousPage} />
      )}
    </Box>
  );
};
