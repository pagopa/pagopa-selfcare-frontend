import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';

const CommisionalPackagesEmpty = () => {
  const { t } = useTranslation();
  return (
    <>
      <Box p={3} mt={3} sx={{ backgroundColor: '#EEEEEE' }}>
        <Box p={2} sx={{ textAlign: 'center', backgroundColor: '#FFFFFF' }}>
          <Typography variant="body2">{t('commisionalPackagesPage.noCommPackages')}</Typography>
        </Box>
      </Box>
    </>
  );
};
export default CommisionalPackagesEmpty;
