import { getTaxonomies, getTaxonomyGroups } from '../taxonomyService';
import { mockedTaxonomyGroups, mockedTaxonomy } from '../__mocks__/taxonomyService';
import { BackofficeApi } from '../../api/BackofficeClient';

describe('TaxonomiesService test client', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, REACT_APP_API_MOCK_BACKOFFICE: 'false' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('Test getTaxonomyGroups', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.taxonomies, 'getTaxonomyGroups')
      .mockReturnValue(new Promise((resolve) => resolve(mockedTaxonomyGroups)));
    expect(getTaxonomyGroups()).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test getTaxonomies', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.taxonomies, 'getTaxonomies')
      .mockReturnValue(new Promise((resolve) => resolve(mockedTaxonomy)));
    expect(getTaxonomies('', '', '', false)).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
});

describe('TaxonomiesService test mocked', () => {
  test('Test getTaxonomyGroups', async () => {
    const taxonomyGroups = await getTaxonomyGroups();
    expect(taxonomyGroups).toMatchObject(mockedTaxonomyGroups);
  });
  test('Test getTaxonomies', async () => {
    const taxonomies = await getTaxonomies('', '', '', false);
    expect(taxonomies).toMatchObject(mockedTaxonomy);
  });
});
