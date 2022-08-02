import { Box, Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useTranslation } from 'react-i18next';
import { MouseEventHandler } from 'react';

interface WizardFooterProps {
  activeStep: number;
  stepsNumber: number;
  handleBack: MouseEventHandler;
  handleNext: MouseEventHandler;
}

const WizardActions = ({ activeStep, stepsNumber, handleBack, handleNext }: WizardFooterProps) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 2,
        gridTemplateRows: 'auto',
        gridTemplateAreas: `"back . . . draft continue"`,
      }}
    >
      <Box sx={{ gridArea: 'back' }}>
        <Button variant="outlined" color="inherit" disabled={activeStep === 0} onClick={handleBack}>
          {t('wizard.common.buttons.back')}
        </Button>
      </Box>
      <Box sx={{ gridArea: 'draft', justifySelf: 'end' }}>
        <Button variant="text" startIcon={<SaveIcon />}>
          {t('wizard.common.buttons.skip')}
        </Button>
      </Box>
      <Box sx={{ gridArea: 'continue', justifySelf: 'end' }}>
        <Button variant="contained" onClick={handleNext}>
          {activeStep === stepsNumber - 1
            ? t('wizard.common.buttons.send')
            : t('wizard.common.buttons.continue')}
        </Button>
      </Box>
    </Box>
  );
};

export default WizardActions;
