/* eslint-disable functional/no-let */
/* eslint-disable complexity */
/* eslint-disable sonarjs/cognitive-complexity */
import { MenuBook } from '@mui/icons-material';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import DateRangeIcon from '@mui/icons-material/DateRange';
import EuroIcon from '@mui/icons-material/Euro';
import {
    Autocomplete,
    Box,
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
    TextField,
    TextFieldProps,
    Typography,
} from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { theme } from '@pagopa/mui-italia';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { FormikProps } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumericFormat } from 'react-number-format';
import { BundleRequest } from '../../../../api/generated/portal/BundleRequest';
import { Delegation } from '../../../../api/generated/portal/Delegation';
import { TypeEnum } from '../../../../api/generated/portal/PSPBundleResource';
import { PaymentTypes } from '../../../../api/generated/portal/PaymentTypes';
import { Touchpoints } from '../../../../api/generated/portal/Touchpoints';
import FormSectionTitle from '../../../../components/Form/FormSectionTitle';
import { useFlagValue } from '../../../../hooks/useFeatureFlags';
import { useOrganizationType } from "../../../../hooks/useOrganizationType";
import { useUserRole } from "../../../../hooks/useUserRole";
import { Party } from '../../../../model/Party';
import { sortPaymentType } from '../../../../model/PaymentType';
import { ConfigurationStatus } from '../../../../model/Station';
import { useAppSelector } from '../../../../redux/hooks';
import { partiesSelectors } from '../../../../redux/slices/partiesSlice';
import { getTouchpoints } from '../../../../services/bundleService';
import { getChannels } from '../../../../services/channelService';
import { getPaymentTypes } from '../../../../services/configurationService';
import { getBrokerDelegation } from '../../../../services/institutionService';
import { addCurrentBroker } from '../../../../utils/channel-utils';
import { LOADING_TASK_COMMISSION_BUNDLE_SELECT_DATAS, LOADING_TASK_GET_CHANNELS_IDS, } from '../../../../utils/constants';

type Props = {
    formik: FormikProps<BundleRequest>;
    isEdit: boolean;
    idBrokerPsp: string | undefined;
};

const AddEditCommissionBundleForm = ({isEdit, formik, idBrokerPsp}: Props) => {
    const {t} = useTranslation();
    const {userIsPspDirectAdmin} = useUserRole();
    const {orgInfo, orgIsPspDirect} = useOrganizationType();
    const setLoading = useLoading(LOADING_TASK_COMMISSION_BUNDLE_SELECT_DATAS);
    const setLoadingChannels = useLoading(LOADING_TASK_GET_CHANNELS_IDS);
    const addError = useErrorDispatcher();
    const isPrivateEnabled = useFlagValue("commission-bundles-private");
    const isPublicEnabled = useFlagValue("commission-bundles-public");
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

    const [paymentOptions, setPaymentOptions] = useState<PaymentTypes>();
    const [touchpointList, setTouchpointList] = useState<Touchpoints>();
    const [brokerDelegationList, setBrokerDelegationList] = useState<Array<Delegation>>([]);
    const [channelsId, setChannelsId] = useState<Array<string>>([]);

    const inputGroupStyle = {
        borderRadius: 1,
        border: 1,
        borderColor: theme.palette.divider,
        p: 3,
        mb: 3,
    };

    const getChannelsByBrokerCode = (selectedBrokerCode: string) => {
        setLoadingChannels(true);
        getChannelsIdAssociatedToPSP(0, selectedBrokerCode)
            .then((data) => {
                if (data && data.length > 0) {
                    setChannelsId(data);
                } else {
                    setChannelsId([]);
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
            .catch((error) => {
                setChannelsId([]);
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
        setLoading(true);
        Promise.all([
            getPaymentTypes(),
            getTouchpoints(0, 50),
            getBrokerDelegation(selectedParty?.partyId ?? '', undefined),
        ])
            .then(([paymentTypes, touchpoints, brokerDelegation]) => {
                if (paymentTypes) {
                    setPaymentOptions(paymentTypes);
                }
                if (touchpoints) {
                    setTouchpointList(touchpoints);
                }
                let listBroker = brokerDelegation?.delegation_list ? [...brokerDelegation.delegation_list] : [];
                if (orgIsPspDirect) {
                    listBroker = addCurrentBroker(listBroker, selectedParty as Party);
                }
                if (listBroker.length > 0) {
                    setBrokerDelegationList(listBroker);
                    if (isEdit && idBrokerPsp) {
                        const brokerTaxCode = listBroker?.find(
                            (el) => el.broker_id === idBrokerPsp
                        )?.broker_tax_code;
                        if (brokerTaxCode) {
                            getChannelsByBrokerCode(brokerTaxCode);
                        }
                    }
                } else {
                    addError({
                        id: 'GET_BROKER_DATA',
                        blocking: false,
                        error: new Error(`An error occurred while getting data`),
                        techDescription: `An error occurred while getting data`,
                        toNotify: true,
                        displayableTitle: t('general.errorTitle'),
                        displayableDescription: t(
                            'commissionBundlesPage.addEditCommissionBundle.error.errorMessageNoBroker'
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

    const shouldDisableDate = (date: Date) => date < new Date();

    function handleBrokerCodesSelection(
        value: string | null | undefined
    ) {
        formik.setFieldValue('idChannel', '');
        if (value === null || value === undefined) {
            formik.setFieldValue('idBrokerPsp', '');
            setChannelsId([]);
        } else {
            const broker = brokerDelegationList?.find(
                (el) => el.broker_name === value
            );
            formik.handleChange('idBrokerPsp')(broker?.broker_tax_code ?? "");
            if (broker?.broker_tax_code) {
                getChannelsByBrokerCode(broker?.broker_tax_code);
            }
        }
    }

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
                            control={<Radio/>}
                            label={t('commissionBundlesPage.globalBundles')}
                            sx={{pr: 8}}
                            disabled={isEdit}
                        />
                        <FormControlLabel
                            value={TypeEnum.PUBLIC}
                            control={<Radio/>}
                            label={t('commissionBundlesPage.publicBundles')}
                            sx={{pr: 8}}
                            disabled={isEdit || !isPublicEnabled}
                        />
                        <FormControlLabel
                            value={TypeEnum.PRIVATE}
                            control={<Radio/>}
                            label={t('commissionBundlesPage.privateBundles')}
                            disabled={isEdit || !isPrivateEnabled}
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
                            icon={<MenuBook/>}
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
                                    <InputLabel size="small" id="paymentTypeLabel">
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
                                        <MenuItem key={`payment_types$all`} value={'ANY'}>
                                            {t('commissionBundlesPage.addEditCommissionBundle.form.all')}
                                        </MenuItem>
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
                                    <InputLabel size="small" id="touchpointLabel">
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
                                        <MenuItem key={`touchpoint$all`} value={'ANY'}>
                                            {t('commissionBundlesPage.addEditCommissionBundle.form.all')}
                                        </MenuItem>
                                        {touchpointList?.touchpoints?.map((el) => (
                                            <MenuItem key={`touchpoint${el.name}`} value={el.name}>
                                                {el.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{pl: 1, mt: 3}}>
                            <FormSectionTitle
                                title={t('commissionBundlesPage.addEditCommissionBundle.form.amountRange')}
                                icon={<></>}
                            />
                            <Grid container spacing={2} mt={1} pl={1}>
                                <Grid item xs={6}>
                                    <NumericFormat
                                        fullWidth
                                        id="minPaymentAmount"
                                        name="minPaymentAmount"
                                        customInput={TextField}
                                        label={t('commissionBundlesPage.addEditCommissionBundle.form.minImport')}
                                        placeholder={t('commissionBundlesPage.addEditCommissionBundle.form.minImport')}
                                        size="small"
                                        value={(formik.values.minPaymentAmount ?? 0) / 100}
                                        onValueChange={({value}) => {
                                            const numericValue = parseFloat(value.replace(',', '.'));
                                            formik.setFieldValue('minPaymentAmount', numericValue * 100);
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
                                            endAdornment: <EuroIcon sx={{color: 'GrayText'}}/>,
                                        }}
                                        inputProps={{'data-testid': 'min-import-test'}}
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
                                        value={(formik.values.maxPaymentAmount ?? 0) / 100}
                                        onValueChange={({value}) => {
                                            const numericValue = parseFloat(value.replace(',', '.'));
                                            formik.setFieldValue('maxPaymentAmount', numericValue * 100);
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
                                            endAdornment: <EuroIcon sx={{color: 'GrayText'}}/>,
                                        }}
                                        inputProps={{'data-testid': 'max-import-test'}}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{pl: 1, mt: 3}}>
                            <FormSectionTitle
                                title={t('commissionBundlesPage.addEditCommissionBundle.form.commission')}
                                icon={<></>}
                            />
                            <Grid container spacing={2} mt={1} sx={{pl: 1}}>
                                <Grid item xs={6}>
                                    <NumericFormat
                                        fullWidth
                                        id="paymentAmount"
                                        name="paymentAmount"
                                        customInput={TextField}
                                        label={t('commissionBundlesPage.addEditCommissionBundle.form.feeApplied')}
                                        placeholder={t('commissionBundlesPage.addEditCommissionBundle.form.feeApplied')}
                                        size="small"
                                        value={(formik.values.paymentAmount ?? 0) / 100}
                                        onValueChange={({value}) => {
                                            const numericValue = parseFloat(value.replace(',', '.'));
                                            formik.setFieldValue('paymentAmount', numericValue * 100);
                                        }}
                                        thousandSeparator=""
                                        decimalSeparator=","
                                        allowNegative={false}
                                        decimalScale={2}
                                        fixedDecimalScale={false}
                                        error={formik.touched.paymentAmount && Boolean(formik.errors.paymentAmount)}
                                        helperText={formik.touched.paymentAmount && formik.errors.paymentAmount}
                                        InputProps={{
                                            endAdornment: <EuroIcon sx={{color: 'GrayText'}}/>,
                                        }}
                                        inputProps={{'data-testid': 'payment-amount-test'}}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={inputGroupStyle}>
                        <FormSectionTitle
                            title={t('commissionBundlesPage.addEditCommissionBundle.form.pspdata')}
                            icon={<MenuBook/>}
                        />
                        <Grid container>
                            <Grid item xs={6} sx={{mt: 2, pr: 1}}>
                                <Autocomplete
                                    id="brokerCodes"
                                    disablePortal
                                    options={brokerDelegationList
                                        ?.map((el) => el?.broker_name ?? '')
                                        ?.sort((a, b) => a.localeCompare(b))}
                                    disabled={!(brokerDelegationList && brokerDelegationList.length > 0)}
                                    value={brokerDelegationList?.find(el => el.broker_tax_code === formik.values.idBrokerPsp)?.broker_name ?? ""}
                                    onChange={(_, value) => {
                                        handleBrokerCodesSelection(value);
                                    }}
                                    fullWidth
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={t('commissionBundlesPage.addEditCommissionBundle.form.brokerCode')}
                                            sx={{fontWeight: 'medium'}}
                                        />
                                    )}
                                    PaperComponent={({children}) => (
                                        <Paper sx={{overflowY: 'auto', mb: 1}}>{children}</Paper>
                                    )}
                                    noOptionsText={t(
                                        'commissionBundlesPage.addEditCommissionBundle.form.noBrokersOption'
                                    )}
                                    data-testid="broker-code-test"
                                />
                            </Grid>
                            <Grid item xs={6} sx={{mt: 2, pr: 1}}>
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
                                            sx={{fontWeight: 'medium'}}
                                        />
                                    )}
                                    PaperComponent={({children}) => (
                                        <Paper sx={{overflowY: 'auto', mb: 1}}>{children}</Paper>
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
                            icon={<BookmarkAddIcon/>}
                        />
                        <Grid container spacing={2} mt={1}>
                            <Grid item xs={12}>
                                <FormControl>
                                    <FormLabel sx={{fontWeight: 'medium', fontSize: '16px'}}>
                                        {t(
                                            'commissionBundlesPage.addEditCommissionBundle.form.paymentWithDigitalStamp'
                                        )}
                                    </FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="digitalStamp"
                                        sx={{pl: 1}}
                                        onChange={(e) =>
                                            formik.setFieldValue('digitalStamp', e.target.value === 'true')
                                        }
                                        row
                                        data-testid="digital-stamp-test"
                                        value={formik.values.digitalStamp ? `${formik.values.digitalStamp}` : 'false'}
                                    >
                                        <FormControlLabel
                                            value={'false'}
                                            control={<Radio/>}
                                            label={t('general.no')}
                                            sx={{pr: 3}}
                                        />
                                        <FormControlLabel
                                            value={'true'}
                                            control={<Radio/>}
                                            disabled={formik.values.digitalStampRestriction}
                                            label={t('general.yes')}
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid container item xs={12}>
                                <FormControl>
                                    <FormLabel sx={{fontWeight: 'medium', fontSize: '16px'}}>
                                        {t(
                                            'commissionBundlesPage.addEditCommissionBundle.form.paymentOnlyDigitalStamp'
                                        )}
                                    </FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="digitalStampRestriction"
                                        sx={{pl: 1}}
                                        onChange={(e) =>
                                            formik.setFieldValue('digitalStampRestriction', e.target.value === 'true')
                                        }
                                        row
                                        data-testid="digital-stamp-restriction-test"
                                        value={
                                            formik.values.digitalStampRestriction
                                                ? `${formik.values.digitalStampRestriction}`
                                                : 'false'
                                        }
                                    >
                                        <FormControlLabel
                                            value={'false'}
                                            control={<Radio/>}
                                            label={t('general.no')}
                                            sx={{pr: 3}}
                                        />
                                        <FormControlLabel
                                            value={'true'}
                                            control={<Radio/>}
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
                            icon={<DateRangeIcon/>}
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
                                        disabled={isEdit}
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
        </>
    );
};

export default AddEditCommissionBundleForm;
