import { BackofficeApi } from '../api/BackofficeClient';
import { StationMaintenanceListResource } from '../api/generated/portal/StationMaintenanceListResource';
import { StationMaintenanceState } from '../model/StationMaintenance';
import {stationMaintenancesList} from "./__mocks__/stationMaintenancesService";

export const getStationMaintenances = ({
  brokerTaxCode,
  stationCode,
  state,
  year,
  limit,
  page,
}: {
  brokerTaxCode: string;
  stationCode: string;
  state: StationMaintenanceState;
  year: number;
  limit: number;
  page: number;
}): Promise<StationMaintenanceListResource> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return new Promise((resolve) => resolve(stationMaintenancesList));
  } else {
    return BackofficeApi.stationMaintenances.getStationMaintenances({
      brokerTaxCode,
      stationCode,
      state,
      year,
      limit,
      page,
    });
  }
};
