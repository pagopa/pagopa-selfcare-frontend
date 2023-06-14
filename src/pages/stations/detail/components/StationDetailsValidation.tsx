import { Alert, Box, Chip, Divider, Grid, IconButton } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import HistoryIcon from '@mui/icons-material/History';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { VisibilityOff } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  StationDetailResource,
  WrapperStatusEnum,
} from '../../../../api/generated/portal/StationDetailResource';
import { isOperator } from '../../components/commonFunctions';
import DetailButtonsStation from './DetailButtonsStation';

type Props = {
  stationDetail?: StationDetailResource;
  formatedDate: (date: Date | undefined) => string | null;
};

// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
const StationDetailsValidation = ({
  stationDetail,
  formatedDate,
}: // eslint-disable-next-line sonarjs/cognitive-complexity
Props) => {
  const { t } = useTranslation();
  const operator = isOperator();
  const { stationId } = useParams<{ stationId: string }>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const hidePassword = 'XXXXXXXXXXXXXX';

  const showOrHidePassword = (password?: string) => {
    if (showPassword) {
      return password;
    }
    return hidePassword;
  };

  const showOrHideNewPassword = (newPassword?: string) => {
    if (showNewPassword) {
      return newPassword;
    }
    return hidePassword;
  };

  return (
    <Grid container justifyContent={'center'}>
      <Grid item p={3} xs={8}>
        <Grid container mt={3}>
          <Grid item xs={6}>
            <TitleBox title={stationId} mbTitle={2} variantTitle="h4" variantSubTitle="body1" />
            <Typography mb={5} color="#5C6F82">
              {t('channelDetailPage.createdOn')}{' '}
              <Typography component={'span'} color="#5C6F82" fontWeight={600}>
                {`${formatedDate(stationDetail?.createdAt)} da ${stationDetail?.createdBy}`}
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
                <Chip
                  size="medium"
                  sx={{
                    backgroundColor:
                      stationDetail?.wrapperStatus === WrapperStatusEnum.APPROVED
                        ? 'primary.main'
                        : stationDetail?.wrapperStatus === WrapperStatusEnum.TO_CHECK ||
                          stationDetail?.wrapperStatus === WrapperStatusEnum.TO_CHECK_UPDATE
                        ? '#EEEEEE'
                        : 'warning.light',
                    color:
                      stationDetail?.wrapperStatus === WrapperStatusEnum.APPROVED
                        ? 'background.paper'
                        : 'text.primary',
                  }}
                  label={
                    stationDetail?.wrapperStatus === WrapperStatusEnum.APPROVED
                      ? t('stationDetailPage.states.active')
                      : stationDetail?.wrapperStatus === WrapperStatusEnum.TO_CHECK ||
                        stationDetail?.wrapperStatus === WrapperStatusEnum.TO_CHECK_UPDATE
                      ? t('stationDetailPage.states.revision')
                      : t('stationDetailPage.states.needCorrection')
                  }
                />
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
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.stationCode ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.primitiveVersion')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.primitiveVersion ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.intermediaryCode')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.brokerCode ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={4}>
                  <Typography variant="sidenav">
                    {t('stationDetailPageValidation.configuration.redirect')}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.protocol')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.redirectProtocol ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.port')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.redirectPort ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.ip')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.redirectIp ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.path')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.redirectPath ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.parameters')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.redirectQueryString ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={4}>
                  <Typography variant="sidenav">
                    {t('stationDetailPageValidation.configuration.targetService')}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.ip')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.targetHost ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.path')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.targetPath ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.port')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.targetPort ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={4}>
                  <Typography variant="sidenav">
                    {t('stationDetailPageValidation.configuration.POFTargetService')}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.ip')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.targetHostPof ? stationDetail.targetHostPof : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.path')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.targetPathPof ? stationDetail.targetPathPof : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.port')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.targetPortPof ? stationDetail.targetPortPof : '-'}
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
                  <Typography variant="body2" fontWeight={600}>
                    {formatedDate(stationDetail?.modifiedAt) ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.operatedBy')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {/* stationDetail?.modifiedByOpt */ '-'}
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
                {t('stationDetailPageValidation.infoToCompltete.title')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" mb={3}>
                {t('stationDetailPageValidation.infoToCompltete.subtitle')}
              </Typography>
              <Divider> </Divider>
            </Grid>
          </Grid>
          <Box mt={5}>
            <Grid container spacing={2}>
              <Grid container item alignContent="center" spacing={2} pb={4}>
                <Grid item xs={12}>
                  <Typography variant="sidenav">
                    {t('stationDetailPageValidation.infoToCompltete.registry')}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToCompltete.version')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.version ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToCompltete.password')}
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
                        data-testid="show-ps2-test"
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
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToCompltete.newPassword')}
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
                  {stationDetail?.newPassword ? (
                    <>
                      <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                        {showOrHideNewPassword(stationDetail?.newPassword)}
                      </Typography>
                      <IconButton
                        style={{
                          border: 'none !important',
                          marginLeft: '42px',
                        }}
                        onClick={() => {
                          setShowNewPassword(!showNewPassword);
                        }}
                        data-testid="show-ps2-test"
                      >
                        {showNewPassword ? (
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
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToCompltete.threadNumber')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.threadNumber ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={4}>
                  <Typography variant="sidenav">
                    {t('stationDetailPageValidation.infoToCompltete.endpoint')}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToCompltete.protocol')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.protocol ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToCompltete.ip')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.ip ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToCompltete.port')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.port ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToCompltete.POFService')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.pofService ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToCompltete.service')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.service ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={4}>
                  <Typography variant="sidenav">
                    {t('stationDetailPageValidation.infoToCompltete.model4')}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToCompltete.protocol')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.protocol4Mod ? stationDetail.protocol4Mod : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToCompltete.ip')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.ip4Mod ? stationDetail.ip4Mod : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToCompltete.port')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.port4Mod ? stationDetail.port4Mod : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToCompltete.service')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.service4Mod ? stationDetail.service4Mod : '-'}
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
