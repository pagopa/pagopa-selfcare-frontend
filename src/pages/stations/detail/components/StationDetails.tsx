import { ArrowBack, ManageAccounts, VisibilityOff } from '@mui/icons-material';
import {
  Grid,
  Stack,
  Breadcrumbs,
  Typography,
  Paper,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
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
import DetailButtonsStation from './DetailButtonsStation';

type Prop = {
  stationDetail?: StationDetailResource;
  formatedDate: (date: Date | undefined) => string | null;
  goBack: () => void;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const StationDetails = ({ stationDetail, formatedDate, goBack }: Prop) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const hidePassword = 'XXXXXXXXXXXXXX';
  const { stationId } = useParams<{ stationId: string }>();

  const showOrHidePassword = () => {
    if (showPassword) {
      return stationDetail?.password;
    }
    return hidePassword;
  };

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
            <Typography mb={5} component={'span'} fontWeight={'fontWeightMedium'} color={'#5C6F82'}>
              {t('stationDetailPage.createdAt', {
                data: formatedDate(stationDetail?.createdAt),
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
                  <Typography variant="body2">{t('stationDetailPage.version')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.version ?? '-'}
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
                  {stationDetail?.password ? (
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
                    {formatedDate(stationDetail?.activationDate) ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Typography variant="sidenav">{t('stationDetailPage.redirect')}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('stationDetailPage.protocol')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.redirectProtocol}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('stationDetailPage.service')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.redirectPort}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('stationDetailPage.port')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.redirectPath}
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
                    {stationDetail?.targetHost}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('stationDetailPage.service')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.targetPath}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('stationDetailPage.port')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.targetPort}
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Typography variant="sidenav">
                    {t('stationDetailPage.POFTargetService')}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('stationDetailPage.address')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.targetHostPof ? stationDetail.targetHostPof : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('stationDetailPage.service')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.targetPathPof ? stationDetail.targetPathPof : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('stationDetailPage.port')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {stationDetail?.targetPortPof ? stationDetail.targetPortPof : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} mt={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="sidenav">{t('stationDetailPage.associatesEC')}</Typography>
                  <ButtonNaked
                    component={Link}
                    to={generatePath(ROUTES.STATION_EC_LIST, {
                      stationId: stationDetail?.stationCode,
                    })}
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
                    {'-'}
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
