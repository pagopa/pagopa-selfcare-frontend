import {useTranslation} from 'react-i18next';
import {SingleFileInput, theme} from '@pagopa/mui-italia';
import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import RoomIcon from '@mui/icons-material/Room';
import EmailIcon from '@mui/icons-material/Email';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import {Box} from '@mui/system';
import {useEffect, useState} from 'react';
import {useFormik} from 'formik';
import {useHistory} from 'react-router-dom';
import {useErrorDispatcher, useLoading} from '@pagopa/selfcare-common-frontend';
import ROUTES from '../../../routes';
import {LOADING_TASK_CREATE_IBAN} from '../../../utils/constants';
import {useAppSelector} from '../../../redux/hooks';
import {partiesSelectors} from '../../../redux/slices/partiesSlice';
import {extractProblemJson} from '../../../utils/client-utils';
import { InstitutionUploadData } from '../../../api/generated/portal/InstitutionUploadData';
import FormSectionTitle from '../../../components/Form/FormSectionTitle';
import React from 'react';
import { uploadInstitutionData } from '../../../services/noticesService';

type Props = {
  goBack: () => void;
  data?: InstitutionUploadData;
};

const PaymentNoticesAddEditForm = ({ goBack, data }: Props) => {
  const { t } = useTranslation();
  const [hasPay, setHasPay] = useState(data?.appChannel || data?.webChannel);
  const [hasPoste, setHasPoste] = useState(data?.posteAuth !== null)
  const history = useHistory();
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_CREATE_IBAN);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const signinData = useAppSelector(partiesSelectors.selectSigninData);
  const [file, setFile] = useState<File | null>(null);
  const [paymentType, setPaymentType] = useState<string>(
    data?.webChannel === true && data?.appChannel === false ? 
      "only_web" : 
    data?.webChannel === false && data?.appChannel === true ?
      "only_app" :
      "both"  
  );

  const paymentTypes = [
    {
      key: "only_web",
      label: t("addEditInstitutionsData.addForm.paymentType.onlyWeb")
    },
    {
      key: "only_app",
      label: t("addEditInstitutionsData.addForm.paymentType.onlyApp")
    },
    {
      key: "both",
      label: t("addEditInstitutionsData.addForm.paymentType.both")
    },
  ];

  const handleChangePaymentType = (key: string) => {
    setPaymentType(key); 
  };

  useEffect(() => {
    if (paymentType) {
      if (paymentType === "only_web" &&
       (formik.values.appChannel === true || formik.values.webChannel === false)) {
        formik.setValues({
          ...formik.values,
          appChannel: false,
          webChannel: true
        })
       } else if (paymentType === "only_app") {
        formik.setValues({
          ...formik.values,
          appChannel: true,
          webChannel: false
        })        
       } else if (paymentType === "both") {
        formik.setValues({
          ...formik.values,
          appChannel: true,
          webChannel: true
        })  
       }
    }
  }, [paymentType]);  
  

  const handleSelect = (file: File) => {
    setFile(file);
  };

  const handleRemove = () => {
    setFile(null);
  };

  const initialFormData = (data?: InstitutionUploadData) =>
    data
      ? {
          taxCode: data.taxCode,
          fullName: data.fullName,
          cbill: data.cbill,
          appChannel: data.appChannel,
          webChannel: data.webChannel,
          info: data.info,
          organization: data.organization,
          logo: data.logo,
          physicalChannel: data.physicalChannel,
          posteName: data.posteName,
          posteAuth: data.posteAuth,
          posteAccountNumber: data.posteAccountNumber
        }
      : {
          taxCode: signinData?.creditorInstitutionDetailsResource?.creditorInstitutionCode as string,
          fullName: signinData?.creditorInstitutionDetailsResource?.businessName as string,
          cbill: signinData?.creditorInstitutionDetailsResource?.cbillCode as string,
          appChannel: false,
          webChannel: false,
          info: '',
          organization: '',
          logo: undefined,
          physicalChannel: '',
          posteName: undefined,
          posteAuth: undefined,
          posteAccountNumber: undefined
        };
            

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const validate = (values: InstitutionUploadData): { [k: string]: string | undefined } | undefined => {

    return undefined;
  };

  const enableSubmit = (values: InstitutionUploadData) => {
      return true;
  }


  // eslint-disable-next-line sonarjs/cognitive-complexity
  const submit = async (data: InstitutionUploadData, file: File) => {
      setLoading(true);
      try {
        await uploadInstitutionData(file, data);
        history.push(ROUTES.PAYMENT_NOTICES);
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
    };
  

  const formik = useFormik<InstitutionUploadData>({
    initialValues: initialFormData(data),
    validate,
    onSubmit: async (values) => {
      if (file != null) {
        await submit(values, file);
      };
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
                icon={<BadgeIcon/>}
            />
            <Grid container spacing={2} mt={1}>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label={t('addEditInstitutionsData.addForm.fields.name')}
                  size="small"
                  value={formik.values.fullName}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                  helperText={formik.touched.fullName && formik.errors.fullName}
                  inputProps={{
                    'data-testid': 'name-test',
                  }}
                  required
                  disabled
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
                  required
                  disabled
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
                  required
                  disabled
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
                  accept={['.png']}
                  onFileSelected={handleSelect}
                  onFileRemoved={handleRemove}
                  dropzoneLabel={t(
                    'addEditInstitutionsData.addForm.dropFileText'
                  )}
                  rejectedLabel={t(
                    'addEditInstitutionsData.addForm.rejectedFile'
                  )}
                />
              </Grid>

            </Grid>
          </Box>

          <Box sx={inputGroupStyle}>
            <FormSectionTitle
              title={t('addEditInstitutionsData.addForm.sections.pay')}
              icon={<RoomIcon />}
            />
            <Box pl={2} mt={2}>
              <FormControl>
                <RadioGroup
                  name="hasPay"
                  row
                  onChange={(e) => setHasPay(e?.target?.value == "true")}
                  data-testid="has-pay-radio-group"
                  value={hasPay}
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label={t("general.yes")}
                    sx={{ pr: 8 }}
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label={t("general.no")}
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
                            value={paymentType}
                            onChange={(e) => handleChangePaymentType(e?.target?.value)}
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
              icon={<EmailIcon />}
            />
            <Box pl={2} mt={2}>
              <FormControl>
                <RadioGroup
                  name="connectionType"
                  row
                  onChange={(e) => setHasPoste(e?.target?.value == "true")}
                  data-testid="hss-poste-radio-group"
                  value={hasPoste}
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label={t("general.yes")}
                    sx={{ pr: 8 }}
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label={t("general.no")}
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
              icon={<SupportAgentIcon />}
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
