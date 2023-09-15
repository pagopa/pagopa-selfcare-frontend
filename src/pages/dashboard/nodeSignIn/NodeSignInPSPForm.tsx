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
import ROUTES from '../../../routes';

import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { Party } from '../../../model/Party';
import { LOADING_TASK_CHANNEL_ADD_EDIT } from '../../../utils/constants';
import FormSectionTitle from '../../../components/Form/FormSectionTitle';
import { NodeOnSignInPSP } from '../../../model/Node';
import { createPSPDirect } from '../../../services/nodeService';
import { useSigninData } from '../../../hooks/useSigninData';
import { PaymentServiceProviderDetailsResource } from '../../../api/generated/portal/PaymentServiceProviderDetailsResource';

type Props = {
  goBack: () => void;
  pspNodeData?: PaymentServiceProviderDetailsResource;
};

const NodeSignInPSPForm = ({ goBack, pspNodeData }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();

  const setLoading = useLoading(LOADING_TASK_CHANNEL_ADD_EDIT);

  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const updateSigninData = useSigninData();

  const initialFormData = (selectedParty?: Party) => ({
    name: selectedParty?.fiscalCode ?? '',
    businessName: selectedParty?.description ?? '',
    fiscalCode: selectedParty?.fiscalCode ?? '',
    abiCode: selectedParty?.pspData?.abiCode ?? '',
    pspCode: selectedParty?.pspData?.abiCode ? `ABI${selectedParty?.pspData?.abiCode}` : '',
    bicCode: '',
    digitalStamp: false,
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
        digitalStamp: !values.digitalStamp
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

  const submit = async () => {
    setLoading(true);

    if (selectedParty) {
      if (pspNodeData) {
        try {
          /* TODO: fix whene updatePSP info will be available
            await updatePSPInfo(selectedParty.fiscalCode, {
            address: { ...formik.values },
            businessName: selectedParty?.description ?? '',
            creditorInstitutionCode: selectedParty?.fiscalCode ?? '',
            enabled: true,
            pspPayment: false,
            reportingFtp: false,
            reportingZip: false,
          });

          if (selectedParty) {
            await updateSigninData(selectedParty);
          }

          history.push(ROUTES.HOME, {
            alertSuccessMessage: t('nodeSignInPage.form.seccesMessagePut'),
          });
          */
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
        }
      }
    } else {
      try {
        await createPSPDirect(formik.values);

        if (selectedParty) {
          await updateSigninData(selectedParty);
        }

        history.push(ROUTES.HOME, {
          alertSuccessMessage: t('nodeSignInPage.form.successMessage'),
        });
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
      }
    }
  };

  const enebledSubmit = (values: NodeOnSignInPSP) =>
    !!(values.bicCode !== '' && values.digitalStamp !== false);

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
                  />
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="bicCode"
                    name="bicCode"
                    label={t('nodeSignInPage.form.pspFields.bicCode')}
                    size="small"
                    inputProps={{ maxLength: 5, inputMode: 'numeric', pattern: '[0-9]*' }}
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
                    sx={{ pl: 1 }}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label={t('nodeSignInPage.form.pspFields.digitalStamp.no')}
                    />
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label={t('nodeSignInPage.form.pspFields.digitalStamp.yes')}
                    />
                  </RadioGroup>
                </Grid>
              </Grid>
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
