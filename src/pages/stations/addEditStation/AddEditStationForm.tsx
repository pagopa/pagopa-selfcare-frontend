import { ButtonNaked, theme } from '@pagopa/mui-italia';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Breadcrumbs, Button, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack, Badge as BadgeIcon } from '@mui/icons-material';
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
  redirectProtocol: RedirectProtocolEnum.HTTPS,
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

function AddEditStationForm() {
  const { t } = useTranslation();
  const history = useHistory();
  //   const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const goBack = () => history.push(ROUTES.HOME);

  const formik = useFormik<StationOnCreation>({
    initialValues: initialFormData,
    onSubmit: () => {
      setShowConfirmModal(true);
    },
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
              <Typography color={'#A2ADB8'}>
                {t(`addEditStationPage.create.breadcrumbs`)}
              </Typography>
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
                Configurazione della stazione
              </Typography>

              <Box>
                <Box sx={inputGroupStyle}>
                  <AddEditStationFormSectionTitle
                    title={t('addEditStationPage.addForm.sections.registry')}
                    icon={<BadgeIcon fontSize="small" />}
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
                      />
                    </Grid>
                    <Grid container item xs={6}>
                      <TextField
                        fullWidth
                        id="primitiveVersion"
                        name="primitiveVersion"
                        disabled
                        label={t('addEditStationPage.addForm.fields.primitiveVersion')}
                        size="small"
                        value={formik.values.primitiveVersion}
                        onChange={formik.handleChange}
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
