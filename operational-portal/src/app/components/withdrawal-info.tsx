'use client';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../store/redux/hooks';
import {
  getPermissionsMapping,
  getSaveWithdrawalRequestStatus,
  getWithdrawalConfig,
  getWithdrawalDetails
} from '../store/redux/selectors';
import {
  createWithdrawalRequest,
  editWithdrawalRequest,
  withdrawalRequestByAccountId
} from '../store/withdrawal.store';
import { firstLetterToUpperCase, formatDate, getOffsetDate } from '../utils/helpers';
import { TASK_STATUS } from '@app/models/enum/client.enum';
import Image from 'next/image';
import { CANCEL_BUTTON, DELETE_NEW } from '@svgs';
import { WithdrawalDetail } from '@app/models/interfaces/withdrawal.interface';

export interface WithdrawalInfoProps {
  title: string;
  open: boolean;
  accountId: string;
  noticeDays: number;
  setOpen: (isOpen: boolean) => void;
}

export default function WithdrawalInfo({ title, open, setOpen, accountId, noticeDays }: WithdrawalInfoProps) {
  const [editWithdrawalDetails, setEditWithdrawalDetails] = useState<WithdrawalDetail[]>([]);
  const withdrawalDetails = useAppSelector(getWithdrawalDetails);
  const requestSaveStatus = useAppSelector(getSaveWithdrawalRequestStatus);
  const permissions = useAppSelector(getPermissionsMapping);
  const config = useAppSelector(getWithdrawalConfig);
  const dispatch = useAppDispatch();
  const [openCalendarWR, setOpenCalendarWR] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);

  useEffect(() => {
    dispatch(withdrawalRequestByAccountId(accountId));
  }, []);

  useEffect(() => {
    setEditWithdrawalDetails(withdrawalDetails);
  }, [withdrawalDetails]);

  useEffect(() => {
    if (open && requestSaveStatus === 'success') dispatch(withdrawalRequestByAccountId(accountId));
  }, [requestSaveStatus]);

  const initialValue = {
    requestDate: '',
    withdrawalDate: '',
    comment: '',
    amount: '',
    withdrawalRequestId: '',
    edit: true,
    error: undefined
  };

  const addNewWithdrawalRequest = () => {
    if (
      editWithdrawalDetails.length &&
      (editWithdrawalDetails[editWithdrawalDetails.length - 1].amount === '' ||
        editWithdrawalDetails[editWithdrawalDetails.length - 1].comment === '' ||
        editWithdrawalDetails[editWithdrawalDetails.length - 1].withdrawalDate === '' ||
        editWithdrawalDetails[editWithdrawalDetails.length - 1].requestDate === '')
    ) {
      return;
    }
    let tmpWithdrawalDetails = [...editWithdrawalDetails];
    setEditWithdrawalDetails([...tmpWithdrawalDetails, initialValue]);
  };

  const deleteRequest = () => {
    let tmpEdit = [...editWithdrawalDetails];
    tmpEdit.splice(tmpEdit.length - 1);
    setEditWithdrawalDetails(tmpEdit);
  };

  const withdrawalAction = (type: 'Edit' | 'Save' | 'Cancel', index: number) => {
    setEditWithdrawalDetails(
      editWithdrawalDetails.map((detail) => {
        return { ...detail, error: undefined };
      })
    );
    let tmpEdit = editWithdrawalDetails.map((detail) => {
      return { ...detail, error: undefined };
    });
    if (type === 'Edit') {
      tmpEdit[index].edit = true;
      setEditWithdrawalDetails(tmpEdit);
    } else if (type === 'Cancel') {
      tmpEdit[index] = { ...withdrawalDetails[index], error: undefined };
      setEditWithdrawalDetails(tmpEdit);
    } else {
      validationCheck(tmpEdit[index], index);
    }
  };
  const validationCheck = (
    data: {
      requestDate: string;
      withdrawalDate: string;
      comment: string;
      amount: string;
      withdrawalRequestId?: string;
      edit?: boolean | undefined;
    },

    index: number
  ) => {
    const tmpWithdrawalAmount =
      data.amount === '' || parseFloat(data.amount) < 1
        ? {
            amount: 'Withdrawal amount should be greater than or equal to 1 pound.'
          }
        : {};
    const tmpWithdrawalComment =
      data.comment.replaceAll(/\s/g, '').length <= 10
        ? {
            comment: 'Withdrawal comment should be greater then 10 characters.'
          }
        : {};
    const tmpWithdrawalDate =
      data.withdrawalDate === '' ? { withdrawalDate: 'Please select your withdrawal date.' } : {};
    const tmpWithdrawalRequestDate =
      data.requestDate === ''
        ? {
            requestDate: 'Please select your withdrawal request date.'
          }
        : {};
    let tmpEditWithdrawalDetails = [...editWithdrawalDetails];
    tmpEditWithdrawalDetails[index] = {
      ...editWithdrawalDetails[index],
      error: {
        ...tmpWithdrawalAmount,
        ...tmpWithdrawalComment,
        ...tmpWithdrawalDate,
        ...tmpWithdrawalRequestDate
      }
    };
    setEditWithdrawalDetails(tmpEditWithdrawalDetails);
    if (
      Object.keys({
        ...tmpWithdrawalAmount,
        ...tmpWithdrawalComment,
        ...tmpWithdrawalDate,
        ...tmpWithdrawalRequestDate
      }).length === 0
    ) {
      const request = {
        requestDate: formatDate(data.requestDate, 'dd-mm-yyyy'),
        withdrawalDate: formatDate(data.withdrawalDate, 'dd-mm-yyyy'),
        comment: data.comment,
        amount: data.amount
      };
      if (!data.withdrawalRequestId) dispatch(createWithdrawalRequest({ accountId, req: request }));
      else
        dispatch(
          editWithdrawalRequest({ accountId, req: { ...request, withdrawalRequestId: data.withdrawalRequestId } })
        );
    }
  };
  const handleChange = (key: keyof WithdrawalDetail, value: string, index: number) => {
    setEditWithdrawalDetails(
      editWithdrawalDetails.map((item, idx) => {
        return {
          ...item,
          [key]: idx === index ? value : item[key],
          withdrawalDate:
            idx === index && key === 'requestDate'
              ? getOffsetDate(value, noticeDays)
              : key === 'withdrawalDate'
                ? value
                : item.withdrawalDate
        };
      })
    );
  };

  return (
    <Dialog
      sx={{ zIndex: 1 }}
      open={open}
      onClose={(event, reason) => reason !== 'backdropClick' && reason !== 'escapeKeyDown' && setOpen(false)}
    >
      <Image
        style={{ cursor: 'pointer', position: 'absolute', top: '16px', right: '16px' }}
        height={22}
        width={22}
        src={CANCEL_BUTTON}
        alt="CANCEL BUTTON"
        priority
        onClick={() => setOpen(false)}
      />
      <DialogTitle
        sx={{
          fontFamily: 'Merriweather',
          fontWeight: 700,
          fontSize: '28px',
          padding: '50px 50px 10px'
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent
        sx={{
          padding: '0 50px',
          boxSizing: 'border-box'
        }}
      >
        <Box sx={{ border: '1px solid rgba(34, 28, 53, 0.30)' }}>
          <Table>
            <TableHead sx={{ background: '#221C35', '.MuiTableCell-root': { color: '#fff' } }}>
              <TableRow>
                <TableCell>Withdrawal Request Date</TableCell>
                <TableCell>Withdrawal Date</TableCell>
                <TableCell>Withdrawal Amount</TableCell>
                <TableCell>Withdrawal Comment</TableCell>
                <TableCell>Status</TableCell>
                {permissions && permissions.includes('EDIT_WITHDRAWAL_REQUEST') && <TableCell>Action </TableCell>}
              </TableRow>
            </TableHead>
            {editWithdrawalDetails.length ? (
              <TableBody>
                {editWithdrawalDetails.map((data: WithdrawalDetail, index: number) =>
                  !data.edit ? (
                    <TableRow key={index}>
                      <TableCell>{formatDate(data.requestDate, 'dd-mm-yyyy')}</TableCell>
                      <TableCell>{formatDate(data.withdrawalDate, 'dd-mm-yyyy')}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>£ {data.amount}</TableCell>
                      <TableCell>{data.comment}</TableCell>
                      <TableCell sx={{ fontWeight: 400 }}>{firstLetterToUpperCase(data.status || '')}</TableCell>
                      {permissions &&
                        permissions.includes('EDIT_WITHDRAWAL_REQUEST') &&
                        data.status === TASK_STATUS.PENDING && (
                          <TableCell>
                            <Typography
                              sx={{
                                width: 'max-content',
                                padding: '3px 5px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                lineHeight: '18px',
                                whiteSpace: 'nowrap',
                                background: '#DFE3FD',
                                cursor: 'pointer',
                                textAlign: 'center'
                              }}
                              onClick={() => withdrawalAction('Edit', index)}
                            >
                              Edit
                            </Typography>
                          </TableCell>
                        )}
                    </TableRow>
                  ) : (
                    <>
                      <TableRow sx={{ borderBottom: 0 }} key={index}>
                        <TableCell>
                          <FormControl
                            fullWidth
                            variant="standard"
                            required
                            className={data?.error?.requestDate ? 'error' : ''}
                          >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DesktopDatePicker
                                className="input"
                                minDate={dayjs(getOffsetDate(new Date(), -1 * (config?.requestDateLeftOffset || 0)))}
                                maxDate={dayjs(getOffsetDate(new Date(), config?.requestDateRightOffset || 0))}
                                format="DD-MM-YYYY"
                                open={openCalendarWR}
                                onClose={() => setOpenCalendarWR(false)}
                                slotProps={{
                                  textField: {
                                    onClick: () => setOpenCalendarWR(true)
                                  }
                                }}
                                sx={{
                                  width: '140px',
                                  justifyContent: 'center',
                                  paddingLeft: 1,
                                  input: {
                                    fontSize: '14px',
                                    fontWeight: '300'
                                  }
                                }}
                                value={dayjs(data.requestDate)}
                                onChange={(val) => handleChange('requestDate', val?.format('MM-DD-YYYY') || '', index)}
                              />
                            </LocalizationProvider>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <FormControl
                            fullWidth
                            variant="standard"
                            required
                            className={data?.error?.withdrawalDate ? 'error' : ''}
                          >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DesktopDatePicker
                                className="input"
                                minDate={dayjs(getOffsetDate(new Date(), -1 * (config?.withdrawalDateLeftOffset || 0)))}
                                maxDate={dayjs(getOffsetDate(new Date(), config?.withdrawalDateRightOffset || 0))}
                                format="DD-MM-YYYY"
                                open={openCalendar}
                                onClose={() => setOpenCalendar(false)}
                                slotProps={{
                                  textField: {
                                    onClick: () => setOpenCalendar(true)
                                  }
                                }}
                                sx={{
                                  width: '140px',
                                  justifyContent: 'center',
                                  paddingLeft: 1,
                                  input: {
                                    fontSize: '14px',
                                    fontWeight: '300'
                                  }
                                }}
                                value={dayjs(data.withdrawalDate)}
                                onChange={(val) =>
                                  handleChange('withdrawalDate', val?.format('MM-DD-YYYY') || '', index)
                                }
                              />
                            </LocalizationProvider>
                          </FormControl>
                        </TableCell>

                        <TableCell>
                          <FormControl
                            fullWidth
                            variant="standard"
                            required
                            className={data?.error?.amount ? 'error' : ''}
                          >
                            <Input
                              type="number"
                              required={true}
                              name="amount"
                              value={data.amount}
                              disableUnderline
                              className="input"
                              id="amount"
                              placeholder="Amount"
                              style={{
                                width: '120px',
                                height: '40px',
                                borderRadius: 1,
                                fontSize: '14px',
                                fontWeight: '300'
                              }}
                              startAdornment={<InputAdornment position="start">£</InputAdornment>}
                              onInput={(e: BaseSyntheticEvent) => handleChange('amount', e.target.value, index)}
                            />
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <FormControl
                            fullWidth
                            variant="standard"
                            required
                            className={data?.error?.comment ? 'error' : ''}
                          >
                            <TextField
                              name="comment"
                              value={data.comment}
                              id="comment"
                              placeholder="Enter Comment"
                              multiline
                              sx={{ '.MuiOutlinedInput-root': { padding: 0 } }}
                              inputProps={{
                                style: {
                                  height: '60px',
                                  fontSize: '14px',
                                  fontWeight: '300',
                                  background: `${data?.error?.comment ? '#fdf7f8' : '#f4f4f4'}`,
                                  padding: '8px 10px',
                                  border: `1px solid ${data?.error?.comment ? '#eb0000' : '#f4f4f4'}`
                                }
                              }}
                              onInput={(e: BaseSyntheticEvent) => handleChange('comment', e.target.value, index)}
                            ></TextField>
                          </FormControl>
                        </TableCell>
                        <TableCell></TableCell>
                        {permissions && permissions.includes('EDIT_WITHDRAWAL_REQUEST') && (
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography
                                sx={{
                                  padding: '3px 5px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  lineHeight: '18px',
                                  whiteSpace: 'nowrap',
                                  background: '#DFE3FD',
                                  cursor: 'pointer',
                                  textAlign: 'center'
                                }}
                                onClick={() => withdrawalAction('Save', index)}
                              >
                                Save
                              </Typography>
                              {data.withdrawalRequestId ? (
                                <Typography
                                  sx={{
                                    padding: '3px 5px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    lineHeight: '18px',
                                    whiteSpace: 'nowrap',
                                    background: '#F7D2D1',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    marginLeft: '10px'
                                  }}
                                  onClick={() => withdrawalAction('Cancel', index)}
                                >
                                  Cancel
                                </Typography>
                              ) : (
                                <Image
                                  style={{ marginLeft: '16px', cursor: 'pointer' }}
                                  width={18}
                                  height={22}
                                  src={DELETE_NEW}
                                  alt=""
                                  onClick={() => deleteRequest()}
                                />
                              )}
                            </Box>
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow className="withdrawalInfo" key={`_${index}`}>
                        <TableCell sx={{ padding: '0 8px', width: '175px' }}>
                          {data?.error?.requestDate && <p className="msg">{data?.error?.requestDate}</p>}
                        </TableCell>
                        <TableCell sx={{ padding: '0 8px', width: '175px' }}>
                          {data?.error?.withdrawalDate && <p className="msg">{data?.error?.withdrawalDate}</p>}
                        </TableCell>
                        <TableCell sx={{ padding: '0 8px', width: '160px' }}>
                          {data?.error?.amount && <p className="msg">{data?.error?.amount}</p>}
                        </TableCell>
                        <TableCell sx={{ padding: '0 8px', width: '240px' }}>
                          {data?.error?.comment && <p className="msg">{data?.error?.comment}</p>}
                        </TableCell>
                        <TableCell sx={{ padding: 0 }}></TableCell>
                      </TableRow>
                    </>
                  )
                )}
              </TableBody>
            ) : null}
          </Table>
          {editWithdrawalDetails.length === 0 && (
            <Typography sx={{ padding: '10px 0', textAlign: 'center' }}>No Record found</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', padding: '40px 0 28px' }}>
        <Button
          variant="contained"
          sx={{
            height: '50px',
            width: '40%',
            lineHeight: '21.11px',
            background: '#fff',
            border: '1px solid #00E2D6',
            ':hover': {
              background: '#f4f4f4'
            }
          }}
          onClick={() => {
            setOpen(false);
          }}
        >
          Back
        </Button>
        <Button
          disabled={!!editWithdrawalDetails.find((item) => item.edit)}
          variant="contained"
          style={{
            height: '50px',
            width: '40%',
            lineHeight: '21.11px',
            marginLeft: '40px'
          }}
          onClick={addNewWithdrawalRequest}
        >
          Add new withdrawal request
        </Button>
      </DialogActions>
    </Dialog>
  );
}
