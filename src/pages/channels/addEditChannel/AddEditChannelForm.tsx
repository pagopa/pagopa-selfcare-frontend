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
import ROUTES from '../../../routes';
import { ChannelOnCreation, FormAction } from '../../../model/Channel';
import {
  // associatePSPtoChannel,
  createChannel,
  createWrapperChannelDetails,
  getPaymentTypes,
  getWfespPlugins,
  updateChannel,
  updateWrapperChannelDetailsToCheck,
  updateWrapperChannelDetailsToCheckUpdate,
} from '../../../services/channelService';
import { PaymentTypesResource } from '../../../api/generated/portal/PaymentTypesResource';
import { Party } from '../../../model/Party';
import {
  LOADING_TASK_CHANNEL_ADD_EDIT,
  LOADING_TASK_PAYMENT_TYPE,
  LOADING_TASK_WFESP_PLUGIN,
} from '../../../utils/constants';
import {
  ChannelDetailsDto,
  Redirect_protocolEnum,
} from '../../../api/generated/portal/ChannelDetailsDto';
import { sortPaymentType } from '../../../model/PaymentType';
import ConfirmModal from '../../components/ConfirmModal';
import { isOperator } from '../../stations/components/commonFunctions';
import { ChannelDetailsResource } from '../../../api/generated/portal/ChannelDetailsResource';
import { WrapperStatusEnum } from '../../../api/generated/portal/WrapperChannelDetailsResource';
import { WfespPluginConf } from '../../../api/generated/portal/WfespPluginConf';
import AddEditChannelFormSectionTitle from './AddEditChannelFormSectionTitle';
import AddEditChannelValidationForm from './components/AddEditChannelValidationForm';

type Props = {
  selectedParty: Party;
  channelDetail?: ChannelDetailsResource;
  channelCode: string;
  formAction: string;
};

const AddEditChannelForm = ({ selectedParty, channelCode, channelDetail, formAction }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();

  const setLoading = useLoading(LOADING_TASK_CHANNEL_ADD_EDIT);
  const setLoadingPayment = useLoading(LOADING_TASK_PAYMENT_TYPE);
  const setLoadingWfesp = useLoading(LOADING_TASK_WFESP_PLUGIN);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentOptions, setPaymentOptions] = useState<PaymentTypesResource>({ payment_types: [] });
  const [wfespPlugin, setWfespPlugin] = useState<Array<WfespPluginConf>>([]);
  const operator = isOperator();
  const redirectProtocol = ['HTTP', 'HTTPS'];
  const { channelId } = useParams<{ channelId: string }>();

  const initialFormData = (
    channelCode: string,
    channelDetail?: ChannelDetailsResource,
    selectedParty?: Party
  ): ChannelDetailsDto =>
    channelDetail
      ? {
          broker_description: channelDetail.broker_description ?? '',
          broker_psp_code: channelDetail.broker_psp_code ?? '',
          channel_code: channelCode,
          digital_stamp_brand: channelDetail.digital_stamp_brand ?? false,
          ip: channelDetail.ip ?? '',
          new_password: channelDetail.new_password ?? '',
          nmp_service: channelDetail.nmp_service ?? '',
          on_us: channelDetail.on_us ?? false,
          password: channelDetail.password ?? '',
          payment_model: channelDetail.payment_model ?? undefined,
          payment_types: channelDetail.payment_types ? [...channelDetail.payment_types] : [''],
          port: channelDetail.port ?? 0,
          primitive_version: channelDetail.primitive_version ?? undefined,
          protocol: channelDetail.protocol ?? undefined,
          proxy_host: channelDetail.proxy_host ?? '',
          proxy_port: channelDetail.proxy_port ?? 0,
          flag_io: channelDetail.flag_io ?? false,
          recovery: channelDetail.recovery ?? false,
          redirect_ip: channelDetail.redirect_ip ?? '',
          redirect_path: channelDetail.redirect_path ?? '',
          redirect_port: channelDetail.redirect_port ?? undefined,
          redirect_protocol: Redirect_protocolEnum.HTTPS, // channelDetail.redirect_protocol,
          redirect_query_string: channelDetail.redirect_query_string ?? '',
          card_chart: false,
          rt_push: channelDetail.rt_push ?? false,
          serv_plugin: channelDetail.serv_plugin ?? '',
          service: channelDetail.service ?? '',
          target_host: channelDetail.target_host ?? '',
          target_path: channelDetail.target_path ?? '',
          target_port: channelDetail.target_port ?? undefined,
          thread_number: channelDetail.thread_number ?? 0,
          timeout_a: channelDetail.timeout_a ?? 0,
          timeout_b: channelDetail.timeout_b ?? 0,
          timeout_c: channelDetail.timeout_c ?? 0,
        }
      : {
          broker_description: selectedParty?.description ?? '',
          broker_psp_code: selectedParty?.fiscalCode ?? '',
          channel_code: channelCode,
          digital_stamp_brand: false,
          ip: '',
          new_password: '',
          nmp_service: '',
          on_us: false,
          password: '',
          payment_model: undefined,
          payment_types: [''],
          port: 0,
          primitive_version: undefined,
          protocol: undefined,
          proxy_host: '',
          proxy_port: 0,
          flag_io: false,
          recovery: false,
          redirect_ip: '',
          redirect_path: '',
          redirect_port: undefined,
          redirect_protocol: Redirect_protocolEnum.HTTPS,
          redirect_query_string: '',
          card_chart: false,
          rt_push: false,
          serv_plugin: '',
          service: '',
          target_host: '',
          target_path: '',
          target_port: undefined,
          thread_number: 0,
          timeout_a: 0,
          timeout_b: 0,
          timeout_c: 0,
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

  const validatePrimitiveVersion = (primitive_version: number | undefined) => {
    if (primitive_version) {
      return primitive_version > 0 && primitive_version <= 2 ? false : true;
    }
    return false;
  };

  const validate = (values: Partial<ChannelDetailsDto>) =>
    Object.fromEntries(
      Object.entries({
        ...{
          broker_psp_code: !values.broker_psp_code ? 'Campo obbligatorio' : undefined,
          broker_description: !values.broker_description ? 'Campo obbligatorio' : undefined,
          channel_code: !values.channel_code ? 'Campo obbligatorio' : undefined,
          redirect_port: !values.redirect_port
            ? 'Campo obbligatorio'
            : validatePortRange(values.redirect_port)
            ? 'Non Valido, il numero della porta dev’essere compreso tra 1 e 65555'
            : undefined,
          redirect_ip: !values.redirect_ip ? 'Campo obbligatorio' : undefined,
          redirect_path: !values.redirect_path ? 'Campo obbligatorio' : undefined,
          redirect_query_string: !values.redirect_query_string ? 'Campo obbligatorio' : undefined,
          target_host: !values.target_host ? 'Campo obbligatorio' : undefined,
          target_path: !values.target_path ? 'Campo obbligatorio' : undefined,
          target_port: !values.target_port
            ? 'Campo obbligatorio'
            : validatePortRange(values.target_port)
            ? 'Non Valido, il numero della porta dev’essere compreso tra 1 e 65555'
            : undefined,
          payment_types: values.payment_types?.includes('') ? 'Campo obbligatorio' : undefined,
        },
        ...(operator && {
          primitive_version: !values.primitive_version
            ? 'Campo obbligatorio'
            : validatePrimitiveVersion(values.primitive_version)
            ? t('addEditStationPage.validation.overVersion')
            : undefined,
          password: !values.password ? 'Campo obbligatorio' : undefined,
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

  const formik = useFormik<ChannelDetailsDto>({
    initialValues: initialFormData(channelCode, channelDetail, selectedParty),
    validate,
    onSubmit: () => {
      setShowConfirmModal(true);
    },
    enableReinitialize: true,
    validateOnMount: true,
  });

  const addPaymentMethod = async () => {
    if (operator && formik.values.payment_types) {
      const newArr = [...formik.values.payment_types, ''];
      await formik.setFieldValue('payment_types', newArr);
    }
  };

  const deletePaymentMethod = async (index: number) => {
    if (operator && formik.values.payment_types) {
      const newArr = [...formik.values.payment_types];
      if (index > -1 && index < formik.values.payment_types.length) {
        // eslint-disable-next-line functional/immutable-data
        newArr.splice(index, 1);
      }
      await formik.setFieldValue('payment_types', newArr);
    }
  };

  const redirect = () => {
    if (operator) {
      history.push(generatePath(ROUTES.CHANNEL_DETAIL, { channelId: formik.values.channel_code }));
    } else {
      history.push(ROUTES.CHANNELS);
    }
  };

  const submit = async (values: ChannelDetailsDto) => {
    setShowConfirmModal(false);
    setLoading(true);

    try {
      const validationUrl = `${window.location.origin}${generatePath(ROUTES.CHANNEL_DETAIL, {
        channelId: formik.values.channel_code,
      })}`;
      if (formAction === FormAction.Create || formAction === FormAction.Duplicate) {
        await createWrapperChannelDetails(values, validationUrl);
        redirect();
      }

      if (formAction === FormAction.Edit) {
        // eslint-disable-next-line no-debugger
        debugger;
        switch (channelDetail?.wrapperStatus) {
          case WrapperStatusEnum.TO_CHECK:
            if (operator) {
              await createChannel(values);
            } else {
              await updateWrapperChannelDetailsToCheck(values, validationUrl);
            }
            break;
          case WrapperStatusEnum.APPROVED:
          case WrapperStatusEnum.TO_CHECK_UPDATE:
            if (operator) {
              await updateChannel(channelCode, values);
            } else {
              await updateWrapperChannelDetailsToCheckUpdate(values, validationUrl);
            }
            break;
          case WrapperStatusEnum.TO_FIX:
            await updateWrapperChannelDetailsToCheck(values, validationUrl);
            break;
          default:
            break;
        }
        redirect();
      }
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
    setLoadingPayment(true);
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
      })
      .finally(() => setLoadingPayment(false));

    if (operator) {
      setLoadingWfesp(true);
      getWfespPlugins()
        .then((result) => {
          if (typeof result.wfesp_plugin_confs !== 'undefined') {
            setWfespPlugin([...result.wfesp_plugin_confs]);
          }
        })
        .catch((reason) => {
          addError({
            id: 'GET_WFESP_PLUGIN',
            blocking: false,
            error: reason as Error,
            techDescription: `An error occurred while getting wfesp plugin`,
            toNotify: true,
            displayableTitle: t('addEditChannelPage.addForm.errorMessageTitle'),
            displayableDescription: t('addEditChannelPage.addForm.errorMessageWfespDesc'),
            component: 'Toast',
          });
        })
        .finally(() => setLoadingWfesp(false));
    }
  }, []);

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

  const openConfirmModal = () => {
    if (formik.isValid) {
      setShowConfirmModal(true);
    } else {
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 1,
          p: 3,
          minWidth: '100%',
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
                  id="broker_psp_code"
                  name="broker_psp_code"
                  label={t('addEditChannelPage.addForm.fields.pspBrokerCode')}
                  size="small"
                  disabled
                  value={formik.values.broker_psp_code}
                  onChange={formik.handleChange}
                  error={formik.touched.broker_psp_code && Boolean(formik.errors.broker_psp_code)}
                  helperText={formik.touched.broker_psp_code && formik.errors.broker_psp_code}
                  inputProps={{
                    'data-testid': 'psp-brokercode-test',
                  }}
                />
              </Grid>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="broker_description"
                  name="broker_description"
                  disabled
                  label={t('addEditChannelPage.addForm.fields.businessName')}
                  size="small"
                  value={formik.values.broker_description}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.broker_description && Boolean(formik.errors.broker_description)
                  }
                  helperText={formik.touched.broker_description && formik.errors.broker_description}
                  inputProps={{
                    'data-testid': 'business-name-test',
                  }}
                />
              </Grid>
              <Grid container item xs={6} direction="column">
                <TextField
                  fullWidth
                  id="channel_code"
                  name="channel_code"
                  disabled={true}
                  label={t('addEditChannelPage.addForm.fields.idChannel')}
                  size="small"
                  value={formik.values.channel_code}
                  onChange={formik.handleChange}
                  error={formik.touched.channel_code && Boolean(formik.errors.channel_code)}
                  helperText={formik.touched.channel_code && formik.errors.channel_code}
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
                    id="redirect_protocol"
                    name="redirect_protocol"
                    label={t('addEditChannelPage.addForm.fields.redirectProtocol')}
                    size="small"
                    defaultValue={formik.values.redirect_protocol}
                    value={
                      formik.values.redirect_protocol === 'HTTPS'
                        ? Redirect_protocolEnum.HTTPS
                        : Redirect_protocolEnum.HTTP
                    }
                    onChange={formik.handleChange}
                    error={
                      formik.touched.redirect_protocol && Boolean(formik.errors.redirect_protocol)
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
                  id="redirect_port"
                  name="redirect_port"
                  type="number"
                  InputLabelProps={{ shrink: formik.values.redirect_port ? true : false }}
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: 65556,
                    'data-testid': 'redirect-port-test',
                  }}
                  label={t('addEditChannelPage.addForm.fields.redirectPort')}
                  size="small"
                  value={formik.values.redirect_port === 0 ? '' : formik.values.redirect_port}
                  onChange={(e) => handleChangeNumberOnly(e, 'redirect_port', formik)}
                  error={formik.touched.redirect_port && Boolean(formik.errors.redirect_port)}
                  helperText={formik.touched.redirect_port && formik.errors.redirect_port}
                />
              </Grid>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="redirect_ip"
                  name="redirect_ip"
                  label={t('addEditChannelPage.addForm.fields.redirectIp')}
                  size="small"
                  value={formik.values.redirect_ip}
                  onChange={formik.handleChange}
                  error={formik.touched.redirect_ip && Boolean(formik.errors.redirect_ip)}
                  helperText={formik.touched.redirect_ip && formik.errors.redirect_ip}
                  inputProps={{
                    'data-testid': 'redirect-ip-test',
                  }}
                />
              </Grid>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="redirect_path"
                  name="redirect_path"
                  label={t('addEditChannelPage.addForm.fields.redirectService')}
                  size="small"
                  value={formik.values.redirect_path}
                  onChange={formik.handleChange}
                  error={formik.touched.redirect_path && Boolean(formik.errors.redirect_path)}
                  helperText={formik.touched.redirect_path && formik.errors.redirect_path}
                  inputProps={{
                    'data-testid': 'redirect-service-test',
                  }}
                />
              </Grid>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="redirect_query_string"
                  name="redirect_query_string"
                  label={t('addEditChannelPage.addForm.fields.redirectParameters')}
                  size="small"
                  value={formik.values.redirect_query_string}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.redirect_query_string &&
                    Boolean(formik.errors.redirect_query_string)
                  }
                  helperText={
                    formik.touched.redirect_query_string && formik.errors.redirect_query_string
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
                  id="target_host"
                  name="target_host"
                  label={t('addEditChannelPage.addForm.fields.targetIp')}
                  size="small"
                  value={formik.values.target_host}
                  onChange={formik.handleChange}
                  error={formik.touched.target_host && Boolean(formik.errors.target_host)}
                  helperText={formik.touched.target_host && formik.errors.target_host}
                  inputProps={{
                    'data-testid': 'target-address-test',
                  }}
                />
              </Grid>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="target_path"
                  name="target_path"
                  label={t('addEditChannelPage.addForm.fields.targetService')}
                  size="small"
                  value={formik.values.target_path}
                  onChange={formik.handleChange}
                  error={formik.touched.target_path && Boolean(formik.errors.target_path)}
                  helperText={formik.touched.target_path && formik.errors.target_path}
                  inputProps={{
                    'data-testid': 'target-service-test',
                  }}
                />
              </Grid>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="target_port"
                  name="target_port"
                  type="number"
                  InputLabelProps={{ shrink: formik.values.target_port ? true : false }}
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: 65556,
                    'data-testid': 'target-port-test',
                  }}
                  label={t('addEditChannelPage.addForm.fields.targetPort')}
                  size="small"
                  value={formik.values.target_port === 0 ? '' : formik.values.target_port}
                  onChange={(e) => handleChangeNumberOnly(e, 'target_port', formik)}
                  error={formik.touched.target_port && Boolean(formik.errors.target_port)}
                  helperText={formik.touched.target_port && formik.errors.target_port}
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
              {formik.values.payment_types?.map((_pT, i) => (
                <Grid container spacing={2} mt={1} key={i} ml={1}>
                  {i > 0 && operator ? (
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
                  <Grid container item xs={i > 0 && operator ? 5 : 6} key={`item${i}`}>
                    <FormControl fullWidth key={`FormControl${i}`}>
                      <InputLabel size="small" key={`InputLabel${i}_label`}>
                        {t('addEditChannelPage.addForm.fields.paymentType')}
                      </InputLabel>
                      <Select
                        id={`payment_types${i}_select`}
                        labelId={`payment_types${i}_label`}
                        name={`payment_types${i}_name`}
                        label={t('addEditChannelPage.addForm.fields.paymentType')}
                        placeholder={t('addEditChannelPage.addForm.fields.paymentType')}
                        size="small"
                        defaultValue={undefined}
                        disabled={operator ? false : formAction === FormAction.Edit ? true : false}
                        value={formik.values.payment_types ? formik.values.payment_types[i] : ''}
                        onChange={(event) =>
                          formik.setFieldValue(
                            'payment_types',
                            formik.values.payment_types?.map((pType, j) =>
                              j === i ? event.target.value : pType
                            )
                          )
                        }
                        error={formik.touched.payment_types && Boolean(formik.errors.payment_types)}
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
                  {operator && (
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

      {formAction === FormAction.Edit && operator ? (
        <AddEditChannelValidationForm
          formik={formik}
          handleChangeNumberOnly={handleChangeNumberOnly}
          wfespPlugin={wfespPlugin}
        />
      ) : null}

      <Stack direction="row" justifyContent="space-between" mt={5}>
        <Stack display="flex" justifyContent="flex-start" mr={2}>
          <Button
            color="primary"
            variant="outlined"
            onClick={() =>
              operator
                ? history.push(generatePath(ROUTES.CHANNEL_DETAIL, { channelId }))
                : history.push(ROUTES.CHANNELS)
            }
            data-testid="back-btn-test"
          >
            {t('addEditChannelPage.addForm.backButton')}
          </Button>
        </Stack>
        <Stack display="flex" justifyContent="flex-end">
          <Button
            onClick={() => {
              openConfirmModal();
              formik.handleSubmit();
            }}
            disabled={!formik.isValid}
            color="primary"
            variant="contained"
            type="submit"
          >
            {t('addEditChannelPage.addForm.continueButton')}
          </Button>
        </Stack>
      </Stack>

      <ConfirmModal
        title={
          operator
            ? t('addEditChannelPage.confirmModal.channelConfiguration')
            : t('addEditStationPage.confirmModal.title')
        }
        message={
          operator ? (
            t('addEditChannelPage.confirmModal.messageChannelOperation')
          ) : (
            <Trans i18nKey="addEditChannelPage.confirmModal.message">
              Un operatore PagoPA revisionerà le informazioni inserite nel canale prima di
              approvare. Riceverai una notifica a revisione completata.
              <br />
            </Trans>
          )
        }
        openConfirmModal={showConfirmModal}
        onConfirmLabel={
          operator
            ? t('addEditChannelPage.confirmModal.confirmButtonOpe')
            : t('addEditChannelPage.confirmModal.confirmButton')
        }
        onCloseLabel={t('addEditChannelPage.confirmModal.cancelButton')}
        handleCloseConfirmModal={() => setShowConfirmModal(false)}
        handleConfrimSubmit={async () => {
          await submit(formik.values);
          setShowConfirmModal(false);
        }}
        isOperator={operator}
      />
    </>
  );
};

export default AddEditChannelForm;
