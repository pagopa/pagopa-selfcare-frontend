import { Badge as BadgeIcon, CompareArrows as CompareArrowsIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import FormSectionTitle from '../../../components/Form/FormSectionTitle';
import { useSigninData } from '../../../hooks/useSigninData';
import { NodeOnSignInPT, PTResource } from '../../../model/Node';
import { Party } from '../../../model/Party';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import ROUTES from '../../../routes';
import { createEcBroker, createPspBroker } from '../../../services/nodeService';
import { LOADING_TASK_NODE_SIGN_IN_EC } from '../../../utils/constants';
import { isEcBrokerSigned, isPspBrokerSigned } from '../../../utils/rbac-utils';
import { getStationsMerged } from '../../../services/stationService';
import { getChannelsMerged } from '../../../services/channelService';

type Props = {
  goBack: () => void;
  signInData: PTResource;
};

const NodeSignInPTForm = ({ goBack, signInData }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_NODE_SIGN_IN_EC);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const updateSigninData = useSigninData();
  const isPartnerPSP = isPspBrokerSigned(signInData) ?? false;
  const isPartnerEC = isEcBrokerSigned(signInData) ?? false;

  const [isPartnerPSPChecked, setIsPartnerPSPChecked] = useState(isPartnerPSP);
  const [isPartnerECChecked, setIsPartnerECChecked] = useState(isPartnerEC);
  const [isPartnerECJustSigned, setIsPartnerECJustSigned] = useState(false);
  const [isPartnerPSPJustSigned, setIsPartnerPSPJustSigned] = useState(false);

  useEffect(() => {
    if (selectedParty) {
      setLoading(true);
      const brokerCode = selectedParty?.fiscalCode ?? '';

      Promise.all([
        getStationsMerged(0, brokerCode, undefined, 1),
        getChannelsMerged(0, brokerCode, undefined, 1),
      ])
        .then(([stations, channels]) => {
          setIsPartnerECJustSigned(stations === undefined || stations?.pageInfo?.total_items === 0);
          setIsPartnerPSPJustSigned(channels === undefined || channels?.page_info?.total_items === 0);
        })
        .catch((reason) => {
          addError({
            id: 'RETRIEVE_STATIONS_CHANNEL_ERROR',
            blocking: false,
            error: reason,
            techDescription: `An error occurred while retrieving partner stations and channels`,
            toNotify: true,
            displayableTitle: t('general.errorTitle'),
            displayableDescription: t(
              'nodeSignInPage.error.retrieveChannelsAndStationsErrorMessage'
            ),
            component: 'Toast',
          });
        })
        .finally(() => setLoading(false));

      setIsPartnerPSPChecked(isPartnerPSP);
      setIsPartnerECChecked(isPartnerEC);
    }
  }, [selectedParty, signInData]);

  const initialFormData = (selectedParty?: Party) => ({
    name: selectedParty?.fiscalCode ?? '',
    businessName: selectedParty?.description ?? '',
  });

  // eslint-disable-next-line complexity, sonarjs/cognitive-complexity
  const submit = async () => {
    setLoading(true);
    if (selectedParty) {
      try {
        if (isPartnerPSPChecked && !isPartnerPSP) {
          await createPspBroker({
            broker_psp_code: selectedParty.fiscalCode,
            description: selectedParty.description,
            enabled: true,
            extended_fault_bean: true,
          });
        }
        if (isPartnerECChecked && !isPartnerEC) {
          await createEcBroker({
            broker_code: selectedParty.fiscalCode,
            description: selectedParty.description,
          });
        }

        if (isPartnerPSPJustSigned && isPartnerPSP && !isPartnerPSPChecked) {
          // TODO delete broker PSP
        }
        if (isPartnerECJustSigned && isPartnerEC && !isPartnerECChecked) {
          // TODO delete broker EC
        }

        await updateSigninData(selectedParty);
      } catch (reason) {
        addError({
          id: 'NODE_SIGNIN_CREATE_PT',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while creating pt`,
          toNotify: true,
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t('nodeSignInPage.form.ptErrorMessageDesc'),
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

  const disabledSubmit = () =>
    isPartnerPSPChecked === isPartnerPSP && isPartnerECChecked === isPartnerEC;

  const formik = useFormik<NodeOnSignInPT>({
    initialValues: initialFormData(selectedParty),
    onSubmit: async () => {
      await submit();
    },
    validateOnMount: true,
    validateOnChange: true,
    enableReinitialize: true,
  });

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
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label={t('dashboardPage.registrationData.name')}
                placeholder={t('dashboardPage.registrationData.name')}
                size="small"
                value={formik.values.name}
                onChange={(e) => formik.handleChange(e)}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                inputProps={{ 'data-testid': 'name-test' }}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="businessName"
                name="businessName"
                label={t('dashboardPage.registrationData.companyName')}
                placeholder={t('dashboardPage.registrationData.companyName')}
                size="small"
                value={formik.values.businessName}
                onChange={(e) => formik.handleChange(e)}
                error={formik.touched.businessName && Boolean(formik.errors.businessName)}
                helperText={formik.touched.businessName && formik.errors.businessName}
                inputProps={{ 'data-testid': 'businessName-test' }}
                disabled
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={inputGroupStyle}>
          <FormSectionTitle
            title={t('nodeSignInPage.form.sections.intermediaryType')}
            icon={<CompareArrowsIcon />}
            isRequired
          ></FormSectionTitle>

          <Grid container item xs={1} sx={{ flexDirection: 'column', ml: 3 }}>
            <FormControlLabel
              label="PSP"
              control={
                <Checkbox
                  checked={isPartnerPSPChecked}
                  onChange={(event) => setIsPartnerPSPChecked(event.target.checked)}
                  disabled={!isPartnerPSPJustSigned}
                  data-testid="psp-checkbox-test"
                />
              }
            />
            <FormControlLabel
              label="EC"
              control={
                <Checkbox
                  checked={isPartnerECChecked}
                  onChange={(event) => setIsPartnerECChecked(event.target.checked)}
                  disabled={!isPartnerECJustSigned}
                  data-testid="ec-checkbox-test"
                />
              }
            />
          </Grid>
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
            color="primary"
            variant="contained"
            type="submit"
            data-testid="continue-button-test"
            disabled={disabledSubmit()}
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

export default NodeSignInPTForm;
