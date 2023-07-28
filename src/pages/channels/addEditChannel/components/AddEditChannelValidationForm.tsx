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
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { FormikProps } from 'formik';
import { Badge as BadgeIcon, MenuBook as MenuBookIcon } from '@mui/icons-material';
import AddEditChannelFormSectionTitle from '../AddEditChannelFormSectionTitle';
import { ChannelOnCreation } from '../../../../model/Channel';
import { ENV } from '../../../../utils/env';

type Props = {
  formik: FormikProps<ChannelOnCreation>;
  handleChangeNumberOnly: (
    e: React.ChangeEvent<any>,
    field: string,
    formik: FormikProps<ChannelOnCreation>
  ) => void;
};

const AddEditChannelValidationForm = ({
  formik,
  handleChangeNumberOnly,
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

  const proxyOptions = [
    {
      label: 'Nuova Connettività',
      value: ENV.ENV === 'PROD' ? `http://0.79.20.35:80` : `http://10.79.20.33:80`,
    },
    {
      label: 'Vecchia Connettività',
      value: ENV.ENV === 'PROD' ? `http://10.102.1.85:8080` : `http://10.101.1.95:8080`,
    },
  ];

  const forwarder01 =
    ENV.ENV === 'PROD'
      ? 'https://api.platform.pagopa.it/pagopa-node-forwarder/api/v1/forward'
      : 'https://api.uat.platform.pagopa.it/pagopa-node-forwarder/api/v1/forward';

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
                id="primitive_version"
                name="primitive_version"
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
          </Grid>
        </Box>

        <Box sx={inputGroupStyle}>
          <AddEditChannelFormSectionTitle
            title={t('addEditChannelPage.addForm.validationForm.sections.configuration')}
            icon={<MenuBookIcon />}
          ></AddEditChannelFormSectionTitle>
          <Grid container spacing={2} mt={1}>
            <Grid container item xs={12}>
              <FormControl>
                <RadioGroup row name="connection" defaultValue="newConnection">
                  <FormControlLabel
                    value="newConnection"
                    control={<Radio />}
                    label={t('addEditChannelPage.addForm.validationForm.fields.newConnection')}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid container item xs={6}>
              <FormControl fullWidth>
                <InputLabel size="small">
                  {t('addEditChannelPage.addForm.validationForm.fields.newConnectionChannel')}
                </InputLabel>
                <Select
                  fullWidth
                  id="ipUnion"
                  name="ipUnion"
                  label={t('addEditChannelPage.addForm.validationForm.fields.newConnectionChannel')}
                  size="small"
                  value={formik.values.ipUnion}
                  onChange={(e) => formik.handleChange(e)}
                  inputProps={{
                    'data-testid': 'new-connection-channel',
                  }}
                >
                  <MenuItem
                    key={'forwarder01'}
                    value={forwarder01}
                    selected={formik.values.ipUnion.includes(forwarder01)}
                  >
                    {t('addEditChannelPage.addForm.validationForm.fields.forwarder01')}
                  </MenuItem>
                </Select>
              </FormControl>
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
              <FormControl fullWidth>
                <InputLabel size="small">
                  {t('addEditChannelPage.addForm.validationForm.fields.proxyAddress')}
                </InputLabel>
                <Select
                  fullWidth
                  id="proxyUnion"
                  name="proxyUnion"
                  label={t('addEditChannelPage.addForm.validationForm.fields.proxyAddress')}
                  size="small"
                  value={formik.values.proxyUnion}
                  onChange={(e) => formik.handleChange(e)}
                  inputProps={{
                    'data-testid': 'proxy-union-test',
                  }}
                >
                  {proxyOptions.map((option: any) => (
                    <MenuItem key={option.label} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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

            <Grid container item xs={12}>
              <TextField
                sx={{ width: '49.5%' }}
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
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
};

export default AddEditChannelValidationForm;
