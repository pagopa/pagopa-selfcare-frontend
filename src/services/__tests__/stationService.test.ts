import { BackofficeApi } from '../../api/BackofficeClient';
import { TestStationTypeEnum } from '../../api/generated/portal/StationTestDto';
import { ConfigurationStatus } from '../../model/Station';
import {
    mockedCreatedStation,
    mockedCreditorInstitutionStationDTO,
    mockedFullStation,
    mockedSegregationCodeList,
    mockedStation,
    mockedStationAvailableEC,
    mockedStationCode,
    mockedStationDetailsDTO,
    mockedStationECs,
    mockedStations,
    mockedWrapperStation,
    stationTestErrorMocked,
    stationTestMocked,
    updateWrapperStation,
} from '../__mocks__/stationService';
import {
    associateEcToStation,
    createStation,
    createWrapperStation,
    dissociateECfromStation,
    getCreditorInstitutionSegregationCodes,
    getECListByStationCode,
    getStationAvailableEC,
    getStationCode,
    getStationCodeV2,
    getStationDetail,
    getStations,
    testStation,
    updateStation,
    updateWrapperStationDetails,
    updateWrapperStationWithOperatorReview,
} from '../stationService';

describe('StationService test mocked', () => {
  test('Test createStation', async () => {
    const response = await createStation(mockedCreatedStation);
    expect(response).toMatchObject(mockedStation);
  });
  test('Test getStations', async () => {
    const response = await getStations({
      page: 0,
      brokerCode: 'brokerCode',
      status: ConfigurationStatus.ACTIVE,
      stationCode: 'stationCode',
      limit: 0,
    });
    expect(response).toMatchObject(mockedStations);
  });
  test('Test getStationCode', async () => {
    const response = await getStationCode('code');
    expect(response).toMatchObject(mockedStationCode);
  });
  test('Test getStationCodeV2', async () => {
    const response = await getStationCodeV2('code');
    expect(response).toMatchObject(mockedStationCode);
  });
  test('Test getECListByStationCode', async () => {
    const response = await getECListByStationCode('stationCode', 'ciName', 0);
    expect(response).toMatchObject(mockedStationECs);
  });
  test('Test dissociateECfromStation', async () => {
    const response = await dissociateECfromStation('ecCode', 'stationCode');
    expect(response).toBeUndefined();
  });
  test('Test associateEcToStation', async () => {
    const response = await associateEcToStation('ecCode', mockedCreditorInstitutionStationDTO);
    expect(response).toMatchObject({ stationCode: '123' });
  });
  test('Test getStationAvailableEC', async () => {
    const response = await getStationAvailableEC();
    expect(response).toMatchObject(mockedStationAvailableEC);
  });
  test('Test createWrapperStation', async () => {
    const response = await createWrapperStation({
      station: mockedWrapperStation,
      validationUrl: 'url',
    });
    expect(response).toMatchObject(mockedWrapperStation);
  });
  test('Test updateWrapperStation', async () => {
    const response = await updateWrapperStation(mockedStationDetailsDTO);
    expect(response).toMatchObject(mockedWrapperStation);
  });
  test('Test updateWrapperStationWithOperatorReview', async () => {
    const response = await updateWrapperStationWithOperatorReview({
      stationCode: 'stationCode',
      ciTaxCode: 'ciTaxCode',
      note: 'note',
    });
    expect(response).toMatchObject(mockedFullStation);
  });
  test('Test updateStation', async () => {
    const response = await updateStation({
      station: mockedStationDetailsDTO,
      stationCode: 'stationCode',
    });
    expect(response).toMatchObject(mockedFullStation);
  });
  test('Test getStationDetail', async () => {
    const response = await getStationDetail({
      stationCode: 'stationId',
      status: ConfigurationStatus.ACTIVE,
    });
    expect(response).toMatchObject(mockedFullStation);
  });
  test('Test getCreditorInstitutionSegregationcodes', async () => {
    const response = await getCreditorInstitutionSegregationCodes('ecCode', 'targetCICode');
    expect(response).toMatchObject(mockedSegregationCodeList);
  });
  test('Test testStation', async () => {
    const response = await testStation(
      'http',
      'localhost',
      8080,
      '/success',
      TestStationTypeEnum.PA_VERIFY
    );
    expect(response).toMatchObject(stationTestMocked);
  });
  test('Test testStation error', async () => {
    const response = await testStation(
      'http',
      'localhost',
      8080,
      '/error',
      TestStationTypeEnum.PA_VERIFY
    );
    expect(response).toMatchObject(stationTestErrorMocked);
  });
});

describe('StationService test', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, REACT_APP_API_MOCK_BACKOFFICE: 'false' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('Test createStation', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi, 'createStation')
      .mockReturnValue(new Promise((resolve) => resolve(mockedStation)));
    expect(createStation(mockedCreatedStation)).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test getStations', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi, 'getStations')
      .mockReturnValue(new Promise((resolve) => resolve(mockedStations)));
    expect(
      getStations({
        page: 0,
        brokerCode: 'brokerCode',
        status: ConfigurationStatus.ACTIVE,
        stationCode: 'stationCode',
        limit: 0,
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test getStationCode', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi, 'getStationCode')
      .mockReturnValue(new Promise((resolve) => resolve(mockedStationCode)));
    expect(getStationCode('code')).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test getStationCodeV2', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi, 'getStationCodeV2')
      .mockReturnValue(new Promise((resolve) => resolve(mockedStationCode)));
    expect(getStationCodeV2('code')).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test getECListByStationCode', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi, 'getECListByStationCode')
      .mockReturnValue(new Promise((resolve) => resolve(mockedStationECs)));
    expect(getECListByStationCode('stationCode', 'ciName', 0)).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test dissociateECfromStation', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi, 'dissociateECfromStation')
      .mockReturnValue(new Promise((resolve) => resolve()));
    expect(dissociateECfromStation('ecCode', 'stationCode')).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test associateEcToStation', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi, 'associateEcToStation')
      .mockReturnValue(new Promise((resolve) => resolve({ stationCode: '123' })));
    expect(
      associateEcToStation('ecCode', mockedCreditorInstitutionStationDTO)
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test getStationAvailableEC', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi, 'getStationAvailableEc')
      .mockReturnValue(new Promise((resolve) => resolve(mockedStationAvailableEC)));
    expect(getStationAvailableEC()).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test createWrapperStation', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi, 'createWrapperStation')
      .mockReturnValue(new Promise((resolve) => resolve(mockedWrapperStation)));
    expect(
      createWrapperStation({ station: mockedWrapperStation, validationUrl: 'url' })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test updateWrapperStation', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi, 'updateWrapperStationDetails')
      .mockReturnValue(new Promise((resolve) => resolve(mockedWrapperStation)));
    expect(updateWrapperStationDetails({stationCode: 'station-code', station: mockedStationDetailsDTO, validationUrl: 'url'})).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test updateWrapperStationWithOperatorReview', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi, 'updateWrapperStationWithOperatorReview')
      .mockReturnValue(new Promise((resolve) => resolve(mockedFullStation)));
    expect(
      updateWrapperStationWithOperatorReview({
        stationCode: 'stationCode',
        ciTaxCode: 'ciTaxCode',
        note: 'note',
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test updateStation', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi, 'updateStation')
      .mockReturnValue(new Promise((resolve) => resolve(mockedFullStation)));
    expect(
      updateStation({ station: mockedStationDetailsDTO, stationCode: 'stationCode' })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test getStationDetail', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi, 'getStationDetails')
      .mockReturnValue(new Promise((resolve) => resolve(mockedFullStation)));
    expect(
      getStationDetail({ stationCode: 'stationId', status: ConfigurationStatus.ACTIVE })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test getCreditorInstitutionSegregationcodes', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi, 'getCreditorInstitutionSegregationCodes')
      .mockReturnValue(new Promise((resolve) => resolve(mockedSegregationCodeList)));
    expect(getCreditorInstitutionSegregationCodes('ecCode', 'targetCICode')).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test testStation', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi, 'testStation')
      .mockReturnValue(new Promise((resolve) => resolve(stationTestMocked)));
    expect(
      testStation('http', 'localhost', 8080, '/success', TestStationTypeEnum.PA_VERIFY)
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
});
