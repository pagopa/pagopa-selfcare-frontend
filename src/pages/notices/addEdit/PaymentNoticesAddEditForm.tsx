import {useTranslation} from 'react-i18next';
import {theme} from '@pagopa/mui-italia';
import {
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
import {useEffect, useState} from 'react';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {useFormik} from 'formik';z
import {useHistory} from 'react-router-dom';
import {useErrorDispatcher, useLoading} from '@pagopa/selfcare-common-frontend';
import ROUTES from '../../../routes';
import {LOADING_TASK_CREATE_IBAN} from '../../../utils/constants';
import {useAppSelector} from '../../../redux/hooks';
import {partiesSelectors} from '../../../redux/slices/partiesSlice';
import {extractProblemJson} from '../../../utils/client-utils';

type Props = {
  goBack: () => void;
  data?: InstitutionUploadData;
};

const PaymentNoticesAddEditForm = ({ goBack, data }: Props) => {
  const { t } = useTranslation();
  const [subject, setSubject] = useState('me');
  const [uploadType, setUploadType] = useState('single');
  const history = useHistory();
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_CREATE_IBAN);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);


  const changeUploadType = (event: any) => {
    setUploadType(event.target.value);
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
  const validate = (values: InstitutionUploadData): { [k: string]: string | undefined } | undefined => {

    return undefined;
  };


  // eslint-disable-next-line sonarjs/cognitive-complexity
  const submit = async (values: InstitutionUploadData) => {
      setLoading(true);
      try {

        history.push(PAYMENT_NOTICES.IBAN);
      } catch (reason: any) {
        const problemJson = extractProblemJson(reason);
        addError({
          id: 'ADDEDIT_INSTITUTION:DATA',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while adding/editing notice ci data`,
          toNotify: true,
          displayableTitle: t('addEditInstitutionsData.errors.addEditTitle'),
          displayableDescription: t('addEditInstitutionsData.errors.addEditMessage'),
          component: 'Toast',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const formik = useFormik<InstitutionUploadData>({
    initialValues: initialFormData(data),
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
    <form onSubmit={formik.handleSubmit} data-testid="institution-data-form">
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
          {t('addEditInstitutionsDataPage.title')}
        </Typography>

        <Typography variant="body2" mb={3}>
          {t('addEditInstitutionsDataPage.subtitle')}
        </Typography>

        <Box>
          <Box sx={inputGroupStyle}>
            <FormSectionTitle
                title={t('addEditInstitutionsData.addForm.sections.ci')}
                icon={<MenuBook/>}
            />
            <Grid container spacing={2} mt={1}>
              <Grid container item xs={6}>
                <TextField
                  disabled={true}
                  fullWidth
                  id="name"
                  name="name"
                  label={t('addEditInstitutionsData.addForm.fields.name')}
                  size="small"
                  value={formik.values.name}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  inputProps={{
                    'data-testid': 'name-test',
                  }}
                />
              </Grid>

              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="taxCode"
                  name="taxCode"
                  label={t('addEditInstitutionsData.addForm.fields.taxCode')}
                  size="small"
                  value={formik.values.taxCode}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.taxCode && Boolean(formik.errors.taxCode)}
                  helperText={formik.touched.taxCode && formik.errors.taxCode}
                  inputProps={{
                    'data-testid': 'taxCode-test',
                  }}
                />
              </Grid>

              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="cbill"
                  name="cbill"
                  label={t('addEditInstitutionsData.addForm.fields.cbill')}
                  size="small"
                  value={formik.values.taxCode}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.cbill && Boolean(formik.errors.cbill)}
                  helperText={formik.touched.cbill && formik.errors.cbill}
                  inputProps={{
                    'data-testid': 'cbill-test',
                  }}
                />
              </Grid>

              <Grid container item xs={6}>
                <Box></Box>
              </Grid>

              <Grid container item xs={12}>
                <TextField
                  fullWidth
                  id="organization"
                  name="organization"
                  label={t('addEditInstitutionsData.addForm.fields.organization')}
                  size="small"
                  value={formik.values.organization}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.organization && Boolean(formik.errors.organization)}
                  helperText={formik.touched.organization && formik.errors.organization}
                  inputProps={{
                    'data-testid': 'organization-test',
                  }}
                />
              </Grid>

              <Grid container item xs={12}>
                <SingleFileInput
                  value={file}
                  accept={['.csv']}
                  onFileSelected={handleSelect}
                  onFileRemoved={handleRemove}
                  dropzoneLabel={t(
                    'commissionBundlesPage.addEditCommissionBundle.addTaxonomies.dropFileText'
                  )}
                  rejectedLabel={t(
                    'commissionBundlesPage.addEditCommissionBundle.addTaxonomies.rejectedFile'
                  )}
                />
              </Grid>

            </Grid>
          </Box>

          <Box sx={inputGroupStyle}>
            <FormSectionTitle
              title={t('addEditInstitutionsData.addForm.sections.pay')}
              icon={<MonetizationOnIcon />}
            />
            <Box pl={2} mt={2}>
              <FormControl>
                <RadioGroup
                  name="hasPay"
                  row
                  onChange={(e) => handleChangeHasOnlinePay(e?.target?.value)}
                  data-testid="has-pay-radio-group"
                  value={hasPay}
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label={<ConnectionRadioLabel type={"general.yes"} />}
                    sx={{ pr: 8 }}
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label={<ConnectionRadioLabel type={"general.no"} />}
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            {hasPay ? (
                <Grid container item xs={6} key={`payType`}>
                    <FormControl fullWidth key={`payType`}>
                      <InputLabel size="small" key={`payType_label`}>
                        {t('addEditInstitutionsData.addForm.fields.paymentType')}
                      </InputLabel>
                      <Select
                            id="paymentType"
                            name="paymentType"
                            labelId='paymentTypeLabel'
                            label={t('addEditInstitutionsData.addForm.fields.paymentType')}
                            size="small"
                            value={formik.values.paymentType}
                            onChange={(e) => formik.handleChange(e)}
                            data-testid="paymentType-test"
                            inputProps={{
                              'data-testid': 'paymentType-test',
                            }}
                            >
                            {paymentTypes.map((r: any) => (
                              <MenuItem key={`paymentType-${r.key}`} value={r.key}>
                                {t(r.label)}
                              </MenuItem>
                            ))}
                      </Select>
                    </FormControl>
                </Grid>
            ) : (<Box></Box>)}

          </Box>

          <Box sx={inputGroupStyle}>
            <FormSectionTitle
              title={t('addEditInstitutionsData.addForm.sections.poste')}
              icon={<MonetizationOnIcon />}
            />
            <Box pl={2} mt={2}>
              <FormControl>
                <RadioGroup
                  name="connectionType"
                  row
                  onChange={(e) => handleChangeHasPoste(e?.target?.value)}
                  data-testid="hss-poste-radio-group"
                  value={hasPoste}
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label={<ConnectionRadioLabel type={"general.yes"} />}
                    sx={{ pr: 8 }}
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label={<ConnectionRadioLabel type={"general.no"} />}
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            {hasPoste ? (
                <React.Fragment>
                  <Grid container item xs={12}>
                    <TextField
                      fullWidth
                      id="posteName"
                      name="posteName"
                      label={t('addEditInstitutionsData.addForm.fields.poste.name')}
                      size="small"
                      value={formik.values.posteName}
                      onChange={(e) => formik.handleChange(e)}
                      error={formik.touched.posteName && Boolean(formik.errors.posteName)}
                      helperText={formik.touched.posteName && formik.errors.posteName}
                      inputProps={{
                        'data-testid': 'posteName-test',
                      }}
                    />
                  </Grid>
                  <Grid container item xs={12}>
                    <TextField
                      fullWidth
                      id="posteAccountNumber"
                      name="posteAccountNumber"
                      label={t('addEditInstitutionsData.addForm.fields.poste.accountNumber')}
                      size="small"
                      value={formik.values.posteAccountNumber}
                      onChange={(e) => formik.handleChange(e)}
                      error={formik.touched.posteAccountNumber && Boolean(formik.errors.posteAccountNumber)}
                      helperText={formik.touched.posteAccountNumber && formik.errors.posteAccountNumber}
                      inputProps={{
                        'data-testid': 'posteAccountNumber-test',
                      }}
                    />
                  </Grid>
                  <Grid container item xs={12}>
                    <TextField
                      fullWidth
                      id="posteAuth"
                      name="posteAuth"
                      label={t('addEditInstitutionsData.addForm.fields.poste.auth')}
                      size="small"
                      value={formik.values.posteAuth}
                      onChange={(e) => formik.handleChange(e)}
                      error={formik.touched.posteAuth && Boolean(formik.errors.posteAuth)}
                      helperText={formik.touched.posteAuth && formik.errors.posteAuth}
                      inputProps={{
                        'data-testid': 'posteAuth-test',
                      }}
                    />
                  </Grid>
                </React.Fragment>
            ): (<Box></Box>)}

          </Box>

          <Box sx={inputGroupStyle}>
            <FormSectionTitle
              title={t('addEditInstitutionsData.addForm.sections.assistance')}
              icon={<MonetizationOnIcon />}
            />
            <Grid container spacing={2} mt={1}>
                <Grid container item xs={12}>
                    <TextField
                      fullWidth
                      id="posteInfo"
                      name="posteInfo"
                      label={t('addEditInstitutionsData.addForm.fields.poste.info')}
                      size="small"
                      value={formik.values.info}
                      onChange={(e) => formik.handleChange(e)}
                      error={formik.touched.info && Boolean(formik.errors.info)}
                      helperText={formik.touched.info && formik.errors.info}
                      inputProps={{
                        'data-testid': 'posteInfo-test',
                      }}
                    />
                  </Grid>
            </Grid>

          </Box>

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

export default PaymentNoticesAddEditForm;
