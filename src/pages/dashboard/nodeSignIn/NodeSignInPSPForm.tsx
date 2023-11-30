import { useHistory } from 'react-router';
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { theme } from '@pagopa/mui-italia';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { Badge as BadgeIcon, BookmarkAdd as BookmarkAddIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import ROUTES from '../../../routes';

import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { Party } from '../../../model/Party';
import { LOADING_TASK_CHANNEL_ADD_EDIT } from '../../../utils/constants';
import FormSectionTitle from '../../../components/Form/FormSectionTitle';
import { NodeOnSignInPSP } from '../../../model/Node';
import {
  createPSPDirect,
  createPSPIndirect,
  createPspBroker,
  updatePSPInfo,
} from '../../../services/nodeService';
import { useSigninData } from '../../../hooks/useSigninData';
import { BrokerOrPspDetailsResource } from '../../../api/generated/portal/BrokerOrPspDetailsResource';
import { isPspBrokerSigned, isPspSigned } from '../../../utils/rbac-utils';
import CommonRadioGroup from './components/CommonRadioGroup';

type Props = {
  goBack: () => void;
  signInData: BrokerOrPspDetailsResource;
};

const NodeSignInPSPForm = ({ goBack, signInData }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();

  const setLoading = useLoading(LOADING_TASK_CHANNEL_ADD_EDIT);

  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const updateSigninData = useSigninData();
  const [intermediaryAvailableValue, setIntermediaryAvailableValue] = useState<boolean>(false);
  const pspDirect = isPspBrokerSigned(signInData) && isPspSigned(signInData);

  useEffect(() => {
    if (pspDirect) {
      setIntermediaryAvailableValue(true);
    } else {
      setIntermediaryAvailableValue(false);
    }
  }, [selectedParty]);

  const initialFormData = (selectedParty?: Party) => ({
    name: selectedParty?.fiscalCode ?? '',
    businessName: selectedParty?.description ?? '',
    fiscalCode: selectedParty?.fiscalCode ?? '',
    abiCode: selectedParty?.pspData?.abi_code ?? '',
    pspCode:
      signInData.paymentServiceProviderDetailsResource?.psp_code ?? selectedParty?.fiscalCode ?? '',
    bicCode: signInData.paymentServiceProviderDetailsResource?.bic ?? '',
    digitalStamp: signInData.paymentServiceProviderDetailsResource?.stamp ? true : false,
  });

  const inputGroupStyle = {
    borderRadius: 1,
    border: 1,
    borderColor: theme.palette.divider,
    p: 3,
    mb: 3,
  };

  const validate = (values: Partial<NodeOnSignInPSP>) =>
    Object.fromEntries(
      Object.entries({
        bicCode: !values.bicCode ? t('nodeSignInPage.validationMessage.requiredField') : undefined,
        digitalStamp:
          values.digitalStamp === undefined
            ? t('nodeSignInPage.validationMessage.requiredField')
            : undefined,
      }).filter(([_key, value]) => value)
    );

  const handleChangeNumberOnly = (
    e: React.ChangeEvent<any>,
    field: string,
    formik: FormikProps<NodeOnSignInPSP>
  ) => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === '' || regex.test(e.target.value)) {
      formik.setFieldValue(field, e.target.value);
    }
  };

  const formik = useFormik<NodeOnSignInPSP>({
    initialValues: initialFormData(selectedParty),
    validate,
    onSubmit: async () => {
      await submit();
    },
    enableReinitialize: true,
  });

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const submit = async () => {
    setLoading(true);

    if (selectedParty && isPspSigned(signInData)) {
      try {
        if (!isPspBrokerSigned(signInData) && intermediaryAvailableValue) {
          await createPspBroker({
            broker_psp_code: selectedParty.fiscalCode,
            description: selectedParty.description,
            enabled: true,
            extended_fault_bean: true,
          });
        }

        if (signInData.paymentServiceProviderDetailsResource?.psp_code) {
          await updatePSPInfo(
            signInData.paymentServiceProviderDetailsResource.psp_code,
            formik.values
          );
        }

        await updateSigninData(selectedParty);
      } catch (reason) {
        addError({
          id: 'NODE_SIGNIN_PSP_UPDATE',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while updating PSP data on the node`,
          toNotify: true,
          displayableTitle: t('nodeSignInPage.form.pspErrorMessageTitle'),
          displayableDescription: t('nodeSignInPage.form.pspUpdateErrorMessageDesc'),
          component: 'Toast',
        });
      } finally {
        setLoading(false);
        history.push(ROUTES.HOME, {
          alertSuccessMessage: t('nodeSignInPage.form.seccesMessagePut'),
        });
      }
    }

    if (selectedParty && !isPspSigned(signInData)) {
      try {
        if (intermediaryAvailableValue) {
          await createPSPDirect(formik.values);
        } else {
          await createPSPIndirect(formik.values);
        }

        await updateSigninData(selectedParty);
      } catch (reason) {
        addError({
          id: 'NODE_SIGNIN_PSP_CREATE',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while registration at the node`,
          toNotify: true,
          displayableTitle: t('nodeSignInPage.form.pspErrorMessageTitle'),
          displayableDescription: t('nodeSignInPage.form.pspErrorMessageDesc'),
          component: 'Toast',
        });
      } finally {
        setLoading(false);
        history.push(ROUTES.HOME, {
          alertSuccessMessage: t('nodeSignInPage.form.successMessage'),
        });
      }
    }
  };

  const changeIntermediaryAvailable = () =>
    setIntermediaryAvailableValue(!intermediaryAvailableValue);

  const enebledSubmit = (values: NodeOnSignInPSP) =>
    values.bicCode !== '' &&
    values.digitalStamp !== undefined &&
    intermediaryAvailableValue !== undefined;

  return (
    <>
      <form onSubmit={formik.handleSubmit} style={{ minWidth: '100%' }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 1,
            p: 3,
          }}
        >
          <Box>
            <Box sx={inputGroupStyle}>
              <FormSectionTitle
                title={t('nodeSignInPage.form.sections.registrationData')}
                icon={<BadgeIcon fontSize="small" />}
                isRequired
              ></FormSectionTitle>
              <Grid container spacing={2} mt={1}>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label={t('nodeSignInPage.form.pspFields.name')}
                    size="small"
                    disabled
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    inputProps={{ 'data-testid': 'name-test' }}
                  />
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="businessName"
                    name="businessName"
                    disabled
                    label={t('nodeSignInPage.form.pspFields.businessName')}
                    size="small"
                    value={formik.values.businessName}
                    onChange={formik.handleChange}
                    error={formik.touched.businessName && Boolean(formik.errors.businessName)}
                    helperText={formik.touched.businessName && formik.errors.businessName}
                    inputProps={{ 'data-testid': 'businessName-test' }}
                  />
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="fiscalCode"
                    name="fiscalCode"
                    label={t('nodeSignInPage.form.pspFields.fiscalCode')}
                    size="small"
                    disabled
                    value={formik.values.fiscalCode}
                    onChange={formik.handleChange}
                    error={formik.touched.fiscalCode && Boolean(formik.errors.fiscalCode)}
                    helperText={formik.touched.fiscalCode && formik.errors.fiscalCode}
                    inputProps={{ 'data-testid': 'fiscalCode-test' }}
                  />
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="abiCode"
                    name="abiCode"
                    disabled
                    label={t('nodeSignInPage.form.pspFields.abiCode')}
                    size="small"
                    value={formik.values.abiCode}
                    onChange={formik.handleChange}
                    error={formik.touched.abiCode && Boolean(formik.errors.abiCode)}
                    helperText={formik.touched.abiCode && formik.errors.abiCode}
                    inputProps={{ 'data-testid': 'abiCode-test' }}
                  />
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="pspCode"
                    name="pspCode"
                    label={t('nodeSignInPage.form.pspFields.pspCode')}
                    size="small"
                    disabled
                    value={formik.values.pspCode}
                    onChange={formik.handleChange}
                    error={formik.touched.pspCode && Boolean(formik.errors.pspCode)}
                    helperText={formik.touched.pspCode && formik.errors.pspCode}
                    inputProps={{ 'data-testid': 'pspCode-test' }}
                  />
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="bicCode"
                    name="bicCode"
                    label={t('nodeSignInPage.form.pspFields.bicCode')}
                    size="small"
                    inputProps={{
                      maxLength: 5,
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                      'data-testid': 'bicCode-test',
                    }}
                    value={formik.values.bicCode}
                    onChange={(e) => handleChangeNumberOnly(e, 'bicCode', formik)}
                    error={formik.touched.bicCode && Boolean(formik.errors.bicCode)}
                    helperText={formik.touched.bicCode && formik.errors.bicCode}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box sx={inputGroupStyle}>
              <FormSectionTitle
                title={t('nodeSignInPage.form.sections.digitalStamp')}
                icon={<BookmarkAddIcon />}
                isRequired
              ></FormSectionTitle>
              <Grid container spacing={2} mt={1}>
                <Grid container item xs={6}>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="digitalStamp"
                    value={formik.values.digitalStamp}
                    sx={{ pl: 1 }}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label={t('nodeSignInPage.form.pspFields.digitalStamp.no')}
                      data-testid="digitalStamp-false-test"
                    />
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label={t('nodeSignInPage.form.pspFields.digitalStamp.yes')}
                      data-testid="digitalStamp-true-test"
                    />
                  </RadioGroup>
                </Grid>
              </Grid>
            </Box>

            <Box sx={inputGroupStyle}>
              <CommonRadioGroup
                labelTrue={t('nodeSignInPage.form.pspFields.intermediaryAvailable.yes')}
                labelFalse={t('nodeSignInPage.form.pspFields.intermediaryAvailable.no')}
                value={intermediaryAvailableValue}
                onChange={changeIntermediaryAvailable}
                pspDirect={pspDirect}
              />
            </Box>
          </Box>
        </Paper>

        <Stack direction="row" justifyContent="space-between" mt={5}>
          <Stack display="flex" justifyContent="flex-start" mr={2}>
            <Button color="primary" variant="outlined" onClick={goBack}>
              {t('nodeSignInPage.form.backButton')}
            </Button>
          </Stack>
          <Stack display="flex" justifyContent="flex-end">
            <Button
              // onClick={()=>() /* handleSubmit */}
              disabled={!enebledSubmit(formik.values)}
              color="primary"
              variant="contained"
              type="submit"
              data-testid="continue-button-test"
            >
              {t('nodeSignInPage.form.continueButton')}
            </Button>
          </Stack>
        </Stack>
      </form>
    </>
  );
};

export default NodeSignInPSPForm;
