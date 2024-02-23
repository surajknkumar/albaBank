'use server';

import { GetHeadersDetails } from '@app/services';
import { API_URIS } from '@utils/constants';
import { NextRequest } from 'next/server';

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL;
};
export async function GET(request: NextRequest, constants: { params: any }) {
  const { params } = constants;
  const headerOption = await GetHeadersDetails();
  return fetch(getBaseUrl() + API_URIS.DEPOSIT_ACCOUNT + `${params['account-id']}/withdrawal-request`, {
    method: 'GET',
    headers: headerOption
  });
}

export async function POST(request: NextRequest, constants: { params: any }) {
  const { params } = constants;
  const headerOption = await GetHeadersDetails();
  const req = await request.json();
  return fetch(getBaseUrl() + API_URIS.DEPOSIT_ACCOUNT + `${params['account-id']}/withdrawal-request`, {
    method: 'POST',
    headers: headerOption,
    body: JSON.stringify(req)
  });
}

export async function PUT(request: NextRequest, constants: { params: any }) {
  const { params } = constants;
  const headerOption = await GetHeadersDetails();
  const req = await request.json();
  return fetch(getBaseUrl() + API_URIS.DEPOSIT_ACCOUNT + `${params['account-id']}/withdrawal-request`, {
    method: 'PUT',
    headers: headerOption,
    body: JSON.stringify(req)
  });
}
