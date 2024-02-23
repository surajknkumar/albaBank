import { IResponse } from '@app/store';
import { sweetAlertCall } from '@app/utils/helpers';
import axios, { AxiosError } from 'axios';

const http = axios.create({
  baseURL: '/api'
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<IResponse<any>>) => {
    let title = '';
    let text = '';
    switch (error.request.status) {
      case 401:
        title = `You've been signed out`;
        text = 'Please clear browser cookies and try again';
        break;
      default:
        title = 'Something went wrong';
        break;
    }
    if (error.request.status === 401 || error.request.status === 500)
      sweetAlertCall(
        title,
        text,
        'error',
        'Ok',
        true,
        error.request.status === 401 ? () => window.location.reload() : undefined
      );
    throw error;
  }
);

export default http;
