'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
  ButtonBase,
  CircularProgress
} from '@mui/material';
import Image from 'next/image';
import { REFRESH, SORT_ICON } from '@svgs';
import ApproveWithdrawal from '@app/components/approve-withdrawal';
import { useAppDispatch, useAppSelector } from '@app/store/redux/hooks';
import {
  setAlertDetails,
  fetchWithdrawalRequestTaskList,
  sortWithdrawalRequestList,
  setWithdrawalStatus,
  IResponse
} from '@app/store';
import {
  getCurrentSortBy,
  getIsCurrentSortAscending,
  getPermissionsMapping,
  getWithdrawalRequestList
} from '@app/store/redux/selectors';
import { WithdrawalRequestTask, WithdrawalRequestTaskData } from '@app/models/interfaces/withdrawal.interface';
import { APPROVAL_STATUS, BALANCE_STATUS, TASK_STATUS } from '@app/models/enum/client.enum';
import withdrawalService from '@app/services/withdrawal.service';
import { AxiosError, AxiosResponse } from 'axios';

enum ApprovalTab {
  Pending = 'Pending',
  Approved = 'Approved'
}

export default function Approval() {
  const dispatch = useAppDispatch();
  const gettingWithdrawalList = useAppSelector(getWithdrawalRequestList);
  const [withdrawalList, setWithdrawalList] = useState<WithdrawalRequestTask[]>([]);
  const currentSortBy = useAppSelector(getCurrentSortBy);
  const permissions = useAppSelector(getPermissionsMapping);
  const isCurrentSortAscending = useAppSelector(getIsCurrentSortAscending);
  const tabs = [ApprovalTab.Pending, ApprovalTab.Approved];
  const [selectedTab, setSelectedTab] = useState<ApprovalTab>(ApprovalTab.Pending);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [pageItemsCount, setPageItemsCount] = useState(20);
  const [page, setPage] = useState(0);
  const disclaimer = useRef<any>();

  const statusTextColor = {
    [APPROVAL_STATUS.PENDING]: '#9F00AD',
    [APPROVAL_STATUS.FAILED]: '#FC2F48',
    [APPROVAL_STATUS.APPROVED]: '#E77D00',
    [APPROVAL_STATUS.SUCCESS]: '#4BAE4F',
    [APPROVAL_STATUS.QUEUE]: '#0073C7'
  };

  const fetchWithdrawalRequestList = (status: TASK_STATUS) => {
    dispatch(fetchWithdrawalRequestTaskList({ status }));
  };

  const approveWithdrawalRequest = async () => {
    dispatch(setWithdrawalStatus('loading'));
    withdrawalService
      .approveWithdrawalRequest(withdrawalList[selectedIndex].taskData.taskId)
      .then(
        (response) => {
          if (response.data.code === 0) {
            setShowApprovalDialog(false);
            fetchWithdrawalRequestList(TASK_STATUS.PENDING);
          }
          dispatch(
            setAlertDetails({
              open: true,
              severity: response.data.code === 0 ? 'success' : 'error',
              message: response.data.code === 0 ? 'The withdrawal request has been approved.' : response.data.message
            })
          );
        },
        (error: AxiosError<IResponse<any>>) => {
          error.request.status === 403 &&
            dispatch(
              setAlertDetails({
                open: true,
                severity: 'error',
                message: error.response?.data.message
              })
            );
        }
      )
      .finally(() => {
        dispatch(setWithdrawalStatus('idle'));
      });
  };
  const sortBy = (sortBy: keyof WithdrawalRequestTaskData) => {
    if (withdrawalList.length === 0) return;
    dispatch(sortWithdrawalRequestList({ sortBy, ascending: currentSortBy !== sortBy || !isCurrentSortAscending }));
  };
  useEffect(() => {
    setWithdrawalList(
      gettingWithdrawalList.map((item) => {
        return { ...item, refreshLoading: false };
      })
    );
  }, [gettingWithdrawalList]);

  const viewBalance = (accountId: string, idx: number) => {
    if (withdrawalList[idx].taskData.balanceStatus === BALANCE_STATUS.LOADED) return;
    setWithdrawalList(
      withdrawalList.map((item, index) =>
        index === idx ? { ...item, taskData: { ...item.taskData, balanceStatus: BALANCE_STATUS.LOADING } } : item
      )
    );
    withdrawalService
      .getWithdrawalBalance(accountId)
      .then((response: AxiosResponse<IResponse<any>>) => {
        let tmpWithdrawalList = withdrawalList.map((item, index) =>
          index === idx
            ? {
                ...item,
                taskData: {
                  ...item.taskData,
                  balance: response.data?.data.balance,
                  balanceStatus: BALANCE_STATUS.LOADED
                }
              }
            : item
        );
        setWithdrawalList([...tmpWithdrawalList]);
      })
      .catch((e) => {
        setWithdrawalList(
          withdrawalList.map((item, index) =>
            index === idx ? { ...item, taskData: { ...item.taskData, balanceStatus: BALANCE_STATUS.FAILED } } : item
          )
        );
      });
  };

  const setRefreshLoading = (index: number, value: boolean) => {
    setWithdrawalList(
      withdrawalList.map((item, idx) => {
        return index === idx ? { ...item, refreshLoading: value } : item;
      })
    );
  };

  const refreshStatus = (taskId: string, index: number) => {
    setRefreshLoading(index, true);
    withdrawalService.getTaskStatus(taskId).then(
      (response: AxiosResponse<IResponse<{ status: APPROVAL_STATUS; taskActionStatus: string }>>) => {
        if (response.data.data) {
          setWithdrawalList(
            withdrawalList.map((item, idx) => {
              return index === idx
                ? {
                    ...item,
                    taskData: {
                      ...item.taskData,
                      withdrawalStatus: response.data.data.status,
                      taskActionStatus: response.data.data.taskActionStatus
                    },
                    refreshLoading: false
                  }
                : item;
            })
          );
        }
      },
      (error: AxiosError<IResponse<any>>) => {
        dispatch(
          setAlertDetails({
            open: true,
            severity: 'error',
            message: error.response?.data.message || `Couldn't fetch current status, something went wrong`
          })
        );
        setRefreshLoading(index, false);
      }
    );
  };

  return (
    <React.Fragment>
      <Box ref={disclaimer} sx={{ padding: '34px 50px 18px' }}>
        <Typography sx={{ fontSize: '28px', fontWeight: 700, lineHeight: '35px', fontFamily: 'Merriweather' }}>
          Authorize Withdrawal
        </Typography>
        <Box sx={{ background: '#ADB8F9', marginTop: '6px', padding: '8px 10px' }}>
          <Typography sx={{ fontSize: '13px', lineHeight: '20px' }}>
            This list includes all the withdrawals which are due/overdue as on today as per the Maturity Date for FTD
            accounts and Withdrawal Date for Notice accounts
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', background: '#221C35', position: 'sticky', top: 0 }}>
        {tabs.map((tab, index) => (
          <Typography
            key={index}
            sx={{
              fontSize: '18px',
              lineHeight: '20px',
              fontWeight: 500,
              width: '260px',
              textAlign: 'center',
              textTransform: 'uppercase',
              color: '#fff',
              padding: '24px 50px 20px',
              borderBottom: selectedTab === tab ? '5px solid #00E2D6' : 'none',
              opacity: selectedTab === tab ? 1 : 0.5,
              cursor: 'pointer'
            }}
            onClick={() => {
              fetchWithdrawalRequestList(tab === ApprovalTab.Pending ? TASK_STATUS.PENDING : TASK_STATUS.APPROVED);
              setSelectedTab(tab);
            }}
          >
            {tab}
          </Typography>
        ))}
      </Box>
      <Table>
        <TableHead
          sx={{
            background: '#f4f4f4',
            position: 'sticky',
            top: '70px',
            '.MuiTableCell-root': {
              padding: 0,
              '&:first-of-type': {
                paddingLeft: '36px'
              }
            },
            '.MuiButtonBase-root': {
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: '72px',
              padding: '8px',
              justifyContent: 'flex-start',
              img: { marginRight: '5px' },
              p: { textAlign: 'left' }
            }
          }}
        >
          <TableRow>
            <TableCell sx={{ maxWidth: '200px' }} onClick={() => sortBy('customerName')}>
              <ButtonBase>
                <Image height={12} width={8} src={SORT_ICON} alt="Sort" priority />
                <Typography>Customer Name / ID</Typography>
              </ButtonBase>
            </TableCell>
            <TableCell sx={{ maxWidth: '260px' }} onClick={() => sortBy('accountName')}>
              <ButtonBase>
                <Image height={12} width={8} src={SORT_ICON} alt="Sort" priority />
                <Typography>Account Name</Typography>
              </ButtonBase>
            </TableCell>
            <TableCell onClick={() => sortBy('withdrawalDate')}>
              <ButtonBase>
                <Image height={12} width={8} src={SORT_ICON} alt="Sort" priority />
                <Typography sx={{ minWidth: { lg: '138px' } }}>Withdrawal Date</Typography>
              </ButtonBase>
            </TableCell>
            <TableCell onClick={() => sortBy('balance')}>
              <ButtonBase>
                <Image height={12} width={8} src={SORT_ICON} alt="Sort" priority />
                <Typography>Balance</Typography>
              </ButtonBase>
            </TableCell>
            <TableCell onClick={() => sortBy('withdrawalAmount')}>
              <ButtonBase>
                <Image height={12} width={8} src={SORT_ICON} alt="Sort" priority />
                <Typography sx={{ minWidth: { lg: '138px' } }}>Withdrawal Amt.</Typography>
              </ButtonBase>
            </TableCell>
            <TableCell onClick={() => sortBy('maker')}>
              <ButtonBase>
                <Image height={12} width={8} src={SORT_ICON} alt="Sort" priority />
                <Typography>Maker</Typography>
              </ButtonBase>
            </TableCell>
            {permissions && permissions.includes('APPROVE_WITHDRAWAL_REQUEST') && (
              <TableCell>
                <ButtonBase>
                  <Image height={12} width={8} src={SORT_ICON} alt="Sort" priority />
                  <Typography>{selectedTab === ApprovalTab.Pending ? 'Action' : 'Status'}</Typography>
                </ButtonBase>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {withdrawalList.slice(page * pageItemsCount, (page + 1) * pageItemsCount).map((item, index: number) => (
            <TableRow key={index}>
              <TableCell sx={{ maxWidth: '200px' }}>
                {item.taskData.customerName} {item.taskData.customerId}
              </TableCell>
              <TableCell sx={{ maxWidth: '260px' }}>{item.taskData.accountName || '-'}</TableCell>
              <TableCell>{item.taskData.withdrawalDate}</TableCell>
              <TableCell>
                {item.taskData.balanceStatus === BALANCE_STATUS.LOADED ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 500, marginRight: '1px' }}>£</Typography>
                    {item.taskData.balance}
                  </Box>
                ) : item.taskData.balanceStatus === BALANCE_STATUS.LOADING ? (
                  <CircularProgress
                    sx={{ width: '18px !important', height: '18px !important', marginLeft: '10px' }}
                    color="inherit"
                  />
                ) : (
                  <Box
                    sx={{
                      borderRadius: '4px',
                      background: '#DFE3FD',
                      padding: '3px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      lineHeight: '20px',
                      width: '40px'
                    }}
                    onClick={() => {
                      viewBalance(item.taskData.accountId, page * pageItemsCount + index);
                    }}
                  >
                    View
                  </Box>
                )}
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 500, marginRight: '1px' }}>£</Typography>
                  {item.taskData.withdrawalAmount}
                </Box>
              </TableCell>
              <TableCell>{item.taskData.maker}</TableCell>
              {permissions && permissions.includes('APPROVE_WITHDRAWAL_REQUEST') && (
                <TableCell>
                  {selectedTab === ApprovalTab.Pending ? (
                    <Box
                      sx={{
                        borderRadius: '4px',
                        background: '#F7D2D1',
                        padding: '3px 5px',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                      onClick={() => {
                        setSelectedIndex(page * pageItemsCount + index);
                        viewBalance(item.taskData.accountId, page * pageItemsCount + index);
                        setShowApprovalDialog(true);
                      }}
                    >
                      Approve
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          lineHeight: '18px',
                          color: statusTextColor[item.taskData.withdrawalStatus]
                        }}
                      >
                        {item.taskData.withdrawalStatus}
                      </Typography>
                      {item.taskData.taskActionStatus === 'started' && (
                        <Image
                          style={
                            item.refreshLoading
                              ? { animation: 'spin 2s linear infinite', marginLeft: '10px' }
                              : { marginLeft: '10px' }
                          }
                          width={14}
                          height={17}
                          src={REFRESH}
                          alt="refresh"
                          onClick={() => refreshStatus(item.taskData.taskId, page * pageItemsCount + index)}
                        ></Image>
                      )}
                    </Box>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {withdrawalList.length === 0 && (
        <Typography sx={{ marginTop: '50px', textAlign: 'center' }}>No Record found</Typography>
      )}
      {withdrawalList.length > pageItemsCount && (
        <Box sx={{ display: 'flex', justifyContent: 'center', margin: '35px 0' }}>
          <Pagination
            count={Math.ceil(withdrawalList.length / pageItemsCount)}
            onChange={(event, page) => setPage(page - 1)}
            sx={{
              '.MuiPaginationItem-root': {
                width: '18px',
                height: '18px',
                borderRadius: '2px',
                boxSizing: 'border-box',
                minWidth: '18px',
                fontSize: '14px',
                lineHeight: '18px',
                fontWeight: 500,
                textAlign: 'center',
                padding: '0',
                margin: '0 5px',
                '&.Mui-selected': {
                  background: '#00E2D6',
                  color: '#fff',
                  '&:hover': {
                    background: '#00E2D6'
                  }
                }
              }
            }}
          ></Pagination>
        </Box>
      )}
      <ApproveWithdrawal
        open={showApprovalDialog}
        title={'Approve Withdrawal'}
        setOpen={(isOpen) => setShowApprovalDialog(isOpen)}
        withdrawalDetails={withdrawalList[selectedIndex]?.taskData}
        authorise={approveWithdrawalRequest}
      ></ApproveWithdrawal>
    </React.Fragment>
  );
}
