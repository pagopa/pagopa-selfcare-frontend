import { List, Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend/hooks/useUnloadEventInterceptor';
import { useTranslation } from 'react-i18next';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import UsbIcon from '@mui/icons-material/Usb';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useState } from 'react';
import { ENV } from '../../utils/env';
import ROUTES from '../../routes';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import SidenavItem from './SidenavItem';

/** The side menu of the application */
export default function SideMenu() {
  const { t } = useTranslation();
  const history = useHistory();
  const onExit = useUnloadEventOnExit();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const [pathname, setPathName] = useState(() => {
    /*
    For some reason, push on history will not notify this component.
    We are configuring the listener here and not into a useEffect in order to configure it at the costruction of the component, not at its mount
    because the Redirect performed as fallback on the routing would be executed before the listen as been configured
    */
    history.listen(() => setPathName(history.location.pathname));
    return history.location.pathname;
  });

  return (
    <Box display="grid" mt={1}>
      <Box gridColumn="auto">
        <List>
          {ENV.FEATURES.DASHBOARD.ENABLED ? (
            <>
              <SidenavItem
                title={t('sideMenu.home.title')}
                handleClick={() => onExit(() => history.push(ROUTES.HOME))}
                isSelected={pathname === ROUTES.HOME}
                icon={DashboardIcon}
                data-testid="home-test"
              />
              <SidenavItem
                title={t('sideMenu.apikeys.title')}
                handleClick={() => onExit(() => history.push(ROUTES.APIKEYS))}
                isSelected={pathname === ROUTES.APIKEYS}
                icon={VpnKeyIcon}
                data-testid="apikeys-test"
              />
            </>
          ) : (
            <SidenavItem
              title={t('sideMenu.apikeys.title')}
              handleClick={() => onExit(() => history.push(ROUTES.APIKEYS))}
              isSelected={pathname === ROUTES.APIKEYS || pathname === ROUTES.HOME}
              icon={VpnKeyIcon}
              data-testid="apikeys-test"
            />
          )}

          {ENV.FEATURES.CHANNELS.ENABLED && selectedParty?.institutionType === 'PSP' && (
            <SidenavItem
              title={t('sideMenu.channels.title')}
              handleClick={() => onExit(() => history.push(ROUTES.CHANNELS))}
              isSelected={pathname === ROUTES.CHANNELS || pathname.startsWith(ROUTES.CHANNELS)}
              icon={UsbIcon}
              data-testid="channels-test"
            />
          )}
          {(ENV.FEATURES.STATIONS.ENABLED && selectedParty?.institutionType === 'PA') ||
            selectedParty?.institutionType === 'GSP' ||
            (selectedParty?.institutionType === 'SCP' && (
              <SidenavItem
                title={t('sideMenu.stations.title')}
                handleClick={() => onExit(() => history.push(ROUTES.STATIONS))}
                isSelected={pathname === ROUTES.STATIONS || pathname.startsWith(ROUTES.STATIONS)}
                icon={UsbIcon}
                data-testid="stations-test"
              />
            ))}
        </List>
      </Box>
    </Box>
  );
}
