import { Box, Button, InputAdornment, TextField } from '@mui/material';
import { GridSearchIcon } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ROUTES from '../../../routes';
import { isOperator } from '../../components/commonFunctions';

type Props = {
  stationCodeInput: string;
  setStationCodeInput: (stationCode: string) => void;
};

export default function StationsTableSearchBar({ stationCodeInput, setStationCodeInput }: Props) {
  const { t } = useTranslation();
  const operator = isOperator();

  return (
    <Box width="100%" display="flex" sx={{ mt: 1 }}>
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
        value={stationCodeInput}
        onChange={(event) => {
            console.log("onchange search bar", event);
            setStationCodeInput(event.target.value);}}
        fullWidth
        placeholder={t('stationsPage.searchPlaceholder')}
      />
      <Button
        component={Link}
        to={ROUTES.STATION_ADD}
        variant="contained"
        sx={{ ml: 1, whiteSpace: 'nowrap', minWidth: 'auto' }}
        disabled={operator}
      >
        {t('stationsPage.createStationButtonLabel')}
      </Button>
    </Box>
  );
}
