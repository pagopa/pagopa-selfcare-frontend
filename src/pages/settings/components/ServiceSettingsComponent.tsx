import { Card, Chip } from "@mui/material";
type ServiceInfo = {
    serviceId: string;
    consent: string;
    consentDate: string;
};

const getStatusChip = (serviceInfo: ServiceInfo) => {
    if (serviceInfo.serviceId === "RTP") {
        return (<Chip label="Attivo" size="small" color="success" />);
    } else {
        return (<Chip label="Disattivo" size="small" color="error" />);
    }
};

const ServiceSettingsComponent = (serviceInfo: ServiceInfo) => (<Card variant="outlined" sx={{ border: 0, borderRadius: 0, p: 3, mb: 3 }}>
    {getStatusChip(serviceInfo)}
    <h1>{serviceInfo.serviceId}</h1>
    <h1>{serviceInfo.consent}</h1>
    <h1>{serviceInfo.consentDate}</h1>
</Card>);

export default ServiceSettingsComponent;