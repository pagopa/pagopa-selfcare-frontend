import { Grid, Typography } from '@mui/material';
import React from 'react';
import { TFunction } from 'react-i18next';
import { Party } from '../../../model/Party';

type Props = {
  t: TFunction;
  selectedParty?: Party;
};

const CommonDetails = ({ t, selectedParty }: Props) => {
  const companyNameField = () => {
    if (selectedParty?.institutionType === 'PSP') {
      return selectedParty?.pspData?.legal_register_name;
    } else {
      return selectedParty?.description;
    }
  };

  return (
    <>
      <Grid item xs={4}>
        <Typography variant="body2">{t('dashboardPage.registrationData.name')}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body2" fontWeight={'fontWeightMedium'}>
          {selectedParty?.description}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2">{t('dashboardPage.registrationData.companyName')}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body2" fontWeight={'fontWeightMedium'}>
          {companyNameField()}
        </Typography>
      </Grid>
    </>
  );
};

export default CommonDetails;
