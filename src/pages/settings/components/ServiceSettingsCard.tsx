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
import { Dispatch, SetStateAction, useState } from 'react';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { ENV } from '../../../utils/env';
import { saveServiceConsent } from '../../../services/institutionService';
import { ConsentEnum } from '../../../api/generated/portal/ServiceConsentRequest';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { ServiceConsentResponse } from '../../../api/generated/portal/ServiceConsentResponse';

type ServiceInfo = {
  serviceId: string;
  consent: ConsentEnum;
  consentDate: Date;
};
const URLS = {
  SANP_URL: ENV.SETTINGS.SERVICES.SANP_URL,
  RTP_OVERVIEW_URL: ENV.SETTINGS.SERVICES.RTP_OVERVIEW_URL,
};

const ONE_DAY_MILLIS = 1000 * 60 * 60 * 24;

const RTP_SERVICE_STARTING_DATE = ENV.SETTINGS.SERVICES.RTP.SERVICE_STARTING_DATE.getTime();

const StatusChip = ({serviceInfo}: ({serviceInfo: ServiceInfo})) => {
  const { t } = useTranslation();
  const nowMillis = Date.now();
  const consolidatedConsentDate = new Date(serviceInfo.consentDate);
  consolidatedConsentDate.setHours(24, 0, 0, 0);
  const consolidatedConsentDateMillis = consolidatedConsentDate.getTime();
  const isAfterServiceStartDate = nowMillis > RTP_SERVICE_STARTING_DATE;
  // consent is considered consolidated after midnight of the day after it was given
  const isConsentConsolidated = nowMillis >= consolidatedConsentDateMillis;
  const isServiceEnabled = serviceInfo.consent === ConsentEnum.OPT_IN;
  // eslint-disable-next-line functional/no-let
  let chipLabel: string;
  // eslint-disable-next-line functional/no-let
  let chipColor: 'success' | 'warning' | 'secondary';
  // eslint-disable-next-line functional/no-let
  let hidden: boolean;
  if (isServiceEnabled) {
    if (isConsentConsolidated) {
      chipLabel = isAfterServiceStartDate
        ? t('serviceConsent.RTP.statuses.enabled')
        : t('serviceConsent.RTP.statuses.enabledFrom');
    } else {
      chipLabel = t('serviceConsent.RTP.statuses.enabling');
    }
    chipColor = isConsentConsolidated ? 'success' : 'secondary';
    hidden = false;
  } else {
    chipLabel = t('serviceConsent.RTP.statuses.disabling');
    chipColor = 'warning';
    hidden = isConsentConsolidated;
  }
  return hidden ? (
    <Box />
  ) : (
    <Chip label={chipLabel} size="small" color={chipColor} hidden={hidden} />
  );
};

const ServiceButton = ({ serviceInfo, onClick }: ({ serviceInfo: ServiceInfo; onClick: () => void })) => {
    const { t } = useTranslation();
    if (serviceInfo.consent === ConsentEnum.OPT_IN) {
        return (<Button variant="outlined" startIcon={<DoDisturbAltIcon />} color="error" onClick={onClick}>
            {t(`serviceConsent.${serviceInfo.serviceId}.disableButtonText`)}
        </Button>);
    } else {
        return (<Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={onClick}>
            {t(`serviceConsent.${serviceInfo.serviceId}.enableButtonText`)}
        </Button>);
    }

};

const ServiceStatusChangeModal = ({ serviceInfo, modalOpenFlag, onModalStateChange, onSaveServiceConsentResponse }: ({ serviceInfo: ServiceInfo; modalOpenFlag: boolean; onModalStateChange: (flag:boolean) => void; onSaveServiceConsentResponse: (s:ServiceConsentResponse) => void })) => {
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
                    onClick={() => onModalStateChange(false)}>
                    {t(`${translationRootKey}.cancelButton`)}
                </Button>
                {isServiceEnabled ?
                    <Button
                        data-testid="dialog-button-confirm-disabling"
                        variant="outlined"
                        color="error"
                        startIcon={<DoDisturbAltIcon />}
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
                        data-testid="dialog-button-confirm-enabling"
                        variant="contained"
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
            <Card variant="outlined" sx={{ border: 0, borderRadius: 0, p: 3, mb: 3 }}>
                <Box>
                    <StatusChip serviceInfo={serviceInfoState} />
                </Box>
                <Box>
                    <Typography variant="h4" mt={2}>{t(`serviceConsent.${serviceId}.title`)}</Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle1" fontWeight="regular" fontSize={16} my={1}>
                        {t(`${serviceTranslationRootKey}.description`)}
                    </Typography>
                </Box>

                <Grid container direction={"row"} mt={4} spacing={0}>
                    <ServiceButton serviceInfo={serviceInfoState} onClick={() => {
                        setShowConfirmationModal(true);
                    }
                    } />
                    <Trans
                        i18nKey={`${serviceTranslationRootKey}.moreInfo`}
                        components={{
                            sanp_url: (<Link href={(`${URLS.RTP_OVERVIEW_URL}`)} underline="hover" my={1} fontWeight="bold"
                                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, marginLeft: 5 }}>
                            </Link>),
                            icon: <LaunchIcon fontSize="small" />
                        }}
                    />
                </Grid>
            </Card>
            <ServiceStatusChangeModal 
            serviceInfo={serviceInfoState} 
            modalOpenFlag={showConfirmationModal}
            onModalStateChange={setShowConfirmationModal} 
            onSaveServiceConsentResponse={(serviceConsentResponse =>{
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