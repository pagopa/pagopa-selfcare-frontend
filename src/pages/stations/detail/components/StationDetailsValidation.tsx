import { Alert, Box, Breadcrumbs, Chip, Divider, Grid, Stack } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import HistoryIcon from '@mui/icons-material/History';
import { ButtonNaked } from '@pagopa/mui-italia';
import { ArrowBack } from '@mui/icons-material';
import {
  StatusEnum,
  WrapperStationDetailsDto,
} from '../../../../api/generated/portal/WrapperStationDetailsDto';
import { WrapperEntitiesOperations } from '../../../../api/generated/portal/WrapperEntitiesOperations';
import { StationDetailResource } from '../../../../api/generated/portal/StationDetailResource';
import { isOperator } from '../../components/commonFunctions';
import DetailButtonsStation from './DetailButtonsStation';

type Props = {
  stationWrapper?: WrapperEntitiesOperations;
  StationDetailsValidation: WrapperStationDetailsDto;
  stationDetail?: StationDetailResource;
  stationId: string;
  formatedDate: (date: Date | undefined) => string | null;
  goBack: () => void;
};

// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
const StationDetailsValidation = ({
  stationWrapper,
  StationDetailsValidation,
  stationDetail,
  stationId,
  formatedDate,
  goBack,
}: // eslint-disable-next-line sonarjs/cognitive-complexity
Props) => {
  const { t } = useTranslation();
  const stationWrap =
    stationWrapper?.wrapperEntityOperationsSortedList !== undefined
      ? stationWrapper?.wrapperEntityOperationsSortedList[0]
      : {};
  const operator = isOperator();

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
            data-testid="back-btn-test"
          >
            {t('general.exit')}
          </ButtonNaked>
          <Breadcrumbs>
            <Typography>{t('general.Stations')}</Typography>
            <Typography color={'#A2ADB8'}>
              {t('stationDetailPage.detail', {
                code: stationId,
              })}
            </Typography>
          </Breadcrumbs>
        </Stack>
        <Grid container mt={3}>
          <Grid item xs={6}>
            <TitleBox title={stationId} mbTitle={2} variantTitle="h4" variantSubTitle="body1" />
            <Typography mb={5} color="#5C6F82">
              {t('channelDetailPage.createdOn')}{' '}
              <Typography component={'span'} color="#5C6F82" fontWeight={600}>
                {`${formatedDate(stationWrapper?.createdAt)} da ${stationWrapper?.createdBy}`}
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <DetailButtonsStation stationDetailWrapper={stationWrap} stationCode={stationId} />
          </Grid>
          {operator && stationWrap.status === StatusEnum.TO_CHECK ? (
            <Grid item xs={12} sx={{ mb: 5 }}>
              <Alert severity="warning" variant="outlined">
                <Typography sx={{ py: 2 }}>{t('stationDetailPageValidation.alert')}</Typography>
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
                      stationWrap.status === StatusEnum.APPROVED
                        ? 'primary.main'
                        : StationDetailsValidation?.status === StatusEnum.TO_CHECK
                        ? 'warning.light'
                        : '#EEEEEE',
                    color:
                      stationWrap.status === StatusEnum.APPROVED
                        ? 'background.paper'
                        : 'text.primary',
                  }}
                  label={
                    stationWrap.status === StatusEnum.APPROVED
                      ? t('stationDetailPage.states.active')
                      : stationWrap.status === StatusEnum.TO_CHECK
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
                    {StationDetailsValidation?.stationCode ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.primitiveVersion')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {StationDetailsValidation?.primitiveVersion ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.intermediaryCode')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {StationDetailsValidation?.brokerCode ?? '-'}
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
                    {StationDetailsValidation?.redirectProtocol ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.port')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {StationDetailsValidation?.redirectPort ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.ip')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {StationDetailsValidation?.redirectIp ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.path')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {StationDetailsValidation?.redirectPath ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.parameters')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {StationDetailsValidation?.redirectQueryString ?? '-'}
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
                    {StationDetailsValidation?.targetHost ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.path')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {StationDetailsValidation?.targetPath ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.port')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {StationDetailsValidation?.targetPort ?? '-'}
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
                    {'lab.link.it'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.path')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {'/govpay/api/pagopa/PagamentiTelematiciCCPservice'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.port')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {'80'}
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
                    {formatedDate(stationWrap.modifiedAt) ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.configuration.operatedBy')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationWrap.modifiedByOpt}
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
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.password ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToCompltete.newPassword')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.newPassword ?? '-'}
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
                    {t('stationDetailPageValidation.infoToCompltete.NMPService')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {'-'}
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
                    {stationDetail?.protocol4Mod ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToCompltete.ip')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.ip4Mod ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToCompltete.port')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.port4Mod ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {t('stationDetailPageValidation.infoToCompltete.service')}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {stationDetail?.service4Mod ?? '-'}
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
