'use server';

import { GetHeadersDetails } from '@app/services';
import { API_URIS } from '@utils/constants';
const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL;
};

export async function GET(request: any) {
  const searchParam = request.nextUrl.searchParams.get('searchParam');
  const value = request.nextUrl.searchParams.get('value');
  const headerOption = await GetHeadersDetails();
  return fetch(getBaseUrl() + API_URIS.CLIENT_SEARCH + `?searchParam=${searchParam}&&value=${value}`, {
    method: 'GET',
    headers: headerOption
  });
}
