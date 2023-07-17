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
import ROUTES from '../../../routes';
import { LOADING_TASK_CREATE_IBAN } from '../../../utils/constants';
import { IbanFormAction, IbanOnCreation } from '../../../model/Iban';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { createIban, updateIban } from '../../../services/ibanService';
import AddEditIbanFormSectionTitle from './components/AddEditIbanFormSectionTitle';

type Props = {
  goBack: () => void;
  ibanBody?: IbanOnCreation;
  formAction: string;
};

const AddEditIbanForm = ({ goBack, ibanBody, formAction }: Props) => {
  const { t } = useTranslation();
  const [subject, setSubject] = useState('me');
  const [uploadType, setUploadType] = useState('single');
  const history = useHistory();
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_CREATE_IBAN);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const ecCode = selectedParty ? selectedParty.fiscalCode : '';

  const changeSubject = (e: any) => {
    setSubject(e.target.value);
  };

  useEffect(() => {
    if (subject === 'me') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      formik.setFieldValue('creditorInstitutionCode', ecCode);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      formik.setFieldValue('creditorInstitutionCode', '');
    }
  }, [subject, ecCode]);

  const changeUploadType = (event: any) => {
    setUploadType(event.target.value);
  };

  const initialFormData = (ibanBody?: IbanOnCreation) =>
    ibanBody
      ? {
          iban: ibanBody.iban,
          description: ibanBody.description,
          validityDate: ibanBody.validityDate,
          dueDate: ibanBody.dueDate,
          creditorInstitutionCode: ibanBody.creditorInstitutionCode,
          labels: ibanBody.labels,
          active: ibanBody.active,
        }
      : {
          iban: '',
          description: '',
          validityDate: new Date(),
          dueDate: new Date(),
          creditorInstitutionCode: '',
          active: true,
        };

  const ibanFormatValidator = (iban: string) => {
    if (iban.length !== 27) {
      return false;
    }

    const char1and2 = iban.substring(0, 2);
    if (char1and2 !== 'IT') {
      return false;
    }

    const char3 = /[0-9]/.test(iban[2]);
    const char4 = /[0-9]/.test(iban[3]);

    if (!char3) {
      return false;
    }

    if (!char4) {
      return false;
    }

    const char5 = /[A-Za-z]/.test(iban[4]);
    if (!char5) {
      return false;
    }

    const remainingChars = iban.slice(5);
    const from5To27Characters = /^[0-9]{22}$/.test(remainingChars);
    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if (!from5To27Characters) {
      return false;
    }

    return true;
  };

  const validateCodiceFiscale = (fiscalCode: string | undefined) => {
    const cfRegex = /^[A-Za-z]{6}\d{2}[A-Za-z]\d{2}[A-Za-z]\d{3}[A-Za-z]$/;
    if (fiscalCode) {
      return cfRegex.test(fiscalCode);
    } else {
      return false;
    }
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const validate = (values: IbanOnCreation): { [k: string]: string | undefined } | undefined => {
    const minDate = new Date('01/01/1901');

    if (uploadType === 'single') {
      return Object.fromEntries(
        Object.entries({
          iban: !values.iban
            ? t('addEditIbanPage.validationMessage.requiredField')
            : !ibanFormatValidator(values.iban)
            ? t('addEditIbanPage.validationMessage.ibanNotValid')
            : undefined,
          description: !values.description ? 'Campo obbligatorio' : undefined,
          validityDate: !values.validityDate
            ? t('addEditIbanPage.validationMessage.requiredField')
            : values.validityDate.getTime() < minDate.getTime()
            ? t('addEditIbanPage.validationMessage.dateNotValid')
            : values.dueDate && values.validityDate.getTime() > values.dueDate.getTime()
            ? t('addEditIbanPage.validationMessage.startDateOverEndDate')
            : undefined,
          dueDate: !values.dueDate
            ? t('addEditIbanPage.validationMessage.requiredField')
            : values.dueDate.getTime() < minDate.getTime()
            ? t('addEditIbanPage.validationMessage.dateNotValid')
            : values.validityDate && values.dueDate.getTime() < values.validityDate.getTime()
            ? t('addEditIbanPage.validationMessage.endDateUnderStartDate')
            : undefined,
          creditorInstitutionCode:
            subject === 'me'
              ? undefined
              : !values.creditorInstitutionCode
              ? t('addEditIbanPage.validationMessage.requiredField')
              : !validateCodiceFiscale(formik.values.creditorInstitutionCode)
              ? t('addEditIbanPage.validationMessage.ecOwnerNotValid')
              : undefined,
        }).filter(([_key, value]) => value)
      );
    } else {
      return {};
    }
  };

  const enableSubmit = (values: IbanOnCreation) => {
    const baseCondition =
      values.iban !== '' &&
      values.description !== '' &&
      values.validityDate &&
      values.validityDate.getTime() > 0 &&
      values.dueDate &&
      values.dueDate.getTime() > 0;

    if (uploadType === 'single') {
      if (baseCondition && subject === 'me') {
        return true;
      } else if (
        baseCondition &&
        subject === 'anotherOne' &&
        values.creditorInstitutionCode !== ''
      ) {
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
        if (formAction === IbanFormAction.Create) {
          await createIban({
            iban: values.iban,
            description: values.description,
            validityDate: values.validityDate,
            dueDate: values.dueDate,
            creditorInstitutionCode: values.creditorInstitutionCode,
            active: true,
          });
          console.log('SUBMIT CREATE!');
        } else if (formAction === IbanFormAction.Edit) {
          await updateIban({
            iban: values.iban,
            description: values.description,
            validityDate: values.validityDate,
            dueDate: values.dueDate,
            creditorInstitutionCode: values.creditorInstitutionCode,
            active: true,
          });
          console.log('SUBMIT UPDATE!');
        }
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
    initialValues: initialFormData(ibanBody),
    validate,
    onSubmit: async () => history.push(ROUTES.IBAN),
    enableReinitialize: true,
    validateOnMount: true,
  });

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
                  id="iban"
                  name="iban"
                  label={t('addEditIbanPage.addForm.fields.iban.ibanCode')}
                  size="small"
                  value={formik.values.iban?.toUpperCase()}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.iban && Boolean(formik.errors.iban)}
                  helperText={formik.touched.iban && formik.errors.iban}
                />
              </Grid>

              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label={t('addEditIbanPage.addForm.fields.iban.description')}
                  placeholder={t('addEditIbanPage.addForm.fields.iban.descPlaceHolder')}
                  size="small"
                  value={formik.values.description}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
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
                    inputFormat="dd/MM/yyyy"
                    value={formik.values.validityDate}
                    onChange={(e) => formik.setFieldValue('validityDate', e)}
                    renderInput={(params: TextFieldProps) => (
                      <TextField
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          placeholder: 'dd/mm/aaaa',
                        }}
                        id="validityDate"
                        data-testid="start-date-test"
                        name="validityDate"
                        type="date"
                        size="small"
                        error={formik.touched.validityDate && Boolean(formik.errors.validityDate)}
                        helperText={formik.touched.validityDate && formik.errors.validityDate}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid container item xs={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    label={t('addEditIbanPage.addForm.fields.dates.end')}
                    inputFormat="dd/MM/yyyy"
                    value={formik.values.dueDate}
                    onChange={(e) => formik.setFieldValue('dueDate', e)}
                    renderInput={(params: TextFieldProps) => (
                      <TextField
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          placeholder: 'dd/mm/aaaa',
                        }}
                        id="dueDate"
                        data-testid="end-date-test"
                        name="dueDate"
                        type="date"
                        size="small"
                        error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
                        helperText={formik.touched.dueDate && formik.errors.dueDate}
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
                    onChange={(e) => changeSubject(e)}
                  >
                    <FormControlLabel
                      checked={subject === 'me'}
                      value="me"
                      control={<Radio />}
                      label={t('addEditIbanPage.addForm.fields.holder.me')}
                      sx={{ mr: 5 }}
                    />
                    <FormControlLabel
                      checked={subject === 'anotherOne'}
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
                  id="creditorInstitutionCode"
                  name="creditorInstitutionCode"
                  label={t('addEditIbanPage.addForm.fields.holder.holderFiscalCode')}
                  placeholder="AAAAAAAAAAAAAAAAAAA"
                  size="small"
                  value={formik.values.creditorInstitutionCode?.toUpperCase()}
                  onChange={(e) => formik.handleChange(e)}
                  error={
                    formik.touched.creditorInstitutionCode &&
                    Boolean(formik.errors.creditorInstitutionCode)
                  }
                  helperText={
                    formik.touched.creditorInstitutionCode && formik.errors.creditorInstitutionCode
                  }
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
              history.push(ROUTES.IBAN);
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
