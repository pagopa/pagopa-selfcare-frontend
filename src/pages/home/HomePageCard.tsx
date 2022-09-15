import { useState } from 'react';
import { Box, Button, Card, Stack, ToggleButton, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useErrorDispatcher, useUserNotify } from '@pagopa/selfcare-common-frontend';

type Props = {
  generatePrimaryKey: boolean;
  generateSecondaryKey: boolean;
};
export default function HomePageCard({ generatePrimaryKey, generateSecondaryKey }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();

  const [showPrimaryKey, setShowPrimaryKey] = useState<boolean>(true);
  const [showSecondaryKey, setShowSecondaryKey] = useState<boolean>(true);
  const addNotify = useUserNotify();
  const addError = useErrorDispatcher();

  const copyPrimaryKey = () =>
    navigator.clipboard.writeText(primaryKeyVisible).then(
      () => {
        addNotify({
          id: 'ACTION_ON_COPY_PRIMARY_KEY',
          title: t('homepage.apiPresent.copyPrimaryKeyLabel'),
          message: undefined,
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
    navigator.clipboard.writeText(secondaryKeyVisible).then(
      () => {
        addNotify({
          id: 'ACTION_ON_COPY_SECONDARY_KEY',
          title: t('homepage.apiPresent.copySecondaryKeyLabel'),
          message: undefined,
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
  const primaryKeyVisible = '000000234000001123400000007778';
  const secondaryKeyVisible = '000000234000001123400000004589';

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
            <Typography>{showPrimaryKey ? hideValue : primaryKeyVisible}</Typography>
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
          {generatePrimaryKey && (
            <Button
              variant="outlined"
              // onClick={} TODO: add onclick with SELC-1538
            >
              {t('homepage.apiPresent.regeneratesBtn')}
            </Button>
          )}
        </Stack>
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 'fontWeightMedium', fontSize: 'fontSize' }}>
          {t('homepage.apiPresent.secondaryApiKey')}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={3} py={1}>
          <Box p={1} sx={boxStyle}>
            <Typography>{showSecondaryKey ? hideValue : secondaryKeyVisible}</Typography>
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
          {generateSecondaryKey && (
            <Button
              variant="outlined"
              // onClick={} TODO: add onclick with SELC-1538
            >
              {t('homepage.apiPresent.regeneratesBtn')}
            </Button>
          )}
        </Stack>
      </Box>
    </Card>
  );
}
