import { RootState } from 'src/app/store';

export const appLoading = (state: RootState) => state.onBoarding.status === 'loading';
