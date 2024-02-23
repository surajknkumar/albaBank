'use server';

import { GetHeadersDetails } from '@app/services';
import { API_URIS } from '@utils/constants';
import { NextRequest } from 'next/server';

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL;
};

export async function GET(request: NextRequest) {
  const headerOption = await GetHeadersDetails();
  const taskType = request.nextUrl.searchParams.get('taskType');
  const status = request.nextUrl.searchParams.get('status');
  return fetch(getBaseUrl() + API_URIS.TASKS + `?taskType=${taskType}&status=${status}`, {
    method: 'GET',
    headers: headerOption
  });
  // return Response.json({
  //   code: 0,
  //   message: 'ok',
  //   data: [
  //     {
  //       taskType: taskType,
  //       taskData: {
  //         taskId: 'TASK_1234',
  //         customerName: `Dhairya Bhardwaj ${status === 'pending' ? 1 : 2}`,
  //         customerId: 'CUST_JGLKJSSDFLDJ',
  //         withdrawalDate: '30-12-2023',
  //         balance: '300',
  //         balanceLastUpdatedOn: '30/12/2023',
  //         withdrawalAmount: '200',
  //         maker: 'System',
  //         accountName: 'Alba Bank',
  //         comment: ''
  //       }
  //     },
  //     {
  //       taskType: taskType,
  //       taskData: {
  //         taskId: 'TASK_1234',
  //         customerName: `Dhairya Bhardwaj 1${status === 'pending' ? 1 : 2}`,
  //         customerId: 'CUST_JGLKJSSDFLDJ',
  //         withdrawalDate: '30-12-2023',
  //         balance: '300',
  //         balanceLastUpdatedOn: '30/12/2023',
  //         withdrawalAmount: '200',
  //         maker: 'System',
  //         accountName: 'Alba Bank',
  //         comment: ''
  //       }
  //     }
  //   ]
  // });
}
