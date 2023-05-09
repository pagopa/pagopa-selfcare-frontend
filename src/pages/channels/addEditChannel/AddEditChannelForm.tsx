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
import { FormikProps, useFormik } from 'formik';
import { Trans, useTranslation } from 'react-i18next';
import { ButtonNaked, theme } from '@pagopa/mui-italia';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import {
  Badge as BadgeIcon,
  MenuBook as MenuBookIcon,
  CreditCard as CreditCardIcon,
  RemoveCircleOutline,
} from '@mui/icons-material';
import { generatePath, useParams } from 'react-router-dom';
import ROUTES, { BASE_ROUTE } from '../../../routes';
import { ChannelOnCreation, FormAction } from '../../../model/Channel';
import {
  // associatePSPtoChannel,
  createChannel,
  createWrapperChannelDetails,
  getPaymentTypes,
  updateChannel,
} from '../../../services/channelService';
import { PaymentTypesResource } from '../../../api/generated/portal/PaymentTypesResource';
import { Party } from '../../../model/Party';
import { LOADING_TASK_CHANNEL_ADD_EDIT } from '../../../utils/constants';
import {
  ChannelDetailsDto,
  Redirect_protocolEnum,
  StatusEnum,
} from '../../../api/generated/portal/ChannelDetailsDto';
import { sortPaymentType } from '../../../model/PaymentType';
import ConfirmModal from '../../components/ConfirmModal';
import { updateWrapperChannel } from '../../../services/__mocks__/channelService';
import AddEditChannelFormSectionTitle from './AddEditChannelFormSectionTitle';
import AddEditChannelValidationForm from './components/AddEditChannelValidationForm';

type Props = {
  selectedParty: Party;
  channelDetail?: ChannelDetailsDto;
  channelCode: string;
  formAction: string;
};

const AddEditChannelForm = ({ selectedParty, channelCode, channelDetail, formAction }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();

  const setLoading = useLoading(LOADING_TASK_CHANNEL_ADD_EDIT);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentOptions, setPaymentOptions] = useState<PaymentTypesResource>({ payment_types: [] });
  const isOperator = selectedParty.roles[0].roleKey === 'operator';
  const redirectProtocol = ['HTTP', 'HTTPS'];
  const { channelId } = useParams<{ channelId: string }>();

  const initialFormData = (
    channelCode: string,
    channelDetail?: ChannelDetailsDto,
    selectedParty?: Party
  ) =>
    channelDetail
      ? {
          ...{
            pspBrokerCode: channelDetail.broker_psp_code ?? '',
            businessName: channelDetail.broker_description ?? '',
            idChannel: channelCode,
            redirectProtocol: Redirect_protocolEnum.HTTPS, // channelDetail.redirect_protocol,
            redirectPort: channelDetail.redirect_port ?? undefined,
            redirectIp: channelDetail.redirect_ip ?? '',
            redirectService: channelDetail.redirect_path ?? '',
            redirectParameters: channelDetail.redirect_query_string ?? '',
            targetAddress: channelDetail.target_host ?? '',
            targetService: channelDetail.target_path ?? '',
            targetPort: channelDetail.target_port ?? undefined,
            paymentType: channelDetail.payment_types ? [...channelDetail.payment_types] : [''],
            status: channelDetail.status ?? undefined,
          },
          ...(isOperator && {
            primitive_version: channelDetail.primitive_version ?? '',
            password: channelDetail.password ?? '',
            new_password: channelDetail.new_password ?? '',
            protocol: channelDetail.protocol ?? undefined,
            ip: channelDetail.ip ?? '',
            port: channelDetail.port ?? 0,
            service: channelDetail.service ?? '',
            nmp_service: channelDetail.nmp_service ?? '',
            proxy_host: channelDetail.proxy_host ?? '',
            proxy_port: channelDetail.proxy_port ?? 0,
            payment_model: channelDetail.payment_model ?? undefined,
            serv_plugin: channelDetail.serv_plugin ?? '',
            thread_number: channelDetail.thread_number ?? 0,
            timeout_a: channelDetail.timeout_a ?? 0,
            timeout_b: channelDetail.timeout_b ?? 0,
            timeout_c: channelDetail.timeout_c ?? 0,
            psp_notify_payment: false,
            rt_push: channelDetail.rt_push ?? false,
            rpt_carousel: false,
            recovery: channelDetail.recovery ?? false,
            digital_stamp_brand: channelDetail.digital_stamp_brand ?? false,
            on_us: channelDetail.on_us ?? false,
          }),
        }
      : {
          ...{
            pspBrokerCode: selectedParty?.fiscalCode ?? '',
            businessName: selectedParty?.description ?? '',
            idChannel: channelCode,
            redirectProtocol: Redirect_protocolEnum.HTTPS,
            redirectPort: undefined,
            redirectIp: '',
            redirectService: '',
            redirectParameters: '',
            targetAddress: '',
            targetService: '',
            targetPort: undefined,
            paymentType: [''],
            status: StatusEnum.TO_CHECK,
          },
          ...(isOperator && {
            primitiveVersion: 0,
            password: '',
            new_password: '',
            protocol: undefined,
            ip: '',
            port: 0,
            service: '',
            nmp_service: '',
            proxy_host: '',
            proxy_port: 0,
            payment_model: undefined,
            serv_plugin: '',
            thread_number: 0,
            timeout_a: 0,
            timeout_b: 0,
            timeout_c: 0,
            psp_notify_payment: false,
            rt_push: false,
            rpt_carousel: false,
            recovery: false,
            digital_stamp_brand: false,
            on_us: false,
          }),
        };

  const validatePortRange = (port: number | undefined) => {
    if (port) {
      return port > 0 && port < 65556 ? false : true;
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

  const validatePrimitiveVersion = (primitiveVersion: number | undefined) => {
    if (primitiveVersion) {
      return primitiveVersion > 0 && primitiveVersion <= 2 ? false : true;
    }
    return false;
  };

  const validate = (values: Partial<ChannelOnCreation>) =>
    Object.fromEntries(
      Object.entries({
        ...{
          pspBrokerCode: !values.pspBrokerCode ? 'Campo obbligatorio' : undefined,
          businessName: !values.businessName ? 'Campo obbligatorio' : undefined,
          idChannel: !values.idChannel ? 'Campo obbligatorio' : undefined,
          redirectPort: !values.redirectPort
            ? 'Campo obbligatorio'
            : validatePortRange(values.redirectPort)
            ? 'Non Valido, il numero della porta dev’essere compreso tra 1 e 65555'
            : undefined,
          redirectIp: !values.redirectIp ? 'Campo obbligatorio' : undefined,
          redirectService: !values.redirectService ? 'Campo obbligatorio' : undefined,
          redirectParameters: !values.redirectParameters ? 'Campo obbligatorio' : undefined,
          targetAddress: !values.targetAddress ? 'Campo obbligatorio' : undefined,
          targetService: !values.targetService ? 'Campo obbligatorio' : undefined,
          targetPort: !values.targetPort
            ? 'Campo obbligatorio'
            : validatePortRange(values.targetPort)
            ? 'Non Valido, il numero della porta dev’essere compreso tra 1 e 65555'
            : undefined,
          paymentType: values.paymentType?.includes('') ? 'Campo obbligatorio' : undefined,
        },
        ...(isOperator && {
          primitiveVersion: !values.primitiveVersion
            ? 'Campo obbligatorio'
            : validatePrimitiveVersion(values.primitiveVersion)
            ? t('addEditStationPage.validation.overVersion')
            : undefined,
          password: !values.password ? 'Campo obbligatorio' : undefined,
          new_password: !values.new_password ? 'Campo obbligatorio' : undefined,
          protocol: !values.protocol ? 'Campo obbligatorio' : undefined,
          ip: !values.ip ? 'Campo obbligatorio' : undefined,
          port: !values.port
            ? 'Campo obbligatorio'
            : validatePortRange(values.port)
            ? 'Non Valido, il numero della porta dev’essere compreso tra 1 e 65555'
            : undefined,
          service: !values.service ? 'Campo obbligatirio' : undefined,
          nmp_service: !values.nmp_service ? 'Campo obbligatirio' : undefined,
          proxy_host: !values.proxy_host ? 'Campo obbligatorio' : undefined,
          proxy_port: !values.proxy_port
            ? 'Campo obbligatorio'
            : validatePortRange(values.proxy_port)
            ? 'Non Valido, il numero della porta dev’essere compreso tra 1 e 65555'
            : undefined,
        }),
      }).filter(([_key, value]) => value)
    );

  const formik = useFormik<ChannelOnCreation>({
    initialValues: initialFormData(channelCode, channelDetail, selectedParty),
    validate,
    onSubmit: () => {
      setShowConfirmModal(true);
    },
    enableReinitialize: true,
    validateOnMount: true,
  });

  const addPaymentMethod = async () => {
    if (isOperator && formik.values.paymentType) {
      const newArr = [...formik.values.paymentType, ''];
      await formik.setFieldValue('paymentType', newArr);
    }
  };

  const deletePaymentMethod = async (index: number) => {
    if (isOperator && formik.values.paymentType) {
      const newArr = [...formik.values.paymentType];
      if (index > -1 && index < formik.values.paymentType.length) {
        // eslint-disable-next-line functional/immutable-data
        newArr.splice(index, 1);
      }
      await formik.setFieldValue('paymentType', newArr);
    }
  };

  const redirectAfterSubmit = () => {
    if (isOperator) {
      history.push(generatePath(`${ROUTES.CHANNEL_DETAIL}`, { channelId }), {
        alertSuccessMessage: t('addEditChannelPage.addForm.successMessage'),
      });
    } else {
      history.push(ROUTES.CHANNELS, {
        alertSuccessMessage: t('addEditChannelPage.addForm.successMessage'),
      });
    }
  };

  const submit = async () => {
    setShowConfirmModal(false);
    setLoading(true);

    try {
      if (formAction === FormAction.Create || formAction === FormAction.Duplicate) {
        const createResult = isOperator
          ? await createChannel(formik.values)
          : await createWrapperChannelDetails(formik.values);

        if (createResult) {
          //   await associatePSPtoChannel(
          //     formik.values.idChannel ?? '',
          //     formik.values.pspBrokerCode ?? '',
          //     {
          //       payment_types: formik.values.paymentType,
          //     }
          //   );
        }
      }
      if (formAction === FormAction.Edit) {
        if (isOperator) {
          await updateChannel(channelCode, formik.values);
        } else {
          await updateWrapperChannel(formik.values);
        }
      }
      redirectAfterSubmit();
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
        addError({
          id: 'GET_PAYMENT_TYPES',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while getting payment types`,
          toNotify: true,
          displayableTitle: t('addEditChannelPage.addForm.errorMessageTitle'),
          displayableDescription: t('addEditChannelPage.addForm.errorMessagePaymentTypesDesc'),
          component: 'Toast',
        });
      });
  }, []);

  const openConfrimModal = () => {
    if (formik.isValid) {
      setShowConfirmModal(true);
    }
    setShowConfirmModal(false);
  };

  const handleChangeNumberOnly = (
    e: React.ChangeEvent<any>,
    field: string,
    formik: FormikProps<ChannelOnCreation>
  ) => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === '' || regex.test(e.target.value)) {
      formik.setFieldValue(field, e.target.value);
    }
  };

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
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h6" mb={1}>
                {t('channelDetailPage.channelConfiguration')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" mb={3}>
                {t('channelDetailPage.channelConfiguration')}
              </Typography>
            </Grid>
          </Grid>

          <Box>
            <Box sx={inputGroupStyle}>
              <AddEditChannelFormSectionTitle
                title={t('addEditChannelPage.addForm.sections.registry')}
                icon={<BadgeIcon fontSize="small" />}
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
                    inputProps={{
                      'data-testid': 'psp-brokercode-test',
                    }}
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
                    inputProps={{
                      'data-testid': 'business-name-test',
                    }}
                  />
                </Grid>
                <Grid container item xs={6} direction="column">
                  <TextField
                    fullWidth
                    id="idChannel"
                    name="idChannel"
                    disabled={true}
                    label={t('addEditChannelPage.addForm.fields.idChannel')}
                    size="small"
                    value={formik.values.idChannel}
                    onChange={formik.handleChange}
                    error={formik.touched.idChannel && Boolean(formik.errors.idChannel)}
                    helperText={formik.touched.idChannel && formik.errors.idChannel}
                    inputProps={{
                      'data-testid': 'channel-code-test',
                    }}
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
                      value={
                        formik.values.redirectProtocol === 'HTTPS'
                          ? Redirect_protocolEnum.HTTPS
                          : Redirect_protocolEnum.HTTP
                      }
                      onChange={formik.handleChange}
                      error={
                        formik.touched.redirectProtocol && Boolean(formik.errors.redirectProtocol)
                      }
                      inputProps={{
                        'data-testid': 'redirect-protocol-test',
                      }}
                    >
                      {redirectProtocol.map((p) => (
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
                    inputProps={{
                      step: 1,
                      min: 0,
                      max: 65556,
                      'data-testid': 'redirect-port-test',
                    }}
                    label={t('addEditChannelPage.addForm.fields.redirectPort')}
                    size="small"
                    value={formik.values.redirectPort === 0 ? '' : formik.values.redirectPort}
                    onChange={(e) => handleChangeNumberOnly(e, 'redirectPort', formik)}
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
                    inputProps={{
                      'data-testid': 'redirect-ip-test',
                    }}
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
                    inputProps={{
                      'data-testid': 'redirect-service-test',
                    }}
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
                    inputProps={{
                      'data-testid': 'redirect-parameters-test',
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box sx={inputGroupStyle}>
              <AddEditChannelFormSectionTitle
                title={t('addEditChannelPage.addForm.sections.target')}
                icon={<MenuBookIcon />}
              ></AddEditChannelFormSectionTitle>
              <Grid container spacing={2} mt={1}>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="targetAddress"
                    name="targetAddress"
                    label={t('addEditChannelPage.addForm.fields.targetIp')}
                    size="small"
                    value={formik.values.targetAddress}
                    onChange={formik.handleChange}
                    error={formik.touched.targetAddress && Boolean(formik.errors.targetAddress)}
                    helperText={formik.touched.targetAddress && formik.errors.targetAddress}
                    inputProps={{
                      'data-testid': 'target-address-test',
                    }}
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
                    inputProps={{
                      'data-testid': 'target-service-test',
                    }}
                  />
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="targetPort"
                    name="targetPort"
                    type="number"
                    InputLabelProps={{ shrink: formik.values.targetPort ? true : false }}
                    inputProps={{
                      step: 1,
                      min: 0,
                      max: 65556,
                      'data-testid': 'target-port-test',
                    }}
                    label={t('addEditChannelPage.addForm.fields.targetPort')}
                    size="small"
                    value={formik.values.targetPort === 0 ? '' : formik.values.targetPort}
                    onChange={(e) => handleChangeNumberOnly(e, 'targetPort', formik)}
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
              ></AddEditChannelFormSectionTitle>
              <Grid container spacing={2} mt={1}>
                {formik.values.paymentType?.map((_pT, i) => (
                  <Grid container spacing={2} mt={1} key={i} ml={1}>
                    {i > 0 && isOperator ? (
                      <Grid container item xs={1} key={`remove${i}`} mt={1}>
                        <RemoveCircleOutline
                          color="error"
                          sx={{
                            cursor: 'pointer',
                          }}
                          onClick={() => deletePaymentMethod(i)}
                          id={`remove_PaymentMethod${i}`}
                          data-testid="remove-payment-method"
                        />
                      </Grid>
                    ) : null}
                    <Grid container item xs={i > 0 && isOperator ? 5 : 6} key={`item${i}`}>
                      <FormControl fullWidth key={`FormControl${i}`}>
                        <InputLabel size="small" key={`InputLabel${i}_label`}>
                          {t('addEditChannelPage.addForm.fields.paymentType')}
                        </InputLabel>
                        <Select
                          id={`paymentType${i}_select`}
                          labelId={`paymentType${i}_label`}
                          name={`paymentType${i}_name`}
                          label={t('addEditChannelPage.addForm.fields.paymentType')}
                          placeholder={t('addEditChannelPage.addForm.fields.paymentType')}
                          size="small"
                          defaultValue={undefined}
                          disabled={
                            isOperator ? false : formAction === FormAction.Edit ? true : false
                          }
                          value={formik.values.paymentType ? formik.values.paymentType[i] : ''}
                          onChange={(event) =>
                            formik.setFieldValue(
                              'paymentType',
                              formik.values.paymentType?.map((pType, j) =>
                                j === i ? event.target.value : pType
                              )
                            )
                          }
                          error={formik.touched.paymentType && Boolean(formik.errors.paymentType)}
                          inputProps={{
                            'data-testid': 'payment-type-test',
                          }}
                        >
                          {paymentOptions &&
                            sortPaymentType(paymentOptions.payment_types).map((option: any) => (
                              <MenuItem key={option.payment_type} value={option.payment_type}>
                                {`${option.description} - ${option.payment_type}`}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    {isOperator && (
                      <Grid container spacing={2} mt={1} ml={1}>
                        {i === 0 && (
                          <Grid container item xs={6}>
                            <ButtonNaked
                              size="medium"
                              component="button"
                              onClick={() => addPaymentMethod()}
                              sx={{ color: 'primary.main', mr: '20px' }}
                              weight="default"
                              data-testid="add-payment-test"
                            >
                              {t('addEditChannelPage.addForm.fields.addPayment')}
                            </ButtonNaked>
                          </Grid>
                        )}
                      </Grid>
                    )}
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Paper>

        {formAction === FormAction.Edit && isOperator ? (
          <AddEditChannelValidationForm
            formik={formik}
            handleChangeNumberOnly={handleChangeNumberOnly}
          />
        ) : null}

        <Stack direction="row" justifyContent="space-between" mt={5}>
          <Stack display="flex" justifyContent="flex-start" mr={2}>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => history.push(`${BASE_ROUTE}/channels/${channelCode}`)}
            >
              {t('addEditChannelPage.addForm.backButton')}
            </Button>
          </Stack>
          <Stack display="flex" justifyContent="flex-end">
            <Button
              onClick={() => openConfrimModal}
              disabled={!(formik.isValid && formik.dirty)}
              color="primary"
              variant="contained"
              type="submit"
            >
              {t('addEditChannelPage.addForm.continueButton')}
            </Button>
          </Stack>
        </Stack>
      </form>
      {
        // eslint-disable-next-line sonarjs/no-all-duplicated-branches
        isOperator ? (
          <ConfirmModal
            title={t('addEditChannelPage.confirmModal.channelConfiguration')}
            message={t('addEditChannelPage.confirmModal.messageChannelOperation')}
            openConfirmModal={showConfirmModal}
            onConfirmLabel={t('addEditChannelPage.confirmModal.confirmButtonOpe')}
            onCloseLabel={t('addEditChannelPage.confirmModal.cancelButton')}
            handleCloseConfirmModal={() => setShowConfirmModal(false)}
            handleConfrimSubmit={submit}
            isOperator={isOperator}
          />
        ) : (
          <ConfirmModal
            title={t('addEditStationPage.confirmModal.title')}
            message={
              <Trans i18nKey="addEditChannelPage.confirmModal.message">
                Un operatore PagoPA revisionerà le informazioni inserite nel canale prima di
                approvare. Riceverai una notifica a revisione completata.
                <br />
              </Trans>
            }
            openConfirmModal={showConfirmModal}
            onConfirmLabel={t('addEditChannelPage.confirmModal.confirmButton')}
            onCloseLabel={t('addEditChannelPage.confirmModal.cancelButton')}
            handleCloseConfirmModal={() => setShowConfirmModal(false)}
            handleConfrimSubmit={submit}
            isOperator={isOperator}
          />
        )
      }
    </>
  );
};

export default AddEditChannelForm;
