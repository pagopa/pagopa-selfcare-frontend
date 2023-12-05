import { CallMade } from '@mui/icons-material';
import { Alert, Button, Card, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ROUTES from '../../../routes';
import { getOperationTableDetails } from '../../../services/operationTable';
import { TavoloOpResource } from '../../../api/generated/portal/TavoloOpResource';

type Props = {
  ecCode: string;
};

const OperationTable = ({ ecCode }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [operationTable, setOperationTable] = useState<TavoloOpResource>();

  useEffect(() => {
    getOperationTableDetails(ecCode)
      .then((response) => {
        setOperationTable(response);
      })
      .catch((error) => {
        
      });
  }, [ecCode]);

  return (
    <Grid item xs={6}>
      <Card variant="outlined" sx={{ border: 0, borderRadius: 0, p: 3, mb: 1 }}>
        <Box mb={3}>
          <Typography variant="h6">{t('dashboardPage.operationTable.title')}</Typography>
        </Box>
        <Grid container spacing={3} pb={4}>
          <Grid item xs={3}>
            <Typography variant="body2">{t('dashboardPage.operationTable.mail')}</Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="body2" fontWeight={'fontWeightMedium'}>
              {operationTable?.email ?? '-'}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2">{t('dashboardPage.operationTable.phone')}</Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="body2" fontWeight={'fontWeightMedium'}>
              {operationTable?.telephone ?? '-'}
            </Typography>
          </Grid>
          {!operationTable && (
            <Grid item xs={12}>
              <Alert severity="warning">
                {t(`dashboardPage.operationTable.completeDataAlert`)}
              </Alert>
            </Grid>
          )}
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

export default OperationTable;
