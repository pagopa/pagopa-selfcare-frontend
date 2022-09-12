import { useState } from 'react';
import { Box, Button, Card, Stack, ToggleButton, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = {
  generatePrimaryKey: boolean;
  generateSecondaryKey: boolean;
};
export default function HomePageCard({ generatePrimaryKey, generateSecondaryKey }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();

  const [showPrimaryKey, setShowPrimaryKey] = useState<boolean>(true);
  const [showSecondaryKey, setShowSecondaryKey] = useState<boolean>(true);

  const primaryKey = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
  const primaryKeyVisible = '000000234000001123400000007778';
  const secondaryKey = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
  const secondaryKeyVisible = '000000234000001123400000007778';

  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <Box mb={4}>
        <Typography sx={{ fontWeight: 'fontWeightMedium', fontSize: 'fontSize' }}>
          {t('homepage.apiPresent.primaryApiKey')}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={3} py={1}>
          <Box p={1} sx={{ border: '1px solid #BDBDBD', borderRadius: theme.spacing(0.5) }}>
            <Typography>{showPrimaryKey ? primaryKey : primaryKeyVisible}</Typography>
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

          <Button variant="contained">{t('homepage.apiPresent.useKeyBtn')}</Button>
          {generatePrimaryKey && (
            <Button variant="outlined" onClick={() => console.log('regeneratePrimaryKey')}>
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
          <Box p={1} sx={{ border: '1px solid #BDBDBD', borderRadius: theme.spacing(0.5) }}>
            <Typography>{showSecondaryKey ? secondaryKey : secondaryKeyVisible}</Typography>
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
          <Button variant="contained">{t('homepage.apiPresent.useKeyBtn')}</Button>
          {generateSecondaryKey && (
            <Button variant="outlined" onClick={() => console.log('regenerateSecondaryKey')}>
              {t('homepage.apiPresent.regeneratesBtn')}
            </Button>
          )}
        </Stack>
      </Box>
    </Card>
  );
}
