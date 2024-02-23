'use client';
import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { Button, FormControl, InputAdornment, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { SEARCH_BY_LIST, SEARCH_VALUE_NAME } from '@utils/constants';
import { useAppDispatch, useAppSelector } from '@app/store/redux/hooks';
import {
  clearClientStore,
  fetchAuthDetails,
  searchClient,
  setAlertDetails,
  setClientList,
  setPermissionDetails,
  setSelectedClient
} from '@app/store';
import { getLoading, getClientList, getUserName } from '@app/store/redux/selectors';
import { ClientSearchDetails } from '@app/models/interfaces/clients.interface';
import { RenderClientList } from './render-client-list';
import Image from 'next/image';
import { SEARCH, V_CANCEL } from '@svgs';
import { RegExpCheck, getSearchByValue } from '@utils/helpers';
import authService from '@app/services/auth.service';

const styles = {
  textfield: {
    width: '375px',
    background: '#fff'
  }
};

export function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const effectRan = useRef(false);
  const [listContain, setListContain] = useState({
    first: 'mobileNumber',
    second: 'name'
  });
  const username = useAppSelector(getUserName);
  const [searchBy, setSearchBy] = useState('mobile_number');
  const searchByList = SEARCH_BY_LIST;
  const getSearchSuggestion = useAppSelector(getClientList);
  const [searchSuggestion, setSearchSuggestion] = useState<ClientSearchDetails[]>([]);
  const getShowLoader = useAppSelector(getLoading);
  const pathName = usePathname();
  const [searchText1, setSearchText1] = useState('');
  const [searchText2, setSearchText2] = useState('');
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    if (!effectRan.current) dispatch(fetchAuthDetails());
    if (window.location.hostname !== 'localhost') setInterval(authService.refreshToken, 3000000); // 50 min
    return () => {
      effectRan.current = true;
    };
  }, []);

  useEffect(() => {
    dispatch(setPermissionDetails(localStorage.getItem('permission')));
    localStorage.removeItem('permission');
  }, []);

  useEffect(() => {
    if (!pathName?.startsWith('/client')) {
      setSearchText1('');
      setSearchText2('');
    }
  }, []);

  useEffect(() => {
    setSearchSuggestion(getSearchSuggestion);
  }, [getSearchSuggestion]);

  useEffect(() => {
    setListContain(getSearchByValue(searchBy));
  }, [searchBy]);

  const handleKeyPress = (event: { key: string }) => {
    if (event.key === 'Enter') {
      getSearchSuggestionData(searchBy, searchText1, searchText2);
    }
  };

  const onInputChange = (searchText1: boolean, value: string): void => {
    searchText1 ? setSearchText1(value) : setSearchText2(value);
    filterSuggestionData(value);
  };

  function filterSuggestionData(value: string): void {
    const data = getSearchSuggestion.filter((element: any) => JSON.stringify(element).includes(value));
    setSearchSuggestion(searchText1.length == 0 ? [] : data);
    if (searchText1.length === 0) {
      setShowList(false);
    }
  }
  const getAdminDetails = (data: ClientSearchDetails) => {
    setShowList(false);
    dispatch(clearClientStore());
    dispatch(setSelectedClient(data));
    setSearchText1('');
    setSearchText2('');
    router.replace(`/client/${data.customerId}/user-overview`);
  };

  const getAgentSignature = (name: string = '') => {
    const parts = name.split(' ');
    return parts[0][0] + parts[parts.length - 1][0];
  };
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
      setShowList(true);
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
  return (
    <Box
      id="header"
      sx={{
        height: { xs: '40px' },
        backgroundColor: '#e4f4f3',
        paddingX: 5,
        paddingY: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Box>
        {pathName?.startsWith('/client') && (
          <>
            <Box
              sx={{
                minWidth: 220,
                display: 'flex',
                flexDirection: 'row'
              }}
            >
              <Box sx={{ display: 'flex', borderRadius: '6px', border: '0.3px solid #7D7D7D', overflow: 'hidden' }}>
                <FormControl
                  fullWidth
                  sx={{
                    background: '#EFEFEF',
                    width: searchBy === 'name' ? '245px' : '200px',
                    borderRight: '0.3px solid #7D7D7D'
                  }}
                >
                  <Select
                    sx={{
                      height: '40px',
                      '.MuiSelect-select': {
                        fontWeight: 500,
                        fontSize: '18px',
                        lineHeight: '20px',
                        minHeight: 'auto !important',
                        padding: '10px 16px 10px 14px'
                      }
                    }}
                    value={searchBy}
                    onChange={(e) => {
                      setSearchText1('');
                      setSearchText2('');
                      setSearchBy(e.target.value);
                      searchSuggestion.length > 0 && dispatch(setClientList([]));
                    }}
                  >
                    {searchByList.map((e, index) => (
                      <MenuItem key={index} value={e.value}>
                        {e.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  style={{ ...styles.textfield, width: searchBy === 'name' ? '260px' : '375px' }}
                  InputProps={{
                    style: {
                      height: '40px',
                      fontWeight: 500,
                      padding: '0px 20px'
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Image height={18} width={18} src={SEARCH} alt="SEARCH" priority />
                      </InputAdornment>
                    )
                  }}
                  onChange={(e) => onInputChange(true, e.target.value)}
                  onKeyUp={handleKeyPress}
                  value={searchText1}
                  placeholder={`Search By ${
                    searchBy === 'name' ? 'First Name' : SEARCH_VALUE_NAME[searchBy as keyof typeof SEARCH_VALUE_NAME]
                  }`}
                ></TextField>
                {searchBy === 'name' && (
                  <TextField
                    style={{ ...styles.textfield, borderLeft: '0.3px solid #7D7D7D', width: '260px' }}
                    InputProps={{
                      style: {
                        height: '40px',
                        fontWeight: 500,
                        padding: '0px 20px'
                      },
                      startAdornment: (
                        <InputAdornment position="start">
                          <Image height={18} width={18} src={SEARCH} alt="SEARCH" priority />
                        </InputAdornment>
                      )
                    }}
                    onChange={(e) => onInputChange(false, e.target.value)}
                    onKeyUp={handleKeyPress}
                    value={searchText2}
                    placeholder={`Search By ${
                      searchBy === 'name' ? 'Last Name' : SEARCH_VALUE_NAME[searchBy as keyof typeof SEARCH_VALUE_NAME]
                    }`}
                  ></TextField>
                )}
              </Box>
              <Button
                variant="contained"
                sx={{
                  width: 130,
                  marginX: 2,
                  paddingY: '1px'
                }}
                onClick={() => getSearchSuggestionData(searchBy, searchText1, searchText2)}
              >
                Search
              </Button>
            </Box>
            {(searchText1.length > 2 || searchText2.length > 2) && showList && !getShowLoader && (
              <Stack
                spacing={{ xs: 1, sm: 2 }}
                sx={{
                  marginTop: 1,
                  zIndex: 1200,
                  position: 'absolute',
                  minWidth: 650,
                  backgroundColor: '#fff',
                  boxShadow: '0px 0px 5px 1px #ddd',
                  padding: 2
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>Search List</Box>
                  <Box>
                    <Image
                      height={20}
                      width={20}
                      src={V_CANCEL}
                      alt="V CANCEL"
                      priority
                      onClick={() => setShowList(false)}
                    />
                  </Box>
                </Box>
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
                    callBackFunction={getAdminDetails}
                    listContain={listContain}
                  />
                </Box>
              </Stack>
            )}
          </>
        )}
      </Box>
      {username && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            fontFamily: 'Merriweather',
            fontWeight: 700
          }}
        >
          <Box
            sx={{
              height: 40,
              width: 40,
              backgroundColor: '#00E2D6',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '16px',
              fontWeight: '700',
              flexShrink: '0'
            }}
          >
            {getAgentSignature(username?.toUpperCase())}
          </Box>
          <Typography sx={{ marginLeft: '12px', fontSize: '16px', lineHeight: '20px', fontWeight: '700' }}>
            {username}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
