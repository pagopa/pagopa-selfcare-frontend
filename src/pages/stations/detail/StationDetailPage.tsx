import {
  Box,
  Chip,
  Divider,
  Grid,
  Breadcrumbs,
  Button,
  Paper,
  Stack,
  Typography,
  IconButton,
} from '@mui/material';
import { ArrowBack, ManageAccounts, VisibilityOff } from '@mui/icons-material';
import { ButtonNaked, theme } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getStationDetails } from '../../../services/stationService';
import {
  StationDetailResource,
  StationStatusEnum,
} from '../../../api/generated/portal/StationDetailResource';

const StationDetailPage = () => {
  const { t } = useTranslation();

  const { stationId } = useParams<{ stationId: string }>();
  const [stationDetail, setStationDetail] = useState<StationDetailResource>();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    getStationDetails(stationId)
      .then((stationDetailData) => {
        console.log('RESPONSE', stationDetailData);
        setStationDetail(stationDetailData);
      })
      .catch((reason) => console.log(reason));
  }, []);

  const hidePassword = 'XXXXXXXXXXXXXX';

  const showOrHidePassword = () => {
    if (showPassword) {
      return stationDetail?.password;
    }
    return hidePassword;
  };

  const formatedDate = (date: Date | undefined) => {
    if (date) {
      return date.toLocaleString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
    return null;
  };

  return (
    <Grid container justifyContent={'center'} mb={5}>
      <Grid item p={3} xs={8}>
        <Stack direction="row" mt={2}>
          <ButtonNaked
            size="small"
            component="button"
            onClick={() => history.back()}
            startIcon={<ArrowBack />}
            sx={{ color: 'primary.main', mr: '20px' }}
            weight="default"
          >
            {t('general.exit')}
          </ButtonNaked>
          <Breadcrumbs>
            <Typography>{t('general.Stations')}</Typography>
            <Typography variant="body2" color={'#17324D'} sx={{ fontWeight: 'fontWeightMedium' }}>
              {t('stationDetailPage.detail', {
                code: stationDetail?.stationCode,
              })}
            </Typography>
          </Breadcrumbs>
        </Stack>
        <Grid container mt={3}>
          <Grid item xs={6} mb={5}>
            <TitleBox
              title={stationDetail?.stationCode ?? ''}
              mbTitle={2}
              variantTitle="h4"
              variantSubTitle="body1"
            />
            <Typography mb={5} component={'span'} fontWeight={'fontWeightMedium'} color={'#5C6F82'}>
              {t('stationDetailPage.createdAt', {
                data: formatedDate(stationDetail?.activationDate),
              })}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Stack spacing={2} direction="row" flexWrap={'wrap'} justifyContent={'flex-end'}>
              {stationDetail?.stationStatus === StationStatusEnum.ON_REVISION ? (
                <Button
                  color="primary"
                  style={{
                    color: '#FFFFFF',
                    borderColor: theme.palette.error.dark,
                  }}
                  variant="contained"
                  onClick={() => {}} // TODO FixMe
                >
                  {t('stationDetailPage.actionButtons.edit')}
                </Button>
              ) : stationDetail?.stationStatus === StationStatusEnum.TO_BE_CORRECTED ? (
                <Button
                  color="primary"
                  style={{
                    color: '#FFFFFF',
                    borderColor: theme.palette.error.dark,
                  }}
                  variant="contained"
                  onClick={() => {}} // TODO FixMe
                >
                  {t('stationDetailPage.actionButtons.revise')}
                </Button>
              ) : (
                <>
                  <Button
                    style={{
                      color: theme.palette.error.dark,
                      borderColor: theme.palette.error.dark,
                    }}
                    variant="outlined"
                    onClick={() => {}} // TODO FixMe
                  >
                    {t('stationDetailPage.actionButtons.askElimination')}
                  </Button>
                  <Button
                    style={{
                      color: theme.palette.primary.main,
                      borderColor: theme.palette.primary.main,
                    }}
                    variant="outlined"
                    onClick={() => {}} // TODO FixMe
                  >
                    {t('stationDetailPage.actionButtons.duplicate')}
                  </Button>
                  <Button
                    color="primary"
                    style={{
                      color: 'background.paper',
                      borderColor: theme.palette.error.dark,
                    }}
                    variant="contained"
                    onClick={() => {}} // TODO FixMe
                  >
                    {t('stationDetailPage.actionButtons.edit')}
                  </Button>
                </>
              )}
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
              <Typography variant="subtitle2">{t('stationDetailPage.state')}</Typography>
            </Grid>
            <Grid item xs={9} textAlign="right">
              <Chip
                size="medium"
                sx={{
                  backgroundColor:
                    stationDetail?.stationStatus === StationStatusEnum.ACTIVE
                      ? 'primary.main'
                      : stationDetail?.stationStatus === StationStatusEnum.ON_REVISION
                      ? '#EEEEEE'
                      : 'warning.light',
                  color:
                    stationDetail?.stationStatus === StationStatusEnum.ACTIVE
                      ? 'background.paper'
                      : 'text.primary',
                }}
                label={
                  stationDetail?.stationStatus === StationStatusEnum.ACTIVE
                    ? t('stationDetailPage.states.active')
                    : stationDetail?.stationStatus === StationStatusEnum.ON_REVISION
                    ? t('stationDetailPage.states.revision')
                    : t('stationDetailPage.states.needCorrection')
                }
              />
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
                    {stationDetail?.stationCode}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('stationDetailPage.version')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.version}
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
                  <Typography variant="body2">{t('stationDetailPage.password')}</Typography>
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
                  <>
                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                      {showOrHidePassword()}
                    </Typography>
                    <IconButton
                      style={{
                        border: 'none !important',
                        marginLeft: '42px',
                      }}
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword ? (
                        <VisibilityIcon color="primary" sx={{ width: '80%' }} />
                      ) : (
                        <VisibilityOff color="primary" sx={{ width: '80%' }} />
                      )}
                    </IconButton>
                  </>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('stationDetailPage.redirectUrl')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.redirectPath}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('stationDetailPage.activationDate')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {formatedDate(stationDetail?.activationDate)}
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Typography variant="sidenav">{t('stationDetailPage.target')}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('stationDetailPage.address')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.targetPath}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('stationDetailPage.service')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.service}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('stationDetailPage.port')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.port}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  mt={2}
                  sx={{ display: 'flex', justifyContent: 'space-between', marginRight: 10 }}
                >
                  <Typography variant="sidenav">{t('stationDetailPage.associatesEC')}</Typography>
                  <ButtonNaked
                    component="button"
                    onClick={() => ''} // TODO
                    disabled={stationDetail?.stationStatus !== StationStatusEnum.ACTIVE}
                    color="primary"
                    endIcon={<ManageAccounts />}
                    size="medium"
                  >
                    {t('stationDetailPage.manageEC')}
                  </ButtonNaked>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('stationDetailPage.associates')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.associatedCreditorInstitutions}
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
                    {formatedDate(stationDetail?.modifiedAt)}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.operatedBy')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.operatedBy}
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

export default StationDetailPage;
