type DATE_FORMATS = 'dd-mm-yyyy' | 'dd/mm/yyyy' | 'mm-dd-yyyy' | 'yyyy-mm-dd';

export const getAge = (d1: any) => {
  var diff = new Date().getTime() - d1.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

export const getCookiesInfo = (cookieNanme: string) => {
  return document.cookie
    .split(';')
    .find((cookie) => cookie.trim().split('=')[0] === cookieNanme)
    ?.trim()
    .split('=')[1];
};
export const getEndYear = (numberOfyear: number) => {
  const date = new Date().getDate();
  const month = new Date().getMonth();
  const year = new Date().getFullYear() - numberOfyear;
  return `${addZero(month + 1)}/${addZero(date)}/${year}`;
};
export const calculateAge = (birthday: string | number | Date) => {
  let today = new Date(),
    dob = new Date(birthday),
    diff = today.getTime() - dob.getTime(),
    years = Math.floor(diff / 31556736000);
  return years;
};

export const formatDate = (dateValue: string, format: DATE_FORMATS) => {
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
export const addZero = (value: any) => {
  return parseInt(value) < 10 ? '0' + value : value;
};
