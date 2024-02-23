'use server';
import { headers } from 'next/headers';
import { ID_TOKEN } from '@utils/constants';
export const GetHeadersDetails = () => {
  return {
    Authorization: `Bearer ${headers().get('X-MS-TOKEN-AAD-ID-TOKEN') || ID_TOKEN}`,
    'Content-Type': 'application/json'
  };
};
