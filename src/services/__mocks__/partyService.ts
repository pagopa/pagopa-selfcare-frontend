import { Party } from '../../model/Party';
import { PartyDetail } from '../../model/PartyDetail';

export const pspAdminUnsigned: Party = {
  partyId: '26a0aabf-ce6a-4dfa-af4e-d4f744a8b945',
  externalId: '14847241009',
  originId: 'PSP_14847241009',
  origin: 'SELC',
  description: 'PSP Admin unsigned',
  fiscalCode: '14847241009',
  digitalAddress: 'pspspa@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'VIA DEI PSP 20, ROMA',
  roles: [
    {
      partyRole: 'DELEGATE',
      roleKey: 'admin', // TODO use real product role
    },
  ],
  urlLogo: 'http://checkout.selfcare/institutions/26a0aabf-ce6a-4dfa-af4e-d4f744a8b945/logo.png',
  institutionType: 'PSP',
  pspData: {
    businessRegisterNumber: '00000000000',
    legalRegisterName: 'ISTITUTI DI PAGAMENTO',
    legalRegisterNumber: '09879',
    abiCode: '36043',
    vatNumberGroup: false,
  },
};

export const pspOperatorUnsigned: Party = {
  partyId: '26a0aabf-ce6a-4dfa-af4e-d4f744a8b946',
  externalId: '14847241010',
  originId: 'PSP_14847241010',
  origin: 'SELC',
  description: 'PSP Operator unsigned',
  fiscalCode: '14847241010',
  digitalAddress: 'pspspa@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'VIA DEI PSP 21, ROMA',
  roles: [
    {
      partyRole: 'OPERATOR',
      roleKey: 'operator', // TODO use real product role
    },
  ],
  urlLogo: 'http://checkout.selfcare/institutions/26a0aabf-ce6a-4dfa-af4e-d4f744a8b946/logo.png',
  institutionType: 'PSP',
  pspData: {
    businessRegisterNumber: '00000000001',
    legalRegisterName: 'ISTITUTI DI PAGAMENTO',
    legalRegisterNumber: '09880',
    abiCode: '36044',
    vatNumberGroup: false,
  },
};

export const ecOperatorUnsigned: Party = {
  partyId: '6b82300e-4fad-459d-a75b-91b5e7ae4f05',
  externalId: '1122334456',
  originId: 'c_g922',
  origin: 'IPA',
  institutionType: 'PA',
  description: 'EC unsigned',
  fiscalCode: '1122334456',
  digitalAddress: 'email-ec@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'Via degli Enti Creditori 1',
  roles: [
    {
      partyRole: 'OPERATOR',
      roleKey: 'operator', // TODO use real product role
    },
  ],
  urlLogo: 'http://checkout.selfcare/institutions/6b82300e-4fad-459d-a75b-91b5e7ae4f05/logo.png',
  pspData: undefined,
};

export const pspOperatorSigned: Party = {
  partyId: '26a0aabf-ce6a-4dfa-af4e-d4f744a8b944',
  externalId: '14847241008',
  originId: 'PSP_14847241008',
  origin: 'SELC',
  description: 'PSP S.p.A.',
  fiscalCode: '14847241008',
  digitalAddress: 'pspspa@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'VIA DEI PSP 20, ROMA',
  roles: [
    {
      partyRole: 'OPERATOR',
      roleKey: 'operator', // TODO use real product role
    },
  ],
  urlLogo: 'http://checkout.selfcare/institutions/26a0aabf-ce6a-4dfa-af4e-d4f744a8b944/logo.png',
  institutionType: 'PSP',
  pspData: {
    businessRegisterNumber: '00000000000',
    legalRegisterName: 'ISTITUTI DI PAGAMENTO',
    legalRegisterNumber: '09878',
    abiCode: '36042',
    vatNumberGroup: false,
  },
};

export const ecAdminSigned: Party = {
  partyId: '6b82300e-4fad-459d-a75b-91b5e7ae4f04',
  externalId: '1122334455',
  originId: 'c_g922',
  origin: 'IPA',
  institutionType: 'PA',
  description: 'Ente Creditore S.r.l.',
  fiscalCode: '1122334455',
  digitalAddress: 'email-ec@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'Via degli Enti Creditori 1',
  roles: [
    {
      partyRole: 'DELEGATE',
      roleKey: 'admin', // TODO use real product role
    },
  ],
  urlLogo: 'http://checkout.selfcare/institutions/6b82300e-4fad-459d-a75b-91b5e7ae4f04/logo.png',
  pspData: undefined,
};

export const mockedParties: Array<Party> = [
  pspOperatorSigned,
  ecAdminSigned,
  pspAdminUnsigned,
  pspOperatorUnsigned,
  ecOperatorUnsigned,
];

export const mockedPartyDetail: PartyDetail = {
  partyId: '7784b9d3-e834-4342-a6ef-d0566b058af2',
  externalId: '00441340122',
  originId: 'c_l682',
  origin: 'IPA',
  institutionType: 'PA',
  description: 'Comune di Varese',
  fiscalCode: '00441340122',
  digitalAddress: 'protocollo@comune.varese.legalmail.it',
  address: 'Piazza della Scala, 2 - 20121 Milano',
  zipCode: '000123',
};

export const verifyFetchPartiesMockExecution = (parties: Array<Party>) => {
  expect(parties).toStrictEqual(mockedParties);
};

export const fetchParties = () => new Promise((resolve) => resolve(mockedParties));

export const verifyFetchPartyDetailsMockExecution = (party: Party) => {
  expect(party).toStrictEqual(mockedParties.filter((p) => p.partyId === party.partyId)[0]);
};

export const fetchPartyDetails = (
  partyId: string,
  _parties?: Array<Party>
): Promise<Party | null> =>
  new Promise((resolve) => resolve(mockedParties.find((p) => p.partyId === partyId) ?? null));
