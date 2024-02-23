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
  return fetch(getBaseUrl() + API_URIS.TASKS + `/${params['task-id']}/dispatch-status`, {
    method: 'GET',
    headers: headerOption
  });
}
