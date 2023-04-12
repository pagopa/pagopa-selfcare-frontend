import { useHistory } from 'react-router';
import { Box, Button, Grid, Paper, Stack, TextField } from '@mui/material';
import { /* FormikProps */ useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { theme } from '@pagopa/mui-italia';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { Badge as BadgeIcon } from '@mui/icons-material';
import ROUTES from '../../../routes';

// import { useAppSelector } from '../../../redux/hooks';
// import { partiesSelectors } from '../../../redux/slices/partiesSlice';
// import { Party } from '../../../model/Party';
import { LOADING_TASK_NODE_SIGN_IN_EC } from '../../../utils/constants';
import FormSectionTitle from '../../../components/Form/FormSectionTitle';

type Props = {
  goBack: () => void;
};

const initialFormData = () => ({});

const inputGroupStyle = {
  borderRadius: 1,
  border: 1,
  borderColor: theme.palette.divider,
  p: 3,
  mb: 3,
};

// const validate = (values: Partial<NodeOnSignInPSP>) =>
//   Object.fromEntries(
//     Object.entries({

//     }).filter(([_key, value]) => value)
//   );

const NodeSignInPSPForm = ({ goBack }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();

  const setLoading = useLoading(LOADING_TASK_NODE_SIGN_IN_EC);

  //   const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

  //   const handleChangeNumberOnly = (
  //     e: React.ChangeEvent<any>,
  //     field: string,
  //     formik: FormikProps<NodeOnSignInPSP>
  //   ) => {
  //     const regex = /^[0-9\b]+$/;
  //     if (e.target.value === '' || regex.test(e.target.value)) {
  //       formik.setFieldValue(field, e.target.value);
  //     }
  //   };

  const formik = useFormik({
    initialValues: initialFormData(),
    // validate,
    onSubmit: async () => {
      await submit();
    },
    enableReinitialize: true,
  });

  const submit = async () => {
    setLoading(true);
    try {
      // TODO: manage submit
      history.push(ROUTES.HOME, {
        alertSuccessMessage: t('nodeSignInPage.form.successMessage'),
      });
    } catch (reason) {
      addError({
        id: 'NODE_SIGNIN_EC',
        blocking: false,
        error: reason as Error,
        techDescription: `An error occurred while registration at the node`,
        toNotify: true,
        displayableTitle: t('nodeSignInPage.form.errorMessageTitle'),
        displayableDescription: t('nodeSignInPage.form.errorMessageDesc'),
        component: 'Toast',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit} style={{ minWidth: '100%' }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 1,
            p: 3,
          }}
        >
          <Box sx={inputGroupStyle}>
            <FormSectionTitle
              title={t('nodeSignInPage.form.sections.registrationData')}
              icon={<BadgeIcon fontSize="small" />}
              isRequired
            ></FormSectionTitle>
            <Grid container spacing={2} mt={1}>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label={t('nodeSignInPage.form.ecFields.address')}
                  size="small"
                  disabled
                  value={''}
                  onChange={formik.handleChange}
                  // error={}
                  // helperText={}
                />
              </Grid>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="businessName"
                  name="businessName"
                  disabled
                  label={t('nodeSignInPage.form.ecFields.city')}
                  size="small"
                  value={''}
                  onChange={formik.handleChange}
                  // error={}
                  // helperText={}
                />
              </Grid>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="fiscalCode"
                  name="fiscalCode"
                  label={t('nodeSignInPage.form.ecFields.province')}
                  size="small"
                  disabled
                  value={''}
                  onChange={formik.handleChange}
                  // error={}
                  // helperText={}
                />
              </Grid>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="abiCode"
                  name="abiCode"
                  disabled
                  label={t('nodeSignInPage.form.ecFields.CAP')}
                  size="small"
                  value={''}
                  onChange={formik.handleChange}
                  // error={}
                  // helperText={}
                />
              </Grid>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="pspCode"
                  name="pspCode"
                  label={t('nodeSignInPage.form.ecFields.fiscalDomicile')}
                  size="small"
                  disabled
                  value={''}
                  onChange={formik.handleChange}
                  // error={}
                  // helperText={}
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>

        <Stack direction="row" justifyContent="space-between" mt={5}>
          <Stack display="flex" justifyContent="flex-start" mr={2}>
            <Button color="primary" variant="outlined" onClick={goBack}>
              {t('nodeSignInPage.form.backButton')}
            </Button>
          </Stack>
          <Stack display="flex" justifyContent="flex-end">
            <Button
              // onClick={()=>() /* handleSubmit */}
              disabled={!formik.dirty || !formik.isValid}
              color="primary"
              variant="contained"
              type="submit"
            >
              {t('nodeSignInPage.form.continueButton')}
            </Button>
          </Stack>
        </Stack>
      </form>
    </>
  );
};

export default NodeSignInPSPForm;
