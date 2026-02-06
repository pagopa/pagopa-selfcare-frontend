import { Alert, AlertTitle, CircularProgress, Link, Typography } from '@mui/material';
import { Trans, useTranslation } from "react-i18next";
import { TitleBox, useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { Box } from "@mui/system";
import { useEffect, useState } from 'react';
import SideMenuLayout from "../../components/SideMenu/SideMenuLayout";
import { ENV } from "../../utils/env";
import { ServiceConsentsResponse } from '../../api/generated/portal/ServiceConsentsResponse';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import { getServiceConsents } from '../../services/institutionService';
import ServiceSettingsCard from "./components/ServiceSettingsCard";



const SettingsPage = () => {
    const [serviceList, setServiceList] = useState<ServiceConsentsResponse>();
    const [isLoadingList, setIsLoadingList] = useState(false);
    const { t } = useTranslation();
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

    const fetchServices = useCallback(async () => {
        setIsLoadingList(true);
        getServiceConsents(selectedParty?.partyId || '')
            .then((response) => {
                setServiceList(response);
            })
        .catch((error) => HandleError(error))
            .finally(() => {
                setIsLoadingList(false);
            });
    }, [selectedParty?.partyId]);

    useEffect(() => {
      fetchServices().catch((error) => HandleError(error));
    }, [fetchServices]);

    return (
        <SideMenuLayout>
            <TitleBox
                title={t('settingsPage.title')}
                subTitle={t('settingsPage.subtitle')}
                variantTitle="h4"
                variantSubTitle="body1"
                mbSubTitle={1}

            />
            <Alert severity="warning">
                <AlertTitle data-testid="settingsPage.taxonomyAlert">{t('settingsPage.warningAlerts.rtp.taxonomyAlertTitle')}</AlertTitle>
                {t('settingsPage.warningAlerts.rtp.taxonomyAlertContent')}
                <Trans
                    i18nKey="settingsPage.warningAlerts.rtp.taxonomyAlertDocLinkText"
                    components={{
                        sanp_url: (<Link href={(`${ENV.SETTINGS.SERVICES.SANP_URL}`)} underline="hover" my={1} fontWeight="bold"
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        </Link>),
                    }}
                />
            </Alert>

            <Box mt={3}>
                {isLoadingList ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {serviceList?.services && serviceList.services.length > 0 ? (
                            serviceList.services.map((s) => (
                                <ServiceSettingsCard
                                    key={s.serviceId}
                                    serviceId={s.serviceId}
                                    consent={s.consent}
                                    consentDate={s.consentDate}
                                />
                            ))
                        ) : (
                            <Typography variant="body1" color="textSecondary">
                                {t('settingsPage.emptyListError')}
                            </Typography>
                        )}
                    </>
                )}
            </Box>
        </SideMenuLayout>
    );
};

const HandleError = (error: Error) => {
  const addError = useErrorDispatcher();
  const { t } = useTranslation();
  addError({
    id: 'GET_SERVICE_CONSENTS',
    blocking: false,
    error,
    techDescription: `An error occurred while getting services consents`,
    toNotify: true,
    displayableTitle: t('settingsPage.errorTitle'),
    displayableDescription: t('settingsPage.errorDescription'),
    component: 'Toast',
  });
};

export default SettingsPage;