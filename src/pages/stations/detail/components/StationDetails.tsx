import { ArrowBack, ManageAccounts, VisibilityOff } from '@mui/icons-material';
import { Grid, Stack, Breadcrumbs, Typography, Paper, Divider, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link, generatePath, useParams } from 'react-router-dom';
import {
  StationDetailResource,
  WrapperStatusEnum,
} from '../../../../api/generated/portal/StationDetailResource';
import ROUTES from '../../../../routes';
import { StatusChip } from '../../../../components/StatusChip';
import DetailButtonsStation from './DetailButtonsStation';

type Prop = {
  stationDetail?: StationDetailResource;
  goBack: () => void;
  ecAssociatedNumber: number;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const StationDetails = ({ stationDetail, goBack, ecAssociatedNumber }: Prop) => {
  const { t } = useTranslation();
  const { stationId } = useParams<{ stationId: string }>();

  const endpoint =
    stationDetail?.targetHost === undefined || stationDetail?.targetHost === ''
      ? '-'
      : `${stationDetail?.targetHost === undefined ? '-' : stationDetail?.targetHost}${
          stationDetail?.targetPort && stationDetail?.targetPort > 0
            ? `:${stationDetail.targetPort}`
            : ''
        }${stationDetail?.targetPath}`;

  return (
    <Grid container justifyContent={'center'} mb={5}>
      <Grid item p={3} xs={8}>
        <Stack direction="row" mt={2}>
          <ButtonNaked
            size="small"
            component="button"
            onClick={() => goBack()}
            startIcon={<ArrowBack />}
            sx={{ color: 'primary.main', mr: '20px' }}
            weight="default"
            data-testid="exit-btn-test"
          >
            {t('general.exit')}
          </ButtonNaked>
          <Breadcrumbs>
            <Typography>{t('general.Stations')}</Typography>
            <Typography variant="body2" color={'#17324D'} sx={{ fontWeight: 'fontWeightMedium' }}>
              {t('stationDetailPage.detail', {
                code: stationId,
              })}
            </Typography>
          </Breadcrumbs>
        </Stack>
        <Grid container mt={3}>
          <Grid item xs={6} mb={5}>
            <TitleBox
              title={stationId ?? ''}
              mbTitle={2}
              variantTitle="h4"
              variantSubTitle="body1"
            />
            <Typography
              mb={5}
              component={'span'}
              fontWeight={'fontWeightMedium'}
              color={'text.secondary'}
            >
              {t('stationDetailPage.createdAt', {
                data: stationDetail?.createdAt?.toLocaleDateString('en-GB'),
              })}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <DetailButtonsStation status={stationDetail?.wrapperStatus} stationCode={stationId} />
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
              <Typography variant="subtitle2">{t('stationDetailPage.state')}</Typography>
            </Grid>
            <Grid item xs={9} textAlign="right">
              <StatusChip status={stationDetail?.wrapperStatus ?? ''} />
            </Grid>
          </Grid>
          <Typography variant="h6" mb={1}>
            {t('stationDetailPage.stationConfiguration')}
          </Typography>
          <Typography sx={{ fontSize: '14px', fontWeight: 'fontWeightRegular' }} mb={3}>
            {t('stationDetailPage.stationConfigurationDescription')}
          </Typography>
          <Divider />

          <Box mt={5}>
            <Grid container spacing={2}>
              <Grid container item alignContent="center" spacing={2} pb={4}>
                <Grid item xs={12}>
                  <Typography variant="sidenav">{t('stationDetailPage.anagraphic')}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('stationDetailPage.stationId')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationId}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('stationDetailPage.primitiveVersion')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.primitiveVersion}
                  </Typography>
                </Grid>

                <Grid item xs={3}>
                  <Typography variant="body2">{t('stationDetailPage.activationDate')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.activationDate?.toLocaleDateString('en-GB') ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Typography variant="sidenav">{t('stationDetailPage.target')}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('stationDetailPage.endpoint')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {endpoint}
                  </Typography>
                </Grid>

                <Grid item xs={12} mt={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="sidenav">{t('stationDetailPage.associatesEC')}</Typography>
                  <ButtonNaked
                    component={Link}
                    to={generatePath(ROUTES.STATION_EC_LIST, { stationId })}
                    disabled={stationDetail?.wrapperStatus !== WrapperStatusEnum.APPROVED}
                    color="primary"
                    endIcon={<ManageAccounts />}
                    size="medium"
                    sx={{ alignItems: 'end' }}
                  >
                    {t('stationDetailPage.manageEC')}
                  </ButtonNaked>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('stationDetailPage.associates')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {ecAssociatedNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Typography variant="sidenav">{t('stationDetailPage.changes')}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('stationDetailPage.lastChanges')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.modifiedAt?.toLocaleDateString('en-GB') ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.operatedBy')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.modifiedBy}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default StationDetails;
