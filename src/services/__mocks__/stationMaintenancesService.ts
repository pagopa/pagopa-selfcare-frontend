import { MaintenanceHoursSummaryResource } from '../../api/generated/portal/MaintenanceHoursSummaryResource';
import { StationMaintenanceListResource } from '../../api/generated/portal/StationMaintenanceListResource';
import { StationMaintenanceResource } from '../../api/generated/portal/StationMaintenanceResource';

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
  broker_code: "brokerCode",
  end_date_time: new Date(),
  maintenance_id: 100,
  stand_in: false,
  start_date_time: new Date(),
  station_code: "stationCode"
}