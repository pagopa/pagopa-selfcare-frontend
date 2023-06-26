import { IbansResource } from '../../api/generated/portal/IbansResource';

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

export const getCreditorInstitutionIbans = (
  _creditorInstitutionCode: string
): Promise<IbansResource> => new Promise((resolve) => resolve(ibanList));

export const getIbanDetail = (_iban: string): Promise<any> =>
  new Promise((resolve) => resolve(ibanList.ibanList[0]));
