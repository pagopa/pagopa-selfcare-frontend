import { useState, useEffect } from 'react';
import { Box, Typography, Link, useTheme } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation, Trans } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useErrorDispatcher, useUserNotify } from '@pagopa/selfcare-common-frontend';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import HomePageCard from './HomePageCard';
import { getInstitutionApiKeys } from './../../services/tokenService';
import {
  regeneratePrimaryKey,
  regenerateSecondaryKey,
  createInstitutionApiKeys,
} from './../../services/tokenService';

const Home = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [apiKeyPresent, setApiKeyPresent] = useState<boolean>(false);
  const [primaryKey, setPrimaryKey] = useState<string>('');
  const [secondaryKey, setSecondaryKey] = useState<string>('');

  const addNotify = useUserNotify();
  const addError = useErrorDispatcher();

  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

  console.log('apiKeyPresent', apiKeyPresent);
  useEffect(() => {
    if (selectedParty) {
      void getInstitutionApiKeys(selectedParty.partyId).then((data) => {
        setPrimaryKey(data.primaryKey);
        setSecondaryKey(data.secondaryKey);
        if (data.primaryKey !== '' && data.secondaryKey !== '') {
          setApiKeyPresent(true);
        } else {
          setApiKeyPresent(false);
        }
      });
    }
  }, [selectedParty]);

  const createKeys = () => {
    if (selectedParty) {
      void createInstitutionApiKeys(selectedParty.partyId).then((data) => {
        setPrimaryKey(data.primaryKey);
        setSecondaryKey(data.secondaryKey);
        setApiKeyPresent(true);
      });
    }
  };

  const regenPrimaryKey = () => {
    if (selectedParty) {
      regeneratePrimaryKey(selectedParty.partyId).then(
        (data) => {
          setPrimaryKey(data);
          addNotify({
            id: 'ACTION_ON_REGENERATE_PRIMARY_KEY',
            title: '',
            message: t('homepage.apiPresent.regeneratePrimaryKey'),
            component: 'Toast',
          });
        },
        (reason) => {
          addError({
            component: 'Toast',
            id: 'ACTION_ON_REGENERATE_PRIMARY_KEY',
            displayableTitle: t('homepage.apiPresent.errorRegeneratePrimaryKey'),
            techDescription: `C'è stato un errore durante la rigenerazione della chiave primaria`,
            blocking: false,
            error: reason,
            toNotify: true,
            displayableDescription: '',
          });
        }
      );
    }
  };
  const regenSecondaryKey = () => {
    if (selectedParty) {
      regenerateSecondaryKey(selectedParty.partyId).then(
        (data) => {
          setSecondaryKey(data);
          addNotify({
            id: 'ACTION_ON_REGENERATE_SECONDARY_KEY',
            title: '',
            message: t('homepage.apiPresent.regenerateSecondaryKey'),
            component: 'Toast',
          });
        },
        (reason) => {
          addError({
            component: 'Toast',
            id: 'ACTION_ON_REGENERATE_PRIMARY_KEY',
            displayableTitle: t('homepage.apiPresent.errorRegenerateSecondaryKey'),
            techDescription: `C'è stato un errore durante la rigenerazione della chiave secondaria`,
            blocking: false,
            error: reason,
            toNotify: true,
            displayableDescription: '',
          });
        }
      );
    }
  };

  return (
    <>
      <Box width="100%" px={2}>
        <TitleBox
          title={t('homepage.title')}
          subTitle={t('homepage.subtitle')}
          mbTitle={2}
          mtTitle={4}
          mbSubTitle={6}
          variantTitle="h4"
          variantSubTitle="body1"
        />
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h6">{t('homepage.decription')}</Typography>
          </Box>
          {!apiKeyPresent && (
            <Box>
              <ButtonNaked
                component="button"
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
                weight="default"
              >
                {t('homepage.apiNotPresent.buttonLabel')}
              </ButtonNaked>
            </Box>
          )}
        </Box>
        {!apiKeyPresent ? (
          <Box
            p={2}
            display="flex"
            justifyContent="center"
            sx={{ backgroundColor: 'background.paper' }}
          >
            <Trans i18nKey="homepage.apiNotPresent.apiNotPresentDescription">
              Non è stata ancora generata nessuna chiave API per questo ente.
              <Link
                sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'none' }}
                onClick={createKeys}
              >
                <strong> Genera chiave API</strong>
              </Link>
            </Trans>
          </Box>
        ) : (
          <HomePageCard
            selectedParty={selectedParty}
            primaryKey={primaryKey}
            secondaryKey={secondaryKey}
            regenPrimaryKey={regenPrimaryKey}
            regenSecondaryKey={regenSecondaryKey}
          />
        )}
      </Box>
    </>
  );
};

export default Home;
