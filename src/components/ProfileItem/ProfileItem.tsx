import { ProfileItem as MuiProfileItem } from '@pagopa/mui-italia';
import { userActions } from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
import { storageTokenOps, storageUserOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFlagValue } from '../../hooks/useFeatureFlags';
import { userFromJwtToken } from '../../hooks/useLogin';
import { useSigninData } from '../../hooks/useSigninData';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { partiesActions, partiesSelectors } from '../../redux/slices/partiesSlice';
import { fetchPagoPAToken } from '../../services/tokenExchangeService';
import { identityTokenStorageOps } from '../../utils/identity-token-storage';
import {
  applyTokenRolesToParty,
  getProfileInitials,
  getProfileLabel,
  getProfileOptions,
  PROFILE_ITEM_FEATURE_FLAG,
} from '../../utils/profile-utils';
import ProfileItemDialog from './ProfileItemDialog';

const getTokenForRoleSwitch = (): string | undefined => {
  const sessionToken = storageTokenOps.read();
  return identityTokenStorageOps.read() ?? sessionToken;
};

const ProfileItem = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const featureIsEnabled = useFlagValue(PROFILE_ITEM_FEATURE_FLAG);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const updateSigninData = useSigninData();
  const sessionToken = storageTokenOps.read();
  const options = useMemo(
    () => getProfileOptions(sessionToken, selectedParty?.institutionType),
    [sessionToken, selectedParty?.institutionType, selectedParty?.roles]
  );
  const activeOption = options.find((option) => option.selected);
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(activeOption?.roleKey ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const canSwitchProfile = options.length > 1;

  if (!featureIsEnabled || !selectedParty) {
    return null;
  }

  const openDialog = () => {
    if (!canSwitchProfile) {
      return;
    }

    setSelectedRole(activeOption?.roleKey ?? options[0].roleKey);
    setError(undefined);
    setOpen(true);
  };

  const closeDialog = () => {
    if (!loading) {
      setOpen(false);
    }
  };

  const handleConfirm = async () => {
    if (selectedRole === activeOption?.roleKey) {
      setOpen(false);
      return;
    }

    const sourceToken = getTokenForRoleSwitch();
    if (!sourceToken) {
      setError(t('profileItem.errors.missingToken'));
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      const response = await fetchPagoPAToken(sourceToken, selectedRole);
      if (response.status !== 200) {
        throw new Error(`Cannot switch profile. Token exchange returned ${response.status}`);
      }

      const newToken = (await response.text()).toString();
      const user = userFromJwtToken(newToken);
      const updatedParty = applyTokenRolesToParty(selectedParty, newToken);

      storageTokenOps.write(newToken);
      storageUserOps.write(user);
      dispatch(userActions.setLoggedUser(user));
      dispatch(partiesActions.setPartySelected(updatedParty));
      await updateSigninData(updatedParty);
      setOpen(false);
    } catch (e) {
      console.error(e);
      setError(t('profileItem.errors.switchFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MuiProfileItem
        caption={t('profileItem.caption')}
        profileInitials={
          activeOption?.initials ??
          getProfileInitials(selectedParty.roles[0]?.roleKey, selectedParty.institutionType)
        }
        profileName={
          activeOption?.label ??
          getProfileLabel(selectedParty.roles[0]?.roleKey, selectedParty.institutionType)
        }
        switchLabel={t('profileItem.switchLabel')}
        showSwitchProfile={canSwitchProfile}
        onSwitchProfile={openDialog}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      />
      {canSwitchProfile && (
        <ProfileItemDialog
          open={open}
          options={options}
          selectedRole={selectedRole}
          loading={loading}
          error={error}
          onSelectedRoleChange={setSelectedRole}
          onClose={closeDialog}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
};

export default ProfileItem;
