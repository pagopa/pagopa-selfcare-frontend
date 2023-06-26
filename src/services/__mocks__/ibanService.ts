import { IbansResource } from '../../api/generated/portal/IbansResource';
import { IbanOnCreation } from '../../model/Iban';

export const ibanList: IbansResource = {
  ibanList: [
    {
      ibanValue: 'IT99C0222211111000000000001',
      publicationDate: new Date('2023-06-01T23:59:59.999Z'),
      validityDate: new Date('2023-04-01T13:49:19.897Z'),
    },
    {
      ibanValue: 'IT99C0222211111000000000002',
      publicationDate: new Date('2024-06-01T23:59:59.999Z'),
      validityDate: new Date('2024-04-01T13:49:19.897Z'),
    },
    {
      ibanValue: 'IT99C0222211111000000000003',
      publicationDate: new Date('2023-06-01T23:59:59.999Z'),
      validityDate: new Date('2023-04-01T13:49:19.897Z'),
    },
  ],
};

export const mockedIban = {
  ibanCode: 'IT10T0760116200000014700876',
  ibanDescription: 'Tassa di concorso - servizio tesoreria comunale',
  startDate: new Date('2023-04-01T13:49:19.897Z'),
  endDate: new Date('2033-04-01T13:49:19.897Z'),
  holderFiscalCode: undefined,
};

export const getCreditorInstitutionIbans = (
  _creditorInstitutionCode: string
): Promise<IbansResource> => new Promise((resolve) => resolve(ibanList));

export const getIbanDetail = (_iban: string): Promise<any> =>
  new Promise((resolve) => resolve(ibanList.ibanList[0]));

export const getIbanList = (_istitutionId: string): Promise<any> =>
  new Promise((resolve) => resolve(ibanList));

export const getIban = (iban: string): Promise<any> => new Promise((resolve) => resolve(iban));

export const createIban = (_iban: IbanOnCreation): Promise<any> =>
  new Promise((resolve) => resolve(mockedIban));
