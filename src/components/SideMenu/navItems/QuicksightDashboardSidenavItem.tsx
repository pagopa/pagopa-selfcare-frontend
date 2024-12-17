import { useState } from 'react';
import { useLoading } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { Close } from '@mui/icons-material';
import { Box, Button, Dialog, IconButton, Typography } from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SidenavItem from '../SidenavItem';
import { LOADING_TASK_QUICKSIGHT_DASHBOARD } from '../../../utils/constants';
import { getEmbedUrlForAnonymousUser } from '../../../services/quicksightDashboardService';
import { useUserRole } from '../../../hooks/useUserRole';
import GenericModal from '../../Form/GenericModal';

const componentPath = 'sideMenu.quicksightDashboard.modal';
export default function QuicksightDashboardSidenavItem() {
  const { t } = useTranslation();
  const { userIsPspAdmin } = useUserRole();
  const setLoading = useLoading(LOADING_TASK_QUICKSIGHT_DASHBOARD);
  const [openModal, setOpenModal] = useState<string | null | undefined>(null);

  function openQuicksightDashboard() {
    const userIsSubscribed = true; // GET USER PRODUCTS TO SEE IF IT'S SUBSCRIBED

    if (userIsPspAdmin && userIsSubscribed) {
      setLoading(true);
      getEmbedUrlForAnonymousUser('roma') // TODO PASS PSP ID / TAX CODE
        .then((url) => {
          if (url.embedUrl) {
            setOpenModal(url.embedUrl);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setOpenModal(
        `user${userIsSubscribed ? '' : 'Not'}Subscribed${userIsPspAdmin ? '' : 'Not'}Admin`
      );
    }
  }

  return (
    <>
      <SidenavItem
        title={t('sideMenu.quicksightDashboard.title')}
        handleClick={() => openQuicksightDashboard()}
        isLink={true}
        icon={AnalyticsIcon}
        dataTestId="quicksight-dashboard-test"
      />
      {openModal &&
        (openModal.startsWith('user') ? (
          <GenericModal
            openModal={Boolean(openModal)}
            handleCloseModal={() => setOpenModal(null)}
            renderContent={() => (
              <>
                <Typography variant="h6">{t('general.attention')}</Typography>
                <Typography variant="body1" sx={{ my: 2, pb: 2 }}>
                  {t(`${componentPath}.${openModal}`)}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => setOpenModal(null)}
                    data-testid="confirm-button-test"
                  >
                    {t('general.ok').toUpperCase()}
                  </Button>
                </Box>
              </>
            )}
          />
        ) : (
          <Dialog fullScreen open={Boolean(openModal)} onClose={() => setOpenModal(null)}>
            <Box display="flex" justifyContent="flex-end">
              <IconButton onClick={() => setOpenModal(null)}>
                <Close />
              </IconButton>
            </Box>
            <iframe title="Dashboard Embed" src={openModal} height="100%" />
          </Dialog>
        ))}
    </>
  );
}
