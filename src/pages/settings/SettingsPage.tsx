import { Alert, AlertTitle, CircularProgress, Link, Typography } from '@mui/material';
import { TFunction, Trans, useTranslation } from "react-i18next";
import { TitleBox, useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { Box } from "@mui/system";
import { useCallback, useEffect, useState } from 'react';
import { AppError } from '@pagopa/selfcare-common-frontend/model/AppError';
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
    const addError = useErrorDispatcher();
    const fetchServices = useCallback(async () => {
        if (!selectedParty?.partyId){
            console.error("Cannot retrieve service consent for selectedParty.partyId:", selectedParty?.partyId);
            return;
        } 
        setIsLoadingList(true);
        getServiceConsents(selectedParty.partyId)
            .then((response) => {
                setServiceList(response);
            })
        .catch((error) => onError(error, addError, t))
            .finally(() => {
                setIsLoadingList(false);
            });
    }, [selectedParty?.partyId]);

    useEffect(() => {
      fetchServices().catch((error) => onError(error, addError, t));
    }, [fetchServices]);

    return (
        <SideMenuLayout>
            <Box data-testid="settingsPage.title">
            <TitleBox
                title={t('settingsPage.title')}
                subTitle={t('settingsPage.subtitle')}
                variantTitle="h4"
                variantSubTitle="body1"
                mbSubTitle={1}
                titleFontSize='32px'
                subTitleFontSize='16px'
            />
            </Box>
            <Alert severity="warning" sx={{fontSize: 16, letterSpacing: "0px", lineHeight: "21px"}}>
                <AlertTitle sx={{fontSize: 16, letterSpacing: "0px", lineHeight: "21px"}} data-testid="settingsPage.taxonomyAlertTitle">{t('settingsPage.warningAlerts.rtp.taxonomyAlertTitle')}</AlertTitle>
                {t('settingsPage.warningAlerts.rtp.taxonomyAlertContent')}
                <Trans
                    i18nKey="settingsPage.warningAlerts.rtp.taxonomyAlertDocLinkText"
                    components={{
                        sanp_url: (<Link href={(`${ENV.SETTINGS.SERVICES.SANP_URL}`)} underline="hover" my={1} fontWeight="bold"
                            sx={{ display: 'flex', alignItems: 'center', fontSize: 16, letterSpacing: "0.3px", lineHeight: "21px", verticalAlign: "middle" }}>
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
                            <Typography data-testid="settingsPage.emptyListError" variant="body1" color="textSecondary">
                                {t('settingsPage.emptyListError')}
                            </Typography>
                        )}
                    </>
                )}
            </Box>
        </SideMenuLayout>
    );
};

const onError = (error:Error, addError:(error: AppError) => void, t: TFunction<"translation", undefined>) => {
  addError({
    id: 'GET_SERVICE_CONSENTS',
    blocking: false,
    error,
    techDescription: `An error occurred while getting services consents`,
    toNotify: true,
    displayableTitle: t('settingsPage.errorTitle'),
    displayableDescription: t('settingsPage.errorDescription'),
    component: 'Toast',
    autocloseMilliseconds: 4000
  });
};

export default SettingsPage; 