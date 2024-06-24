<<<<<<< HEAD
import {Breadcrumbs, Divider, Box, Grid, Paper, Stack, Typography, Chip} from '@mui/material';
import {ButtonNaked} from '@pagopa/mui-italia';
import {TitleBox, useErrorDispatcher, useLoading} from '@pagopa/selfcare-common-frontend';
import {useHistory, useParams} from 'react-router';
import {Trans, useTranslation} from 'react-i18next';
=======
import {Box, Breadcrumbs, Grid, Paper, Stack, Typography} from '@mui/material';
import {ButtonNaked} from '@pagopa/mui-italia';
import {TitleBox, useErrorDispatcher, useLoading} from '@pagopa/selfcare-common-frontend';
import {useHistory, useParams} from 'react-router';
import {useTranslation} from 'react-i18next';
>>>>>>> 3f32cfc3 (Formatting (#542))
import {ArrowBack} from '@mui/icons-material';
import {handleErrors} from '@pagopa/selfcare-common-frontend/services/errorService';
import {useEffect, useState} from 'react';
import ROUTES from '../../../routes';
import {getOperationTableDetails} from '../../../services/operationTable';
import {LOADING_TASK_OPERATION_TABLE_LIST} from '../../../utils/constants';
import {TavoloOpResource} from '../../../api/generated/portal/TavoloOpResource';

const OperationTableDetailPage = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const addError = useErrorDispatcher();
    const setLoading = useLoading(LOADING_TASK_OPERATION_TABLE_LIST);

    const goBack = () => history.push(ROUTES.OPERATION_TABLE_LIST);
    const {operationTableId} = useParams<{ operationTableId: string }>();
    const [operationTable, setOperationTable] = useState<TavoloOpResource>();

    useEffect(() => {
        setLoading(true);
        getOperationTableDetails(operationTableId)
            .then((response) => {
                setOperationTable(response);
            })
            .catch((reason) => {
                handleErrors([
                    {
                        id: `FETCH_OPERATIONTABLE_DETAIL_ERROR`,
                        blocking: false,
                        error: reason,
                        techDescription: `An error occurred while fetching Operation Table detail`,
                        toNotify: false,
                    },
                ]);
                addError({
                    id: 'FETCH_OPERATIONTABLE_DETAIL_ERROR',
                    blocking: false,
                    error: reason,
                    techDescription: `An error occurred while retrieving Operation Table detail`,
                    toNotify: true,
                    displayableTitle: t('operationTableDetailPage.error.getOperationTableTitle'),
                    displayableDescription: t('operationTableDetailPage.error.getOperationTableDesc'),
                    component: 'Toast',
                });
                setOperationTable(undefined);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <Grid container justifyContent={'center'}>
            <Grid item p={3} xs={8}>
                <Stack direction="row">
                    <ButtonNaked
                        size="small"
                        component="button"
                        onClick={goBack}
                        startIcon={<ArrowBack/>}
                        sx={{color: 'primary.main', mr: '20px'}}
                        weight="default"
                    >
                        {t('general.exit')}
                    </ButtonNaked>
                    <Breadcrumbs>
                        <Typography>{t('operationTableDetailPage.title')}</Typography>
                        <Typography color={'text.disaled'}>{operationTableId}</Typography>
                    </Breadcrumbs>
                </Stack>
                <Grid container mt={3}>
                    <Grid item xs={6}>
                        <TitleBox
                            title={t('operationTableDetailPage.title')}
                            subTitle={t('operationTableDetailPage.subtitle', {target: operationTableId})}
                            mbTitle={2}
                            variantTitle="h4"
                            variantSubTitle="body1"
                        />
                    </Grid>
                </Grid>

                <Paper
                    elevation={8}
                    sx={{
                        borderRadius: 4,
                        p: 4,
                        mb: 3,
                        mt: 3,
                    }}
                >
                    <Box mt={2}>
                        <Grid container item alignContent="center" spacing={2} pb={4}>
                            <Grid item xs={12}>
                                <Typography variant="sidenav">{t('operationTableDetailPage.registry')}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body2">{t('operationTableDetailPage.name')} </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                    {operationTable?.name ?? '-'}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body2">{t('operationTableDetailPage.taxCode')}</Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                    {operationTable?.taxCode ?? '-'}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body2">{t('operationTableDetailPage.mail')} </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                    {operationTable?.email ?? '-'}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body2">{t('operationTableDetailPage.phone')} </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                    {operationTable?.telephone ?? '-'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="sidenav">{t('operationTableDetailPage.edit')}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body2">{t('operationTableDetailPage.createData')} </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                    {operationTable?.createdAt
                                        ? operationTable?.createdAt.toLocaleDateString('en-GB')
                                        : '-'}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body2">{t('operationTableDetailPage.editData')} </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                    {operationTable?.modifiedAt
                                        ? operationTable?.modifiedAt?.toLocaleDateString('en-GB')
                                        : '-'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default OperationTableDetailPage;
