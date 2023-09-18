import { Link, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Trans, useTranslation } from 'react-i18next';
import { generatePath, Link as RouterLink } from 'react-router-dom';

type Props = {
  packageType: string;
};

const CommissionPackagesEmpty = ({ packageType }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <Box p={3} mt={3} sx={{ backgroundColor: '#EEEEEE' }}>
        <Box p={2} sx={{ textAlign: 'center', backgroundColor: '#FFFFFF' }}>
          <Typography variant="body2">
            <Trans i18nKey={t('commissionPackagesPage.list.noCommPackages', { packageType })}>
              Non sono ancora presenti pacchetti commissioni {packageType}.
              <Link
                component={RouterLink}
                sx={{
                  color: 'primary.main',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  whiteSpace: 'pre',
                }}
                to={generatePath('')}
              >
                <strong> Crea Pacchetto</strong>
              </Link>
            </Trans>
          </Typography>
        </Box>
      </Box>
    </>
  );
};
export default CommissionPackagesEmpty;
