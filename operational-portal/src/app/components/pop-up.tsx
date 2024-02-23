'use client';
import React, { ReactNode } from 'react';
import { Box, Button, Modal } from '@mui/material';
import Image from 'next/image';
import { CANCEL_BUTTON, CLOSE_BUTTON } from '@svgs';

interface AppModalProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  isCloseButton?: boolean;
  title?: string;
  ButtonName?: string;
  callBack: () => void;
  children: ReactNode;
}

const style = {
  p: 2,
  top: '50%',
  left: '50%',
  minWidth: '600px',
  borderRadius: '10px',
  bgcolor: 'background.paper',
  position: 'absolute' as 'absolute',
  transform: 'translate(-50%, -50%)',
  outline: 'none'
};

export function AppModal({ open, setOpen, isCloseButton, title, ButtonName, callBack, children }: AppModalProps) {
  return (
    <Modal
      style={{ zIndex: 1 }}
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        outlineWidth: 0,
        overflow: 'scroll'
      }}
    >
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
          <Box sx={{ alignSelf: 'self-end' }}>
            <Image
              style={{ cursor: 'pointer' }}
              height={22}
              width={22}
              src={isCloseButton ? CANCEL_BUTTON : CLOSE_BUTTON}
              alt="CANCEL BUTTON"
              priority
              onClick={() => setOpen(false)}
            />
          </Box>
          {title && (
            <Box
              sx={{
                fontFamily: 'Merriweather',
                fontWeight: 700,
                fontSize: '28px',
                paddingX: 3
              }}
            >
              {title}
            </Box>
          )}
          <Box sx={{ minHeight: 200 }}>{children}</Box>
        </Box>
        <Box sx={{ textAlign: 'center', paddingBottom: '40px' }}>
          {ButtonName && (
            <Button
              variant="contained"
              sx={{
                height: '50px',
                minWidth: '400px',
                lineHeight: '21.11px'
              }}
              onClick={callBack}
            >
              {ButtonName}
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
