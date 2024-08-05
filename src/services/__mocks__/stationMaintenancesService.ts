import { add } from 'date-fns';
import { MaintenanceHoursSummaryResource } from '../../api/generated/portal/MaintenanceHoursSummaryResource';
import { StationMaintenanceListResource } from '../../api/generated/portal/StationMaintenanceListResource';
import { StationMaintenanceResource } from '../../api/generated/portal/StationMaintenanceResource';
import { CreateStationMaintenance } from '../../api/generated/portal/CreateStationMaintenance';

export const mockStationMaintenancesList: StationMaintenanceListResource = {
  station_maintenance_list: [],
  page_info: {
    items_found: 0,
    limit: 0,
    page: 0,
    total_pages: 0,
  },
};

export const mockMaintenanceHoursSummary: MaintenanceHoursSummaryResource = {
  annual_hours_limit: '0',
  extra_hours: '0',
  remaining_hours: '0',
  scheduled_hours: '0',
  used_hours: '0',
};

export const mockStationMaintenance: StationMaintenanceResource = {
  broker_code: 'brokerCode',
  end_date_time: new Date(),
  maintenance_id: 100,
  stand_in: false,
  start_date_time: new Date(),
  station_code: 'stationCode',
};

export const mockCreateStationMaintenance: CreateStationMaintenance = {
  end_date_time: new Date("01/01/2020, 12:00"),
  stand_in: true,
  start_date_time: new Date("01/01/2020, 10:00"),
  station_code: "stationCode"
}

export const getMockMaintenanceScheduled = (n: number): Array<StationMaintenanceResource> => {
  const arr: Array<StationMaintenanceResource> = [];
  for (let i = 0; i < n; i++) {
    let maintenance = { ...mockStationMaintenance };
    maintenance.start_date_time = add(new Date(), { days: 2 });
    maintenance.end_date_time = add(new Date(), { days: 3 });
    maintenance.maintenance_id = i;
    arr.push(maintenance);
  }
  return arr;
};

export const getMockMaintenanceInProgress = (n: number): Array<StationMaintenanceResource> => {
  const arr: Array<StationMaintenanceResource> = [];
  for (let i = 0; i < n; i++) {
    let maintenance = { ...mockStationMaintenance };
    maintenance.start_date_time = new Date('01/01/2024');
    maintenance.end_date_time = add(new Date(), { days: 3 });
    maintenance.maintenance_id = i;
    arr.push(maintenance);
  }
  return arr;
};

export const getMockMaintenanceFinished = (n: number): Array<StationMaintenanceResource> => {
  const arr: Array<StationMaintenanceResource> = [];
  for (let i = 0; i < n; i++) {
    let maintenance = { ...mockStationMaintenance };
    maintenance.start_date_time = new Date('01/01/2024');
    maintenance.end_date_time = new Date('01/02/2024');
    maintenance.maintenance_id = i;
    arr.push(maintenance);
  }
  return arr;
};
