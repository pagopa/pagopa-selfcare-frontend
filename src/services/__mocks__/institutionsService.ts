import { StatusEnum } from '../../api/generated/portal/WrapperChannelDetailsDto';
import { TypeEnum, WrapperEntities } from '../../api/generated/portal/WrapperEntities';
import { Delegation } from '../../api/generated/portal/Delegation';
import { mockedPaymentTypes } from './configurationService';


export const channelWrapperMockedGet = (code: string): WrapperEntities => ({
  brokerCode: 'string',
  createdAt: new Date("2024-02-29T17:05:35.740Z"),
  createdBy: 'PSP S.p.A',
  id: 'string',
  modifiedAt: new Date("2024-02-29T17:05:35.740Z"),
  modifiedBy: 'string',
  modifiedByOpt: 'string',
  note: 'string',
  status: StatusEnum.APPROVED,
  type: TypeEnum.CHANNEL,
  entities: [
    {
      createdAt: new Date("2024-02-29T17:05:35.740Z"),
      entity: {
        broker_psp_code: '97735020584',
        broker_description: 'AgID - Agenzia per l’Italia Digitale',
        channel_code: code,
        target_path: ' /govpay/api/pagopa/PagamentiTelematiciCCPservice',
        target_port: 8081,
        target_host: ' lab.link.it',
        payment_types: mockedPaymentTypes?.payment_types?.map((e) => e.payment_type ?? "") ?? [],
        status: StatusEnum.TO_CHECK,
      },
      id: 'string',
      modifiedAt: new Date("2024-02-29T17:05:35.740Z"),
      modifiedBy: 'string',
      modifiedByOpt: 'Operatore PSP',
      note: 'string',
      status: StatusEnum.TO_CHECK,
      type: TypeEnum.CHANNEL,
    },
  ],
});

export const mockedDelegatedPSP: Array<Delegation> = [
  {
    broker_id: '12345',
    institution_id: '0000001',
    broker_name: 'PSP1',
  },
  {
    broker_id: 'fce5332f-56a4-45b8-8fdc-7667ccdfca5e2',
    broker_name: 'PSP2',
    id: '2e76eb7f-2f55-4ec3-8f41-1743f827f7db2',
    institution_id: 'dccdade9-4ce4-444b-8b4d-ef50be064842',
    institution_name:
      "Azienda Pubblica di Servizi alla Persona Montedomini - Sant'Ambrogio - Fuligno - Bigallo",
    institution_type: 'PA',
    product_id: 'prod-pagopa',
    tax_code: '800011104872',
    type: 'PT',
  },
  {
    broker_id: 'fce5332f-56a4-45b8-8fdc-7667ccdfca5e3',
    broker_name: 'PSP3',
    id: '2e76eb7f-2f55-4ec3-8f41-1743f827f7db3',
    institution_id: 'dccdade9-4ce4-444b-8b4d-ef50be0648473',
    institution_name:
      "Azienda Pubblica di Servizi alla Persona Montedomini - Sant'Ambrogio - Fuligno - Bigallo",
    institution_type: 'PA',
    product_id: 'prod-pagopa',
    tax_code: '800011104873',
    type: 'PT',
  },
  {
    institution_id: '0000004',
    broker_name: 'PSP4',
  },
  {
    institution_id: '0000005',
    broker_name: 'PSP5',
  },
  {
    institution_id: '0000006',
    broker_name: 'PSP65',
  },
  {
    institution_id: '0000006',
    broker_name: 'PSP6',
  },
];

export const getBrokerDelegation = (): Promise<Array<Delegation>> => new Promise((resolve) => resolve(mockedDelegatedPSP));
