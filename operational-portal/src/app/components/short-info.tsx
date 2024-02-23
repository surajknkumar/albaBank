'use client';
import React from 'react';
import Box from '@mui/material/Box';
import { useAppSelector } from '../store/redux/hooks';
import { getClientDetails } from '../store/redux/selectors';
import Image from 'next/image';
import { PHONE_CALL } from '@svgs';
import { Tag } from '@app/models/interfaces/clients.interface';
import { Typography } from '@mui/material';

enum TagColor {
  'deceased' = '#0085FF',
  'dormancy' = '#FF9900',
  'fraud' = '#FF0000',
  'vulnerability' = '#E44DBD'
}

export function ShortInfo() {
  const clientDetails = useAppSelector(getClientDetails);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '30px 28px 28px 20px',
        borderBottom: '1px dotted #221C351A',
        fontWeight: '300'
      }}
    >
      <Box
        sx={{
          height: 64,
          width: 64,
          backgroundColor: '#EFEFEF',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexShrink: '0',
          fontFamily: 'Merriweather',
          fontSize: '28px'
        }}
      >
        {clientDetails?.personalInfo.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase()}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginLeft: '22px',
          fontFamily: 'Work Sans',
          width: '100%'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '28px', lineHeight: '34px' }}>
              {clientDetails?.personalInfo.name
                .split(' ')
                .map((str: string) => str.charAt(0).toUpperCase() + str.slice(1))
                .join(' ')}
            </Typography>
            {clientDetails.tags?.map((tag: Tag, index: number) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginLeft: '35px' }}>
                <Box
                  sx={{
                    height: 18,
                    width: 18,
                    backgroundColor: TagColor[tag.type],
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                ></Box>
                <Box sx={{ paddingLeft: 1, fontSize: '16px', fontWeight: 300, lineHeight: '24px' }}>
                  {tag.displayValue}
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ fontSize: '16px', fontWeight: 300, lineHeight: '24px', whiteSpace: 'nowrap', marginLeft: '35px' }}>
            User since: {clientDetails.userSince}
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '6px'
          }}
        >
          <Image height={20} width={20} src={PHONE_CALL} alt="alba Logo" priority />
          <Box sx={{ paddingLeft: 1, fontSize: '18px', fontWeight: 300, lineHeight: '24px' }}>
            {clientDetails?.contactDetails.mobileNumber}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
