import { AxiosError, AxiosResponse } from 'axios';
import { IResponse } from './types';
import { sweetAlertCall } from '@app/utils/helpers';

export const responseHandler = (res: AxiosResponse<IResponse<any>>, rejectWithValue?: any) => {
  let resJson: IResponse<any>;
  try {
    resJson = res.data;
  } catch (e) {
    return e;
  }
  if (resJson.code === 0) return resJson.data;
  if (resJson.code === 4003) sweetAlertCall(resJson.message, '', 'error', 'Ok', true, () => window.location.reload());
  if (resJson.code === 4005)
    sweetAlertCall(resJson.message, '', 'error', 'Ok', true, () => (window.location.href = '/'));
  return rejectWithValue({ code: res.data.code, message: res.data.message });
};
export const errorHandler = (res: AxiosError<IResponse<any>>, rejectWithValue?: any) => {
  const message = res.response?.data.message || res.request.statusText;
  return rejectWithValue({ code: res.request.status, message });
};
