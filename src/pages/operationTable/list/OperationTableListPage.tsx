import {Box, Breadcrumbs, Grid, Paper, Stack, Typography} from '@mui/material';
import {ButtonNaked} from '@pagopa/mui-italia';
import {TitleBox, useErrorDispatcher, useLoading} from '@pagopa/selfcare-common-frontend';
import {useHistory} from 'react-router';
import {useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';
import {handleErrors} from '@pagopa/selfcare-common-frontend/services/errorService';
import {ArrowBack} from '@mui/icons-material';
import ROUTES from '../../../routes';
import {LOADING_TASK_OPERATION_TABLE_LIST} from '../../../utils/constants';
import {getOperationTableList} from '../../../services/operationTable';
import SideMenuLayout from '../../../components/SideMenu/SideMenuLayout';
import {TavoloOpResourceList} from '../../../api/generated/portal/TavoloOpResourceList';
import OperationTableList from './OperationTableList';

const emptyOperationTableList: TavoloOpResourceList = {
    tavoloOpResourceList: [],
};

const OperationTableListPage = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const addError = useErrorDispatcher();

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const setLoadingOverlay = useLoading(LOADING_TASK_OPERATION_TABLE_LIST);
    const setLoadingStatus = (status: boolean) => {
        setLoading(status);
        setLoadingOverlay(status);
    };
    const [operationTableList, setOperationTableList] = useState(emptyOperationTableList);
    const goBack = () => history.push(ROUTES.HOME);

    useEffect(() => {
        setLoadingStatus(true);
        getOperationTableList()
            .then((r) => (r ? setOperationTableList(r) : setOperationTableList(emptyOperationTableList)))
            .catch((reason) => {
                handleErrors([
                    {
                        id: `FETCH_STATIONS_ERROR`,
                        blocking: false,
                        error: reason,
                        techDescription: `An error occurred while fetching stations`,
                        toNotify: false,
                    },
                ]);
                setError(true);
                addError({
                    id: 'GET_OPERATION_TABLE_LIST',
                    blocking: false,
                    error: reason,
                    techDescription: `An error occurred while retrieving Operation Table list`,
                    toNotify: true,
                    displayableTitle: t('operationTableListPage.errors.getOperationTableListTitle'),
                    displayableDescription: t('operationTableListPage.errors.getOperationTableListDesc'),
                    component: 'Toast',
                });
                setOperationTableList(emptyOperationTableList);
            })
            .finally(() => setLoadingStatus(false));
    }, []);

    return (
        <SideMenuLayout>
            <Stack direction="row" mb={3}>
                <ButtonNaked
                    size="small"
                    component="button"
                    onClick={goBack}
                    startIcon={<ArrowBack/>}
                    sx={{color: 'primary.main', mr: '20px', fontWeight: 700}}
                    weight="default"
                >
                    {t('general.back')}
                </ButtonNaked>
                <Breadcrumbs>
                    <Typography fontWeight={'fontWeightMedium'}>{t('general.operationTable')}</Typography>
                </Breadcrumbs>
            </Stack>

            <Stack direction="row" justifyContent={'space-between'}>
                <Box>
                    <TitleBox
                        title={t('operationTableListPage.title')}
                        subTitle={t('operationTableListPage.subtitle')}
                        mbTitle={2}
                        mbSubTitle={3}
                        variantTitle="h4"
                        variantSubTitle="body1"
                    />
                </Box>
            </Stack>
            <Box display="flex" width="100%" mt={0}>
                <Box pt={0} display="flex" width="100%">
                    <OperationTableList
                        operationTableList={operationTableList}
                        error={error}
                        loading={loading}
                    />
                </Box>
            </Box>
        </SideMenuLayout>
    );
};

export default OperationTableListPage;
