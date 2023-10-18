import { useTranslation } from 'react-i18next';
import { theme } from '@pagopa/mui-italia';
import { Grid, TextField, Button, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { Badge as BadgeIcon } from '@mui/icons-material';
import { useEffect } from 'react';
import ROUTES from '../../../routes';
import { LOADING_TASK_CREATE_IBAN } from '../../../utils/constants';
// import { useAppSelector } from '../../../redux/hooks';
// import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { OperationTableFormAction, OperationTableOnCreation } from '../../../model/OperationTable';
import AddEditIbanFormSectionTitle from '../../iban/addEditIban/components/AddEditIbanFormSectionTitle';

type Props = {
  goBack: () => void;
  operationTableDetail?: OperationTableOnCreation;
  formAction: string;
};

const AddEditOperationTableForm = ({ goBack, operationTableDetail, formAction }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_CREATE_IBAN);
  // const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  // const ecCode = selectedParty ? selectedParty.fiscalCode : '';

  const initialFormData = (operationTableDetail?: OperationTableOnCreation) =>
    operationTableDetail
      ? {
          email: operationTableDetail.email,
          phone: operationTableDetail.phone,
        }
      : {
          email: '',
          phone: '',
        };

  const validate = (values: OperationTableOnCreation) =>
    Object.fromEntries(
      Object.entries({
        email: !values.email
          ? t('general.validation.requiredField')
          : !isValidEmail(values.email)
          ? t('addEditOperationTableForm.form.validation.emailNotValid')
          : undefined,
        phone: !values.phone
          ? t('general.validation.requiredField')
          : !isValidPhone(values.phone)
          ? t('addEditOperationTableForm.form.validation.phoneNotValid')
          : undefined,
      }).filter(([_key, value]) => value)
    );

  const isValidEmail = (email: string) => {
    const mailregex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    return mailregex.test(email);
  };

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[0-9]*$/;
    return phoneRegex.test(phone);
  };

  const enableSubmit = (values: OperationTableOnCreation) => {
    const baseCondition = values.email !== '' && values.phone !== '';

    return !!baseCondition;
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const submit = async (values: OperationTableOnCreation) => {
    setLoading(true);
    try {
      if (formAction === OperationTableFormAction.Create) {
        console.log('create OPTABLE');
        // TODO: connect to real service
      } else {
        console.log('create Update OPTABLE');
        // TODO: connect to real service
      }
      history.push(ROUTES.HOME);
    } catch (reason: any) {
      addError({
        id: 'CREATE_UPDATE_IBAN',
        blocking: false,
        error: reason as Error,
        techDescription: `An error occurred while adding/editing iban`,
        toNotify: true,
        displayableTitle: t('addEditOperationTableForm.errors.createOperationTableTitle'),
        displayableDescription: t('addEditOperationTableForm.errors.createOperationTableDesc'),
        component: 'Toast',
      });
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik<OperationTableOnCreation>({
    initialValues: initialFormData(operationTableDetail),
    validate,
    onSubmit: async (values) => {
      await submit(values);
    },
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
  });

  const inputGroupStyle = {
    borderRadius: 1,
    border: 1,
    borderColor: theme.palette.divider,
    p: 3,
    mb: 3,
  };

  return (
    <form onSubmit={formik.handleSubmit} data-testid="operationTable-form">
      <Box>
        <Box sx={inputGroupStyle}>
          <AddEditIbanFormSectionTitle
            title={t('addEditOperationTableForm.form.sections.main')}
            icon={<BadgeIcon />}
            isRequired
          />
          <Grid container spacing={2} mt={1}>
            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label={t('addEditOperationTableForm.form.fields.email')}
                size="small"
                value={formik.values.email}
                onChange={(e) => formik.handleChange(e)}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                inputProps={{
                  'data-testid': 'email-test',
                }}
              />
            </Grid>

            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label={t('addEditOperationTableForm.form.fields.phone')}
                size="small"
                value={formik.values.phone}
                onChange={(e) => formik.handleChange(e)}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                inputProps={{
                  'data-testid': 'phone-test',
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Stack direction="row" justifyContent="space-between" mt={5}>
        <Stack display="flex" justifyContent="flex-start" mr={2}>
          <Button
            color="primary"
            variant="outlined"
            onClick={goBack}
            data-testid="back-button-test"
          >
            {t('general.back')}
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
            {t('general.confirm')}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default AddEditOperationTableForm;
