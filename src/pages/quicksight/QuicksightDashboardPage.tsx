import { Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useHistory } from 'react-router-dom';
import GenericModal from '../../components/Form/GenericModal';
import SideMenuLayout from '../../components/SideMenu/SideMenuLayout';
import { useUserRole } from '../../hooks/useUserRole';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import ROUTES from '../../routes';
import { getEmbedUrlForAnonymousUser } from '../../services/quicksightDashboardService';

const componentPath = 'sideMenu.quicksightDashboard.modal';
export default function QuicksightDashboardPage() {
  const { t } = useTranslation();
  const { userIsPspAdmin, userIsPagopaOperator } = useUserRole();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const [loading, setLoading] = useState<boolean>(true);
  const [embedUrl, setEmbedUrl] = useState<string | null | undefined>(null);
  const [errorMessage, setErrorMessage] = useState<string>();
  const history = useHistory();

  function openQuicksightDashboard() {
    const userIsSubscribed = true; // TODO: GET USER PRODUCTS TO SEE IF IT'S SUBSCRIBED

    if ((userIsPagopaOperator || (userIsPspAdmin && userIsSubscribed)) && selectedParty?.partyId) {
      getEmbedUrlForAnonymousUser(selectedParty?.partyId)
        .then((url) => {
          if (url.embedUrl) {
            setEmbedUrl(url.embedUrl);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          setErrorMessage('errorGeneric');
        });
    } else {
      setLoading(false);
      setErrorMessage(
        `user${userIsSubscribed ? '' : 'Not'}Subscribed${userIsPspAdmin ? '' : 'Not'}Admin`
      );
    }
  }

  useEffect(() => {
    openQuicksightDashboard();
  }, []);

  return (
    <>
      <SideMenuLayout>
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%">
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {embedUrl ? (
                <iframe title="Dashboard Embed" src={embedUrl} height="100%" width="100%" />
              ) : (
                <></>
              )}
            </>
          )}
        </Box>
      </SideMenuLayout>
      <GenericModal
        title={t('general.attention')}
        message={t(`${componentPath}.${errorMessage}`)}
        openModal={errorMessage !== undefined}
        onConfirmLabel={t('general.confirm')}
        handleConfirm={() => history.push(generatePath(ROUTES.HOME))}
      />
    </>
  );
}
