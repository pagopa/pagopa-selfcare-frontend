/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import { ButtonNaked, theme } from '@pagopa/mui-italia';
import { add } from 'date-fns';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { RemoveCircleOutline, MenuBook } from '@mui/icons-material';
import EuroIcon from '@mui/icons-material/Euro';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { NumericFormat } from 'react-number-format';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  LOADING_TASK_CREATING_COMMISSION_BUNDLE,
  LOADING_TASK_COMMISSION_BUNDLE_SELECT_DATAS,
  LOADING_TASK_GET_CHANNELS_IDS,
} from '../../../../utils/constants';
import { sortPaymentType } from '../../../../model/PaymentType';
import FormSectionTitle from '../../../../components/Form/FormSectionTitle';
import { useAppSelector } from '../../../../redux/hooks';
import { partiesSelectors } from '../../../../redux/slices/partiesSlice';
import GenericModal from '../../../../components/Form/GenericModal';
import { PaymentTypes } from '../../../../api/generated/portal/PaymentTypes';
import { BundleRequest } from '../../../../api/generated/portal/BundleRequest';
import { Taxonomies } from '../../../../api/generated/portal/Taxonomies';
import { Touchpoints } from '../../../../api/generated/portal/Touchpoints';
import { getChannelsIdAssociatedToPSP } from '../../../../services/channelService';
import { getPaymentTypes } from '../../../../services/configurationService';
import { createBundle, getTouchpoints } from '../../../../services/bundleService';
import { getTaxonomies } from '../../../../services/taxonomyService';
import { getBrokerDelegation } from '../../../../services/institutionService';
import { Delegation } from '../../../../api/generated/portal/Delegation';
import ROUTES from '../../../../routes';
import { TypeEnum } from '../../../../api/generated/portal/Bundle';

type Prop = {
  commBundleDetails: BundleRequest | undefined;
};
const minDateTomorrow = add(new Date(), { days: 1 });

const AddEditCommissionBundleForm = ({ commBundleDetails }: Prop) => {
  const { t } = useTranslation();
  const history = useHistory();
  const setLoading = useLoading(LOADING_TASK_COMMISSION_BUNDLE_SELECT_DATAS);
  const setLoadingCreating = useLoading(LOADING_TASK_CREATING_COMMISSION_BUNDLE);
  const setLoadingChannels = useLoading(LOADING_TASK_GET_CHANNELS_IDS);
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentOptions, setPaymentOptions] = useState<PaymentTypes>();
  const [touchpointList, setTouchpointList] = useState<Touchpoints>();
  const [taxonomyList, setTaxonomyList] = useState<Taxonomies>();
  const [brokerDelegationList, setBrokerDelegationList] = useState<Array<Delegation>>([]);
  const [channelsId, setChannelsId] = useState<Array<string>>([]);

  const inputGroupStyle = {
    borderRadius: 1,
    border: 1,
    borderColor: theme.palette.divider,
    p: 3,
    mb: 3,
  };

  const getChannelsByBrokerCode = async (selectedBrokerCode: string) => {
    setLoadingChannels(true);
    await getChannelsIdAssociatedToPSP(0, selectedBrokerCode)
      .then((data) => {
        if (data) {
          setChannelsId(data);
        }
      })
      .catch((error) => {
        addError({
          id: 'GET_CHANNEL_IDS_DATA',
          blocking: false,
          error: error as Error,
          techDescription: `An error occurred while getting data`,
          toNotify: true,
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t(
            'commissionBundlesPage.addEditCommissionBundle.error.errorMessageChannelIdsDataDesc'
          ),
          component: 'Toast',
        });
      })
      .finally(() => setLoadingChannels(false));
  };

  useEffect(() => {
    if (commBundleDetails?.idBrokerPsp && brokerDelegationList.length > 0) {
      getChannelsByBrokerCode(
        brokerDelegationList?.find((el) => el.institution_name === commBundleDetails?.idBrokerPsp)
          ?.broker_tax_code ?? ''
      ).finally(() => {});
    }
  }, [commBundleDetails, brokerDelegationList]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getPaymentTypes(),
      getTouchpoints(0, 50),
      getTaxonomies(),
      getBrokerDelegation(undefined, selectedParty?.partyId ?? ''),
    ])
      .then(([paymentTypes, touchpoints, taxonomyService, brokerDelegation]) => {
        if (paymentTypes) {
          setPaymentOptions(paymentTypes);
        }
        if (touchpoints) {
          setTouchpointList(touchpoints);
        }
        if (taxonomyService) {
          setTaxonomyList(taxonomyService);
        }
        if (brokerDelegation && brokerDelegation.length > 0) {
          setBrokerDelegationList(brokerDelegation);
        } else {
          addError({
            id: 'GET_BROKER_DELEGATIONS_DATA',
            blocking: false,
            error: new Error(`An error occurred while getting data`),
            techDescription: `An error occurred while getting data`,
            toNotify: true,
            displayableTitle: t('general.errorTitle'),
            displayableDescription: t(
              'commissionBundlesPage.addEditCommissionBundle.error.errorMessageNoBrokerDelegations'
            ),
            component: 'Toast',
          });
        }
      })
      .catch((reason) => {
        addError({
          id: 'GET_ALL_DATA',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while getting data`,
          toNotify: true,
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t(
            'commissionBundlesPage.addEditCommissionBundle.error.errorMessageAllDataDesc'
          ),
          component: 'Toast',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedParty]);

  const initialFormData = (detail?: BundleRequest) => ({
    abi: detail?.abi ?? '', // TODO insert ABI code value
    description: detail?.description ?? '',
    digitalStamp: detail?.digitalStamp ?? false,
    digitalStampRestriction: detail?.digitalStampRestriction ?? false,
    idBrokerPsp: detail?.idBrokerPsp ?? '',
    idCdi: detail?.idCdi ?? '',
    idChannel: detail?.idChannel ?? '',
    maxPaymentAmount: detail?.maxPaymentAmount ?? 0,
    minPaymentAmount: detail?.minPaymentAmount ?? 0,
    name: detail?.name ?? '',
    paymentAmount: detail?.paymentAmount ?? 0,
    paymentType: detail?.paymentType ?? undefined,
    touchpoint: detail?.touchpoint ?? undefined,
    transferCategoryList: detail?.transferCategoryList ? [...detail.transferCategoryList] : [''],
    type: detail?.type ?? undefined,
    validityDateFrom: detail?.validityDateFrom ?? minDateTomorrow,
    validityDateTo: detail?.validityDateTo ?? minDateTomorrow,
    pspBusinessName: selectedParty?.description ?? '',
  });

  const validate = (values: Partial<BundleRequest>) =>
    Object.fromEntries(
      Object.entries({
        ...{
          description: !values.description
            ? t('commissionBundlesPage.addEditCommissionBundle.validationMessage.requiredField')
            : undefined,
          idChannel: !values.idChannel
            ? t('commissionBundlesPage.addEditCommissionBundle.validationMessage.requiredField')
            : undefined,
          maxPaymentAmount: !values.maxPaymentAmount
            ? t('commissionBundlesPage.addEditCommissionBundle.validationMessage.requiredField')
            : undefined,
          minPaymentAmount: !values.minPaymentAmount
            ? t('commissionBundlesPage.addEditCommissionBundle.validationMessage.requiredField')
            : undefined,
          name: !values.name
            ? t('commissionBundlesPage.addEditCommissionBundle.validationMessage.requiredField')
            : undefined,
          paymentAmount: !values.paymentAmount
            ? t('commissionBundlesPage.addEditCommissionBundle.validationMessage.requiredField')
            : undefined,
          type: !values.type
            ? t('commissionBundlesPage.addEditCommissionBundle.validationMessage.requiredField')
            : undefined,
          validityDateFrom: !values.validityDateFrom
            ? t('commissionBundlesPage.addEditCommissionBundle.validationMessage.requiredField')
            : values.validityDateFrom.getTime() < minDateTomorrow.getTime()
            ? t('commissionBundlesPage.addEditCommissionBundle.validationMessage.dateNotValid')
            : values.validityDateTo &&
              values.validityDateFrom.getTime() > values.validityDateTo.getTime()
            ? t(
                'commissionBundlesPage.addEditCommissionBundle.validationMessage.startDateOverEndDate'
              )
            : undefined,
          validityDateTo: !values.validityDateTo
            ? t('commissionBundlesPage.addEditCommissionBundle.validationMessage.requiredField')
            : values.validityDateTo.getTime() < minDateTomorrow.getTime()
            ? t('commissionBundlesPage.addEditCommissionBundle.validationMessage.dateNotValid')
            : values.validityDateFrom &&
              values.validityDateTo.getTime() < values.validityDateFrom.getTime()
            ? t(
                'commissionBundlesPage.addEditCommissionBundle.validationMessage.endDateUnderStartDate'
              )
            : undefined,
        },
      }).filter(([_key, value]) => value)
    );

  const enableSubmit = (values: BundleRequest) =>
    values.type !== undefined &&
    values.name !== '' &&
    values.minPaymentAmount !== 0 &&
    !Number.isNaN(values.minPaymentAmount) &&
    values.maxPaymentAmount !== 0 &&
    !Number.isNaN(values.maxPaymentAmount) &&
    values.paymentAmount !== 0 &&
    !Number.isNaN(values.paymentAmount) &&
    values.idChannel !== '' &&
    values.idChannel !== undefined &&
    values.description !== '' &&
    values.validityDateFrom != null &&
    values.validityDateFrom.getTime() > 0 &&
    values.validityDateTo != null &&
    values.validityDateTo.getTime() > 0;

  const submit = async (body: BundleRequest) => {
    setLoadingCreating(true);
    const pspTaxCode = selectedParty?.fiscalCode ? `PSP${selectedParty.fiscalCode}` : '';

    // TODO ADD UPDATE
    createBundle(pspTaxCode, body)
      .then((_) => {
        history.push(ROUTES.COMMISSION_BUNDLES);
      })
      .catch((reason: Error) => {
        addError({
          id: 'CREATE_COMMISSION_BUNDLE',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while creating commission bundle`,
          toNotify: true,
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t(
            'commissionBundlesPage.addEditCommissionBundle.error.errorMessageCreatingBundle'
          ),
          component: 'Toast',
        });
      })
      .finally(() => {
        setLoadingCreating(false);
      });
  };

  const formik = useFormik<Partial<BundleRequest>>({
    initialValues: initialFormData(commBundleDetails),
    validate,
    onSubmit: async () => {
      setShowConfirmModal(true);
    },
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: true,
  });

  const addTransferCategoryItem = async () => {
    if (formik.values.transferCategoryList) {
      const newArr = [...formik.values.transferCategoryList, ''];
      await formik.setFieldValue('transferCategoryList', newArr);
    }
  };

  const deleteTransferCategoryItem = async (index: number) => {
    if (formik.values.transferCategoryList) {
      const newArr = [...formik.values.transferCategoryList];
      if (index > -1 && index < formik.values.transferCategoryList.length) {
        // eslint-disable-next-line functional/immutable-data
        newArr.splice(index, 1);
      }
      await formik.setFieldValue('transferCategoryList', newArr);
    }
  };

  const shouldDisableDate = (date: Date) => date < new Date();

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
          mb: 4,
        }}
      >
        <Typography variant="h6" mb={3}>
          {t('commissionBundlesPage.addEditCommissionBundle.form.bundleType')}
        </Typography>

        <FormControl>
          <RadioGroup
            name="bundleType"
            row
            onChange={(e) => formik.setFieldValue('type', e.target.value)}
            data-testid="bundle-type-test"
            value={`${formik.values.type}`}
          >
            <FormControlLabel
              value={TypeEnum.GLOBAL}
              control={<Radio />}
              label={t('commissionBundlesPage.addEditCommissionBundle.form.globalBundle')}
              sx={{ pr: 8 }}
            />
            <FormControlLabel
              value={TypeEnum.PUBLIC}
              control={<Radio />}
              label={t('commissionBundlesPage.addEditCommissionBundle.form.publicBundle')}
              sx={{ pr: 8 }}
            />
            <FormControlLabel
              value={TypeEnum.PRIVATE}
              control={<Radio />}
              label={t('commissionBundlesPage.addEditCommissionBundle.form.privateBundle')}
            />
          </RadioGroup>
        </FormControl>
      </Paper>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 1,
          p: 3,
          minWidth: '100%',
          mb: 4,
        }}
      >
        <Typography variant="h6" mb={3}>
          {t('commissionBundlesPage.addEditCommissionBundle.form.bundleConfiguration')}
        </Typography>

        <Box>
          <Box sx={inputGroupStyle}>
            <FormSectionTitle
              title={t('commissionBundlesPage.addEditCommissionBundle.form.bundleStructure')}
              icon={<MenuBook />}
            />
            <Grid container spacing={2} mt={1}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label={t('commissionBundlesPage.addEditCommissionBundle.form.bundleName')}
                  placeholder={t('commissionBundlesPage.addEditCommissionBundle.form.bundleName')}
                  size="small"
                  value={formik.values.name}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  inputProps={{
                    'data-testid': 'name-test',
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label={t('addEditIbanPage.addForm.fields.iban.description')}
                  placeholder={t(
                    'commissionBundlesPage.addEditCommissionBundle.form.bundleDescription'
                  )}
                  size="small"
                  value={formik.values.description}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  inputProps={{
                    'data-testid': 'description-test',
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel size="small">
                    {t('commissionBundlesPage.addEditCommissionBundle.form.paymentType')}
                  </InputLabel>
                  <Select
                    id={`paymentType`}
                    labelId={`paymentTypeLabel`}
                    name={`paymentType`}
                    label={t('commissionBundlesPage.addEditCommissionBundle.form.paymentType')}
                    placeholder={t(
                      'commissionBundlesPage.addEditCommissionBundle.form.paymentType'
                    )}
                    size="small"
                    value={formik.values.paymentType ?? ''}
                    onChange={formik.handleChange}
                    error={formik.touched.paymentType && Boolean(formik.errors.paymentType)}
                    data-testid="payment-type-test"
                    disabled={
                      !(paymentOptions?.payment_types && paymentOptions.payment_types.length > 0)
                    }
                  >
                    {paymentOptions?.payment_types &&
                      sortPaymentType(paymentOptions.payment_types)?.map((option: any) => (
                        <MenuItem key={option.payment_type} value={option.payment_type}>
                          {`${option.description} - ${option.payment_type}`}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel size="small">
                    {t('commissionBundlesPage.addEditCommissionBundle.form.touchpoint')}
                  </InputLabel>
                  <Select
                    id={'touchpoint'}
                    labelId={'touchpointLabel'}
                    name={'touchpoint'}
                    label={t('commissionBundlesPage.addEditCommissionBundle.form.touchpoint')}
                    placeholder={t('commissionBundlesPage.addEditCommissionBundle.form.touchpoint')}
                    size="small"
                    value={formik.values.touchpoint ?? ''}
                    onChange={formik.handleChange}
                    error={formik.touched.touchpoint && Boolean(formik.errors.touchpoint)}
                    data-testid="touchpoint-test"
                    disabled={
                      !(touchpointList?.touchpoints && touchpointList.touchpoints.length > 0)
                    }
                  >
                    {touchpointList?.touchpoints?.map((el) => (
                      <MenuItem key={`touchpoint${el.name}`} value={el.name}>
                        {el.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {formik.values.transferCategoryList?.map((_pT, i) => (
                <React.Fragment key={`transferCategory${i}`}>
                  {i > 0 && (
                    <Grid item xs={1} mt={1}>
                      <RemoveCircleOutline
                        color="error"
                        sx={{
                          cursor: 'pointer',
                        }}
                        onClick={() => deleteTransferCategoryItem(i)}
                        id={`remove_PaymentMethod${i}`}
                        data-testid={`remove-payment-method${i}`}
                      />
                    </Grid>
                  )}
                  <Grid item xs={i > 0 ? 11 : 12} pr={2}>
                    <FormControl sx={{ width: '50%' }}>
                      <InputLabel size="small">
                        {t('commissionBundlesPage.addEditCommissionBundle.form.taxonomyOfService')}
                      </InputLabel>
                      <Select
                        id={`transferCategoryList${i}_select`}
                        labelId={`transferCategoryList${i}_label`}
                        name={`transferCategoryList${i}_name`}
                        label={t(
                          'commissionBundlesPage.addEditCommissionBundle.form.taxonomyOfService'
                        )}
                        placeholder={t(
                          'commissionBundlesPage.addEditCommissionBundle.form.taxonomyOfService'
                        )}
                        size="small"
                        value={
                          formik.values.transferCategoryList
                            ? formik.values.transferCategoryList[i]
                            : ''
                        }
                        onChange={(event) =>
                          formik.setFieldValue(
                            'transferCategoryList',
                            formik.values.transferCategoryList?.map((pType, j) =>
                              j === i ? event.target.value : pType
                            )
                          )
                        }
                        error={
                          formik.touched.transferCategoryList &&
                          Boolean(formik.errors.transferCategoryList)
                        }
                        data-testid="transfer-category-list-test"
                        disabled={!(taxonomyList?.taxonomies && taxonomyList.taxonomies.length > 0)}
                      >
                        {taxonomyList?.taxonomies?.map((el) => (
                          <MenuItem
                            key={`taxonomies${el.specific_built_in_data}`}
                            value={el.specific_built_in_data}
                          >
                            {el.service_type_code} - {el.service_type_description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={6}>
                <ButtonNaked
                  size="medium"
                  component="button"
                  onClick={() => addTransferCategoryItem()}
                  sx={{ color: 'primary.main', mr: '20px' }}
                  weight="default"
                  data-testid="add-taxonomy-test"
                >
                  {t('commissionBundlesPage.addEditCommissionBundle.form.addTaxonomy')}
                </ButtonNaked>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ pl: 1, mt: 3 }}>
              <FormSectionTitle
                title={t('commissionBundlesPage.addEditCommissionBundle.form.amountRange')}
                icon={<></>}
              />
              <Grid container spacing={2} mt={1} sx={{ pl: 1 }}>
                <Grid item xs={6}>
                  <NumericFormat
                    fullWidth
                    id="minPaymentAmount"
                    name="minPaymentAmount"
                    customInput={TextField}
                    label={t('commissionBundlesPage.addEditCommissionBundle.form.minImport')}
                    placeholder={t('commissionBundlesPage.addEditCommissionBundle.form.minImport')}
                    size="small"
                    value={
                      formik.values.minPaymentAmount === 0 ? '' : formik.values.minPaymentAmount
                    }
                    onValueChange={({ value }) => {
                      const numericValue = parseFloat(value.replace(',', '.'));
                      // eslint-disable-next-line @typescript-eslint/no-floating-promises
                      formik.setFieldValue('minPaymentAmount', numericValue);
                    }}
                    thousandSeparator=""
                    decimalSeparator=","
                    allowNegative={false}
                    decimalScale={2}
                    fixedDecimalScale={false}
                    error={
                      formik.touched.minPaymentAmount && Boolean(formik.errors.minPaymentAmount)
                    }
                    helperText={formik.touched.minPaymentAmount && formik.errors.minPaymentAmount}
                    InputProps={{
                      endAdornment: <EuroIcon sx={{ color: 'GrayText' }} />,
                    }}
                    inputProps={{ 'data-testid': 'min-import-test' }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <NumericFormat
                    fullWidth
                    id="maxPaymentAmount"
                    name="maxPaymentAmount"
                    customInput={TextField}
                    label={t('commissionBundlesPage.addEditCommissionBundle.form.maxImport')}
                    placeholder={t('commissionBundlesPage.addEditCommissionBundle.form.maxImport')}
                    size="small"
                    value={
                      formik.values.maxPaymentAmount === 0 ? '' : formik.values.maxPaymentAmount
                    }
                    onValueChange={({ value }) => {
                      const numericValue = parseFloat(value.replace(',', '.'));
                      // eslint-disable-next-line @typescript-eslint/no-floating-promises
                      formik.setFieldValue('maxPaymentAmount', numericValue);
                    }}
                    thousandSeparator=""
                    decimalSeparator=","
                    allowNegative={false}
                    decimalScale={2}
                    fixedDecimalScale={false}
                    error={
                      formik.touched.maxPaymentAmount && Boolean(formik.errors.maxPaymentAmount)
                    }
                    helperText={formik.touched.maxPaymentAmount && formik.errors.maxPaymentAmount}
                    InputProps={{
                      endAdornment: <EuroIcon sx={{ color: 'GrayText' }} />,
                    }}
                    inputProps={{ 'data-testid': 'max-import-test' }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ pl: 1, mt: 3 }}>
              <FormSectionTitle
                title={t('commissionBundlesPage.addEditCommissionBundle.form.commission')}
                icon={<></>}
              />
              <Grid container spacing={2} mt={1} sx={{ pl: 1 }}>
                <Grid item xs={6}>
                  <NumericFormat
                    fullWidth
                    id="paymentAmount"
                    name="paymentAmount"
                    customInput={TextField}
                    label={t('commissionBundlesPage.addEditCommissionBundle.form.feeApplied')}
                    placeholder={t('commissionBundlesPage.addEditCommissionBundle.form.feeApplied')}
                    size="small"
                    value={formik.values.paymentAmount === 0 ? '' : formik.values.paymentAmount}
                    onValueChange={({ value }) => {
                      const numericValue = parseFloat(value.replace(',', '.'));
                      // eslint-disable-next-line @typescript-eslint/no-floating-promises
                      formik.setFieldValue('paymentAmount', numericValue);
                    }}
                    thousandSeparator=""
                    decimalSeparator=","
                    allowNegative={false}
                    decimalScale={2}
                    fixedDecimalScale={false}
                    error={formik.touched.paymentAmount && Boolean(formik.errors.paymentAmount)}
                    helperText={formik.touched.paymentAmount && formik.errors.paymentAmount}
                    InputProps={{
                      endAdornment: <EuroIcon sx={{ color: 'GrayText' }} />,
                    }}
                    inputProps={{ 'data-testid': 'payment-amount-test' }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Box sx={inputGroupStyle}>
            <FormSectionTitle
              title={t('commissionBundlesPage.addEditCommissionBundle.form.pspdata')}
              icon={<MenuBook />}
            />
            <Grid container>
              <Grid item xs={6} sx={{ mt: 2, pr: 1 }}>
                <Autocomplete
                  id="brokerCodes"
                  disablePortal
                  options={brokerDelegationList?.map((el) => el?.institution_name ?? "")?.sort((a, b) => a.localeCompare(b))}
                  disabled={!(brokerDelegationList && brokerDelegationList.length > 0)}
                  value={formik.values.idBrokerPsp}
                  onChange={async (_event, value) => {
                    if (value === null || value === undefined) {
                      // eslint-disable-next-line @typescript-eslint/no-floating-promises
                      formik.setFieldValue('idBrokerPsp', '');
                      setChannelsId([]);
                    } else {
                      formik.handleChange('idBrokerPsp')(value);
                      await getChannelsByBrokerCode(
                        brokerDelegationList?.find((el) => el.institution_name === value)
                          ?.broker_tax_code ?? ''
                      );
                    }
                  }}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('commissionBundlesPage.addEditCommissionBundle.form.brokerCode')}
                      sx={{ fontWeight: 'medium' }}
                    />
                  )}
                  PaperComponent={({ children }) => (
                    <Paper sx={{ overflowY: 'auto', mb: 1 }}>{children}</Paper>
                  )}
                  noOptionsText={t(
                    'commissionBundlesPage.addEditCommissionBundle.form.noBrokersOption'
                  )}
                  data-testid="broker-code-test"
                />
              </Grid>
              <Grid item xs={6} sx={{ mt: 2, pr: 1 }}>
                <Autocomplete
                  disablePortal
                  id="idChannel"
                  options={
                    // eslint-disable-next-line functional/immutable-data
                    channelsId.sort((a, b) => a.localeCompare(b))
                  }
                  disabled={!(channelsId && channelsId.length > 0)}
                  onChange={(_event, value) => {
                    if (value === null) {
                      // eslint-disable-next-line @typescript-eslint/no-floating-promises
                      formik.setFieldValue('idChannel', '');
                    } else {
                      formik.handleChange('idChannel')(value);
                    }
                  }}
                  value={formik.values.idChannel}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('commissionBundlesPage.addEditCommissionBundle.form.channelCode')}
                      sx={{ fontWeight: 'medium' }}
                    />
                  )}
                  PaperComponent={({ children }) => (
                    <Paper sx={{ overflowY: 'auto', mb: 1 }}>{children}</Paper>
                  )}
                  noOptionsText={t(
                    'commissionBundlesPage.addEditCommissionBundle.form.noChannelsOption'
                  )}
                  data-testid="channels-id-test"
                />
              </Grid>
            </Grid>
          </Box>
          <Box sx={inputGroupStyle}>
            <FormSectionTitle
              title={t('commissionBundlesPage.addEditCommissionBundle.form.digitalStamp')}
              icon={<BookmarkAddIcon />}
            />
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12}>
                <FormControl>
                  <FormLabel sx={{ fontWeight: 'medium', fontSize: '16px' }}>
                    {t(
                      'commissionBundlesPage.addEditCommissionBundle.form.paymentWithDigitalStamp'
                    )}
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="digitalStamp"
                    sx={{ pl: 1 }}
                    onChange={(e) =>
                      formik.setFieldValue('digitalStamp', e.target.value === 'true')
                    }
                    row
                    data-testid="digital-stamp-test"
                    value={formik.values.digitalStamp}
                  >
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label={t('general.no')}
                      sx={{ pr: 3 }}
                    />
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      disabled={formik.values.digitalStampRestriction}
                      label={t('general.yes')}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid container item xs={12}>
                <FormControl>
                  <FormLabel sx={{ fontWeight: 'medium', fontSize: '16px' }}>
                    {t(
                      'commissionBundlesPage.addEditCommissionBundle.form.paymentOnlyDigitalStamp'
                    )}
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="digitalStampRestriction"
                    sx={{ pl: 1 }}
                    onChange={(e) =>
                      formik.setFieldValue('digitalStampRestriction', e.target.value === 'true')
                    }
                    row
                    data-testid="digital-stamp-restriction-test"
                    value={formik.values.digitalStampRestriction}
                  >
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label={t('general.no')}
                      sx={{ pr: 3 }}
                    />
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      disabled={formik.values.digitalStamp}
                      label={t('general.yes')}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Box sx={inputGroupStyle}>
            <FormSectionTitle
              title={t('commissionBundlesPage.addEditCommissionBundle.form.validityPeriod')}
              icon={<DateRangeIcon />}
            />
            <Grid container spacing={2} mt={1}>
              <Grid item xs={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    label={t('commissionBundlesPage.addEditCommissionBundle.form.from')}
                    inputFormat="dd/MM/yyyy"
                    value={formik.values.validityDateFrom}
                    onChange={(value) => formik.setFieldValue('validityDateFrom', value)}
                    renderInput={(params: TextFieldProps) => (
                      <TextField
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          placeholder: 'dd/MM/aaaa',
                          'data-testid': 'from-date-test',
                        }}
                        id="validityDateFrom"
                        name="validityDateFrom"
                        type="date"
                        size="small"
                        error={
                          formik.touched.validityDateFrom && Boolean(formik.errors.validityDateFrom)
                        }
                        helperText={
                          formik.touched.validityDateFrom && formik.errors.validityDateFrom
                        }
                      />
                    )}
                    shouldDisableDate={shouldDisableDate}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid container item xs={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    label={t('commissionBundlesPage.addEditCommissionBundle.form.to')}
                    inputFormat="dd/MM/yyyy"
                    value={formik.values.validityDateTo}
                    onChange={(value) => formik.setFieldValue('validityDateTo', value)}
                    renderInput={(params: TextFieldProps) => (
                      <TextField
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          placeholder: 'dd/MM/aaaa',
                          'data-testid': 'to-date-test',
                        }}
                        id="validityDateTo"
                        name="validityDateTo"
                        type="date"
                        size="small"
                        error={
                          formik.touched.validityDateTo && Boolean(formik.errors.validityDateTo)
                        }
                        helperText={formik.touched.validityDateTo && formik.errors.validityDateTo}
                      />
                    )}
                    shouldDisableDate={shouldDisableDate}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
      <Stack direction="row" justifyContent="space-between" mt={5}>
        <Stack display="flex" justifyContent="flex-start" mr={2}>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => history.goBack()}
            data-testid="cancel-button-test"
          >
            {t('general.back')}
          </Button>
        </Stack>
        <Stack display="flex" justifyContent="flex-end">
          <Button
            onClick={() => {
              formik.handleSubmit();
              openConfirmModal();
            }}
            disabled={!enableSubmit(formik.values)}
            color="primary"
            variant="contained"
            type="submit"
            data-testid="confirm-button-test"
          >
            {t('general.confirm')}
          </Button>
        </Stack>
      </Stack>
      <GenericModal
        title={t('commissionBundlesPage.addEditCommissionBundle.modal.title')}
        message={t(`commissionBundlesPage.addEditCommissionBundle.modal.message${formik.values.type}`)}
        openModal={showConfirmModal}
        onConfirmLabel={t('general.confirm')}
        onCloseLabel={t('general.cancel')}
        handleCloseModal={() => setShowConfirmModal(false)}
        handleConfirm={async () => {
          await submit(formik.values);
          setShowConfirmModal(false);
        }}
      />
    </>
  );
};

export default AddEditCommissionBundleForm;
