'use server';

import { ID_TOKEN } from '@utils/constants';
import { headers } from 'next/headers';

export async function GET() {
  const headersList = headers();
  const idtoken = headersList.get('X-MS-TOKEN-AAD-ID-TOKEN') || ID_TOKEN;
  const agentDetail = atob(idtoken.split('.')[1]);
  return Response.json({
    code: 0,
    message: null,
    data: {
      principal_name: headersList.get('X-MS-CLIENT-PRINCIPAL-NAME') || 'Alba Bank',
      principal_id: headersList.get('X-MS-CLIENT-PRINCIPAL-ID'),
      principal: headersList.get('X-MS-CLIENT-PRINCIPAL'),
      idp: headersList.get('X-MS-CLIENT-PRINCIPAL-IDP'),
      token: headersList.get('X-MS-TOKEN-AAD-ACCESS-TOKEN'),
      id_token: headersList.get('X-MS-TOKEN-AAD-ID-TOKEN'),
      agentName: JSON.parse(agentDetail).name
    }
  });
}
