import {
    Button,
    Card,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Link,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { Trans, useTranslation } from 'react-i18next';
import LaunchIcon from '@mui/icons-material/Launch';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState } from 'react';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { saveServiceConsent } from '../../../services/institutionService';
import { ConsentEnum } from '../../../api/generated/portal/ServiceConsentRequest';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { ServiceConsentResponse } from '../../../api/generated/portal/ServiceConsentResponse';
import { ServiceIdEnum } from '../../../api/generated/portal/ServiceConsentInfo';
import { rtpServiceStartingTimestamp, URLS } from './utils';

export type ServiceInfo = {
    serviceId: ServiceIdEnum;
    consent: ConsentEnum;
    consentDate: Date;
};

// enumeration of all possible chip statuses
export const enum ChipStatus {
    DISABLING = "DISABLING",
    DISABLED = "DISABLED",
    ENABLING = "ENABLING",
    ENABLED = "ENABLED",
    ENABLED_FROM = "ENABLED_FROM"
};

export type ChipConfDataType = {
    label: string;
    color: 'success' | 'warning' | 'secondary';
    hidden: boolean;
};
export const rtpServiceChipStatusConf: Record<ChipStatus, ChipConfDataType | undefined> = {
    [ChipStatus.DISABLING]: { label: "serviceConsent.RTP.statuses.disabling", color: "warning", hidden: false },
    [ChipStatus.DISABLED]: undefined,
    [ChipStatus.ENABLING]: { label: "serviceConsent.RTP.statuses.enabling", color: "secondary", hidden: false },
    [ChipStatus.ENABLED]: { label: "serviceConsent.RTP.statuses.enabled", color: "success", hidden: false },
    [ChipStatus.ENABLED_FROM]: { label: "serviceConsent.RTP.statuses.enabledFrom", color: "success", hidden: false }
};

const StatusChip = ({ serviceInfo }: ({ serviceInfo: ServiceInfo })) => {
    const { t } = useTranslation();
    const nowMillis = Date.now();
    const consolidatedConsentDate = new Date(serviceInfo.consentDate);
    consolidatedConsentDate.setHours(24, 0, 0, 0);
    const consolidatedConsentDateMillis = consolidatedConsentDate.getTime();
    const isAfterServiceStartDate = nowMillis > rtpServiceStartingTimestamp();
    // consent is considered consolidated after midnight of the day after it was given
    const isConsentConsolidated = nowMillis >= consolidatedConsentDateMillis;
    const isServiceEnabled = serviceInfo.consent === ConsentEnum.OPT_IN;
    // eslint-disable-next-line functional/no-let
    let chipStatus: ChipStatus;
    if (isServiceEnabled) {
        if (isConsentConsolidated) {
            chipStatus = isAfterServiceStartDate
                ? ChipStatus.ENABLED
                : ChipStatus.ENABLED_FROM;
        } else {
            chipStatus = ChipStatus.ENABLING;
        }
    } else {
        chipStatus = isConsentConsolidated ? ChipStatus.DISABLED : ChipStatus.DISABLING;
    }
    const chipConf = rtpServiceChipStatusConf[chipStatus];
    return chipConf ? (
        <Chip label={t(chipConf.label)} size="small" color={chipConf.color} />
    ) : (
        <Box />
    );
};

const ServiceButton = ({ serviceInfo, onClick }: ({ serviceInfo: ServiceInfo; onClick: () => void })) => {
    const { t } = useTranslation();
    if (serviceInfo.consent === ConsentEnum.OPT_IN) {
        return (<Button
            data-testid={`settingCard-${serviceInfo.serviceId}-disableButton`}
            variant="outlined"
            startIcon={<DoDisturbAltIcon />}
            color="error"
            onClick={onClick}
        >
            {t(`serviceConsent.${serviceInfo.serviceId}.disableButtonText`)}
        </Button>);
    } else {
        return (<Button
            data-testid={`settingCard-${serviceInfo.serviceId}-enableButton`}
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={onClick}
        >
            {t(`serviceConsent.${serviceInfo.serviceId}.enableButtonText`)}
        </Button>);
    }

};

const ServiceStatusChangeModal = ({ serviceInfo, modalOpenFlag, onModalStateChange, onSaveServiceConsentResponse }: ({ serviceInfo: ServiceInfo; modalOpenFlag: boolean; onModalStateChange: (flag: boolean) => void; onSaveServiceConsentResponse: (s: ServiceConsentResponse) => void })) => {
    const { t } = useTranslation();
    const serviceId = serviceInfo.serviceId;
    const isServiceEnabled = serviceInfo.consent === ConsentEnum.OPT_IN;
    const translationRootKey = `serviceConsent.${serviceId}.popups.${isServiceEnabled ? "disableService" : "enableService"}`;
    const setLoading = useLoading('PUT_CONSENT');
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
    return (
        <Dialog
            open={modalOpenFlag}
            onClose={() => onModalStateChange(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            data-testid={`settingCard-${serviceId}-dialog`}
        >
            <DialogTitle fontWeight={'bold'} data-testid={`settingCard-${serviceId}-dialog-title`} >
                {t(`${translationRootKey}.title`)}
            </DialogTitle>
            <DialogContent>
                <Box data-testid={`settingCard-${serviceId}-dialog-message`}>
                    <DialogContentText>
                        <Trans
                            i18nKey={`${translationRootKey}.message`}
                            components={{
                                sanp_url: <Link href={(`${URLS.SANP_URL}`)} />,
                            }}
                        />
                    </DialogContentText>
                </Box>
            </DialogContent>
            <DialogActions sx={{
                marginRight: 3,
                marginBottom: 2
            }} >
                <Button
                    data-testid={`settingCard-${serviceId}-dialog-cancelButton`}
                    variant="outlined"
                    sx={{
                        marginRight: 1
                    }}
                    onClick={() => onModalStateChange(false)}>
                    {t(`${translationRootKey}.cancelButton`)}
                </Button>
                {isServiceEnabled ?
                    <Button
                        data-testid={`settingCard-${serviceId}-dialog-disableButton`}
                        variant="contained"
                        onClick={() => {
                            setLoading(true);
                            saveServiceConsent(selectedParty?.partyId || '', serviceId, ConsentEnum.OPT_OUT)
                                .then((data) => {
                                    onSaveServiceConsentResponse(data);
                                    onModalStateChange(false);
                                })
                                .catch((error) => HandleError(error))
                                .finally(() => setLoading(false));
                        }}>
                        {t(`${translationRootKey}.confirmButton`)}
                    </Button>
                    :
                    <Button
                        data-testid={`settingCard-${serviceId}-dialog-enableButton`}
                        variant="outlined"
                        color="error"
                        startIcon={<DoDisturbAltIcon />}
                        onClick={() => {
                            setLoading(true);
                            saveServiceConsent(selectedParty?.partyId || '', serviceId, ConsentEnum.OPT_IN)
                                .then((data) => {
                                    onSaveServiceConsentResponse(data);
                                    onModalStateChange(false);
                                })
                                .catch((error) => HandleError(error))
                                .finally(() => setLoading(false));
                        }}>
                        {t(`${translationRootKey}.confirmButton`)}
                    </Button>
                }
            </DialogActions>
        </Dialog>);
};

const HandleError = (error: Error) => {
    const addError = useErrorDispatcher();
    const { t } = useTranslation();
    addError({
        id: 'SAVE_SERVICE_CONSENT',
        blocking: false,
        error,
        techDescription: `An error occurred while saving service consent`,
        toNotify: true,
        displayableTitle: t('serviceConsent.errorTitle'),
        displayableDescription: t('serviceConsent.errorDescription'),
        component: 'Toast',
    });
};

const ServiceSettingsCard = (serviceInfo: ServiceInfo) => {

    const { t } = useTranslation();
    const [serviceInfoState, setServiceInfoState] = useState<ServiceInfo>(serviceInfo);
    const serviceId = serviceInfoState.serviceId;
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
    const serviceTranslationRootKey = `serviceConsent.${serviceId}`;

    return (
        <Box>
            <Card data-testid={`settingCard-${serviceId}-card`} variant="outlined" sx={{ border: 0, borderRadius: 0, p: 3, mb: 3 }}>
                <Box data-testid={`settingCard-${serviceId}-statusChip`} >
                    <StatusChip serviceInfo={serviceInfoState} />
                </Box>
                <Box>
                    <Typography data-testid={`settingCard-${serviceId}-card-title`} variant="h4" mt={2}>{t(`serviceConsent.${serviceId}.title`)}</Typography>
                </Box>
                <Box >
                    <Typography data-testid={`settingCard-${serviceId}-card-subtitle`} variant="subtitle1" fontWeight="regular" fontSize={16} my={1}>
                        {t(`${serviceTranslationRootKey}.description`)}
                    </Typography>
                </Box>

                <Grid container direction={"row"} mt={4} spacing={0}>
                    <ServiceButton serviceInfo={serviceInfoState} onClick={() => {
                        setShowConfirmationModal(true);
                    }
                    } />
                    <Box data-testid={`settingCard-${serviceId}-more-info-link`}>
                        <Trans
                            i18nKey={`${serviceTranslationRootKey}.moreInfo`}
                            components={{
                                sanp_url: (<Link href={(`${URLS.RTP_OVERVIEW_URL}`)} underline="hover" my={1} fontWeight="bold"
                                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5, marginLeft: 5 }}>
                                </Link>),
                                icon: <LaunchIcon fontSize="small" />
                            }}
                        />
                    </Box>
                </Grid>
            </Card>
            <ServiceStatusChangeModal
                serviceInfo={serviceInfoState}
                modalOpenFlag={showConfirmationModal}
                onModalStateChange={setShowConfirmationModal}
                onSaveServiceConsentResponse={(serviceConsentResponse => {
                    setServiceInfoState({
                        serviceId: serviceInfoState.serviceId,
                        consent: serviceConsentResponse.consent,
                        consentDate: serviceConsentResponse.date

                    });
                })} />
        </Box>
    );
};
export default ServiceSettingsCard;