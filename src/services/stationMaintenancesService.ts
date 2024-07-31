import { BackofficeApi } from '../api/BackofficeClient';
import { CreateStationMaintenance } from '../api/generated/portal/CreateStationMaintenance';
import { MaintenanceHoursSummaryResource } from '../api/generated/portal/MaintenanceHoursSummaryResource';
import { StationMaintenanceListResource } from '../api/generated/portal/StationMaintenanceListResource';
import { StationMaintenanceState } from '../model/StationMaintenance';
import {
  mockMaintenanceHoursSummary,
  mockStationMaintenancesList,
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
    return new Promise((resolve) => resolve(mockStationMaintenancesList));
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
    return new Promise((resolve) => resolve(mockMaintenanceHoursSummary));
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

export const createStationMaintenance = ({
  brokerTaxCode,
  createStationMaintenance,
}: {
  brokerTaxCode: string;
  createStationMaintenance: CreateStationMaintenance;
}): Promise<void> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return new Promise((resolve) => resolve());
  } else {
    return BackofficeApi.stationMaintenances.createStationMaintenance({
      brokerTaxCode,
      createStationMaintenance,
    });
  }
};

export const updateStationMaintenance = ({
  brokerTaxCode,
  maintenanceId,
  createStationMaintenance,
}: {
  brokerTaxCode: string;
  maintenanceId: number;
  createStationMaintenance: CreateStationMaintenance;
}): Promise<void> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return new Promise((resolve) => resolve());
  } else {
    return BackofficeApi.stationMaintenances.updateStationMaintenance({
      brokerTaxCode,
      maintenanceId,
      createStationMaintenance,
    });
  }
};
