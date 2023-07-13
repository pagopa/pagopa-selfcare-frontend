// import { IbanCreateRequestDto } from '../../api/generated/portal/IbanCreateRequestDto';
import { IbanCreateRequestDto } from '../../api/generated/portal/IbanCreateRequestDto';
import { IbanResource } from '../../api/generated/portal/IbanResource';
import { IbansResource } from '../../api/generated/portal/IbansResource';
import { IbanOnCreation } from '../../model/Iban';

export const ibanList: IbansResource = {
  ibanList: [
    {
      iban: 'IT99C0222211111000000000001',
      publicationDate: new Date('2023-06-01T23:59:59.999Z'),
      validityDate: new Date('2023-04-01T13:49:19.897Z'),
      dueDate: new Date('2024-04-01T13:49:19.897Z'),
      ecOwner: 'RSSMRA98H27F205Q',
      description: 'Tassa di concorso - servizio tesoreria comunale',
      labels: [
        {
          description: 'The IBAN to use for CUP payments',
          name: 'CUP',
        },
      ],
      active: true,
    },
    {
      iban: 'IT99C0222211111000000000002',
      publicationDate: new Date('2024-06-01T23:59:59.999Z'),
      validityDate: new Date('2024-04-01T13:49:19.897Z'),
      dueDate: new Date('2024-04-01T13:49:19.897Z'),
      ecOwner: 'RSSMRA98H27F205Q',
      description: 'Tassa di concorso - servizio tesoreria comunale',
      labels: [
        {
          description: 'The IBAN to use for STANDIN payments',
          name: 'STANDIN',
        },
      ],
      active: true,
    },

    {
      iban: 'IT99C0222211111000000000003',
      publicationDate: new Date('2023-06-01T23:59:59.999Z'),
      validityDate: new Date('2023-04-01T13:49:19.897Z'),
      dueDate: new Date('2024-04-01T13:49:19.897Z'),
      ecOwner: 'RSSMRA98H27F205Q',
      description: 'Tassa di concorso - servizio tesoreria comunale',
      active: false,
    },
  ],
};

export const mockedIban: IbanOnCreation = {
  iban: 'IT99C0222211111000000000003',
  description: 'Tassa di concorso - servizio tesoreria comunale',
  validityDate: new Date('2023-04-01T13:49:19.897Z'),
  dueDate: new Date('2033-04-01T13:49:19.897Z'),
  creditorInstitutionCode: '1234567890',
  labels: [{}],
  active: true,
  ecOwner: '1234567890',
};

export const mockedIbanCup: IbanResource = {
  iban: 'IT99C0222211111000000000003',
  description: 'Tassa di concorso - servizio tesoreria comunale',
  validityDate: new Date('2023-04-01T13:49:19.897Z'),
  dueDate: new Date('2033-04-01T13:49:19.897Z'),
  publicationDate: new Date('2023-04-01T13:49:19.897Z'),
  ecOwner: 'RSSMRA98H27F205Q',
  labels: [
    {
      description: 'The IBAN to use for CUP payments',
      name: 'CUP',
    },
  ],
};

export const mockedIbanStandIn: IbanResource = {
  iban: 'IT99C0222211111000000000003',
  description: 'Tassa di concorso - servizio tesoreria comunale',
  validityDate: new Date('2023-04-01T13:49:19.897Z'),
  dueDate: new Date('2033-04-01T13:49:19.897Z'),
  publicationDate: new Date('2023-04-01T13:49:19.897Z'),
  ecOwner: '',
  labels: [
    {
      description: 'The IBAN to use for STANDIN process',
      name: 'STANDIN',
    },
  ],
};

export const getCreditorInstitutionIbans = (
  _creditorInstitutionCode: string
): Promise<IbansResource> => new Promise((resolve) => resolve(ibanList));

export const getIbanDetail = (_iban: string): Promise<any> =>
  new Promise((resolve) => resolve(ibanList.ibanList[0]));

export const getIbanList = (_istitutionId: string): Promise<any> =>
  new Promise((resolve) => resolve(ibanList));

export const getIban = (_iban: string): Promise<any> =>
  new Promise((resolve) => resolve(mockedIban));

export const createIban = (_iban: IbanCreateRequestDto): Promise<any> =>
  new Promise((resolve) => resolve(mockedIban));

export const updateIban = (_iban: IbanOnCreation, _ecCode: string) =>
  new Promise((resolve) => resolve(mockedIban));

export const updateIbanStandIn = (_iban: IbanOnCreation): Promise<IbanResource> =>
  new Promise((resolve) => resolve(mockedIbanStandIn));

export const updateIbanCup = (_iban: IbanOnCreation): Promise<IbanResource> =>
  new Promise((resolve) => resolve(mockedIbanCup));
