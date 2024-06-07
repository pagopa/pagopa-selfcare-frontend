import {ArrowBack, FileDownload} from '@mui/icons-material';
import {Alert, Box, Breadcrumbs, Button, Grid, Stack, Typography} from '@mui/material';
import {ButtonNaked} from '@pagopa/mui-italia';
import {TitleBox} from '@pagopa/selfcare-common-frontend';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory, useParams} from 'react-router';
import SideMenuLayout from '../../../components/SideMenu/SideMenuLayout';
import ROUTES from '../../../routes';
import ChannelPSPTable from './ChannelPSPTable';
import ChannelPSPTableSearchBar from './ChannelPSPTableSearchBar';


const ChannelPSPListPage = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const {channelId} = useParams<{ channelId: string }>();
    const [alertMessage, setAlertMessage] = useState('');
    const goBack = () => history.push(ROUTES.CHANNELS);

    const [pspNameInput, setPspNameInput] = useState<string>('');
    const [pspNameFilter, setPspNameFilter] = useState<string>('');

    useEffect(() => {
        const setSearchValue = setTimeout(() => {
            setPspNameFilter(pspNameInput);
        }, 500);

        return () => clearTimeout(setSearchValue);
    }, [pspNameInput]);

    useEffect(() => {
        if (history.location.state && (history.location.state as any).alertSuccessMessage) {
            setAlertMessage((history.location.state as any).alertSuccessMessage);
            window.history.replaceState({}, document.title);
        }
    }, []);

    const downloadCSV = () => {
        // TODO: fetch current PSP associated with channel
        /*
        const rows = mockedChannelPSPs.payment_service_providers ?? [];
        const headers = ['Nome PSP', 'PSP Code'];

        const csvContent = `${headers.join(';')}\n${rows
          .map((e) => [e.business_name, e.psp_code].join(';'))
          .join('\n')}`;
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `PSP-channel-${channelId}.csv`);
        a.click(); */
    };

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
                    <Typography fontSize={16}>{channelId}</Typography>
                    <Typography fontWeight={'fontWeightMedium'}>{t('channelPSPList.title')}</Typography>
                </Breadcrumbs>
            </Stack>

            <Stack direction="row" justifyContent={'space-between'}>
                <Box>
                    <TitleBox
                        title={t('channelPSPList.title')}
                        subTitle={t('channelPSPList.subtitle')}
                        mbSubTitle={3}
                        variantTitle="h4"
                        variantSubTitle="body1"
                    />
                </Box>
                <Box>
                    <Button
                        variant="outlined"
                        sx={{display: 'none'}}
                        startIcon={<FileDownload/>}
                        onClick={() => downloadCSV()}
                    >
                        {t('channelPSPList.csvDownload')}
                    </Button>
                </Box>
            </Stack>

            {alertMessage && (
                <Alert sx={{mb: 3}} severity="success" variant="outlined">
                    {alertMessage}
                </Alert>
            )}

            <ChannelPSPTableSearchBar
                channelId={channelId}
                pspNameInput={pspNameInput}
                setPspNameInput={setPspNameInput}
            />

            <ChannelPSPTable pspNameFilter={pspNameFilter} setAlertMessage={setAlertMessage}/>
        </SideMenuLayout>
    );
};

export default ChannelPSPListPage;
