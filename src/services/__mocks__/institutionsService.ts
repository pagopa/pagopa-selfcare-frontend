import { StatusEnum } from '../../api/generated/portal/WrapperChannelDetailsDto';
import { TypeEnum, WrapperEntities } from '../../api/generated/portal/WrapperEntities';
import { Delegation } from '../../api/generated/portal/Delegation';
import { mockedPaymentTypes } from './configurationService';
import { mockedDelegatedPSP } from './channelService';


export const channelWrapperMockedGet = (code: string): WrapperEntities => ({
  brokerCode: 'string',
  createdAt: new Date(),
  createdBy: 'PSP S.p.A',
  id: 'string',
  modifiedAt: new Date(),
  modifiedBy: 'string',
  modifiedByOpt: 'string',
  note: 'string',
  status: StatusEnum.APPROVED,
  type: TypeEnum.CHANNEL,
  entities: [
    {
      createdAt: new Date(),
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
      modifiedAt: new Date(),
      modifiedBy: 'string',
      modifiedByOpt: 'Operatore PSP',
      note: 'string',
      status: StatusEnum.TO_CHECK,
      type: TypeEnum.CHANNEL,
    },
  ],
});

export const getBrokerDelegation = (): Promise<Array<Delegation>> => new Promise((resolve) => resolve(mockedDelegatedPSP));
