import { Button, Card, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Link, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Trans, useTranslation } from "react-i18next";
import LaunchIcon from '@mui/icons-material/Launch';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Dispatch, SetStateAction, useState } from "react";
import { useLoading } from "@pagopa/selfcare-common-frontend";
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

const GetServiceButton = (serviceInfo: ServiceInfo, showDisableModalStateAction: Dispatch<SetStateAction<boolean>>, showEnableModalStateAction: Dispatch<SetStateAction<boolean>>) => {
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

const ServiceStatusChangeModal = (serviceId: string, modalOpenFlag: boolean, setModalOpenFlag: Dispatch<SetStateAction<boolean>>, showEnableService: boolean) => {
    const { t } = useTranslation();
    const translationRootKey = `serviceConsent.${serviceId}.popups.${showEnableService ? "enableService" : "disableService"}`;
    const setLoading = useLoading('PUT_CONSENT');
    return (
        <Dialog
            open={modalOpenFlag}
            onClose={() => setModalOpenFlag(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            data-testid="dialog-test"
        >
            <DialogTitle id="alert-dialog-title" fontWeight={'bold'}>
                {t(`${translationRootKey}.title`)}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Typography>
                        <Trans
                            i18nKey={`${translationRootKey}.message`}
                            components={{
                                sanp_url: <Link href={(`${URLS.SANP_URL}`)} />,
                            }}
                        />
                    </Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{
                marginRight: 3,
                marginBottom: 2
            }} >
                <Button
                    data-testid="dialog-button-cancel"
                    variant="outlined"
                    sx={{
                        marginRight: 1
                    }}
                    onClick={() => setModalOpenFlag(false)}>
                    {t(`${translationRootKey}.cancelButton`)}
                </Button>
                {showEnableService ?
                    <Button
                        data-testid="dialog-button-confirm-enabling"
                        variant="contained"
                        onClick={
                            // TODO: set timeout here just to mock b.e. interaction
                            () => {
                                setLoading(true);
                                setTimeout(function () {
                                setLoading(false);
                                setModalOpenFlag(false);
                            }, 2000);
                        }}>
                        {t(`${translationRootKey}.confirmButton`)}
                    </Button>
                    :
                    <Button
                        data-testid="dialog-button-confirm-disabling"
                        variant="outlined"
                        color="error"
                        startIcon={<DoDisturbAltIcon />}
                        onClick={
                            // TODO: set timeout here just to mock b.e. interaction
                            () => {
                                setLoading(true);
                                setTimeout(function () {
                                setLoading(false);
                                setModalOpenFlag(false);
                            }, 3000);
                        }}>
                        {t(`${translationRootKey}.confirmButton`)}
                    </Button>
                }
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
                    {GetServiceButton(serviceInfo, setShowDisableServiceModal, setShowEnableServiceModal)}
                    <Button sx={{ marginLeft: 3 }} variant="text" endIcon={<EditIcon />} onClick={() => console.log("click key 2")}>
                        {t(`${serviceTranslationRootKey}.editContacts`)}
                    </Button>
                </Grid>
            </Card>
            {ServiceStatusChangeModal(serviceInfo.serviceId, showDisableServiceModal, setShowDisableServiceModal, false)}
            {ServiceStatusChangeModal(serviceInfo.serviceId, showEnableServiceModal, setShowEnableServiceModal, true)}
        </Box>
    );
};

export default ServiceSettingsCard;