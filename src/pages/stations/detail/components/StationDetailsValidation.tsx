import { Alert, Box, Button, Divider, Grid, IconButton, Stack, TextField } from '@mui/material';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { ButtonNaked } from '@pagopa/mui-italia';
import { generatePath, Link, useHistory, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ArrowBack, VisibilityOff } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  StationDetailResource,
  WrapperStatusEnum,
} from '../../../../api/generated/portal/StationDetailResource';
import { StatusChip } from '../../../../components/StatusChip';
import { IProxyConfig, ProxyConfigs, StationFormAction } from '../../../../model/Station';
import ROUTES from '../../../../routes';
import { ENV } from '../../../../utils/env';
import GenericModal from '../../../../components/Form/GenericModal';
import { updateWrapperStationWithOperatorReview } from '../../../../services/stationService';
import { LOADING_TASK_STATION_DETAILS_REQUEST_EDIT } from '../../../../utils/constants';

const GetAlert = ({ stationDetail }: { stationDetail?: StationDetailResource }) => {
  const { t } = useTranslation();
  if (stationDetail?.wrapperStatus !== WrapperStatusEnum.APPROVED) {
    const isToBeValidated =
      stationDetail?.wrapperStatus === WrapperStatusEnum.TO_CHECK ||
      stationDetail?.wrapperStatus === WrapperStatusEnum.TO_CHECK_UPDATE;
    return (
      <Box my={2}>
        <Alert severity={isToBeValidated ? 'warning' : 'info'} variant="outlined" sx={{ py: 2 }}>
          {!isToBeValidated && (
            <Typography fontWeight={'fontWeightMedium'}>
              {t('stationDetailPageValidation.alert.toFixTitle')}
            </Typography>
          )}
          <Typography>
            {!isToBeValidated && stationDetail?.note?.trim()
              ? stationDetail.note
              : t(
                  `stationDetailPageValidation.alert.${
                    isToBeValidated ? 'toCheckMessage' : 'toFixMessage'
                  }`
                )}
          </Typography>
        </Alert>
      </Box>
    );
  }
  return null;
};

const ModalContent = ({
  setShowModal,
  stationDetail,
  setStationDetail,
}: {
  setShowModal: (value: boolean) => void;
} & Props) => {
  const { t } = useTranslation();

  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_STATION_DETAILS_REQUEST_EDIT);

  const [input, setInput] = useState<string>(stationDetail?.note ?? '');

  const sendEditRequest = () => {
    setLoading(true);
    updateWrapperStationWithOperatorReview({
      stationCode: stationDetail?.stationCode ?? '',
      ciTaxCode: stationDetail?.brokerCode ?? '',
      note: input,
    })
      .then((data: StationDetailResource) => {
        setStationDetail(data);
      })
      .catch((reason) =>
        addError({
          id: 'PUT_STATION_DETAILS_REQUEST_EDIT',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while getting updating the station with operator's note`,
          toNotify: true,
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t('stationDetailPageValidation.modal.error'),
          component: 'Toast',
        })
      )
      .finally(() => {
        setShowModal(false);
        setLoading(false);
      });
  };
  return (
    <>
      <Typography variant="h6">{t('stationDetailPageValidation.modal.title')}</Typography>
      <Typography variant="body1" sx={{ my: 2 }}>
        {t('stationDetailPageValidation.modal.subtitle')}
      </Typography>
      <TextField
        fullWidth
        id="requestInput"
        name="requestInput"
        required
        multiline
        placeholder={t('stationDetailPageValidation.modal.placeholder')}
        size="small"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        helperText={t('stationDetailPageValidation.modal.helperText')}
        inputProps={{
          'data-testid': 'requestInput',
          maxLength: 200,
        }}
      />
      <Box display="flex" justifyContent={'flex-end'} mt={2}>
        <Button
          variant="outlined"
          sx={{ mr: 1 }}
          onClick={() => setShowModal(false)}
          data-testid="cancel-button-test"
        >
          {t('general.turnBack')}
        </Button>
        <Button
          variant="contained"
          onClick={() => sendEditRequest()}
          data-testid="confirm-button-test"
        >
          {t('general.confirmAndSend')}
        </Button>
      </Box>
    </>
  );
};

type Props = {
  stationDetail?: StationDetailResource;
  setStationDetail: (value: any) => void;
};

// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
const StationDetailsValidation = ({
  stationDetail,
  setStationDetail,
}: // eslint-disable-next-line sonarjs/cognitive-complexity
Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { stationId } = useParams<{ stationId: string }>();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const hidePassword = 'XXXXXXXXXXXXXX';
  const proxyAddresses = ProxyConfigs[ENV.ENV as keyof IProxyConfig];

  const showOrHidePassword = (password?: string) => {
    if (showPassword) {
      return password;
    }
    return hidePassword;
  };

  return (
    <div data-testid="station-detail-op">
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
          <Typography my={2}>{t('stationDetailPageValidation.subtitle')}</Typography>

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
              </>

              {stationDetail?.isConnectionSync && (
                <>
                  <>
                    <Grid item xs={12} mt={2}>
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
                  </>

                  <>
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
                </>
              )}
            </Grid>
          </Paper>

          {stationDetail?.pofService && (
            <Paper
              elevation={5}
              sx={{
                mt: 2,
                borderRadius: 4,
                p: 4,
              }}
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
            {t('channelDetailPage.createdOn')}{' '}
            <Typography component={'span'} fontWeight={'fontWeightMedium'}>
              {`${stationDetail?.createdAt?.toLocaleDateString('en-GB')} da ${
                stationDetail?.createdBy
              }`}
            </Typography>
          </Typography>
          <Stack spacing={2} direction="row" flexWrap={'wrap'} justifyContent={'flex-end'}>
            {(stationDetail?.wrapperStatus === WrapperStatusEnum.TO_CHECK ||
              stationDetail?.wrapperStatus === WrapperStatusEnum.TO_CHECK_UPDATE) && (
              <Button variant="outlined" onClick={() => setShowModal(true)}>
                {t('stationDetailPage.stationOptions.requestEdit')}
              </Button>
            )}
            <Button
              component={Link}
              to={() =>
                generatePath(ROUTES.STATION_EDIT, {
                  stationId,
                  actionId: StationFormAction.Edit,
                })
              }
              variant="contained"
              data-testid="edit-btn-ope-sts-approved"
            >
              {t(
                stationDetail?.wrapperStatus !== WrapperStatusEnum.APPROVED
                  ? 'stationDetailPage.stationOptions.approveAndValidate'
                  : 'general.modify'
              )}
            </Button>
          </Stack>
        </Grid>
      </Grid>
      {showModal && (
        <GenericModal
          openModal={showModal}
          renderContent={() => (
            <ModalContent
              setShowModal={setShowModal}
              setStationDetail={setStationDetail}
              stationDetail={stationDetail}
            />
          )}
        />
      )}
    </div>
  );
};
export default StationDetailsValidation;
