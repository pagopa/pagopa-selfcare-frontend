import { MaintenanceHoursSummaryResource } from '../../api/generated/portal/MaintenanceHoursSummaryResource';
import { StationMaintenanceListResource } from '../../api/generated/portal/StationMaintenanceListResource';

export const stationMaintenancesList: StationMaintenanceListResource = {
  station_maintenance_list: [],
  page_info: {
    items_found: 0,
    limit: 0,
    page: 0,
    total_pages: 0,
  },
};

export const maintenanceHoursSummary: MaintenanceHoursSummaryResource = {
  annual_hours_limit: '0',
  extra_hours: '0',
  remaining_hours: '0',
  scheduled_hours: '0',
  used_hours: '0',
};
