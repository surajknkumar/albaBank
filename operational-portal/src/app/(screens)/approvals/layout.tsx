'use client';
import { TASK_STATUS } from '@app/models/enum/client.enum';
import { useAppDispatch, useAppSelector } from '@app/store/redux/hooks';
import { getPermissionsMapping } from '@app/store/redux/selectors';
import { fetchWithdrawalRequestTaskList } from '@app/store/withdrawal.store';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useEffect } from 'react';

export default function ApprovalLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const permissions = useAppSelector(getPermissionsMapping);

  useEffect(() => {
    if (!permissions.includes('APPROVE_WITHDRAWAL_REQUEST')) router.replace('/');
    else dispatch(fetchWithdrawalRequestTaskList({ status: TASK_STATUS.PENDING }));
  }, [permissions]);

  return <>{permissions.includes('APPROVE_WITHDRAWAL_REQUEST') && children}</>;
}
