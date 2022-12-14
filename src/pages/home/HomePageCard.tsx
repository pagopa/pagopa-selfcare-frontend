import { useState } from 'react';
import { Box, Button, Card, Stack, ToggleButton, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useErrorDispatcher, useUserNotify } from '@pagopa/selfcare-common-frontend';
import { Party } from '../../model/Party';

type Props = {
  selectedParty?: Party;
  primaryKey: string;
  secondaryKey: string;
  regenPrimaryKey: () => void;
  regenSecondaryKey: () => void;
};
export default function HomePageCard({
  primaryKey,
  secondaryKey,
  regenPrimaryKey,
  regenSecondaryKey,
}: Props) {
  const theme = useTheme();
  const { t } = useTranslation();

  const [showPrimaryKey, setShowPrimaryKey] = useState<boolean>(true);
  const [showSecondaryKey, setShowSecondaryKey] = useState<boolean>(true);

  const addNotify = useUserNotify();
  const addError = useErrorDispatcher();

  const copyPrimaryKey = () =>
    navigator.clipboard.writeText(primaryKey).then(
      () => {
        addNotify({
          id: 'ACTION_ON_COPY_PRIMARY_KEY',
          title: '',
          message: t('homepage.apiPresent.copyPrimaryKeyLabel'),
          component: 'Toast',
        });
      },
      (reason) => {
        addError({
          component: 'Toast',
          id: 'ACTION_ON_COPY_PRIMARY_KEY',
          displayableTitle: t('homepage.apiPresent.errorCopyPrimaryKeyLabel'),
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
          message: t('homepage.apiPresent.copySecondaryKeyLabel'),
          component: 'Toast',
        });
      },
      (reason) => {
        addError({
          component: 'Toast',
          id: 'ACTION_ON_COPY_SECONDARY_KEY',
          displayableTitle: t('homepage.apiPresent.errorCopySecondaryKeyLabel'),
          techDescription: `C'è stato un errore durante la copia della chiave secondaria`,
          blocking: false,
          error: reason,
          toNotify: true,
          displayableDescription: '',
        });
      }
    );
  const hideValue = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

  const boxStyle = {
    border: '1px solid #BDBDBD',
    borderRadius: theme.spacing(0.5),
    minWidth: '380px',
  };
  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <Box mb={4}>
        <Typography sx={{ fontWeight: 'fontWeightMedium', fontSize: 'fontSize' }}>
          {t('homepage.apiPresent.primaryApiKey')}
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
            {t('homepage.apiPresent.useKeyBtn')}
          </Button>
          <Button variant="outlined" onClick={regenPrimaryKey}>
            {t('homepage.apiPresent.regeneratesBtn')}
          </Button>
        </Stack>
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 'fontWeightMedium', fontSize: 'fontSize' }}>
          {t('homepage.apiPresent.secondaryApiKey')}
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
            {t('homepage.apiPresent.useKeyBtn')}
          </Button>

          <Button variant="outlined" onClick={regenSecondaryKey}>
            {t('homepage.apiPresent.regeneratesBtn')}
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}
