'use client';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { BALANCE_STATUS } from '@app/models/enum/client.enum';
import { WithdrawalRequestTaskData } from '@app/models/interfaces/withdrawal.interface';

interface ApproveWithdrawalProps {
  title: string;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  withdrawalDetails: WithdrawalRequestTaskData;
  authorise: () => void;
}

export default function ApproveWithdrawal({
  title,
  open,
  setOpen,
  withdrawalDetails,
  authorise
}: ApproveWithdrawalProps) {
  return (
    <Dialog
      open={open}
      onClose={(event, reason) => reason !== 'backdropClick' && reason !== 'escapeKeyDown' && setOpen(false)}
    >
      {title && (
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
      )}

      <DialogContent
        sx={{
          padding: '0 50px',
          boxSizing: 'border-box'
        }}
      >
        {withdrawalDetails ? (
          <>
            <Box sx={{ border: '1px solid rgba(34, 28, 53, 0.30)' }}>
              <Table>
                <TableHead sx={{ background: '#221C35', '.MuiTableCell-root': { color: '#fff' } }}>
                  <TableRow>
                    <TableCell>Customer Name / ID</TableCell>
                    <TableCell>Account Name</TableCell>
                    <TableCell>Balance</TableCell>
                    <TableCell>Maker</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {withdrawalDetails.customerName} {withdrawalDetails.customerId}
                    </TableCell>
                    <TableCell>{withdrawalDetails.accountName || '-'}</TableCell>
                    <TableCell>
                      {withdrawalDetails.balanceStatus === BALANCE_STATUS.LOADED ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography sx={{ fontSize: '14px', fontWeight: 500, marginRight: '1px' }}>£</Typography>
                          {withdrawalDetails.balance}
                        </Box>
                      ) : withdrawalDetails.balanceStatus === BALANCE_STATUS.LOADING ? (
                        <CircularProgress
                          sx={{ width: '18px !important', height: '18px !important', marginLeft: '10px' }}
                          color="inherit"
                        />
                      ) : (
                        withdrawalDetails.balance || '-'
                      )}
                    </TableCell>
                    <TableCell>{withdrawalDetails.maker || '-'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ border: '1px solid rgba(34, 28, 53, 0.30)', marginTop: '30px' }}>
              <Table>
                <TableHead sx={{ background: '#221C35', '.MuiTableCell-root': { color: '#fff' } }}>
                  <TableRow>
                    <TableCell>Withdrawal Request Date</TableCell>
                    <TableCell>Withdrawal Date</TableCell>
                    <TableCell>Withdrawal Amount</TableCell>
                    <TableCell sx={{ maxWidth: '200px' }}>Withdrawal Comment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{withdrawalDetails.withdrawalDate || '-'}</TableCell>
                    <TableCell>{withdrawalDetails.withdrawalDate || '-'}</TableCell>
                    <TableCell>£ {withdrawalDetails.withdrawalAmount || '0'} </TableCell>
                    <TableCell sx={{ maxWidth: '200px' }}>{withdrawalDetails.comment || '-'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </>
        ) : (
          <Box>No Record found</Box>
        )}
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
          onClick={() => setOpen(false)}
        >
          Back
        </Button>
        <Button
          variant="contained"
          style={{
            height: '50px',
            width: '40%',
            lineHeight: '21.11px',
            marginLeft: '40px'
          }}
          onClick={authorise}
        >
          Authorise
        </Button>
      </DialogActions>
    </Dialog>
  );
}
