import React, { BaseSyntheticEvent, useRef } from 'react';
import { CommonNextButton, useForm, getEndYear, formatDate, calculateAge } from 'src/components';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { useNavigate } from 'react-router-dom';
import { fetchNationalityList, selectStep, showLoader } from './store';
import { useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  FormControlLabel,
  Grid,
  FormGroup,
  Button,
  useMediaQuery,
  useTheme,
  Typography
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { postPersonalDetails, saveAddressFormDetails } from './store/index';
import {
  getAddressFormDetails,
  getNationalities,
  getPersonalDetails,
  getPersonalDetailsSuccess,
  getSessionToken
} from './store/selectors';
import dayjs from 'dayjs';
import { employmentStatusList, securityQuestionsList, titleList } from 'src/resources/form/data/staticList';
import { AddressState, Nationality } from './store/types';
import { submitAddressLookup } from './store/API';
import { ImageData } from 'src/resources/images';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import ReactGA from 'react-ga4';

interface AddressUtility {
  searchPostcode: string;
  selectedAddressIndex: number;
  showManualAddress: boolean;
  searchAddressList: AddressState[] | null;
}
type AddressEntity = AddressState & AddressUtility;

export const PersonalDetails: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const greaterThanLarge = useMediaQuery(theme.breakpoints.up('lg'));
  const personalDetails = useAppSelector(getPersonalDetails);
  const personalDetailsSuccess = useAppSelector(getPersonalDetailsSuccess);
  const savedAddressDetails = useAppSelector(getAddressFormDetails);
  const nationalities = useAppSelector(getNationalities);
  const sessionId = useAppSelector(getSessionToken) || '';

  const getNewAddress = (postcode?: string) => {
    return {
      searchPostcode: postcode || '',
      showManualAddress: false,
      searchAddressList: null,
      addressLine1: '',
      addressLine2: '',
      town: '',
      county: '',
      postCode: '',
      summaryLine: ''
    } as AddressEntity;
  };

  const [isSubmit, setIsSubmit] = useState(false);
  const [addresses, setAddresses] = useState<AddressEntity[]>(
    savedAddressDetails && savedAddressDetails.length
      ? JSON.parse(JSON.stringify(savedAddressDetails))
      : new Array(getNewAddress())
  );
  const [addressError, setAddressError] = useState<any[]>([{}]);
  const addErrors = useRef<any[]>([]);

  useEffect(() => {
    dispatch(selectStep(1));
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname, title: 'Personal Details' });
    dispatch(fetchNationalityList());
  }, []);

  useEffect(() => {
    if (personalDetailsSuccess && isSubmit) {
      navigate('/account-details');
    }
  }, [isSubmit, personalDetailsSuccess]);

  const { handleSubmit, handleChange, data, errors } = useForm({
    validations: {
      title: {
        required: {
          value: true,
          message: 'This field is required'
        }
      },
      firstName: {
        required: {
          value: true,
          message: 'This field is required'
        },
        pattern: {
          value: /^[A-Za-z-']*$/,
          message: "Field can only contain letters of the alphabet, hyphens(-) and apostrophes (')"
        },
        custom: {
          isValid: (value: string) => value.length <= 50,
          message: 'Name can be maximum 50 characters'
        }
      },
      middleName: {
        required: {
          value: false,
          message: 'This field is required'
        },
        pattern: {
          value: /^[A-Za-z-' ]*$/,
          message: "Field can only contain letters of the alphabet, hyphens(-) and apostrophes (')"
        },
        custom: {
          isValid: (value: string) => value.length <= 50,
          message: 'Name can be maximum 50 characters'
        }
      },
      lastName: {
        required: {
          value: true,
          message: 'This field is required'
        },
        pattern: {
          value: /^[A-Za-z-' ]*$/,
          message: "Field can only contain letters of the alphabet, hyphens(-) and apostrophes (')"
        },
        custom: {
          isValid: (value: string) => value.length <= 50,
          message: 'Name can be maximum 50 characters'
        }
      },
      nationality: {
        required: {
          value: true,
          message: 'This field is required'
        }
      },
      employmentStatus: {
        required: {
          value: true,
          message: 'This field is required'
        }
      },
      dob: {
        required: {
          value: true,
          message: 'This field is required'
        },
        custom: {
          isValid(this, value: string) {
            if (calculateAge(value) < 18) {
              this.message = 'Minimum age for applying is 18 years';
              return false;
            } else if (calculateAge(value) > 120) {
              this.message = 'Maximum age for applying is 120 years';
              return false;
            }
            return true;
          },
          message: 'This field is required'
        }
      },
      email: {
        required: {
          value: true,
          message: 'This field is required'
        },
        pattern: {
          value: /^(?=.{1,64}@)[A-Za-z0-9_+-]+(\.[A-Za-z0-9_+-]+)*@[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*(\.[A-Za-z]{2,})$/,
          message: 'Please enter a valid email ID'
        }
      },
      confirmEmail: {
        required: {
          value: true,
          message: 'This field is required'
        },
        pattern: {
          value: /^(?=.{1,64}@)[A-Za-z0-9_+-]+(\.[A-Za-z0-9_+-]+)*@[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*(\.[A-Za-z]{2,})$/,
          message: 'Please enter a valid email ID'
        },
        custom: {
          isValid: (value: string) => value === data.email,
          message: 'Email & Confirm Email do not match. Please make sure they are the same'
        }
      },
      securityQuestion1: {
        required: {
          value: true,
          message: 'This field is required'
        }
      },
      securityAnswer1: {
        required: {
          value: true,
          message: 'This field is required'
        },
        pattern: {
          value: /^[A-Za-z0-9\s-']*$/,
          message: 'Field can only contain alphanumeric, hyphens(-), apostrophes (’) and spaces'
        }
      },
      securityQuestion2: {
        required: {
          value: true,
          message: 'This field is required'
        }
      },
      securityAnswer2: {
        required: {
          value: true,
          message: 'This field is required'
        },
        pattern: {
          value: /^[A-Za-z0-9\s-']*$/,
          message: 'Field can only contain alphanumeric, hyphens(-), apostrophes (’) and spaces'
        }
      },
      phoneNumber: {
        required: {
          value: true,
          message: 'This field is required'
        },
        custom: {
          isValid: (value: string) => {
            let phoneNumber = value;
            const regx = /^(?:(?:\+|0{0,2})44|0)[0-9]{10}$/;
            return RegExp(regx).test(phoneNumber.replaceAll(' ', ''));
          },
          message: 'This field must contain a valid UK mobile number'
        }
      }
    },
    onSubmit: () => handleSubmitClick(),
    initialValues: {
      title: personalDetails.title ? personalDetails.title : '',
      firstName: personalDetails.firstName ? personalDetails.firstName : '',
      middleName: personalDetails.middleName ? personalDetails.middleName : '',
      lastName: personalDetails.lastName ? personalDetails.lastName : '',
      dob: personalDetails.dob ? personalDetails.dob : '',
      nationality: personalDetails.nationality ? personalDetails.nationality : '',
      employmentStatus: personalDetails.employmentStatus ? personalDetails.employmentStatus : '',
      email: personalDetails.email ? personalDetails.email : '',
      confirmEmail: personalDetails.confirmEmail ? personalDetails.confirmEmail : '',
      securityQuestion1: personalDetails.securityQuestion1 ? personalDetails.securityQuestion1 : '',
      securityAnswer1: personalDetails.securityAnswer1 ? personalDetails.securityAnswer1 : '',
      securityQuestion2: personalDetails.securityQuestion2 ? personalDetails.securityQuestion2 : '',
      securityAnswer2: personalDetails.securityAnswer2 ? personalDetails.securityAnswer2 : '',
      phoneNumber: personalDetails.phoneNumber ? personalDetails.phoneNumber : ''
    }
  });

  const handleSecurityQuestion = (idx: number, value: number) => {
    securityQuestionsList.forEach((question) => (question.usedIn === value ? (question.usedIn = 0) : null));
    securityQuestionsList[idx].usedIn = value;
  };

  const handleAddressChange = (addressIndex: number, key: string, value: any) => {
    const newAddreses = addresses.map((addr, index) => (index === addressIndex ? { ...addr, [key]: value } : addr));
    setAddresses(newAddreses);
    if (
      addressIndex < addressError.length &&
      (['residenceYears', 'residenceMonths'].includes(key) || (value && addressError[addressIndex][key]))
    ) {
      delete addressError[addressIndex][key];
      setAddressError([...addressError]);
    }
    if (['residenceYears', 'residenceMonths'].includes(key)) checkAddressEligibility(addressIndex, newAddreses);
  };

  const findAddress = (index: number, postcode: string) => {
    const newAddreses = addresses.map((addr, idx) => (idx === index ? getNewAddress(postcode) : addr));
    setAddresses([...newAddreses]);
    if (postcode !== '') {
      const rertunValidation = postCodeValidation(postcode);
      if (rertunValidation.length === 0) {
        addressError[index].searchPostcode = 'Please enter valid UK postcode';
        return;
      }
      delete addressError[index].searchPostcode;
      dispatch(showLoader(true));
      submitAddressLookup(postcode, sessionId)
        .then((response) => {
          if (response.data.data.length === 0) {
            addressError[index].searchPostcode =
              'We could not find any address from the postcode, please enter the address manually below';
          }
          const newAddresses = addresses.map((addr, idx) =>
            index === idx
              ? {
                  ...addr,
                  showManualAddress: response.data.data.length === 0,
                  searchAddressList: response.data.data || []
                }
              : addr
          );
          setAddresses(newAddresses);
          dispatch(showLoader(false));
        })
        .catch(() => dispatch(showLoader(false)));
    } else {
      addressError[index].searchPostcode = 'This field is required';
    }
    setAddressError([...addressError]);
  };
  const postCodeValidation = (postCode: string) => {
    const postCodeValidationList = [
      /^[A-Za-z]{1}[0-9]{1}\s?[0-9]{1}[A-Za-z]{2}$/,
      /^[A-Za-z][0-9][A-Za-z]\s?[0-9][A-Za-z][A-Za-z]$/,
      /^[A-Za-z]{1}[0-9]{2}\s?[0-9]{1}[A-Za-z]{2}$/,
      /^[A-Za-z]{2}[0-9]{1,2}\s?[0-9][A-Za-z]{2}$/,
      /^[A-Za-z]{2}[0-9][A-Za-z]\s?[0-9][A-Za-z]{2}$/,
      /^[A-Za-z]{2}d{2}\s?d[A-Za-z]{2}$/
    ];
    return postCodeValidationList.filter((postCodeValidation) => RegExp(postCodeValidation).test(postCode));
  };

  const selectAddress = (addressIndex: number, selectedIndex: number) => {
    const selectedAddress = addresses[addressIndex].searchAddressList?.[selectedIndex] as AddressState;
    const newAddresses = addresses.map((addr, index) =>
      index === addressIndex
        ? {
            ...addr,
            addressLine1: selectedAddress.addressLine1,
            addressLine2: selectedAddress.addressLine2,
            county: selectedAddress.county,
            town: selectedAddress.postTown,
            postCode: selectedAddress.postCode,
            summaryLine: selectedAddress.summaryLine,
            selectedAddressIndex: selectedIndex
          }
        : addr
    );
    setAddresses(newAddresses);
    if (addressError[addressIndex].selectedAddressIndex) {
      delete addressError[addressIndex].selectedAddressIndex;
      setAddressError([...addressError]);
    }
  };

  const showManualAddress = (addressIndex: number) => {
    const newAddresses = addresses.map((addr, index) =>
      index === addressIndex
        ? {
            ...addr,
            summaryLine: '',
            showManualAddress: true,
            searchPostcode: ''
          }
        : addr
    );
    setAddresses(newAddresses);
    addressError[addressIndex] = {};
    setAddressError([...addressError]);
  };

  const resetAddress = (addressIndex: number) => {
    let newAddress = JSON.parse(JSON.stringify(addresses));
    let newAddressError = JSON.parse(JSON.stringify(addressError));

    newAddress[addressIndex] = getNewAddress();
    newAddressError[addressIndex] = {};
    newAddress.splice(addressIndex + 1);
    newAddressError.splice(addressIndex + 1);
    setAddresses([...newAddress]);
    setAddressError([...newAddressError]);
  };

  const checkAddressEligibility = (addressIndex: number, addresses: AddressEntity[]) => {
    let yearsCount = 0;
    let monthsCount = 0;
    let newAddresses: AddressEntity[] = [];
    let newAddressError: any[] = [];
    addresses.map((address: AddressEntity, index) => {
      if (yearsCount * 12 + monthsCount < 36) {
        newAddresses.push(address);
        newAddressError.push(addressError[index]);
      }
      if (address.residenceYears) yearsCount += address.residenceYears;
      if (address.residenceMonths) monthsCount += address.residenceMonths;
    });

    if (yearsCount * 12 + monthsCount < 36) {
      if (addresses[addresses.length - 1].residenceYears >= 0 && addresses[addresses.length - 1].residenceMonths >= 0) {
        setAddresses([...addresses, getNewAddress()]);
        addressError.push({});
        setAddressError([...addressError]);
      }
    } else {
      setAddresses([...newAddresses]);
      setAddressError([...newAddressError]);
    }
  };

  const prepareAPIAddress = () => {
    return addresses.map((addr: AddressEntity, index: number) => {
      return {
        type: index === 0 ? 'current' : 'previous',
        index: index,
        selectionType: addr.showManualAddress ? 'manual' : 'selected',
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2,
        town: addr.town,
        county: addr.county,
        postCode: addr.postCode,
        residenceYears: addr.residenceYears,
        residenceMonths: addr.residenceMonths === undefined || addr.residenceYears === 13 ? 0 : addr.residenceMonths,
        summary: addr.summaryLine
      };
    });
  };

  const validateAddress = () => {
    const addError: any[] = [];
    const addressPattern = /^[A-Za-z0-9\s-',.]*$/;
    const pattern = /^[A-Za-z0-9\s-',]*$/;
    addresses.forEach((address: AddressEntity) => {
      const postCodeValidationArrray = postCodeValidation(address.postCode);
      let error: any = {};
      if (address.showManualAddress) {
        if (!address.addressLine1) error.addressLine1 = 'This field is required';
        else if (!RegExp(addressPattern).test(address.addressLine1))
          error.addressLine1 =
            "Field can only contain letters of the alphabet, numbers, hyphens(-), apostrophes ('), comma(,) and spaces";

        if (address.addressLine2 && !RegExp(addressPattern).test(address.addressLine2))
          error.addressLine2 =
            "Field can only contain letters of the alphabet, numbers, hyphens(-), apostrophes ('), comma(,) and spaces";

        if (!address.town) error.town = 'This field is required';
        else if (!RegExp(pattern).test(address.town))
          error.town =
            "Field can only contain letters of the alphabet, numbers, hyphens(-), apostrophes ('), comma(,) and spaces";

        if (!address.county) error.county = 'This field is required';
        else if (!RegExp(pattern).test(address.county))
          error.county =
            "Field can only contain letters of the alphabet, numbers, hyphens(-), apostrophes ('), comma(,) and spaces";

        if (!address.postCode) error.postCode = 'This field is required';
        else if (postCodeValidationArrray.length === 0) error.postCode = 'Please enter valid UK postcode';
      } else {
        if (address.searchPostcode === '') error.searchPostcode = 'This field is required';
        else if (!address.searchAddressList) error.searchPostcode = 'Please find your address using postcode';
        else if (address.selectedAddressIndex === undefined) error.selectedAddressIndex = 'This field is required';
      }
      if (address.showManualAddress || address.searchAddressList?.length) {
        if (address.residenceYears === undefined) error.residenceYears = 'This field is required';
        if (address.residenceYears !== 13 && address.residenceMonths === undefined)
          error.residenceMonths = 'This field is required';
      }
      addError.push(error);
    });
    setAddressError([...addError]);
    addErrors.current = addError;
  };

  const handleSubmitClick = () => {
    for (const error of addErrors.current) {
      if (Object.keys(error).length) {
        setTimeout(() =>
          window.scrollTo(0, (document.getElementsByClassName('error')[0] as HTMLElement)?.offsetTop - 200)
        );
        return;
      }
    }
    dispatch(saveAddressFormDetails(addresses));
    setIsSubmit(true);
    dispatch(
      postPersonalDetails({
        ...data,
        flowState: 'initial_post',
        dob: formatDate(data.dob, 'yyyy-mm-dd'),
        addresses: prepareAPIAddress()
      })
    );
    ReactGA.event({
      category: 'Personal Details',
      action: 'Personal Details - Next',
      label: 'Personal Details - Next'
    });
  };

  const handleClick = (isNextClick: boolean) => {
    if (isNextClick) {
      validateAddress();
      handleSubmit();
    } else {
      ReactGA.event({
        category: 'Personal Details',
        action: 'Personal Details - Previous',
        label: 'Personal Details - Previous'
      });
      navigate('/deposit-details');
    }
  };

  const onMobileKeyDown = (e: React.KeyboardEvent) => {
    if ((e.keyCode < 65 && !e.shiftKey) || (e.keyCode >= 91 && e.keyCode <= 105) || e.metaKey || e.keyCode === 187)
      return;
    e.preventDefault();
  };

  return (
    <Box id="personal-details">
      <Box className="title" sx={{ marginBottom: '-12px' }}>
        Your information
      </Box>
      <form>
        <FormGroup>
          <FormControl fullWidth required className={errors.title ? 'error' : ''}>
            <FormLabel className="label">Title</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={data.title}
            >
              {titleList.map((titleItem, index) => (
                <FormControlLabel
                  key={index}
                  className="radio"
                  value={titleItem}
                  control={<Radio onClick={() => handleChange('title', titleItem)} />}
                  label={titleItem}
                />
              ))}
            </RadioGroup>
            {errors.title && <p className="msg">{errors.title}</p>}
          </FormControl>
        </FormGroup>
        <Grid container columnSpacing={{ xs: 2, lg: 5 }}>
          <Grid item xs={12} md={4}>
            <FormGroup>
              <FormControl fullWidth variant="standard" required className={errors.firstName ? 'error' : ''}>
                <FormLabel className="label" htmlFor="firstName">
                  First name
                </FormLabel>
                <Input
                  required={true}
                  error
                  name="firstName"
                  value={data.firstName}
                  disableUnderline
                  className="input"
                  id="firstName"
                  onInput={(e: BaseSyntheticEvent) => handleChange('firstName', e.target.value)}
                />
                {errors.firstName && <p className="msg">{errors.firstName}</p>}
              </FormControl>
            </FormGroup>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormGroup>
              <FormControl fullWidth variant="standard" className={errors.middleName ? 'error' : ''}>
                <FormLabel className="label" htmlFor="middleName">
                  Middle Name(s)
                </FormLabel>
                <Input
                  value={data.middleName}
                  disableUnderline
                  className="input"
                  id="middleName"
                  onInput={(e: BaseSyntheticEvent) => handleChange('middleName', e.target.value)}
                />
                {errors.middleName && <p className="msg">{errors.middleName}</p>}
              </FormControl>
            </FormGroup>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormGroup>
              <FormControl fullWidth variant="standard" required className={errors.lastName ? 'error' : ''}>
                <FormLabel className="label" htmlFor="lastName">
                  Last name
                </FormLabel>
                <Input
                  value={data.lastName}
                  disableUnderline
                  className="input"
                  id="lastName"
                  onInput={(e: BaseSyntheticEvent) => handleChange('lastName', e.target.value)}
                />
                {errors.lastName && <p className="msg">{errors.lastName}</p>}
              </FormControl>
            </FormGroup>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormGroup>
              <FormControl fullWidth variant="standard" required className={errors.dob ? 'error' : ''}>
                <FormLabel className="label">Date of birth</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    className="input"
                    maxDate={dayjs(getEndYear(18))}
                    minDate={dayjs(getEndYear(120))}
                    format="DD-MM-YYYY"
                    slots={{ openPickerIcon: CalendarMonthIcon }}
                    sx={{ border: 0, padding: '0 !important' }}
                    value={dayjs(data.dob)}
                    onChange={(newVal) => handleChange('dob', dayjs(newVal).toString())}
                  />
                </LocalizationProvider>
                {errors.dob && <p className="msg">{errors.dob}</p>}
              </FormControl>
            </FormGroup>
          </Grid>
        </Grid>
        <FormGroup>
          <FormControl fullWidth required className={errors.nationality ? 'error' : ''}>
            <FormLabel className="label">Please indicate your nationality from the country list below</FormLabel>
            <Grid container>
              <Grid item xs={12} md={6}>
                <Select
                  className="input"
                  variant="standard"
                  fullWidth
                  disableUnderline
                  IconComponent={KeyboardArrowDown}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  placeholder={'choose one'}
                  value={data.nationality}
                  onChange={(e) => handleChange('nationality', e.target.value)}
                >
                  <MenuItem disabled value={''}>
                    Choose one
                  </MenuItem>
                  {nationalities?.map((country: Nationality) => (
                    <MenuItem value={country.key} key={country.key}>
                      {country.value}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
            {errors.nationality && <p className="msg">{errors.nationality}</p>}
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormControl fullWidth required className={errors.employmentStatus ? 'error' : ''}>
            <FormLabel className="label">Employment Status</FormLabel>
            <Grid container>
              <Grid item xs={12} md={6}>
                <Select
                  className="input"
                  variant="standard"
                  fullWidth
                  disableUnderline
                  IconComponent={KeyboardArrowDown}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  placeholder={'choose one'}
                  value={data.employmentStatus}
                  onChange={(e) => handleChange('employmentStatus', e.target.value)}
                >
                  <MenuItem disabled value="">
                    Choose one
                  </MenuItem>
                  {employmentStatusList.map((emp: any, index) => (
                    <MenuItem value={emp.code} key={index}>
                      {emp.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
            {errors.employmentStatus && <p className="msg">{errors.employmentStatus}</p>}
          </FormControl>
        </FormGroup>
        <Box className="title">Your current address details</Box>
        <Box component="span" className="info">
          <img src={ImageData.infoIcon} alt="info icon" />
          We require up to 3 years of address details
        </Box>
        {addresses.map((address: AddressEntity, index: number) => (
          <Box
            sx={
              index > 0
                ? {
                    margin: index === addresses.length - 1 && { xs: '0 -15px', sm: '0 -40px', lg: '0 -62px' },
                    padding: index === addresses.length - 1 && {
                      xs: '15px 15px 20px',
                      sm: '30px 40px 38px',
                      lg: '30px 62px 38px'
                    },
                    background: index === addresses.length - 1 && '#DFE3FD',
                    marginTop: { xs: '24px !important', sm: '38px !important' }
                  }
                : null
            }
            key={index}
          >
            {index > 0 && (
              <Typography className="title" sx={{ margin: '0 0 -10px !important' }}>
                Your previous address details <span id="subtitle">(We require upto 3 years of address details)</span>
              </Typography>
            )}
            <Grid container columnSpacing={{ xs: 2, lg: 3 }}>
              <Grid item xs={7} md={5} lg={4}>
                <FormGroup>
                  <FormControl fullWidth required className={addressError[index]?.searchPostcode ? 'error' : ''}>
                    <FormLabel className="label">UK Postcode</FormLabel>
                    <Input
                      id="searchPostcode"
                      value={address.searchPostcode}
                      disableUnderline
                      className="input"
                      placeholder="SL6 8DT"
                      inputProps={{ maxLength: 8 }}
                      onKeyUp={(e) => {
                        if (e.keyCode === 13) findAddress(index, address.searchPostcode);
                      }}
                      onInput={(el: BaseSyntheticEvent) =>
                        handleAddressChange(index, 'searchPostcode', el.target.value)
                      }
                    />
                  </FormControl>
                </FormGroup>
              </Grid>

              <Grid item xs={5} md={3} lg={2} className="address-btn find-address">
                <Button onClick={() => findAddress(index, address.searchPostcode)}>Find address</Button>
              </Grid>
            </Grid>
            {addressError[index]?.searchPostcode && (
              <Box className="error">
                <p className="msg">{addressError[index]?.searchPostcode}</p>
              </Box>
            )}
            {address.searchAddressList ? (
              <Grid container columnSpacing={{ xs: 2, lg: 5 }}>
                <Grid item xs={12} md={8} lg={6}>
                  {!address.showManualAddress && address.searchAddressList.length ? (
                    <FormGroup>
                      <FormControl
                        fullWidth
                        required
                        className={addressError[index]?.selectedAddressIndex ? 'error' : ''}
                      >
                        <FormLabel className="label">Please select your address from the list below</FormLabel>
                        <Select
                          className="input"
                          variant="standard"
                          disableUnderline
                          IconComponent={KeyboardArrowDown}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                          placeholder={'choose one'}
                          value={address.selectedAddressIndex ?? -1}
                          onChange={(el) => selectAddress(index, el.target.value)}
                        >
                          <MenuItem disabled defaultChecked value={-1}>
                            Choose one
                          </MenuItem>
                          {address.searchAddressList.map((address, index: number) => (
                            <MenuItem key={index} value={index}>
                              {address.summaryLine}
                            </MenuItem>
                          ))}
                        </Select>
                        {addressError[index]?.selectedAddressIndex ? (
                          <p className="msg">{addressError[index]?.selectedAddressIndex}</p>
                        ) : null}
                      </FormControl>
                    </FormGroup>
                  ) : null}
                  {address.searchAddressList ? (
                    <Grid
                      container
                      columnSpacing={{ xs: 2, lg: 3 }}
                      sx={{
                        justifyContent: 'flex-end',
                        marginTop: '24px !important'
                      }}
                    >
                      {!address.showManualAddress ? (
                        <Grid item xs={7} md={6} lg={5} xl={4} className="address-btn">
                          <Button onClick={() => showManualAddress(index)}>Input Address Manually</Button>
                        </Grid>
                      ) : null}
                      <Grid item xs={5} xl={4} className="address-btn">
                        <Button onClick={() => resetAddress(index)}>
                          {greaterThanLarge ? 'Reset Address Search' : 'Reset Address'}
                        </Button>
                      </Grid>
                    </Grid>
                  ) : null}
                </Grid>
              </Grid>
            ) : null}
            {address.showManualAddress ? (
              <>
                <Grid container columnSpacing={{ xs: 2, lg: 5 }}>
                  <Grid item xs={12} md={6}>
                    <FormGroup>
                      <FormControl fullWidth required className={addressError[index]?.addressLine1 ? 'error' : ''}>
                        <FormLabel className="label">Address Line 1</FormLabel>
                        <Input
                          value={address.addressLine1}
                          className="input"
                          inputProps={{ maxLength: 100 }}
                          disableUnderline
                          onInput={(el: BaseSyntheticEvent) =>
                            handleAddressChange(index, 'addressLine1', el.target.value)
                          }
                        />
                        {addressError[index]?.addressLine1 ? (
                          <p className="msg">{addressError[index]?.addressLine1}</p>
                        ) : null}
                      </FormControl>
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormGroup>
                      <FormControl fullWidth className={addressError[index]?.addressLine2 ? 'error' : ''}>
                        <FormLabel className="label">Address Line 2</FormLabel>
                        <Input
                          value={address.addressLine2}
                          className="input"
                          inputProps={{ maxLength: 100 }}
                          disableUnderline
                          onInput={(el: BaseSyntheticEvent) =>
                            handleAddressChange(index, 'addressLine2', el.target.value)
                          }
                        />
                        {addressError[index]?.addressLine2 ? (
                          <p className="msg">{addressError[index]?.addressLine2}</p>
                        ) : null}
                      </FormControl>
                    </FormGroup>
                  </Grid>
                </Grid>
                <Grid container columnSpacing={{ xs: 2, lg: 5 }}>
                  <Grid item xs={12} md={4}>
                    <FormGroup>
                      <FormControl fullWidth required className={addressError[index]?.town ? 'error' : ''}>
                        <FormLabel className="label">Town / City</FormLabel>
                        <Input
                          value={address.town}
                          className="input"
                          inputProps={{ maxLength: 40 }}
                          disableUnderline
                          onInput={(el: BaseSyntheticEvent) => handleAddressChange(index, 'town', el.target.value)}
                        />
                        {addressError[index]?.town ? <p className="msg">{addressError[index]?.town}</p> : null}
                      </FormControl>
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} md={4} className={addressError[index]?.county ? 'error' : ''}>
                    <FormControl fullWidth required>
                      <FormLabel className="label">County</FormLabel>
                      <Input
                        error
                        value={address.county}
                        className="input"
                        inputProps={{ maxLength: 40 }}
                        disableUnderline
                        onInput={(el: BaseSyntheticEvent) => handleAddressChange(index, 'county', el.target.value)}
                      />
                      {addressError[index]?.county ? <p className="msg">{addressError[index]?.county}</p> : null}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4} className={addressError[index]?.postCode ? 'error' : ''}>
                    <FormGroup>
                      <FormControl fullWidth required>
                        <FormLabel className="label">Postcode</FormLabel>
                        <Input
                          value={address.postCode}
                          className="input"
                          inputProps={{ maxLength: 8 }}
                          disableUnderline
                          onInput={(e: BaseSyntheticEvent) =>
                            handleAddressChange(index, 'postCode', (e.target.value as string).toUpperCase())
                          }
                        />
                        {addressError[index]?.postCode ? <p className="msg">{addressError[index]?.postCode}</p> : null}
                      </FormControl>
                    </FormGroup>
                  </Grid>
                </Grid>
              </>
            ) : null}
            {address.searchAddressList?.length || address.showManualAddress ? (
              <Box sx={{ flexGrow: 1 }}>
                <FormGroup>
                  <FormLabel className="label" required>
                    How long have you lived at this address?
                  </FormLabel>
                  <Grid container columnSpacing={{ xs: 2, lg: 5 }}>
                    <Grid item xs={6} md={4}>
                      <FormControl fullWidth required className={addressError[index]?.residenceYears ? 'error' : ''}>
                        <Select
                          className="input"
                          variant="standard"
                          disableUnderline
                          fullWidth
                          displayEmpty
                          IconComponent={KeyboardArrowDown}
                          inputProps={{ 'aria-label': 'Without label' }}
                          value={address.residenceYears}
                          onChange={(el) => handleAddressChange(index, 'residenceYears', el.target.value)}
                        >
                          <MenuItem disabled defaultChecked>
                            {greaterThanLarge ? 'Select number of years' : 'Select years'}
                          </MenuItem>
                          {new Array(13).fill(0).map((item, y) => (
                            <MenuItem key={y} value={y}>
                              {y} {y > 1 ? 'Years' : 'Year'}
                            </MenuItem>
                          ))}
                          <MenuItem value={13}>12+ Years</MenuItem>
                        </Select>
                        {addressError[index]?.residenceYears ? (
                          <p className="msg">{addressError[index]?.residenceYears}</p>
                        ) : null}
                      </FormControl>
                    </Grid>
                    {(!address.residenceYears || address.residenceYears < 13) && (
                      <Grid item xs={6} md={4}>
                        <FormControl fullWidth required className={addressError[index]?.residenceMonths ? 'error' : ''}>
                          <Select
                            className="input"
                            variant="standard"
                            disableUnderline
                            fullWidth
                            displayEmpty
                            IconComponent={KeyboardArrowDown}
                            inputProps={{ 'aria-label': 'Without label' }}
                            value={address.residenceMonths}
                            onChange={(el) => handleAddressChange(index, 'residenceMonths', el.target.value)}
                          >
                            <MenuItem disabled defaultChecked>
                              {greaterThanLarge ? 'Select number of months' : 'Select months'}
                            </MenuItem>
                            {new Array(12).fill(0).map((item, m) => (
                              <MenuItem
                                key={m}
                                value={m}
                                disabled={
                                  (address.residenceYears === 0 && m === 0) ||
                                  (address.residenceYears === -1 && m === 0)
                                }
                              >
                                {m} {m > 1 ? 'Months' : 'Month'}
                              </MenuItem>
                            ))}
                          </Select>
                          {addressError[index]?.residenceMonths ? (
                            <p className="msg">{addressError[index]?.residenceMonths}</p>
                          ) : null}
                        </FormControl>
                      </Grid>
                    )}
                  </Grid>
                </FormGroup>
              </Box>
            ) : null}
          </Box>
        ))}
        <Box className="title" sx={{ marginBottom: '-12px' }}>
          Your contact details
        </Box>
        <FormGroup>
          <FormControl fullWidth required className={errors.phoneNumber ? 'error' : ''}>
            <FormLabel className="label">Mobile number</FormLabel>
            <Grid container columnSpacing={{ xs: 2, lg: 5 }}>
              <Grid item xs={12} md={4}>
                <Input
                  value={data.phoneNumber}
                  type="text"
                  inputProps={{ maxLength: 15 }}
                  fullWidth
                  disableUnderline
                  placeholder="07717 810 761"
                  className="input"
                  onKeyDown={onMobileKeyDown}
                  onInput={(e: BaseSyntheticEvent) => handleChange('phoneNumber', e.target.value)}
                />
              </Grid>
            </Grid>
            {errors.phoneNumber && <p className="msg">{errors.phoneNumber}</p>}
          </FormControl>
        </FormGroup>
        <Grid container columnSpacing={{ xs: 2, lg: 5 }}>
          <Grid item xs={12} md={4}>
            <FormGroup>
              <FormControl fullWidth required className={errors.email ? 'error' : ''}>
                <FormLabel className="label">Email</FormLabel>
                <Input
                  value={data.email}
                  disableUnderline
                  className="input"
                  inputProps={{ maxLength: 50 }}
                  onInput={(e: BaseSyntheticEvent) => handleChange('email', e.target.value)}
                />
                {errors.email && <p className="msg">{errors.email}</p>}
              </FormControl>
            </FormGroup>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormGroup>
              <FormControl fullWidth required className={errors.confirmEmail ? 'error' : ''}>
                <FormLabel className="label">Confirm email</FormLabel>
                <Input
                  value={data.confirmEmail}
                  disableUnderline
                  className="input"
                  inputProps={{ maxLength: 50 }}
                  onInput={(e: BaseSyntheticEvent) => handleChange('confirmEmail', e.target.value)}
                />
                {errors.confirmEmail && <p className="msg">{errors.confirmEmail}</p>}
              </FormControl>
            </FormGroup>
          </Grid>
        </Grid>
        <Box className="title" sx={{ marginBottom: '-12px' }}>
          Security information
        </Box>
        <Grid container columnSpacing={{ xs: 2, lg: 5 }}>
          <Grid item xs={12} md={5}>
            <FormGroup>
              <FormControl fullWidth required className={errors.securityQuestion1 ? 'error' : ''}>
                <FormLabel className="label">Security question 1</FormLabel>
                <Select
                  className="input"
                  variant="standard"
                  disableUnderline
                  displayEmpty
                  IconComponent={KeyboardArrowDown}
                  inputProps={{ 'aria-label': 'Without label' }}
                  value={data.securityQuestion1}
                  onChange={(e) => handleChange('securityQuestion1', e.target.value)}
                >
                  <MenuItem disabled value="">
                    Choose one
                  </MenuItem>
                  {securityQuestionsList.map((ques: any, index) =>
                    ques.usedIn !== 2 ? (
                      <MenuItem onClick={() => handleSecurityQuestion(index, 1)} value={ques.key} key={index}>
                        {ques.name}
                      </MenuItem>
                    ) : null
                  )}
                </Select>
                {errors.securityQuestion1 ? <p className="msg">This field is required</p> : null}
              </FormControl>
            </FormGroup>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormGroup>
              <FormControl fullWidth required className={errors.securityAnswer1 ? 'error' : ''}>
                <FormLabel className="label">Security answer 1</FormLabel>
                <Input
                  value={data.securityAnswer1}
                  disableUnderline
                  className="input"
                  inputProps={{ maxLength: 100 }}
                  onInput={(e: BaseSyntheticEvent) => handleChange('securityAnswer1', e.target.value)}
                />
                {errors.securityAnswer1 ? <p className="msg">{errors.securityAnswer1}</p> : null}
              </FormControl>
            </FormGroup>
          </Grid>
          <Grid item xs={12} md={5}>
            <FormGroup>
              <FormControl fullWidth required className={errors.securityQuestion2 ? 'error' : ''}>
                <FormLabel className="label">Security question 2</FormLabel>
                <Select
                  className="input"
                  variant="standard"
                  disableUnderline
                  displayEmpty
                  IconComponent={KeyboardArrowDown}
                  inputProps={{ 'aria-label': 'Without label' }}
                  value={data.securityQuestion2}
                  onChange={(e) => handleChange('securityQuestion2', e.target.value)}
                >
                  <MenuItem disabled value="">
                    Choose one
                  </MenuItem>
                  {securityQuestionsList.map((ques: any, index) =>
                    ques.usedIn !== 1 ? (
                      <MenuItem onClick={() => handleSecurityQuestion(index, 2)} value={ques.key} key={index}>
                        {ques.name}
                      </MenuItem>
                    ) : null
                  )}
                </Select>
                {errors.securityQuestion2 ? <p className="msg">This field is required</p> : null}
              </FormControl>
            </FormGroup>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormGroup>
              <FormControl fullWidth required className={errors.securityAnswer2 ? 'error' : ''}>
                <FormLabel className="label">Security answer 2</FormLabel>
                <Input
                  value={data.securityAnswer2}
                  disableUnderline
                  className="input"
                  inputProps={{ maxLength: 100 }}
                  onInput={(e: BaseSyntheticEvent) => handleChange('securityAnswer2', e.target.value)}
                />
                {errors.securityAnswer2 ? <p className="msg">{errors.securityAnswer2}</p> : null}
              </FormControl>
            </FormGroup>
          </Grid>
        </Grid>
      </form>
      <CommonNextButton handleSteps={(e: boolean) => handleClick(e)} />
    </Box>
  );
};
