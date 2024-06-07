/* eslint-disable sonarjs/cognitive-complexity */
import {ArrowBack} from '@mui/icons-material';
import {useFormik} from 'formik';
import {add} from 'date-fns';
import {
    Box,
    Breadcrumbs,
    Button,
    Grid,
    Stack,
    Step,
    StepLabel,
    Stepper,
    Typography,
} from '@mui/material';
import {ButtonNaked} from '@pagopa/mui-italia';
import {TFunction, useTranslation} from 'react-i18next';
import {TitleBox, useErrorDispatcher, useLoading} from '@pagopa/selfcare-common-frontend';
import {useHistory, useParams} from 'react-router-dom';
import {useState} from 'react';
import GenericModal from '../../../components/Form/GenericModal';
import {Party} from '../../../model/Party';
import ROUTES from '../../../routes';
import {useAppSelector, useAppSelectorWithRedirect} from '../../../redux/hooks';
import {partiesSelectors} from '../../../redux/slices/partiesSlice';
import {FormAction} from '../../../model/CommissionBundle';
import {bundleDetailsSelectors} from '../../../redux/slices/bundleDetailsSlice';
import {createBundle, updatePSPBundle} from '../../../services/bundleService';
import {isValidArray, removeDateZoneInfo} from '../../../utils/common-utils';
import {extractProblemJson} from '../../../utils/client-utils';
import {LOADING_TASK_CREATING_COMMISSION_BUNDLE} from '../../../utils/constants';
import {BundleRequest} from '../../../api/generated/portal/BundleRequest';
import {PSPBundleResource} from '../../../api/generated/portal/PSPBundleResource';
import AddEditCommissionBundleForm from './components/AddEditCommissionBundleForm';
import AddEditCommissionBundleTaxonomies from './components/AddEditCommissionBundleTaxonomies';

const componentPath = 'commissionBundlesPage.addEditCommissionBundle';

const minDateTomorrow = () => {
    const dateToday = new Date();
    dateToday.setHours(0, 0, 0, 0);
    return add(dateToday, {days: 1});
};

const toNewFormData = (
    selectedParty: Party | undefined,
    data?: PSPBundleResource
): BundleRequest => ({
    abi: selectedParty?.pspData?.abi_code ?? '',
    description: data?.description ?? '',
    digitalStamp: data?.digitalStamp ?? false,
    digitalStampRestriction: data?.digitalStampRestriction ?? false,
    idBrokerPsp: data?.idBrokerPsp ?? '',
    idChannel: data?.idChannel ?? '',
    maxPaymentAmount: data?.maxPaymentAmount ?? 0,
    minPaymentAmount: data?.minPaymentAmount ?? 0,
    name: data?.name ?? '',
    paymentAmount: data?.paymentAmount ?? 0,
    paymentType: data?.paymentType ?? 'ANY',
    touchpoint: data?.touchpoint ?? 'ANY',
    transferCategoryList: data?.bundleTaxonomies
        ? data.bundleTaxonomies.map((item) => item?.specificBuiltInData ?? '')
        : [],
    type: data?.type ?? undefined,
    validityDateFrom: data?.validityDateFrom ?? minDateTomorrow(),
    validityDateTo: data?.validityDateTo ?? minDateTomorrow(),
    pspBusinessName: selectedParty?.description ?? '',
});

// eslint-disable-next-line complexity
const validate = (
    values: Partial<BundleRequest>,
    edit: boolean | undefined,
    t: TFunction<'translation'>
) =>
    Object.fromEntries(
        Object.entries({
            ...{
                description: !values.description
                    ? t(`${componentPath}.validationMessage.requiredField`)
                    : undefined,
                idChannel: !values.idChannel
                    ? t(`${componentPath}.validationMessage.requiredField`)
                    : undefined,
                maxPaymentAmount: !values.maxPaymentAmount
                    ? t(`${componentPath}.validationMessage.requiredField`)
                    : values.minPaymentAmount && values.minPaymentAmount > values.maxPaymentAmount
                        ? t(`${componentPath}.validationMessage.lessThanMinPayment`)
                        : undefined,
                minPaymentAmount:
                    !values.minPaymentAmount && values.minPaymentAmount !== 0
                        ? t(`${componentPath}.validationMessage.requiredField`)
                        : values.maxPaymentAmount && values.maxPaymentAmount < values.minPaymentAmount
                            ? t(`${componentPath}.validationMessage.moreThanMaxPayment`)
                            : undefined,
                name: !values.name ? t(`${componentPath}.validationMessage.requiredField`) : undefined,
                paymentAmount:
                    !values.paymentAmount && values.paymentAmount !== 0
                        ? t(`${componentPath}.validationMessage.requiredField`)
                        : undefined,
                type: !values.type ? t(`${componentPath}.validationMessage.requiredField`) : undefined,
                validityDateFrom: !values.validityDateFrom
                    ? t(`${componentPath}.validationMessage.requiredField`)
                    : (edit === undefined || !edit) &&
                    values.validityDateFrom.getTime() < minDateTomorrow().getTime()
                        ? t(`${componentPath}.validationMessage.dateNotValid`)
                        : values.validityDateTo &&
                        values.validityDateFrom.getTime() > values.validityDateTo.getTime()
                            ? t(`${componentPath}.validationMessage.startDateOverEndDate`)
                            : undefined,
                validityDateTo: !values.validityDateTo
                    ? t(`${componentPath}.validationMessage.requiredField`)
                    : values.validityDateTo.getTime() <= new Date().getTime()
                        ? t(`${componentPath}.validationMessage.dateNotValid`)
                        : values.validityDateFrom &&
                        values.validityDateTo.getTime() < values.validityDateFrom.getTime()
                            ? t(`${componentPath}.validationMessage.endDateUnderStartDate`)
                            : undefined,
            },
        }).filter(([_key, value]) => value)
    );

const enableSubmit = (values: BundleRequest) =>
    values.type !== undefined &&
    values.name !== '' &&
    (values.minPaymentAmount ?? 0) >= 0 &&
    !Number.isNaN(values.minPaymentAmount) &&
    values.maxPaymentAmount !== 0 &&
    !Number.isNaN(values.maxPaymentAmount) &&
    (values.paymentAmount ?? 0) >= 0 &&
    !Number.isNaN(values.paymentAmount) &&
    values.idChannel !== '' &&
    values.idChannel !== undefined &&
    values.description !== '' &&
    values.validityDateFrom != null &&
    values.validityDateFrom.getTime() > 0 &&
    values.validityDateTo != null &&
    values.validityDateTo.getTime() > 0;

const AddEditCommissionBundlePage = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const addError = useErrorDispatcher();
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
    const setLoadingCreating = useLoading(LOADING_TASK_CREATING_COMMISSION_BUNDLE);
    const {actionId} = useParams<{ actionId: string }>();
    const [activeStep, setActiveStep] = useState<number>(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const isEdit: boolean = actionId === FormAction.Edit;
    const textType = isEdit ? 'Edit' : 'Create';
    const bundleDetails: PSPBundleResource =
        useAppSelectorWithRedirect(
            bundleDetailsSelectors.selectBundleDetails,
            isEdit ? ROUTES.COMMISSION_BUNDLES : undefined
        ) ?? {};
    const bundleId: string = bundleDetails?.idBundle ?? '';

    const formik = useFormik<Partial<BundleRequest>>({
        initialValues: toNewFormData(selectedParty, isEdit ? bundleDetails : undefined),
        validate: (values) => validate(values, isEdit, t),
        onSubmit: async () => {
            setShowConfirmModal(true);
        },
        enableReinitialize: true,
        validateOnBlur: true,
        validateOnChange: true,
    });

    const submit = async (body: BundleRequest) => {
        setLoadingCreating(true);
        const pspTaxCode = selectedParty?.fiscalCode ?? '';
        const formattedBundleBody: BundleRequest = {
            ...body,
            validityDateFrom: removeDateZoneInfo(body.validityDateFrom),
            validityDateTo: removeDateZoneInfo(body.validityDateTo),
            touchpoint: body.touchpoint !== 'ANY' ? body.touchpoint : undefined,
            paymentType: body.paymentType !== 'ANY' ? body.paymentType : undefined,
            transferCategoryList: isValidArray(body.transferCategoryList)
                ? body.transferCategoryList
                : undefined,
        };
        const promise = isEdit
            ? updatePSPBundle(pspTaxCode, bundleId, formattedBundleBody)
            : createBundle(pspTaxCode, formattedBundleBody);

        promise
            .then((_) => {
                history.push(ROUTES.COMMISSION_BUNDLES);
            })
            .catch((reason: Error) => {
                addError({
                    id: `${isEdit ? 'UPDATE' : 'CREATE'}_COMMISSION_BUNDLE`,
                    blocking: false,
                    error: reason,
                    techDescription: `An error occurred while ${isEdit ? 'updating' : 'creating'} the commission bundle`,
                    toNotify: true,
                    displayableTitle: t('general.errorTitle'),
                    displayableDescription: t(
                        `${componentPath}.error.errorMessage${extractProblemJson(reason)?.status === 400 ? 'Duplicated' : textType}Bundle`
                    ),
                    component: 'Toast',
                });
            })
            .finally(() => {
                setLoadingCreating(false);
            });
    };

    const openConfirmModal = () => {
        if (formik.isValid) {
            setShowConfirmModal(true);
        } else {
            setActiveStep(0);
        }
    };

    return (
        <Grid container justifyContent={'center'}>
            <Grid item p={3} xs={8}>
                <Stack direction="row">
                    <ButtonNaked
                        size="small"
                        component="button"
                        onClick={() => history.push(ROUTES.COMMISSION_BUNDLES)}
                        startIcon={<ArrowBack data-testid="arrow-back-test"/>}
                        sx={{color: 'primary.main', mr: '20px'}}
                        weight="default"
                    >
                        {t('general.exit')}
                    </ButtonNaked>
                    <Breadcrumbs>
                        <Typography variant="body2">{t(`${componentPath}.breadcrumb.first`)}</Typography>
                        <Typography variant="body2" fontWeight={'medium'}>
                            {t(`${componentPath}.breadcrumb.second${textType}`)}
                        </Typography>
                    </Breadcrumbs>
                </Stack>
                <TitleBox
                    title={t(`${componentPath}.title${textType}`)}
                    subTitle={t(`${componentPath}.subtitle`)}
                    mbTitle={2}
                    mtTitle={4}
                    mbSubTitle={3}
                    variantTitle="h4"
                    variantSubTitle="body1"
                />
                <Box my={3} display="flex" justifyContent="center">
                    <div style={{width: '40%'}}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            <Step key={'step-config'} completed={activeStep === 1} data-testid="step-config">
                                <StepLabel>{t(`${componentPath}.form.bundleConfiguration`)}</StepLabel>
                            </Step>
                            <Step key={'step-taxonomies'} data-testid="step-taxonomies">
                                <StepLabel>
                                    {t('commissionBundlesPage.commissionBundleDetail.taxonomies')}
                                </StepLabel>
                            </Step>
                        </Stepper>
                    </div>
                </Box>
                <div
                    style={{display: activeStep !== 0 ? 'none' : undefined}}
                    data-testid="bundle-form-div"
                >
                    <AddEditCommissionBundleForm
                        formik={formik}
                        isEdit={isEdit}
                        idBrokerPsp={isEdit ? bundleDetails?.idBrokerPsp : undefined}
                    />
                </div>
                <div
                    style={{display: activeStep !== 1 ? 'none' : undefined}}
                    data-testid="bundle-taxonomies-div"
                >
                    <AddEditCommissionBundleTaxonomies
                        formik={formik}
                        bundleTaxonomies={
                            isEdit && bundleDetails?.bundleTaxonomies && bundleDetails.bundleTaxonomies.length > 0
                                ? [...bundleDetails.bundleTaxonomies]
                                : []
                        }
                    />
                </div>
                <Stack direction="row" justifyContent="space-between" mt={5}>
                    <Stack display="flex" justifyContent="flex-start" mr={2}>
                        <Button
                            color="primary"
                            variant="outlined"
                            onClick={() =>
                                activeStep === 0 ? history.goBack() : setActiveStep((prev) => prev - 1)
                            }
                            data-testid="back-step-button-test"
                        >
                            {t('general.back')}
                        </Button>
                    </Stack>
                    <Stack display="flex" justifyContent="flex-end">
                        <Button
                            onClick={() => {
                                if (activeStep === 0) {
                                    setActiveStep((prev) => prev + 1);
                                } else {
                                    formik.handleSubmit();
                                    openConfirmModal();
                                }
                            }}
                            disabled={!enableSubmit(formik.values)}
                            color="primary"
                            variant="contained"
                            type="submit"
                            data-testid="open-modal-button-test"
                        >
                            {t('general.confirm')}
                        </Button>
                    </Stack>
                </Stack>
                <GenericModal
                    title={t(`${componentPath}.modal.title${textType}`)}
                    message={t(`${componentPath}.modal.message${isEdit ? 'Edit' : formik.values.type}`)}
                    openModal={showConfirmModal}
                    onConfirmLabel={t('general.confirm')}
                    onCloseLabel={t('general.cancel')}
                    handleCloseModal={() => setShowConfirmModal(false)}
                    handleConfirm={async () => {
                        await submit(formik.values);
                        setShowConfirmModal(false);
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default AddEditCommissionBundlePage;
