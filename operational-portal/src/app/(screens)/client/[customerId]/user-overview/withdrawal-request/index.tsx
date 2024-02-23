'use client';
import { Box, FormControl, FormGroup, FormLabel, Input, InputAdornment, TextField } from '@mui/material';
import React, { BaseSyntheticEvent, useState } from 'react';
import { AppModal } from '@app/components/pop-up';
import { useAppDispatch, useAppSelector } from '@app/store/redux/hooks';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { WithdrawalDetail } from '@app/models/interfaces/withdrawal.interface';
import { createAndGetWithdrawalRequest } from '@app/store';
import { usePathname } from 'next/navigation';
import { formatDate, getOffsetDate } from '@app/utils/helpers';
import { getWithdrawalConfig } from '@app/store/redux/selectors';

interface EditWithdrawalRequestProps {
  setOpen: (isOpen: boolean) => void;
  accountId: string;
  noticeDays: number;
}

export function WithdrawalRequest({ setOpen, accountId, noticeDays }: EditWithdrawalRequestProps) {
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  const initialValue = {
    requestDate: '',
    withdrawalDate: '',
    comment: '',
    amount: '',
    withdrawalRequestId: ''
  };
  const [data, setData] = useState<WithdrawalDetail>({ ...initialValue });
  const [errors, setErrors] = useState<any>({});
  const [openCalendarWR, setOpenCalendarWR] = useState(false);
  const [openCalendar, setOpenCalender] = useState(false);
  const config = useAppSelector(getWithdrawalConfig);

  const callBackFunction = () => {
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
    setErrors({
      ...tmpWithdrawalAmount,
      ...tmpWithdrawalComment,
      ...tmpWithdrawalDate,
      ...tmpWithdrawalRequestDate
    });
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
      dispatch(
        createAndGetWithdrawalRequest({ accountId, req: request, customerId: pathName?.slice(1).split('/')[1] })
      );
    }
  };

  const handleChange = (key: keyof WithdrawalDetail, value: any) => {
    setData({
      ...data,
      [key]: value,
      withdrawalDate:
        key === 'requestDate'
          ? getOffsetDate(value, noticeDays)
          : key === 'withdrawalDate'
            ? value
            : data.withdrawalDate
    });
  };

  return (
    <AppModal
      isCloseButton={true}
      callBack={() => callBackFunction()}
      ButtonName={'Submit'}
      open={true}
      setOpen={setOpen}
      title={'Withdrawal Request'}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', padding: 3 }}>
        <FormGroup>
          <FormControl fullWidth variant="standard" required className={errors.requestDate ? 'error' : ''}>
            <FormLabel className="label" htmlFor="requestDate">
              Withdrawal Request Date
            </FormLabel>
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
                  width: '50%',
                  background: '#f4f4f4',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                  paddingLeft: '16px',
                  marginTop: 1,
                  height: '40px',
                  borderRadius: 1,
                  input: {
                    fontSize: '14px',
                    fontWeight: '300'
                  }
                }}
                value={dayjs(data.requestDate)}
                onChange={(val) => handleChange('requestDate', val?.format('MM-DD-YYYY'))}
              />
            </LocalizationProvider>
            {errors.requestDate && <p className="msg">{errors.requestDate}</p>}
          </FormControl>
          <FormControl fullWidth variant="standard" required className={errors.withdrawalDate ? 'error' : ''}>
            <FormLabel className="label" htmlFor="withdrawalDate">
              Withdrawal Date
            </FormLabel>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                className="input"
                minDate={dayjs(getOffsetDate(new Date(), -1 * (config?.withdrawalDateLeftOffset || 0)))}
                maxDate={dayjs(getOffsetDate(new Date(), config?.withdrawalDateRightOffset || 0))}
                format="DD-MM-YYYY"
                open={openCalendar}
                onClose={() => setOpenCalender(false)}
                slotProps={{
                  textField: {
                    onClick: () => setOpenCalender(true)
                  }
                }}
                sx={{
                  width: '50%',
                  background: '#f4f4f4',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                  paddingLeft: '16px',
                  marginTop: 1,
                  height: '40px',
                  borderRadius: 1,
                  input: {
                    fontSize: '14px',
                    fontWeight: '300'
                  }
                }}
                value={dayjs(data.withdrawalDate)}
                onChange={(val) => handleChange('withdrawalDate', val?.format('MM-DD-YYYY'))}
              />
            </LocalizationProvider>
            {errors.withdrawalDate && <p className="msg">{errors.withdrawalDate}</p>}
          </FormControl>
          <FormControl fullWidth variant="standard" required className={errors.amount ? 'error' : ''}>
            <FormLabel className="label" htmlFor="amount">
              Withdrawal Amount
            </FormLabel>
            <Input
              type="number"
              required={true}
              error
              name="amount"
              value={data.amount}
              disableUnderline
              className="input"
              id="amount"
              style={{ width: '50%', height: '40px', borderRadius: 1, fontSize: '14px', fontWeight: '300' }}
              onInput={(e: BaseSyntheticEvent) => handleChange('amount', e.target.value)}
              placeholder="Amount"
              startAdornment={<InputAdornment position="start">£</InputAdornment>}
            />
            {errors.amount && <p className="msg">{errors.amount}</p>}
          </FormControl>
          <FormControl fullWidth variant="standard" required className={errors.comment ? 'error' : ''}>
            <FormLabel className="label" htmlFor="comment">
              Withdrawal Comment
            </FormLabel>
            <TextField
              id="comment"
              multiline
              inputProps={{
                style: {
                  width: '600px',
                  height: '120px',
                  fontSize: '14px',
                  fontWeight: '300',
                  padding: '10px',
                  margin: '0 -14px',
                  border: `1px solid ${errors.comment ? '#eb0000' : '#F4F4F4'}`,
                  background: `${errors.comment ? '#fdf7f8' : '#F4F4F4'}`
                }
              }}
              value={data.comment}
              placeholder="Add your comments here"
              onInput={(e: BaseSyntheticEvent) => handleChange('comment', e.target.value)}
            ></TextField>
            {errors.comment && <p className="msg">{errors.comment}</p>}
          </FormControl>
        </FormGroup>
      </Box>
    </AppModal>
  );
}
