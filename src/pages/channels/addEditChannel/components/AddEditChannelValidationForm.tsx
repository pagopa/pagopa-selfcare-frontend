import { useTranslation } from 'react-i18next';
import { Box, Grid, Paper, TextField, Typography } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { FormikTouched, FormikErrors } from 'formik';
import { Badge as BadgeIcon } from '@mui/icons-material';
import { ChangeEvent } from 'react';
import AddEditChannelFormSectionTitle from '../AddEditChannelFormSectionTitle';
import { ChannelOnCreation } from '../../../../model/Channel';

type Props = {
  values: ChannelOnCreation;
  handleChange: (e: ChangeEvent<any>) => void;
  touched: FormikTouched<ChannelOnCreation>;
  errors: FormikErrors<ChannelOnCreation>;
};

const AddEditChannelValidationForm = ({ values, handleChange, errors, touched }: Props) => {
  const { t } = useTranslation();
  const inputGroupStyle = {
    borderRadius: 1,
    border: 1,
    borderColor: theme.palette.divider,
    p: 3,
    mb: 3,
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 4,
        borderRadius: 1,
        p: 3,
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6" mb={1}>
            {t('addEditChannelPage.addForm.validationForm.title')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" mb={3}>
            {t('addEditChannelPage.addForm.validationForm.subtitle')}
          </Typography>
        </Grid>
      </Grid>
      <Box>
        <Box sx={inputGroupStyle}>
          <AddEditChannelFormSectionTitle
            title={t('addEditChannelPage.addForm.sections.registry')}
            icon={<BadgeIcon fontSize="small" />}
            isRequired
          ></AddEditChannelFormSectionTitle>
          <Grid container spacing={2} mt={1}>
            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="primitiveVersion"
                name="primitiveVersion"
                label={t('addEditChannelPage.addForm.validationForm.fields.primitiveVersion')}
                size="small"
                value={values.primitiveVersion}
                onChange={handleChange}
                error={touched.primitiveVersion && Boolean(errors.primitiveVersion)}
                helperText={touched.primitiveVersion && errors.primitiveVersion}
                inputProps={{
                  'data-testid': 'primitive-version-test',
                }}
              />
            </Grid>
            <Grid container item xs={6}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label={t('addEditChannelPage.addForm.validationForm.fields.password')}
                size="small"
                value={values.password}
                onChange={handleChange}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                inputProps={{
                  'data-testid': 'password-name-test',
                }}
              />
            </Grid>
            <Grid container item xs={6} direction="column">
              <TextField
                fullWidth
                id="newPassword"
                name="newPassword"
                label={t('addEditChannelPage.addForm.validationForm.fields.newPassword')}
                size="small"
                value={values.new_password}
                onChange={handleChange}
                error={touched.new_password && Boolean(errors.new_password)}
                helperText={touched.new_password && errors.new_password}
                inputProps={{
                  'data-testid': 'new-password-code-test',
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
};

export default AddEditChannelValidationForm;
