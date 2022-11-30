import { Trans, useTranslation } from 'react-i18next';
import { Box, Typography, Link } from '@mui/material';
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
        description={t('tos.description')}
        onConfirm={() => acceptTOS()}
      >
        <Typography sx={{ px: 8 }} color="text.secondary">
          <Trans i18nKey="tos.termsDescription">
            Entrando dichiari di aver letto e accettato l’Informativa Privacy e i Termini e
            condizioni d’uso di PagoPA
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
        </Typography>
      </TOSAgreement>
    </Box>
  );
};

export default TOSWall;
