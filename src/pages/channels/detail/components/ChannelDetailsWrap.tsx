import { ArrowBack, ManageAccounts } from '@mui/icons-material';
import { Grid, Stack, Breadcrumbs, Typography, Paper, Chip, Divider } from '@mui/material';
import { Box } from '@mui/system';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { Link, generatePath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ROUTES from '../../../../routes';
import { ChannelDetailsResource } from '../../../../api/generated/portal/ChannelDetailsResource';
import { WrapperStatusEnum } from '../../../../api/generated/portal/WrapperChannelDetailsResource';
import { StatusChip } from '../../../../components/StatusChip';
import DetailButtons from './DetailButtons';

type Props = {
  channelDetWrap?: ChannelDetailsResource;
  channelId: string;
  goBack: () => void;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const ChannelDetailsWrap = ({ channelDetWrap, channelId, goBack }: Props) => {
  const { t } = useTranslation();

  return channelDetWrap ? (
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
            <Typography color={'text.disaled'}>
              {t('channelDetailPage.detail')} {channelId}
            </Typography>
          </Breadcrumbs>
        </Stack>
        <Grid container mt={3}>
          <Grid item xs={6}>
            <TitleBox title={channelId} mbTitle={2} variantTitle="h4" variantSubTitle="body1" />
            <Typography mb={5}>
              {t('channelDetailPage.createdOn')}{' '}
              <Typography component={'span'} fontWeight={'fontWeightMedium'}>
                {channelDetWrap.createdAt?.toLocaleDateString('en-GB') ?? '-'}
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <DetailButtons channelDetails={channelDetWrap} goBack={goBack} />
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
              <StatusChip status={channelDetWrap.wrapperStatus ?? ''} size="regular" />
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
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {channelDetWrap.broker_psp_code}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.companyName')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {channelDetWrap.broker_description}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.idChannel')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {channelDetWrap.channel_code}
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Typography variant="sidenav">{t('channelDetailPage.redirect')}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.redirectProtocol')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {channelDetWrap.redirect_protocol}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.redirectPort')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {channelDetWrap.redirect_port}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.redirectUrl')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {channelDetWrap.redirect_ip}
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Typography variant="sidenav">{t('channelDetailPage.target')}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.targetAddress')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {channelDetWrap.target_host}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.targetService')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {channelDetWrap.target_path}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.targetPort')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {channelDetWrap.target_port}
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Typography variant="sidenav">{t('channelDetailPage.paymentType')}</Typography>
                </Grid>
                <Grid container xs={12} mb={3} mt={2}>
                  {channelDetWrap.payment_types && channelDetWrap.payment_types.length > 0
                    ? // eslint-disable-next-line sonarjs/no-identical-functions
                      channelDetWrap.payment_types.map((e, i) => (
                        // eslint-disable-next-line react/jsx-key
                        <Grid key={`grid${i}_wrap`} item xs={3} sx={i === 0 ? { ml: 2 } : null}>
                          <Chip key={`chip${i}_wrap`} color="primary" label={`${e}`} />
                        </Grid>
                      ))
                    : ''}
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
                    to={generatePath(ROUTES.CHANNEL_PSP_LIST, { channelId })}
                    disabled={channelDetWrap.wrapperStatus !== WrapperStatusEnum.APPROVED}
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
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {0}
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Typography variant="sidenav">{t('channelDetailPage.changes')}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.lastChange')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {channelDetWrap.modifiedAt?.toLocaleDateString('en-GB') ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.operatedBy')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {channelDetWrap.modifiedBy ?? '-'}
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

export default ChannelDetailsWrap;
