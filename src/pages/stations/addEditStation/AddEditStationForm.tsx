/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import { ButtonNaked, theme } from '@pagopa/mui-italia';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import {
  Breadcrumbs,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack, Badge as BadgeIcon, MenuBook } from '@mui/icons-material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useHistory } from 'react-router-dom';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { StationOnCreation } from '../../../model/Station';
import { RedirectProtocolEnum } from '../../../api/generated/portal/StationDetailsDto';
import ROUTES from '../../../routes';
import AddEditStationFormSectionTitle from '../addEditStation/AddEditStationFormSectionTitle';
import ConfirmModal from '../../components/ConfirmModal';
import { createStation } from '../../../services/stationService';
import { LOADING_TASK_STATION_ADD_EDIT } from '../../../utils/constants';

const AddEditStationForm = () => {
  const initialFormData: StationOnCreation = {
    stationCode: '',
    primitiveVersion: '',
    redirectProtocol: RedirectProtocolEnum.HTTPS,
    redirectPort: 0,
    redirectIp: '',
    redirectPath: '',
    redirectQueryString: '',
    targetAddress: '',
    targetService: '',
    targetPort: 0,
  };

  const inputGroupStyle = {
    borderRadius: 1,
    border: 1,
    borderColor: theme.palette.divider,
    p: 3,
    mb: 3,
  };

  const { t } = useTranslation();
  const history = useHistory();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_STATION_ADD_EDIT);
  const goBack = () => history.push(ROUTES.HOME);

  const validatePortRange = (redirectPort: number | undefined) => {
    if (redirectPort) {
      return redirectPort > 0 && redirectPort < 65556 ? false : true;
    }
    return false;
  };

  const validate = (values: StationOnCreation) =>
    Object.fromEntries(
      Object.entries({
        primitiveVersion: !values.primitiveVersion ? 'Campo obbligatorio' : undefined,
        redirectProtocol: !values.redirectProtocol ? 'Campo obbligatorio' : undefined,
        redirectPort: !values.redirectPort
          ? 'Campo obbligatorio'
          : validatePortRange(values.redirectPort)
          ? t('addEditStationPage.validation.overPort')
          : undefined,
        redirectIp: !values.redirectIp ? 'Campo obbligatorio' : undefined,
        redirectPath: !values.redirectPath ? 'Campo obbligatorio' : undefined,
        redirectQueryString: !values.redirectQueryString ? 'Campo obbligatorio' : undefined,
        targetAddress: !values.targetAddress ? 'Campo obbligatorio' : undefined,
        targetService: !values.targetService ? 'Campo obbligatorio' : undefined,
        targetPort: !values.targetPort
          ? 'Campo obbligatorio'
          : validatePortRange(values.targetPort)
          ? t('addEditStationPage.validation.overPort')
          : undefined,
      }).filter(([_key, value]) => value)
    );

  const formik = useFormik<StationOnCreation>({
    initialValues: initialFormData,
    validate,
    onSubmit: (values) => {
      setShowConfirmModal(false);
      setLoading(true);
      createStation(values)
        .then((res) => {
          console.log('response', res);
          history.push(ROUTES.STATIONS, {
            alertSuccessMessage: t('addEditStationPage.successMessage'),
          });
        })
        .catch((error) => {
          addError({
            id: 'ADD_EDIT_STATION',
            blocking: false,
            error,
            techDescription: `An error occurred while adding/editing station`,
            toNotify: true,
            displayableTitle: t('addEditStationPage.errorMessageTitle'),
            displayableDescription: t('addEditStationPage.errorMessageDesc'),
            component: 'Toast',
          });
        })
        .finally(() => setLoading(false));
    },
    validateOnChange: true,
    enableReinitialize: true,
  });

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
            <Typography color={'#A2ADB8'}>{t(`addEditStationPage.create.breadcrumb`)}</Typography>
          </Breadcrumbs>
        </Stack>
        <TitleBox
          title={t(`addEditStationPage.create.title`)}
          subTitle={t(`addEditChannelPage.create.subtitle`)}
          mbTitle={2}
          mtTitle={4}
          mbSubTitle={3}
          variantTitle="h4"
          variantSubTitle="body1"
        />
        <Paper
          elevation={0}
          sx={{
            borderRadius: 1,
            p: 3,
            minWidth: '100%',
          }}
        >
          <Typography variant="h6" mb={3}>
            {t('addEditStationPage.title')}
          </Typography>

          <Box>
            <Box sx={inputGroupStyle}>
              <AddEditStationFormSectionTitle
                title={t('addEditStationPage.addForm.sections.registry')}
                icon={<BadgeIcon />}
                isRequired
              />
              <Grid container spacing={2} mt={1}>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="stationCode"
                    name="stationCode"
                    label={t('addEditStationPage.addForm.fields.stationCode')}
                    size="small"
                    value={formik.values.stationCode}
                    onChange={(e) => formik.handleChange(e)}
                    error={formik.touched.stationCode && Boolean(formik.errors.stationCode)}
                    helperText={formik.touched.stationCode && formik.errors.stationCode}
                    inputProps={{
                      'data-testid': 'station-code-test',
                    }}
                  />
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="primitiveVersion"
                    name="primitiveVersion"
                    label={t('addEditStationPage.addForm.fields.primitiveVersion')}
                    placeholder={t('addEditStationPage.addForm.fields.primitiveVersion')}
                    size="small"
                    InputLabelProps={{ shrink: formik.values.primitiveVersion ? true : false }}
                    value={formik.values.primitiveVersion}
                    onChange={(e) => formik.handleChange(e)}
                    error={
                      formik.touched.primitiveVersion && Boolean(formik.errors.primitiveVersion)
                    }
                    helperText={formik.touched.primitiveVersion && formik.errors.primitiveVersion}
                    inputProps={{
                      'data-testid': 'primitive-version-test',
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box sx={inputGroupStyle}>
              <AddEditStationFormSectionTitle
                title={t('addEditStationPage.addForm.sections.redirect')}
                icon={<MenuBook />}
                isRequired
              />
              <Grid container spacing={2} mt={1}>
                <Grid container item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel size="small">
                      {t('addEditStationPage.addForm.fields.redirectProtocol')}
                    </InputLabel>
                    <Select
                      fullWidth
                      id="redirectProtocol"
                      name="redirectProtocol"
                      label={t('addEditStationPage.addForm.fields.redirectProtocol')}
                      size="small"
                      defaultValue={formik.values.redirectProtocol}
                      value={
                        formik.values.redirectProtocol === RedirectProtocolEnum.HTTPS
                          ? 'HTTPS'
                          : 'HTTP'
                      }
                      onChange={(e) => formik.handleChange(e)}
                      error={
                        formik.touched.redirectProtocol && Boolean(formik.errors.redirectProtocol)
                      }
                      inputProps={{
                        'data-testid': 'redirect-protocol-test',
                      }}
                    >
                      {['HTTPS', 'HTTP'].map((r) => (
                        <MenuItem key={r} value={r}>
                          {r}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="redirectPort"
                    name="redirectPort"
                    InputLabelProps={{ shrink: formik.values.redirectPort ? true : false }}
                    inputProps={{
                      step: 1,
                      type: 'number',
                      min: 0,
                      max: 65556,
                      'data-testid': 'redirect-port-test',
                    }}
                    label={t('addEditStationPage.addForm.fields.redirectPort')}
                    placeholder={t('addEditStationPage.addForm.fields.redirectPort')}
                    size="small"
                    value={formik.values.redirectPort === 0 ? '' : formik.values.redirectPort}
                    onChange={(e) => formik.handleChange(e)}
                    error={formik.touched.redirectPort && Boolean(formik.errors.redirectPort)}
                    helperText={
                      formik.touched.redirectPort &&
                      formik.errors.redirectPort &&
                      t('addEditStationPage.validation.overPort')
                    }
                  />
                </Grid>

                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="redirectPath"
                    name="redirectPath"
                    label={t('addEditStationPage.addForm.fields.redirectService')}
                    size="small"
                    value={formik.values.redirectPath}
                    onChange={(e) => formik.handleChange(e)}
                    error={formik.touched.redirectPath && Boolean(formik.errors.redirectPath)}
                    helperText={formik.touched.redirectPath && formik.errors.redirectPath}
                    inputProps={{
                      'data-testid': 'redirect-service-test',
                    }}
                  />
                </Grid>

                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="redirectIp"
                    name="redirectIp"
                    label={t('addEditStationPage.addForm.fields.redirectIp')}
                    size="small"
                    value={formik.values.redirectIp}
                    onChange={(e) => formik.handleChange(e)}
                    error={formik.touched.redirectIp && Boolean(formik.errors.redirectIp)}
                    helperText={formik.touched.redirectIp && formik.errors.redirectIp}
                    inputProps={{
                      'data-testid': 'redirect-ip-test',
                    }}
                  />
                </Grid>

                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="redirectQueryString"
                    name="redirectQueryString"
                    label={t('addEditStationPage.addForm.fields.redirectParameters')}
                    size="small"
                    value={formik.values.redirectQueryString}
                    onChange={(e) => formik.handleChange(e)}
                    error={
                      formik.touched.redirectQueryString &&
                      Boolean(formik.errors.redirectQueryString)
                    }
                    helperText={
                      formik.touched.redirectQueryString && formik.errors.redirectQueryString
                    }
                    inputProps={{
                      'data-testid': 'redirect-parameters-test',
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box sx={inputGroupStyle}>
              <AddEditStationFormSectionTitle
                title={t('addEditStationPage.addForm.sections.target')}
                icon={<MenuBook />}
                isRequired
              />
              <Grid container spacing={2} mt={1}>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="targetAddress"
                    name="targetAddress"
                    label={t('addEditStationPage.addForm.fields.targetAddress')}
                    size="small"
                    value={formik.values.targetAddress}
                    onChange={(e) => formik.handleChange(e)}
                    error={formik.touched.targetAddress && Boolean(formik.errors.targetAddress)}
                    helperText={formik.touched.targetAddress && formik.errors.targetAddress}
                    inputProps={{
                      'data-testid': 'target-address-test',
                    }}
                  />
                </Grid>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="targetService"
                    name="targetService"
                    label={t('addEditStationPage.addForm.fields.targetService')}
                    size="small"
                    value={formik.values.targetService}
                    onChange={(e) => formik.handleChange(e)}
                    error={formik.touched.targetService && Boolean(formik.errors.targetService)}
                    helperText={formik.touched.targetService && formik.errors.targetService}
                    inputProps={{
                      'data-testid': 'target-service-test',
                    }}
                  />
                </Grid>

                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="targetPort"
                    name="targetPort"
                    InputLabelProps={{ shrink: formik.values.targetPort ? true : false }}
                    inputProps={{
                      step: 1,
                      type: 'number',
                      min: 0,
                      max: 65556,
                      'data-testid': 'target-port-test',
                    }}
                    label={t('addEditStationPage.addForm.fields.targetPort')}
                    placeholder={t('addEditStationPage.addForm.fields.targetPort')}
                    size="small"
                    value={formik.values.targetPort === 0 ? '' : formik.values.targetPort}
                    onChange={(e) => formik.handleChange(e)}
                    error={formik.touched.targetPort && Boolean(formik.errors.targetPort)}
                    helperText={formik.touched.targetPort && formik.errors.targetPort}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>

        <Stack direction="row" justifyContent="space-between" mt={5}>
          <Stack display="flex" justifyContent="flex-start" mr={2}>
            <Button color="primary" variant="outlined" onClick={goBack}>
              {t('addEditStationPage.addForm.backButton')}
            </Button>
          </Stack>
          <Stack display="flex" justifyContent="flex-end">
            <Button
              onClick={() => setShowConfirmModal(true)}
              disabled={!formik.dirty || !formik.isValid}
              color="primary"
              variant="contained"
              type="submit"
            >
              {t('addEditStationPage.addForm.continueButton')}
            </Button>
          </Stack>
        </Stack>
        <ConfirmModal
          title={t('addEditStationPage.confirmModal.title')}
          message={
            <Trans i18nKey="addEditStationPage.confirmModal.message">
              Un operatore PagoPA revisionerà le informazioni inserite nella stazione prima di
              approvare. Riceverai una notifica a revisione completata.
              <br />
            </Trans>
          }
          openConfirmModal={showConfirmModal}
          onConfirmLabel={t('addEditStationPage.confirmModal.confirmButton')}
          onCloseLabel={t('addEditStationPage.confirmModal.cancelButton')}
          handleCloseConfirmModal={() => setShowConfirmModal(false)}
          handleConfrimSubmit={() => {
            formik.handleSubmit();
            console.log('On Submit');
          }}
        />
      </Grid>
    </Grid>
  );
};

export default AddEditStationForm;
