
import {useTranslation} from 'react-i18next';
import {theme} from '@pagopa/mui-italia';
import {
    Alert,
    Button,
    FormControl,
    FormControlLabel,
    Grid,
    Paper,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    TextFieldProps,
    Typography,
} from '@mui/material';
import {Box} from '@mui/system';
import {SingleFileInput} from '@pagopa/mui-italia';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {useEffect, useState} from 'react';
import {DesktopDatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {useFormik} from 'formik';
import {useHistory} from 'react-router-dom';
import {useErrorDispatcher, useLoading} from '@pagopa/selfcare-common-frontend';
import {add, differenceInCalendarDays} from 'date-fns';
import ROUTES from '../../../routes';
import {LOADING_TASK_CREATE_IBAN} from '../../../utils/constants';
import {IbanFormAction, IbanOnCreation} from '../../../model/Iban';
import {useAppSelector} from '../../../redux/hooks';
import {partiesSelectors} from '../../../redux/slices/partiesSlice';
import {extractProblemJson} from '../../../utils/client-utils';
import {createIban, updateIban} from '../../../services/ibanService';
import {isIbanValidityDateEditable, isValidIBANNumber} from '../../../utils/common-utils';
import {validateIbanCsvData, ValidationResult} from '../../../utils/iban-csv-to-upload-parser';
import AddEditIbanFormSectionTitle from './components/AddEditIbanFormSectionTitle';

type Props = {
    goBack: () => void;
    ibanBody?: IbanOnCreation;
    formAction: string;
};

const defaultValidityDate = add(new Date(), {days: 1});
const defaultDueDate = add(new Date(), {years: 1});

const AddEditIbanForm = ({goBack, ibanBody, formAction}: Props) => {
    const {t} = useTranslation();
    const [subject, setSubject] = useState('me');
    const [uploadType, setUploadType] = useState('single');
    const [file, setFile] = useState<File | null>(null);
    const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
    const [showValidation, setShowValidation] = useState(false);
    const history = useHistory();
    const addError = useErrorDispatcher();
    const setLoading = useLoading(LOADING_TASK_CREATE_IBAN);
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
    const ecCode = selectedParty ? selectedParty.fiscalCode : '';

    useEffect(() => {
        if (subject === 'me') {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            formik.setFieldValue('creditor_institution_code', ecCode);
        } else {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            formik.setFieldValue('creditor_institution_code', '');
        }
    }, [subject, ecCode]);

    const changeUploadType = (event: any) => {
        setUploadType(event.target.value);
        if (event.target.value === 'single') {
            setFile(null);
            setValidationResult(null);
            setShowValidation(false);
        }
    };

    const handleFileSelect = async (selectedFile: File) => {
        setFile(selectedFile);
        setShowValidation(false);
        setValidationResult(null);

        try {
            const text = await selectedFile.text();
            const result = validateIbanCsvData(text);
            setValidationResult(result);
            setShowValidation(true);
        } catch (error) {
            addError({
                id: 'CSV_PARSE_ERROR',
                blocking: false,
                error: error as Error,
                techDescription: 'Error parsing CSV file',
                toNotify: true,
                displayableTitle: 'Errore lettura file',
                displayableDescription: 'Impossibile leggere il file CSV',
                component: 'Toast',
            });
        }
    };

    const handleFileRemove = () => {
        setFile(null);
        setValidationResult(null);
        setShowValidation(false);
    };

    const initialFormData = (ibanBody?: IbanOnCreation) =>
        ibanBody
            ? {
                iban: ibanBody.iban,
                description: ibanBody.description,
                validity_date: ibanBody.validity_date,
                due_date: ibanBody.due_date,
                creditor_institution_code: ibanBody.creditor_institution_code,
                labels: ibanBody.labels ?? undefined,
                is_active: ibanBody.is_active,
            }
            : {
                iban: '',
                description: '',
                validity_date: defaultValidityDate,
                due_date: defaultDueDate,
                creditor_institution_code: ecCode,
                is_active: true,
            };

    // eslint-disable-next-line sonarjs/cognitive-complexity
    const validate = (values: IbanOnCreation): { [k: string]: string | undefined } | undefined => {
        if (uploadType === 'single') {
            return Object.fromEntries(
                Object.entries({
                    iban: !values.iban
                        ? t('addEditIbanPage.validationMessage.requiredField')
                        : !isValidIBANNumber(values.iban, true)
                            ? t('addEditIbanPage.validationMessage.ibanNotValid')
                            : undefined,
                    description: !values.description ? 'Campo obbligatorio' : undefined,
                    validity_date: isIbanValidityDateEditable(ibanBody)
                        ? !values.validity_date
                            ? t('addEditIbanPage.validationMessage.requiredField')
                            : differenceInCalendarDays(values.validity_date, defaultValidityDate) < 0
                                ? t('addEditIbanPage.validationMessage.dateNotValid')
                                : values.due_date &&
                                differenceInCalendarDays(values.due_date, values.validity_date) <= 0
                                    ? t('addEditIbanPage.validationMessage.startDateOverEndDate')
                                    : undefined
                        : undefined,
                    due_date: !values.due_date
                        ? t('addEditIbanPage.validationMessage.requiredField')
                        : differenceInCalendarDays(values.due_date, defaultValidityDate) < 0
                            ? t('addEditIbanPage.validationMessage.dateNotValid')
                            : values.validity_date &&
                            differenceInCalendarDays(values.due_date, values.validity_date) <= 0
                                ? t('addEditIbanPage.validationMessage.endDateUnderStartDate')
                                : undefined,
                }).filter(([_key, value]) => value)
            );
        }

        return undefined;
    };

    const enableSubmit = (values: IbanOnCreation) => {
        if (uploadType === 'single') {
            const baseCondition =
                values.iban !== '' &&
                values.description !== '' &&
                values.validity_date &&
                values.validity_date.getTime() > 0 &&
                values.due_date &&
                values.due_date.getTime() > 0;

            if (baseCondition && subject === 'me') {
                return true;
            } else {
                return baseCondition && subject === 'anotherOne' && values.creditor_institution_code !== '';
            }
        } else {
            return file !== null && validationResult !== null && validationResult.valid;
        }
    };

    // eslint-disable-next-line sonarjs/cognitive-complexity
    const submit = async (values: IbanOnCreation) => {
        setLoading(true);
        try {
            if (uploadType === 'single') {
                if (formAction === IbanFormAction.Create) {
                    await createIban(ecCode, {
                        iban: values.iban.toUpperCase().trim(),
                        description: values.description,
                        validity_date: values.validity_date,
                        due_date: values.due_date,
                        is_active: true,
                    });
                } else {
                    await updateIban(ecCode, {
                        iban: values.iban.toUpperCase().trim(),
                        description: values.description,
                        validity_date: values.validity_date,
                        due_date: values.due_date,
                        labels: values.labels ?? undefined,
                        is_active: true,
                    });
                }
            } else {
                if (validationResult && validationResult.valid) {
                    // await uploadBulkIban(ecCode, validationResult.data);
                    console.log('TODO:', JSON.stringify(validationResult.data, null, 2));
                }
            }

            history.push(ROUTES.IBAN);
        } catch (reason: any) {
            const problemJson = extractProblemJson(reason);
            if (problemJson?.status === 409) {
                formik.setFieldError('iban', t('addEditIbanPage.validationMessage.bankIbanConflict'));
            } else {
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
            }
        } finally {
            setLoading(false);
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
                    sx={{mt: 3, mb: 2}}
                    onChange={(e) => changeUploadType(e)}
                >
                    <FormControlLabel
                        checked={uploadType === 'single'}
                        value="single"
                        control={<Radio/>}
                        label={t('addEditIbanPage.addForm.fields.ibanUploadTypes.single')}
                        sx={{mr: 5}}
                        data-testid="upload-single-test"
                    />
                    <FormControlLabel
                        checked={uploadType === 'multiple'}
                        value="multiple"
                        control={<Radio/>}
                        label={t('addEditIbanPage.addForm.fields.ibanUploadTypes.multiple')}
                        data-testid="upload-multiple-test"
                    />
                </RadioGroup>
            </FormControl>

            {uploadType === 'single' ? (
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
                                icon={<MonetizationOnIcon/>}
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
                                icon={<CalendarTodayIcon/>}
                            />
                            <Grid container spacing={2} mt={1}>
                                <Grid container item xs={3}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DesktopDatePicker
                                        disabled={
                                            !isIbanValidityDateEditable(ibanBody) && formAction === IbanFormAction.Edit
                                        }
                                            label={t('addEditIbanPage.addForm.fields.dates.start')}
                                            inputFormat="dd/MM/yyyy"
                                            value={formik.values.validity_date}
                                            onChange={(e) => formik.setFieldValue('validity_date', e)}
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
                                                    error={formik.touched.validity_date && Boolean(formik.errors.validity_date)}
                                                    helperText={formik.touched.validity_date && formik.errors.validity_date}
                                                />
                                            )}
                                            shouldDisableDate={(date: Date) => date < new Date()}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid container item xs={3}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DesktopDatePicker
                                            label={t('addEditIbanPage.addForm.fields.dates.end')}
                                            inputFormat="dd/MM/yyyy"
                                            value={formik.values.due_date}
                                            onChange={(e) => formik.setFieldValue('due_date', e)}
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
                                                    error={formik.touched.due_date && Boolean(formik.errors.due_date)}
                                                    helperText={formik.touched.due_date && formik.errors.due_date}
                                                />
                                            )}
                                            shouldDisableDate={(date: Date) => date < formik.values.validity_date}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Paper>
            ) : (
                <Paper elevation={0} sx={{borderRadius: 1, p: 3, minWidth: '100%', mb: 4}}>
                    <Typography variant="h6" fontWeight="fontWeightMedium" mb={3}>
                        {t('addEditIbanPage.addForm.fields.ibanUploadTypes.multiple')}
                    </Typography>

                    <Typography variant="body2" mb={3}>
                        Carica un file CSV con le colonne: CF, IBAN, Azione (censimento/variazione/cancellazione), Data attivazione IBAN
                    </Typography>

                    <Box sx={inputGroupStyle}>
                        <AddEditIbanFormSectionTitle title="Carica file CSV" icon={<UploadFileIcon/>} />
                        <Box mt={3}>
                            <SingleFileInput
                                label="File CSV (obbligatorio)"
                                value={file}
                                accept={['.csv', 'text/csv']}
                                onFileSelected={handleFileSelect}
                                onFileRemoved={handleFileRemove}
                                dropzoneLabel="Trascina qui il file CSV oppure"
                                // dropzoneButton="carica un file"
                                rejectedLabel="Formato file non supportato. Usa solo file CSV."
                            />
                        </Box>

                        {showValidation && validationResult && (
                            <Box mt={3}>
                                {validationResult.valid ? (
                                    <Alert severity="success" sx={{mb: 2}}>
                                        <Typography variant="body2" fontWeight="bold" mb={1}>
                                            File validato con successo!
                                        </Typography>
                                        <Typography variant="body2">
                                            Verranno aggiunti <strong>{validationResult.summary.toAdd}</strong> IBAN, 
                                            modificati <strong>{validationResult.summary.toUpdate}</strong> e 
                                            cancellati <strong>{validationResult.summary.toDelete}</strong>.
                                        </Typography>
                                    </Alert>
                                ) : (
                                    <Alert severity="error">
                                        <Typography variant="body2" fontWeight="bold" mb={1}>
                                            Errori di validazione trovati:
                                        </Typography>
                                        <Box component="ul" sx={{mt: 1, mb: 0, pl: 2}}>
                                            {validationResult.errors.map((error, index) => (
                                                <li key={index}>
                                                    <Typography variant="body2">{error}</Typography>
                                                </li>
                                            ))}
                                        </Box>
                                    </Alert>
                                )}
                            </Box>
                        )}
                    </Box>
                </Paper>
            )}

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
