import {useEffect, useState} from 'react';
import {Alert, Box, Button, Grid, Link, Typography, useTheme} from '@mui/material';
import {TitleBox} from '@pagopa/selfcare-common-frontend';
import {Trans, useTranslation} from 'react-i18next';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import AddIcon from '@mui/icons-material/Add';
import {useHistory} from 'react-router-dom';
import {useAppSelector} from '../../redux/hooks';
import {partiesSelectors} from '../../redux/slices/partiesSlice';
import {LOADING_TASK_API_KEY_GENERATION} from '../../utils/constants';
import {getInstitutionApiKeys} from '../../services/apiKeyService';
import SideMenu from '../../components/SideMenu/SideMenu';
import {ProductKeys} from '../../model/ApiKey';
import ROUTES from '../../routes';
import ApiKeysCard from './ApiKeysCard';

const ApiKeysPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const history = useHistory();

  const [apiKeys, setApiKey] = useState<Array<ProductKeys>>([]);

  const setLoading = useLoading(LOADING_TASK_API_KEY_GENERATION);

  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

  useEffect(() => {
    window.addEventListener('beforeunload', clearLocationState);
    return () => {
      window.removeEventListener('beforeunload', clearLocationState);
    };
  }, []);

  const clearLocationState = () => {
    window.history.replaceState({}, document.title);
  };

  useEffect(() => {
    if (selectedParty) {
      setLoading(true);
      void getInstitutionApiKeys(selectedParty.partyId)
        .then((data) => {
          if (data) {
            setApiKey(data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [selectedParty]);

  const createKeys = () => {
    history.push(ROUTES.APIKEYS_CREATE);
  };

  return (
    <Grid container item xs={12} sx={{ backgroundColor: 'background.paper' }}>
      <Grid item xs={2}>
        <Box>
          <SideMenu />
        </Box>
      </Grid>
      <Grid
        item
        xs={10}
        sx={{ backgroundColor: '#F5F6F7' }}
        display="flex"
        justifyContent="center"
        pb={8}
      >
        <Box width="100%" px={2}>
          <TitleBox
            title={t('apiKeysPage.title')}
            subTitle={t('apiKeysPage.subtitle')}
            mbTitle={2}
            mtTitle={4}
            mbSubTitle={3}
            variantTitle="h4"
            variantSubTitle="body1"
          />
          {history.location.state && (history.location.state as any).alertSuccessMessage && (
            <Alert severity="success" variant="outlined">
              {(history.location.state as any).alertSuccessMessage}
            </Alert>
          )}
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} mb={4}>
            <Box>
              <Typography variant="h6">{t('apiKeysPage.decription')}</Typography>
            </Box>
            {apiKeys && (
              <Box>
                <Button
                  variant="contained"
                  onClick={createKeys}
                  startIcon={<AddIcon />}
                  color="primary"
                  sx={{
                    border: `2px solid ${theme.palette.primary.main}`,
                    borderRadius: theme.spacing(0.5),
                    px: 2,
                    py: 1.5,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {t('apiKeysPage.apiNotPresent.buttonLabel')}
                </Button>
              </Box>
            )}
          </Box>
          {apiKeys.length <= 0 ? (
            <Box
              p={2}
              display="flex"
              justifyContent="center"
              sx={{ backgroundColor: 'background.paper' }}
            >
              <Trans i18nKey="apiKeysPage.apiNotPresent.apiNotPresentDescription">
                Non è stata ancora generata nessuna chiave API per questo ente.
                <Link
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    whiteSpace: 'pre',
                  }}
                  onClick={createKeys}
                >
                  <strong> Genera API Key</strong>
                </Link>
              </Trans>
            </Box>
          ) : (
            apiKeys.map((ak: ProductKeys) => (
              <ApiKeysCard selectedParty={selectedParty} apiKey={ak} key={ak.id}></ApiKeysCard>
            ))
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default ApiKeysPage;
