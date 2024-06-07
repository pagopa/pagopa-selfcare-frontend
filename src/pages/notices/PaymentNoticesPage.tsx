import {Alert, Box, Button, Grid, Link, Stack, Typography} from '@mui/material';
import {TitleBox, useErrorDispatcher, useLoading} from '@pagopa/selfcare-common-frontend';
import {Trans, useTranslation} from 'react-i18next';
import {generatePath, useHistory, Link as RouterLink} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {theme} from '@pagopa/mui-italia';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CreateIcon from '@mui/icons-material/Create';
import {extractProblemJson} from '../../utils/client-utils';
import {LOADING_TASK_INSTITUTION_DATA_GET} from '../../utils/constants';
import ROUTES from '../../routes';
import SideMenuLayout from '../../components/SideMenu/SideMenuLayout';
import {useAppSelector} from '../../redux/hooks';
import {partiesSelectors} from '../../redux/slices/partiesSlice';
import {getInstitutionData} from '../../services/noticesService';
import {InstitutionUploadData} from '../../api/generated/portal/InstitutionUploadData';
import {institutionsDataDetailsActions} from '../../redux/slices/institutionsDataDetailsSlice';
import {store} from '../../redux/store';
import PaymentNoticesDetailPage from './detail/PaymentNoticesDetailPage';


const PaymentNoticesPage = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const setLoadingOverlay = useLoading(LOADING_TASK_INSTITUTION_DATA_GET);
    const setLoadingStatus = (status: boolean) => {
        setLoading(status);
        setLoadingOverlay(status);
    };
    const addError = useErrorDispatcher();
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
    const [institutionUploadData, setInstitutionUploadData] = useState<InstitutionUploadData | null>(null);

    const addEditData = () => {
        history.push(ROUTES.PAYMENT_NOTICES_ADDEDIT);
    };

    useEffect(() => {
        if (selectedParty && selectedParty.fiscalCode &&
            (institutionUploadData === undefined || institutionUploadData === null ||
                institutionUploadData?.taxCode !== selectedParty.fiscalCode)) {
            setLoadingStatus(true);
            getInstitutionData(selectedParty.fiscalCode)
                .then(async (r) => {
                    setInstitutionUploadData(r ? r : null);
                    if (r !== undefined) {
                        store.dispatch(institutionsDataDetailsActions
                            .setInstitutionDataDetailsState(r));
                    }
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
        <SideMenuLayout>
            <Stack direction="row" justifyContent="space-between">
                <Stack display="flex" justifyContent="flex-start" mr={2}>
                    <TitleBox
                        title={t('noticesPage.title')}
                        subTitle={t(institutionUploadData === null ?
                            'noticesPage.subtitle' :
                            'noticesPage.detailSubtitle'
                        )}
                        mbSubTitle={3}
                        variantTitle="h4"
                        variantSubTitle="body1"
                    />
                </Stack>
                <Stack display="flex" justifyContent="flex-end" mb={5}>
                    <Button
                        variant="contained"
                        onClick={addEditData}
                        endIcon={institutionUploadData === null ?
                            <ArrowForwardIcon/> : <CreateIcon/>}
                        color="primary"
                        sx={{
                            border: `2px solid ${theme.palette.primary.main}`,
                            borderRadius: theme.spacing(0.5),
                            px: 2,
                            py: 1.5,
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        {t(institutionUploadData === null ?
                            'noticesPage.addData' :
                            'noticesPage.editData'
                        )}
                    </Button>
                </Stack>
            </Stack>
            {institutionUploadData === null ? (
                <Alert severity="warning" variant="outlined" data-testid="alert-test">
                    {t('noticesPage.toAddWarning')}
                </Alert>
            ) : (<></>)}

            {institutionUploadData === null ?
                (
                    <Box
                        id="StationsSearchTableBox"
                        sx={{
                            position: 'relative',
                            width: '100% !important',
                            border: 'none',
                        }}
                        justifyContent="start"
                    >
                        <Box p={3} mt={3} sx={{backgroundColor: '#EEEEEE'}}>
                            <Box p={2} sx={{textAlign: 'center', backgroundColor: '#FFFFFF'}}>
                                <Typography variant="body2">
                                    <Trans i18nKey="paymentNoticesPage.notConfigured">
                                        Il modello non è stato ancora configurato
                                        <Link
                                            component={RouterLink}
                                            sx={{
                                                color: 'primary.main',
                                                cursor: 'pointer',
                                                textDecoration: 'none',
                                                whiteSpace: 'pre',
                                            }}
                                            to={generatePath(ROUTES.PAYMENT_NOTICES_ADDEDIT)}
                                        >
                                            <strong> Configura Modello </strong>
                                        </Link>
                                    </Trans>
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                )
                :
                (<PaymentNoticesDetailPage data={institutionUploadData}/>)
            }
        </SideMenuLayout>
    );
};

export default PaymentNoticesPage;
