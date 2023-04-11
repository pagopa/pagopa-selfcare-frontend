import { Add, Search as SearchIcon } from '@mui/icons-material';
import { Button, InputAdornment, Link, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation, Trans } from 'react-i18next';
import { generatePath, Link as RouterLink } from 'react-router-dom';
import ROUTES from '../../../routes';

type ChannelPSPTableEmptyProps = { channelId: string };

const ChannelPSPTableEmpty = ({ channelId }: ChannelPSPTableEmptyProps) => {
  const { t } = useTranslation();
  return (
    <>
      <Box width="100%" display="flex">
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="disabled" />
              </InputAdornment>
            ),
            sx: { height: 48, backgroundColor: '#FFFFFF' },
          }}
          fullWidth
          placeholder={t('channelPSPList.searchPlaceholder')}
        />

        <Button
          component={RouterLink}
          to={generatePath(ROUTES.CHANNEL_ASSOCIATE_PSP, {
            channelId,
          })}
          variant="contained"
          sx={{ ml: 1, whiteSpace: 'nowrap', minWidth: 'auto' }}
          startIcon={<Add />}
        >
          {t('channelPSPList.associatePspButtonLabel')}
        </Button>
      </Box>
      <Box p={3} mt={3} sx={{ backgroundColor: '#EEEEEE' }}>
        <Box p={2} sx={{ textAlign: 'center', backgroundColor: '#FFFFFF' }}>
          <Typography variant="body2">
            <Trans i18nKey="channelPSPList.noResults">
              Non sono ancora presenti PSP associati a questo canale.
              <Link
                component={RouterLink}
                sx={{
                  color: 'primary.main',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  whiteSpace: 'pre',
                }}
                to={generatePath(ROUTES.CHANNEL_ASSOCIATE_PSP, {
                  channelId,
                })}
              >
                <strong> Associa PSP</strong>
              </Link>
            </Trans>
          </Typography>
        </Box>
      </Box>
    </>
  );
};
export default ChannelPSPTableEmpty;
