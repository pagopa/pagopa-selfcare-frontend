import { CallMade } from '@mui/icons-material';
import { Button, Card, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import ROUTES from '../../../routes';

const OperativeTable = () => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <Grid item xs={6}>
      <Card variant="outlined" sx={{ border: 0, borderRadius: 0, p: 3, mb: 1 }}>
        <Box mb={3}>
          <Typography variant="h6">{t('dashboardPage.operationTable.title')}</Typography>
        </Box>
        <Grid container spacing={3} pb={4}>
          <Grid item xs={4}>
            <Typography variant="body2">{t('dashboardPage.operationTable.mail')}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2" fontWeight={'fontWeightMedium'}>
              {/* TODO: get from service */}
              marco.rossi@regionelombardia.it
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2">{t('dashboardPage.operationTable.phone')}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2" fontWeight={'fontWeightMedium'}>
              {/* TODO: get from service */}
              080 0000000
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              endIcon={<CallMade />}
              onClick={() => history.push(ROUTES.OPERATION_TABLE_ADDEDIT)}
            >
              {t('general.manage')}
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

export default OperativeTable;
