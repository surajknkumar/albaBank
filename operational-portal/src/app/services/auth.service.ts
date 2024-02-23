import http from './http.service';
import { IResponse } from '@app/store/types';

const getAuthDetails = async () => {
  if (window.location.hostname !== 'localhost') await refreshToken();
  return http.get<IResponse<any>>('/auth-details');
};

const refreshToken = () => {
  return fetch('/.auth/refresh');
};

const authService = {
  getAuthDetails,
  refreshToken
};

export default authService;
