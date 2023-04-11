import { Grid, Card, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';

const OperativeTable = () => {
  const { t } = useTranslation();

  return (
    <Grid item xs={6}>
      <Card variant="outlined" sx={{ border: 0, borderRadius: 0, p: 3, mb: 1 }}>
        <Box mb={3}>
          <Typography variant="h6">{t('dashboardPage.operativeTable.title')}</Typography>
        </Box>
        <Grid container spacing={3} pb={4}>
          <Grid item xs={4}>
            <Typography variant="body2">
              {t('dashboardPage.operativeTable.paymentReferrer')}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2" fontWeight={600}>
              Marco Rossi
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2">{t('dashboardPage.operativeTable.mail')}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2" fontWeight={600}>
              marco.rossi@regionelombardia.it
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2">{t('dashboardPage.operativeTable.deliveryOne')}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2" fontWeight={600}>
              080 0000000
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2">{t('dashboardPage.operativeTable.deliveryTwo')}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2" fontWeight={600}>
              080 0000000
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

export default OperativeTable;
