'use client';
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Stack,
  InputAdornment,
  Button
} from '@mui/material';
import { SEARCH, SUN_WITH_FACE } from '@svgs';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ClientSearchDetails, SearchDisplayItems } from './models/interfaces/clients.interface';
import { clearClientStore, searchClient, setAlertDetails, setClientList, setSelectedClient } from '@store';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from './store/redux/hooks';
import { getLoading, getClientList } from './store/redux/selectors';
import { SEARCH_BY_LIST } from '@utils/constants';
import { RenderClientList } from '@components';
import { RegExpCheck, getSearchByValue } from '@utils/helpers';

export default function Home() {
  const dispatch = useAppDispatch();
  const [searchBy, setSearchBy] = useState('mobile_number');
  const { push } = useRouter();
  const [listContain, setListContain] = useState<SearchDisplayItems>({
    first: 'mobileNumber',
    second: 'name'
  });

  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const [secondSelectedSuggestion, setSecondSelectedSuggestion] = useState('');
  const getSearchSuggestion = useAppSelector(getClientList);
  const getShowLoader = useAppSelector(getLoading);
  const [searchSuggestion, setSearchSuggestion] = useState<ClientSearchDetails[]>([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    setShowList(!getShowLoader);
    setSearchSuggestion(getSearchSuggestion);
  }, [getSearchSuggestion, getShowLoader]);

  useEffect(() => {
    dispatch(clearClientStore());
  }, []);

  useEffect(() => {
    setShowList(!getShowLoader);
  }, [getShowLoader]);

  const handleKeyPress = (event: { key: string }) => {
    if (event.key === 'Enter') {
      getSearchSuggestionData(searchBy, selectedSuggestion, secondSelectedSuggestion);
    }
  };
  function onInputChange(value: string): void {
    setSelectedSuggestion(value);
    const data = getSearchSuggestion.filter((element) => JSON.stringify(element).includes(value));
    setSearchSuggestion(selectedSuggestion.length == 0 ? [] : data);
    if (selectedSuggestion.length === 0) {
      setShowList(false);
    }
  }

  useEffect(() => {
    setListContain(getSearchByValue(searchBy));
  }, [searchBy]);

  const getSearchSuggestionData = (searchBy: string, selectedSuggestion: string, secondSelectedSuggestion: string) => {
    const firstSearchText = selectedSuggestion.replaceAll(/\s/g, '');
    const secondSearchText = secondSelectedSuggestion.replaceAll(/\s/g, '');
    if (searchBy === 'name') {
      if (firstSearchText.length === 0 && secondSearchText.length === 0) {
        return;
      }
    }
    if (
      (firstSearchText.length > 2 && RegExpCheck(firstSearchText)) ||
      (secondSearchText.length > 2 && RegExpCheck(secondSearchText))
    ) {
      dispatch(
        searchClient({
          searchParam: searchBy,
          value:
            searchBy === 'name'
              ? encodeURIComponent(JSON.stringify({ firstName: firstSearchText, lastName: secondSearchText }))
              : firstSearchText
        })
      );
    } else {
      dispatch(
        setAlertDetails({
          open: true,
          severity: 'error',
          message: 'Minimum length should be 3 for search.'
        })
      );
    }
  };

  const getClientDetails = async (data: ClientSearchDetails) => {
    onInputChange(data[listContain.first]);
    setSelectedSuggestion(data[listContain.first]);
    dispatch(setSelectedClient(data));
    push(`client/${data.customerId}/user-overview`);
  };

  return (
    <main>
      <Box
        sx={{
          fontSize: '28px',
          fontWeight: 700,
          fontFamily: 'Merriweather',
          textAlign: 'left',
          margin: 5,
          height: '50px',
          borderRadius: '15px',
          background: '#00E2D6',
          padding: '30px',
          display: 'flex',
          justifyItems: 'center',
          alignItems: 'center'
        }}
      >
        Welcome to Alba Bank Operations Portal{'  '}
        <Image style={{ marginLeft: '10px' }} height={40} width={40} src={SUN_WITH_FACE} alt="SUN WITH FACE" priority />
      </Box>
      <Box
        sx={{
          fontSize: '21px',
          fontWeight: 700,
          textAlign: 'left',
          height: '30px',
          background: '#F4F4F4',
          fontFamily: 'Merriweather',
          paddingX: '45px',
          paddingY: '20px'
        }}
      >
        Search User
      </Box>
      <Box
        sx={{
          float: 'inline-start',
          margin: 5,
          '&:MuiTypographyRoot': {
            fontFamily: 'Work Sans'
          }
        }}
      >
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            defaultValue="mobile_number"
            value={searchBy}
            onChange={(event) => {
              setSearchBy((event.target as HTMLInputElement).value);
              searchSuggestion.length > 0 && dispatch(setClientList([]));
              setSecondSelectedSuggestion('');
              setSelectedSuggestion('');
            }}
          >
            {SEARCH_BY_LIST.map((search, index) => (
              <FormControlLabel
                key={index}
                value={search.value}
                control={<Radio />}
                label={search.label}
                sx={{
                  backgroundColor: searchBy === search.value ? '#E4F4F3' : '',
                  border: '1px solid #221C351A',
                  borderRadius: '5px',
                  paddingRight: '10px',
                  margin: 0,
                  marginRight: 1
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <Stack spacing={{ xs: 1, sm: 2 }} sx={{ marginTop: 3 }} direction="row" useFlexGap flexWrap="wrap">
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Image height={20} width={20} src={SEARCH} alt="SEARCH" priority />
                </InputAdornment>
              )
            }}
            placeholder={searchBy === 'name' ? 'First Name' : 'Search'}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyUp={handleKeyPress}
            sx={{
              width: searchBy === 'name' ? '242px' : '500px',
              border: '1px solid #7D7D7D',
              borderRadius: '6px',
              boxSizing: 'border-box',
              '.MuiInputBase-root': {
                lineHeight: '20px',
                height: '50px',
                padding: '15px 20px'
              }
            }}
            value={selectedSuggestion}
          ></TextField>
          {searchBy === 'name' && (
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Image height={20} width={20} src={SEARCH} alt="SEARCH" priority />
                  </InputAdornment>
                )
              }}
              placeholder="Last Name"
              onChange={(event) => setSecondSelectedSuggestion(event.target.value)}
              onKeyUp={handleKeyPress}
              sx={{
                width: '242px',
                border: '1px solid #7D7D7D',
                borderRadius: '6px',
                boxSizing: 'border-box',
                '.MuiInputBase-root': {
                  lineHeight: '20px',
                  height: '50px',
                  padding: '15px 20px'
                }
              }}
              value={secondSelectedSuggestion}
            ></TextField>
          )}
          <Button
            variant="contained"
            sx={{
              height: 50,
              width: 130
            }}
            onClick={() => getSearchSuggestionData(searchBy, selectedSuggestion, secondSelectedSuggestion)}
          >
            Search
          </Button>
        </Stack>
        {(selectedSuggestion.length != 0 || secondSelectedSuggestion.length != 0) && showList && (
          <Stack spacing={{ xs: 1, sm: 2 }} sx={{ marginTop: 2 }}>
            <Box sx={{ textAlign: 'left' }}>Search List</Box>
            <Box
              sx={{
                maxHeight: 400,
                border: '1px solid #7D7D7D',
                color: '#7D7D7D',
                borderRadius: 1,
                overflow: 'scroll',
                zIndex: 1
              }}
            >
              <RenderClientList
                data={searchSuggestion}
                callBackFunction={(data) => getClientDetails(data)}
                listContain={listContain}
              />
            </Box>
          </Stack>
        )}
      </Box>
    </main>
  );
}
