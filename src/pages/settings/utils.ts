import { OrgInfo } from "../../hooks/useOrganizationType";
import { PermissionName } from "../../model/RolePermission";
import { ENV } from "../../utils/env";

export const rtpServiceStartingTimestamp = (): number =>  ENV.SETTINGS.SERVICES.RTP.SERVICE_STARTING_DATE.getTime();
export const URLS = {
  SANP_URL: ENV.SETTINGS.SERVICES.SANP_URL,
  RTP_OVERVIEW_URL: ENV.SETTINGS.SERVICES.RTP_OVERVIEW_URL,
};

export const ShowSettingsSection = (useFlagValue:((name: string) => boolean), userHasPermission:((permissionName: PermissionName)=>boolean) , orgInfo:OrgInfo): boolean => useFlagValue('settings-section') && userHasPermission("settings") && orgInfo.types.isEcIPA;