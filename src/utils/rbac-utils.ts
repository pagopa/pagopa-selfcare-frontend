/* eslint-disable sonarjs/cognitive-complexity */
import {Party} from '../model/Party';
import {getInstitutionApiKeys} from '../services/apiKeyService';

export const hasGeneratedApiKey = async (selectedParty: Party | undefined): Promise<boolean> => {
    if (selectedParty) {
        const apiKeys = await getInstitutionApiKeys(selectedParty.partyId);
        return !!apiKeys?.institution_api_key_list?.find((key) => key.id.startsWith('nodauth'));
    }
    return false;
};
