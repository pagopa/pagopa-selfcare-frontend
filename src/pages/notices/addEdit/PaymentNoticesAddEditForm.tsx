import {useTranslation} from 'react-i18next';
import {SingleFileInput, theme} from '@pagopa/mui-italia';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  Link,
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
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import {Box} from '@mui/system';
import {useEffect, useState} from 'react';
import React from 'react';
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
import { uploadInstitutionData } from '../../../services/noticesService';

type Props = {
  goBack: () => void;
  data?: InstitutionUploadData | null;
};

// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
const PaymentNoticesAddEditForm = ({ goBack, data }: Props) => {
  const { t } = useTranslation();
  const [hasPay, setHasPay] = useState(data?.appChannel || data?.webChannel);
  const [hasPoste, setHasPoste] = useState(data?.posteAuth !== undefined && data?.posteAuth !== null);
  const history = useHistory();
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_CREATE_IBAN);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const signinData = useAppSelector(partiesSelectors.selectSigninData);
  const [file, setFile] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
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
      label: t("addEditInstitutionsDataPage.addForm.paymentType.onlyWeb")
    },
    {
      key: "only_app",
      label: t("addEditInstitutionsDataPage.addForm.paymentType.onlyApp")
    },
    {
      key: "both",
      label: t("addEditInstitutionsDataPage.addForm.paymentType.both")
    },
  ];

  const handleChangePaymentType = (key: string) => {
    setPaymentType(key); 
  };

  useEffect(() => {
    if (!hasPay && (formik.values.appChannel || formik.values.webChannel)) {
      setFlagValues(formik, false, false);   
    } else if (hasPay && (!formik.values.appChannel && !formik.values.webChannel)) {
      handleChangePaymentType('both');
    }
  }, [hasPay]);

  const setFlagValues = (formik: any, appChannel: boolean, webChannel: boolean) => {
    formik.setValues({
      ...formik.values,
      appChannel,
      webChannel
    });
  };

  useEffect(() => {
    if (paymentType) {
      if (paymentType === "only_web" &&
       (formik.values.appChannel === true || formik.values.webChannel === false)) {
          setFlagValues(formik, false, true);
       } else if (paymentType === "only_app") {
        setFlagValues(formik, true, false);   
       } else if (paymentType === "both") {
        setFlagValues(formik, true, true);
       }
    }
  }, [paymentType]);  
  

  const handleSelect = (file: File) => {
    setFile(file);
  };

  const handleRemove = () => {
    setFile(null);
  };

  const initialFormData = (data?: InstitutionUploadData | null) =>
    data !== undefined && data !== null && data.taxCode && data.taxCode !== ''
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
          taxCode: selectedParty?.fiscalCode as string,
          fullName: selectedParty?.description as string,
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
  const validate = (values: InstitutionUploadData): { [k: string]: string | undefined } | undefined => 
    Object.fromEntries(
      Object.entries({
        fullName: !values.fullName
          ? t('addEditInstitutionsDataPage.validationMessage.requiredField')
          : undefined,
        taxCode: !values.taxCode
          ? t('addEditInstitutionsDataPage.validationMessage.requiredField')
          : undefined,
        cbill: !values.cbill
          ? t('addEditInstitutionsDataPage.validationMessage.requiredField')
          : undefined,
        info: !values.info
          ? t('addEditInstitutionsDataPage.validationMessage.requiredField')
          : undefined, 
        webChannel: values.webChannel === undefined
          ? t('addEditInstitutionsDataPage.validationMessage.requiredField')
          : undefined,
        appChannel: values.appChannel === undefined
          ? t('addEditInstitutionsDataPage.validationMessage.requiredField')
          : undefined,    
        posteAccountNumber: hasPoste && !values.posteAccountNumber
          ? t('addEditInstitutionsDataPage.validationMessage.requiredField')
          : undefined,
        posteAuth: hasPoste && !values.posteAuth
          ? t('addEditInstitutionsDataPage.validationMessage.requiredField')
          : undefined,              
      }).filter(([_key, value]) => value)
    ); 

  const enableSubmit = (values: InstitutionUploadData) => {

      const baseCondition =
      values.fullName !== '' &&
      values.taxCode !== '' &&
      values.cbill !== '' && 
      values.info !== '' &&
      values.appChannel !== undefined &&
      values.webChannel !== undefined;

      if (hasPoste) {
        return baseCondition && 
          (values.posteAccountNumber !== undefined || values.posteAuth !== undefined);
      } else {
        return baseCondition;
      }
  };


  const submit = async (data: InstitutionUploadData, file: File | null) => {
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
          displayableTitle: t('addEditInstitutionsDataPage.errors.addEditTitle'),
          displayableDescription: t('addEditInstitutionsDataPage.errors.addEditMessage'),
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
        await submit(values, file);
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
        <Typography variant="h6" fontWeight="fontWeightMedium" mb={1}>
          {t('addEditInstitutionsDataPage.addForm.title')}
        </Typography>

        <Typography variant="body2" mb={1}>
          {t('addEditInstitutionsDataPage.addForm.subtitle')}
        </Typography>

        <Typography variant="body2" mb={3} sx={{ textDecoration: 'underline', fontWeight: 'medium' }}>
          <Link
            href="https://docs.pagopa.it/avviso-pagamento/allegato-2/specifiche-tecniche"
            target="_blank"
          >
            {t('addEditInstitutionsDataPage.addForm.link')}
          </Link>
        </Typography>

        <Box>
          <Box sx={inputGroupStyle}>
            <FormSectionTitle
                title={t('addEditInstitutionsDataPage.addForm.sections.ci.title')}
                icon={<BadgeIcon/>}
            />
            <Grid container spacing={2} mt={1}>
              <Grid container item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label={t('addEditInstitutionsDataPage.addForm.fields.name')}
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
                  label={t('addEditInstitutionsDataPage.addForm.fields.taxCode')}
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
                  label={t('addEditInstitutionsDataPage.addForm.fields.cbill')}
                  size="small"
                  value={formik.values.cbill}
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

              <Grid container item xs={12}>
                <TextField
                  fullWidth
                  id="organization"
                  name="organization"
                  label={t('addEditInstitutionsDataPage.addForm.fields.organization')}
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
                {(formik.values.logo === undefined || formik.values.logo === null) ?
                 (                
                  <SingleFileInput
                    value={file}
                    accept={['.png']}
                    onFileSelected={handleSelect}
                    onFileRemoved={handleRemove}
                    dropzoneLabel={t(
                      'addEditInstitutionsDataPage.addForm.dropFileText'
                    )}
                    rejectedLabel={t(
                      'addEditInstitutionsDataPage.addForm.rejectedFile'
                    )}
                  /> 
                 ) :
                 (
                  <React.Fragment>
                    <Typography variant="body1">
                      {t('addEditInstitutionsDataPage.addForm.logoText')}
                      <Link
                      component="button"
                      variant="body1"
                      onClick={() => formik.setFieldValue('logo', null)}
                      sx={{
                        verticalAlign: 'baseline',
                        ml: 1
                      }}
                    >
                      {t('addEditInstitutionsDataPage.addForm.logoLink')}
                    </Link>
                    </Typography>
                  </React.Fragment>
                )}
              </Grid>

            </Grid>
          </Box>

          <Box sx={inputGroupStyle}>
            <Stack direction="row" justifyContent="space-between">
                <Stack display="flex" justifyContent="flex-start" mr={2}>
                    <FormSectionTitle
                      title={t('addEditInstitutionsDataPage.addForm.sections.pay.title')}
                      icon={<RoomIcon />}
                    />
                </Stack>
                <Stack display="flex" justifyContent="flex-end" mb={1}>
                    <IconButton
                      sx={{
                        p: '0',
                        width: '100%',
                        '&:hover': { backgroundColor: 'transparent !important' },
                      }}
                      data-testid="pay-info-button"
                      onClick={() => setOpenDialog(true)}
                    >
                      <InfoOutlinedIcon sx={{ color: 'primary.main'}} />
                    </IconButton>
                </Stack>
            </Stack>

            <Box pl={1} mt={2}>
              <FormControl>
                <FormLabel sx={{fontWeight: 'medium', fontSize: '16px', mb: 1}}>
                  {t('addEditInstitutionsDataPage.addForm.sections.pay.radioTitle')}
                </FormLabel>
                <RadioGroup
                  name="hasPay"
                  row
                  onChange={(e) => setHasPay(e?.target?.value === "true")}
                  data-testid="has-pay-radio-group"
                  value={hasPay}
                >
                  <FormControlLabel
                    data-testid="pay-radio-yes"
                    value={true}
                    control={<Radio />}
                    label={t("general.yes")}
                    sx={{ pr: 8 }}
                  />
                  <FormControlLabel
                    data-testid="pay-radio-no"
                    value={false}
                    control={<Radio />}
                    label={t("general.no")}
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            {hasPay ? (
                <Grid container item xs={6} key={`payType`} sx={{mt: 2}}>
                    <FormControl fullWidth key={`payType`}>
                      <InputLabel size="small" key={`payType_label`}>
                        {t('addEditInstitutionsDataPage.addForm.fields.paymentType')}
                      </InputLabel>
                      <Select
                            id="paymentType"
                            name="paymentType"
                            labelId='paymentTypeLabel'
                            label={t('addEditInstitutionsDataPage.addForm.fields.paymentType')}
                            size="small"
                            value={paymentType}
                            onChange={(e) => handleChangePaymentType(e?.target?.value)}
                            data-testid="paymentType-select-test"
                            >
                            {paymentTypes.map((r: any) => (
                              <MenuItem key={`paymentType-${r.key}`} 
                                        value={r.key} data-testid={`paymentType-${r.key}-test`}>
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
              title={t('addEditInstitutionsDataPage.addForm.sections.poste.title')}
              icon={<EmailIcon />}
            />
            <Box pl={1} mt={2}>
              <FormControl>
                <FormLabel sx={{fontWeight: 'medium', fontSize: '16px', mb: 1}}>
                  {t('addEditInstitutionsDataPage.addForm.sections.poste.radioTitle')}
                </FormLabel>
                <RadioGroup
                  name="connectionType"
                  row
                  onChange={(e) => setHasPoste(e?.target?.value === "true")}
                  data-testid="has-poste-radio-group"
                  value={hasPoste}
                >
                  <FormControlLabel
                    data-testid="poste-radio-yes"
                    value={true}
                    control={<Radio />}
                    label={t("general.yes")}
                    sx={{ pr: 8 }}
                  />
                  <FormControlLabel
                    data-testid="poste-radio-no"
                    value={false}
                    control={<Radio />}
                    label={t("general.no")}
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            {hasPoste ? (
                <React.Fragment>
                  <Grid container spacing={2} mt={0}>
                    <Grid container item xs={12}>
                      <TextField
                        fullWidth
                        id="posteName"
                        name="posteName"
                        label={t('addEditInstitutionsDataPage.addForm.fields.posteName')}
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
                        label={t('addEditInstitutionsDataPage.addForm.fields.posteAccountNumber')}
                        size="small"
                        value={formik.values.posteAccountNumber}
                        onChange={(e) => formik.handleChange(e)}
                        error={formik.touched.posteAccountNumber && Boolean(formik.errors.posteAccountNumber)}
                        helperText={formik.touched.posteAccountNumber && formik.errors.posteAccountNumber}
                        inputProps={{
                          'data-testid': 'posteAccountNumber-test',
                        }}
                        required = {hasPoste}
                      />
                    </Grid>
                    <Grid container item xs={12}>
                      <TextField
                        fullWidth
                        id="posteAuth"
                        name="posteAuth"
                        label={t('addEditInstitutionsDataPage.addForm.fields.posteAuth')}
                        size="small"
                        value={formik.values.posteAuth}
                        onChange={(e) => formik.handleChange(e)}
                        error={formik.touched.posteAuth && Boolean(formik.errors.posteAuth)}
                        helperText={formik.touched.posteAuth && formik.errors.posteAuth}
                        inputProps={{
                          'data-testid': 'posteAuth-test',
                        }}
                        required = {hasPoste}
                      />
                    </Grid>
                  </Grid>
                </React.Fragment>
            ): (<Box></Box>)}

          </Box>

          <Box sx={inputGroupStyle}>
            <FormSectionTitle
              title={t('addEditInstitutionsDataPage.addForm.sections.assistance.title')}
              icon={<SupportAgentIcon />}
            />
            <Grid container spacing={2} mt={1}>
                <Grid container item xs={12}>
                    <TextField
                      fullWidth
                      id="info"
                      name="info"
                      label={t('addEditInstitutionsDataPage.addForm.fields.info')}
                      size="small"
                      value={formik.values.info}
                      onChange={(e) => formik.handleChange(e)}
                      error={formik.touched.info && Boolean(formik.errors.info)}
                      helperText={formik.touched.info && formik.errors.info}
                      inputProps={{
                        'data-testid': 'info-test',
                      }}
                      required
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
            {t('addEditInstitutionsDataPage.addForm.buttons.back')}
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
            {t('addEditInstitutionsDataPage.addForm.buttons.confirm')}
          </Button>
        </Stack>
      </Stack>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        data-testid="dialog-test"
      >
        <DialogTitle id="alert-dialog-title">
          {t('addEditInstitutionsDataPage.addForm.dialog.title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box>
              <Typography variant="sidenav">
                {t('addEditInstitutionsDataPage.addForm.dialog.header')}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1">
                  {hasPay ? t(formik.values.webChannel ?
                            formik.values.appChannel ? 'addEditInstitutionsDataPage.detail.webApp' :
                             'addEditInstitutionsDataPage.detail.onlyWeb'
                            : 'addEditInstitutionsDataPage.detail.onlyApp')+', ' : ''} 
                  {t('addEditInstitutionsDataPage.addForm.dialog.baseText')}
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            data-testid="dialog-button"
            variant="contained"
            sx={{
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: theme.spacing(0.5),
              px: 2,
              py: 1.5,
              display: 'flex',
              justifyContent: 'center',
            }}
            onClick={() => setOpenDialog(false)} autoFocus>
          {t('addEditInstitutionsDataPage.addForm.dialog.ok')}
          </Button>
        </DialogActions>
      </Dialog>                    

    </form>
  );
};

export default PaymentNoticesAddEditForm;
