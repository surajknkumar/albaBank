'use server';

import { GetHeadersDetails } from '@app/services';
import { API_URIS } from '@utils/constants';

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL;
};
export async function GET(request: any, constants: { params: any }) {
  const { params } = constants;
  const headerOption = await GetHeadersDetails();
  return fetch(getBaseUrl() + API_URIS.CLIENT_DETAILS + `${params['customer-id']}/`, {
    method: 'GET',
    headers: headerOption
  });
}
