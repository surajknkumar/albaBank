import { SearchDisplayItems } from '@app/models/interfaces/clients.interface';
import Swal from 'sweetalert2';
import style from '../page.module.css';

type DATE_FORMATS = 'dd-mm-yyyy' | 'dd/mm/yyyy' | 'mm-dd-yyyy' | 'yyyy-mm-dd';

/**
 * Stringifies and stores data in local storage
 * @param  {string} key - Key name
 * @param  {instanceOf(Object)} data - Data to be stored in localStorage
 * @returns {undefined}
 */
export const setToLocalStorage = (key: string, data: any) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const getSearchByValue = (searchBy: string) => {
  let response = { first: 'name', second: 'customerId' };
  switch (searchBy) {
    case 'mobile_number':
      response = { first: 'mobileNumber', second: 'name' };
      break;
    case 'account_id':
      response = { first: 'accountId', second: 'name' };
      break;
    case 'email_id':
      response = { first: 'emailId', second: 'name' };
      break;
    case 'customer_id':
      response = { first: 'customerId', second: 'name' };
      break;
    default:
      response = { first: 'name', second: 'mobileNumber' };
  }
  return response as SearchDisplayItems;
};

export const firstLetterToUpperCase = (str: string) => {
  return str
    ? str
        .split(' ')
        .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
        .join(' ')
    : str;
};

export const convertDDtoMMDate = (date: string) => {
  const arr = date.split('-');
  return arr[1] + '-' + arr[0] + '-' + arr[2];
};

export const formatDate = (dateValue: string | Date, format: DATE_FORMATS) => {
  const newDate = new Date(dateValue);
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1;
  const date = newDate.getDate();
  switch (format) {
    case 'dd-mm-yyyy':
      return `${addZero(date)}-${addZero(month)}-${year}`;
    case 'dd/mm/yyyy':
      return `${addZero(date)}/${addZero(month)}/${year}`;
    case 'mm-dd-yyyy':
      return `${addZero(month)}-${addZero(date)}-${year}`;
    case 'yyyy-mm-dd':
      return `${year}-${addZero(month)}-${addZero(date)}`;
  }
};

export const getOffsetDate = (date: string | Date, offset: number): string => {
  return formatDate(new Date(new Date(date).getTime() + offset * 24 * 60 * 60 * 1000), 'mm-dd-yyyy');
};

export const addZero = (value: any) => {
  return parseInt(value) < 10 ? '0' + value : value;
};

export const RegExpCheck = (value: string) => {
  const pattern = /^[a-zA-Z0-9][\sa-zA-Z0-9]*/;
  return pattern.test(value);
};

export const sweetAlertCall = (
  _title: string,
  _text: string,
  _icon: any,
  _confirmButtonText: string,
  _reverseButtons: boolean,
  confirmCallback?: () => any
) => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: `${style.swalBtn}`
    },
    buttonsStyling: false
  });

  swalWithBootstrapButtons
    .fire({
      title: _title,
      text: _text,
      icon: _icon,
      confirmButtonText: _confirmButtonText,
      reverseButtons: _reverseButtons
    })
    .then((result) => {
      if (result.isConfirmed) {
        if (confirmCallback) confirmCallback();
      }
    });
};
