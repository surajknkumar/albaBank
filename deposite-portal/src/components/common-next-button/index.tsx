import { Box, Button } from '@mui/material';
import React, { useEffect } from 'react';
import { useAppSelector } from 'src/app/hooks';
import { getActiveStep } from '../../scenes/Savings/OnBoarding/store/selectors';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
type CommonNextButtonProps = {
  handleSteps: (count: boolean) => void;
};

export const CommonNextButton = ({ handleSteps }: CommonNextButtonProps) => {
  const currentStep = useAppSelector(getActiveStep);
  useEffect(() => {}, [currentStep]);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: ['row'],
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 0,
        justifyContent: currentStep === 0 ? 'flex-end' : 'space-between'
      }}
      className="custom-btn"
    >
      {currentStep !== 0 ? (
        <Button onClick={() => handleSteps(false)} disabled={currentStep === 0} startIcon={<ArrowBackIosIcon />}>
          Previous
        </Button>
      ) : null}
      <Button onClick={() => handleSteps(true)} endIcon={<ArrowForwardIosIcon />}>
        {currentStep === 3 ? 'Submit' : 'Next'}
      </Button>
    </Box>
  );
};
