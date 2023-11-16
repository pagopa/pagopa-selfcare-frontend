import { ChannelOnCreation } from '../../model/Channel';
import {
  mockedPaymentTypes,
  mockedPSPChannels,
  mockedChannelDetail,
} from '../../services/__mocks__/channelService';
import { mockedStations } from '../../services/__mocks__/stationService';
import { mockedInstitutions } from '../../services/__tests__/partyService.test';
import { ChannelDetailsResource } from '../generated/portal/ChannelDetailsResource';
import {
  InstitutionDetailResource,
  InstitutionTypeEnum,
} from '../generated/portal/InstitutionDetailResource';
import { InstitutionResource } from '../generated/portal/InstitutionResource';
import { PaymentTypesResource } from '../generated/portal/PaymentTypesResource';

import { ProductsResource } from '../generated/portal/ProductsResource';
import { PspChannelPaymentTypes } from '../generated/portal/PspChannelPaymentTypes';
import { PspChannelPaymentTypesResource } from '../generated/portal/PspChannelPaymentTypesResource';
import { StationsResource } from '../generated/portal/StationsResource';

export const mockedInstitutionDetailResource: InstitutionDetailResource = {
  id: '26a0aabf-ce6a-4dfa-af4e-d4f744a8b944',
  externalId: '14847241008',
  originId: 'PSP_14847241008',
  description: 'PSP S.p.A.',
  digitalAddress: 'pspspa@test.dummy',
  address: 'VIA DEI PSP 20, ROMA',
  zipCode: '00161',
  taxCode: '14847241008',
  origin: 'SELC',
  institutionType: 'PSP' as InstitutionTypeEnum,
  attributes: [],
};

export const mockedProductResources: Array<ProductsResource> = [
  {
    title: 'App IO',
    description: 'App IO description',
    id: 'prod-io',
    urlBO: 'http://appio/bo#<IdentityToken>',
    urlPublic: 'http://appio/public',
  },
  {
    id: 'prod-pn',
    title: 'Piattaforma Notifiche',
    description: 'Piattaforma Notifiche description',
    urlBO: 'http://notifiche/bo?token=<IdentityToken>',
    urlPublic: 'http://notifiche/public',
  },
];

export const BackofficeApi = {
  getInstitutions: async (_productId: string): Promise<Array<InstitutionResource>> =>
    new Promise((resolve) => resolve(mockedInstitutions)),

  getInstitution: async (_institutionId: string): Promise<InstitutionDetailResource> =>
    new Promise((resolve) => resolve(mockedInstitutionDetailResource)),

  getProducts: async (): Promise<Array<ProductsResource>> =>
    new Promise((resolve) => resolve(mockedProductResources)),

  createChannel: async (_channel: ChannelOnCreation): Promise<ChannelDetailsResource> =>
    new Promise((resolve) => resolve(mockedPSPChannels)),

  associatePSPtoChannel: async (
    _channelcode: string,
    _pspcode: string,
    _payment_type: PspChannelPaymentTypes
  ): Promise<PspChannelPaymentTypesResource> =>
    new Promise((resolve) => resolve({ payment_types: ['ptype_test'] })),

  updateChannel: async (_channel: ChannelOnCreation): Promise<ChannelDetailsResource> =>
    new Promise((resolve) => resolve(mockedPSPChannels)),

  getPaymentTypes: async (): Promise<PaymentTypesResource> =>
    new Promise((resolve) => resolve(mockedPaymentTypes)),

  getChannelDetail: async (_channelcode: string): Promise<ChannelDetailsResource> =>
    new Promise((resolve) => resolve(mockedChannelDetail('12345'))),

  getStations: async (_page: number): Promise<StationsResource> =>
    new Promise((resolve) => resolve(mockedStations)),
};
