import { BackofficeApi } from '../../api/BackofficeClient';
import { ConsentEnum } from '../../api/generated/portal/ServiceConsentInfo';
import {
    getServicesConsentsOptOutResponseMock,
    mockedDelegatedPSP,
    mockedInstitutionDetailResource,
    mockedServiceConsentResponse,
} from '../__mocks__/institutionsService';
import { getBrokerDelegation, getInstitutionFullDetail, getInstitutions, getServiceConsents, saveServiceConsent } from '../institutionService';

describe('InstitutionService test mocked', () => {
    test('Test getBrokerDelegation', async () => {
        const response = await getBrokerDelegation('institutionId', 'brokerId', ['roles']);
        expect(response).toMatchObject(mockedDelegatedPSP);
    });

    test('Test getInstitutions', async () => {
        const response = await getInstitutions('taxCode');
        expect(response).toMatchObject(mockedInstitutionDetailResource);
    });

    test('Test getInstitutionFullDetail', async () => {
        const response = await getInstitutionFullDetail('taxCode');
        expect(response).toMatchObject(mockedInstitutionDetailResource);
    });
});

describe('InstitutionService test client', () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV, REACT_APP_API_MOCK_BACKOFFICE: 'false' };
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    test('Test InstitutionService.getBrokerDelegation', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi.institutions, 'getBrokerDelegation')
            .mockReturnValue(Promise.resolve(mockedDelegatedPSP));
        expect(getBrokerDelegation('institutionId', 'brokerId', ['roles'])).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });

    test('Test InstitutionService.getInstitutions', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi.institutions, 'getInstitutions')
            .mockReturnValue(Promise.resolve(mockedInstitutionDetailResource));
        expect(getInstitutions('taxCode')).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });

    test('Test InstitutionService.getInstitutionFullDetail', async () => {
        const spyOn = jest
            .spyOn(BackofficeApi.institutions, 'getInstitutionFullDetail')
            .mockReturnValue(Promise.resolve(mockedInstitutionDetailResource));
        expect(getInstitutionFullDetail('taxCode')).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });

    test('Test InstitutionService.saveServiceConsent', async () => {
        const institutionId = "institutionId";
        const serviceId = "RTP";
        const consent = ConsentEnum.OPT_IN;
        const spy = jest
            .spyOn(BackofficeApi.institutions, 'saveServiceConsent')
            .mockReturnValue(Promise.resolve(mockedServiceConsentResponse(consent, new Date())));
        expect(saveServiceConsent(institutionId, serviceId, consent)).resolves.not.toThrow();
        expect(spy).toHaveBeenNthCalledWith(1, institutionId, serviceId, consent);
    });

    test('Test InstitutionService.getServiceConsents', async () => {
        const institutionId = "institutionId";
        const spy = jest
            .spyOn(BackofficeApi.institutions, 'getServiceConsents')
            .mockReturnValue(getServicesConsentsOptOutResponseMock());
        expect(getServiceConsents(institutionId)).resolves.not.toThrow();
        expect(spy).toHaveBeenNthCalledWith(1, institutionId);
    });
});
