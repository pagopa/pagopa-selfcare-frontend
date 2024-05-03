import {Box, Button, InputAdornment, TextField} from '@mui/material';
import {GridSearchIcon} from '@mui/x-data-grid';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import ROUTES from '../../../routes';
import {useUserRole} from "../../../hooks/useUserRole";

type Props = {
    channelCodeInput: string;
    setChannelCodeInput: (stationCode: string) => void;
};

export default function ChannelsTableSearchBar({channelCodeInput, setChannelCodeInput}: Props) {
    const {t} = useTranslation();
    const {userIsPagopaOperator} = useUserRole();

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
                value={channelCodeInput}
                onChange={(event) => setChannelCodeInput(event.target.value)}
                fullWidth
                placeholder={t('channelsPage.searchPlaceholder')}
            />
            <Button
                component={Link}
                to={ROUTES.CHANNEL_ADD}
                variant="contained"
                sx={{ml: 1, whiteSpace: 'nowrap', minWidth: 'auto'}}
                disabled={userIsPagopaOperator}
            >
                {t('channelsPage.createChannelButtonLabel')}
            </Button>
        </Box>
    );
}
