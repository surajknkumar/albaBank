import * as React from 'react';
import {
  FormControlLabel,
  FormControl,
  MenuItem,
  InputAdornment,
  Radio,
  RadioGroup,
  FormLabel,
  Input,
  Box,
  Grid,
  Select,
  Typography,
  Checkbox,
  Link
} from '@mui/material';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { selectStep, postDepositDetails, fetchDepositProducts } from '../OnBoarding/store';
import { getDepositProducts, getDepositSuccess, getDepositDetails } from '../OnBoarding/store/selectors';
import { useNavigate } from 'react-router-dom';
import './Onboarding.scss';
import { Check, CheckBoxOutlineBlank, KeyboardArrowDown } from '@mui/icons-material';
import { CommonNextButton, CustomizedDialogsBox, useForm } from 'src/components';
import Reaptcha from 'reaptcha';
import { DepositProducts } from './store/types';
import ReactGA from 'react-ga4';
import { ALBA_CONSTANTS } from 'src/resources/constants';

type NoticeType = 'privacyNotice' | 'fairProcessingNotice';

export const DepositDetails: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const depositDetails = useAppSelector(getDepositDetails);
  const depositSuccess = useAppSelector(getDepositSuccess);
  const depositProducts = useAppSelector(getDepositProducts);
  const [openDilog, setOpenDilog] = useState(false);
  const [dialogType, setDialogType] = useState<NoticeType | ''>('');
  const [onNext, setOnNext] = useState(false);

  const { handleSubmit, handleChange, data, errors } = useForm({
    validations: {
      depositProduct: {
        required: {
          value: true,
          message: 'This field is required'
        }
      },
      intendedDepositAmount: {
        required: {
          value: true,
          message: 'This field is required'
        },
        pattern: {
          value: /^(\d+|(\d{1,3}(,\d{3})*))$/,
          message: 'This field should be number'
        },
        custom: {
          isValid(this, value: string) {
            const amount = parseInt(value.replaceAll(',', ''));
            if (amount < 1) {
              this.message = `You need to deposit at least £${ALBA_CONSTANTS.MIN_DEPOSIT_AMOUNT}`;
              return false;
            } else if (amount > 85000) {
              this.message = `You can deposit a maximum of £${ALBA_CONSTANTS.MAX_DEPOSIT_AMOUNT} across all accounts held with us`;
              return false;
            }
            return true;
          },
          message: `You need to deposit at least £${ALBA_CONSTANTS.MIN_DEPOSIT_AMOUNT} or maximum £${ALBA_CONSTANTS.MAX_DEPOSIT_AMOUNT}`
        }
      },
      agreementConfirmation: {
        required: {
          value: true,
          message: 'This field is required'
        },
        custom: {
          isValid: (value: boolean) => value,
          message: `You must confirm you have read the requirements in the "What you should know before you start"`
        }
      },
      applicantsUKResidenceConfirmation: {
        required: {
          value: true,
          message: 'This field is required'
        },
        custom: {
          isValid: (value: string) => value === 'Yes',
          message: 'Unfortunately, you are not eligible for one of our accounts'
        }
      },
      privacyNotice: {
        required: {
          value: true,
          message: 'You must confirm that you have read our Privacy Notice.'
        }
      },
      fairProcessingNotice: {
        required: {
          value: true,
          message: 'You must confirm that you have read Fair Processing Notice.'
        }
      },
      recaptchaResponse: {
        required: {
          value: true,
          message: 'Please complete the CAPTCHA field in order to progress to the next page'
        }
      }
    },
    onSubmit: () => handleClickOnsubmit(),
    initialValues: {
      depositProduct: depositDetails.depositProduct,
      intendedDepositAmount: depositDetails.intendedDepositAmount ? depositDetails.intendedDepositAmount : '',
      agreementConfirmation: depositDetails.agreementConfirmation ? depositDetails.agreementConfirmation : false,
      applicantsUKResidenceConfirmation: depositDetails.applicantsUKResidenceConfirmation,
      privacyNotice: depositDetails.privacyNotice ? depositDetails.privacyNotice : false,
      fairProcessingNotice: depositDetails.fairProcessingNotice,
      recaptchaResponse: ''
    }
  });

  useEffect(() => {
    dispatch(selectStep(0));
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname, title: 'Start Application' });
    if (!depositProducts.length) dispatch(fetchDepositProducts());
  }, []);

  useEffect(() => {
    if (depositSuccess && onNext) {
      navigate('/personal-details');
    }
  }, [depositSuccess, onNext]);

  const handleClickOnsubmit = () => {
    setOnNext(true);
    ReactGA.event({
      category: 'Start Application',
      action: 'Start Application Next',
      label: 'Start Application Next'
    });
    dispatch(postDepositDetails(data));
  };

  const onAmountKeyDown = (e: React.KeyboardEvent) => {
    if ((e.keyCode < 65 && !e.shiftKey) || (e.keyCode >= 91 && e.keyCode <= 105) || e.metaKey) return;
    e.preventDefault();
  };

  const onAmountInput = (e: React.BaseSyntheticEvent) => {
    let value = (e.target.value as string).replaceAll(',', '');
    if (value !== '') {
      new Array(Math.floor((value.length - 1) / 3)).fill(0).forEach((v, index) => {
        let insertPosition = value.length - (index + 1) * 3 - index;
        value = value.substring(0, insertPosition) + ',' + value.substring(insertPosition, value.length);
      });
    }
    handleChange('intendedDepositAmount', value);
  };

  const policyConfirmation = () => {
    setOpenDilog(false);
    handleChange(dialogType, true);
  };

  const noticeClick = (noticeType: NoticeType) => {
    if (data[noticeType]) {
      handleChange(noticeType, false);
    } else openDialog(noticeType);
  };

  const openDialog = (noticeType: NoticeType) => {
    setDialogType(noticeType);
    setOpenDilog(true);
  };

  return (
    <Box id="deposit-details" className="deposit-details">
      <Box className="title">What you should know before you start</Box>
      <ul className="WorkSansFamily">
        <li>Accounts are available to UK residents aged 18 and over who are liable to pay tax only in the UK.</li>
        <li>
          To open an account with us you must provide the account number and sort code of a UK current account on which
          you are named as an account holder. This “nominated account” must be used as the source of any money deposited
          with us and will also be used as the destination account of any funds withdrawn.
        </li>
        <li>
          You must deposit at least £{ALBA_CONSTANTS.MIN_DEPOSIT_AMOUNT} within 14 calendar days of the account being
          opened. You can hold up to £{ALBA_CONSTANTS.MAX_DEPOSIT_AMOUNT} across all accounts held in your name directly
          with Alba Bank.
        </li>
        <li>You will need to provide an email address and UK mobile phone number. We will use these to talk to you.</li>
        <li>You can manage your Alba Bank savings account by phone or email. Online banking is coming soon.</li>
      </ul>
      <form>
        <Grid container>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required className={errors.depositProduct ? 'error' : ''}>
              <FormLabel className="label">Select your savings account</FormLabel>
              <Select
                className="input"
                variant="standard"
                disableUnderline
                IconComponent={KeyboardArrowDown}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                placeholder={'choose one'}
                value={data.depositProduct}
                onChange={(e: any) => handleChange('depositProduct', e.target.value)}
              >
                <MenuItem disabled value="">
                  Choose one
                </MenuItem>
                {depositProducts?.map((product: DepositProducts, index) => (
                  <MenuItem value={product.productKey} key={index}>
                    {product.displayName}
                  </MenuItem>
                ))}
              </Select>
              {errors.depositProduct && <p className="msg">{errors.depositProduct}</p>}
            </FormControl>
          </Grid>
        </Grid>
        <FormControl fullWidth variant="standard" required className={errors.intendedDepositAmount ? 'error' : ''}>
          <FormLabel className="label">How much do you intend to deposit in total?</FormLabel>
          <Grid container>
            <Grid item xs={12} md={3}>
              <Input
                type="text"
                value={data.intendedDepositAmount || ''}
                onKeyDown={onAmountKeyDown}
                disableUnderline
                fullWidth
                placeholder="Enter amount"
                className="input"
                id="standard-adornment-amount"
                onInput={onAmountInput}
                startAdornment={<InputAdornment position="start">£</InputAdornment>}
              />
            </Grid>
          </Grid>
          {errors.intendedDepositAmount && <p className="msg">{errors.intendedDepositAmount}</p>}
        </FormControl>
        <FormControl className={errors.applicantsUKResidenceConfirmation ? 'error' : ''}>
          <FormLabel className="label" id="demo-row-radio-buttons-group-label">
            Are you resident in the UK and liable to pay tax only in the UK? *
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={data.applicantsUKResidenceConfirmation}
            onChange={(e) => handleChange('applicantsUKResidenceConfirmation', e.target.value)}
          >
            <FormControlLabel className="radio" value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel className="radio" value="No" control={<Radio />} label="No" />
          </RadioGroup>
          {errors.applicantsUKResidenceConfirmation && (
            <p className="msg">{errors.applicantsUKResidenceConfirmation}</p>
          )}
        </FormControl>
        <Box className={errors.recaptchaResponse ? 'error' : ''}>
          <Reaptcha
            className="recaptcha"
            sitekey={import.meta.env.VITE_CAPTCH_SITE_KEY}
            onVerify={(response) => handleChange('recaptchaResponse', response)}
            onExpire={() => handleChange('recaptchaResponse', '')}
          ></Reaptcha>
          {errors.recaptchaResponse && <p className="msg">{errors.recaptchaResponse}</p>}
        </Box>
        <Box className="label">Your privacy matters</Box>
        <Box className="privacy-text">
          We take your privacy seriously and want to make sure that you understand how the personal information you give
          us will be used. Please read our <Link onClick={() => openDialog('privacyNotice')}>Privacy Notice</Link> which
          you also can find on our website, or you can ask us for a copy.
          {/* <Link onClick={() => openDialog('fairProcessingNotice')}>Fair Processing Notice</Link> which you also can find */}
        </Box>
        <Box className="checkbox" sx={{ flexDirection: 'column' }}>
          <FormControl className={errors.privacyNotice ? 'error' : ''}>
            <FormControlLabel
              control={
                <Checkbox icon={<CheckBoxOutlineBlank />} checkedIcon={<Check />} checked={data.privacyNotice} />
              }
              label="I confirm that I have read the Privacy Notice"
              onChange={() => noticeClick('privacyNotice')}
            />
            {errors.privacyNotice && <p className="msg">{errors.privacyNotice}</p>}
          </FormControl>
        </Box>
        <hr className="deposit-details"></hr>
        <Box className="label">Fair Processing Notice</Box>
        <Box className="privacy-text">
          The personal information we have collected from you will be shared with fraud prevention agencies who will use
          it to prevent fraud and money-laundering and to verify your identity. If fraud is detected, you could be
          refused certain services, finance, or employment. Further details of how your information will be used by us
          and these fraud prevention agencies, and your data protection rights, can be found here:{' '}
          <a href="http://www.cifas.org.uk/fpn" target="_blank">
            www.cifas.org.uk/fpn.
          </a>
        </Box>
        <Box className="checkbox" sx={{ flexDirection: 'column' }}>
          <FormControl className={errors.fairProcessingNotice ? 'error' : ''}>
            <FormControlLabel
              control={
                <Checkbox
                  icon={<CheckBoxOutlineBlank />}
                  checkedIcon={<Check />}
                  checked={data.fairProcessingNotice}
                  onChange={() => noticeClick('fairProcessingNotice')}
                />
              }
              label="I confirm that I have read and understood the Fair Processing Notice attached."
            />
            {errors.fairProcessingNotice && <p className="msg">{errors.fairProcessingNotice}</p>}
          </FormControl>
        </Box>
        <hr className="deposit-details"></hr>
        <Box className="label">Confirmation</Box>

        <Box className="checkbox" sx={{ flexDirection: 'column' }}>
          <FormControl className={errors.agreementConfirmation ? 'error' : ''}>
            <FormControlLabel
              control={
                <Checkbox
                  icon={<CheckBoxOutlineBlank />}
                  checkedIcon={<Check />}
                  checked={data.agreementConfirmation}
                  onChange={() => handleChange('agreementConfirmation', !data.agreementConfirmation)}
                />
              }
              label="I confirm that I have read the requirements in the “What you should know before you start”"
            />
            {errors.agreementConfirmation && <p className="msg">{errors.agreementConfirmation}</p>}
          </FormControl>
        </Box>
      </form>
      <CommonNextButton handleSteps={() => handleSubmit()} />
      <CustomizedDialogsBox
        title={dialogType === 'privacyNotice' ? 'Privacy Notice' : 'Fair Processing Notice Acceptance'}
        subTitle={''}
        open={openDilog}
        handleClose={() => setOpenDilog(false)}
        handleSubmit={policyConfirmation}
      >
        {dialogType === 'privacyNotice' ? (
          <Box>
            <ul>
              <li>
                We take your privacy seriously and we have updated our privacy policy in line with the General Data
                Protection Regulation 2016 and the Data Protection Act 2018.
              </li>
              <li>
                Please read our privacy notice carefully to get a clear understanding of how we collect, use, protect or
                otherwise handle your Personally Identifiable Information.
              </li>
              <li>
                By using any of our services you agree to be bound by the policies set out in this privacy notice. We
                are fully committed to protecting the privacy and safeguarding the use of your personal information and
                we will keep this privacy notice updated, therefore check back regularly to review any amendments.
              </li>
              <li>
                <strong> Who are we?</strong>
              </li>
              <li>Alba Bank Limited is a limited company registered in Scotland.</li>
              <li>
                If there are any questions regarding this privacy policy, you may contact us by email{' '}
                <a href="mailto:enquiries@albabank.co.uk">enquiries@albabank.co.uk</a>
              </li>
              <li>What personal information do we collect from the people that visit our website?</li>
              <li>
                <strong>Cookies</strong>
              </li>
              <li>
                <strong>
                  Cookies are small files that a site or its service provider transfers to your computer’s hard drive
                  through your Web browser (if you allow) that enables the site’s or service provider’s systems to
                  recognise your browser and capture and remember certain information. They are also used to help us
                  understand your preferences based on previous or current site activity, which enables us to provide
                  you with improved services. We also use cookies to help us compile aggregate data about site traffic
                  and site interaction so that we can offer better site experiences and tools in the future.
                </strong>
              </li>
              <li>We may use cookies to:</li>
              <li>Understand and save user’s preferences for future visits.</li>
              <li>
                Compile aggregate data about site traffic and site interactions in order to offer better site
                experiences and tools in the future. We may also use trusted third-party services that track this
                information on our behalf.
              </li>
              <li>
                You can choose to have your computer warn you each time a cookie is being sent, or you can choose to
                turn off all cookies. You do this through your browser settings. Since browser is a little different,
                look at your browser’s Help Menu to learn the correct way to modify your cookies.
              </li>
              <li>
                If you turn cookies off, some features will be disabled. It won’t affect the user’s experience, but
                could affect your browsers functions that make your site experience more efficient.
              </li>
              <li>
                <strong>Analytics</strong>
              </li>
              <li>
                <strong>We may use third-party Service Providers to monitor and analyse the use of our Service.</strong>
              </li>
              <li>
                <strong>Google Analytics</strong>
              </li>
              <li>
                <strong>
                  Google Analytics is a web analytics service offered by Google that tracks and reports website traffic.
                  Google uses the data collected to track and monitor the use of our Service. This data is shared with
                  other Google services. Google may use the collected data to contextualise and personalise the ads of
                  its own advertising network.
                </strong>
              </li>
              <li>
                You can opt-out of having made your activity on the Service available to Google Analytics by installing
                the Google Analytics opt-out browser add-on. The add-on prevents the Google Analytics JavaScript (ga.js,
                analytics.js, and dc.js) from sharing information with Google Analytics about visits activity.
              </li>
              <li>
                For more information on the privacy practices of Google, please visit the Google Privacy & Terms web
                page:
                <a href="https://policies.google.com/privacy?hl=en" target="_blank">
                  https://policies.google.com/privacy
                </a>
              </li>
              <li>
                <strong>
                  For questions relating to our privacy policy please email{' '}
                  <a href="mailto:enquiries@albabank.co.uk"> enquiries@albabank.co.uk</a>
                </strong>
              </li>
            </ul>
          </Box>
        ) : (
          <Box>
            <ul>
              <li>
                This Fair Processing Notice describes how Alba Bank (“we”, “us”, “our”) collects and processes personal
                information about you; how this information is used and protected, and your rights in relation to this
                information. Further details of how we use and protect your personal data are available on request.
              </li>
              <li>
                <strong>Short Notice</strong>
              </li>
              <li>
                The personal information we have collected from you may be shared with fraud prevention agencies who
                will use it to prevent fraud and money-laundering and to verify your identity. If fraud is detected, you
                could be refused certain services or finance. Further details of how your information will be used by us
                and these fraud prevention agencies, and your data protection rights, can be found here:
                <a href="http://www.cifas.org.uk/fpn" target="_blank">
                  {' '}
                  www.cifas.org.uk/fpn
                </a>
              </li>
              <li>
                <strong>Full Notice</strong>
              </li>
              <li>
                <strong>GENERAL</strong>
              </li>
              <li>
                Before we provide services, goods, deposit products or financing products to you, we undertake checks
                for the purposes of preventing fraud and money laundering, and to verify your identity. These checks
                require us to process personal data about you. The personal data you have provided, we have collected
                from you or we have received from third parties will be used to prevent fraud, money laundering and to
                verify your identity.
              </li>
              <li>Details of the personal information that will be processed include, for example: </li>
              <ol>
                <li>● Name</li>
                <li>● Address </li>
                <li>● Date of birth </li>
                <li>● Contact details </li>
                <li>● Financial information </li>
                <li>● Employment details and</li>
                <li>● Device identifiers including IP address and vehicle details. </li>
              </ol>
              <li>
                We and fraud prevention agencies may also enable law enforcement agencies to access and use your
                personal data to detect, investigate and prevent crime
              </li>
              <li>
                We process your personal data on the basis that we have a legitimate interest in preventing fraud and
                money laundering and to verify identity to protect our business and to comply with laws that apply to
                us. Such processing is also a contractual requirement of the services or financing you have requested.
              </li>

              <li>
                <strong>PROCESSING OF DATA FOR VULNERABLE CUSTOMERS</strong>
              </li>

              <li>
                At any time, you may find yourself in a vulnerable situation or caring for someone experiencing a
                vulnerability. We may need to record some more information about you or the person experiencing
                vulnerability to enable us to best facilitate services to you or tailor the most appropriate products to
                suit your needs or the needs of the person experiencing a vulnerability. Whether that’s a requirement
                for a sign language interpreter, or braille documentation or simply needing to speak slower. There’s an
                array of adjustments we can provide to adapt to your needs, and we will maintain record of such
                requirements as part of your customer records, or the records of the person you are caring for, with us.
                We will only record this information / data where there is a legitimate reason or legal requirement for
                us to do so and / or where we have your consent. The data you provide may be determined to be special
                category data.
              </li>

              <li>
                <strong>PROCESSING OF DATA IN LENDING APPLICATIONS</strong>
              </li>

              <li>
                We may also be required to process the personal data of any person linked to your application for
                finance, including:
              </li>
              <ol>
                <li>● Any joint applicants; </li>
                <li>● Any person with whom your finances are linked;</li>
                <li>● Any person with at least a 25% share in your business; and</li>
                <li>● Any guarantor or any director or partner in order to assess your application for finance. </li>
              </ol>
              <li>
                You are responsible for sharing this Fair Processing Notice with them so they are aware how their
                personal data may be processed. We will rely on legitimate interest as the lawful basis for processing
                your personal data (and the personal data of any linked person) in these ways.
              </li>

              <li>
                We may also share information with third parties such as our funders to whom we may assign our
                agreements. Details of these third parties and how they may process your data can be found on our
                website{' '}
                <a href="http://www.AlbaBank.co.uk" target="_blank">
                  http://www.AlbaBank.co.uk.
                </a>
              </li>

              <li>
                If your application is successful and you enter into an Agreement with us, we will use your data to
                provide finance to you, for the ongoing administration of your Agreement and to help understand customer
                needs and business trends to improve our products and services. We rely on legitimate interest, legal
                requirement or performance of a contract to process your personal data (and that of any linked person)
                in these ways.
              </li>

              <li>
                We may use your personal data to advise you about our other services and products which may be of
                interest to you (where you have consented to receive such marketing materials). We will rely on consent
                as the lawful ground for processing your personal data for marketing purposes and will obtain consent
                from you before sending any marketing communications. You may withdraw your consent for marketing
                activities at any time by XXX.
              </li>

              <li>
                <strong>USE OF CREDIT REFERENCE AGENCIES (CRAs) </strong>
              </li>

              <li>
                We will use personal data for our legitimate interest (some of which is obtained from you as part of
                your application) and some of which is obtained from publicly accessible sources, such as credit
                reference agencies (“CRAs”), in connection with any pre-application or quotation, application or any
                Agreement you enter with us.
              </li>

              <li>
                We may supply your personal information to CRAs, and they may give us information about you. This may
                include information from your credit application and about your financial situation and financial
                history.
              </li>

              <li>
                CRAs will supply to us both public (including the electoral register) and shared credit, financial
                situation and financial history and fraud prevention information. We will use your personal data to
                assess your application for finance and, if your application is successful, to provide the requested
                financial services to you and for their ongoing administration.
              </li>

              <li>
                We may conduct a credit search using your details at any time during the life of your Agreement with us
                and we may also use that data in contemplation of legal action or enforcement. We will rely on
                performance of a contract and legal requirement as the lawful basis for processing your personal data in
                these ways.
              </li>

              <li>
                Commercial Credit Searches we make with credit reference agencies will leave a ‘search marker’ on your
                file. This will appear in the “number of searches” area of your Commercial Credit Report without
                identifying us as a lender and will not provide any detail as to the nature of the search unless you
                proceed with a Finance Agreement with Alba Bank. A search marker is different from a footprint on a
                consumer search in that it does not impact your score with the CRA in the same way as a consumer
                footprint. We would not undertake any consumer or personal searches without your consent to do so.
              </li>

              <li>
                We will also provide CRAs with information relating to your performance in relation to your account or
                facility/ies with us. These searches (and performance details of any Finance Agreements) may be accessed
                by other financial companies in connection with any applications for credit that you may make to them
                and may affect your ability to obtain credit with them.
              </li>

              <li>
                <strong>RETENTION OF YOUR DATA</strong>
              </li>

              <li>
                We will hold your personal information for the following periods for our legitimate interests and to
                comply with legal and regulatory requirements and your performance under any contract with us:
              </li>
              <ol>
                <li>
                  ● Banking, savings and lending applications that are cancelled, declined or not funded – normally up
                  to 1 (one) year from application
                </li>
                <li>
                  ● Banking, savings and lending accounts that are opened and funded – normally up to 6 (six) years
                  after the account is closed
                </li>
              </ol>
              <li>
                Based on our legitimate interests, to comply with legal & compliance requirements and your performance
                under any contract with us, your personal information may be kept for longer than the aforementioned
                periods, for example, if we are dealing with an ongoing complaint or to fulfil our legal or regulatory
                obligations.
              </li>

              <li>
                Fraud prevention agencies can hold your personal data for different periods of time, and if you are
                considered to pose a fraud or money laundering risk, your data can be held for up to 6 (six) years.
              </li>

              <li>
                If you would like further information about our data retention practices, contact our Data Protection
                Officer.
              </li>

              <li>
                <strong>CONSEQUENCES OF PROCESSING</strong>
              </li>

              <li>
                If we, or a fraud prevention agency, determine that you pose a fraud or money laundering risk, we may
                refuse to provide the services or financing you have requested, or we may stop providing existing
                services to you.
              </li>

              <li>
                A record of any fraud or money laundering risk will be retained by the fraud prevention agencies and may
                result in others refusing to provide services or financing. If you have any questions about this, please
                contact us on the details above.
              </li>

              <li>
                <strong>DATA TRANSFERS</strong>
              </li>

              <li>
                Fraud prevention agencies may allow the transfer of your personal data outside the UK. This may be to a
                country where the UK Government has decided that your data will be protected to UK standards, but if the
                transfer is to another type of country then the fraud prevention agencies will ensure your data
                continues to be protected by ensuring appropriate safeguards are in place.
              </li>

              <li>
                <strong>POWER OF ATTORNEY</strong>
              </li>

              <li>
                We will provide this fair processing notice to the holder of a valid power of attorney for you when we
                make contact with them directly. That person will be allowed to see the personal information we hold on
                you.
              </li>

              <li>
                <strong>YOUR RIGHTS</strong>
              </li>

              <li>
                Your personal data is protected by legal rights as follows (noting that these rights don’t apply in all
                circumstances):
              </li>

              <li>
                <strong>Right to access </strong>
              </li>
              <li>
                You have a right of access under the data privacy laws to information we hold about you on our records.
              </li>

              <li>
                <strong>Right to rectification </strong>
              </li>
              <li>
                If you become aware that we are holding information about you which is in any way incorrect, please let
                us know immediately so that we may amend it as quickly as possible.
              </li>

              <li>
                <strong>Right to erasure </strong>
              </li>
              <li>You have the right to require us to delete your data, subject to certain legal requirements. </li>

              <li>
                <strong>Right to restriction of processing </strong>
              </li>
              <li>
                You have the right to require us to restrict the way in which we process your personal data. You may
                wish to restrict processing if, for example: you contest the accuracy of the data and wish to have it
                corrected, you object to processing but we are required to retain the data for reasons of public
                interest, or if you would prefer restriction to erasure.
              </li>

              <li>
                <strong>Right to data portability </strong>
              </li>
              <li>
                You have the right to obtain from us easily and securely the personal data we hold on you for any
                purpose you see fit.
              </li>

              <li>
                <strong>Right to object to processing </strong>
              </li>
              <li>
                You have the right to require us to stop processing your personal data should you wish the data to be
                retained but no longer processed.
              </li>

              <li>
                <strong>Right to withdraw consent</strong>
              </li>
              <li>You have the right at any time to withdraw consent allowing us to process your personal data.</li>

              <li>
                For more information or to exercise your data protection rights, please contact us using{' '}
                <a href={'tel:' + ALBA_CONSTANTS.CUSTOMER_CARE_NUMBER}>{ALBA_CONSTANTS.CUSTOMER_CARE_NUMBER}</a>. You
                also have a right to complain to the Information Commissioner's Office (ICO), which regulates the
                processing of personal data. The ICO website{' '}
                <a href="https://ico.org.uk/" target="_blank">
                  https://ico.org.uk/
                </a>
              </li>
            </ul>
          </Box>
        )}
      </CustomizedDialogsBox>
    </Box>
  );
};
