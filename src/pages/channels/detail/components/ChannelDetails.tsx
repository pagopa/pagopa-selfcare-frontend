import { ArrowBack, ManageAccounts } from '@mui/icons-material';
import { Grid, Stack, Breadcrumbs, Typography, Alert, Paper, Chip, Divider } from '@mui/material';
import { Box } from '@mui/system';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { Link, generatePath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  /*  ChannelDetailsDto, */ StatusEnum,
} from '../../../../api/generated/portal/ChannelDetailsDto';
import { BASE_ROUTE } from '../../../../routes';
import { useAppSelector } from '../../../../redux/hooks';
import { partiesSelectors } from '../../../../redux/slices/partiesSlice';
import ChannelDetailValidation from '../../channelDetailValidation/ChannelDetailValidation';
import { WrapperChannelDetailsDto } from '../../../../api/generated/portal/WrapperChannelDetailsDto';
import { WrapperEntitiesOperations } from '../../../../api/generated/portal/WrapperEntitiesOperations';
import DetailButtons from './DetailButtons';

type Props = {
  channelDetail?: WrapperChannelDetailsDto;
  channelDetailWrapper?: WrapperEntitiesOperations;
  channelId: string;
  goBack: () => void;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const ChannelDetails = ({ channelDetail, channelDetailWrapper, channelId, goBack }: Props) => {
  const { t } = useTranslation();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const isOperator = selectedParty?.roles[0].roleKey === 'operator';

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
              {t('channelDetailPage.detail')} {channelId}
            </Typography>
          </Breadcrumbs>
        </Stack>
        <Grid container mt={3}>
          <Grid item xs={6}>
            <TitleBox title={channelId} mbTitle={2} variantTitle="h4" variantSubTitle="body1" />
            <Typography mb={5} color="#5C6F82">
              {t('channelDetailPage.createdOn')}{' '}
              <Typography component={'span'} color="#5C6F82" fontWeight={600}>
                {`${formatedDate(channelDetailWrapper?.createdAt)} da ${
                  channelDetailWrapper?.createdBy
                }`}
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <DetailButtons channelDetails={channelDetail} goBack={goBack} />
          </Grid>
          {selectedParty?.roles[0].roleKey === 'operator' &&
          channelDetail.status === StatusEnum.TO_CHECK ? (
            <Grid item xs={12} sx={{ mb: 5 }}>
              <Alert severity="warning" variant="outlined">
                <Typography sx={{ py: 2 }}>{t('channelDetailPage.alertWarning')}</Typography>
              </Alert>
            </Grid>
          ) : null}
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
              {/* TODO: manage channel state chip */}
              <Chip
                size="medium"
                label={
                  channelDetail.status === StatusEnum.APPROVED
                    ? t('channelDetailPage.status.active')
                    : channelDetail.status === StatusEnum.TO_CHECK
                    ? t('channelDetailPage.status.revision')
                    : t('channelDetailPage.status.needCorrection')
                }
                sx={{
                  color: channelDetail.status === StatusEnum.APPROVED ? 'primary.main' : '',
                  backgroundColor:
                    channelDetail.status === StatusEnum.APPROVED
                      ? '#FFFFFF'
                      : channelDetail.status === StatusEnum.TO_CHECK
                      ? '#EEEEEE'
                      : '#FFD25E',
                }}
              />
            </Grid>
          </Grid>
          <Typography variant="h6" mb={1}>
            {t('channelDetailPage.channelConfiguration')}
          </Typography>
          <Typography variant="body2">{t('channelDetailPage.institutionInfo')}</Typography>
          <Divider sx={{ mt: 3 }}></Divider>

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
                  <Typography variant="body2">{t('channelDetailPage.targetIp')}</Typography>
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
                <Grid container xs={12} mb={3} mt={2}>
                  {channelDetail.payment_types && channelDetail.payment_types.length > 0
                    ? channelDetail.payment_types.map((e, i) => (
                        // eslint-disable-next-line react/jsx-key
                        <Grid
                          item
                          key={`grid${i}`}
                          xs={3}
                          sx={i === 0 ? { ml: 2, width: '100%' } : null}
                        >
                          <Chip key={`chip${i}`} color="primary" label={`${e}`} />
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
                    to={generatePath(`${BASE_ROUTE}/channels/${channelId}/psp-list`)}
                    disabled={!(channelDetail.status === StatusEnum.APPROVED)}
                    color="primary"
                    endIcon={<ManageAccounts />}
                    size="medium"
                  >
                    {t('channelDetailPage.changeHistory')}
                  </ButtonNaked>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.associated')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {/* TODO: TODO: get from channelDetail when will be available */}
                    {0}
                  </Typography>
                </Grid>
                {/* TODO: get from channelDetail when will be available */}
                <Grid item xs={12} mt={2}>
                  <Typography variant="sidenav">{t('channelDetailPage.changes')}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.lastChange')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {typeof channelDetailWrapper?.wrapperEntityOperationsSortedList !== 'undefined'
                      ? formatedDate(
                          channelDetailWrapper?.wrapperEntityOperationsSortedList[0].modifiedAt
                        )
                      : undefined}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{t('channelDetailPage.operatedBy')}</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body2" fontWeight={600}>
                    {typeof channelDetailWrapper?.wrapperEntityOperationsSortedList !== 'undefined'
                      ? channelDetailWrapper?.wrapperEntityOperationsSortedList[0].modifiedByOpt
                      : undefined}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
      {isOperator ? <ChannelDetailValidation channelDetails={channelDetail} /> : null}
    </Grid>
  ) : (
    <></>
  );
};

export default ChannelDetails;
