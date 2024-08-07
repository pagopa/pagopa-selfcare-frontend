import { BackofficeApi } from '../../api/BackofficeClient';
import { StationMaintenanceState } from '../../model/StationMaintenance';
import {
  mockCreateStationMaintenance,
  mockMaintenanceHoursSummary,
  mockStationMaintenancesList,
} from '../__mocks__/stationMaintenancesService';
import {
  createStationMaintenance,
  deleteStationMaintenance,
  finishStationMaintenance,
  getBrokerMaintenancesSummary,
  getStationMaintenances,
  updateStationMaintenance,
} from '../stationMaintenancesService';

describe('StationMaintenancesService test mocked', () => {
  test('Test getStationMaintenances', async () => {
    const response = await getStationMaintenances({
      brokerTaxCode: 'brokerTaxCode',
      stationCode: 'stationCode',
      state: StationMaintenanceState.FINISHED,
      limit: 0,
      page: 0,
      year: 2024,
    });
    expect(response).toMatchObject(mockStationMaintenancesList);
  });
  test('Test getBrokerMaintenancesSummary', async () => {
    const response = await getBrokerMaintenancesSummary({
      brokerTaxCode: 'brokerTaxCode',
      maintenanceYear: '2024',
    });
    expect(response).toMatchObject(mockMaintenanceHoursSummary);
  });
  test('Test deleteStationMaintenance', async () => {
    const response = await deleteStationMaintenance({
      brokerTaxCode: 'brokerTaxCode',
      maintenanceId: 0,
    });
    expect(response).toBeUndefined();
  });
  test('Test finishStationMaintenance', async () => {
    const response = await finishStationMaintenance({
      brokerTaxCode: 'brokerTaxCode',
      maintenanceId: 0,
    });
    expect(response).toBeUndefined();
  });
  test('Test createStationMaintenance', async () => {
    const response = await createStationMaintenance({
      brokerTaxCode: 'brokerTaxCode',
      createStationMaintenance: mockCreateStationMaintenance,
    });
    expect(response).toBeUndefined();
  });
  test('Test updateStationMaintenance', async () => {
    const response = await updateStationMaintenance({
      brokerTaxCode: 'brokerTaxCode',
      maintenanceId: 0,
      createStationMaintenance: mockCreateStationMaintenance,
    });
    expect(response).toBeUndefined();
  });
});

describe('StationMaintenancesService test', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, REACT_APP_API_MOCK_BACKOFFICE: 'false' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('Test getStationMaintenances', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.stationMaintenances, 'getStationMaintenances')
      .mockReturnValue(new Promise((resolve) => resolve(mockStationMaintenancesList)));
    expect(
      getStationMaintenances({
        brokerTaxCode: 'brokerTaxCode',
        stationCode: 'stationCode',
        state: StationMaintenanceState.FINISHED,
        limit: 0,
        page: 0,
        year: 2024,
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test getBrokerMaintenancesSummary', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.stationMaintenances, 'getBrokerMaintenancesSummary')
      .mockReturnValue(new Promise((resolve) => resolve(mockMaintenanceHoursSummary)));
    expect(
      getBrokerMaintenancesSummary({
        brokerTaxCode: 'brokerTaxCode',
        maintenanceYear: '2024',
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test deleteStationMaintenance', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.stationMaintenances, 'deleteStationMaintenance')
      .mockReturnValue(new Promise((resolve) => resolve()));
    expect(
      deleteStationMaintenance({
        brokerTaxCode: 'brokerTaxCode',
        maintenanceId: 0,
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test finishStationMaintenance', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.stationMaintenances, 'finishStationMaintenance')
      .mockReturnValue(new Promise((resolve) => resolve()));
    expect(
      finishStationMaintenance({
        brokerTaxCode: 'brokerTaxCode',
        maintenanceId: 0,
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test createStationMaintenance', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.stationMaintenances, 'createStationMaintenance')
      .mockReturnValue(new Promise((resolve) => resolve()));
    expect(
      createStationMaintenance({
        brokerTaxCode: 'brokerTaxCode',
        createStationMaintenance: mockCreateStationMaintenance,
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test updateStationMaintenance', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.stationMaintenances, 'updateStationMaintenance')
      .mockReturnValue(new Promise((resolve) => resolve()));
    expect(
      updateStationMaintenance({
        brokerTaxCode: 'brokerTaxCode',
        maintenanceId: 0,
        createStationMaintenance: mockCreateStationMaintenance,
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
});
