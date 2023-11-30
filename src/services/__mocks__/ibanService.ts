import {Ibans} from "../../api/generated/portal/Ibans";
import {Iban} from "../../api/generated/portal/Iban";
import {IbanCreate} from "../../api/generated/portal/IbanCreate";

export const ibanList: Ibans = {
// @ts-ignore
  ibanList: [
    {
      iban: 'IT99C0222211111000000000001',
      publication_date: new Date('2023-06-01T23:59:59.999Z'),
      validity_date: new Date('2023-04-01T13:49:19.897Z'),
      due_date: new Date('2024-04-01T13:49:19.897Z'),
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
      publicationDate: new Date('2024-06-01T23:59:59.999Z'),
      validityDate: new Date('2024-04-01T13:49:19.897Z'),
      dueDate: new Date('2024-04-01T13:49:19.897Z'),
      ecOwner: 'RSSMRA98H27F205Q',
      description: 'Tassa di concorso - servizio tesoreria comunale',
      active: true,
    },
    {
      iban: 'IT99C0222211111000000000004',
      publicationDate: new Date('2024-06-01T23:59:59.999Z'),
      validityDate: new Date('2024-04-01T13:49:19.897Z'),
      dueDate: new Date('2024-04-01T13:49:19.897Z'),
      ecOwner: 'RSSMRA98H27F205Q',
      description: 'Tassa di concorso - servizio tesoreria comunale',
      active: true,
    },
    {
      iban: 'IT99C0222211111000000000005',
      publicationDate: new Date('2023-06-01T23:59:59.999Z'),
      validityDate: new Date('2023-04-01T13:49:19.897Z'),
      dueDate: new Date('2024-04-01T13:49:19.897Z'),
      ecOwner: 'RSSMRA98H27F205Q',
      description: 'Tassa di concorso - servizio tesoreria comunale',
      active: false,
    },
  ],
};

export const mockedIban: Iban = {
  iban: 'IT99C0222211111000000000003',
  description: 'Tassa di concorso - servizio tesoreria comunale',
  validity_date: new Date('2023-04-01T13:49:19.897Z'),
  due_date: new Date('2033-04-01T13:49:19.897Z'),
  publication_date: new Date('2023-04-01T13:49:19.897Z'),
  is_active: true,
  ci_owner: '1234567890',
  labels: [],
};

export const mockedIbanCup: Iban = {
  iban: 'IT99C0222211111000000000003',
  description: 'Tassa di concorso - servizio tesoreria comunale',
  validity_date: new Date('2023-04-01T13:49:19.897Z'),
  due_date: new Date('2033-04-01T13:49:19.897Z'),
  publication_date: new Date('2023-04-01T13:49:19.897Z'),
  ci_owner: 'RSSMRA98H27F205Q',
  labels: [
    {
      description: 'The IBAN to use for CUP payments',
      name: 'CUP',
    },
  ],
  is_active: true,
};

export const mockedIbanStandIn: Iban = {
  iban: 'IT99C0222211111000000000003',
  description: 'Tassa di concorso - servizio tesoreria comunale',
  validity_date: new Date('2023-04-01T13:49:19.897Z'),
  due_date: new Date('2033-04-01T13:49:19.897Z'),
  publication_date: new Date('2023-04-01T13:49:19.897Z'),
  ci_owner: '',
  labels: [
    {
      description: 'The IBAN to use for STANDIN process',
      name: 'STANDIN',
    },
  ],
  is_active: true,
};

export const getCreditorInstitutionIbans = (
  _creditorInstitutionCode: string,
  _labelName?: string
): Promise<Ibans> => new Promise((resolve) => resolve(ibanList));

export const getIbanDetail = (_iban: string): Promise<any> =>
  new Promise((resolve) => {
    // @ts-ignore
    resolve(ibanList.ibanList[0]);
  });

export const getIbanList = (_istitutionId: string): Promise<any> =>
  new Promise((resolve) => resolve(ibanList));

export const getIban = (_iban: string): Promise<any> =>
  new Promise((resolve) => resolve(mockedIban));

export const createIban = (_iban: IbanCreate): Promise<Iban> =>
  new Promise((resolve) => resolve(mockedIban));

export const updateIban = (_iban: IbanCreate): Promise<Iban> =>
  new Promise((resolve) => resolve(mockedIban));

export const updateIbanStandIn = (_iban: IbanCreate): Promise<Iban> =>
  new Promise((resolve) => resolve(mockedIbanStandIn));

export const updateIbanCup = (_iban: IbanCreate): Promise<Iban> =>
  new Promise((resolve) => resolve(mockedIbanCup));

export const deleteIban = (_creditorInstitutionCode: string, _ibanValue: string): Promise<void> =>
  new Promise((resolve) => resolve());
