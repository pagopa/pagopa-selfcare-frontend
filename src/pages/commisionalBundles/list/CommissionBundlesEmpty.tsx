import { Link, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Trans, useTranslation } from 'react-i18next';
import { generatePath, Link as RouterLink } from 'react-router-dom';
import ROUTES from '../../../routes';

type Props = {
  bundleType: string;
};

const CommissionBundlesEmpty = ({ bundleType }: Props) => {
  const { t } = useTranslation();
  return (
    <Box p={3} mt={3} sx={{ backgroundColor: '#EEEEEE' }}>
        <Box p={2} sx={{ textAlign: 'center', backgroundColor: '#FFFFFF' }}>
          <Typography variant="body2">
            <Trans i18nKey={t('commissionBundlesPage.list.noCommBundles', { bundleType })}>
              Non sono ancora presenti pacchetti commissioni {bundleType}.
              <Link
                component={RouterLink}
                sx={{
                  color: 'primary.main',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  whiteSpace: 'pre',
                }}
                to={generatePath(ROUTES.COMMISSION_BUNDLES_ADD)}
              >
                <strong> Crea Pacchetto</strong>
              </Link>
            </Trans>
          </Typography>
        </Box>
      </Box>
  );
};
export default CommissionBundlesEmpty;
