import { useTranslation } from 'react-i18next';
import { theme } from '@pagopa/mui-italia';
import { Grid, TextField, Button, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { Badge as BadgeIcon } from '@mui/icons-material';
import ROUTES from '../../../routes';
import { LOADING_TASK_CREATE_OPERATION_TABLE } from '../../../utils/constants';
import { OperationTableOnCreation } from '../../../model/OperationTable';
import { TavoloOpResource } from '../../../api/generated/portal/TavoloOpResource';
import { createOperationTable, updateOperationTable } from '../../../services/operationTable';
import { Party } from '../../../model/Party';
import FormSectionTitle from '../../../components/Form/FormSectionTitle';
import { TavoloOpDto } from '../../../api/generated/portal/TavoloOpDto';

type Props = {
  selectedParty: Party;
  goBack: () => void;
  operationTableDetail?: TavoloOpResource;
};

const AddEditOperationTableForm = ({ selectedParty, goBack, operationTableDetail }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_CREATE_OPERATION_TABLE);
  const isUpdate = !!operationTableDetail;

  const initialFormData = (operationTableDetail?: TavoloOpResource) =>
    operationTableDetail
      ? {
          email: operationTableDetail.email,
          phone: operationTableDetail.telephone,
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
    const payload: TavoloOpDto = {
      email: values.email,
      name: selectedParty.description,
      referent: operationTableDetail?.referent ?? '',
      taxCode: selectedParty.fiscalCode,
      telephone: values.phone,
    };
    setLoading(true);
    try {
      await (isUpdate ? updateOperationTable(selectedParty.partyId, payload) : createOperationTable(payload));

      history.push(ROUTES.HOME);
    } catch (reason: any) {
      addError({
        id: 'CREATE_UPDATE_OPERATIONTABLE',
        blocking: false,
        error: reason as Error,
        techDescription: `An error occurred while adding/editing Operation Table`,
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
          <FormSectionTitle
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
