import {Alert, AlertTitle} from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { TitleBox } from "@pagopa/selfcare-common-frontend";
import { Box } from "@mui/system";
import SideMenuLayout from "../../components/SideMenu/SideMenuLayout";
import ServiceSettingsComponent from "./components/ServiceSettingsComponent";
const serviceList = [ {
      "serviceId": "RTP",
      "consent": "OPT-OUT",
      "consentDate": "2026-02-01T15:59:49.176001817Z"
    },
{
      "serviceId": "RTP",
      "consent": "OPT-IN",
      "consentDate": "2026-02-01T15:59:49.176001817Z"
    }];
const SettingsPage = () => {
    const {t} = useTranslation();
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
                <AlertTitle>{t('settingsPage.warningAlerts.rtp.taxonomyAlertTitle')}</AlertTitle>
                {t('settingsPage.warningAlerts.rtp.taxonomyAlertContent')}
                <Trans i18nKey="settingsPage.warningAlerts.rtp.axonomyAlertDocLinkText"><br/><br/><b><a href={t('settingsPage.warningAlerts.rtp.taxonomyAlertDocLink')}>{t('settingsPage.warningAlerts.rtp.taxonomyAlertDocLinkText')}</a></b></Trans>
            </Alert>

            <Box mt={3}>
            {serviceList.map((s) => (
                <ServiceSettingsComponent key={s.serviceId} serviceId={s.serviceId} consent={s.consent} consentDate={s.consentDate}/>
            ))
            }
            </Box>
            </SideMenuLayout>
    );
};

export default SettingsPage;