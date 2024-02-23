'use server';

import { ID_TOKEN } from '@utils/constants';
import { headers } from 'next/headers';

export async function GET() {
  const headersList = headers();
  const idToken = headersList.get('X-MS-TOKEN-AAD-ID-TOKEN') || ID_TOKEN;
  return Response.json({
    code: 0,
    message: null,
    data: {
      user_name: JSON.parse(atob(idToken.split('.')[1])).name
    }
  });
}
