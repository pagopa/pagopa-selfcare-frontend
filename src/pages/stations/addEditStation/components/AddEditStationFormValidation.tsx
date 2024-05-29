/* eslint-disable sonarjs/no-identical-functions */
import { FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
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
import { Box } from '@mui/system';
import { Badge as BadgeIcon, MenuBook } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import {
  IProxyConfig,
  IProxyConfigItem,
  NewConnConfigs,
  INewConnConfig,
  ProxyConfigs,
  StationOnCreation,
  IGPDConfig,
  GPDConfigs,
} from '../../../../model/Station';
import AddEditStationFormSectionTitle from '../AddEditStationFormSectionTitle';
import { Protocol4ModEnum, ProtocolEnum } from '../../../../api/generated/portal/StationDetailsDto';
import { ENV } from '../../../../utils/env';
import { ConnectionType } from '../../../../model/Station';

type Props = {
  formik: FormikProps<StationOnCreation>;
  handleChangeNumberOnly: (
    e: React.ChangeEvent<any>,
    field: string,
    formik: FormikProps<StationOnCreation>
  ) => void;
  inputGroupStyle: any;
  newConn: boolean;
  setNewConn: React.Dispatch<React.SetStateAction<boolean>>;
  gdp: boolean;
  setGDP: React.Dispatch<React.SetStateAction<boolean>>;
  connectionType: ConnectionType;
};

// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
const AddEditStationFormValidation = ({
  formik,
  handleChangeNumberOnly,
  inputGroupStyle,
  newConn,
  setNewConn,
  gdp,
  setGDP,
  connectionType,
}: // eslint-disable-next-line sonarjs/cognitive-complexity
Props) => {
  const { t } = useTranslation();
  const proxyAddresses = ProxyConfigs[ENV.ENV as keyof IProxyConfig];
  const forwarderAddresses = NewConnConfigs[ENV.ENV as keyof INewConnConfig];
  const gpdAddresses = GPDConfigs[ENV.ENV as keyof IGPDConfig];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    if (value === 'GPD') {
      setNewConn(false);
      formik.setFieldValue('newConnConcat', '');
      setGDP(true);
    } else {
      setNewConn(true);
      setGDP(false);
      formik.setFieldValue('gdpConcat', '');
    }
  };

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
            isRequired
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
                required
              />
            </Grid>
            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="password"
                name="password"
                required
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
          </Grid>
        </Box>

        <Box sx={inputGroupStyle}>
          <AddEditStationFormSectionTitle
            title={t('addEditStationPage.addFormValidation.sections.configuration')}
            icon={<BadgeIcon />}
          />
          <Box mt={1} width="50%" pr={1}>
              <FormControl fullWidth>
                <RadioGroup
                  sx={{ display: 'block' }}
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue=""
                  onChange={handleChange}
                  name="radio-buttons-group"
                >
                  {connectionType === ConnectionType.SYNC ? (
                    <>
                        <FormControlLabel
                          value="newConn"
                          checked={newConn}
                          data-testid="radio-button-newConn"
                          control={<Radio />}
                          label={t('addEditStationPage.addFormValidation.fields.newConnLabel')}
                        />
                      <Box pt={1}>
                        <FormControl fullWidth>
                          <InputLabel size="small" id="newConnConcatLabel">
                            {t('addEditStationPage.addFormValidation.fields.select')}
                          </InputLabel>
                          <Select
                            fullWidth
                            id="newConnConcat"
                            name="newConnConcat"
                            labelId='newConnConcatLabel'
                            data-testid="newConnConcat"
                            label={'newConnConcat'}
                            placeholder={'newConnConcat'}
                            size="small"
                            disabled={!newConn}
                            defaultValue=""
                            value={formik.values.newConnConcat}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.newConnConcat && Boolean(formik.errors.newConnConcat)
                            }
                            inputProps={{
                              'data-testid': 'newConnConcat-test',
                            }}
                          >
                            {Object.entries(forwarderAddresses).map(([key, value]) => (
                              <MenuItem
                                key={key}
                                selected={
                                  formik.values.pofService &&
                                  value.includes(formik.values.pofService)
                                    ? true
                                    : false
                                }
                                value={value}
                              >
                                {`${key.toUpperCase()} - ${value}`}
                              </MenuItem>
                            ))}
                          </Select>
                          {formik.touched.newConnConcat && formik.errors.newConnConcat ? (
                            <FormHelperText sx={{ color: '#bf3333' }}>
                              {formik.touched.newConnConcat && formik.errors.newConnConcat}
                            </FormHelperText>
                          ) : null}
                        </FormControl>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Grid container item xs={12} >
                        <FormControlLabel
                          value="GPD"
                          data-testid="radio-button-gdp"
                          control={<Radio />}
                          checked={gdp}
                          label={t('addEditStationPage.addFormValidation.fields.GDPLabel')}
                        />
                      </Grid>

                      <Grid container item xs={12} pt={1}>
                        <FormControl fullWidth>
                          <InputLabel size="small" id="gdpConcatLabel">
                            {t('addEditStationPage.addFormValidation.fields.select')}
                          </InputLabel>
                          <Select
                            fullWidth
                            id="gdpConcat"
                            name="gdpConcat"
                            labelId='gdpConcatLabel'
                            data-testid="gdpConcat-select"
                            label={'gdpConcat'}
                            placeholder={'gdpConcat'}
                            size="small"
                            defaultValue={''}
                            disabled={!gdp}
                            value={formik.values.gdpConcat}
                            onChange={formik.handleChange}
                            error={formik.touched.gdpConcat && Boolean(formik.errors.gdpConcat)}
                            inputProps={{
                              'data-testid': 'gdpConcat-test',
                            }}
                          >
                            {Object.entries(gpdAddresses).map(([key, value]) => (
                              <MenuItem key={key} selected={true} value={value}>
                                {`${key.toUpperCase()} - ${value}`}
                              </MenuItem>
                            ))}
                          </Select>
                          {formik.touched.gdpConcat && formik.errors.gdpConcat ? (
                            <FormHelperText sx={{ color: '#bf3333' }}>
                              {formik.touched.gdpConcat && formik.errors.gdpConcat}
                            </FormHelperText>
                          ) : null}
                        </FormControl>
                      </Grid>
                    </>
                  )}
                </RadioGroup>
              </FormControl>
          </Box>
        </Box>

        <Box sx={inputGroupStyle}>
          <AddEditStationFormSectionTitle
            title={t('addEditStationPage.addFormValidation.sections.proxy')}
            icon={<BadgeIcon />}
          />
          <Grid container spacing={2} mt={1}>
            <Grid container item xs={6}>
              <FormControl fullWidth>
                <InputLabel size="small" id="proxyConcatLabel">
                  {t('addEditStationPage.addFormValidation.fields.proxy')}
                </InputLabel>
                <Select
                  fullWidth
                  id="proxyConcat"
                  labelId='proxyConcatLabel'
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
            isRequired
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
                required
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
                required
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
                required
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
};

export default AddEditStationFormValidation;
