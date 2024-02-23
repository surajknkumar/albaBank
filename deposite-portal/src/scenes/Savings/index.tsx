import * as React from 'react';
import Box from '@mui/material/Box';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { getActiveStep, getUserInfo } from './OnBoarding/store/selectors';
import { useEffect, useState } from 'react';
import {
  Step,
  StepConnector,
  StepIconProps,
  StepLabel,
  Stepper,
  Typography,
  stepConnectorClasses,
  styled
} from '@mui/material';
import { ImageData } from 'src/resources/images';
import { ALBA_CONSTANTS } from 'src/resources/constants';

const steps = ['Start', 'Personal Details', 'Nominated Account', 'Summary', 'Your Application'];
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 7.5,
    left: '-50%',
    right: '50%'
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#221c35'
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#221c35'
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#00E2D6',
    borderTopWidth: 2,
    borderRadius: 1
  },
  [theme.breakpoints.down('md')]: {
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10.5
    }
  }
}));
const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#00E2D6',
  display: 'flex',
  height: 16,

  alignItems: 'center',
  ...(ownerState.active && {
    border: '2px solid #221C35',
    height: 16,
    zIndex: 1,
    borderRadius: '50%'
  }),
  '& .QontoStepIcon-circle': {
    width: 12,
    height: 12,
    borderRadius: 6,
    color: '#221C35',
    backgroundColor: '#00E2D6',
    textAlign: 'center',
    zIndex: 1
  },
  '& .completed': {
    backgroundColor: '#221C35',
    borderRadius: '50%',
    color: '#fff'
  },
  [theme.breakpoints.down('md')]: {
    height: 24,
    '.QontoStepIcon-circle': {
      width: 24,
      height: 24,
      borderRadius: 12,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      ...(ownerState.active && {
        width: 20,
        height: 20
      })
    }
  },
  [theme.breakpoints.up('md')]: {
    '.QontoStepIcon-circle p': {
      display: 'none'
    }
  }
}));

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className, icon } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      <div className={`QontoStepIcon-circle ${completed ? 'completed' : ''}`}>
        <Typography
          sx={{
            fontSize: '14px',
            lineHeight: '20px',
            fontWeight: 500
          }}
        >
          {icon}
        </Typography>
      </div>
    </QontoStepIconRoot>
  );
}

export const Savings = function () {
  const navigate = useNavigate();
  const location = useLocation();
  const currentStep = useAppSelector(getActiveStep);
  const userInfo = useAppSelector(getUserInfo);
  const [isExistingUser, setIsExistingUser] = useState(userInfo.canBeDuplicateCustomer);

  useEffect(() => {
    if (location.pathname === '/') navigate('/deposit-details');
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  useEffect(() => {
    setIsExistingUser(userInfo.canBeDuplicateCustomer);
  }, [userInfo]);

  return (
    <Box id="savings">
      <Box sx={{ padding: { sm: '32px 0 30px', xs: '16px 20px' } }}>
        <Box
          className="container"
          sx={{
            padding: 0
          }}
        >
          <Box
            sx={{
              textAlign: 'center',
              fontFamily: 'Merriweather',
              fontSize: { xs: '18px', md: '28px' },
              lineHeight: { xs: '24px', md: '35px' },
              fontWeight: 700,
              marginBottom: '22px'
            }}
          >
            Savings Online Application
          </Box>
          <Box sx={{ overflow: 'hidden', width: { xs: '100%' } }}>
            <Stepper
              activeStep={currentStep}
              className={currentStep === -1 ? 'expired' : ''}
              alternativeLabel
              connector={<QontoConnector />}
            >
              {steps.map((label: any, index) => (
                <Step key={index}>
                  <StepLabel StepIconComponent={QontoStepIcon}>
                    {index + 1}. {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Box>
      </Box>
      <Box className="savings-content">
        <Box sx={{ padding: '0', background: '#fff' }} className="container">
          <Box className="application-header">
            {currentStep < 0 ? (
              <Typography>
                {location.pathname === '/validation-failed'
                  ? 'Validation Failed'
                  : location.pathname === '/contact-us'
                  ? 'Please Contact Us'
                  : 'Session timeout'}
              </Typography>
            ) : (
              <Typography>
                {currentStep + 1}.&nbsp;
                {isExistingUser && currentStep === 2 ? 'Validate Your Identity' : steps[currentStep]}
                {currentStep === 0 ? ' Your Application' : ''}
              </Typography>
            )}
            <Box className="icons">
              <a href={ALBA_CONSTANTS.CONTACT_US_UIRL} target="_blank">
                <img src={ImageData.customerCareIcon} alt="Customer Care " />
              </a>
              <a href={'mailto:' + ALBA_CONSTANTS.SAVINGS_MAIL_ID}>
                <img src={ImageData.mailIcon} alt="mail" />
              </a>
            </Box>
          </Box>
          <Box sx={{ padding: { xs: '0 15px', sm: '0 40px', lg: '0 62px' } }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
