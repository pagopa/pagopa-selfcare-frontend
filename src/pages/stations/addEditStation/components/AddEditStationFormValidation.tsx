import { FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { Badge as BadgeIcon, MenuBook } from '@mui/icons-material';
import { IProxyConfigItem, StationOnCreation } from '../../../../model/Station';
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
  proxyAddresses: IProxyConfigItem;
};

// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
const AddEditStationFormValidation = ({
  formik,
  handleChangeNumberOnly,
  inputGroupStyle,
  proxyAddresses,
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
                type="number"
                fullWidth
                id="threadNumber"
                name="threadNumber"
                InputLabelProps={{ shrink: formik.values.threadNumber ? true : false }}
                inputProps={{
                  type: 'number',
                  step: 1,
                  min: 0,
                  'data-testid': 'thread-number-test',
                }}
                label={t('addEditStationPage.addFormValidation.fields.threadNumber')}
                placeholder={t('addEditStationPage.addForm.fields.threadNumber')}
                size="small"
                value={formik.values.threadNumber === 0 ? '' : formik.values.threadNumber}
                onChange={(e) => handleChangeNumberOnly(e, 'threadNumber', formik)}
                error={formik.touched.threadNumber && Boolean(formik.errors.threadNumber)}
                helperText={formik.touched.threadNumber && formik.errors.threadNumber}
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
                  type: 'number',
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
                id="service"
                name="service"
                label={t('addEditStationPage.addFormValidation.fields.service')}
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
        <Box sx={inputGroupStyle}>
          <AddEditStationFormSectionTitle
            title={t('addEditStationPage.addFormValidation.sections.proxy')}
            icon={<BadgeIcon />}
          />
          <Grid container spacing={2} mt={1}>
            <Grid container item xs={6}>
              <FormControl fullWidth>
                <InputLabel size="small">
                  {t('addEditStationPage.addFormValidation.fields.proxy')}
                </InputLabel>
                <Select
                  fullWidth
                  id="proxyConcat"
                  name="proxyConcat"
                  label={t('addEditStationPage.addFormValidation.fields.proxy')}
                  placeholder={t('addEditStationPage.addFormValidation.fields.proxy')}
                  size="small"
                  defaultValue=""
                  value={formik.values.proxyConcat || ''}
                  onChange={formik.handleChange}
                  error={formik.touched.proxyConcat && Boolean(formik.errors.proxyConcat)}
                  inputProps={{
                    'data-testid': 'proxy-proxyConcat-test',
                  }}
                >
                  {Object.entries(proxyAddresses).map(([key, value]) => (
                    <MenuItem
                      key={key}
                      selected={formik.values.proxyConcat.toString().includes(value)}
                      value={value}
                    >{`${value} (${t(
                      'addEditStationPage.addFormValidation.fields.proxyValues.' + key
                    )})`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Box sx={inputGroupStyle}>
          <AddEditStationFormSectionTitle
            title={t('addEditStationPage.addFormValidation.sections.otherInfo')}
            icon={<BadgeIcon />}
          />
          <Grid container spacing={2} mt={1}>
            <Grid container item xs={6}>
              <TextField
                type="number"
                fullWidth
                id="timeoutA"
                name="timeoutA"
                InputLabelProps={{
                  shrink: formik.values.timeoutA ? true : false,
                }}
                inputProps={{
                  'data-testid': 'timeoutA-test',
                }}
                label={t('addEditStationPage.addFormValidation.fields.timeoutA')}
                placeholder={t('addEditStationPage.addForm.fields.timeoutA')}
                size="small"
                value={formik.values.timeoutA === 0 ? '' : formik.values.timeoutA}
                onChange={(e) => handleChangeNumberOnly(e, 'timeoutA', formik)}
                error={formik.touched.timeoutA && Boolean(formik.errors.timeoutA)}
                helperText={formik.touched.timeoutA && formik.errors.timeoutA}
              />
            </Grid>
            <Grid container item xs={6}>
              <TextField
                type="number"
                fullWidth
                id="timeoutB"
                name="timeoutB"
                InputLabelProps={{ shrink: formik.values.timeoutB ? true : false }}
                inputProps={{
                  'data-testid': 'timeoutB-test',
                }}
                label={t('addEditStationPage.addFormValidation.fields.timeoutB')}
                placeholder={t('addEditStationPage.addForm.fields.timeoutB')}
                size="small"
                value={formik.values.timeoutB === 0 ? '' : formik.values.timeoutB}
                onChange={(e) => handleChangeNumberOnly(e, 'timeoutB', formik)}
                error={formik.touched.timeoutB && Boolean(formik.errors.timeoutB)}
                helperText={formik.touched.timeoutB && formik.errors.timeoutB}
              />
            </Grid>
            <Grid container item xs={6}>
              <TextField
                type="number"
                fullWidth
                id="timeoutC"
                name="timeoutC"
                InputLabelProps={{ shrink: formik.values.timeoutC !== 0 ? true : false }}
                inputProps={{
                  'data-testid': 'timeoutC-test',
                }}
                label={t('addEditStationPage.addFormValidation.fields.timeoutC')}
                placeholder={t('addEditStationPage.addForm.fields.timeoutC')}
                size="small"
                value={formik.values.timeoutC === 0 ? '' : formik.values.timeoutC}
                onChange={(e) => handleChangeNumberOnly(e, 'timeoutC', formik)}
                error={formik.touched.timeoutC && Boolean(formik.errors.timeoutC)}
                helperText={formik.touched.timeoutC && formik.errors.timeoutC}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
};

export default AddEditStationFormValidation;
