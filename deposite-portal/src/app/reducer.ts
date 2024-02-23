import { combineReducers } from '@reduxjs/toolkit';
import onBoardingSlice from '../scenes/Savings/OnBoarding/store/index';

export const appReducers = combineReducers({
  onBoarding: onBoardingSlice
});
