import { testStation} from '../stationService';
import {
  stationTestMocked,
  stationTestErrorMocked
} from '../__mocks__/stationService';
import { BackofficeApi } from '../../api/BackofficeClient';


describe('StationService test mocked', () => {
  test('Test testStation', async () => {
    const response = await testStation("http://localhost",8080,"/success");
    expect(response).toMatchObject(stationTestMocked);
  });
  test('Test testStation error', async () => {
    const response = await testStation("http://localhost",8080,"/error");
    expect(response).toMatchObject(stationTestErrorMocked);
  });
});

describe('StationService test', () => {

  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, REACT_APP_API_MOCK_FORWARDER_TEST: 'false' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('Test testStation', async () => {
    const spyOn = jest.spyOn(BackofficeApi, "testStation").mockReturnValue(
        new Promise((resolve) => resolve(stationTestMocked)));
    expect(testStation('http://localhost', 8080, "/success"
    )).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
});
