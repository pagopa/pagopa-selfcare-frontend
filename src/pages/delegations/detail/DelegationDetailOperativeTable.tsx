import {Paper, Typography} from '@mui/material';
import {Box} from '@mui/system';
import {useTranslation} from 'react-i18next';
import {TavoloOpResource} from '../../../api/generated/portal/TavoloOpResource';

export default function DelegationDetailOperativeTable({
                                                           operativeTable,
                                                       }: Readonly<{ operativeTable: TavoloOpResource | undefined }>) {
    const {t} = useTranslation();

    return (
        <Paper
            elevation={3}
            sx={{
                borderRadius: 2,
                padding: 3,
                minHeight: '310px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Typography variant="overline">{t('delegationDetailPage.operativeTable.title')}</Typography>

            <Box mt={1} data-testid="operative-table-column">
                <Box mt={1}>
                    <Typography variant="body1" color="action.active">
                        {t('delegationDetailPage.operativeTable.email')}
                    </Typography>
                    <Typography variant="body1" fontWeight={'fontWeightMedium'}>
                        {operativeTable?.email ?? '-'}
                    </Typography>
                </Box>

                <Box mt={1}>
                    <Typography variant="body1" color="action.active">
                        {t('delegationDetailPage.operativeTable.phone')}
                    </Typography>
                    <Typography variant="body1" fontWeight={'fontWeightMedium'}>
                        {operativeTable?.telephone ?? '-'}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
}
