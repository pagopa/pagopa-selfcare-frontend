import { Button, Card, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Link, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Trans, useTranslation } from "react-i18next";
import LaunchIcon from '@mui/icons-material/Launch';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Dispatch, SetStateAction, useState } from "react";
import { theme } from "@pagopa/mui-italia";
import { ENV } from "../../../utils/env";

type ServiceInfo = {
    serviceId: string;
    consent: string;
    consentDate: string;
};
const URLS = {
    SANP_URL: ENV.SETTINGS.SERVICES.SANP_URL,
    RTP_OVERVIEW_URL: ENV.SETTINGS.SERVICES.RTP_OVERVIEW_URL
};

const GetStatusChip = (serviceInfo: ServiceInfo) => {
    if (serviceInfo.consent === "OPT-IN") {
        return (<Chip label="Attivo" size="small" color="success" />);
    } else {
        return (<Chip label="Disattivo" size="small" color="error" />);
    }
};

const GetServiceButton = (serviceInfo: ServiceInfo,showDisableModalStateAction: Dispatch<SetStateAction<boolean>>,showEnableModalStateAction: Dispatch<SetStateAction<boolean>>) => {
    const { t } = useTranslation();
    if (serviceInfo.consent === "OPT-IN") {

        return (<Button variant="outlined" startIcon={<DoDisturbAltIcon />} color="error" onClick={() => showDisableModalStateAction(true)}>
            {t(`serviceConsent.${serviceInfo.serviceId}.disableButtonText`)}
        </Button>);
    } else {

        return (<Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => showEnableModalStateAction(true)}>
            {t(`serviceConsent.${serviceInfo.serviceId}.enableButtonText`)}
        </Button>);
    }

};

const ServiceStatusChangeModal = (serviceId: string,modalOpenFlag:boolean, setModalOpenFlag: Dispatch<SetStateAction<boolean>>, isActivateService:boolean) =>{
    const { t } = useTranslation();
    const translationRootKey = `serviceConsent.${serviceId}.popups.${isActivateService?"enableService":"disableService"}`;
    console.log("translationRootKey ", translationRootKey);
    return (
            <Dialog
                open={modalOpenFlag}
                onClose={() => setModalOpenFlag(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                data-testid="dialog-test"
            >
                <DialogTitle id="alert-dialog-title">
                    {t(`${translationRootKey}.title`)}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Box>
                            <Typography variant="sidenav">
                                <Trans
                                    i18nKey={`${translationRootKey}.message`}
                                    components={{
                                    sanp_url: <Link href={(`${URLS.SANP_URL}`)} />,
                                    }}
                                />
                            </Typography>
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        data-testid="dialog-button-confirm"
                        variant="contained"
                        sx={{
                            border: `2px solid ${theme.palette.primary.main}`,
                            borderRadius: theme.spacing(0.5),
                            px: 2,
                            py: 1.5,
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                        onClick={() => setModalOpenFlag(false)}>
                        {t(`${translationRootKey}.disableButton`)}
                    </Button>
                </DialogActions>
            </Dialog>);
};

const ServiceSettingsCard = (serviceInfo: ServiceInfo) => {


    const { t } = useTranslation();
    const serviceId = serviceInfo.serviceId;
    const [showEnableServiceModal, setShowEnableServiceModal] = useState<boolean>(false);
    const [showDisableServiceModal, setShowDisableServiceModal] = useState<boolean>(false);
    const serviceTranslationRootKey = `serviceConsent.${serviceId}`;
    return (
        <Box>
        <Card variant="outlined" sx={{ border: 0, borderRadius: 0, p: 3, mb: 3 }}>
            <Box>
                {GetStatusChip(serviceInfo)}
            </Box>
            <Box>
                <Typography variant="h4" mt={2}>{t(`serviceConsent.${serviceId}.title`)}</Typography>
            </Box>
            <Box>
                <Typography variant="subtitle1" fontWeight="regular" fontSize={16} my={1}>
                    {t(`${serviceTranslationRootKey}.description`)}
                </Typography>
            </Box>
                    <Trans
                        i18nKey={`${serviceTranslationRootKey}.moreInfo`}
                        components={{
                        sanp_url: (<Link href={(`${URLS.RTP_OVERVIEW_URL}`)} underline="hover" my={1} fontWeight="bold"
                         sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}> 
                         </Link>),
                         icon: <LaunchIcon fontSize="small" /> 
                        }}
                    />
            <Grid mt={4}>
                {GetServiceButton(serviceInfo,setShowDisableServiceModal,setShowEnableServiceModal)}
                <Button sx={{ marginLeft: 3 }} variant="text" endIcon={<EditIcon />} onClick={() => console.log("click key 2")}>
                    {t(`${serviceTranslationRootKey}.editContacts`)}
                </Button>
            </Grid>
        </Card>
        {ServiceStatusChangeModal(serviceInfo.serviceId, showDisableServiceModal,setShowDisableServiceModal, false)}
        {ServiceStatusChangeModal(serviceInfo.serviceId, showEnableServiceModal,setShowEnableServiceModal, true)}
        </Box>
    );
};

export default ServiceSettingsCard;