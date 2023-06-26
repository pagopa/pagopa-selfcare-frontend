import { useTranslation } from 'react-i18next';
import { theme } from '@pagopa/mui-italia';
import {
  Paper,
  Typography,
  Grid,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  TextFieldProps,
  Button,
  Stack,
} from '@mui/material';
import { Box } from '@mui/system';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useEffect, useState } from 'react';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { format } from 'date-fns';
import AddEditIbanFormSectionTitle from '../../iban/addEditIban/components/AddEditIbanFormSectionTitle';
import { IbanOnCreation } from '../../../model/Iban';
import ROUTES from '../../../routes';
import { createIban } from '../../../services/__mocks__/ibanService';
import { LOADING_TASK_CREATE_IBAN } from '../../../utils/constants';

type Props = {
  // formAction: string;
  iban?: IbanOnCreation;
  goBack: () => void;
};

const AddEditIbanForm = ({ iban, goBack }: Props) => {
  const { t } = useTranslation();
  const [subject, setSubject] = useState('me');
  const [uploadType, setUploadType] = useState('single');
  const history = useHistory();
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_CREATE_IBAN);
  const changeUploadType = (event: any) => {
    setUploadType(event.target.value);
  };
  const changeSubject = async (event: any) => {
    setSubject(event.target.value);
    await formik.setFieldValue('holderFiscalCode', '');
  };

  const initialFormData = (iban?: IbanOnCreation) =>
    iban
      ? {
          ibanCode: iban.ibanCode,
          ibanDescription: iban.ibanDescription,
          startDate: iban.startDate,
          endDate: iban.endDate,
          holderFiscalCode: iban.holderFiscalCode,
        }
      : {
          ibanCode: '',
          ibanDescription: '',
          startDate: undefined,
          endDate: undefined,
          holderFiscalCode: undefined,
        };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const validate = (values: IbanOnCreation) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    if (uploadType === 'single') {
      return Object.fromEntries(
        Object.entries({
          ibanCode: !values.ibanCode ? 'Campo obbligatorio' : undefined,
          ibanDescription: !values.ibanDescription ? 'Campo obbligatorio' : undefined,
          startDate: !values.startDate
            ? 'Campo obbligatorio'
            : values.endDate && values.startDate.getTime() > values.endDate.getTime()
            ? 'La data di inizio non può essere maggiore di quella finale'
            : undefined,
          endDate: !values.endDate
            ? 'Campo obbligatorio'
            : values.startDate && values.endDate.getTime() < values.startDate.getTime()
            ? 'La data di fine non può essere minore di quella iniziale'
            : undefined,
          holderFiscalCode:
            subject === 'me'
              ? undefined
              : !values.holderFiscalCode
              ? 'Campo obbligatorio'
              : undefined,
        }).filter(([_key, value]) => value)
      );
    } else {
      return;
    }
  };

  const enableSubmit = (values: IbanOnCreation) => {
    const baseCondition =
      values.ibanCode !== '' &&
      values.ibanDescription !== '' &&
      values.startDate &&
      values.startDate.getTime() > 0 &&
      values.endDate &&
      values.endDate.getTime() > 0;

    if (uploadType === 'single') {
      if (baseCondition && subject === 'me') {
        return true;
      } else if (baseCondition && subject === 'anotherOne' && values.holderFiscalCode !== '') {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  const submit = async (values: IbanOnCreation) => {
    if (uploadType === 'single') {
      setLoading(true);
      try {
        await createIban(values);
      } catch (reason) {
        addError({
          id: 'CREATE_IBAN',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while adding/editing iban`,
          toNotify: true,
          displayableTitle: t('addEditIbanPage.errors.createIbanTitle'),
          displayableDescription: t('addEditIbanPage.errors.createIbanMessage'),
          component: 'Toast',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const formik = useFormik<IbanOnCreation>({
    initialValues: initialFormData(iban),
    validate,
    onSubmit: async () => history.push(ROUTES.IBAN),
    enableReinitialize: true,
    validateOnMount: true,
  });

  useEffect(() => {
    console.log('FORMIK', formik);
    console.log('start date', formik.values.startDate);
    console.log('end date', formik.values.endDate);
  }, [formik]);

  const inputGroupStyle = {
    borderRadius: 1,
    border: 1,
    borderColor: theme.palette.divider,
    p: 3,
    mb: 3,
  };

  return (
    <>
      <FormControl>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="upload-type-iban"
          sx={{ mt: 3, mb: 2 }}
        >
          <FormControlLabel
            checked={uploadType === 'single'}
            onChange={changeUploadType}
            value="single"
            control={<Radio />}
            label={t('addEditIbanPage.addForm.fields.ibanUploadTypes.single')}
            sx={{ mr: 5 }}
          />
          <FormControlLabel
            checked={uploadType === 'multiple'}
            onChange={changeUploadType}
            value="multiple"
            control={<Radio />}
            disabled
            label={t('addEditIbanPage.addForm.fields.ibanUploadTypes.multiple')}
          />
        </RadioGroup>
      </FormControl>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 1,
          p: 3,
          minWidth: '100%',
          mb: 4,
        }}
      >
        <Typography variant="h6" fontWeight="fontWeightMedium" mb={3}>
          {t('addEditIbanPage.title')}
        </Typography>

        <Typography variant="body2" mb={3}>
          {t('addEditIbanPage.subtitle')}
        </Typography>

        <Box>
          <Box sx={inputGroupStyle}>
            <AddEditIbanFormSectionTitle
              title={t('addEditIbanPage.addForm.sections.ibanDatas')}
              icon={<MonetizationOnIcon />}
            />
            <Grid container spacing={2} mt={1}>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="ibanCode"
                  name="ibanCode"
                  label={t('addEditIbanPage.addForm.fields.iban.ibanCode')}
                  size="small"
                  value={formik.values.ibanCode}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.ibanCode && Boolean(formik.errors.ibanCode)}
                  helperText={formik.touched.ibanCode && formik.errors.ibanCode}
                />
              </Grid>

              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="ibanDescription"
                  name="ibanDescription"
                  label={t('addEditIbanPage.addForm.fields.iban.description')}
                  placeholder={t('addEditIbanPage.addForm.fields.iban.descPlaceHolder')}
                  size="small"
                  value={formik.values.ibanDescription}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.ibanDescription && Boolean(formik.errors.ibanDescription)}
                  helperText={formik.touched.ibanDescription && formik.errors.ibanDescription}
                />
              </Grid>
            </Grid>
          </Box>
          <Box sx={inputGroupStyle}>
            <AddEditIbanFormSectionTitle
              title={t('addEditIbanPage.addForm.sections.validityPeriod')}
              icon={<CalendarTodayIcon />}
            />
            <Grid container spacing={2} mt={1}>
              <Grid container item xs={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    label={t('addEditIbanPage.addForm.fields.dates.start')}
                    value={formik.values.startDate}
                    onChange={(value) => formik.setFieldValue('startDate', value)}
                    renderInput={(params: TextFieldProps) => (
                      <TextField
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          placeholder: 'dd/mm/aaaa',
                          value: formik.values.startDate
                            ? format(formik.values.startDate, 'dd/MM/yyyy')
                            : '',
                        }}
                        id="startDate"
                        data-testid="start-date-test"
                        name="startDate"
                        type="date"
                        size="small"
                        error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                        helperText={formik.touched.startDate && formik.errors.startDate}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid container item xs={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    label={t('addEditIbanPage.addForm.fields.dates.end')}
                    value={formik.values.endDate}
                    onChange={(value) => formik.setFieldValue('endDate', value)}
                    renderInput={(params: TextFieldProps) => (
                      <TextField
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          placeholder: 'dd/mm/aaaa',
                          value: formik.values.endDate
                            ? format(formik.values.endDate, 'dd/MM/yyyy')
                            : '',
                        }}
                        id="endDate"
                        data-testid="end-date-test"
                        name="endDate"
                        type="date"
                        size="small"
                        error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                        helperText={formik.touched.endDate && formik.errors.endDate}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Box>
          <Box sx={inputGroupStyle}>
            <AddEditIbanFormSectionTitle
              title={t('addEditIbanPage.addForm.sections.ibanHolder')}
              icon={<MenuBookIcon />}
            />
            <Grid container spacing={2} mt={1}>
              <Grid container item xs={12}>
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="iban-holder"
                  >
                    <FormControlLabel
                      checked={subject === 'me'}
                      onChange={changeSubject}
                      value="me"
                      control={<Radio />}
                      label={t('addEditIbanPage.addForm.fields.holder.me')}
                      sx={{ mr: 5 }}
                    />
                    <FormControlLabel
                      checked={subject === 'anotherOne'}
                      onChange={changeSubject}
                      value="anotherOne"
                      control={<Radio />}
                      label={t('addEditIbanPage.addForm.fields.holder.anotherOne')}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid container item xs={6}>
                <TextField
                  disabled={subject === 'me'}
                  fullWidth
                  id="holderFiscalCode"
                  name="holderFiscalCode"
                  label={t('addEditIbanPage.addForm.fields.holder.holderFiscalCode')}
                  placeholder="AAAAAAAAAAAAAAAAAAA"
                  size="small"
                  value={formik.values.holderFiscalCode}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.holderFiscalCode && Boolean(formik.errors.holderFiscalCode)}
                  helperText={formik.touched.holderFiscalCode && formik.errors.holderFiscalCode}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
      <Stack direction="row" justifyContent="space-between" mt={5}>
        <Stack display="flex" justifyContent="flex-start" mr={2}>
          <Button color="primary" variant="outlined" onClick={goBack}>
            {t('addEditIbanPage.addForm.buttons.back')}
          </Button>
        </Stack>
        <Stack display="flex" justifyContent="flex-end">
          <Button
            onClick={async () => {
              formik.handleSubmit();
              await submit(formik.values);
            }}
            disabled={!enableSubmit(formik.values)}
            color="primary"
            variant="contained"
            type="submit"
          >
            {t('addEditIbanPage.addForm.buttons.confirm')}
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default AddEditIbanForm;
