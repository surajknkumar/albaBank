'use client';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import style from './page.module.css';
import {
  BY_PASS,
  INPUT_CROSS,
  STATUS_PENDING,
  STATUS_FAILED,
  STATUS_PARTIAL,
  STATUS_VERIFIED,
  VERIFICATION_CHECK,
  VERIFICATION_FAILED,
  V_CANCEL,
  V_CANCEL_F,
  V_CHECK,
  V_CHECK_S
} from '@svgs';
import { ShortInfo } from '@app/components/short-info';
import { useRouter } from 'next/navigation';
import { AppModal } from '@app/components/pop-up';
import { useAppDispatch, useAppSelector } from '@app/store/redux/hooks';
import { getHistoryList, getQuestionVerification } from '@app/store/redux/selectors';
import { AdditionalVerification } from '@app/models/interfaces/clients.interface';
import { fetchClientVerificationDetails, setAlertDetails, setClientStatus } from '@app/store';
import { firstLetterToUpperCase } from '@utils/helpers';
import { QuestionVerification, VerificationType } from '@app/models/enum/client.enum';
import clientService from '@app/services/client.service';

export default function IdentityVerification({ params }: { params: { customerId: string } }) {
  const router = useRouter();
  const effectRan = useRef(false);
  const dispatch = useAppDispatch();
  const [answerChar, setAnswerChar] = useState(['', '']);
  const [showVerifyButton, setShowVerifyButton] = useState([true, true]);
  const securityQuestionDetails = useAppSelector(getQuestionVerification);
  const historyImage = {
    [VerificationType.VERIFIED]: STATUS_VERIFIED,
    [VerificationType.BYPASSED]: STATUS_VERIFIED,
    [VerificationType.PARTIAL]: STATUS_PARTIAL,
    [VerificationType.FAILED]: STATUS_FAILED,
    [VerificationType.PENDING]: STATUS_PENDING
  };
  const additionalVerificationImage = {
    V_CHECK_S: V_CHECK_S,
    VERIFICATION_FAILED: VERIFICATION_FAILED,
    VERIFICATION_CHECK: VERIFICATION_CHECK,
    V_CHECK: V_CHECK,
    V_CANCEL_F: V_CANCEL_F,
    V_CANCEL: V_CANCEL
  };
  const historyDetails = useAppSelector(getHistoryList);
  const [bypass, setBypass] = useState({
    isBypass: false,
    bypassReason: ''
  });
  const [verificationStatus, setVerificationStatus] = useState(false);
  const [isByPassClick, setIsByPassClick] = useState(false);
  const [additionalVerification, setAdditionalVerification] = useState<AdditionalVerification>({
    dob: null,
    emailId: null,
    mobileNumber: null,
    postcode: null
  });

  const [answerVerification, setAnswerVerification] = useState<string[]>([
    QuestionVerification.PENDING,
    QuestionVerification.PENDING
  ]);

  const additionalVerificationItems = [
    { key: 'dob', displayName: 'Birth Date', value: securityQuestionDetails.additional.dob },
    { key: 'mobileNumber', displayName: 'Mobile Number', value: securityQuestionDetails.additional.mobileNumber },
    { key: 'emailId', displayName: 'Email ID', value: securityQuestionDetails.additional.emailId },
    { key: 'postcode', displayName: 'Post Code', value: securityQuestionDetails.additional.postcode }
  ];

  useEffect(() => {
    if (!effectRan.current) dispatch(fetchClientVerificationDetails(params.customerId));
    return () => {
      effectRan.current = true;
    };
  }, []);
  const showToaster = (severity: string, message: string) => {
    dispatch(
      setAlertDetails({
        open: true,
        severity,
        message
      })
    );
  };
  const questionVerification = async (qvId: string, index: number) => {
    if (answerChar[index] === ' ' || !answerChar[index]) {
      showToaster('error', 'Please enter alphabet or number.');
      return;
    }
    dispatch(setClientStatus('loading'));
    clientService
      .verifyQuestion(params.customerId, {
        qvId: qvId,
        answer: answerChar[index]
      })
      .then((response) => {
        let tmpAnswerVerification = [...answerVerification];
        if (!response.data.code) {
          tmpAnswerVerification[index] = response.data.data.verified
            ? QuestionVerification.VERIFIED
            : QuestionVerification.FAILED;
          setAnswerVerification(tmpAnswerVerification);
        } else {
          showToaster('error', response.data.message);
        }
      })
      .finally(() => {
        dispatch(setClientStatus('idle'));
      });
  };
  const byPassVerification = () => {
    if (verificationStatus) {
      router.replace('/');
    }
    if (bypass.bypassReason.length > 9) {
      verifyPersonalDetails();
      setIsByPassClick(false);
    } else {
      showToaster('error', 'Remarks should contain at least 10 characters');
    }
  };
  const verifyPersonalDetails = async () => {
    let payload = {
      cvhId: securityQuestionDetails.cvhId,
      additional: additionalVerification,
      bypass: bypass.isBypass,
      bypassReason: bypass.bypassReason
    };
    dispatch(setClientStatus('loading'));
    clientService
      .verifyIdentity(params.customerId, payload)
      .then(
        (response) => {
          response.data.data.code === 403 ? setVerificationStatus(true) : router.replace('user-overview');
        },
        (reason) => {
          showToaster('error', reason.message);
        }
      )
      .finally(() => {
        dispatch(setClientStatus('idle'));
      });
  };
  const additionalVerificationCheck = (key: string, value: string) => {
    const tmp = additionalVerification;
    tmp[key as keyof typeof additionalVerification] = value;
    setAdditionalVerification((prv) => ({ ...prv, ...tmp }));
  };
  const retryVerification = (questionIndex: number) => {
    let tmpAnswerChar = [...answerChar];
    tmpAnswerChar[questionIndex] = '';
    setAnswerChar(tmpAnswerChar);
    let tmpAnswerVerification = [...answerVerification];
    tmpAnswerVerification[questionIndex] = QuestionVerification.PENDING;
    setAnswerVerification(tmpAnswerVerification);
  };
  return (
    <Box sx={{ paddingBottom: 5 }}>
      <AppModal
        isCloseButton={verificationStatus}
        callBack={() => {
          byPassVerification();
        }}
        ButtonName={verificationStatus ? 'Back to Home' : 'Submit'}
        open={isByPassClick}
        setOpen={setIsByPassClick}
      >
        <Box
          sx={{
            padding: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Image height={100} width={100} src={BY_PASS} alt="BY PASS" priority />
          <Typography
            sx={{
              fontFamily: 'Merriweather',
              fontSize: '28px',
              fontWeight: 700,
              lineHeight: '40px',
              letterSpacing: '0em',
              paddingY: '10px',
              textAlign: 'center'
            }}
          >
            {verificationStatus ? 'Sorry Identity Verification Failed' : 'Remark for bypassing verification'}
          </Typography>
          {!verificationStatus && (
            <TextField
              multiline
              sx={{
                background: '#F4F4F4'
              }}
              inputProps={{
                style: { width: '600px', height: '120px' }
              }}
              value={bypass.bypassReason}
              onChange={(e) => {
                setBypass((prev) => ({ ...prev, isBypass: true, bypassReason: e.target.value }));
              }}
            ></TextField>
          )}
        </Box>
      </AppModal>
      <Box
        key={'identity'}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          border: '1px solid #221C351A',
          margin: 4
        }}
      >
        <ShortInfo />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'start',
            padding: '35px 30px 40px',
            fontWeight: '500'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ fontSize: '28px', lineHeight: '34px', fontWeight: 500 }}>Identity Verification</Box>
            <Link
              sx={{ fontSize: '18px', color: '#0073C7', textDecoration: 'none', cursor: 'pointer' }}
              onClick={() => setIsByPassClick(true)}
            >
              Bypass Verification
            </Link>
          </Box>
          {securityQuestionDetails &&
            securityQuestionDetails.questions.map((question: any, questionIndex: number) => (
              <Box sx={{ display: 'flex', flexDirection: 'column', margin: '35px 8px 10px' }} key={questionIndex}>
                <Typography>Question {questionIndex + 1}</Typography>
                <Box sx={{ paddingY: 2 }}>
                  <span style={{ color: 'rgba(34, 28, 53, 0.5)', fontWeight: '400' }}>{`Provide the ${
                    question.askCharNumber
                  }${
                    question.askCharNumber === 1
                      ? 'st'
                      : question.askCharNumber === 2
                        ? 'nd'
                        : question.askCharNumber === 3
                          ? 'rd'
                          : 'th'
                  } letter for`}</span>
                  <span> {`( ${question.question} )`}</span>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {question.answerMasked.split('').map((e: string, index: number) => {
                    return e === '_' ? (
                      <TextField
                        sx={{
                          width: '40px',
                          height: '40px',
                          marginX: '6px',
                          flexShrink: 0,
                          marginY: 1,
                          boxSizing: 'border-box',
                          border: `1px solid ${
                            answerVerification[questionIndex] === QuestionVerification.FAILED ? '#FC2F2F' : '#D9D9D9'
                          }`,

                          borderRadius: 1,
                          '& .MuiInputBase-input': {
                            height: '40px',
                            textAlign: 'center',
                            fontWeight: '500',
                            fontSize: '26px'
                          },
                          '& .MuiInputBase-input.Mui-disabled': {
                            WebkitTextFillColor: `${
                              answerVerification[questionIndex] === QuestionVerification.FAILED ? '#FC2F2F' : '#000000'
                            }`
                          }
                        }}
                        disabled={!(answerVerification[questionIndex] === QuestionVerification.PENDING)}
                        onChange={(event) => {
                          let tmpAnswerChar = [...answerChar];
                          tmpAnswerChar[questionIndex] = event.target.value;
                          setAnswerChar(tmpAnswerChar);
                          let tmpVerification = [...showVerifyButton];
                          tmpVerification[questionIndex] = event.target.value === '' ? true : false;
                          setShowVerifyButton([...tmpVerification]);
                        }}
                        inputProps={{ maxLength: 1, autoComplete: 'off' }}
                        value={answerChar[questionIndex]}
                        key={index}
                      />
                    ) : (
                      <Box
                        key={index}
                        sx={{
                          border: e === ' ' ? 0 : '1px solid #D9D9D9',
                          width: '40px',
                          height: '40px',
                          flexShrink: 0,
                          marginY: 1,
                          marginX: '6px',
                          alignItems: 'center',
                          display: 'flex',
                          justifyContent: 'center',
                          boxSizing: 'border-box',
                          borderRadius: 1
                        }}
                      >
                        {e !== ' ' && <Image height={20} width={20} src={INPUT_CROSS} alt="INPUT CROSS" priority />}
                      </Box>
                    );
                  })}

                  {answerVerification[questionIndex] !== QuestionVerification.PENDING ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Image
                        height={40}
                        width={40}
                        src={
                          answerVerification[questionIndex] === QuestionVerification.VERIFIED
                            ? additionalVerificationImage.VERIFICATION_CHECK
                            : additionalVerificationImage.VERIFICATION_FAILED
                        }
                        alt="VERIFICATION CHECK"
                        priority
                        style={{ marginLeft: '16px' }}
                      />
                      {answerVerification[questionIndex] === QuestionVerification.FAILED && (
                        <Box
                          sx={{
                            color: '#0073C7',
                            paddingX: 2
                          }}
                        >
                          <a
                            style={{ textDecoration: 'underline', cursor: 'pointer' }}
                            onClick={() => retryVerification(questionIndex)}
                          >
                            {' '}
                            Retry
                          </a>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        disabled={showVerifyButton[questionIndex]}
                        variant="contained"
                        sx={{
                          height: 40,
                          width: 130,
                          marginX: 2
                        }}
                        onClick={() => questionVerification(question.qvId, questionIndex)}
                      >
                        Verify
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
        </Box>
        <Box>
          <Accordion
            square={true}
            sx={{
              background: '#FFF',
              borderRadius: 0,
              boxShadow: 0,
              marginY: 1,
              '&::before': { top: 0 }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{
                height: '64px',
                padding: '0 42px',
                borderRadius: 0,
                marginTop: 0,
                background: 'rgba(244, 244, 244, 1)'
              }}
            >
              <Typography sx={{ fontWeight: 500 }}>Personal & Contact Details (for additional verification)</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: '38px 90px 28px' }}>
              <Grid container rowSpacing={3} columnSpacing={5}>
                {additionalVerificationItems.map((item, index) => (
                  <Grid
                    key={index}
                    item
                    xs={12}
                    lg={6}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: '#221C35'
                    }}
                  >
                    <Typography sx={{ fontSize: '14px', lineHeight: '18px', fontWeight: 300, width: '126px' }}>
                      {item.displayName}
                    </Typography>
                    <Typography sx={{ fontSize: '14px', lineHeight: '18px', fontWeight: 300, margin: '0 10px' }}>
                      :
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        lineHeight: '18px',
                        fontWeight: '500',
                        width: '230px',
                        padding: '0 20px',
                        wordWrap: 'break-word'
                      }}
                    >
                      {item.value}
                    </Typography>
                    <Image
                      className={style.additionalButton}
                      src={
                        additionalVerification[item.key as keyof typeof additionalVerification] === 'yes'
                          ? additionalVerificationImage['V_CHECK_S']
                          : additionalVerificationImage['V_CHECK']
                      }
                      alt="V CHECK S"
                      onClick={() => additionalVerificationCheck(item.key, 'yes')}
                    />
                    <Image
                      className={style.additionalButton}
                      style={{ marginLeft: '24px' }}
                      src={
                        additionalVerification[item.key as keyof typeof additionalVerification] === 'no'
                          ? additionalVerificationImage['V_CANCEL_F']
                          : additionalVerificationImage['V_CANCEL']
                      }
                      alt="V CHECK S"
                      priority
                      onClick={() => additionalVerificationCheck(item.key, 'no')}
                    />
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion
            square={true}
            sx={{
              background: '#FFF',
              borderRadius: 0,
              boxShadow: 0,
              '&::before': { top: 0 },
              marginY: 2
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
              sx={{
                height: '64px',
                borderRadius: 0,
                padding: '0 42px',
                background: 'rgba(244, 244, 244, 1)'
              }}
            >
              <Typography sx={{ fontWeight: 500 }}>Verification History</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: '0 0 5px', width: '99%' }}>
              {historyDetails.length > 0 ? (
                <Box sx={{ fontWeight: '500', fontSize: '16px' }}>
                  <Grid
                    container
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '40px',
                      background: 'rgba(244, 244, 244, 0.4)',
                      padding: '5px 80px'
                    }}
                  >
                    <Grid item xs={5} lg={3}>
                      Date & Time
                    </Grid>
                    <Grid item xs={5} lg={4.5}>
                      Agent Name
                    </Grid>
                    <Grid item xs={2} lg={4.5}>
                      Status
                    </Grid>
                  </Grid>
                  <Box sx={{ maxHeight: '250px', overflow: 'scroll' }}>
                    {historyDetails.map((historyItem, index: number) => (
                      <Grid container sx={{ padding: '10px 80px', alignItems: 'center' }} key={index}>
                        <Grid item xs={5} lg={3}>
                          {historyItem.performedAt}
                        </Grid>
                        <Grid item xs={5} lg={4.5}>
                          {historyItem.agentName}
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          lg={4.5}
                          sx={{
                            width: '21px',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                          }}
                        >
                          {historyItem.status ? (
                            <Image
                              height={14}
                              width={14}
                              src={historyImage[historyItem.status]}
                              alt="STATUS VERIFIED"
                              priority
                              style={{ padding: '0 5px' }}
                            />
                          ) : (
                            <span style={{ padding: '0 10px' }}>-</span>
                          )}
                          <Typography sx={{ fontWeight: 300, fontSize: '14px', whiteSpace: 'nowrap' }}>
                            {firstLetterToUpperCase(
                              historyItem.status === VerificationType.PARTIAL ? 'Partial Verified' : historyItem.status
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>No History Found</Box>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          disabled={
            !(
              (answerVerification[0] === QuestionVerification.VERIFIED &&
                answerVerification[1] === QuestionVerification.VERIFIED) ||
              (((answerVerification[0] === QuestionVerification.VERIFIED &&
                answerVerification[1] === QuestionVerification.FAILED) ||
                (answerVerification[1] === QuestionVerification.VERIFIED &&
                  answerVerification[0] === QuestionVerification.FAILED)) &&
                (additionalVerification.dob === 'yes' ||
                  additionalVerification.emailId === 'yes' ||
                  additionalVerification.mobileNumber === 'yes' ||
                  additionalVerification.postcode === 'yes'))
            )
          }
          variant="contained"
          sx={{
            height: 50,
            width: 400,
            marginX: 2
          }}
          onClick={() => verifyPersonalDetails()}
        >
          Proceed
        </Button>
      </Box>
    </Box>
  );
}
