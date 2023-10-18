import { Breadcrumbs, Divider, Box, Grid, Paper, Stack, Typography, Chip } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useHistory, useParams } from 'react-router';
import { Trans, useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { handleErrors } from '@pagopa/selfcare-common-frontend/services/errorService';
import { ArrowBack } from '@mui/icons-material';
import ROUTES from '../../../routes';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';

const OperationTableListPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const goBack = () => history.push(ROUTES.HOME);
  const { ibanId } = useParams<{ ibanId: string }>();
  /* 
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

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
            <Typography>{t('general.operationTable')}</Typography>
          </Breadcrumbs>
        </Stack>
        <Grid container mt={3}>
          <Grid item xs={6}>
            <TitleBox title={ibanId} mbTitle={2} variantTitle="h4" variantSubTitle="body1" />
            <Typography mb={5}>sottotitolo</Typography>
          </Grid>
          <Grid item xs={6}></Grid>
        </Grid>

        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            p: 4,
            mb: 3,
          }}
        ></Paper>
      </Grid>
    </Grid>
  );
  */
  return <>{'OperationTableListPage'}</>;
};

export default OperationTableListPage;
