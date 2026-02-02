/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import { Divider, List, ListItemButton, Icon, ListItemIcon } from '@mui/material';
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
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FilePresentOutlinedIcon from '@mui/icons-material/FilePresentOutlined';
import { Assessment, Handyman, Menu } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { ENV } from '../../utils/env';
import ROUTES from '../../routes';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import { usePermissions } from '../../hooks/usePermissions';
import { userIsPagopaOperator } from '../../hooks/useUserRole';
import { useFlagValue } from '../../hooks/useFeatureFlags';
import { useOrganizationType } from '../../hooks/useOrganizationType';
import SidenavItem from './SidenavItem';


/** The side menu of the application */
export default function SideMenu({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: any;
}) {
  const { t } = useTranslation();
  const history = useHistory();
  const onExit = useUnloadEventOnExit();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const signinData = useAppSelector(partiesSelectors.selectSigninData);
  const { userHasPermission } = usePermissions();
  const { orgInfo, orgIsBrokerSigned } = useOrganizationType();
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
    const isSignedOnNode = signinData ? orgInfo.isSigned : true;
    setIsDisabled(!isSignedOnNode);
  }, [signinData]);

  return (
    <List>
      {useFlagValue('delegations-list') &&
        orgIsBrokerSigned &&
        userHasPermission('delegations-list') && (
          <>
            <SidenavItem
              collapsed={collapsed}
              title={t('sideMenu.delegations.title')}
              handleClick={() => onExit(() => history.push(ROUTES.DELEGATIONS_LIST))}
              isSelected={pathname === ROUTES.DELEGATIONS_LIST}
              icon={StorageIcon}
              dataTestId={'delegations-test'}
            />
            <Divider sx={{ marginY: 1 }} />
          </>
        )}

      {
        <SidenavItem
          collapsed={collapsed}
          title={t('sideMenu.home.title')}
          handleClick={() => onExit(() => history.push(ROUTES.HOME))}
          isSelected={pathname === ROUTES.HOME}
          icon={DashboardIcon}
          dataTestId={'home-test'}
        />
      }

      {useFlagValue('payment-notices') && userHasPermission('payment-notices') && (
        <SidenavItem
          collapsed={collapsed}
          title={t('sideMenu.paymentNotices.title')}
          handleClick={() => onExit(() => history.push(ROUTES.PAYMENT_NOTICES))}
          isSelected={pathname === ROUTES.PAYMENT_NOTICES}
          disabled={isDisabled}
          icon={FilePresentOutlinedIcon}
          dataTestId="payment-notices-test"
        />
      )}

      {userHasPermission('apikey') && orgIsBrokerSigned && (
        <SidenavItem
          collapsed={collapsed}
          title={t('sideMenu.apikeys.title')}
          handleClick={() => onExit(() => history.push(ROUTES.APIKEYS))}
          isSelected={pathname === ROUTES.APIKEYS}
          disabled={isDisabled}
          icon={VpnKeyIcon}
          dataTestId="apikeys-test"
        />
      )}

      {orgInfo.types.isPspBroker && userHasPermission('channels') && (
        <SidenavItem
          collapsed={collapsed}
          title={t('sideMenu.channels.title')}
          handleClick={() => onExit(() => history.push(ROUTES.CHANNELS))}
          isSelected={pathname === ROUTES.CHANNELS || pathname.startsWith(ROUTES.CHANNELS)}
          icon={UsbIcon}
          disabled={isDisabled}
          dataTestId="channels-test"
        />
      )}
      {orgInfo.types.isEcBroker && userHasPermission('stations') && (
        <SidenavItem
          collapsed={collapsed}
          title={t('sideMenu.stations.title')}
          handleClick={() => onExit(() => history.push(ROUTES.STATIONS))}
          isSelected={pathname === ROUTES.STATIONS || pathname.startsWith(ROUTES.STATIONS)}
          icon={UsbIcon}
          disabled={isDisabled}
          dataTestId="stations-test"
        />
      )}
      {orgInfo.types.isEc && userHasPermission('iban') && (
        <SidenavItem
          collapsed={collapsed}
          title={t('sideMenu.iban.title')}
          handleClick={() => onExit(() => history.push(ROUTES.IBAN))}
          isSelected={pathname === ROUTES.IBAN || pathname.startsWith(ROUTES.IBAN)}
          icon={EuroIcon}
          disabled={isDisabled}
          dataTestId="iban-test"
        />
      )}

      {useFlagValue('commission-bundles') &&
        userHasPermission('commission-bundles-list') &&
        (orgInfo.types.isEc || orgInfo.types.isPsp) && (
          <SidenavItem
            collapsed={collapsed}
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
      {userHasPermission('operation-table-list') && userIsPagopaOperator() && (
        <SidenavItem
          collapsed={collapsed}
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
      {useFlagValue('payments-receipts') &&
        userHasPermission('payments-receipts') &&
        orgInfo.types.isEc && (
          <SidenavItem
            collapsed={collapsed}
            title={t('sideMenu.paymentsReceipts.title')}
            handleClick={() => onExit(() => history.push(ROUTES.PAYMENTS_RECEIPTS))}
            isSelected={
              pathname === ROUTES.PAYMENTS_RECEIPTS || pathname.startsWith(ROUTES.PAYMENTS_RECEIPTS)
            }
            icon={ReceiptIcon}
            disabled={isDisabled}
            dataTestId="payments-receipts-test"
          />
        )}
      {useFlagValue('station-maintenances') &&
        userHasPermission('station-maintenances') &&
        orgInfo.types.isEcBroker && (
          <SidenavItem
            collapsed={collapsed}
            title={t('sideMenu.stationMaintenances.title')}
            handleClick={() => onExit(() => history.push(ROUTES.STATION_MAINTENANCES_LIST))}
            isSelected={
              pathname === ROUTES.STATION_MAINTENANCES_LIST ||
              pathname.startsWith(ROUTES.STATION_MAINTENANCES_LIST)
            }
            icon={Handyman}
            disabled={isDisabled}
            dataTestId="station-maintenances-test"
          />
        )}

      {useFlagValue('quicksight-dashboard') && userHasPermission('quicksight-dashboard') &&
        orgInfo.types.isPsp && (
          <SidenavItem
            collapsed={collapsed}
            title={t('sideMenu.quicksightDashboard.title')}
            handleClick={() => onExit(() => history.push(ROUTES.QUICKSIGHT_DASHBOARD))}
            icon={Assessment}
            isSelected={
              pathname === ROUTES.QUICKSIGHT_DASHBOARD ||
              pathname.startsWith(ROUTES.QUICKSIGHT_DASHBOARD)
            }
            disabled={isDisabled}
            dataTestId={'quicksight-nav-test'}
          />
        )}

      {!orgInfo.types.isEcIPA && (
        <SidenavItem
          collapsed={collapsed}
          title={t('sideMenu.settings.title')}
          handleClick={() => onExit(() => history.push(ROUTES.SETTINGS))}
          isSelected={pathname === ROUTES.SETTINGS}
          disabled={isDisabled}
          icon={SettingsIcon}
          dataTestId="settings-nav-test"
        />
      )}


      <React.Fragment>
        <Divider sx={{ marginY: 1 }} />

        <SidenavItem
          collapsed={collapsed}
          title={t('sideMenu.users.title')}
          handleClick={() => onExit(() => window.location.assign(`${SELFCARE_URL}/users`))}
          icon={PeopleAltIcon}
          dataTestId={'selfcare-users-test'}
          isLink={true}
        />

        <SidenavItem
          collapsed={collapsed}
          title={t('sideMenu.groups.title')}
          handleClick={() => onExit(() => window.location.assign(`${SELFCARE_URL}/groups`))}
          icon={SupervisedUserCircleIcon}
          dataTestId={'selfcare-groups-test'}
          isLink={true}
        />
      </React.Fragment>

      <React.Fragment>
        <Divider sx={{ marginY: 1 }} />

        <ListItemButton
          onClick={() => setCollapsed((prev: boolean) => !prev)}
          sx={{
            height: '100%',
            backgroundColor: 'background.paper',
            ...(collapsed && { justifyContent: 'center' }),
          }}
          data-testid={'side-menu-collapse-button'}
        >
          <ListItemIcon>
            <Icon component={Menu} />
          </ListItemIcon>
        </ListItemButton>
      </React.Fragment>
    </List>
  );
}
