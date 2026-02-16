import {
    Button,
    Card,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Link,
    Typography,
} from '@mui/material';
import { Box, fontSize, margin } from '@mui/system';
import { TFunction, Trans, useTranslation } from 'react-i18next';
import LaunchIcon from '@mui/icons-material/Launch';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState } from 'react';
import { useErrorDispatcher, useLoading, useUserNotify } from '@pagopa/selfcare-common-frontend';
import { AppError } from '@pagopa/selfcare-common-frontend/model/AppError';
import { UserNotify } from '@pagopa/selfcare-common-frontend/model/UserNotify';
import { saveServiceConsent } from '../../../services/institutionService';
import { ConsentEnum } from '../../../api/generated/portal/ServiceConsentRequest';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { ServiceConsentResponse } from '../../../api/generated/portal/ServiceConsentResponse';
import { ServiceIdEnum } from '../../../api/generated/portal/ServiceConsentInfo';
import { rtpServiceStartingTimestamp, URLS } from '../utils';
import { useUserRole } from '../../../hooks/useUserRole';

export type ServiceInfo = {
    serviceId: ServiceIdEnum;
    consent: ConsentEnum;
    consentDate: Date;
};

// enumeration of all possible chip statuses
export const enum ServiceStatus {
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
export const rtpServiceChipStatusConf: Record<ServiceStatus, ChipConfDataType | undefined> = {
    [ServiceStatus.DISABLING]: { label: "serviceConsent.RTP.statuses.disabling", color: "warning", hidden: false },
    [ServiceStatus.DISABLED]: undefined,
    [ServiceStatus.ENABLING]: { label: "serviceConsent.RTP.statuses.enabling", color: "secondary", hidden: false },
    [ServiceStatus.ENABLED]: { label: "serviceConsent.RTP.statuses.enabled", color: "success", hidden: false },
    [ServiceStatus.ENABLED_FROM]: { label: "serviceConsent.RTP.statuses.enabledFrom", color: "success", hidden: false }
};

const StatusChip = ({ serviceInfo }: ({ serviceInfo: ServiceInfo })) => {
    const { t } = useTranslation();
    const chipStatus = getServiceStatus(serviceInfo);
    const chipConf = rtpServiceChipStatusConf[chipStatus];
    return chipConf ? (
        <Chip sx={{ borderRadius: "16px", padding: "4px" }} label={t(chipConf.label)} size="small" color={chipConf.color} />
    ) : (
        <Box />
    );
};

const getServiceStatus = (serviceInfo: ServiceInfo): ServiceStatus => {
    const nowMillis = Date.now();
    const consolidatedConsentDate = new Date(serviceInfo.consentDate);
    consolidatedConsentDate.setHours(24, 0, 0, 0);
    const consolidatedConsentDateMillis = consolidatedConsentDate.getTime();
    const isAfterServiceStartDate = nowMillis > rtpServiceStartingTimestamp();
    // consent is considered consolidated after midnight of the day after it was given
    const isConsentConsolidated = nowMillis >= consolidatedConsentDateMillis;
    const isServiceEnabled = serviceInfo.consent === ConsentEnum.OPT_IN;
    // eslint-disable-next-line functional/no-let
    let chipStatus: ServiceStatus;
    if (isServiceEnabled) {
        if (isConsentConsolidated) {
            chipStatus = isAfterServiceStartDate
                ? ServiceStatus.ENABLED
                : ServiceStatus.ENABLED_FROM;
        } else {
            chipStatus = ServiceStatus.ENABLING;
        }
    } else {
        chipStatus = isConsentConsolidated ? ServiceStatus.DISABLED : ServiceStatus.DISABLING;
    }
    return chipStatus;
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
    const addError = useErrorDispatcher();
    return (
        <Dialog
            open={modalOpenFlag}
            onClose={() => onModalStateChange(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            data-testid={`settingCard-${serviceId}-dialog`}
        >
            <DialogTitle marginTop="32px" fontWeight="700" fontSize="24px" lineHeight="32px" letterSpacing="0px" data-testid={`settingCard-${serviceId}-dialog-title`}>
                {t(`${translationRootKey}.title`)}
            </DialogTitle>
            <DialogContent>
                <Box data-testid={`settingCard-${serviceId}-dialog-message`}>
                    <DialogContentText fontWeight="400" fontSize="18px" letterSpacing="0px" lineHeight="24px">
                        <Trans
                            i18nKey={`${translationRootKey}.message`}
                            components={{
                                sanp_url: <Link fontStyle="bold" href={(`${URLS.SANP_URL}`)} />,
                            }}
                        />
                    </DialogContentText>
                </Box>
            </DialogContent>
            <DialogActions sx={{
                marginRight: 3,
                marginBottom: "32px"
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
                        variant="outlined"
                        color="error"
                        startIcon={<DoDisturbAltIcon />}
                        onClick={() => {
                            setLoading(true);
                            saveServiceConsent(selectedParty?.partyId || '', serviceId, ConsentEnum.OPT_OUT)
                                .then((data) => {
                                    onSaveServiceConsentResponse(data);
                                })
                                .catch((error) => UserFeedback.onError(error, addError, t))
                                .finally(() => {
                                    setLoading(false);
                                    onModalStateChange(false);
                                });
                        }}>
                        {t(`${translationRootKey}.confirmButton`)}
                    </Button>
                    :
                    <Button
                        data-testid={`settingCard-${serviceId}-dialog-enableButton`}
                        variant="contained"
                        onClick={() => {
                            setLoading(true);
                            saveServiceConsent(selectedParty?.partyId || '', serviceId, ConsentEnum.OPT_IN)
                                .then((data) => {
                                    onSaveServiceConsentResponse(data);
                                })
                                .catch((error) => UserFeedback.onError(error, addError, t))
                                .finally(() => {
                                    setLoading(false);
                                    onModalStateChange(false);
                                });
                        }}>
                        {t(`${translationRootKey}.confirmButton`)}
                    </Button>
                }
            </DialogActions>
        </Dialog>);
};


const ServiceSettingsCard = (serviceInfo: ServiceInfo) => {

    const { t } = useTranslation();
    const [serviceInfoState, setServiceInfoState] = useState<ServiceInfo>(serviceInfo);
    const serviceId = serviceInfoState.serviceId;
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
    const serviceTranslationRootKey = `serviceConsent.${serviceId}`;
    const userNotify = useUserNotify();
    const userRole = useUserRole();
    const serviceStatus = getServiceStatus(serviceInfoState);
    const consolidatedConsentDate = new Date(serviceInfoState.consentDate);
    consolidatedConsentDate.setHours(24, 1, 0, 0);
    const servicePendingStatusLabel = serviceStatus === ServiceStatus.ENABLING ? `${serviceTranslationRootKey}.enablingServiceMessage` : `${serviceTranslationRootKey}.disablingServiceMessage`;
    const formattedDate = consolidatedConsentDate.toLocaleDateString("it-IT", {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }) + ", 00:01";
    const showConsolidatedDateMessage = serviceStatus === ServiceStatus.DISABLING || serviceStatus === ServiceStatus.ENABLING;
    return (
        <Box>
            <Card data-testid={`settingCard-${serviceId}-card`} variant="outlined" sx={{ border: 0, borderRadius: 0, p: 3, mb: 3 }}>
                <Box data-testid={`settingCard-${serviceId}-statusChip`} >
                    <StatusChip serviceInfo={serviceInfoState} />
                </Box>
                <Box>
                    <Typography data-testid={`settingCard-${serviceId}-card-title`} variant="h4" mt={2} lineHeight="32px" fontSize="24px">{t(`serviceConsent.${serviceId}.title`)}</Typography>
                </Box>
                {showConsolidatedDateMessage && (
                    <Typography
                        data-testid={`settingCard-${serviceId}-pending-status`}
                        variant="subtitle2"
                        mt={"8px"}
                        lineHeight="18px"
                        fontSize="14px"
                        letterSpacing="0px">
                        <Trans
                            i18nKey={servicePendingStatusLabel}
                            values={{
                                consolidation_date: formattedDate
                            }}
                        />
                    </Typography>
                )}
                <Box sx={{ marginBottom: "32px", marginTop: showConsolidatedDateMessage ? "8px" : "16px" }}>
                    <Typography data-testid={`settingCard-${serviceId}-card-subtitle`} variant="subtitle1" fontWeight="regular" fontSize="16px">
                        {t(`${serviceTranslationRootKey}.description`)}
                    </Typography>
                    <Box sx={{ marginTop: 1 }} data-testid={`settingCard-${serviceId}-more-info-link`}>
                        <Trans
                            i18nKey={`${serviceTranslationRootKey}.moreInfo`}
                            components={{
                                sanp_url: (<Link href={(`${URLS.RTP_OVERVIEW_URL}`)} underline="none" fontWeight="bold" fontSize={16}
                                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                </Link>),
                                icon: <LaunchIcon fontSize="small" />
                            }}
                        />
                    </Box>
                </Box>
                <ServiceButton serviceInfo={serviceInfoState} onClick={() => {
                    if (userRole.userIsAdmin) {
                        setShowConfirmationModal(true);
                    } else {
                        UserFeedback.onAdminPermissionNeeded(serviceId, userNotify, t);
                    }
                }
                } />
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
                    UserFeedback.onSuccess(userNotify, t);
                })} />
        </Box>
    );
};

export const UserFeedback = {
    onSuccess: (addNotification: ((userNotify: UserNotify) => void), t: TFunction<"translation", undefined>) => {
        addNotification({
            id: "ACTION_ON_ENABLE_DISABLE_SERVICE",
            title: t('serviceConsent.toast.success.title'),
            message: t('serviceConsent.toast.success.description'),
            component: "Toast",
            autocloseMilliseconds: 5000
        });
    },
    onAdminPermissionNeeded: (serviceId: ServiceIdEnum, addNotification: ((userNotify: UserNotify) => void), t: TFunction<"translation", undefined>) => {
        addNotification({
            id: "ACTION_ON_ADMIN_PERMISSION_NEEDED",
            title: t(`serviceConsent.${serviceId}.popups.adminPermissionNeeded.title`),
            message: t(`serviceConsent.${serviceId}.popups.adminPermissionNeeded.description`),
            component: "SessionModal",
            autoclosable: "none",
            closeLabel: t(`serviceConsent.${serviceId}.popups.adminPermissionNeeded.cancelButton`),
        });
    },

    onError: (error: Error, addError: (error: AppError) => void, t: TFunction<"translation", undefined>) => {
        addError({
            id: 'SAVE_SERVICE_CONSENT',
            blocking: false,
            error,
            techDescription: `An error occurred while saving service consent`,
            toNotify: true,
            displayableTitle: t('serviceConsent.toast.error.title'),
            displayableDescription: t('serviceConsent.toast.error.description'),
            component: 'Toast',
            autocloseMilliseconds: 5000
        });
    }
};

export default ServiceSettingsCard;