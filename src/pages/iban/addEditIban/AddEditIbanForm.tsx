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

  useEffect(() => {
    if (subject === 'me') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      formik.setFieldValue('creditorInstitutionCode', ecCode);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      formik.setFieldValue('creditorInstitutionCode', '');
    }
  }, [subject, ecCode]);

  useEffect(() => {
    if (typeof ibanBody === 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      formik.setFieldValue('validityDate', getTomorrowDate(new Date()));
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      formik.setFieldValue('dueDate', getTomorrowDate(new Date()));
    }
  }, []);

  const changeUploadType = (event: any) => {
    setUploadType(event.target.value);
  };

  // const changeSubject = (e: any) => {
  //   setSubject(e.target.value);
  // };

  const getTomorrowDate = (currentDate: Date) => {
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);
    return tomorrow;
  };

  const initialFormData = (ibanBody?: IbanOnCreation) =>
    ibanBody
      ? {
          iban: ibanBody.iban,
          description: ibanBody.description,
          validityDate: ibanBody.validityDate,
          dueDate: ibanBody.dueDate,
          creditorInstitutionCode: ibanBody.creditorInstitutionCode,
          labels: ibanBody.labels ?? undefined,
          active: ibanBody.active,
        }
      : {
          iban: '',
          description: '',
          validityDate: new Date(),
          dueDate: new Date(),
          creditorInstitutionCode: ecCode,
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

  // const validateFiscalCode = (fiscalCode: string | undefined) => {
  //   if (fiscalCode) {
  //     const fiscalCodeNumber = parseInt(fiscalCode, 10);
  //     return !isNaN(fiscalCodeNumber);
  //   } else {
  //     return false;
  //   }
  // };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const validate = (values: IbanOnCreation): { [k: string]: string | undefined } | undefined => {
    const minDate = new Date();

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
          // creditorInstitutionCode:
          //   subject === 'me'
          //     ? undefined
          //     : !values.creditorInstitutionCode
          //     ? t('addEditIbanPage.validationMessage.requiredField')
          //     : !validateFiscalCode(values.creditorInstitutionCode)
          //     ? t('addEditIbanPage.validationMessage.ecOwnerNotValid')
          //     : undefined,
        }).filter(([_key, value]) => value)
      );
    }

    return undefined;
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

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const submit = async (values: IbanOnCreation) => {
    if (uploadType === 'single') {
      setLoading(true);
      try {
        if (formAction === IbanFormAction.Create) {
          await createIban(values.creditorInstitutionCode, {
            iban: values.iban,
            description: values.description,
            validity_date: values.validityDate!,
            due_date: values.dueDate,
            is_active: true,
          });
        } else {
          await updateIban(values.creditorInstitutionCode, {
            iban: values.iban,
            description: values.description,
            validity_date: values.validityDate!,
            due_date: values.dueDate,
            labels: values.labels ?? undefined,
            is_active: true,
          });
        }
        history.push(ROUTES.IBAN);
      } catch (reason: any) {
        if (reason.httpStatus === 409) {
          // eslint-disable-next-line functional/no-let
          let errorKey = '';

          if (formik.values.iban.includes('07601')) {
            errorKey = 'postalIbanConflict';
          } else {
            errorKey = 'bankIbanConflict';
          }

          formik.setFieldError('iban', t(`addEditIbanPage.validationMessage.${errorKey}`));
        }

        addError({
          id: 'CREATE_UPDATE_IBAN',
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
    onSubmit: async (values) => {
      await submit(values);
    },
    enableReinitialize: true,
    validateOnMount: true,
  });

  const shouldDisableDate = (date: Date) => date < new Date();

  const inputGroupStyle = {
    borderRadius: 1,
    border: 1,
    borderColor: theme.palette.divider,
    p: 3,
    mb: 3,
  };

  return (
    <form onSubmit={formik.handleSubmit} data-testid="iban-form">
      <FormControl>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="upload-type-iban"
          sx={{ mt: 3, mb: 2 }}
          onChange={(e) => changeUploadType(e)}
        >
          <FormControlLabel
            checked={uploadType === 'single'}
            value="single"
            control={<Radio />}
            label={t('addEditIbanPage.addForm.fields.ibanUploadTypes.single')}
            sx={{ mr: 5 }}
            data-testid="upload-single-test"
          />
          <FormControlLabel
            checked={uploadType === 'multiple'}
            value="multiple"
            control={<Radio />}
            disabled
            label={t('addEditIbanPage.addForm.fields.ibanUploadTypes.multiple')}
            data-testid="upload-multiple-test"
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
                  disabled={formAction === IbanFormAction.Edit}
                  fullWidth
                  id="iban"
                  name="iban"
                  label={t('addEditIbanPage.addForm.fields.iban.ibanCode')}
                  size="small"
                  value={formik.values.iban?.toUpperCase()}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.iban && Boolean(formik.errors.iban)}
                  helperText={formik.touched.iban && formik.errors.iban}
                  inputProps={{
                    'data-testid': 'iban-test',
                  }}
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
                  inputProps={{
                    'data-testid': 'description-test',
                  }}
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
                    disabled={ibanBody?.active && formAction === IbanFormAction.Edit}
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
                          'data-testid': 'start-date-test',
                        }}
                        id="validityDate"
                        name="validityDate"
                        type="date"
                        size="small"
                        error={formik.touched.validityDate && Boolean(formik.errors.validityDate)}
                        helperText={formik.touched.validityDate && formik.errors.validityDate}
                      />
                    )}
                    shouldDisableDate={shouldDisableDate}
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
                          'data-testid': 'end-date-test',
                        }}
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        size="small"
                        error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
                        helperText={formik.touched.dueDate && formik.errors.dueDate}
                      />
                    )}
                    shouldDisableDate={shouldDisableDate}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Box>
          {/* <Box sx={inputGroupStyle}>
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
                    // onChange={(e) => changeSubject(e)}
                  >
                    <FormControlLabel
                      checked={subject === 'me'}
                      value="me"
                      control={<Radio />}
                      label={t('addEditIbanPage.addForm.fields.holder.me')}
                      sx={{ mr: 5 }}
                      data-testid="holder-me-test"
                    />
                    {/* <FormControlLabel
                      checked={subject === 'anotherOne'}
                      value="anotherOne"
                      control={<Radio />}
                      label={t('addEditIbanPage.addForm.fields.holder.anotherOne')}
                      data-testid="holder-anotherOne-test"
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
                  value={formik.values.creditorInstitutionCode}
                  onChange={(e) => formik.handleChange(e)}
                  inputProps={{
                    'data-testid': 'holder-fiscal-code-test',
                  }}
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
          </Box> */}
        </Box>
      </Paper>
      <Stack direction="row" justifyContent="space-between" mt={5}>
        <Stack display="flex" justifyContent="flex-start" mr={2}>
          <Button
            color="primary"
            variant="outlined"
            onClick={goBack}
            data-testid="back-button-test"
          >
            {t('addEditIbanPage.addForm.buttons.back')}
          </Button>
        </Stack>
        <Stack display="flex" justifyContent="flex-end">
          <Button
            disabled={!enableSubmit(formik.values)}
            color="primary"
            variant="contained"
            type="submit"
            data-testid="submit-button-test"
          >
            {t('addEditIbanPage.addForm.buttons.confirm')}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default AddEditIbanForm;
