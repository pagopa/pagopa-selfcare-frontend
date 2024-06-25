import { Alert, Box, Divider, Grid, IconButton } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useHistory, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ArrowBack, VisibilityOff } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  StationDetailResource,
  WrapperStatusEnum,
} from '../../../../api/generated/portal/StationDetailResource';
import { StatusChip } from '../../../../components/StatusChip';
import { IProxyConfig, ProxyConfigs } from '../../../../model/Station';
import ROUTES from '../../../../routes';
import { ENV } from '../../../../utils/env';
import { useUserRole } from '../../../../hooks/useUserRole';
import DetailButtonsStation from './DetailButtonsStation';

// eslint-disable-next-line sonarjs/cognitive-complexity
const GetAlert = ({ stationDetail }: { stationDetail?: StationDetailResource }) => {
  const { t } = useTranslation();
  const { userIsPagopaOperator } = useUserRole();

  if (stationDetail?.wrapperStatus !== WrapperStatusEnum.APPROVED) {
    const isToBeValidated =
      stationDetail?.wrapperStatus === WrapperStatusEnum.TO_CHECK ||
      stationDetail?.wrapperStatus === WrapperStatusEnum.TO_CHECK_UPDATE;
    const isToBeFixed =
      stationDetail?.wrapperStatus === WrapperStatusEnum.TO_FIX ||
      stationDetail?.wrapperStatus === WrapperStatusEnum.TO_FIX_UPDATE;

    const userHasToTakeAction =
      (isToBeValidated && userIsPagopaOperator) || (isToBeFixed && !userIsPagopaOperator);
    return (
      <>
        {(userIsPagopaOperator || userHasToTakeAction) && (
          <Box my={2}>
            <Alert
              severity={userHasToTakeAction ? 'warning' : 'info'}
              variant="outlined"
              sx={{ py: 2 }}
            >
              {isToBeFixed && (
                <Typography fontWeight={'fontWeightMedium'}>
                  {t('stationDetailPageValidation.alert.toFixTitle')}
                </Typography>
              )}
              <Typography>
                {isToBeFixed && stationDetail?.note?.trim()
                  ? stationDetail.note
                  : t(
                      `stationDetailPageValidation.alert.${
                        isToBeValidated ? 'toCheckMessage' : 'toFixMessage'
                      }`
                    )}
              </Typography>
            </Alert>
          </Box>
        )}
      </>
    );
  }
  return null;
};
type Props = {
  stationDetail?: StationDetailResource;
  setStationDetail: (value: any) => void;
  ecAssociatedNumber: number;
};

// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
const StationDetails = ({
  stationDetail,
  setStationDetail,
  ecAssociatedNumber,
}: // eslint-disable-next-line sonarjs/cognitive-complexity
Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { stationId } = useParams<{ stationId: string }>();
  const { userIsPagopaOperator } = useUserRole();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const hidePassword = 'XXXXXXXXXXXXXX';
  const proxyAddresses = ProxyConfigs[ENV.ENV as keyof IProxyConfig];

  const showOrHidePassword = (password?: string) => {
    if (showPassword) {
      return password;
    }
    return hidePassword;
  };

  return (
    <Grid container justifyContent={'center'}>
      <Grid item p={3} xs={8}>
        <ButtonNaked
          size="small"
          component="button"
          onClick={() => history.push(ROUTES.STATIONS)}
          startIcon={<ArrowBack />}
          sx={{ color: 'primary.main', mr: '20px' }}
          weight="default"
          data-testid="back-btn-test"
        >
          {t('general.back')}
        </ButtonNaked>
        <Box display="flex" mt={2} alignItems={'center'}>
          <Typography variant="h4" mr={3}>
            {stationId}
          </Typography>
          <StatusChip status={stationDetail?.wrapperStatus ?? ''} />
        </Box>
        <Typography my={2}>
          {t(
            `stationDetailPageValidation.subtitle.${stationDetail?.wrapperStatus === WrapperStatusEnum.APPROVED ? 'approved' : 'waiting'}`
          )}
        </Typography>

        <GetAlert stationDetail={stationDetail} />

        <Paper
          elevation={5}
          sx={{
            mt: 2,
            borderRadius: 4,
            p: 4,
          }}
        >
          <Grid container item spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4" mb={2}>
                {t('stationDetailPageValidation.configuration.title')}
              </Typography>
            </Grid>

            <>
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
                  {t('stationDetailPageValidation.configuration.connectionType.label')}
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                  {t(
                    `stationDetailPageValidation.configuration.connectionType.${
                      stationDetail?.isConnectionSync ? 'sync' : 'async'
                    }`
                  )}
                </Typography>
              </Grid>
              {!userIsPagopaOperator && (
                <>
                  <Grid item xs={3} data-testid="activation-date">
                    <Typography variant="body2">{t('stationDetailPage.activationDate')}</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                      {stationDetail?.activationDate?.toLocaleDateString('en-GB') ?? '-'}
                    </Typography>
                  </Grid>
                </>
              )}
            </>

            {stationDetail?.isConnectionSync && (
              <>
                <Grid item xs={12} mt={2} data-testid="connection-sync-section">
                  <Typography variant="sidenav">
                    {t('stationDetailPageValidation.endpoints.modello1')}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.endpoints.endpointRTConcat')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.targetHost}:{stationDetail?.targetPort}
                    {stationDetail?.targetPath}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.endpoints.endpointRedirectConcat')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.redirectProtocol
                      ? `${stationDetail?.redirectProtocol.toLowerCase()}://`
                      : ''}
                    {stationDetail?.redirectIp}
                    {stationDetail?.redirectPort ? `:${stationDetail?.redirectPort}` : ''}
                    {stationDetail?.redirectPath}
                    {stationDetail?.redirectQueryString
                      ? `?${stationDetail?.redirectQueryString}`
                      : ''}
                  </Typography>
                </Grid>

                <Grid item xs={12} mt={2}>
                  <Typography variant="sidenav">
                    {t('stationDetailPageValidation.endpoints.modelloUnico')}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.endpoints.endpointMUConcat')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.targetHostPof}
                    {stationDetail?.targetPortPof ? `:${stationDetail?.targetPortPof}` : ''}
                    {stationDetail?.targetPathPof}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.endpoints.primitiveVersion')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.primitiveVersion}
                  </Typography>
                </Grid>
              </>
            )}

            {!userIsPagopaOperator && (
              <>
                <Grid
                  item
                  xs={12}
                  mt={2}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                  data-testid="associated-ec"
                >
                  <Typography variant="sidenav">{t('stationDetailPage.associatesEC')}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('stationDetailPage.associates')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {ecAssociatedNumber}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>

        {userIsPagopaOperator && stationDetail?.pofService && (
          <Paper
            elevation={5}
            sx={{
              mt: 2,
              borderRadius: 4,
              p: 4,
            }}
            data-testid="operator-section"
          >
            <Grid container alignItems={'center'} spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">
                  {t('stationDetailPageValidation.infoToComplete.title')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" mb={3}>
                  {t('stationDetailPageValidation.infoToComplete.subtitle')}
                </Typography>
                <Divider> </Divider>
              </Grid>

              <>
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
                {stationDetail?.password && (
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
                  </Grid>
                )}
              </>

              <>
                <Grid item xs={12} mt={2}>
                  <Typography variant="sidenav">
                    {t('stationDetailPageValidation.infoToComplete.configuration')}
                  </Typography>
                </Grid>

                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t(
                      `stationDetailPageValidation.infoToComplete.${
                        stationDetail?.isConnectionSync ? 'newConn' : 'GPD'
                      }`
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2">
                    {t(
                      `stationDetailPageValidation.infoToComplete.${
                        stationDetail?.isConnectionSync ? 'forwarderNewConn' : 'gdpDetail'
                      }`
                    )}{' '}
                    - {stationDetail.ip}
                    {stationDetail.pofService}
                  </Typography>
                </Grid>
              </>

              <>
                <Grid item xs={12} mt={2}>
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
                    {stationDetail?.proxyHost && stationDetail?.proxyPort
                      ? `${stationDetail.proxyHost}:${stationDetail.proxyPort}`
                      : '-'}

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
              </>

              <>
                <Grid item xs={12} mt={2}>
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
              </>
            </Grid>
          </Paper>
        )}

        <Typography color="action.active" sx={{ my: 2 }}>
          {stationDetail?.createdBy && (
            <>
              {t('channelDetailPage.createdOn')}{' '}
              <Typography component={'span'} fontWeight={'fontWeightMedium'}>
                {`${stationDetail?.createdAt?.toLocaleDateString('en-GB') ?? '-'}`}
              </Typography>{' '}
              {t('general.fromLower')}{' '}
              <Typography component={'span'} fontWeight={'fontWeightMedium'}>
                {stationDetail?.createdBy}
              </Typography>
              {'.'}
            </>
          )}
          {stationDetail?.modifiedBy && (
            <div>
              {t('channelDetailPage.lastModified')}{' '}
              <Typography component={'span'} fontWeight={'fontWeightMedium'}>
                {stationDetail?.modifiedBy}
              </Typography>
              {stationDetail?.modifiedAt && (
                <>
                  {' '}
                  {t('general.atLower')}{' '}
                  <Typography component={'span'} fontWeight={'fontWeightMedium'}>
                    {`${stationDetail?.modifiedAt?.toLocaleDateString('en-GB')}`}
                  </Typography>
                </>
              )}
              {'.'}
            </div>
          )}
        </Typography>
        {stationDetail && (
          <DetailButtonsStation stationDetail={stationDetail} setStationDetail={setStationDetail} />
        )}
      </Grid>
    </Grid>
  );
};
export default StationDetails;
