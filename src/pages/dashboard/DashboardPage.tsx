import { Alert, AlertTitle, Box, Card, Grid, Link, Typography } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import SideMenuLayout from '../../components/SideMenu/SideMenuLayout';
import { usePermissions } from '../../hooks/usePermissions';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import ROUTES from '../../routes';
import { ShowSettingsSection } from '../settings/utils';
import { useFlagValue } from '../../hooks/useFeatureFlags';
import { useOrganizationType } from '../../hooks/useOrganizationType';
import DownloadSection from './components/DownloadSection';
import ECRegistrationData from './components/ECRegistrationData';
import NextSteps from './components/NextSteps';
import OperationTable from './components/OperationTable';
import PSPRegistrationData from './components/PSPRegistrationData';
import PTRegistrationData from './components/PTRegistrationData';

const DashboardPage = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
    const signinData = useAppSelector(partiesSelectors.selectSigninData);
    const { orgInfo, orgIsBrokerSigned } = useOrganizationType();
    const { userHasPermission } = usePermissions();
    return (
        <SideMenuLayout>
            <TitleBox
                title={t('dashboardPage.title')}
                subTitle={t('dashboardPage.subtitle')}
                mbSubTitle={3}
                variantTitle="h4"
                variantSubTitle="body1"
            />
            {history.location.state && (history.location.state as any).alertSuccessMessage && (
                <Alert severity="success" variant="outlined" sx={{ mb: 4 }}>
                    {(history.location.state as any).alertSuccessMessage}
                </Alert>
            )}
            {ShowSettingsSection(useFlagValue, userHasPermission, orgInfo) && (
                <Alert severity="info" sx={{ mb: 4 }}>
                    <AlertTitle>{t('dashboardPage.newServiceAlerts.RTP.title')}</AlertTitle>
                    {t('dashboardPage.newServiceAlerts.RTP.subtitle')}
                    <Trans
                        i18nKey="dashboardPage.newServiceAlerts.RTP.message"
                        components={{
                            service_link: (<Link href={(`${ROUTES.SETTINGS}`)} underline="hover" fontWeight="bold"
                                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                            </Link>),
                        }}
                    />
                </Alert>
            )}

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Card variant="outlined" sx={{ border: 0, borderRadius: 0, p: 3, mb: 1 }}>
                        <Box mb={3}>
                            <Typography variant="h6">{t('dashboardPage.registrationData.title')}</Typography>
                        </Box>
                        <Grid container spacing={3} pb={4}>
                            {selectedParty?.institutionType === 'PSP' ? (
                                <PSPRegistrationData />
                            ) : selectedParty?.institutionType === 'PT' ? (
                                <PTRegistrationData />
                            ) : (
                                <ECRegistrationData />
                            )}
                        </Grid>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <NextSteps selectedParty={selectedParty} signinData={signinData}></NextSteps>
                    <DownloadSection selectedParty={selectedParty}></DownloadSection>
                </Grid>

                {selectedParty &&
                    userHasPermission('operation-table-read-write') && (
                        <OperationTable ecCode={selectedParty.fiscalCode} />
                    )}
            </Grid>
        </SideMenuLayout>
    );
};

export default DashboardPage;
