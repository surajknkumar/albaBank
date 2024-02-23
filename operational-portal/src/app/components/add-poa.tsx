'use client';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Input,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material';
import { BaseSyntheticEvent, useState } from 'react';
import Image from 'next/image';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { ATTACHMENT, CANCEL_BUTTON } from '@svgs';

interface AddPOAProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

export default function AddPOA({ open, setOpen }: AddPOAProps) {
  const [data, setData] = useState<any>({ dob: '' }); // todo
  const [errors, setErrors] = useState<any>({}); // todo
  const titleList = ['Mr', 'Mrs', 'Miss', 'Ms', 'Mx'];

  const handleChange = (key: string, value: any) => {};

  const getEndYear = (numberOfYear: number) => {
    const date = new Date();
    return new Date(date.setFullYear(date.getFullYear() - numberOfYear));
  };

  const onMobileKeyDown = (e: React.KeyboardEvent) => {
    if ((e.keyCode < 65 && !e.shiftKey) || (e.keyCode >= 91 && e.keyCode <= 105) || e.metaKey || e.keyCode === 187)
      return;
    e.preventDefault();
  };

  const submitCallback = () => {};

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => reason !== 'backdropClick' && reason !== 'escapeKeyDown' && setOpen(false)}
    >
      <DialogTitle
        sx={{
          fontFamily: 'Merriweather',
          fontWeight: 700,
          fontSize: '28px',
          padding: '50px 50px 10px'
        }}
      >
        Add Power of Attorney Details
      </DialogTitle>
      <Image
        style={{ cursor: 'pointer', position: 'absolute', top: '16px', right: '16px' }}
        height={26}
        width={26}
        src={CANCEL_BUTTON}
        alt="CANCEL BUTTON"
        priority
        onClick={() => setOpen(false)}
      />
      <DialogContent
        sx={{
          padding: '0 50px',
          width: { xs: '500px', md: '700px', lg: '974px' },
          boxSizing: 'border-box'
        }}
      >
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
        <Grid container columnSpacing={{ xs: 2, lg: 5 }}>
          <Grid item xs={12} md={4}>
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
          </Grid>
          <Grid item xs={12} md={4}>
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
          </Grid>
          <Grid item xs={12} md={4}>
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
          </Grid>
          <Grid item xs={12} md={4} className={errors.dob ? 'error' : ''}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Date of birth"
                maxDate={dayjs(getEndYear(18))}
                minDate={dayjs(getEndYear(120))}
                format="DD-MM-YYYY"
                slots={{ openPickerIcon: CalendarMonthIcon }}
                className="datePicker"
                sx={{ border: 0, padding: '0 !important', label: { position: 'relative', transform: 'none' } }}
                value={dayjs(data.dob)}
                onChange={(newVal) => handleChange('dob', newVal?.toString())}
              />
            </LocalizationProvider>
            {errors.dob && <p className="msg">{errors.dob}</p>}
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth required className={errors.phoneNumber ? 'error' : ''}>
              <FormLabel className="label">Mobile number</FormLabel>
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
              {errors.phoneNumber && <p className="msg">{errors.phoneNumber}</p>}
            </FormControl>
          </Grid>
        </Grid>
        <Grid container columnSpacing={{ xs: 2, lg: 5 }}>
          <Grid item xs={12} md={4}>
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
          </Grid>
          <Grid item xs={12} md={4}>
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
          </Grid>
        </Grid>
        <Grid container columnSpacing={{ xs: 2, lg: 5 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth required className={errors.addressLine1 ? 'error' : ''}>
              <FormLabel className="label">Address Line 1</FormLabel>
              <Input
                value={data.addressLine1}
                className="input"
                inputProps={{ maxLength: 100 }}
                disableUnderline
                onInput={(el: BaseSyntheticEvent) => handleChange('addressLine1', el.target.value)}
              />
              {errors.addressLine1 ? <p className="msg">{errors.addressLine1}</p> : null}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth className={errors.addressLine2 ? 'error' : ''}>
              <FormLabel className="label">Address Line 2</FormLabel>
              <Input
                value={data.addressLine2}
                className="input"
                inputProps={{ maxLength: 100 }}
                disableUnderline
                onInput={(el: BaseSyntheticEvent) => handleChange('addressLine2', el.target.value)}
              />
              {errors.addressLine2 ? <p className="msg">{errors.addressLine2}</p> : null}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth required className={errors.town ? 'error' : ''}>
              <FormLabel className="label">Town / City</FormLabel>
              <Input
                value={data.town}
                className="input"
                inputProps={{ maxLength: 40 }}
                disableUnderline
                onInput={(el: BaseSyntheticEvent) => handleChange('town', el.target.value)}
              />
              {errors.town ? <p className="msg">{errors.town}</p> : null}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} className={errors.county ? 'error' : ''}>
            <FormControl fullWidth required>
              <FormLabel className="label">County</FormLabel>
              <Input
                error
                value={data.county}
                className="input"
                inputProps={{ maxLength: 40 }}
                disableUnderline
                onInput={(el: BaseSyntheticEvent) => handleChange('county', el.target.value)}
              />
              {errors.county ? <p className="msg">{errors.county}</p> : null}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} className={errors.postCode ? 'error' : ''}>
            <FormControl fullWidth required>
              <FormLabel className="label">Postcode</FormLabel>
              <Input
                value={data.postCode}
                className="input"
                inputProps={{ maxLength: 8 }}
                disableUnderline
                onInput={(e: BaseSyntheticEvent) => handleChange('postCode', (e.target.value as string).toUpperCase())}
              />
              {errors.postCode ? <p className="msg">{errors.postCode}</p> : null}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} className={errors.country ? 'error' : ''}>
            <FormControl fullWidth required>
              <FormLabel className="label">Country</FormLabel>
              <Input
                value={data.country}
                className="input"
                inputProps={{ maxLength: 8 }}
                disableUnderline
                onInput={(e: BaseSyntheticEvent) => handleChange('country', (e.target.value as string).toUpperCase())}
              />
              {errors.postCode ? <p className="msg">{errors.postCode}</p> : null}
            </FormControl>
          </Grid>
        </Grid>
        <Box>
          <Typography
            sx={{
              color: '#221C35',
              fontFamily: 'Merriweather',
              fontSize: '21px',
              fontWeight: 700,
              marginTop: '30px',
              lineHeight: '30px'
            }}
          >
            Upload Documents
          </Typography>
          {/* <Box
            sx={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '80px',
              padding: '0 20px',
              borderRadius: '10px',
              border: '1px solid #EFEFEF',
              background: '#FAFAFA'
            }}
          >
            <Image width={20} height={26} src={DOCUMENT} alt="" />
            <Image width={20} height={26} src={DELETE} alt="" />
          </Box> */}
          <Box
            sx={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '80px',
              padding: '0 20px',
              borderRadius: '10px',
              border: '1px solid #EFEFEF',
              background: '#FAFAFA',
              boxSizing: 'border-box'
            }}
          >
            <Typography
              sx={{
                color: '#092043',
                fontSize: '18px',
                lineHeight: '20px',
                fontWeight: 300,
                letterSpacing: '0.018px'
              }}
            >
              Add Documents
            </Typography>
            <Image width={20} height={26} src={ATTACHMENT} alt="" />
          </Box>
        </Box>
        <Typography
          sx={{
            marginTop: '20px',
            marginRight: '10px',
            color: '#0073C7',
            textAlign: 'right',
            fontSize: '18px',
            fontWeight: 500,
            lineHeight: '24px',
            textDecoration: 'underline'
          }}
        >
          Add More
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', padding: '40px 0 28px' }}>
        <Button
          variant="contained"
          sx={{
            height: '50px',
            minWidth: '400px',
            lineHeight: '21.11px'
          }}
          onClick={submitCallback}
        >
          Send security information link
        </Button>
      </DialogActions>
    </Dialog>
  );
}
