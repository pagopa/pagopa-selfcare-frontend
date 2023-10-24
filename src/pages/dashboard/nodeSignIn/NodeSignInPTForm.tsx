import { useHistory } from 'react-router';
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
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { theme } from '@pagopa/mui-italia';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { Badge as BadgeIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { CompareArrows as CompareArrowsIcon } from '@mui/icons-material';
import { LOADING_TASK_NODE_SIGN_IN_EC } from '../../../utils/constants';
import FormSectionTitle from '../../../components/Form/FormSectionTitle';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { useSigninData } from '../../../hooks/useSigninData';
import { isEcBrokerSigned, isPspBrokerSigned } from '../../../utils/rbac-utils';
import { Party } from '../../../model/Party';
import { NodeOnSignInPT, PTResource } from '../../../model/Node';
import { createEcBroker, createPspBroker } from '../../../services/nodeService';
import ROUTES from '../../../routes';

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
  const isParterPSP = isPspBrokerSigned(signInData) ?? false;
  const isParterEC = isEcBrokerSigned(signInData) ?? false;

  const [isPartnerPSPChecked, setIsParterPSPChecked] = useState(isParterPSP);
  const [isPartnerECChecked, setIsPartnerECChecked] = useState(isParterEC);

  useEffect(() => {
    if (selectedParty) {
      if (isParterPSP && isParterEC) {
        setIsParterPSPChecked(true);
        setIsPartnerECChecked(true);
      } else if (isParterPSP) {
        setIsParterPSPChecked(true);
        setIsPartnerECChecked(false);
      } else if (isParterEC) {
        setIsParterPSPChecked(false);
        setIsPartnerECChecked(true);
      } else {
        setIsParterPSPChecked(false);
        setIsPartnerECChecked(false);
      }
    }
  }, [selectedParty, signInData]);
  const handleChangePtPSP = (event: any) => {
    setIsParterPSPChecked(event.target.checked);
  };

  const handleChangePtEC = (event: any) => {
    setIsPartnerECChecked(event.target.checked);
  };

  const initialFormData = (selectedParty?: Party) => ({
    name: selectedParty?.fiscalCode ?? '',
    businessName: selectedParty?.description ?? '',
  });

  const inputGroupStyle = {
    borderRadius: 1,
    border: 1,
    borderColor: theme.palette.divider,
    p: 3,
    mb: 3,
  };

  // eslint-disable-next-line complexity, sonarjs/cognitive-complexity
  const submit = async () => {
    const pspAndEcCheckedWithNoBrokers =
      isPartnerPSPChecked && isPartnerECChecked && !isParterPSP && !isParterEC;
    const pspCheckedWithEcBroker = isPartnerPSPChecked && !isParterPSP && isParterEC;
    const pspCheckedWithNoBroker =
      isPartnerPSPChecked && !isPartnerECChecked && !isParterPSP && !isParterEC;
    const ecCheckedWithPspBroker = isPartnerECChecked && isParterPSP && !isParterEC;
    const ecCheckedWithNoBroker =
      !isPartnerPSPChecked && isPartnerECChecked && !isParterPSP && !isParterEC;
    setLoading(true);
    if (selectedParty) {
      try {
        if (pspAndEcCheckedWithNoBrokers) {
          await createPspBroker({
            broker_psp_code: selectedParty.fiscalCode,
            description: selectedParty.description,
            enabled: true,
            extended_fault_bean: true,
          });

          await createEcBroker({
            broker_code: selectedParty.fiscalCode,
            description: selectedParty.description,
          });
        }

        if (pspCheckedWithEcBroker || pspCheckedWithNoBroker) {
          await createPspBroker({
            broker_psp_code: selectedParty.fiscalCode,
            description: selectedParty.description,
            enabled: true,
            extended_fault_bean: true,
          });
        }

        if (ecCheckedWithPspBroker || ecCheckedWithNoBroker) {
          await createEcBroker({
            broker_code: selectedParty.fiscalCode,
            description: selectedParty.description,
          });
        }

        await updateSigninData(selectedParty);
      } catch (reason) {
        addError({
          id: 'NODE_SIGNIN_CREATE_PT',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while creating pt`,
          toNotify: true,
          displayableTitle: t('nodeSignInPage.form.errorMessageTitle'),
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

  const enabledSubmit = () =>
    (!isPartnerPSPChecked && !isPartnerECChecked) ||
    (isParterPSP && !isPartnerECChecked) ||
    (!isPartnerPSPChecked && isParterEC) ||
    (isParterPSP && isParterEC);

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
    <>
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
                    onChange={handleChangePtPSP}
                    disabled={isParterPSP}
                    data-testid="psp-checkbox-test"
                  />
                }
              />
              <FormControlLabel
                label="EC"
                control={
                  <Checkbox
                    checked={isPartnerECChecked}
                    onChange={handleChangePtEC}
                    disabled={isParterEC}
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
              disabled={enabledSubmit()}
            >
              {t('nodeSignInPage.form.continueButton')}
            </Button>
          </Stack>
        </Stack>
      </form>
    </>
  );
};

export default NodeSignInPTForm;
