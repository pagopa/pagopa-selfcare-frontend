import {BackofficeApi} from '../api/BackofficeClient';
import {institutionDetailResource2Party, institutionResource2Party, Party} from '../model/Party';
import {mockedParties} from './__mocks__/partyService';

export const fetchParties = (): Promise<Array<Party>> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        
        return new Promise((resolve) => resolve(mockedParties));
    } else {
        

        return BackofficeApi.getInstitutions().then((institutionResources) => institutionResources ? institutionResources.map(institutionResource2Party) : []
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

    return BackofficeApi.getInstitution(partyId).then((institutionResource: any) =>
        institutionResource ? institutionDetailResource2Party(institutionResource) : null
    );
};
