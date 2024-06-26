import { Trans, useTranslation } from 'react-i18next';
import { Box, Link } from '@mui/material';
import { TOSAgreement } from '@pagopa/mui-italia';
import { Link as RouterLink } from 'react-router-dom';

interface TOSWallProps {
  acceptTOS: () => void;
  detailRoute: string;
}

const TOSWall = ({ acceptTOS, detailRoute }: TOSWallProps) => {
  const { t } = useTranslation();
  return (
    <Box width="100%" px={2}>
      <TOSAgreement
        productName={t('tos.title')}
        description={
          <Trans i18nKey="tos.termsDescription">
            {t('tos.termsDescription')}
            <Link
              component={RouterLink}
              to={{
                pathname: detailRoute,
              }}
              sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'none' }}
            >
              <strong> Accedi</strong>
            </Link>
          </Trans>
        }
        onConfirm={() => acceptTOS()}
      ></TOSAgreement>
    </Box>
  );
};

export default TOSWall;
