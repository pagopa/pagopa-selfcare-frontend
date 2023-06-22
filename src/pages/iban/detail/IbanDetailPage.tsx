// import { useTranslation } from 'react-i18next';
import { ArrowBack } from '@mui/icons-material';
import { Breadcrumbs, Divider, Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useHistory, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import ROUTES from '../../../routes';
import { StatusChip } from '../../../components/StatusChip';

const IbanDetailPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { ibanId } = useParams<{ ibanId: string }>();
  const goBack = () => history.push(ROUTES.IBAN);

  return (
    <Grid container justifyContent={'center'}>
      <Grid item p={3} xs={8}>
        <Stack direction="row">
          <ButtonNaked
            size="small"
            component="button"
            onClick={goBack}
            startIcon={<ArrowBack />}
            sx={{ color: 'primary.main', mr: '20px' }}
            weight="default"
          >
            {t('general.exit')}
          </ButtonNaked>
          <Breadcrumbs>
            <Typography>{t('general.Iban')}</Typography>
            <Typography color={'text.disaled'}>{ibanId}</Typography>
          </Breadcrumbs>
        </Stack>
        <Grid container mt={3}>
          <Grid item xs={6}>
            <TitleBox title={ibanId} mbTitle={2} variantTitle="h4" variantSubTitle="body1" />
            <Typography mb={5}>
              {t('ibanDetailPage.createdOn')}{' '}
              <Typography component={'span'} fontWeight={'fontWeightMedium'}>
                02/02/2023
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            {/* <DetailButtons  /> */}
          </Grid>
        </Grid>

        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            p: 4,
          }}
        >
          <Grid container alignItems={'center'} spacing={0} mb={2}>
            <Grid item xs={3}>
              <Typography variant="subtitle2">{t('ibanDetailPage.state')}</Typography>
            </Grid>
            <Grid item xs={9} textAlign="right">
              <StatusChip status={'APPROVED'} />
            </Grid>
          </Grid>
          <Typography variant="h6" mb={3}>
            {t('ibanDetailPage.ibanConfiguration')}
          </Typography>
          <Divider></Divider>

          <Box mt={5}>Dettagli {ibanId}</Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default IbanDetailPage;
