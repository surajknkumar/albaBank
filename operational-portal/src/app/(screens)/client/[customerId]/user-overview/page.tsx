'use client';
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextareaAutosize,
  Typography
} from '@mui/material';
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import { ShortInfo } from '@app/components/short-info';
import styles from './page.module.css';
import { useAppDispatch, useAppSelector } from '@app/store/redux/hooks';
import {
  getAddNoteStatus,
  getClientDetails,
  getPermissionsMapping,
  getSaveWithdrawalRequestStatus,
  getWithdrawalErrorMessage
} from '@app/store/redux/selectors';
import { EditMarketingPreferences } from './edit-marketing-preferences';
import AddPOA from '@app/components/add-poa';
import { clientsNotes, setAlertDetails, updateAndGetClientNotes } from '@app/store/client.store';
import { usePathname } from 'next/navigation';
import { ACCOUNT_STATUS, WITHDRAWAL_ACTION } from '@app/models/enum/client.enum';
import { AccountDetails } from '@app/models/interfaces/clients.interface';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { EDIT, STATE_ACTIVE, STATE_APPROVED, STATE_CLOSED, STATE_MATURED, STATE_REFERRED } from '@svgs';
import { WithdrawalRequest } from './withdrawal-request';
import WithdrawalInfo from '@app/components/withdrawal-info';
import { clearSaveRequestStatus, setErrorMessage } from '@app/store/withdrawal.store';

export default function UserOverview({ params }: { params: { slug: string } }) {
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  const [isMPEdit, setIsMPEdit] = useState(false);
  const [note, setNote] = useState('');
  const addNoteStatus = useAppSelector(getAddNoteStatus);
  const clientDetails = useAppSelector(getClientDetails);
  const { personalInfo, contactDetails, generalDetails } = clientDetails;
  const [showPOADialog, setShowPOADialog] = useState(false);
  const [showNoteHistory, setShowNoteHistory] = useState(false);
  const [showWithdrawalInfoDialog, setShowWithdrawalInfoDialog] = useState(false);
  const [marketingPreferences, setMarketingPreferences] = useState<string[]>([]);
  const [accountId, setAccountId] = useState('');
  const [noticeDays, setNoticeDays] = useState(0);
  const [isWRShow, setIsWRShow] = useState(false);
  const permissions = useAppSelector(getPermissionsMapping);
  const saveRequestStatus = useAppSelector(getSaveWithdrawalRequestStatus);
  const withdrawalErrorMessage = useAppSelector(getWithdrawalErrorMessage);

  const accountStatus = {
    [ACCOUNT_STATUS.APPROVED]: STATE_APPROVED,
    [ACCOUNT_STATUS.ACTIVE]: STATE_ACTIVE,
    [ACCOUNT_STATUS.CLOSED]: STATE_CLOSED,
    [ACCOUNT_STATUS.REFERRED]: STATE_REFERRED,
    [ACCOUNT_STATUS.DORMANT]: STATE_CLOSED,
    [ACCOUNT_STATUS.MATURED]: STATE_MATURED,
    [ACCOUNT_STATUS.LOCKED]: STATE_CLOSED,
    [ACCOUNT_STATUS.CLOSED_WITHDRAWN]: STATE_CLOSED
  };
  const showToaster = (severity: string, message: string) => {
    dispatch(
      setAlertDetails({
        open: true,
        severity,
        message
      })
    );
  };
  useEffect(() => {
    if (saveRequestStatus === 'success') {
      setIsWRShow(false);
      showToaster('success', 'Your request has been successfully submitted.');
      dispatch(clearSaveRequestStatus());
    }
  }, [saveRequestStatus]);

  useEffect(() => {
    if (withdrawalErrorMessage) {
      showToaster('error', withdrawalErrorMessage);
      dispatch(setErrorMessage(''));
    }
  }, [withdrawalErrorMessage]);

  useEffect(() => {
    dispatch(clientsNotes({ customerId: pathName?.slice(1).split('/')[1] }));
  }, []);

  useEffect(() => {
    if (addNoteStatus === 'success') {
      setNote('');
      Swal.fire({
        title: 'Note added successfully',
        icon: 'success',
        confirmButtonText: 'Ok',
        reverseButtons: true
      });
    }
  }, [addNoteStatus]);

  useEffect(() => {
    const { contactByEmail, contactByPhone, contactByPost } = clientDetails.marketingPreferences;
    let prefs = [];
    if (contactByEmail) prefs.push('Email');
    if (contactByPhone) prefs.push('Mobile');
    if (contactByPost) prefs.push('Post');
    setMarketingPreferences(prefs);
  }, [clientDetails.marketingPreferences]);

  const viewOrWithdrawRequest = (action: WITHDRAWAL_ACTION, accountId: string, noticeDays: number) => {
    setAccountId(accountId);
    setNoticeDays(noticeDays);
    if (action === WITHDRAWAL_ACTION.CREATE) {
      setIsWRShow(true);
    } else {
      setShowWithdrawalInfoDialog(true);
    }
  };

  const addNote = () => {
    note.replaceAll(/\s/g, '').length >= 10
      ? dispatch(updateAndGetClientNotes({ customerId: pathName?.slice(1).split('/')[1], note }))
      : showToaster('error', 'Note should contain at least 10 characters');
  };

  return (
    <Box sx={{ paddingBottom: 5 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          border: '1px solid #221C351A',
          margin: '38px 45px 28px'
        }}
      >
        <ShortInfo />
      </Box>
      <Box sx={{ display: 'flex', background: '#221C35', position: 'sticky', top: '0px' }}>
        <Typography
          sx={{
            fontSize: '16px',
            lineHeight: '20px',
            fontWeight: 500,
            width: '260px',
            textTransform: 'uppercase',
            color: '#fff',
            padding: '24px 50px 20px',
            borderBottom: '5px solid #00E2D6'
          }}
        >
          User Overview
        </Typography>
      </Box>
      <Table>
        <TableHead sx={{ background: '#f4f4f4' }}>
          <TableRow>
            <TableCell>Account Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell sx={{ minWidth: '110px' }}>Maturity Date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>State</TableCell>
            {permissions && permissions.includes('EDIT_WITHDRAWAL_REQUEST') && <TableCell>Action</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {clientDetails.accounts?.map((account: AccountDetails, index: number) => (
            <TableRow key={index}>
              <TableCell>
                {account.name} - {account.accountId}
              </TableCell>
              <TableCell>{account.type}</TableCell>
              <TableCell>
                {account.maturityDate || <Typography sx={{ textAlign: 'center', fontWeight: 300 }}>-</Typography>}
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>£ {account.amount}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Image height={14} width={14} src={accountStatus[account.state]} alt="STATUS VERIFIED" priority />
                  <Typography sx={{ marginLeft: '4px', fontSize: '14px', lineHeight: '18px', fontWeight: 300 }}>
                    {account.state}
                  </Typography>
                </Box>
              </TableCell>
              {permissions && permissions.includes('EDIT_WITHDRAWAL_REQUEST') && (
                <TableCell>
                  {account.actions &&
                    account.actions.map((action: WITHDRAWAL_ACTION, index: number) => (
                      <Typography
                        key={index}
                        sx={{
                          padding: '3px 5px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          lineHeight: '18px',
                          whiteSpace: 'nowrap',
                          textAlign: 'center',
                          background: `${action === WITHDRAWAL_ACTION.VIEW ? '#F7D2D1' : '#DFE3FD'}`,
                          cursor: 'pointer'
                        }}
                        onClick={() => viewOrWithdrawRequest(action, account.accountId, account.noticeDays)}
                      >
                        {action === WITHDRAWAL_ACTION.VIEW ? 'View Withdrawal Info' : 'Withdrawal Request'}
                      </Typography>
                    ))}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ margin: '24px 45px 20px 30px' }}>
        <Typography sx={{ fontSize: '18px', lineHeight: '18px', fontWeight: 500, padding: '20px 0' }}>
          General Details
        </Typography>
        <Box className={styles.details}>
          <Grid container>
            <Grid item xs={12} md={6} className={styles.field}>
              <Typography className={styles.fieldName}>ID</Typography>
              <Typography className={styles.colon}>:</Typography>
              <Typography className={styles.fieldValue}>{personalInfo?.customerId}</Typography>
            </Grid>
            <Grid item xs={12} md={6} className={styles.field}>
              <Typography className={styles.fieldName}>Client state</Typography>
              <Typography className={styles.colon}>:</Typography>
              <Typography className={styles.fieldValue}>{generalDetails?.clientState}</Typography>
            </Grid>
            <Grid item xs={12} md={6} className={styles.field}>
              <Typography className={styles.fieldName}>Created</Typography>
              <Typography className={styles.colon}>:</Typography>
              <Typography className={styles.fieldValue}>{generalDetails?.createdDate || '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={6} className={styles.field}>
              <Typography className={styles.fieldName}>Approved date</Typography>
              <Typography className={styles.colon}>:</Typography>
              <Typography className={styles.fieldValue}>{generalDetails?.approvedDate || '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={6} className={styles.field}>
              <Typography className={styles.fieldName}>Last modified</Typography>
              <Typography className={styles.colon}>:</Typography>
              <Typography className={styles.fieldValue}>{generalDetails?.lastModifiedDate || '-'}</Typography>
            </Grid>
            <Grid item xs={12} md={6} className={styles.field}>
              <Typography className={styles.fieldName}>Activation date</Typography>
              <Typography className={styles.colon}>:</Typography>
              <Typography className={styles.fieldValue}>{generalDetails?.activationDate || '-'}</Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box sx={{ margin: '24px 45px 20px 30px' }}>
        <Typography sx={{ fontSize: '18px', lineHeight: '18px', fontWeight: 500, padding: '20px 0' }}>
          Personal & Contact Details
        </Typography>
        <Box className={styles.details}>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Box className={styles.field}>
                <Typography className={styles.fieldName}>Birth date</Typography>
                <Typography className={styles.colon}>:</Typography>
                <Typography className={styles.fieldValue}>{personalInfo?.dob}</Typography>
              </Box>
              <Box className={styles.field}>
                <Typography className={styles.fieldName}>Mobile number</Typography>
                <Typography className={styles.colon}>:</Typography>
                <Typography className={styles.fieldValue}>{contactDetails?.mobileNumber}</Typography>
              </Box>
              <Box className={styles.field}>
                <Typography className={styles.fieldName}>Email ID</Typography>
                <Typography className={styles.colon}>:</Typography>
                <Typography className={styles.fieldValue}>{contactDetails?.emailId}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              {contactDetails?.addresses.map(
                (address: string, index: number) =>
                  index < 2 && (
                    <Box key={index} className={styles.field}>
                      <Typography className={styles.fieldName}>Address {index + 1}</Typography>
                      <Typography className={styles.colon}>:</Typography>
                      <Typography className={styles.fieldValue}>{address}</Typography>
                    </Box>
                  )
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box sx={{ margin: '24px 45px 20px 30px' }}>
        <Typography sx={{ fontSize: '18px', lineHeight: '18px', fontWeight: 500, padding: '20px 0' }}>
          Marketing Preferences
        </Typography>
        <Box className={styles.details}>
          <Grid container>
            <Grid item xs={12} className={styles.field}>
              <Typography className={styles.fieldName}>Marketing Preferences</Typography>
              <Typography className={styles.colon}>:</Typography>
              <Typography className={styles.fieldValue}>
                {marketingPreferences.reduce((prev: string, cur: string) => (prev ? prev + ', ' : '') + cur, '') ||
                  'None'}
              </Typography>
              <Image
                height={17}
                width={17}
                src={EDIT}
                alt="Edit"
                priority
                onClick={() => setIsMPEdit(false)}
                style={{ cursor: 'pointer', marginLeft: '20px' }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/* <Box sx={{ margin: '24px 45px 20px 30px' }}>
        <Box sx={{ display: 'flex', padding: '20px 0', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '18px', lineHeight: '18px', fontWeight: 500, marginRight: '20px' }}>
            Power of Attorney
          </Typography>
          <Image
            height={17}
            width={17}
            src={EDIT}
            alt="Edit"
            priority
            onClick={() => setShowPOADialog(true)}
            style={{ cursor: 'pointer' }}
          />
        </Box>
        <Box className={styles.details}>
          <Grid container>
            {clientDetails.poaDetails || true ? (
              <React.Fragment>
                <Grid item xs={12} md={6} className={styles.field}>
                  <Typography className={styles.fieldName}>Name</Typography>
                  <Typography className={styles.colon}>:</Typography>
                  <Typography className={styles.fieldValue}>{clientDetails.poaDetails.address.line1}</Typography>
                </Grid>
                <Grid item xs={12} md={6} className={styles.field}>
                  <Typography className={styles.fieldName}>Email ID</Typography>
                  <Typography className={styles.colon}>:</Typography>
                  <Typography className={styles.fieldValue}>{clientDetails.poaDetails.emailId}</Typography>
                </Grid>
                <Grid item xs={12} md={6} className={styles.field}>
                  <Typography className={styles.fieldName}>Birth date</Typography>
                  <Typography className={styles.colon}>:</Typography>
                  <Typography className={styles.fieldValue}>{clientDetails.poaDetails.dob}</Typography>
                </Grid>
                <Grid item xs={12} md={6} className={styles.field}>
                  <Typography className={styles.fieldName}>Address</Typography>
                  <Typography className={styles.colon}>:</Typography>
                  <Typography className={styles.fieldValue}>{clientDetails.poaDetails.address}</Typography>
                </Grid>
                <Grid item xs={12} md={6} className={styles.field}>
                  <Typography className={styles.fieldName}>Mobile number</Typography>
                  <Typography className={styles.colon}>:</Typography>
                  <Typography className={styles.fieldValue}>{clientDetails.poaDetails.mobileNumber}</Typography>
                </Grid>
              </React.Fragment>
            ) : (
              <Grid item xs={12} className={styles.field} sx={{ justifyContent: 'space-between' }}>
                <Typography className={styles.fieldName}>No details found</Typography>
                <Typography className={styles.textButton} onClick={() => setShowPOADialog(true)}>
                  Add POA
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box> */}
      <Box sx={{ margin: '24px 45px 20px 30px', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', marginRight: '20px' }}>
          <Typography sx={{ fontSize: '18px', lineHeight: '18px', fontWeight: 500 }}>Notes</Typography>
          {clientDetails.notesHistory.length > 0 && (
            <Typography className={styles.textButton} onClick={() => setShowNoteHistory(!showNoteHistory)}>
              {showNoteHistory ? 'Hide' : 'Show'} Notes History
            </Typography>
          )}
        </Box>
        {showNoteHistory && (
          <>
            <Box
              sx={{
                borderRadius: 0,
                height: '64px',
                padding: '24px 42px 20px',
                background: '#474545',
                boxSizing: 'border-box'
              }}
            >
              <Typography sx={{ fontSize: '18px', lineHeight: '20px', color: '#fff' }}>Note History</Typography>
            </Box>
            <Table
              sx={{
                '.MuiTableRow-root': {
                  border: 'none'
                },
                '.MuiTableCell-root:first-of-type': {
                  paddingLeft: '92px'
                }
              }}
            >
              <TableHead sx={{ background: 'rgba(71, 69, 69, 0.30)', height: '40px' }}>
                <TableRow>
                  <TableCell width="30%">Date & Time</TableCell>
                  <TableCell>Agent Name</TableCell>
                  <TableCell width="50%">Note</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientDetails.notesHistory.map((note, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontSize: '16px', fontWeight: '500' }}>{note.createdAt}</TableCell>
                    <TableCell sx={{ fontSize: '16px', fontWeight: '500' }}>{note.agentName}</TableCell>
                    <TableCell>{note.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
        <TextareaAutosize
          onInput={(e: BaseSyntheticEvent) => setNote(e.target.value)}
          value={note}
          className={styles.noteBox}
          placeholder="Add your notes here"
        />
        <Button
          variant="contained"
          sx={{
            height: 50,
            width: 210,
            textAlign: 'right',
            marginTop: '20px',
            alignSelf: 'flex-end'
          }}
          onClick={addNote}
        >
          Add Note
        </Button>
      </Box>
      <EditMarketingPreferences open={isMPEdit} setOpen={setIsMPEdit} customerId={params}></EditMarketingPreferences>
      {isWRShow && (
        <WithdrawalRequest setOpen={setIsWRShow} accountId={accountId} noticeDays={noticeDays || 0}></WithdrawalRequest>
      )}
      <AddPOA open={showPOADialog} setOpen={(isOpen) => setShowPOADialog(isOpen)} />
      {showWithdrawalInfoDialog && (
        <WithdrawalInfo
          open={showWithdrawalInfoDialog}
          setOpen={(isOpen) => setShowWithdrawalInfoDialog(isOpen)}
          accountId={accountId}
          noticeDays={noticeDays || 0}
          title={'Withdrawal Information.'}
        ></WithdrawalInfo>
      )}
    </Box>
  );
}
