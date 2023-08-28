import { Alert, Box, Divider, Grid, IconButton } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import HistoryIcon from '@mui/icons-material/History';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { VisibilityOff } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  StationDetailResource,
  WrapperStatusEnum,
} from '../../../../api/generated/portal/StationDetailResource';
import { isOperator } from '../../../components/commonFunctions';
import { StatusChip } from '../../../../components/StatusChip';
import {
  GPDConfigs,
  IGPDConfig,
  INewConnConfig,
  IProxyConfig,
  NewConnConfigs,
  ProxyConfigs,
} from '../../../../model/Station';
import { ENV } from '../../../../utils/env';
import DetailButtonsStation from './DetailButtonsStation';

type Props = {
  stationDetail?: StationDetailResource;
};

// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
const StationDetailsValidation = ({
  stationDetail,
}: // eslint-disable-next-line sonarjs/cognitive-complexity
Props) => {
  const { t } = useTranslation();
  const operator = isOperator();
  const { stationId } = useParams<{ stationId: string }>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const hidePassword = 'XXXXXXXXXXXXXX';
  const proxyAddresses = ProxyConfigs[ENV.ENV as keyof IProxyConfig];
  const forwarderAddresses = NewConnConfigs[ENV.ENV as keyof INewConnConfig];
  const gpdAddresses = GPDConfigs[ENV.ENV as keyof IGPDConfig];

  const [isGDP, setIsGDP] = useState<boolean>(false);
  const [isNewConn, setIsNewConn] = useState<boolean>(false);

  const endpoint =
    stationDetail?.targetHost === undefined || stationDetail?.targetHost === ''
      ? '-'
      : `${stationDetail?.targetHost === undefined ? '-' : stationDetail?.targetHost}${
          stationDetail?.targetPort && stationDetail?.targetPort > 0
            ? `:${stationDetail.targetPort}`
            : ''
        }${stationDetail?.targetPath}`;

  useEffect(() => {
    if (stationDetail) {
      setIsNewConn(
        Object.entries(forwarderAddresses)
          .map(([key, value]) => value)
          .some((d) =>
            stationDetail.service && stationDetail.service !== '/' && stationDetail.service !== ''
              ? d.includes(stationDetail.service)
              : false
          )
      );
      setIsGDP(
        Object.entries(gpdAddresses)
          .map(([key, value]) => value)
          .some((gpd) =>
            stationDetail.service && stationDetail.service !== '/' && stationDetail.service !== ''
              ? gpd.includes(stationDetail.service)
              : false
          )
      );
    }
  }, [stationDetail]);

  const showOrHidePassword = (password?: string) => {
    if (showPassword) {
      return password;
    }
    return hidePassword;
  };

  return (
    <Grid container justifyContent={'center'}>
      <Grid item p={3} xs={8}>
        <Grid container mt={3}>
          <Grid item xs={6}>
            <TitleBox title={stationId} mbTitle={2} variantTitle="h4" variantSubTitle="body1" />
            <Typography mb={5} color="text.secondary">
              {t('channelDetailPage.createdOn')}{' '}
              <Typography component={'span'} color="text.secondary" fontWeight={'fontWeightMedium'}>
                {`${stationDetail?.createdAt?.toLocaleDateString('en-GB')} da ${
                  stationDetail?.createdBy
                }`}
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <DetailButtonsStation status={stationDetail?.wrapperStatus} stationCode={stationId} />
          </Grid>
          {operator && stationDetail?.wrapperStatus === WrapperStatusEnum.TO_CHECK ? (
            <Grid item xs={12} sx={{ mb: 5 }}>
              <Alert severity="warning" variant="outlined">
                <Typography sx={{ py: 2 }}>{t('stationDetailPageValidation.alert')}</Typography>
              </Alert>
            </Grid>
          ) : operator && stationDetail?.wrapperStatus === WrapperStatusEnum.TO_FIX ? (
            <Grid item xs={12} sx={{ mb: 5 }}>
              <Alert severity="warning" variant="outlined">
                <Typography sx={{ py: 2 }}>
                  {t('stationDetailPageValidation.alertToFix')}
                </Typography>
              </Alert>
            </Grid>
          ) : null}
        </Grid>
        <Paper
          elevation={8}
          sx={{
            mt: 2,
            borderRadius: 4,
            p: 4,
          }}
        >
          <Grid container alignItems={'center'} spacing={0} mb={2}>
            <Grid container item spacing={2} pb={4}>
              <Grid item xs={3}>
                <Typography variant="sidenav">
                  {t('stationDetailPageValidation.configuration.status')}
                </Typography>
              </Grid>
              <Grid item xs={9} textAlign="right">
                <StatusChip status={stationDetail?.wrapperStatus ?? ''} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" mb={1}>
                  {t('stationDetailPageValidation.configuration.title')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" mb={3}>
                  {t('stationDetailPageValidation.configuration.subtitle')}
                </Typography>
                <Divider> </Divider>
              </Grid>
            </Grid>
          </Grid>
          <Box mt={5}>
            <Grid container spacing={2}>
              <Grid container item alignContent="center" spacing={2} pb={4}>
                <Grid item xs={12}>
                  <Typography variant="sidenav">
                    {t('stationDetailPageValidation.configuration.registry')}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.stationCode')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.stationCode ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.primitiveVersion')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.primitiveVersion ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.intermediaryCode')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.brokerCode ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={4}>
                  <Typography variant="sidenav">
                    {t('stationDetailPageValidation.configuration.targetService')}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.endpoint')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {endpoint}
                  </Typography>
                </Grid>

                <Grid item xs={3} mt={4}>
                  <Typography variant="sidenav">
                    {t('stationDetailPageValidation.configuration.modify')}
                  </Typography>
                </Grid>
                <Grid item xs={9} mt={4} textAlign="right">
                  <ButtonNaked
                    size="small"
                    component="button"
                    endIcon={<HistoryIcon />}
                    sx={{ color: 'primary.main', mr: '20px' }}
                    weight="default"
                    disabled
                  >
                    {t('stationDetailPageValidation.configuration.changeHistory')}
                  </ButtonNaked>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.lastUpgrade')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.modifiedAt?.toLocaleDateString('en-GB') ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.operatedBy')}
                  </Typography>
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

        <Paper
          elevation={8}
          sx={{
            mt: 2,
            borderRadius: 4,
            p: 4,
          }}
        >
          <Grid container alignItems={'center'} spacing={0} mb={2}>
            <Grid item xs={12}>
              <Typography variant="h6" mb={3}>
                {t('stationDetailPageValidation.infoToComplete.title')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" mb={3}>
                {t('stationDetailPageValidation.infoToComplete.subtitle')}
              </Typography>
              <Divider> </Divider>
            </Grid>
          </Grid>
          <Box mt={5}>
            <Grid container spacing={2}>
              <Grid container item alignContent="center" spacing={2} pb={4}>
                <Grid item xs={12}>
                  <Typography variant="sidenav">
                    {t('stationDetailPageValidation.infoToComplete.registry')}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToComplete.version')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.version ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToComplete.password')}
                  </Typography>
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
                  {stationDetail?.password ? (
                    <>
                      <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                        {showOrHidePassword(stationDetail?.password)}
                      </Typography>
                      <IconButton
                        style={{
                          border: 'none !important',
                          marginLeft: '42px',
                        }}
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                        data-testid="show-pwd-validation-test"
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
                    {t('stationDetailPageValidation.infoToComplete.configuration')}
                  </Typography>
                </Grid>
                {stationDetail && stationDetail.ip && isNewConn ? (
                  <>
                    <Grid item xs={3}>
                      <Typography variant="body2">
                        {t('stationDetailPageValidation.infoToComplete.newConn')}
                      </Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">
                        {t('stationDetailPageValidation.infoToComplete.forwarderNewConn')}
                      </Typography>
                    </Grid>
                  </>
                ) : stationDetail && stationDetail.ip && isGDP ? (
                  <>
                    <Grid item xs={3}>
                      <Typography variant="body2">
                        {t('stationDetailPageValidation.infoToComplete.GDP')}
                      </Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">
                        {t('stationDetailPageValidation.infoToComplete.gdpDetail')}
                      </Typography>
                    </Grid>
                  </>
                ) : (
                  '-'
                )}
                {/* <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToComplete.newConn')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail && stationDetail.ip && isNewConn
                      ? `${stationDetail.protocol === 'HTTPS' ? 'https://' : 'http://'}${
                          stationDetail.ip
                        }${stationDetail.port ? `:${stationDetail.port}` : ''}${
                          stationDetail.service
                        }`
                      : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToComplete.GDP')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail && stationDetail.ip && isGDP
                      ? `${stationDetail.protocol === 'HTTPS' ? 'https://' : 'http://'}${
                          stationDetail.ip
                        }${stationDetail.port ? `:${stationDetail.port}` : ''}${
                          stationDetail.service
                        }`
                      : '-'}
                  </Typography>
                </Grid> */}
                <Grid item xs={12} mt={4}>
                  <Typography variant="sidenav">
                    {t('stationDetailPageValidation.infoToComplete.proxy')}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToComplete.proxyAddress')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.proxyHost ?? '-'}
                    {stationDetail?.proxyPort ? `:${stationDetail.proxyPort}` : '-'}

                    {stationDetail?.proxyHost !== '' &&
                      Object.entries(proxyAddresses).map(([key, value]) =>
                        value.includes(
                          stationDetail?.proxyHost && stationDetail.proxyHost.toString()
                        )
                          ? ` (${t(
                              'stationDetailPageValidation.infoToComplete.proxyLabels.' + key
                            )})`
                          : ''
                      )}
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={4}>
                  <Typography variant="sidenav">
                    {t('stationDetailPageValidation.infoToComplete.otherInfo')}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToComplete.timeoutA')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.timeoutA ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToComplete.timeoutB')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.timeoutB ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToComplete.timeoutC')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.timeoutC ?? '-'}
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
export default StationDetailsValidation;
