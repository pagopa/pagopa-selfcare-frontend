import { useState } from 'react';
import { Box, Button, Card, Stack, ToggleButton, Typography, useTheme } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { VisibilityOff } from '@mui/icons-material';
import { Trans, useTranslation } from 'react-i18next';
import {
  SessionModal,
  useErrorDispatcher,
  useLoading,
  useUserNotify,
} from '@pagopa/selfcare-common-frontend';
import { Party } from '../../model/Party';
import { ProductKeys } from '../../model/ApiKey';
import {
  getInstitutionApiKeys,
  regeneratePrimaryKey,
  regenerateSecondaryKey,
} from '../../services/apiKeyService';

type Props = {
  selectedParty?: Party;
  apiKey: ProductKeys;
};
export default function ApiKeysCard({ selectedParty, apiKey }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();

  const [showPrimaryKey, setShowPrimaryKey] = useState<boolean>(true);
  const [showSecondaryKey, setShowSecondaryKey] = useState<boolean>(true);
  const [showPrimaryRegenModal, setShowPrimaryRegenModal] = useState<boolean>(false);
  const [showSecondaryRegenModal, setShowSecondaryRegenModal] = useState<boolean>(false);
  const hideValue = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

  const [primaryKey, setPrimaryKey] = useState<string>(apiKey.primaryKey);

  const [secondaryKey, setSecondaryKey] = useState<string>(apiKey.secondaryKey);

  const addNotify = useUserNotify();
  const addError = useErrorDispatcher();
  const setLoading = useLoading('KEY_REGEN');

  const copyPrimaryKey = () =>
    navigator.clipboard.writeText(primaryKey).then(
      () => {
        addNotify({
          id: 'ACTION_ON_COPY_PRIMARY_KEY',
          title: '',
          message: t('apiKeysPage.apiPresent.copyPrimaryKeyLabel'),
          component: 'Toast',
        });
      },
      (reason) => {
        addError({
          component: 'Toast',
          id: 'ACTION_ON_COPY_PRIMARY_KEY',
          displayableTitle: t('apiKeysPage.apiPresent.errorCopyPrimaryKeyLabel'),
          techDescription: `C'è stato un errore durante la copia della chiave primaria`,
          blocking: false,
          error: reason,
          toNotify: true,
          displayableDescription: '',
        });
      }
    );
  const copySecondaryKey = () =>
    navigator.clipboard.writeText(secondaryKey).then(
      () => {
        addNotify({
          id: 'ACTION_ON_COPY_SECONDARY_KEY',
          title: '',
          message: t('apiKeysPage.apiPresent.copySecondaryKeyLabel'),
          component: 'Toast',
        });
      },
      (reason) => {
        addError({
          component: 'Toast',
          id: 'ACTION_ON_COPY_SECONDARY_KEY',
          displayableTitle: t('apiKeysPage.apiPresent.errorCopySecondaryKeyLabel'),
          techDescription: `C'è stato un errore durante la copia della chiave secondaria`,
          blocking: false,
          error: reason,
          toNotify: true,
          displayableDescription: '',
        });
      }
    );

  const regenPrimaryKey = () => {
    setShowPrimaryRegenModal(false);
    if (selectedParty) {
      setLoading(true);
      regeneratePrimaryKey(apiKey.id)
        .then(
          () => {
            void getInstitutionApiKeys(selectedParty.partyId).then((data) =>
              setPrimaryKey((data.find((d) => d.id === apiKey.id) as ProductKeys).primaryKey)
            );
            addNotify({
              id: 'ACTION_ON_REGENERATE_PRIMARY_KEY',
              title: '',
              message: t('apiKeysPage.apiPresent.regeneratePrimaryKey'),
              component: 'Toast',
            });
          },
          (reason) => {
            addError({
              component: 'Toast',
              id: 'ACTION_ON_REGENERATE_PRIMARY_KEY',
              displayableTitle: t('apiKeysPage.apiPresent.errorRegeneratePrimaryKey'),
              techDescription: `C'è stato un errore durante la rigenerazione della chiave primaria`,
              blocking: false,
              error: reason,
              toNotify: true,
              displayableDescription: '',
            });
          }
        )
        .finally(() => setLoading(false));
    }
  };
  const regenSecondaryKey = () => {
    setShowSecondaryRegenModal(false);
    if (selectedParty) {
      setLoading(true);
      regenerateSecondaryKey(apiKey.id)
        .then(
          () => {
            void getInstitutionApiKeys(selectedParty.partyId).then((data) =>
              setSecondaryKey((data.find((d) => d.id === apiKey.id) as ProductKeys).secondaryKey)
            );
            addNotify({
              id: 'ACTION_ON_REGENERATE_SECONDARY_KEY',
              title: '',
              message: t('apiKeysPage.apiPresent.regenerateSecondaryKey'),
              component: 'Toast',
            });
          },
          (reason) => {
            addError({
              component: 'Toast',
              id: 'ACTION_ON_REGENERATE_PRIMARY_KEY',
              displayableTitle: t('apiKeysPage.apiPresent.errorRegenerateSecondaryKey'),
              techDescription: `C'è stato un errore durante la rigenerazione della chiave secondaria`,
              blocking: false,
              error: reason,
              toNotify: true,
              displayableDescription: '',
            });
          }
        )
        .finally(() => setLoading(false));
    }
  };

  const boxStyle = {
    border: '1px solid #BDBDBD',
    borderRadius: theme.spacing(0.5),
    minWidth: '380px',
  };
  return (
    <>
      <Card variant="outlined" sx={{ p: 3, mb: 1 }}>
        <Box mb={2}>
          <Typography variant="h6">{apiKey.displayName}</Typography>
        </Box>
        <Box mb={2}>
          <Typography sx={{ fontWeight: 'fontWeightMedium', fontSize: 'fontSize' }}>
            {t('apiKeysPage.apiPresent.primaryApiKey')}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={3} py={1}>
            <Box p={1} sx={boxStyle}>
              <Typography>{showPrimaryKey ? hideValue : primaryKey}</Typography>
            </Box>
            <ToggleButton
              sx={{ border: 'none !important' }}
              value="check"
              selected={showPrimaryKey}
              onChange={() => {
                setShowPrimaryKey(!showPrimaryKey);
              }}
            >
              {showPrimaryKey ? (
                <VisibilityIcon color="primary" sx={{ border: 'none!important' }} />
              ) : (
                <VisibilityOff color="primary" sx={{ border: 'none!important' }} />
              )}
            </ToggleButton>

            <Button variant="contained" onClick={copyPrimaryKey}>
              {t('apiKeysPage.apiPresent.useKeyBtn')}
            </Button>
            <Button variant="outlined" onClick={() => setShowPrimaryRegenModal(true)}>
              {t('apiKeysPage.apiPresent.regeneratesBtn')}
            </Button>
          </Stack>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 'fontWeightMedium', fontSize: 'fontSize' }}>
            {t('apiKeysPage.apiPresent.secondaryApiKey')}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={3} py={1}>
            <Box p={1} sx={boxStyle}>
              <Typography>{showSecondaryKey ? hideValue : secondaryKey}</Typography>
            </Box>
            <ToggleButton
              sx={{ border: 'none !important' }}
              value="check"
              selected={showSecondaryKey}
              onChange={() => {
                setShowSecondaryKey(!showSecondaryKey);
              }}
            >
              {showSecondaryKey ? (
                <VisibilityIcon color="primary" sx={{ border: 'none!important' }} />
              ) : (
                <VisibilityOff color="primary" sx={{ border: 'none!important' }} />
              )}
            </ToggleButton>
            <Button variant="contained" onClick={copySecondaryKey}>
              {t('apiKeysPage.apiPresent.useKeyBtn')}
            </Button>

            <Button variant="outlined" onClick={() => setShowSecondaryRegenModal(true)}>
              {t('apiKeysPage.apiPresent.regeneratesBtn')}
            </Button>
          </Stack>
        </Box>
      </Card>

      <SessionModal
        open={showPrimaryRegenModal}
        title={t('apiKeysPage.regenerateModal.title')}
        message={
          <Trans i18nKey="apiKeysPage.regenerateModal.message">
            Se rigeneri, disattivi la API Key esistente e ne generi una nuova, con gli stessi
            attributi.
            <br />
            <br />
            Dopo che hai inserito la nuova API Key nella piattaforma dell’ente, blocca ed elimina la
            versione precedente.
          </Trans>
        }
        onConfirmLabel={t('apiKeysPage.regenerateModal.confirmButton')}
        onCloseLabel={t('apiKeysPage.regenerateModal.cancelButton')}
        onConfirm={regenPrimaryKey}
        handleClose={() => {
          setShowPrimaryRegenModal(false);
        }}
      />
      <SessionModal
        open={showSecondaryRegenModal}
        title={t('apiKeysPage.regenerateModal.title')}
        message={
          <Trans i18nKey="apiKeysPage.regenerateModal.message">
            Se rigeneri, disattivi la API Key esistente e ne generi una nuova, con gli stessi
            attributi.
            <br />
            <br />
            Dopo che hai inserito la nuova API Key nella piattaforma dell’ente, blocca ed elimina la
            versione precedente.
          </Trans>
        }
        onConfirmLabel={t('apiKeysPage.regenerateModal.confirmButton')}
        onCloseLabel={t('apiKeysPage.regenerateModal.cancelButton')}
        onConfirm={regenSecondaryKey}
        handleClose={() => {
          setShowSecondaryRegenModal(false);
        }}
      />
    </>
  );
}
