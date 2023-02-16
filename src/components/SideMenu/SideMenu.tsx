import { List, Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend/hooks/useUnloadEventInterceptor';
import { useTranslation } from 'react-i18next';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import UsbIcon from '@mui/icons-material/Usb';
import { useState } from 'react';
import { ENV } from '../../utils/env';
import ROUTES from '../../routes';
import SidenavItem from './SidenavItem';

/** The side menu of the application */
export default function SideMenu() {
  const { t } = useTranslation();
  const history = useHistory();
  const onExit = useUnloadEventOnExit();
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
          <SidenavItem
            title={t('sideMenu.home.title')}
            handleClick={() => onExit(() => history.push(ROUTES.HOME))}
            isSelected={pathname === ROUTES.HOME}
            icon={VpnKeyIcon}
          />
          {ENV.FEATURES.CHANNELS.ENABLED && (
            <SidenavItem
              title={t('sideMenu.channels.title')}
              handleClick={() => onExit(() => history.push(ROUTES.CHANNELS))}
              isSelected={pathname === ROUTES.CHANNELS || pathname.startsWith(ROUTES.CHANNELS)}
              icon={UsbIcon}
            />
          )}
        </List>
      </Box>
    </Box>
  );
}
