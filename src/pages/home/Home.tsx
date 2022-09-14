import { useState } from 'react';
import { Box, Button, Typography, Link } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation, Trans } from 'react-i18next';

// import { useAppSelector } from '../../redux/hooks';
// import { partiesSelectors } from '../../redux/slices/partiesSlice';
import HomePageCard from './HomePageCard';
// import { getInstitutionApiKeys } from './../../services/tokenService';

const Home = () => {
  const [generatePrimaryKey, setGeneratePrimaryKey] = useState<boolean>(false);
  const [generateSecondaryKey, setGenerateSecondaryKey] = useState<boolean>(false);
  const { t } = useTranslation();

  const [apiKeyPresent, setapiKeyPresent] = useState<boolean>(true);

  // const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

  // useEffect(() => {
  //   if (selectedParty) {
  //     void getInstitutionApiKeys(selectedParty.partyId).then((data) => {
  //       if (data) {
  //         setapiKeyPresent(true);
  //       }
  //     });
  //   }
  // }, []);
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
        <Typography variant="h6" mb={4}>
          {t('homepage.decription')}
        </Typography>
        {!apiKeyPresent ? (
          <Box
            p={2}
            display="flex"
            justifyContent="center"
            sx={{ backgroundColor: 'background.paper' }}
          >
            <Trans i18nKey="homepage.apiNotPresentDescription">
              Non è stata ancora generata nessuna chiave API per questo ente. &nbsp;
              <Link
                sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'none' }}
                onClick={() => console.log('TODO: remove')}
              >
                <strong> Genera chiave API</strong>
              </Link>
            </Trans>
          </Box>
        ) : (
          <HomePageCard
            generatePrimaryKey={generatePrimaryKey}
            generateSecondaryKey={generateSecondaryKey}
          />
        )}
      </Box>

      {/* TODO: remove these buttons */}
      <Button onClick={() => setapiKeyPresent(!apiKeyPresent)}>API KEY PRESENTE/ASSENTE</Button>
      <Button onClick={() => setGeneratePrimaryKey(true)}>GENERA CHIAVE PRIMARIA</Button>
      <Button onClick={() => setGenerateSecondaryKey(true)}>GENERA CHIAVE SECONDARIA</Button>
    </>
  );
};

export default Home;
