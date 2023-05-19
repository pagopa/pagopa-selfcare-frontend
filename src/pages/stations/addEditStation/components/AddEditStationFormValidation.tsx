import { FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  Paper,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Box } from '@mui/system';
import { Badge as BadgeIcon, MenuBook } from '@mui/icons-material';
import { StationOnCreation } from '../../../../model/Station';
import AddEditStationFormSectionTitle from '../AddEditStationFormSectionTitle';
import { Protocol4ModEnum, ProtocolEnum } from '../../../../api/generated/portal/StationDetailsDto';

type Props = {
  formik: FormikProps<StationOnCreation>;
  handleChangeNumberOnly: (
    e: React.ChangeEvent<any>,
    field: string,
    formik: FormikProps<StationOnCreation>
  ) => void;
  inputGroupStyle: any;
};

// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
const AddEdiitStationFormValidation = ({
  formik,
  handleChangeNumberOnly,
  inputGroupStyle,
}: // eslint-disable-next-line sonarjs/cognitive-complexity
Props) => {
  const { t } = useTranslation();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 1,
        p: 3,
        minWidth: '100%',
      }}
    >
      <Typography variant="h6" mb={3}>
        {t('addEditStationPage.addFormValidation.title')}
      </Typography>

      <Typography variant="body2" mb={3}>
        {t('addEditStationPage.addFormValidation.subtitle')}
      </Typography>

      <Box>
        <Box sx={inputGroupStyle}>
          <AddEditStationFormSectionTitle
            title={t('addEditStationPage.addFormValidation.sections.registry')}
            icon={<BadgeIcon />}
          />
          <Grid container spacing={2} mt={1}>
            <Grid container item xs={6}>
              <TextField
                type="number"
                fullWidth
                id="version"
                name="version"
                InputLabelProps={{ shrink: formik.values.version ? true : false }}
                inputProps={{
                  'data-testid': 'version-test',
                }}
                label={t('addEditStationPage.addFormValidation.fields.version')}
                placeholder={t('addEditStationPage.addForm.fields.version')}
                size="small"
                value={formik.values.version === 0 ? '' : formik.values.version}
                onChange={(e) => handleChangeNumberOnly(e, 'version', formik)}
                error={formik.touched.version && Boolean(formik.errors.version)}
                helperText={formik.touched.version && formik.errors.version}
              />
            </Grid>
            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label={t('addEditStationPage.addFormValidation.fields.password')}
                placeholder={t('addEditStationPage.addFormValidation.fields.password')}
                size="small"
                value={formik.values.password}
                onChange={(e) => formik.handleChange(e)}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                inputProps={{
                  'data-testid': 'password-test',
                }}
              />
            </Grid>
            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="newPassword"
                name="newPassword"
                label={t('addEditStationPage.addFormValidation.fields.password')}
                placeholder={t('addEditStationPage.addFormValidation.fields.password')}
                size="small"
                value={formik.values.newPassword}
                onChange={(e) => formik.handleChange(e)}
                error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                helperText={formik.touched.newPassword && formik.errors.newPassword}
                inputProps={{
                  'data-testid': 'new-password-test',
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <Box sx={inputGroupStyle}>
          <AddEditStationFormSectionTitle
            title={t('addEditStationPage.addFormValidation.sections.endpoint')}
            icon={<MenuBook />}
          />
          <Grid container spacing={2} mt={1}>
            <Grid container item xs={6}>
              <FormControl fullWidth>
                <InputLabel size="small">
                  {t('addEditStationPage.addFormValidation.fields.protocol')}
                </InputLabel>
                <Select
                  fullWidth
                  id="protocol"
                  name="protocol"
                  label={t('addEditStationPage.addFormValidation.fields.protocol')}
                  size="small"
                  defaultValue={formik.values.protocol}
                  value={
                    formik.values.protocol === undefined
                      ? ''
                      : formik.values.protocol === ProtocolEnum.HTTPS
                      ? 'HTTPS'
                      : 'HTTP'
                  }
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.protocol && Boolean(formik.errors.protocol)}
                  inputProps={{
                    'data-testid': 'protocol-test',
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
                id="ip"
                name="ip"
                label={t('addEditStationPage.addFormValidation.fields.ip')}
                size="small"
                value={formik.values.ip}
                onChange={(e) => formik.handleChange(e)}
                error={formik.touched.ip && Boolean(formik.errors.ip)}
                helperText={formik.touched.ip && formik.errors.ip}
                inputProps={{
                  'data-testid': 'ip-test',
                }}
              />
            </Grid>

            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="port"
                name="port"
                InputLabelProps={{ shrink: formik.values.port ? true : false }}
                inputProps={{
                  step: 1,
                  min: 0,
                  max: 65556,
                  'data-testid': 'port-test',
                }}
                label={t('addEditStationPage.addFormValidation.fields.port')}
                placeholder={t('addEditStationPage.addForm.fields.port')}
                size="small"
                value={formik.values.port === 0 ? '' : formik.values.port}
                onChange={(e) => handleChangeNumberOnly(e, 'port', formik)}
                error={formik.touched.port && Boolean(formik.errors.port)}
                helperText={
                  formik.touched.port &&
                  formik.errors.port &&
                  t('addEditStationPage.validation.overPort')
                }
              />
            </Grid>

            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="pofService"
                name="pofService"
                label={t('addEditStationPage.addFormValidation.fields.servicePof')}
                size="small"
                value={formik.values.pofService}
                onChange={(e) => formik.handleChange(e)}
                error={formik.touched.pofService && Boolean(formik.errors.pofService)}
                helperText={formik.touched.pofService && formik.errors.pofService}
                inputProps={{
                  'data-testid': 'pof-service-test',
                }}
              />
            </Grid>

            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="service"
                name="service"
                label={t('addEditStationPage.addFormValidation.fields.serviceNmp')}
                size="small"
                value={formik.values.service}
                onChange={(e) => formik.handleChange(e)}
                error={formik.touched.service && Boolean(formik.errors.service)}
                helperText={formik.touched.service && formik.errors.service}
                inputProps={{
                  'data-testid': 'nmp-service-test',
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={inputGroupStyle}>
          <AddEditStationFormSectionTitle
            title={t('addEditStationPage.addFormValidation.sections.targetEndPointPof')}
            icon={<MenuBook />}
          />
          <Grid container spacing={2} mt={1}>
            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="endpointIp"
                name="endpointIp"
                label={t('addEditStationPage.addFormValidation.fields.ip')}
                size="small"
                value={formik.values.endpointIp}
                onChange={(e) => formik.handleChange(e)}
                error={formik.touched.endpointIp && Boolean(formik.errors.endpointIp)}
                helperText={formik.touched.endpointIp && formik.errors.endpointIp}
                inputProps={{
                  'data-testid': 'endpoint-ip-test',
                }}
              />
            </Grid>

            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="endpointPath"
                name="endpointPath"
                label={t('addEditStationPage.addFormValidation.fields.path')}
                size="small"
                value={formik.values.endpointPath}
                onChange={(e) => formik.handleChange(e)}
                error={formik.touched.endpointPath && Boolean(formik.errors.endpointPath)}
                helperText={formik.touched.endpointPath && formik.errors.endpointPath}
                inputProps={{
                  'data-testid': 'endpoint-path-test',
                }}
              />
            </Grid>

            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="endpointPort"
                name="endpointPort"
                InputLabelProps={{ shrink: formik.values.endpointPort ? true : false }}
                inputProps={{
                  type: 'number',
                  step: 1,
                  min: 0,
                  max: 65556,
                  'data-testid': 'endpoint-port-test',
                }}
                label={t('addEditStationPage.addFormValidation.fields.port')}
                placeholder={t('addEditStationPage.addForm.fields.port')}
                size="small"
                value={formik.values.endpointPort === 0 ? '' : formik.values.endpointPort}
                onChange={(e) => handleChangeNumberOnly(e, 'endpointPort', formik)}
                error={formik.touched.endpointPort && Boolean(formik.errors.endpointPort)}
                helperText={
                  formik.touched.endpointPort &&
                  formik.errors.endpointPort &&
                  t('addEditStationPage.validation.overPort')
                }
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={inputGroupStyle}>
          <AddEditStationFormSectionTitle
            title={t('addEditStationPage.addFormValidation.sections.model4')}
            icon={<MenuBook />}
          />
          <Grid container spacing={2} mt={1}>
            <Grid container item xs={6}>
              <FormControl fullWidth>
                <InputLabel size="small">
                  {t('addEditStationPage.addFormValidation.fields.protocol')}
                </InputLabel>
                <Select
                  fullWidth
                  id="protocol4Mod"
                  name="protocol4Mod"
                  label={t('addEditStationPage.addFormValidation.fields.protocol')}
                  size="small"
                  defaultValue={formik.values.protocol4Mod}
                  value={
                    formik.values.protocol4Mod === undefined
                      ? ''
                      : formik.values.protocol4Mod === Protocol4ModEnum.HTTPS
                      ? 'HTTPS'
                      : 'HTTP'
                  }
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.protocol4Mod && Boolean(formik.errors.protocol4Mod)}
                  inputProps={{
                    'data-testid': 'protocol-4Mod-test',
                  }}
                >
                  {
                    // eslint-disable-next-line sonarjs/no-identical-functions
                    ['HTTPS', 'HTTP'].map((r) => (
                      <MenuItem key={r} value={r}>
                        {r}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="ip4Mod"
                name="ip4Mod"
                label={t('addEditStationPage.addFormValidation.fields.ip')}
                size="small"
                value={formik.values.ip4Mod}
                onChange={(e) => formik.handleChange(e)}
                error={formik.touched.ip4Mod && Boolean(formik.errors.ip4Mod)}
                helperText={formik.touched.ip4Mod && formik.errors.ip4Mod}
                inputProps={{
                  'data-testid': 'ip-4Mod-test',
                }}
              />
            </Grid>

            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="port4Mod"
                name="port4Mod"
                InputLabelProps={{ shrink: formik.values.port4Mod ? true : false }}
                inputProps={{
                  type: 'number',
                  step: 1,
                  min: 0,
                  max: 65556,
                  'data-testid': 'port-4Mod-test',
                }}
                label={t('addEditStationPage.addFormValidation.fields.port')}
                placeholder={t('addEditStationPage.addForm.fields.port')}
                size="small"
                value={formik.values.port4Mod === 0 ? '' : formik.values.port4Mod}
                onChange={(e) => handleChangeNumberOnly(e, 'port4Mod', formik)}
                error={formik.touched.port4Mod && Boolean(formik.errors.port4Mod)}
                helperText={
                  formik.touched.port4Mod &&
                  formik.errors.port4Mod &&
                  t('addEditStationPage.validation.overPort')
                }
              />
            </Grid>

            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="service4Mod"
                name="service4Mod"
                label={t('addEditStationPage.addFormValidation.fields.path')}
                size="small"
                value={formik.values.service4Mod}
                onChange={(e) => formik.handleChange(e)}
                error={formik.touched.service4Mod && Boolean(formik.errors.service4Mod)}
                helperText={formik.touched.service4Mod && formik.errors.service4Mod}
                inputProps={{
                  'data-testid': 'service-4Mod-test',
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
};

export default AddEdiitStationFormValidation;
