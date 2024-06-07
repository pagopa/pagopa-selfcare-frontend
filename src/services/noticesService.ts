import {BackofficeApi} from '../api/BackofficeClient';
import {InstitutionUploadData} from '../api/generated/portal/InstitutionUploadData';
import {
    getInstitutionData as getInstitutionDataMock,
    uploadInstitutionData as uploadInstitutionDataMock
} from './__mocks__/noticesService';


export const getInstitutionData = (taxCode: string): Promise<InstitutionUploadData | undefined> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getInstitutionDataMock(taxCode);
    } else {
        return BackofficeApi.getInstitutionData({'ciTaxCode': taxCode});
    }
};

export const uploadInstitutionData = (file: File | null, institutionsData: InstitutionUploadData): Promise<void> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return uploadInstitutionDataMock(file, institutionsData);
    } else {
        return BackofficeApi.uploadInstitutionData({file, 'uploadInstitutionData': institutionsData});
    }
};
