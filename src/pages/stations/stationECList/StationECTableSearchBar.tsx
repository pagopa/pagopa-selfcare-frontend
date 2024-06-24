import {Box, Button, InputAdornment, TextField} from '@mui/material';
import {GridSearchIcon} from '@mui/x-data-grid';
import {useTranslation} from 'react-i18next';
import {generatePath, Link} from 'react-router-dom';
import {Add} from '@mui/icons-material';
import ROUTES from '../../../routes';

type Props = {
    stationId: string;
    ciNameOrFiscalCodeInput: string;
    setCiNameInput: (ciName: string) => void;
};

export default function StationECTableSearchBar({stationId, ciNameOrFiscalCodeInput, setCiNameInput}: Props) {
    const {t} = useTranslation();

    return (
        <Box width="100%" display="flex">
            <TextField
                key="fixed"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <GridSearchIcon color="disabled"/>
                        </InputAdornment>
                    ),
                    sx: {height: 48},
                }}
                value={ciNameOrFiscalCodeInput}
                onChange={(event) => setCiNameInput(event.target.value)}
                fullWidth
                placeholder={t('stationECList.searchPlaceholder')}
            />
            <Button
                component={Link}
                to={generatePath(ROUTES.STATION_ASSOCIATE_EC, {
                    stationId,
                })}
                variant="contained"
                sx={{ml: 1, whiteSpace: 'nowrap', minWidth: 'auto'}}
                startIcon={<Add/>}
            >
                {t('stationECList.associateEcButtonLabel')}
            </Button>
        </Box>
    );
}
