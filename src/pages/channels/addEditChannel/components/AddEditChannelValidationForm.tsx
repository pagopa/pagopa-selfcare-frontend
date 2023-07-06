/* eslint-disable complexity */
import { useTranslation } from 'react-i18next';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { FormikProps } from 'formik';
import { Badge as BadgeIcon, MenuBook as MenuBookIcon } from '@mui/icons-material';
import AddEditChannelFormSectionTitle from '../AddEditChannelFormSectionTitle';
import { ChannelOnCreation } from '../../../../model/Channel';
import {
  ChannelDetailsDto,
  ProtocolEnum,
} from '../../../../api/generated/portal/ChannelDetailsDto';
import { WfespPluginConf } from '../../../../api/generated/portal/WfespPluginConf';
import { Payment_modelEnum } from '../../../../api/generated/portal/WrapperChannelDetailsResource';

type Props = {
  formik: FormikProps<ChannelDetailsDto>;
  handleChangeNumberOnly: (
    e: React.ChangeEvent<any>,
    field: string,
    formik: FormikProps<ChannelOnCreation>
  ) => void;
  wfespPlugin: Array<WfespPluginConf>;
};

const AddEditChannelValidationForm = ({
  formik,
  handleChangeNumberOnly,
  wfespPlugin,
}: // eslint-disable-next-line sonarjs/cognitive-complexity
Props) => {
  const { t } = useTranslation();
  const inputGroupStyle = {
    borderRadius: 1,
    border: 1,
    borderColor: theme.palette.divider,
    p: 3,
    mb: 3,
  };
  const paymentMethod = [
    Payment_modelEnum.ACTIVATED_AT_PSP,
    Payment_modelEnum.DEFERRED,
    Payment_modelEnum.IMMEDIATE,
    Payment_modelEnum.IMMEDIATE_MULTIBENEFICIARY,
  ];
  const protocol = ['HTTP', 'HTTPS'];

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 4,
        borderRadius: 1,
        p: 3,
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6" mb={1}>
            {t('addEditChannelPage.addForm.validationForm.title')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" mb={3}>
            {t('addEditChannelPage.addForm.validationForm.subtitle')}
          </Typography>
        </Grid>
      </Grid>
      <Box>
        <Box sx={inputGroupStyle}>
          <AddEditChannelFormSectionTitle
            title={t('addEditChannelPage.addForm.validationForm.sections.registry')}
            icon={<BadgeIcon fontSize="small" />}
          ></AddEditChannelFormSectionTitle>
          <Grid container spacing={2} mt={1}>
            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="primitiveVersion"
                name="primitiveVersion"
                label={t('addEditChannelPage.addForm.validationForm.fields.primitiveVersion')}
                size="small"
                InputLabelProps={{ shrink: formik.values.primitive_version ? true : false }}
                value={formik.values.primitive_version === 0 ? '' : formik.values.primitive_version}
                onChange={(e) => handleChangeNumberOnly(e, 'primitive_version', formik)}
                error={formik.touched.primitive_version && Boolean(formik.errors.primitive_version)}
                helperText={formik.touched.primitive_version && formik.errors.primitive_version}
                inputProps={{
                  step: 1,
                  min: 0,
                  max: 2,
                  'data-testid': 'primitive-version-test',
                }}
              />
            </Grid>
            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label={t('addEditChannelPage.addForm.validationForm.fields.password')}
                size="small"
                value={formik.values.password}
                onChange={formik.handleChange}
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
                id="new_password"
                name="new_password"
                label={t('addEditChannelPage.addForm.validationForm.fields.newPassword')}
                size="small"
                value={formik.values.new_password}
                onChange={formik.handleChange}
                error={formik.touched.new_password && Boolean(formik.errors.new_password)}
                helperText={formik.touched.new_password && formik.errors.new_password}
                inputProps={{
                  'data-testid': 'new-password-code-test',
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={inputGroupStyle}>
          <AddEditChannelFormSectionTitle
            title={t('addEditChannelPage.addForm.validationForm.sections.endPoint')}
            icon={<MenuBookIcon />}
          ></AddEditChannelFormSectionTitle>
          <Grid container spacing={2} mt={1}>
            <Grid container item xs={6}>
              <FormControl fullWidth>
                <InputLabel size="small">
                  {t('addEditChannelPage.addForm.validationForm.fields.protocol')}
                </InputLabel>
                <Select
                  fullWidth
                  id="protocol"
                  name="protocol"
                  label={t('addEditChannelPage.addForm.validationForm.fields.protocol')}
                  size="small"
                  defaultValue=""
                  value={
                    formik.values.protocol === undefined
                      ? ''
                      : formik.values.protocol === ProtocolEnum.HTTPS
                      ? 'HTTPS'
                      : 'HTTP'
                  }
                  onChange={formik.handleChange}
                  error={formik.touched.protocol && Boolean(formik.errors.protocol)}
                  inputProps={{
                    'data-testid': 'protocol-test',
                  }}
                >
                  {protocol.map((p, i) => (
                    <MenuItem key={i} value={p}>
                      {p}
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
                label={t('addEditChannelPage.addForm.validationForm.fields.ip')}
                size="small"
                value={formik.values.ip}
                onChange={formik.handleChange}
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
                type="number"
                InputLabelProps={{ shrink: formik.values.port ? true : false }}
                inputProps={{
                  step: 1,
                  min: 0,
                  max: 65556,
                  'data-testid': 'port-test',
                }}
                label={t('addEditChannelPage.addForm.validationForm.fields.port')}
                size="small"
                value={formik.values.port === 0 ? '' : formik.values.port}
                onChange={(e) => handleChangeNumberOnly(e, 'port', formik)}
                error={formik.touched.port && Boolean(formik.errors.port)}
                helperText={formik.touched.port && formik.errors.port}
              />
            </Grid>
            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="service"
                name="service"
                label={t('addEditChannelPage.addForm.validationForm.fields.service')}
                size="small"
                value={formik.values.service}
                onChange={formik.handleChange}
                error={formik.touched.service && Boolean(formik.errors.service)}
                helperText={formik.touched.service && formik.errors.service}
                inputProps={{
                  'data-testid': 'service-test',
                }}
              />
            </Grid>
            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="nmp_service"
                name="nmp_service"
                label={t('addEditChannelPage.addForm.validationForm.fields.nmpService')}
                size="small"
                value={formik.values.nmp_service}
                onChange={formik.handleChange}
                error={formik.touched.nmp_service && Boolean(formik.errors.nmp_service)}
                helperText={formik.touched.nmp_service && formik.errors.nmp_service}
                inputProps={{
                  'data-testid': 'npm-service-test',
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <Box sx={inputGroupStyle}>
          <AddEditChannelFormSectionTitle
            title={t('addEditChannelPage.addForm.validationForm.sections.proxy')}
            icon={<MenuBookIcon />}
          ></AddEditChannelFormSectionTitle>
          <Grid container spacing={2} mt={1}>
            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="proxy_port"
                name="proxy_port"
                label={t('addEditChannelPage.addForm.validationForm.fields.proxyPort')}
                size="small"
                value={formik.values.proxy_port === 0 ? '' : formik.values.proxy_port}
                onChange={(e) => handleChangeNumberOnly(e, 'proxy_port', formik)}
                error={formik.touched.proxy_port && Boolean(formik.errors.proxy_port)}
                helperText={formik.touched.proxy_port && formik.errors.proxy_port}
                inputProps={{
                  'data-testid': 'proxy-port-test',
                }}
              />
            </Grid>
            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="proxy_host"
                name="proxy_host"
                label={t('addEditChannelPage.addForm.validationForm.fields.proxyAddress')}
                size="small"
                value={formik.values.proxy_host}
                onChange={formik.handleChange}
                error={formik.touched.proxy_host && Boolean(formik.errors.proxy_host)}
                helperText={formik.touched.proxy_host && formik.errors.proxy_host}
                inputProps={{
                  'data-testid': 'proxy-host-test',
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={inputGroupStyle}>
          <AddEditChannelFormSectionTitle
            title={t('addEditChannelPage.addForm.validationForm.sections.otherInfo')}
            icon={<MenuBookIcon />}
          ></AddEditChannelFormSectionTitle>
          <Grid container spacing={2} mt={1}>
            <Grid container item xs={6}>
              <FormControl fullWidth>
                <InputLabel size="small">
                  {t('addEditChannelPage.addForm.validationForm.fields.paymentModel')}
                </InputLabel>
                <Select
                  fullWidth
                  id="payment_model"
                  name="payment_model"
                  label={t('addEditChannelPage.addForm.validationForm.fields.paymentModel')}
                  size="small"
                  defaultValue=""
                  value={formik.values.payment_model || ''}
                  onChange={formik.handleChange}
                  error={formik.touched.payment_model && Boolean(formik.errors.payment_model)}
                  inputProps={{
                    'data-testid': 'payment-model-test',
                  }}
                >
                  {paymentMethod.map((e, i) => (
                    <MenuItem key={i} value={e}>
                      {t(`addEditChannelPage.addForm.validationForm.paymentModel.${e}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid container item xs={6}>
              <FormControl fullWidth>
                <InputLabel size="small">
                  {t('addEditChannelPage.addForm.validationForm.fields.plugin')}
                </InputLabel>
                <Select
                  fullWidth
                  id="serv_plugin"
                  name="serv_plugin"
                  label={t('addEditChannelPage.addForm.validationForm.fields.plugin')}
                  placeholder={t('addEditChannelPage.addForm.validationForm.fields.plugin')}
                  size="small"
                  defaultValue=""
                  value={formik.values.serv_plugin || ''}
                  onChange={formik.handleChange}
                  error={formik.touched.serv_plugin && Boolean(formik.errors.serv_plugin)}
                  inputProps={{
                    'data-testid': 'serv-plugin-test',
                  }}
                >
                  {wfespPlugin.map((a, b) => (
                    <MenuItem key={b} value={a.id_serv_plugin}>
                      {`${a.id_serv_plugin}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="thread_number"
                name="thread_number"
                type="number"
                InputLabelProps={{ shrink: formik.values.thread_number ? true : false }}
                inputProps={{
                  'data-testid': 'thread-number-test',
                }}
                label={t('addEditChannelPage.addForm.validationForm.fields.threadNumber')}
                size="small"
                value={formik.values.thread_number === 0 ? '' : formik.values.thread_number}
                onChange={(e) => handleChangeNumberOnly(e, 'thread_number', formik)}
                error={formik.touched.thread_number && Boolean(formik.errors.port)}
                helperText={formik.touched.thread_number && formik.errors.thread_number}
              />
            </Grid>
            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="timeout_a"
                name="timeout_a"
                type="number"
                InputLabelProps={{ shrink: formik.values.timeout_a ? true : false }}
                inputProps={{
                  'data-testid': 'timeout-a-test',
                }}
                label={t('addEditChannelPage.addForm.validationForm.fields.timeoutA')}
                size="small"
                value={formik.values.timeout_a === 0 ? '' : formik.values.timeout_a}
                onChange={(e) => handleChangeNumberOnly(e, 'timeout_a', formik)}
                error={formik.touched.timeout_a && Boolean(formik.errors.timeout_a)}
                helperText={formik.touched.timeout_a && formik.errors.timeout_a}
              />
            </Grid>

            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="timeout_b"
                name="timeout_b"
                type="number"
                InputLabelProps={{ shrink: formik.values.timeout_b ? true : false }}
                inputProps={{
                  'data-testid': 'timeout-b-test',
                }}
                label={t('addEditChannelPage.addForm.validationForm.fields.timeoutB')}
                size="small"
                value={formik.values.timeout_b === 0 ? '' : formik.values.timeout_b}
                onChange={(e) => handleChangeNumberOnly(e, 'timeout_b', formik)}
                error={formik.touched.timeout_b && Boolean(formik.errors.timeout_b)}
                helperText={formik.touched.timeout_b && formik.errors.timeout_b}
              />
            </Grid>

            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="timeout_c"
                name="timeout_c"
                type="number"
                InputLabelProps={{ shrink: formik.values.timeout_c ? true : false }}
                inputProps={{
                  'data-testid': 'timeout-c-test',
                }}
                label={t('addEditChannelPage.addForm.validationForm.fields.timeoutC')}
                size="small"
                value={formik.values.timeout_c === 0 ? '' : formik.values.timeout_c}
                onChange={(e) => handleChangeNumberOnly(e, 'timeout_c', formik)}
                error={formik.touched.timeout_c && Boolean(formik.errors.timeout_c)}
                helperText={formik.touched.timeout_c && formik.errors.timeout_c}
              />
            </Grid>

            <Grid container item xs={4} sx={{ mt: 3, mb: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    id="flag_io"
                    name="flag_io"
                    checked={formik.values.flag_io}
                    onChange={formik.handleChange}
                  />
                }
                label={t('addEditChannelPage.addForm.validationForm.fields.pspNotify')}
              />
            </Grid>
            <Grid container item xs={4} sx={{ mt: 3, mb: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    id="rt_push"
                    name="rt_push"
                    checked={formik.values.rt_push}
                    onChange={formik.handleChange}
                  />
                }
                label={t('addEditChannelPage.addForm.validationForm.fields.telematicReceipt')}
              />
            </Grid>
            <Grid container item xs={4} sx={{ mt: 3, mb: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    id="card_chart"
                    name="card_chart"
                    checked={formik.values.card_chart}
                    onChange={formik.handleChange}
                  />
                }
                label={t('addEditChannelPage.addForm.validationForm.fields.rptCard')}
              />
            </Grid>
            <Grid container item xs={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    id="recovery"
                    name="recovery"
                    checked={formik.values.recovery}
                    onChange={formik.handleChange}
                  />
                }
                label={t('addEditChannelPage.addForm.validationForm.fields.recoveryPull')}
              />
            </Grid>
            <Grid container item xs={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    id="digital_stamp_brand"
                    name="digital_stamp_brand"
                    checked={formik.values.digital_stamp_brand}
                    onChange={formik.handleChange}
                  />
                }
                label={t('addEditChannelPage.addForm.validationForm.fields.digitalStamp')}
              />
            </Grid>
            <Grid container item xs={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    id="on_us"
                    name="on_us"
                    checked={formik.values.on_us}
                    onChange={formik.handleChange}
                  />
                }
                label={t('addEditChannelPage.addForm.validationForm.fields.onUs')}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
};

export default AddEditChannelValidationForm;
