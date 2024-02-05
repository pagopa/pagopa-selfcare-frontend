import { Box, Button, InputAdornment, TextField } from '@mui/material';
import { GridSearchIcon } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { Link, generatePath } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import ROUTES from '../../../routes';
import { isOperator } from '../../components/commonFunctions';

type Props = {
  channelId: string;
  pspNameInput: string;
  setPspNameInput: (pspName: string) => void;
};

export default function ChannelPSPTableSearchBar({ channelId, pspNameInput, setPspNameInput }: Props) {
  const { t } = useTranslation();
  const operator = isOperator();

  return (
    <Box width="100%" display="flex">
      <TextField
        key="fixed"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <GridSearchIcon color="disabled" />
            </InputAdornment>
          ),
          sx: { height: 48 },
        }}
        value={pspNameInput}
        onChange={(event) => setPspNameInput(event.target.value)}
        fullWidth
        placeholder={t('channelPSPList.searchPlaceholder')}
      />
      <Button
        component={Link}
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
  );
}
