import {BackofficeApi} from '../api/BackofficeClient';
import {BaseParty, institutionBaseResource2BaseParty, institutionResource2Party, Party} from '../model/Party';
import {mockedParties} from './__mocks__/partyService';

export const fetchParties = (): Promise<Array<BaseParty>> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return new Promise((resolve) => resolve(mockedParties));
    } else {
        return BackofficeApi.institutions.getInstitutions(undefined).then(
            (institutionResources) =>
                 institutionResources?.institution_base_list ? 
            institutionResources.institution_base_list
                .map(institutionBaseResource2BaseParty) : 
                []
            );
    }
};

export const fetchPartyDetails = (
    partyId: string,
    _parties?: Array<Party>
): Promise<Party | null> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return new Promise((resolve) =>
            resolve(mockedParties.find((p) => p.partyId === partyId) ?? null)
        );
    }

    return BackofficeApi.institutions.getInstitutionFullDetail(partyId).then((institutionResource: any) =>
        institutionResource ? institutionResource2Party(institutionResource) : null
    );
};
