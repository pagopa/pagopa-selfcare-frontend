/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import {Badge as BadgeIcon} from '@mui/icons-material';
import {Box, Button, Grid, Paper, Stack, TextField} from '@mui/material';
import {theme} from '@pagopa/mui-italia';
import {useErrorDispatcher, useLoading} from '@pagopa/selfcare-common-frontend';
import {FormikProps, useFormik} from 'formik';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';
import {BrokerAndEcDetailsResource} from '../../../api/generated/portal/BrokerAndEcDetailsResource';
import {CreditorInstitutionAddressDto} from '../../../api/generated/portal/CreditorInstitutionAddressDto';
import FormSectionTitle from '../../../components/Form/FormSectionTitle';
import {useSigninData} from '../../../hooks/useSigninData';
import {useAppSelector} from '../../../redux/hooks';
import {partiesSelectors} from '../../../redux/slices/partiesSlice';
import ROUTES from '../../../routes';
import {deleteCIBroker} from '../../../services/brokerService';
import {
  createECAndBroker,
  createEcBroker,
  createECIndirect,
  updateCreditorInstitution,
} from '../../../services/nodeService';
import {getStationsMerged} from '../../../services/stationService';
import {LOADING_TASK_NODE_SIGN_IN_EC} from '../../../utils/constants';
import {useOrganizationType} from "../../../hooks/useOrganizationType";
import CommonRadioGroup from './components/CommonRadioGroup';


type Props = {
  goBack: () => void;
  signInData: BrokerAndEcDetailsResource;
};

const NodeSignInCIForm = ({ goBack, signInData }: Props) => {
  const { t } = useTranslation();
  const {orgIsEcBrokerSigned, orgIsEcSigned} = useOrganizationType();
  const history = useHistory();
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_NODE_SIGN_IN_EC);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const updateSigninData = useSigninData();
  const [intermediaryAvailableValue, setIntermediaryAvailableValue] = useState<boolean>(false);
  const ciDirect = signInData && orgIsEcBrokerSigned && orgIsEcSigned;
  const [hasCIStations, setHasCIStations] = useState(true);

  useEffect(() => {
    if (ciDirect) {
      setIntermediaryAvailableValue(true);
    } else {
      setIntermediaryAvailableValue(false);
    }

    setLoading(true);
    const brokerCode = selectedParty?.fiscalCode ?? '';

    getStationsMerged(0, brokerCode, undefined, 1)
      .then((stations) => {
        setHasCIStations(
          stations?.pageInfo?.items_found !== undefined && stations.pageInfo.items_found > 0
        );
      })
      .catch((reason) => {
        addError({
          id: 'RETRIEVE_STATIONS_ERROR',
          blocking: false,
          error: reason,
          techDescription: `An error occurred while retrieving ci stations`,
          toNotify: true,
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t('nodeSignInPage.error.retrieveStationsErrorMessage'),
          component: 'Toast',
        });
      })
      .finally(() => setLoading(false));
  }, [selectedParty]);

  const initialFormData = (ecDetails: BrokerAndEcDetailsResource) =>
    ecDetails
      ? {
          city: ecDetails?.creditorInstitutionDetailsResource?.address?.city ?? '',
          countryCode: ecDetails?.creditorInstitutionDetailsResource?.address?.countryCode ?? '',
          location: ecDetails?.creditorInstitutionDetailsResource?.address?.location ?? '',
          taxDomicile: ecDetails?.creditorInstitutionDetailsResource?.address?.taxDomicile ?? '',
          zipCode: ecDetails?.creditorInstitutionDetailsResource?.address?.zipCode ?? '',
        }
      : {
          city: '',
          countryCode: '',
          location: '',
          taxDomicile: '',
          zipCode: '',
        };

  const validate = (values: CreditorInstitutionAddressDto) =>
    Object.fromEntries(
      Object.entries({
        location: !values.location
          ? t('nodeSignInPage.form.ecFields.validation.required')
          : undefined,
        city: !values.city ? t('nodeSignInPage.form.ecFields.validation.required') : undefined,
        countryCode: !values.countryCode
          ? t('nodeSignInPage.form.ecFields.validation.required')
          : values.countryCode.length < 2
          ? t('nodeSignInPage.form.ecFields.validation.countryCode')
          : undefined,
        zipCode: !values.zipCode
          ? t('nodeSignInPage.form.ecFields.validation.required')
          : values.zipCode.length < 5
          ? t('nodeSignInPage.form.ecFields.validation.zipCode')
          : undefined,
        taxDomicile: !values.taxDomicile
          ? t('nodeSignInPage.form.ecFields.validation.required')
          : undefined,
      }).filter(([_key, value]) => (typeof value !== 'undefined' ? value : ''))
    );

  const submit = async () => {
    setLoading(true);

    const commonPayload = {
      address: { ...formik.values },
      businessName: selectedParty?.description ?? '',
      creditorInstitutionCode: selectedParty?.fiscalCode ?? '',
      enabled: true,
      pspPayment: false,
      reportingFtp: false,
      reportingZip: false,
    };

    if (orgIsEcSigned && selectedParty) {
      try {
        if (!orgIsEcBrokerSigned && intermediaryAvailableValue) {
          await createEcBroker({
            broker_code: selectedParty.fiscalCode,
            description: selectedParty.description,
          });
        }

        if (!hasCIStations && ciDirect && !intermediaryAvailableValue) {
          await deleteCIBroker(selectedParty.fiscalCode);
        }

        await updateCreditorInstitution(selectedParty.fiscalCode, commonPayload);

        await updateSigninData(selectedParty);
      } catch (reason) {
        addError({
          id: 'NODE_SIGNIN_EC_UPDATE',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while updating Ec data at the node`,
          toNotify: true,
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t('nodeSignInPage.form.ecUpdateErrorMessageDesc'),
          component: 'Toast',
        });
      } finally {
        setLoading(false);
        history.push(ROUTES.HOME, {
          alertSuccessMessage: t('nodeSignInPage.form.seccesMessagePut'),
        });
      }
    }

    if (!orgIsEcSigned && selectedParty) {
      try {
        if (intermediaryAvailableValue) {
          await createECAndBroker(commonPayload);
        } else {
          await createECIndirect(commonPayload);
        }

        await updateSigninData(selectedParty);
      } catch (reason) {
        addError({
          id: 'NODE_SIGNIN_EC_CREATE',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while registration EC at the node`,
          toNotify: true,
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t('nodeSignInPage.form.ecErrorMessageDesc'),
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

  const formik = useFormik<CreditorInstitutionAddressDto>({
    initialValues: initialFormData(signInData),
    validate,
    onSubmit: async () => {
      await submit();
    },
    validateOnMount: true,
    validateOnChange: true,
    enableReinitialize: true,
  });

  const handleChangeNumberOnly = (
    e: React.ChangeEvent<any>,
    field: string,
    formik: FormikProps<CreditorInstitutionAddressDto>
  ) => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === '' || regex.test(e.target.value)) {
      formik.setFieldValue(field, e.target.value);
    }
  };

  const handleChangeLetterOnly = (
    e: React.ChangeEvent<any>,
    field: string,
    formik: FormikProps<CreditorInstitutionAddressDto>
  ) => {
    const regex = /^[A-Za-z]+$/;
    if (e.target.value === '' || regex.test(e.target.value)) {
      formik.setFieldValue(field, e.target.value);
    }
  };

  const enebledSubmit = (values: CreditorInstitutionAddressDto) =>
    !!(
      values.location !== '' &&
      values.city !== '' &&
      values.countryCode !== '' &&
      values.zipCode !== '' &&
      values.taxDomicile !== '' &&
      intermediaryAvailableValue !== undefined
    );

  return (
    <form onSubmit={formik.handleSubmit} style={{ minWidth: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 1,
          p: 3,
        }}
      >
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
                id="location"
                name="location"
                label={t('nodeSignInPage.form.ecFields.address')}
                placeholder={t('nodeSignInPage.form.ecFields.address')}
                size="small"
                value={formik.values.location}
                onChange={(e) => formik.handleChange(e)}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
                inputProps={{ 'data-testid': 'address-test' }}
              />
            </Grid>
            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="city"
                name="city"
                label={t('nodeSignInPage.form.ecFields.city')}
                placeholder={t('nodeSignInPage.form.ecFields.city')}
                size="small"
                value={formik.values.city}
                onChange={(e) => formik.handleChange(e)}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
                inputProps={{ 'data-testid': 'city-test' }}
              />
            </Grid>
            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="countryCode"
                name="countryCode"
                label={t('nodeSignInPage.form.ecFields.province')}
                placeholder={t('nodeSignInPage.form.ecFields.province')}
                size="small"
                value={formik.values.countryCode.toUpperCase()}
                inputProps={{
                  maxLength: 2,
                  inputMode: 'text',
                  pattern: '[A-Za-z]*',
                  'data-testid': 'province-test',
                }}
                onChange={(e) => handleChangeLetterOnly(e, 'countryCode', formik)}
                error={formik.touched.countryCode && Boolean(formik.errors.countryCode)}
                helperText={formik.touched.countryCode && formik.errors.countryCode}
              />
            </Grid>
            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="zipCode"
                name="zipCode"
                label={t('nodeSignInPage.form.ecFields.CAP')}
                placeholder={t('nodeSignInPage.form.ecFields.CAP')}
                size="small"
                value={formik.values.zipCode}
                inputProps={{
                  maxLength: 5,
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  'data-testid': 'CAP-test',
                }}
                onChange={(e) => handleChangeNumberOnly(e, 'zipCode', formik)}
                error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
                helperText={formik.touched.zipCode && formik.errors.zipCode}
                aria-errormessage="è possibile inserire solamente caratteri numerici"
              />
            </Grid>
            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="taxDomicile"
                name="taxDomicile"
                label={t('nodeSignInPage.form.ecFields.fiscalDomicile')}
                placeholder={t('nodeSignInPage.form.ecFields.fiscalDomicile')}
                size="small"
                value={formik.values.taxDomicile}
                onChange={(e) => formik.handleChange(e)}
                error={formik.touched.taxDomicile && Boolean(formik.errors.taxDomicile)}
                helperText={formik.touched.taxDomicile && formik.errors.taxDomicile}
                inputProps={{ 'data-testid': 'fiscal-domicile-test' }}
                disabled={
                  signInData?.creditorInstitutionDetailsResource?.address?.taxDomicile
                    ? true
                    : false
                }
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={inputGroupStyle}>
          <CommonRadioGroup
            labelTrue={t('nodeSignInPage.form.ecFields.intermediaryAvailable.yes')}
            labelFalse={t('nodeSignInPage.form.ecFields.intermediaryAvailable.no')}
            value={intermediaryAvailableValue}
            setIntermediaryAvailableValue={setIntermediaryAvailableValue}
            isChangeDisabled={hasCIStations}
          />
        </Box>
      </Paper>

      <Stack direction="row" justifyContent="space-between" mt={5}>
        <Stack display="flex" justifyContent="flex-start" mr={2}>
          <Button
            color="primary"
            variant="outlined"
            onClick={goBack}
            data-testid="back-button-test"
          >
            {t('nodeSignInPage.form.backButton')}
          </Button>
        </Stack>
        <Stack display="flex" justifyContent="flex-end">
          <Button
            onClick={() => formik.handleSubmit}
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
  );
};

export const inputGroupStyle = {
  borderRadius: 1,
  border: 1,
  borderColor: theme.palette.divider,
  p: 3,
  mb: 3,
};

export default NodeSignInCIForm;
