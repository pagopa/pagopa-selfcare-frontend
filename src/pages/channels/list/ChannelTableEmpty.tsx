import { Link, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Trans } from 'react-i18next';
import { generatePath, Link as RouterLink } from 'react-router-dom';
import ROUTES from '../../../routes';

const ChannelTableEmpty = () => (
    <>
        <Box p={3} mt={3} sx={{ backgroundColor: '#EEEEEE' }}>
            <Box p={2} sx={{ textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                <Typography variant="body2">
                    <Trans i18nKey="channelsPage.table.noChannels">
                        Non sono ancora presenti canali in questo ambiente.
                        <Link
                            component={RouterLink}
                            sx={{
                                color: 'primary.main',
                                cursor: 'pointer',
                                textDecoration: 'none',
                                whiteSpace: 'pre',
                            }}
                            to={generatePath(ROUTES.CHANNEL_ADD)}
                        >
                            <strong> Crea Canale</strong>
                        </Link>
                    </Trans>
                </Typography>
            </Box>
        </Box>
    </>
);

export default ChannelTableEmpty;
