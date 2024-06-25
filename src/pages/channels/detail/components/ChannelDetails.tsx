/* eslint-disable complexity */
import { ArrowBack, VisibilityOff } from '@mui/icons-material';
import { Breadcrumbs, Chip, Divider, Grid, IconButton, Paper, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ButtonNaked } from '@pagopa/mui-italia';
import { StatusChip } from '../../../../components/StatusChip';
import ROUTES from '../../../../routes';
import {
  ChannelDetailsResource,
  WrapperStatusEnum,
} from '../../../../api/generated/portal/ChannelDetailsResource';
import { ProtocolEnum } from '../../../../api/generated/portal/WrapperChannelDetailsResource';
import { ENV } from '../../../../utils/env';
import { useUserRole } from '../../../../hooks/useUserRole';
import DetailButtons from './DetailButtons';
import GetChannelAlert from './GetChannelAlert';
import ChannelDetailHeader from './ChannelDetailHeader';


type Props = {
  channelDetail: ChannelDetailsResource;
  setChannelDetail: (value: any) => void;
  channelId: string;
  PSPAssociatedNumber: number;
};

const ChannelDetails = ({
  channelDetail,
  setChannelDetail,
  channelId,
  PSPAssociatedNumber,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}: Props) => {
  const history = useHistory();
  const goBack = () => history.push(ROUTES.CHANNELS);
  const { t } = useTranslation();
  const { userIsPagopaOperator } = useUserRole();
  const targetPath = (!channelDetail.target_path?.startsWith('/') ? '/' : '').concat(
    channelDetail.target_path !== undefined ? channelDetail.target_path : ''
  );
  const targetValue = `${channelDetail.target_host}:${channelDetail.target_port}${targetPath}`;

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const hidePassword = 'XXXXXXXXXXXXXX';
  const showOrHidePassword = (password?: string) => {
    if (showPassword) {
      return password;
    }
    return hidePassword;
  };

  const forwarder01 =
    ENV.ENV === 'prod'
      ? 'https://api.platform.pagopa.it/pagopa-node-forwarder/api/v1/forward'
      : 'https://api.uat.platform.pagopa.it/pagopa-node-forwarder/api/v1/forward';

  const newConnectionValue = `${
    channelDetail.protocol === ProtocolEnum.HTTPS ? 'https://' : 'http://'
  }${channelDetail.ip}${channelDetail.service}`;

  return (
    <Grid container justifyContent={'center'}>
      <Grid item p={3} xs={8}>
        <ButtonNaked
          size="small"
          component="button"
          onClick={goBack}
          startIcon={<ArrowBack />}
          sx={{ color: 'primary.main', mr: '20px' }}
          weight="default"
          data-testid="back-button-test"
        >
          {t('general.back')}
        </ButtonNaked>
        <Box display="flex" mt={2} alignItems={'center'}>
          <Typography variant="h4" mr={3}>
            {channelId}
          </Typography>
          <StatusChip status={channelDetail?.wrapperStatus ?? ''} />
        </Box>
        <Typography my={2}>
          {t(
            `channelDetailPage.subtitle.${channelDetail?.wrapperStatus === WrapperStatusEnum.APPROVED ? 'approved' : 'waiting'}`
          )}
        </Typography>

        <GetChannelAlert channelDetail={channelDetail} />

        <Paper
          elevation={5}
          sx={{
            mt: 2,
            borderRadius: 4,
            p: 4,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" mb={1}>
                {t('channelDetailPage.channelConfiguration')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="sidenav">{t('channelDetailPage.registry')}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">{t('channelDetailPage.pspBrokerCode')}</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                {channelDetail.broker_psp_code}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">{t('channelDetailPage.companyName')}</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                {channelDetail.broker_description}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">{t('channelDetailPage.idChannel')}</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                {channelDetail.channel_code}
              </Typography>
            </Grid>
            <Grid item xs={12} mt={2}>
              <Typography variant="sidenav">{t('channelDetailPage.target')}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">{t('channelDetailPage.endPoint')}</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                {targetValue}
              </Typography>
            </Grid>
            <Grid item xs={12} mt={2}>
              <Typography variant="sidenav">{t('channelDetailPage.paymentType')}</Typography>
            </Grid>
            {channelDetail.payment_types && channelDetail.payment_types.length > 0
              ? channelDetail.payment_types.map((e, i) => (
                  <Grid item key={`gridPaymentChip${i}`} xs={3} sx={i !== 0 ? { ml: 2 } : null}>
                    <Chip color="primary" label={`${e}`} />
                  </Grid>
                ))
              : ''}

            <>
              {!userIsPagopaOperator && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="sidenav">
                      {t('channelDetailPage.associatedPsp')}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2">{t('channelDetailPage.associated')}</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                      {PSPAssociatedNumber}
                    </Typography>
                  </Grid>
                </>
              )}
            </>
          </Grid>
        </Paper>

        {userIsPagopaOperator && channelDetail?.proxy_host && (
          <Paper
            elevation={5}
            sx={{
              mt: 2,
              borderRadius: 4,
              p: 4,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">{t('channelDetailValidationPage.title')}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" mb={3}>
                  {t('channelDetailValidationPage.subtitle')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="sidenav">
                  {t('channelDetailValidationPage.registry')}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">
                  {t('channelDetailValidationPage.primitiveVersion')}
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                  {channelDetail?.primitive_version ?? '-'}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">{t('channelDetailValidationPage.password')}</Typography>
              </Grid>
              <Grid
                item
                xs={9}
                sx={{
                  display: 'flex',
                  height: '38px',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {channelDetail?.password ? (
                  <>
                    <Typography
                      variant="body2"
                      fontWeight={'fontWeightMedium'}
                      data-testid="password-value-test"
                    >
                      {showOrHidePassword(channelDetail?.password)}
                    </Typography>
                    <IconButton
                      style={{
                        border: 'none !important',
                        marginLeft: '42px',
                      }}
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                      data-testid="show-psw-test"
                    >
                      {showPassword ? (
                        <VisibilityIcon color="primary" sx={{ width: '80%' }} />
                      ) : (
                        <VisibilityOff color="primary" sx={{ width: '80%' }} />
                      )}
                    </IconButton>
                  </>
                ) : (
                  '-'
                )}
              </Grid>
              <Grid item xs={12} mt={4}>
                <Typography variant="sidenav">
                  {t('channelDetailValidationPage.connection')}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">
                  {t('channelDetailValidationPage.newConnection')}
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                  {forwarder01 === newConnectionValue
                    ? t('channelDetailValidationPage.forwarder01')
                    : targetValue}
                </Typography>
              </Grid>
              <Grid item xs={12} mt={4}>
                <Typography variant="sidenav">{t('channelDetailValidationPage.proxy')}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">
                  {t('channelDetailValidationPage.proxyAddress')}
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                  {channelDetail?.proxy_host && channelDetail?.proxy_port
                    ? `${channelDetail?.proxy_host}:${channelDetail?.proxy_port}`
                    : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} mt={4}>
                <Typography variant="sidenav">
                  {t('channelDetailValidationPage.otherInfo')}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">{t('channelDetailValidationPage.timeoutA')}</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                  {channelDetail?.timeout_a ?? '-'}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">{t('channelDetailValidationPage.timeoutB')}</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                  {channelDetail?.timeout_b ?? '-'}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">{t('channelDetailValidationPage.timeoutC')}</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                  {channelDetail?.timeout_c ?? '-'}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">
                  {t('channelDetailValidationPage.pspNotify')}
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                  {channelDetail?.flag_io
                    ? t('channelDetailValidationPage.enabled')
                    : t('channelDetailValidationPage.disabled')}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">{t('channelDetailValidationPage.stamp')}</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                  {channelDetail?.digital_stamp_brand
                    ? t('channelDetailValidationPage.enabled')
                    : t('channelDetailValidationPage.disabled')}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}
        <Typography color="action.active" sx={{ my: 2 }}>
          {t('channelDetailPage.createdOn')}{' '}
          <Typography component={'span'} fontWeight={'fontWeightMedium'}>
            {`${channelDetail?.createdAt?.toLocaleDateString('en-GB') ?? '-'}`}
          </Typography>{' '}
          {t('general.fromLower')}{' '}
          <Typography component={'span'} fontWeight={'fontWeightMedium'}>
            {channelDetail?.createdBy}
          </Typography>
          {'.'}
          {channelDetail?.modifiedBy && (
            <div>
              {t('channelDetailPage.lastModified')}{' '}
              <Typography component={'span'} fontWeight={'fontWeightMedium'}>
                {channelDetail?.modifiedBy}
              </Typography>
              {channelDetail?.modifiedAt && (
                <>
                  {' '}
                  {t('general.atLower')}{' '}
                  <Typography component={'span'} fontWeight={'fontWeightMedium'}>
                    {`${channelDetail?.modifiedAt?.toLocaleDateString('en-GB')}`}
                  </Typography>
                </>
              )}
              {'.'}
            </div>
          )}
        </Typography>
        <DetailButtons
          channelDetails={channelDetail}
          setChannelDetails={setChannelDetail}
          goBack={goBack}
        />
      </Grid>
    </Grid>
  );
};

export default ChannelDetails;

