import {Grid, Typography, Stack, Breadcrumbs} from '@mui/material';
import {ButtonNaked} from '@pagopa/mui-italia';
import {TitleBox, useErrorDispatcher, useLoading} from '@pagopa/selfcare-common-frontend';
import {useTranslation} from 'react-i18next';
import {useHistory, useParams} from 'react-router-dom';
import {ArrowBack} from '@mui/icons-material';
import {useEffect, useState} from 'react';
import {handleErrors} from '@pagopa/selfcare-common-frontend/services/errorService';
import ROUTES from '../../../routes';
import {LOADING_TASK_INSTITUTION_DATA_GET} from '../../../utils/constants';
import {useAppSelector} from '../../../redux/hooks';
import {partiesSelectors} from '../../../redux/slices/partiesSlice';
import {
    initialState,
    paymentsActions,
    paymentNoticeTemplateSelectors
} from '../../../redux/slices/paymentsSlice';
import {InstitutionUploadData} from '../../../api/generated/portal/InstitutionUploadData';
import {getInstitutionData} from '../../../services/noticesService';
import {store} from '../../../redux/store';
import {extractProblemJson} from '../../../utils/client-utils';
import GenericModal from '../../../components/Form/GenericModal';
import PaymentNoticesAddEditForm from './PaymentNoticesAddEditForm';


const PaymentNoticesAddEditPage = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const goBack = () => history.push(ROUTES.PAYMENT_NOTICES);
    const addError = useErrorDispatcher();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const setLoadingOverlay = useLoading(LOADING_TASK_INSTITUTION_DATA_GET);
    const [openBackModal, setOpenBackModal] = useState(false);
    const setLoadingStatus = (status: boolean) => {
        setLoading(status);
        setLoadingOverlay(status);
    };
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
    const [institutionUploadData, setInstitutionUploadData] = useState<InstitutionUploadData | null>(useAppSelector(paymentNoticeTemplateSelectors
        .selectPaymentNoticeTemplate));

    const paymentNoticeTemplate = initialState.paymentNotice;

    useEffect(() => {
        if (institutionUploadData && institutionUploadData?.cbill !== null && (
            selectedParty?.fiscalCode !== institutionUploadData?.taxCode
        )) {
            setLoadingStatus(true);
            store.dispatch(paymentsActions
                    .setPaymentsNoticeTemplate(paymentNoticeTemplate));
            getInstitutionData(selectedParty?.fiscalCode as string)
                .then(async (r) => {
                    setInstitutionUploadData(r ? r : null);
                    store.dispatch(paymentsActions
                            .setPaymentsNoticeTemplate(r ? r : paymentNoticeTemplate));
                })
                .catch((err) => {
                    const problemJson = extractProblemJson(err);
                    if (problemJson?.status !== 404) {
                        setError(true);
                        addError({
                            id: 'GET_NOTICE_DATA',
                            blocking: false,
                            error: err,
                            techDescription: `An error occurred while retrieving notice ci data`,
                            toNotify: true,
                            displayableTitle: t('noticesPage.error.getNoticeTitle'),
                            displayableDescription: t('noticesPage.error.getNoticeDesc'),
                            component: 'Toast',
                        });
                    }

                }).finally(() => setLoadingStatus(false));
        }
    }, [selectedParty?.fiscalCode]);

    return (
        <Grid container justifyContent={'center'}>
            <Grid item p={3} xs={8}>
                <Stack direction="row">
                    <ButtonNaked
                        data-testid="go-back-breadcrumb-test"
                        size="small"
                        component="button"
                        onClick={() => setOpenBackModal(true)}
                        startIcon={<ArrowBack/>}
                        sx={{color: 'primary.main', mr: '20px'}}
                        weight="default"
                    >
                        {t('general.exit')}
                    </ButtonNaked>
                    <Breadcrumbs>
                        <Typography>{t('general.PaymentNotices')}</Typography>
                        <Typography color={'text.disabled'}>
                            {t(`addEditInstitutionsDataPage.addForm.breadcrumb`)}
                        </Typography>
                    </Breadcrumbs>
                </Stack>
                <TitleBox
                    title={t(`addEditInstitutionsDataPage.title`)}
                    subTitle={t('addEditInstitutionsDataPage.subtitle')}
                    mbTitle={2}
                    mtTitle={4}
                    mbSubTitle={3}
                    variantTitle="h4"
                    variantSubTitle="body1"
                />
                {selectedParty && (
                    <PaymentNoticesAddEditForm goBack={() => setOpenBackModal(true)}
                                               data={institutionUploadData}/>
                )}
            </Grid>

            <GenericModal
                title={t('addEditInstitutionsDataPage.modal.title')}
                message={t(
                    `addEditInstitutionsDataPage.modal.message`
                )}
                openModal={openBackModal}
                onConfirmLabel={t('general.confirm')}
                onCloseLabel={t('general.cancel')}
                handleCloseModal={() => setOpenBackModal(false)}
                handleConfirm={async () => goBack()}
            />

        </Grid>
    );
};

export default PaymentNoticesAddEditPage;
