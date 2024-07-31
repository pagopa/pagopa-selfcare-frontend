import { StationMaintenanceResource } from '../api/generated/portal/StationMaintenanceResource';

export enum StationMaintenanceState {
  SCHEDULED_AND_IN_PROGRESS = 'SCHEDULED_AND_IN_PROGRESS',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
}

export const mapStationMaintenanceState = (
  maintenance: StationMaintenanceResource | undefined
): StationMaintenanceState | undefined => {
  if (maintenance === undefined) {
    return undefined;
  }
  const todayDate = new Date().getTime();
  if (maintenance.end_date_time.getTime() < todayDate) {
    return StationMaintenanceState.FINISHED;
  }
  if (maintenance.start_date_time.getTime() < todayDate) {
    return StationMaintenanceState.IN_PROGRESS;
  }
  return StationMaintenanceState.SCHEDULED;
};

export enum StationMaintenanceActionType {
  EDIT = 'EDIT',
  CREATE = 'CREATE',
  DETAILS = 'DETAILS',
}
