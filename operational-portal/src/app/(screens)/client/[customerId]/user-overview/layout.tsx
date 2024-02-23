'use client';
import clientService from '@app/services/client.service';
import { setClientStatus, setClientOverview } from '@app/store/client.store';
import { sweetAlertCall } from '@app/utils/helpers';
import { useAppDispatch } from '@app/store/redux/hooks';
import { IResponse } from '@app/store/types';
import { ClientDetails } from '@app/models/interfaces/clients.interface';
import { AxiosError, AxiosResponse } from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import React, { ReactNode, useEffect, useState } from 'react';

export default function DashboardLayout({
  children // will be a page or nested layout
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  const [isClientVerified, setIsClientVerified] = useState(false);

  useEffect(() => {
    dispatch(setClientStatus('loading'));
    clientService
      .getCustomerOverview(pathName?.slice(1).split('/')[1])
      .then(
        (response: AxiosResponse<IResponse<ClientDetails>>) => {
          if (response.data.code === 0) {
            setIsClientVerified(true);
            dispatch(setClientOverview(response.data.data));
          } else {
            router.push(`/client/${pathName?.slice(1).split('/')[1]}/identity-verification`);
          }
        },
        (error: AxiosError<IResponse<any>>) => {
          // Note: Any http error here should be shown in a popup with redirection to search page
          sweetAlertCall(
            error.response?.data.message || 'Something went wrong, please try again',
            '',
            'error',
            'Ok',
            true,
            () => router.replace('/')
          );
        }
      )
      .finally(() => dispatch(setClientStatus('idle')));
  }, []);

  return <>{isClientVerified && children}</>;
}
