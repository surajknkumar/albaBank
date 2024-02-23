'use server';

import { GetHeadersDetails } from '@app/services';
import { API_URIS, ID_TOKEN } from '@utils/constants';
import { headers } from 'next/headers';

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL;
};
export async function GET() {
  const headersList = headers();
  let userRoleArray: any[] = [];
  const headerOption = await GetHeadersDetails();
  const token = headersList.get('X-MS-TOKEN-AAD-ID-TOKEN') || ID_TOKEN;
  const roles = JSON.parse(atob(token.split('.')[1])).roles;
  const res = await fetch(getBaseUrl() + API_URIS.PERMISSION_MAP, {
    method: 'GET',
    headers: headerOption
  });
  if (res.status !== 200) return res;
  const responseData = await res.json();
  roles?.forEach((element: string | number) => {
    userRoleArray = [...userRoleArray, ...responseData.data[element]];
  });
  return Response.json({ ...responseData, data: userRoleArray });
}
