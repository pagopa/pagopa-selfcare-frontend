import {Alert, Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { TitleBox } from "@pagopa/selfcare-common-frontend";
import { Box } from "@mui/system";
import SideMenuLayout from "../../components/SideMenu/SideMenuLayout";

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
              <Trans i18nKey='settingsPage.warningAlerts.rtp.taxonomyAlert'>
                <b>TaxonomyAlertTitle</b>
                <br />
              </Trans>
            </Alert>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={4}>
                <Box>
                    <Typography variant="h6">{t('apiKeysPage.decription')}</Typography>
                </Box>
            </Box>
            </SideMenuLayout>
    );
};

export default SettingsPage;