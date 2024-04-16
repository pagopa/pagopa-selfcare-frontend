import {
  CompareArrows as CompareArrowsIcon,
  InfoOutlined as InfoOutlinedIcon,
} from '@mui/icons-material';
import { Alert, Box, FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import FormSectionTitle from '../../../../components/Form/FormSectionTitle';

type Props = {
  labelTrue: string;
  labelFalse: string;
  value: boolean;
  setIntermediaryAvailableValue: (intermediaryAvailableValue: boolean) => void;
  isChangeDisabled?: boolean;
};
const CommonRadioGroup = ({ labelTrue, labelFalse, value, setIntermediaryAvailableValue, isChangeDisabled }: Props) => {
  const { t } = useTranslation();
  const [showAlert, setShowAlert] = useState<boolean>(value);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const radioNewValue = (event.target as HTMLInputElement).value === "true";
    console.log(radioNewValue);
    if (radioNewValue) {
      setShowAlert(true);
    }
    setIntermediaryAvailableValue(radioNewValue);
  };

  return (
    <>
      <FormSectionTitle
        title={t('nodeSignInPage.form.sections.intermediaryAvailable')}
        icon={<CompareArrowsIcon />}
        isRequired
      ></FormSectionTitle>
          {showAlert && <DirectNodoConnectionAlert setShowAlert={setShowAlert} t={t} />}
      <Grid container spacing={2} mt={1}>
        <Grid item xs={6}>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="intermediaryAvailable"
            value={value}
            sx={{ pl: 1 }}
            onChange={handleRadioChange}
            data-testid="intermediary-available-test"
          >

            <FormControlLabel
              value={false}
              control={<Radio />}
              disabled={isChangeDisabled}
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {labelFalse}
                  <Tooltip
                    title={t('nodeSignInPage.form.ecFields.intermediaryAvailable.info')}
                    placement="right"
                  >
                    <InfoOutlinedIcon fontSize="small" color="primary" sx={{ ml: 2 }} />
                  </Tooltip>
                </div>
              }
            />
            <FormControlLabel
              value={true}
              control={<Radio />}
              label={labelTrue}
            />
          </RadioGroup>
        </Grid>
      </Grid>
    </>
  );
};

export const DirectNodoConnectionAlert = ({
  setShowAlert,
  t,
}: {
  setShowAlert: (showAlert: boolean) => void;
  t: TFunction<'translation'>;
}) => (
  <Alert
    severity="warning"
    variant="outlined"
    data-testid="alert-test"
    sx={{ mt: 2, '.MuiAlert-message': { width: '100%' } }}
  >
    <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
      {t('nodeSignInPage.directConnectionAlertMessage')}
      <ButtonNaked
        size="medium"
        component="button"
        onClick={() => setShowAlert(false)}
        sx={{ color: 'primary.main', ml: '10' }}
        weight="default"
        data-testid="got-it-button"
      >
        {t('general.gotIt')}
      </ButtonNaked>
    </Box>
  </Alert>
);

export default CommonRadioGroup;