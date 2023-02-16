import { ArrowBack, ManageAccounts } from '@mui/icons-material';
import { Box, Chip, Divider, Grid } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ButtonNaked, theme } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { generatePath, useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { ChannelDetailsResource } from '../../../api/generated/portal/ChannelDetailsResource';
import ROUTES from '../../../routes';
import { getChannelDetail } from '../../../services/__mocks__/channelService';

const ChannelDetailPage = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const [channelDetail, setChannelDetail] = useState<ChannelDetailsResource>();

  const { channelId } = useParams<{ channelId: string }>();

  const goBack = () => history.push(ROUTES.CHANNELS);

  useEffect(() => {
    getChannelDetail(channelId)
      .then((channelDetailResponse) => setChannelDetail(channelDetailResponse))
      .catch((reason) => {
        console.error(reason);
      });
  }, []);

  return channelDetail ? (
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
            <Typography>{t('general.Channels')}</Typography>
            <Typography color={'#A2ADB8'}>
              {t('channelDetailPage.detail')} {channelDetail.channel_code}
            </Typography>
          </Breadcrumbs>
        </Stack>
        <Grid container mt={3}>
          <Grid item xs={6}>
            <TitleBox
              title={channelDetail.channel_code ?? ''}
              mbTitle={2}
              variantTitle="h4"
              variantSubTitle="body1"
            />
            <Typography mb={5}>
              {t('channelDetailPage.createdOn')}{' '}
              <Typography component={'span'} fontWeight={600}>
                dd/mm/yyyy
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Stack spacing={2} direction="row" flexWrap={'wrap'} justifyContent={'flex-end'}>
              <Button
                color={'error'}
                style={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
                variant="outlined"
                onClick={goBack}
              >
                {t('channelDetailPage.disable')}
              </Button>
              <Button color="primary" variant="outlined" onClick={goBack}>
                {t('channelDetailPage.duplicate')}
              </Button>
              <Button variant="contained">{t('channelDetailPage.edit')}</Button>
            </Stack>
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
              <Typography variant="subtitle2">{t('channelDetailPage.state')}</Typography>
            </Grid>
            <Grid item xs={9} textAlign="right">
              <Chip size="medium" label={t('channelDetailPage.states.revision')} />
            </Grid>
          </Grid>
          <Typography variant="h6" mb={3}>
            {t('channelDetailPage.channelConfiguration')}
          </Typography>
          <Divider></Divider>

          <Box mt={5}>
            <Grid container spacing={2}>
              <Grid container item alignContent="center" spacing={2} pb={4}>
                <Grid item xs={12}>
                  <Typography variant="sidenav">{t('channelDetailPage.registry')}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.pspBrokerCode')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {channelDetail.broker_psp_code}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.companyName')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {channelDetail.broker_description}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.idChannel')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {channelDetail.channel_code}
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Typography variant="sidenav">{t('channelDetailPage.redirect')}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.redirectProtocol')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {channelDetail.redirect_protocol}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.redirectPort')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {channelDetail.redirect_port}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.redirectUrl')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {channelDetail.redirect_ip}
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Typography variant="sidenav">{t('channelDetailPage.target')}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.targetAddress')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {channelDetail.target_host}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.targetService')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {channelDetail.target_path}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.targetPort')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {channelDetail.target_port}
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Typography variant="sidenav">{t('channelDetailPage.paymentType')}</Typography>
                </Grid>
                <Grid item xs={12} mb={3} mt={2}>
                  {channelDetail.payment_types && channelDetail.payment_types.length > 0 ? (
                    <Chip color="primary" label={channelDetail.payment_types} />
                  ) : (
                    ''
                  )}
                </Grid>
                <Grid item xs={6} alignItems={'center'}>
                  <Typography variant="sidenav">{t('channelDetailPage.associatedPsp')}</Typography>
                </Grid>
                <Grid
                  item
                  textAlign={'right'}
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'flex-end'}
                  xs={6}
                >
                  <ButtonNaked
                    component={Link}
                    to={generatePath(ROUTES.CHANNEL_PSP_LIST, {
                      channelId: channelDetail.channel_code,
                    })}
                    color="primary"
                    endIcon={<ManageAccounts />}
                    size="medium"
                  >
                    {t('channelDetailPage.managePsp')}
                  </ButtonNaked>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.associated')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {channelId}
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Typography variant="sidenav">{t('channelDetailPage.changes')}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.lastChange')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {channelId}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.operatedBy')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {channelId}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  ) : (
    <></>
  );
};

export default ChannelDetailPage;
