/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { Trans, useTranslation } from 'react-i18next';
import { theme } from '@pagopa/mui-italia';
import { SessionModal, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import {
  Badge as BadgeIcon,
  MenuBook as MenuBookIcon,
  CreditCard as CreditCardIcon,
} from '@mui/icons-material';
import ROUTES from '../../../routes';
import { ChannelOnCreation } from '../../../model/Channel';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import {
  associatePSPtoChannel,
  createChannel,
  getPaymentTypes,
  updateChannel,
} from '../../../services/channelService';
import { PaymentTypesResource } from '../../../api/generated/portal/PaymentTypesResource';
import { Party } from '../../../model/Party';
import { LOADING_TASK_CHANNEL_ADD_EDIT } from '../../../utils/constants';
import {
  ChannelDetailsDto,
  Redirect_protocolEnum,
} from '../../../api/generated/portal/ChannelDetailsDto';
import { sortPaymentType } from '../../../model/PaymentType';
import AddEditChannelFormSectionTitle from './AddEditChannelFormSectionTitle';

type Props = {
  goBack: () => void;
  channelDetail?: ChannelDetailsDto;
  formAction: string;
};

const initialFormData = (selectedParty?: Party, channelDetail?: ChannelDetailsDto) =>
  channelDetail
    ? {
        pspBrokerCode: channelDetail.broker_psp_code ?? '',
        businessName: channelDetail.broker_description ?? '',
        idChannel: channelDetail.channel_code ?? '',
        redirectProtocol: Redirect_protocolEnum.HTTPS, // channelDetail.redirect_protocol,
        redirectPort: channelDetail.redirect_port ?? undefined,
        redirectIp: channelDetail.redirect_ip ?? '',
        redirectService: channelDetail.redirect_path ?? '',
        redirectParameters: channelDetail.redirect_query_string ?? '',
        targetAddress: channelDetail.target_host ?? '',
        targetService: channelDetail.target_path ?? '',
        targetPort: channelDetail.target_port,
        paymentType:
          channelDetail.payment_types && channelDetail.payment_types[0]
            ? channelDetail.payment_types[0]
            : '',
      }
    : {
        pspBrokerCode: selectedParty?.fiscalCode ?? '',
        businessName: selectedParty?.description ?? '',
        idChannel: '',
        redirectProtocol: undefined,
        redirectIp: '',
        redirectService: '',
        redirectParameters: '',
        targetAddress: '',
        targetService: '',
        targetPort: undefined,
        paymentType: '',
      };

const validatePortRange = (redirectPort: number | undefined) => {
  if (redirectPort) {
    return redirectPort > 0 && redirectPort < 65556 ? false : true;
  }
  return false;
};

const inputGroupStyle = {
  borderRadius: 1,
  border: 1,
  borderColor: theme.palette.divider,
  p: 3,
  mb: 3,
};

const validate = (values: Partial<ChannelOnCreation>) =>
  Object.fromEntries(
    Object.entries({
      pspBrokerCode: !values.pspBrokerCode ? 'Required' : undefined,
      businessName: !values.businessName ? 'Required' : undefined,
      idChannel: !values.idChannel ? 'Required' : undefined,
      /* redirectProtocol: !values.pspBrokerCode ? 'Required' : undefined,
        redirectIp: !values.pspBrokerCode ? 'Required' : undefined,
        redirectService: !values.pspBrokerCode ? 'Required' : undefined,
        redirectParameters: !values.pspBrokerCode ? 'Required' : undefined, 
      */
      redirectPort: validatePortRange(values.redirectPort) ? 'Non Valido' : undefined,
      targetAddress: !values.targetAddress ? 'Required' : undefined,
      targetService: !values.targetService ? 'Required' : undefined,
      targetPort: !values.targetPort
        ? 'Required'
        : validatePortRange(values.targetPort)
        ? 'Non Valido'
        : undefined,
      paymentType: !values.paymentType ? 'Required' : undefined,
    }).filter(([_key, value]) => value)
  );

function AddEditChannelForm({ goBack, channelDetail, formAction }: Props) {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();

  const setLoading = useLoading(LOADING_TASK_CHANNEL_ADD_EDIT);

  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentOptions, setPaymentOptions] = useState<PaymentTypesResource>({ payment_types: [] });

  const formik = useFormik<ChannelOnCreation>({
    initialValues: initialFormData(selectedParty, channelDetail),
    validate,
    onSubmit: () => {
      setShowConfirmModal(true);
    },
    enableReinitialize: true,
  });

  const submit = async () => {
    setShowConfirmModal(false);
    setLoading(true);

    try {
      if (formAction === 'create' || formAction === 'duplicate') {
        const createResult = await createChannel(formik.values);

        if (createResult) {
          await associatePSPtoChannel(formik.values.idChannel, formik.values.pspBrokerCode, {
            payment_types: [formik.values.paymentType],
          });
        }
      }
      if (formAction === 'edit') {
        await updateChannel(formik.values);
      }
      history.push(ROUTES.CHANNELS, {
        alertSuccessMessage: t('addEditChannelPage.addForm.successMessage'),
      });
    } catch (reason) {
      addError({
        id: 'ADDEDIT_CHANNEL',
        blocking: false,
        error: reason as Error,
        techDescription: `An error occurred while adding/editing channel`,
        toNotify: true,
        displayableTitle: t('addEditChannelPage.addForm.errorMessageTitle'),
        displayableDescription: t('addEditChannelPage.addForm.errorMessageDesc'),
        component: 'Toast',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPaymentTypes()
      .then((results) => {
        if (results) {
          setPaymentOptions(results);
        }
      })
      .catch((reason) => {
        console.error(reason);
      });
  }, []);

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
          <Typography variant="h6" mb={3}>
            Configurazione del canale
          </Typography>

          <Box>
            <Box sx={inputGroupStyle}>
              <AddEditChannelFormSectionTitle
                title={t('addEditChannelPage.addForm.sections.registry')}
                icon={<BadgeIcon fontSize="small" />}
                isRequired
              ></AddEditChannelFormSectionTitle>
              <Grid container spacing={2} mt={1}>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="pspBrokerCode"
                    name="pspBrokerCode"
                    label={t('addEditChannelPage.addForm.fields.pspBrokerCode')}
                    size="small"
                    disabled
                    value={formik.values.pspBrokerCode}
                    onChange={formik.handleChange}
                    error={formik.touched.pspBrokerCode && Boolean(formik.errors.pspBrokerCode)}
                    helperText={formik.touched.pspBrokerCode && formik.errors.pspBrokerCode}
                  />
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="businessName"
                    name="businessName"
                    disabled
                    label={t('addEditChannelPage.addForm.fields.businessName')}
                    size="small"
                    value={formik.values.businessName}
                    onChange={formik.handleChange}
                    error={formik.touched.businessName && Boolean(formik.errors.businessName)}
                    helperText={formik.touched.businessName && formik.errors.businessName}
                  />
                </Grid>
                <Grid container item xs={6} direction="column">
                  <TextField
                    fullWidth
                    id="idChannel"
                    name="idChannel"
                    disabled={formAction === 'edit' ?? false}
                    label={t('addEditChannelPage.addForm.fields.idChannel')}
                    size="small"
                    value={formik.values.idChannel}
                    onChange={formik.handleChange}
                    error={formik.touched.idChannel && Boolean(formik.errors.idChannel)}
                    helperText={formik.touched.idChannel && formik.errors.idChannel}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box sx={inputGroupStyle}>
              <AddEditChannelFormSectionTitle
                title={t('addEditChannelPage.addForm.sections.redirect')}
                icon={<MenuBookIcon />}
              ></AddEditChannelFormSectionTitle>
              <Grid container spacing={2} mt={1}>
                <Grid container item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel size="small">
                      {t('addEditChannelPage.addForm.fields.redirectProtocol')}
                    </InputLabel>
                    <Select
                      fullWidth
                      id="redirectProtocol"
                      name="redirectProtocol"
                      label={t('addEditChannelPage.addForm.fields.redirectProtocol')}
                      size="small"
                      defaultValue={formik.values.redirectProtocol}
                      value={formik.values.redirectProtocol === 'HTTPS' ? 'HTTPS' : 'HTTP'}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.redirectProtocol && Boolean(formik.errors.redirectProtocol)
                      }
                    >
                      {['HTTP', 'HTTPS'].map((p) => (
                        <MenuItem key={p} value={p}>
                          {p}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="redirectPort"
                    name="redirectPort"
                    type="number"
                    InputLabelProps={{ shrink: formik.values.redirectPort ? true : false }}
                    inputProps={{ min: 0, max: 65556 }}
                    label={t('addEditChannelPage.addForm.fields.redirectPort')}
                    size="small"
                    value={formik.values.redirectPort}
                    onChange={formik.handleChange}
                    error={formik.touched.redirectPort && Boolean(formik.errors.redirectPort)}
                    helperText={formik.touched.redirectPort && formik.errors.redirectPort}
                  />
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="redirectIp"
                    name="redirectIp"
                    label={t('addEditChannelPage.addForm.fields.redirectIp')}
                    size="small"
                    value={formik.values.redirectIp}
                    onChange={formik.handleChange}
                    error={formik.touched.redirectIp && Boolean(formik.errors.redirectIp)}
                    helperText={formik.touched.redirectIp && formik.errors.redirectIp}
                  />
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="redirectService"
                    name="redirectService"
                    label={t('addEditChannelPage.addForm.fields.redirectService')}
                    size="small"
                    value={formik.values.redirectService}
                    onChange={formik.handleChange}
                    error={formik.touched.redirectService && Boolean(formik.errors.redirectService)}
                    helperText={formik.touched.redirectService && formik.errors.redirectService}
                  />
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="redirectParameters"
                    name="redirectParameters"
                    label={t('addEditChannelPage.addForm.fields.redirectParameters')}
                    size="small"
                    value={formik.values.redirectParameters}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.redirectParameters && Boolean(formik.errors.redirectParameters)
                    }
                    helperText={
                      formik.touched.redirectParameters && formik.errors.redirectParameters
                    }
                  />
                </Grid>
              </Grid>
            </Box>
            <Box sx={inputGroupStyle}>
              <AddEditChannelFormSectionTitle
                title={t('addEditChannelPage.addForm.sections.target')}
                icon={<MenuBookIcon />}
                isRequired
              ></AddEditChannelFormSectionTitle>
              <Grid container spacing={2} mt={1}>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="targetAddress"
                    name="targetAddress"
                    label={t('addEditChannelPage.addForm.fields.targetAddress')}
                    size="small"
                    value={formik.values.targetAddress}
                    onChange={formik.handleChange}
                    error={formik.touched.targetAddress && Boolean(formik.errors.targetAddress)}
                    helperText={formik.touched.targetAddress && formik.errors.targetAddress}
                  />
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="targetService"
                    name="targetService"
                    label={t('addEditChannelPage.addForm.fields.targetService')}
                    size="small"
                    value={formik.values.targetService}
                    onChange={formik.handleChange}
                    error={formik.touched.targetService && Boolean(formik.errors.targetService)}
                    helperText={formik.touched.targetService && formik.errors.targetService}
                  />
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="targetPort"
                    name="targetPort"
                    type="number"
                    InputLabelProps={{ shrink: formik.values.targetPort ? true : false }}
                    inputProps={{ min: 0, max: 65556 }}
                    label={t('addEditChannelPage.addForm.fields.targetPort')}
                    size="small"
                    value={formik.values.targetPort}
                    onChange={formik.handleChange}
                    error={formik.touched.targetPort && Boolean(formik.errors.targetPort)}
                    helperText={formik.touched.targetPort && formik.errors.targetPort}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box sx={inputGroupStyle}>
              <AddEditChannelFormSectionTitle
                title={t('addEditChannelPage.addForm.sections.paymentType')}
                icon={<CreditCardIcon />}
                isRequired
              ></AddEditChannelFormSectionTitle>
              <Grid container spacing={2} mt={1}>
                <Grid container item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel size="small">
                      {t('addEditChannelPage.addForm.fields.paymentType')}
                    </InputLabel>
                    <Select
                      fullWidth
                      id="paymentType"
                      name="paymentType"
                      label={t('addEditChannelPage.addForm.fields.paymentType')}
                      size="small"
                      disabled={formAction === 'edit' ? true : false}
                      value={formik.values.paymentType}
                      onChange={formik.handleChange}
                      error={formik.touched.paymentType && Boolean(formik.errors.paymentType)}
                    >
                      {paymentOptions &&
                        sortPaymentType(paymentOptions.payment_types).map((option: any) => (
                          <MenuItem key={option.payment_type} value={option.payment_type}>
                            {option.description}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>

        <Stack direction="row" justifyContent="space-between" mt={5}>
          <Stack display="flex" justifyContent="flex-start" mr={2}>
            <Button color="primary" variant="outlined" onClick={goBack}>
              {t('addEditChannelPage.addForm.backButton')}
            </Button>
          </Stack>
          <Stack display="flex" justifyContent="flex-end">
            <Button
              // onClick={()=>() /* handleSubmit */}
              disabled={!formik.dirty || !formik.isValid}
              color="primary"
              variant="contained"
              type="submit"
            >
              {t('addEditChannelPage.addForm.continueButton')}
            </Button>
          </Stack>
        </Stack>
      </form>
      <SessionModal
        open={showConfirmModal}
        title={t('addEditChannelPage.confirmModal.title')}
        message={
          <Trans i18nKey="addEditChannelPage.confirmModal.message">
            Un operatore PagoPA revisionerà le informazioni inserite nel canale prima di approvare.
            Riceverai una notifica a revisione completata.
            <br />
          </Trans>
        }
        onConfirmLabel={t('addEditChannelPage.confirmModal.confirmButton')}
        onCloseLabel={t('addEditChannelPage.confirmModal.cancelButton')}
        onConfirm={submit}
        handleClose={() => {
          setShowConfirmModal(false);
        }}
      />
    </>
  );
}

export default AddEditChannelForm;
