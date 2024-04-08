/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import { Box, Divider, List } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend/hooks/useUnloadEventInterceptor';
import { useTranslation } from 'react-i18next';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import UsbIcon from '@mui/icons-material/Usb';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EuroIcon from '@mui/icons-material/Euro';
import ExtensionIcon from '@mui/icons-material/Extension';
import StorageIcon from '@mui/icons-material/Storage';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useEffect, useState } from 'react';
import { ENV } from '../../utils/env';
import {ENV} from '../../utils/env';
import ROUTES from '../../routes';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import { usePermissions } from '../../hooks/usePermissions';
import { isSigned } from '../../utils/rbac-utils';
import { useFlagValue } from '../../hooks/useFeatureFlags';
import SidenavItem from './SidenavItem';

/** The side menu of the application */
export default function SideMenu() {
  const { t } = useTranslation();
  const history = useHistory();
  const onExit = useUnloadEventOnExit();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const signinData = useAppSelector(partiesSelectors.selectSigninData);
  const { hasPermission } = usePermissions();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [pathname, setPathName] = useState(() => {
    /*
        For some reason, push on history will not notify this component.
        We are configuring the listener here and not into a useEffect in order to configure it at the costruction of the component, not at its mount
        because the Redirect performed as fallback on the routing would be executed before the listen as been configured
        */
    history.listen(() => setPathName(history.location.pathname));
    return history.location.pathname;
  });
  const SELFCARE_URL = `${ENV.URL_FE.SELFCARE}${selectedParty?.partyId}`;

  useEffect(() => {
    const isSignedOnNode = signinData ? isSigned(signinData) : true;
    setIsDisabled(!isSignedOnNode ?? true);
  }, [signinData]);

  return (
    <Box display="grid" mt={1}>
      <Box gridColumn="auto">
        <List>
          {useFlagValue('delegations-list') && hasPermission('delegations-list') && (
            <>
              <SidenavItem
                title={t('sideMenu.delegations.title')}
                handleClick={() => onExit(() => history.push(ROUTES.DELEGATIONS_LIST))}
                isSelected={pathname === ROUTES.DELEGATIONS_LIST}
                icon={StorageIcon}
                dataTestId={'delegations-test'}
              />
              <Divider sx={{ marginY: 1 }} />
            </>
          )}

          {ENV.FEATURES.DASHBOARD.ENABLED && (
            <SidenavItem
              title={t('sideMenu.home.title')}
              handleClick={() => onExit(() => history.push(ROUTES.HOME))}
              isSelected={pathname === ROUTES.HOME}
              icon={DashboardIcon}
              dataTestId={'home-test'}
            />
          )}

          {hasPermission('apikey') && (
            <SidenavItem
              title={t('sideMenu.apikeys.title')}
              handleClick={() => onExit(() => history.push(ROUTES.APIKEYS))}
              isSelected={pathname === ROUTES.APIKEYS}
              disabled={isDisabled}
              icon={VpnKeyIcon}
              dataTestId="apikeys-test"
            />
          )}

          {ENV.FEATURES.CHANNELS.ENABLED && hasPermission('channels') && (
            <SidenavItem
              title={t('sideMenu.channels.title')}
              handleClick={() => onExit(() => history.push(ROUTES.CHANNELS))}
              isSelected={pathname === ROUTES.CHANNELS || pathname.startsWith(ROUTES.CHANNELS)}
              icon={UsbIcon}
              disabled={isDisabled}
              dataTestId="channels-test"
            />
          )}
          {ENV.FEATURES.STATIONS.ENABLED && hasPermission('stations') && (
            <SidenavItem
              title={t('sideMenu.stations.title')}
              handleClick={() => onExit(() => history.push(ROUTES.STATIONS))}
              isSelected={pathname === ROUTES.STATIONS || pathname.startsWith(ROUTES.STATIONS)}
              icon={UsbIcon}
              disabled={isDisabled}
              dataTestId="stations-test"
            />
          )}
          {ENV.FEATURES.IBAN.ENABLED && hasPermission('iban') && (
            <SidenavItem
              title={t('sideMenu.iban.title')}
              handleClick={() => onExit(() => history.push(ROUTES.IBAN))}
              isSelected={pathname === ROUTES.IBAN || pathname.startsWith(ROUTES.IBAN)}
              icon={EuroIcon}
              disabled={isDisabled}
              dataTestId="iban-test"
            />
          )}

          {useFlagValue('commission-bundles') && hasPermission('commission-bundles-list') && (
                            <SidenavItem
                                title={t('sideMenu.commBundles.title')}
                                handleClick={() => onExit(() => history.push(ROUTES.COMMISSION_BUNDLES))}
                                isSelected={
                                    pathname === ROUTES.COMMISSION_BUNDLES ||
                                    pathname.startsWith(ROUTES.COMMISSION_BUNDLES)
                                }
                                icon={EuroIcon}
                                disabled={isDisabled}
                                dataTestId="commission-bundles-test"
                            />
                        )}
                    {ENV.FEATURES.OPERATIONTABLE.ENABLED && hasPermission('operation-table-list') && (
                        <SidenavItem
                            title={t('sideMenu.operationTable.title')}
                            handleClick={() => onExit(() => history.push(ROUTES.OPERATION_TABLE_LIST))}
                            isSelected={
                                pathname === ROUTES.OPERATION_TABLE_LIST ||
                                pathname.startsWith(ROUTES.OPERATION_TABLE_LIST)
                            }
                            icon={ExtensionIcon}
                            disabled={isDisabled}
                            dataTestId="operation-table-test"
                        />
                    )}


                    {ENV.FEATURES.DASHBOARD.ENABLED && (
                        <SidenavItem
                            title={t('sideMenu.users.title')}
                            handleClick={() => onExit(() => window.location.assign(`${SELFCARE_URL}/users`))}
                            icon={PeopleAltIcon}
                            dataTestId={'selfcare-users-test'}
                        />
                    )}

                    {ENV.FEATURES.DASHBOARD.ENABLED && (
                        <SidenavItem
                            title={t('sideMenu.groups.title')}
                            handleClick={() => onExit(() => window.location.assign(`${SELFCARE_URL}/groups`))}
                            icon={SupervisedUserCircleIcon}
                            dataTestId={'selfcare-groups-test'}
                        />
                    )}

                </List>
            </Box>
        </Box>
    );
}
