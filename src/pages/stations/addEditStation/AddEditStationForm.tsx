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
import { SessionModal, TitleBox } from '@pagopa/selfcare-common-frontend';
import { useHistory } from 'react-router-dom';
import { RedirectProtocolEnum, StationOnCreation } from '../../../model/Station';
// import { useAppSelector } from '../../../redux/hooks';
// import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import ROUTES from '../../../routes';
import AddEditStationFormSectionTitle from './AddEditStationFormSectionTitle';

const initialFormData = {
  stationCode: '',
  primitiveVersion: '',
  redirectProtocol: undefined,
  redirectPort: undefined,
  redirectIp: '',
  redirectService: '',
  redirectParameters: '',
  targetAddress: '',
  targetService: '',
  targetPort: undefined,
};

const inputGroupStyle = {
  borderRadius: 1,
  border: 1,
  borderColor: theme.palette.divider,
  p: 3,
  mb: 3,
};

// eslint-disable-next-line sonarjs/cognitive-complexity, complexity
function AddEditStationForm() {
  const { t } = useTranslation();
  const history = useHistory();
  //   const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const goBack = () => history.push(ROUTES.HOME);

  const validatePortRange = (redirectPort: number | undefined) => {
    if (redirectPort) {
      return redirectPort > 0 && redirectPort < 65556 ? false : true;
    }
    return false;
  };

  const validate = (values: Partial<StationOnCreation>) =>
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
        redirectService: !values.redirectService ? 'Campo obbligatorio' : undefined,
        redirectParameters: !values.redirectParameters ? 'Campo obbligatorio' : undefined,
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
    onSubmit: () => {
      setShowConfirmModal(true);
    },
    validateOnChange: true,
    enableReinitialize: true,
  });

  return (
    <>
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

          <form onSubmit={formik.handleSubmit} style={{ minWidth: '100%' }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 1,
                p: 3,
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
                        disabled
                        value={formik.values.stationCode}
                        onChange={formik.handleChange}
                        error={formik.touched.stationCode && Boolean(formik.errors.stationCode)}
                        helperText={formik.touched.stationCode && formik.errors.stationCode}
                      />
                    </Grid>
                    <Grid container item xs={6}>
                      <TextField
                        fullWidth
                        id="primitiveVersion"
                        name="primitiveVersion"
                        label={t('addEditStationPage.addForm.fields.primitiveVersion')}
                        size="small"
                        value={formik.values.primitiveVersion}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.primitiveVersion && Boolean(formik.errors.primitiveVersion)
                        }
                        helperText={
                          formik.touched.primitiveVersion && formik.errors.primitiveVersion
                        }
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
                          onChange={formik.handleChange}
                          error={
                            formik.touched.redirectProtocol &&
                            Boolean(formik.errors.redirectProtocol)
                          }
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
                        type="number"
                        InputLabelProps={{ shrink: formik.values.redirectPort ? true : false }}
                        inputProps={{ min: 0, max: 65556 }}
                        label={t('addEditStationPage.addForm.fields.redirectPort')}
                        size="small"
                        value={formik.values.redirectPort}
                        onChange={formik.handleChange}
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
                        id="redirectService"
                        name="redirectService"
                        label={t('addEditStationPage.addForm.fields.redirectService')}
                        size="small"
                        value={formik.values.redirectService}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.redirectService && Boolean(formik.errors.redirectService)
                        }
                        helperText={formik.touched.redirectService && formik.errors.redirectService}
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
                        onChange={formik.handleChange}
                        error={formik.touched.redirectIp && Boolean(formik.errors.redirectIp)}
                        helperText={formik.touched.redirectIp && formik.errors.redirectIp}
                      />
                    </Grid>

                    <Grid container item xs={6}>
                      <TextField
                        fullWidth
                        id="redirectParameters"
                        name="redirectParameters"
                        label={t('addEditStationPage.addForm.fields.redirectParameters')}
                        size="small"
                        value={formik.values.redirectParameters}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.redirectParameters &&
                          Boolean(formik.errors.redirectParameters)
                        }
                        helperText={
                          formik.touched.redirectParameters && formik.errors.redirectParameters
                        }
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
                      <TextField
                        fullWidth
                        id="targetAddress"
                        name="targetAddress"
                        label={t('addEditStationPage.addForm.fields.targetAddress')}
                        size="small"
                        value={formik.values.targetAddress}
                        onChange={formik.handleChange}
                        error={formik.touched.targetAddress && Boolean(formik.errors.targetAddress)}
                        helperText={formik.touched.targetAddress && formik.errors.targetAddress}
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
                        onChange={formik.handleChange}
                        error={formik.touched.targetService && Boolean(formik.errors.targetService)}
                        helperText={formik.touched.targetService && formik.errors.targetService}
                      />
                    </Grid>

                    <Grid container item xs={6}>
                      <TextField
                        fullWidth
                        id="targetPort"
                        name="targetPort"
                        type="number"
                        InputLabelProps={{ shrink: formik.values.targetPort ? true : false }}
                        inputProps={{ min: 0, max: 65556 }}
                        label={t('addEditStationPage.addForm.fields.targetPort')}
                        size="small"
                        value={formik.values.targetPort}
                        onChange={formik.handleChange}
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
                  // onClick={()=>() /* handleSubmit */}
                  disabled={!formik.dirty || !formik.isValid}
                  color="primary"
                  variant="contained"
                  type="submit"
                >
                  {t('addEditStationPage.addForm.continueButton')}
                </Button>
              </Stack>
            </Stack>
          </form>
          <SessionModal
            open={showConfirmModal}
            title={t('addEditStationPage.confirmModal.title')}
            message={
              <Trans i18nKey="addEditStationPage.confirmModal.message">
                Un operatore PagoPA revisionerà le informazioni inserite nel canale prima di
                approvare. Riceverai una notifica a revisione completata.
                <br />
              </Trans>
            }
            onConfirmLabel={t('addEditStationPage.confirmModal.confirmButton')}
            onCloseLabel={t('addEditStationPage.confirmModal.cancelButton')}
            onConfirm={() => console.log('confirmed')}
            handleClose={() => {
              setShowConfirmModal(false);
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default AddEditStationForm;
