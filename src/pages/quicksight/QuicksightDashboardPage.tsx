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
import { extractProblemJson } from '../../utils/client-utils';
import { useFlagValue } from '../../hooks/useFeatureFlags';

const componentPath = 'sideMenu.quicksightDashboard.modal';
export default function QuicksightDashboardPage() {
  const { t } = useTranslation();
  const { userIsPspAdmin, userIsPagopaOperator } = useUserRole();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const [loading, setLoading] = useState<boolean>(true);
  const [embedUrl, setEmbedUrl] = useState<string | null | undefined>(null);
  const [errorMessage, setErrorMessage] = useState<string>();
  const history = useHistory();
  const quicksightProductFreeTrial =  useFlagValue('quicksight-product-free-trial');

  // eslint-disable-next-line sonarjs/cognitive-complexity
  function openQuicksightDashboard() {
    const userIsSubscribed = quicksightProductFreeTrial || selectedParty?.onboarding?.find(
      (el) => el.productId === 'prod-dashboard-psp' && el.status === 'ACTIVE'
    );

    if (userIsPagopaOperator || (userIsPspAdmin && userIsSubscribed)) {
      getEmbedUrlForAnonymousUser()
        .then((url) => {
          if (url.embedUrl) {
            setEmbedUrl(url.embedUrl);
          }
          setLoading(false);
        })
        .catch((err) => {
          const problemJson = extractProblemJson(err);

          if (!problemJson?.status) { // IF error 403
            setErrorMessage(`userNotSubscribed${userIsPspAdmin ? '' : 'Not'}Admin`);
          } else {
            setErrorMessage('errorGeneric');
          }
          setLoading(false);
        });
    } else {
      setErrorMessage(
        `user${userIsSubscribed ? '' : 'Not'}Subscribed${userIsPspAdmin ? '' : 'Not'}Admin`
      );
      setLoading(false);
    }
  }

  useEffect(() => {
    openQuicksightDashboard();
  }, []);

  return (
    <>
      <SideMenuLayout>
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="140vw">
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
