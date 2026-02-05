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

const GetStatusChip = (serviceInfo: ServiceInfo) => {
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

const GetServiceButton = (
  serviceInfo: ServiceInfo,
  showDisableModalStateAction: Dispatch<SetStateAction<boolean>>,
  showEnableModalStateAction: Dispatch<SetStateAction<boolean>>
) => {
  const { t } = useTranslation();
  if (serviceInfo.consent === ConsentEnum.OPT_IN) {
    return (
      <Button
        data-testid={`settingCard-${serviceInfo.serviceId}-disableButton`}
        variant="outlined"
        startIcon={<DoDisturbAltIcon />}
        color="error"
        onClick={() => showDisableModalStateAction(true)}
      >
        {t(`serviceConsent.${serviceInfo.serviceId}.disableButtonText`)}
      </Button>
    );
  } else {
    return (
      <Button
        data-testid={`settingCard-${serviceInfo.serviceId}-enableButton`}
        variant="contained"
        endIcon={<ArrowForwardIcon />}
        onClick={() => showEnableModalStateAction(true)}
      >
        {t(`serviceConsent.${serviceInfo.serviceId}.enableButtonText`)}
      </Button>
    );
  }
};
const ServiceStatusChangeModal = (
  serviceId: string,
  modalOpenFlag: boolean,
  setModalOpenFlag: Dispatch<SetStateAction<boolean>>,
  showEnableService: boolean,
  setServiceInfoState: Dispatch<SetStateAction<ServiceInfo>>
) => {
  const { t } = useTranslation();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const translationRootKey = `serviceConsent.${serviceId}.popups.${showEnableService ? 'enableService' : 'disableService'}`;
  const setLoading = useLoading('PUT_CONSENT');
  const addError = useErrorDispatcher();
  return (
    <Dialog
      open={modalOpenFlag}
      onClose={() => setModalOpenFlag(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      data-testid={`settingCard-${serviceId}-dialog`}
    >
      <DialogTitle fontWeight={'bold'}>
        {t(`${translationRootKey}.title`)}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography>
            <Trans
              i18nKey={`${translationRootKey}.message`}
              components={{
                sanp_url: <Link href={`${URLS.SANP_URL}`} />,
              }}
            />
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          marginRight: 3,
          marginBottom: 2,
        }}
      >
        <Button
          data-testid={`settingCard-${serviceId}-dialog-cancelButton`}
          variant="outlined"
          sx={{
            marginRight: 1,
          }}
          onClick={() => setModalOpenFlag(false)}
        >
          {t(`${translationRootKey}.cancelButton`)}
        </Button>
        {showEnableService ? (
          <Button
            data-testid={`settingCard-${serviceId}-dialog-enableButton`}
            variant="contained"
            onClick={() => {
              setLoading(true);
              saveServiceConsent(selectedParty?.partyId || '', serviceId, ConsentEnum.OPT_IN)
                .then((data) => {
                  SetServiceInfoState(setServiceInfoState, data, serviceId);
                  setModalOpenFlag(false);
                })
                .catch((error) => addError({
                  id: 'SAVE_SERVICE_CONSENT_OPT_IN',
                  blocking: false,
                  error,
                  techDescription: `An error occurred while saving service consent`,
                  toNotify: true,
                  displayableTitle: t('serviceConsent.errorTitle'),
                  displayableDescription: t('serviceConsent.errorDescription'),
                  component: 'Toast',
                }))
                .finally(() => setLoading(false));
            }}
          >
            {t(`${translationRootKey}.confirmButton`)}
          </Button>
        ) : (
          <Button
            data-testid={`settingCard-${serviceId}-dialog-disableButton`}
            variant="outlined"
            color="error"
            startIcon={<DoDisturbAltIcon />}
            onClick={() => {
              setLoading(true);
              saveServiceConsent(selectedParty?.partyId || '', serviceId, ConsentEnum.OPT_OUT)
                .then((data) => {
                  SetServiceInfoState(setServiceInfoState, data, serviceId);
                  setModalOpenFlag(false);
                })
                .catch((error) => addError({
                  id: 'SAVE_SERVICE_CONSENT_OPT_OUT',
                  blocking: false,
                  error,
                  techDescription: `An error occurred while saving service consent`,
                  toNotify: true,
                  displayableTitle: t('serviceConsent.errorTitle'),
                  displayableDescription: t('serviceConsent.errorDescription'),
                  component: 'Toast',
                }))
                .finally(() => setLoading(false));
            }}
          >
            {t(`${translationRootKey}.confirmButton`)}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

const SetServiceInfoState = (
  setServiceInfoState: Dispatch<SetStateAction<ServiceInfo>>,
  data: ServiceConsentResponse,
  serviceId: string
) => {
  setServiceInfoState({
    consent: data.consent,
    consentDate: data.date,
    serviceId,
  });
};

const ServiceSettingsCard = (serviceInfo: ServiceInfo) => {

  const { t } = useTranslation();
  const [serviceInfoState, setServiceInfoState] = useState<ServiceInfo>(serviceInfo);
  const serviceId = serviceInfoState.serviceId;
  const [showEnableServiceModal, setShowEnableServiceModal] = useState<boolean>(false);
  const [showDisableServiceModal, setShowDisableServiceModal] = useState<boolean>(false);
  const serviceTranslationRootKey = `serviceConsent.${serviceId}`;

  return (
    <Box>
      <Card variant="outlined" sx={{ border: 0, borderRadius: 0, p: 3, mb: 3 }}>
        <Box data-testid={`settingCard-${serviceId}-statusChip`} >
          {GetStatusChip(serviceInfoState)}
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
          {GetServiceButton(serviceInfoState, setShowDisableServiceModal, setShowEnableServiceModal)}
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
      {ServiceStatusChangeModal(serviceInfoState.serviceId, showDisableServiceModal, setShowDisableServiceModal, false, setServiceInfoState)}
      {ServiceStatusChangeModal(serviceInfoState.serviceId, showEnableServiceModal, setShowEnableServiceModal, true, setServiceInfoState)}
    </Box>
  );
};

export default ServiceSettingsCard;