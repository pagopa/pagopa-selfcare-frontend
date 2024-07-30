import { BackofficeApi } from '../api/BackofficeClient';
import { MaintenanceHoursSummaryResource } from '../api/generated/portal/MaintenanceHoursSummaryResource';
import { StationMaintenanceListResource } from '../api/generated/portal/StationMaintenanceListResource';
import { StationMaintenanceState } from '../model/StationMaintenance';
import {
  maintenanceHoursSummary,
  stationMaintenancesList,
} from './__mocks__/stationMaintenancesService';

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

export const getBrokerMaintenancesSummary = ({
  brokerTaxCode,
  maintenanceYear,
}: {
  brokerTaxCode: string;
  maintenanceYear: string;
}): Promise<MaintenanceHoursSummaryResource> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return new Promise((resolve) => resolve(maintenanceHoursSummary));
  } else {
    return BackofficeApi.stationMaintenances.getBrokerMaintenancesSummary({
      brokerTaxCode,
      maintenanceYear,
    });
  }
};

export const deleteStationMaintenance = ({
  brokerTaxCode,
  maintenanceId,
}: {
  brokerTaxCode: string;
  maintenanceId: number;
}): Promise<void> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return new Promise((resolve) => resolve());
  } else {
    return BackofficeApi.stationMaintenances.deleteStationMaintenance({
      brokerTaxCode,
      maintenanceId,
    });
  }
};

export const finishStationMaintenance = ({
  brokerTaxCode,
  maintenanceId,
}: {
  brokerTaxCode: string;
  maintenanceId: number;
}): Promise<void> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return new Promise((resolve) => resolve());
  } else {
    return BackofficeApi.stationMaintenances.finishStationMaintenance({
      brokerTaxCode,
      maintenanceId,
    });
  }
};
