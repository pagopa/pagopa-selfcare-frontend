<<<<<<< HEAD
import {Breadcrumbs, Divider, Box, Grid, Paper, Stack, Typography, Chip} from '@mui/material';
import {ButtonNaked} from '@pagopa/mui-italia';
import {TitleBox, useErrorDispatcher} from '@pagopa/selfcare-common-frontend';
import {useHistory} from 'react-router';
import {Trans, useTranslation} from 'react-i18next';
=======
import {Breadcrumbs, Grid, Paper, Stack, Typography} from '@mui/material';
import {ButtonNaked} from '@pagopa/mui-italia';
import {TitleBox, useErrorDispatcher} from '@pagopa/selfcare-common-frontend';
import {useHistory} from 'react-router';
import {useTranslation} from 'react-i18next';
>>>>>>> 3f32cfc3 (Formatting (#542))
import {ArrowBack} from '@mui/icons-material';
import {useEffect, useState} from 'react';
import ROUTES from '../../../routes';
import {useAppSelector} from '../../../redux/hooks';
import {partiesSelectors} from '../../../redux/slices/partiesSlice';
import {getOperationTableDetails} from '../../../services/operationTable';
import {TavoloOpResource} from '../../../api/generated/portal/TavoloOpResource';
import AddEditOperationTableForm from './AddEditOperationTableForm';

const AddEditOperationTablePage = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const addError = useErrorDispatcher();
    const goBack = () => history.push(ROUTES.HOME);
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
    const [operationTableDetail, setOperationTableDetail] = useState<TavoloOpResource>();

    useEffect(() => {
        if (selectedParty) {
            getOperationTableDetails(selectedParty.fiscalCode)
                .then((response) => {
                    setOperationTableDetail(response);
                })
                .catch((reason) => {
                    addError({
                        id: 'GET_OPERATIONTABLE',
                        blocking: false,
                        error: reason as Error,
                        techDescription: `An error occurred while retrieving Operation Table detail`,
                        toNotify: true,
                        displayableTitle: t('addEditOperationTableForm.errors.getOperationTableTitle'),
                        displayableDescription: t('addEditOperationTableForm.errors.getOperationTableDesc'),
                        component: 'Toast',
                    });
                });
        }
    }, [selectedParty]);

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
                        <Typography color={'text.disaled'}>{t('addEditOperationTableForm.title')}</Typography>
                    </Breadcrumbs>
                </Stack>
                <Grid container mt={3}>
                    <Grid item xs={12}>
                        <TitleBox
                            title={t('addEditOperationTableForm.title')}
                            mbTitle={2}
                            variantTitle="h4"
                            variantSubTitle="body1"
                        />
                        <Typography mb={5}>{t('addEditOperationTableForm.subtitle')}</Typography>
                    </Grid>
                    <Grid item xs={6}></Grid>
                </Grid>
                <Paper
                    elevation={8}
                    sx={{
                        borderRadius: 4,
                        p: 4,
                        mb: 3,
                    }}
                >
                    {selectedParty && (
                        <AddEditOperationTableForm
                            selectedParty={selectedParty}
                            goBack={goBack}
                            operationTableDetail={operationTableDetail}
                        />
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default AddEditOperationTablePage;
