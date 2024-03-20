import {Ibans} from "../../api/generated/portal/Ibans";
import {Iban} from "../../api/generated/portal/Iban";
import {IbanCreate} from "../../api/generated/portal/IbanCreate";
import { BrokerECExportStatus } from "../../api/generated/portal/BrokerECExportStatus";

export const ibanList: Ibans = {
// @ts-ignore
  ibans_enhanced: [
    {
      iban: 'IT99C0222211111000000000001',
      publication_date: '2023-06-01T23:59:59.999Z',
      validity_date: '2023-04-01T13:49:19.897Z',
      due_date: '2024-04-01T13:49:19.897Z',
      ci_owner: 'RSSMRA98H27F205Q',
      description: 'Tassa di concorso - servizio tesoreria comunale',
      labels: [
        {
          description: 'The IBAN to use for CUP payments',
          name: '0201138TS',
        },
      ],
      is_active: true,
    },
    {
      iban: 'IT99C0222211111000000000002',
      publication_date: '2024-06-01T23:59:59.999Z',
      validity_date: '2024-04-01T13:49:19.897Z',
      due_date: '2024-04-01T13:49:19.897Z',
      ci_owner: 'RSSMRA98H27F205Q',
      description: 'Tassa di concorso - servizio tesoreria comunale',
      labels: [
        {
          description: 'The IBAN to use for STANDIN payments',
          name: 'ACA',
        },
      ],
      is_active: true,
    },
    {
      iban: 'IT99C0222211111000000000003',
      publication_date: '2024-06-01T23:59:59.999Z',
      validity_date: '2024-04-01T13:49:19.897Z',
      due_date: '2024-04-01T13:49:19.897Z',
      ci_owner: 'RSSMRA98H27F205Q',
      description: 'Tassa di concorso - servizio tesoreria comunale',
      is_active: true,
    },
    {
      iban: 'IT99C0222211111000000000004',
      publication_date: '2024-06-01T23:59:59.999Z',
      validity_date: '2024-04-01T13:49:19.897Z',
      due_date: '2024-04-01T13:49:19.897Z',
      ci_owner: 'RSSMRA98H27F205Q',
      description: 'Tassa di concorso - servizio tesoreria comunale',
      is_active: true,
    },
    {
      iban: 'IT99C0222211111000000000005',
      publication_date: '2023-06-01T23:59:59.999Z',
      validity_date: '2023-04-01T13:49:19.897Z',
      due_date: '2024-04-01T13:49:19.897Z',
      ci_owner: 'RSSMRA98H27F205Q',
      description: 'Tassa di concorso - servizio tesoreria comunale',
      is_active: false,
    },
  ],
};

export const mockedIban: Iban = {
  iban: 'IT99C0222211111000000000003',
  description: 'Tassa di concorso - servizio tesoreria comunale',
  validity_date: '2023-04-01T13:49:19.897Z',
  due_date: '2033-04-01T13:49:19.897Z',
  publication_date: '2023-04-01T13:49:19.897Z',
  is_active: true,
  ci_owner: '1234567890',
  labels: [],
};

export const mockedIbanCup: Iban = {
  iban: 'IT99C0222211111000000000003',
  description: 'Tassa di concorso - servizio tesoreria comunale',
  validity_date: '2023-04-01T13:49:19.897Z',
  due_date: '2033-04-01T13:49:19.897Z',
  publication_date: '2023-04-01T13:49:19.897Z',
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
  validity_date: '2023-04-01T13:49:19.897Z',
  due_date: '2033-04-01T13:49:19.897Z',
  publication_date: '2023-04-01T13:49:19.897Z',
  ci_owner: '',
  labels: [
    {
      description: 'The IBAN to use for STANDIN process',
      name: 'STANDIN',
    },
  ],
  is_active: true,
};

export const mockedBrokerExportStatus: BrokerECExportStatus = {
  broker_ibans_last_update: new Date('2024-01-01T12:00:00.000Z'),
  broker_institutions_last_update: new Date('2024-01-01T12:00:00.000Z')
}

export const mockedIbansCSV: Buffer = Buffer.from("denominazioneEnte;codiceFiscale;iban;stato;dataAttivazioneIban;dataScadenzaIban;descrizione;etichetta\nComune di Brunello;00290400126;IT00X000001111129385748000;ATTIVO;2023-12-18T09:10:29.249+01:00;2035-12-31T09:10:29.249+01:00;string;0201138TS\nComune di Brunello;00290400126;IT00X000001111129385748001;ATTIVO;2023-12-18T09:10:29.249+01:00;2035-12-31T09:10:29.249+01:00;1 iban;ACA");

export const mockedCreditorInstitutionsCSV: Buffer = Buffer.from("companyName;administrativeCode;taxCode;intermediated;brokerCompanyName;brokerTaxCode;model;auxDigit;segregationCode;applicationCode;cbillCode;stationId;stationState;activationDate;version;broadcast\nComune di X;XX;1928477588;NO;Fake broker;1245678901;3;3;01;;XXXXX;1245678901_01;ACTIVE;2024-01-17T10:45:02.523Z;2;INACTIVE");

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

export const exportIbansToCsv = (_brokerCode: string): Promise<any> =>
  new Promise((resolve) => resolve(mockedIbansCSV));

export const exportCreditorInstitutionsToCsv = (_brokerCode: string): Promise<any> =>
    new Promise((resolve) => resolve(mockedCreditorInstitutionsCSV));

export const getBrokerExportStatus = (_brokerCode: string): Promise<any> =>
    new Promise((resolve) => resolve(mockedBrokerExportStatus));
  