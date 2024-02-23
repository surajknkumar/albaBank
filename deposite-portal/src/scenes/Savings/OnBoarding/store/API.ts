import axios from 'axios';
import { IResponse } from 'src/app/types';
import { API_URIS } from 'src/resources/constants';
import { ImageData } from 'src/resources/images';
import Swal from 'sweetalert2';

const getBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL;
};

export const getDepositProducts = () => {
  return axios.get<IResponse<any>>(getBaseUrl() + API_URIS.DEPOSIT_PRODUCTS);
};

export const getNationalityList = (sessionToken: string) => {
  return axios.get<IResponse<any>>(getBaseUrl() + API_URIS.NATIONALITY_LIST, {
    headers: { 'session-id': sessionToken }
  });
};

export const initiateSession = (params: any) => {
  return axios.post<IResponse<any>>(getBaseUrl() + API_URIS.INIT_SESSION, params);
};

export const callPersonalDetails = (params: any, sessionToken: string) => {
  return axios.post<IResponse<any>>(getBaseUrl() + API_URIS.PERSONAL_DETAILS, params, {
    headers: { 'session-id': sessionToken }
  });
};

export const callAccountDetails = (params: any, sessionToken: string) => {
  return axios.post<IResponse<any>>(getBaseUrl() + API_URIS.ACCOUNT_DETAILS, params, {
    headers: { 'session-id': sessionToken }
  });
};

export const submitApplication = (params: any, sessionToken: string) => {
  return axios.post<IResponse<any>>(getBaseUrl() + API_URIS.SUBMIT_APPLICATION, params, {
    headers: { 'session-id': sessionToken }
  });
};

export const submitAddressLookup = (postcode: string, sessionToken: string) => {
  return axios.get<IResponse<any>>(getBaseUrl() + API_URIS.ADDRESS_LOOKUP + postcode, {
    headers: { 'session-id': sessionToken }
  });
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 403) window.location.href = '/savings/session-expired';
    if (error.response.status === 500) {
      Swal.fire({
        title: 'Oops!',
        text: 'Something went wrong',
        confirmButtonText: 'Retry',
        iconHtml: `<img src=${ImageData.errorIcon}>`,
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
    }
    throw error;
  }
);
