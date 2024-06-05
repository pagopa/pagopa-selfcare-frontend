import { getInstitutionData, uploadInstitutionData } from '../noticesService';
import { institutionsData } from '../__mocks__/noticesService';

const MOCK_TAX_CODE = "taxCode";

describe('institutions services test mocked', () => {
  test('Test getInstitutionData mocked', async () => {
    const result = await getInstitutionData(MOCK_TAX_CODE);
    expect(result).toMatchObject(institutionsData);
  });

  test('Test uploadInstitutionData mocked ', async () => {
    await uploadInstitutionData(null, institutionsData);
  });
});
