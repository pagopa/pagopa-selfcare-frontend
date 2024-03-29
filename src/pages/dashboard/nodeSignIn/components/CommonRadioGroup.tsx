import { Grid, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import {
  CompareArrows as CompareArrowsIcon,
  InfoOutlined as InfoOutlinedIcon,
} from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import FormSectionTitle from '../../../../components/Form/FormSectionTitle';
import { BrokerAndEcDetailsResource } from '../../../../api/generated/portal/BrokerAndEcDetailsResource';
import { BrokerOrPspDetailsResource } from '../../../../api/generated/portal/BrokerOrPspDetailsResource';

type Props = {
  labelTrue: string;
  labelFalse: string;
  value: boolean;
  onChange: () => void;
  ecDirect?: BrokerAndEcDetailsResource;
  pspDirect?: BrokerOrPspDetailsResource;
};
const CommonRadioGroup = ({
  labelTrue,
  labelFalse,
  value,
  onChange,
  ecDirect,
  pspDirect,
}: Props) => {
  const { t } = useTranslation();

  const changeDisabled = () => !!(pspDirect || ecDirect);

  return (
    <>
      <FormSectionTitle
        title={t('nodeSignInPage.form.sections.intermediaryAvailable')}
        icon={<CompareArrowsIcon />}
        isRequired
      ></FormSectionTitle>
      <Grid container spacing={2} mt={1}>
        <Grid container item xs={6}>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="intermediaryAvailable"
            value={value}
            sx={{ pl: 1 }}
            onChange={onChange}
            data-testid="intermediary-available-test"
          >
            <FormControlLabel value={true} control={<Radio />} label={labelTrue} />
            <FormControlLabel
              value={false}
              control={<Radio />}
              disabled={changeDisabled()}
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
          </RadioGroup>
        </Grid>
      </Grid>
    </>
  );
};

export default CommonRadioGroup;
