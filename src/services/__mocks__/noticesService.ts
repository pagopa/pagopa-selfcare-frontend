import {InstitutionUploadData} from '../../api/generated/portal/InstitutionUploadData';

export const institutionsData = {
  "taxCode": "taxCode",
  "fullName": "Comune di Controguerra (Test)",
  "organization": "Servizio Pagamenti",
  "info": "Info: www.cittadicapri.it",
  "webChannel": true,
  "appChannel": true,
  "physicalChannel": "Canale Fisico",
  "cbill": "78Q45",
  "posteAccountNumber": "232323",
  "posteAuth": "AUT. 08/5 S3/81 53079 08129.07.20211",
  "logo": "https://pagopadprintitci.blob.core.windows.net/institutionslogoblob/12345678911/logo.png"
};

export const getInstitutionData = (taxCode: string): Promise<InstitutionUploadData | undefined> => {
   return new Promise((resolve) => resolve({...institutionsData, 'taxCode': taxCode}));
   //return new Promise((resolve) => resolve(undefined));
};

export const uploadInstitutionData =
 (file: File | null, institutionsData: InstitutionUploadData): Promise<void> => 
  new Promise((resolve) => resolve());
