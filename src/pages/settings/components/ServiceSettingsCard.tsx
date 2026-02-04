import { Button, Card, Chip, Grid, Link, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import LaunchIcon from '@mui/icons-material/Launch';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

type ServiceInfo = {
    serviceId: string;
    consent: string;
    consentDate: string;
};

const GetStatusChip = (serviceInfo: ServiceInfo) => {
    if (serviceInfo.consent === "OPT-IN") {
        return (<Chip label="Attivo" size="small" color="success" />);
    } else {
        return (<Chip label="Disattivo" size="small" color="error" />);
    }
};

const GetServiceButton = (serviceInfo: ServiceInfo) => {
    const { t } = useTranslation();
    if (serviceInfo.consent === "OPT-IN") {

        return (<Button variant="outlined" startIcon={<DoDisturbAltIcon />} color="error" onClick={() => console.log("click key 1")}>
            {t(`serviceConsent.${serviceInfo.serviceId}.disableButtonText`)}
        </Button>);
    } else {

        return (<Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => console.log("click key 1")}>
            {t(`serviceConsent.${serviceInfo.serviceId}.enableButtonText`)}
        </Button>);
    }

};

const ServiceSettingsCard = (serviceInfo: ServiceInfo) => {


    const { t } = useTranslation();
    const serviceId = serviceInfo.serviceId;
    return (
        <Card variant="outlined" sx={{ border: 0, borderRadius: 0, p: 3, mb: 3 }}>
            <Box>
                {GetStatusChip(serviceInfo)}
            </Box>
            <Box>
                <Typography variant="h4" mt={2}>{t(`serviceConsent.${serviceId}.title`)}</Typography>
            </Box>
            <Box>
                <Typography variant="subtitle1" fontWeight="regular" fontSize={16} my={1}>
                    {t(`serviceConsent.${serviceId}.description`)}
                </Typography>
            </Box>
            <Box>
                <Link
                    href={t(`serviceConsent.${serviceId}.moreInfoLink`).toString()} underline="hover" my={1} fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {t(`serviceConsent.${serviceId}.moreInfo`)}
                    <LaunchIcon fontSize="small" />
                </Link>
            </Box>
            <Grid mt={4}>
                {GetServiceButton(serviceInfo)}
                <Button sx={{ marginLeft: 3 }} variant="text" endIcon={<EditIcon />} onClick={() => console.log("click key 2")}>
                    {t(`serviceConsent.${serviceId}.editContacts`)}
                </Button>
            </Grid>
        </Card>);
};

export default ServiceSettingsCard;