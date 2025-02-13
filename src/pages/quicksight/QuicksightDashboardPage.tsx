import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Typography } from '@mui/material';
import { getEmbedUrlForAnonymousUser } from '../../services/quicksightDashboardService';
import { useUserRole } from '../../hooks/useUserRole';
import SideMenuLayout from '../../components/SideMenu/SideMenuLayout';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';

const componentPath = 'sideMenu.quicksightDashboard.modal';
export default function QuicksightDashboardPage() {
  const { t } = useTranslation();
  const { userIsPspAdmin, userIsPagopaOperator } = useUserRole();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const [loading, setLoading] = useState<boolean>(true);
  const [embedUrl, setEmbedUrl] = useState<string | null | undefined>(null);

  function openQuicksightDashboard() {
    const userIsSubscribed = true; // GET USER PRODUCTS TO SEE IF IT'S SUBSCRIBED

    if ((userIsPagopaOperator || (userIsPspAdmin && userIsSubscribed)) && selectedParty?.partyId) {
      getEmbedUrlForAnonymousUser(selectedParty?.partyId)
        .then((url) => {
          if (url.embedUrl) {
            setEmbedUrl(url.embedUrl);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
      setEmbedUrl(
        `user${userIsSubscribed ? '' : 'Not'}Subscribed${userIsPspAdmin ? '' : 'Not'}Admin`
      );
    }
  }

  useEffect(() => {
    openQuicksightDashboard();
  }, []);

  return (
    <SideMenuLayout>
      <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%">
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {embedUrl &&
              (embedUrl.startsWith('user') ? (
                <Box>
                  <Typography variant="h6" data-testid="no-dashboard-message-id">{t('general.attention')}</Typography>
                  <Typography variant="body1" sx={{ my: 2, pb: 2 }}>
                    {t(`${componentPath}.${embedUrl}`)}
                  </Typography>
                </Box>
              ) : (
                <iframe title="Dashboard Embed" src={embedUrl} height="100%" width="100%" />
              ))}
          </>
        )}
      </Box>
    </SideMenuLayout>
  );
}
