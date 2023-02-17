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
import { SessionModal } from '@pagopa/selfcare-common-frontend';
import {
  Badge as BadgeIcon,
  MenuBook as MenuBookIcon,
  CreditCard as CreditCardIcon,
} from '@mui/icons-material';
import ROUTES from '../../../routes';
import { ChannelOnCreation } from '../../../model/Channel';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { createChannel, getPaymentTypes } from '../../../services/channelService';
import { Party } from '../../../model/Party';

import { PaymentTypesResource } from '../../../api/generated/portal/PaymentTypesResource';
import AddChannelFormSectionTitle from './AddChannelFormSectionTitle';

type Props = {
  goBack: () => void;
};

const initialFormData = (selectedParty?: Party) => ({
  pspBrokerCode: selectedParty?.fiscalCode ?? '', // broker_psp_code
  businessName: selectedParty?.description ?? '', // ?
  idChannel: '', // channel_code
  redirectProtocol: undefined, // redirect_protocol
  redirectPort: undefined, // redirect_port
  redirectIp: '', // redirect_ip
  redirectService: '', // redirect_path ?
  redirectParameters: '', // redirect_query_string ?
  targetAddress: '', // target_host ?
  targetService: '', // target_path ?
  targetPort: undefined, // target_port
  paymentType: '', // ?
});

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

function AddChannelForm({ goBack }: Props) {
  const { t } = useTranslation();
  const history = useHistory();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentOptions, setPaymentOptions] = useState<PaymentTypesResource>({ payment_types: [] });

  const formik = useFormik<ChannelOnCreation>({
    initialValues: initialFormData(selectedParty),
    validate,
    onSubmit: () => {
      setShowConfirmModal(true);
    },
  });

  const submit = () => {
    setShowConfirmModal(false);
    // alert(JSON.stringify(formik.values, null, 2));
    createChannel(formik.values)
      .then(() => {
        history.push(ROUTES.CHANNELS, {
          alertSuccessMessage: t('addChannelPage.addForm.successMessage'),
        });
      })
      .catch((reason) => {
        console.log(reason);
        // if (reason.httpStatus === 409) {
      });
  };
  useEffect(() => {
    getPaymentTypes()
      .then((results) => {
        if (results) {
          setPaymentOptions(results);
          console.log(results);
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
              <AddChannelFormSectionTitle
                title={t('addChannelPage.addForm.sections.registry')}
                icon={<BadgeIcon fontSize="small" />}
                isRequired
              ></AddChannelFormSectionTitle>
              <Grid container spacing={2} mt={1}>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="pspBrokerCode"
                    name="pspBrokerCode"
                    label={t('addChannelPage.addForm.fields.pspBrokerCode')}
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
                    label={t('addChannelPage.addForm.fields.businessName')}
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
                    label={t('addChannelPage.addForm.fields.idChannel')}
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
              <AddChannelFormSectionTitle
                title={t('addChannelPage.addForm.sections.redirect')}
                icon={<MenuBookIcon />}
              ></AddChannelFormSectionTitle>
              <Grid container spacing={2} mt={1}>
                <Grid container item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel size="small">
                      {t('addChannelPage.addForm.fields.redirectProtocol')}
                    </InputLabel>
                    <Select
                      fullWidth
                      id="redirectProtocol"
                      name="redirectProtocol"
                      label={t('addChannelPage.addForm.fields.redirectProtocol')}
                      size="small"
                      value={formik.values.redirectProtocol}
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
                    inputProps={{ min: 0, max: 65556 }}
                    label={t('addChannelPage.addForm.fields.redirectPort')}
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
                    label={t('addChannelPage.addForm.fields.redirectIp')}
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
                    label={t('addChannelPage.addForm.fields.redirectService')}
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
                    label={t('addChannelPage.addForm.fields.redirectParameters')}
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
              <AddChannelFormSectionTitle
                title={t('addChannelPage.addForm.sections.target')}
                icon={<MenuBookIcon />}
                isRequired
              ></AddChannelFormSectionTitle>
              <Grid container spacing={2} mt={1}>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="targetAddress"
                    name="targetAddress"
                    label={t('addChannelPage.addForm.fields.targetAddress')}
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
                    label={t('addChannelPage.addForm.fields.targetService')}
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
                    inputProps={{ min: 0, max: 65556 }}
                    label={t('addChannelPage.addForm.fields.targetPort')}
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
              <AddChannelFormSectionTitle
                title={t('addChannelPage.addForm.sections.paymentType')}
                icon={<CreditCardIcon />}
                isRequired
              ></AddChannelFormSectionTitle>
              <Grid container spacing={2} mt={1}>
                <Grid container item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel size="small">
                      {t('addChannelPage.addForm.fields.paymentType')}
                    </InputLabel>
                    <Select
                      fullWidth
                      id="paymentType"
                      name="paymentType"
                      label={t('addChannelPage.addForm.fields.paymentType')}
                      size="small"
                      value={formik.values.paymentType}
                      onChange={formik.handleChange}
                      error={formik.touched.paymentType && Boolean(formik.errors.paymentType)}
                    >
                      {paymentOptions &&
                        paymentOptions.payment_types.map((option: any) => (
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
              {t('addChannelPage.addForm.backButton')}
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
              {t('addChannelPage.addForm.continueButton')}
            </Button>
          </Stack>
        </Stack>
      </form>
      <SessionModal
        open={showConfirmModal}
        title={t('addChannelPage.confirmModal.title')}
        message={
          <Trans i18nKey="addChannelPage.confirmModal.message">
            Un operatore PagoPA revisionerà le informazioni inserite nel canale prima di approvare.
            Riceverai una notifica a revisione completata.
            <br />
          </Trans>
        }
        onConfirmLabel={t('addChannelPage.confirmModal.confirmButton')}
        onCloseLabel={t('addChannelPage.confirmModal.cancelButton')}
        onConfirm={submit}
        handleClose={() => {
          setShowConfirmModal(false);
        }}
      />
    </>
  );
}

export default AddChannelForm;
