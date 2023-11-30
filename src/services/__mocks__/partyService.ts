import { Party } from '../../model/Party';
import { PartyDetail } from '../../model/PartyDetail';

export const pspAdminSignedDirect: Party = {
  partyId: 'c05d6e41-943a-4c73-bfd8-bd79472853e8',
  externalId: 'pspAdminSigned',
  originId: 'PSP_pspAdminSigned',
  origin: 'SELC',
  description: 'PSP Admin Signed Direct',
  fiscalCode: 'pspAdminSigned_DIRECT',
  digitalAddress: 'pspAdminSigned@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'VIA DEI pspAdminSigned 20, ROMA',
  roles: [
    {
      partyRole: 'DELEGATE',
      roleKey: 'admin', // TODO use real product role
    },
  ],
  urlLogo: 'https://checkout.selfcare/institutions/26a0aabf-ce6a-4dfa-af4e-d4f744a8b944/logo.png',
  institutionType: 'PSP',
  pspData: {
    business_register_number: '00000000000',
    legal_register_name: 'ISTITUTI DI PAGAMENTO',
    legal_register_number: '09879',
    abi_code: 'pspAdminSigned_DIRECT',
    vat_number_group: false,
  },
};

export const pspAdminSignedUndirect: Party = {
  partyId: 'pspAdminSignedUndirect',
  externalId: 'pspAdminSignedUndirect',
  originId: 'PSP_pspAdminSignedUndirect',
  origin: 'SELC',
  description: 'PSP Admin Signed Undirect',
  fiscalCode: 'pspAdminSigned_UNDIRECT',
  digitalAddress: 'pspAdminSignedUndirectInstitution@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'VIA DEI pspAdminSigned  Undirect 20, ROMA',
  roles: [
    {
      partyRole: 'DELEGATE',
      roleKey: 'admin', // TODO use real product role
    },
  ],
  urlLogo: 'https://checkout.selfcare/institutions/pspAdminSignedUndirect/logo.png',
  institutionType: 'PSP',
  pspData: {
    business_register_number: '00000000001',
    legal_register_name: 'ISTITUTO DI PAGAMENTO',
    legal_register_number: '09880',
    abi_code: 'pspAdminSigned_UNDIRECT',
    vat_number_group: true,
  },
};

export const pspAdminUnsigned: Party = {
  partyId: 'pspAdminUnsigned',
  externalId: '14847241009',
  originId: 'PSP_14847241009',
  origin: 'SELC',
  description: 'PSP Admin unsigned',
  fiscalCode: 'pspAdmin_UNSIGNED',
  digitalAddress: 'pspspa@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'VIA DEI PSP 20, ROMA',
  roles: [
    {
      partyRole: 'DELEGATE',
      roleKey: 'admin', // TODO use real product role
    },
  ],
  urlLogo: 'https://checkout.selfcare/institutions/pspAdminUnsigned/logo.png',
  institutionType: 'PSP',
  pspData: {
    business_register_number: '00000000000',
    legal_register_name: 'ISTITUTI DI PAGAMENTO',
    legal_register_number: '09879',
    abi_code: 'pspAdmin_UNSIGNED',
    vat_number_group: false,
  },
};

export const pspOperatorSignedDirect: Party = {
  partyId: 'pspOperatorSigned',
  externalId: '14847241008',
  originId: 'PSP_14847241008',
  origin: 'SELC',
  description: 'PSP Operator Signed Direct',
  fiscalCode: 'pspOperatorSigned_DIRECT',
  digitalAddress: 'pspspa@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'VIA DEI PSP 20, ROMA',
  roles: [
    {
      partyRole: 'OPERATOR',
      roleKey: 'operator', // TODO use real product role
    },
  ],
  urlLogo: 'https://checkout.selfcare/institutions/pspOperatorSigned/logo.png',
  institutionType: 'PSP',
  pspData: {
    business_register_number: '00000000000',
    legal_register_name: 'ISTITUTI DI PAGAMENTO',
    legal_register_number: '09878',
    abi_code: 'pspOperatorSigned_DIRECT',
    vat_number_group: false,
  },
};

export const pspOperatorSignedUndirect: Party = {
  partyId: 'pspOperatorSignedUndirect',
  externalId: '14847241008',
  originId: 'PSP_14847241008',
  origin: 'SELC',
  description: 'PSP Operator Signed Undirect',
  fiscalCode: 'pspOperatorSigned_UNDIRECT',
  digitalAddress: 'pspspa@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'VIA DEI PSP 20, ROMA',
  roles: [
    {
      partyRole: 'OPERATOR',
      roleKey: 'operator', // TODO use real product role
    },
  ],
  urlLogo: 'https://checkout.selfcare/institutions/pspOperatorSignedUndirect/logo.png',
  institutionType: 'PSP',
  pspData: {
    business_register_number: '00000000000',
    legal_register_name: 'ISTITUTI DI PAGAMENTO',
    legal_register_number: '09878',
    abi_code: 'pspOperatorSigned_UNDIRECT',
    vat_number_group: false,
  },
};

export const pspOperatorUnsigned: Party = {
  partyId: 'pspOperatorUnsigned',
  externalId: '14847241010',
  originId: 'PSP_14847241010',
  origin: 'SELC',
  description: 'PSP Operator unsigned',
  fiscalCode: 'pspOperator_UNSIGNED',
  digitalAddress: 'pspspa@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'VIA DEI PSP 21, ROMA',
  roles: [
    {
      partyRole: 'OPERATOR',
      roleKey: 'operator', // TODO use real product role
    },
  ],
  urlLogo: 'https://checkout.selfcare/institutions/pspOperatorUnsigned/logo.png',
  institutionType: 'PSP',
  pspData: {
    business_register_number: '00000000001',
    legal_register_name: 'ISTITUTI DI PAGAMENTO',
    legal_register_number: '09880',
    abi_code: 'pspOperator_UNSIGNED',
    vat_number_group: false,
  },
};

export const ecAdminSignedDirect: Party = {
  partyId: 'e162ca3b-fe5a-4bfd-a0b7-1ca1586d079e',
  externalId: '1122334455',
  originId: 'c_g922',
  origin: 'IPA',
  institutionType: 'PA',
  description: 'EC Admin Signed Direct',
  fiscalCode: '00104330493',
  digitalAddress: 'email-ec@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'Via degli Enti Creditori 1',
  roles: [
    {
      partyRole: 'DELEGATE',
      roleKey: 'admin', // TODO use real product role
    },
  ],
  urlLogo: 'https://checkout.selfcare/institutions/ecAdminSignedDirect/logo.png',
  pspData: undefined,
};

export const ecAdminSignedUndirect: Party = {
  partyId: 'ecAdminSignedUndirect',
  externalId: '1122334455',
  originId: 'c_g922',
  origin: 'IPA',
  institutionType: 'PA',
  description: 'EC Admin Signed Undirect',
  fiscalCode: 'ecAdminSigned_UNDIRECT',
  digitalAddress: 'email-ec@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'Via degli Enti Creditori 1',
  roles: [
    {
      partyRole: 'DELEGATE',
      roleKey: 'admin', // TODO use real product role
    },
  ],
  urlLogo: 'https://checkout.selfcare/institutions/ecAdminSignedUndirect/logo.png',
  pspData: undefined,
};

export const ecAdminUnsigned: Party = {
  partyId: 'ecAdminUnsigned',
  externalId: '1122334455',
  originId: 'c_g922',
  origin: 'IPA',
  institutionType: 'PA',
  description: 'EC Admin Unsigned',
  fiscalCode: 'ecAdminUnsigned',
  digitalAddress: 'email-ec@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'Via degli Enti Creditori 1',
  roles: [
    {
      partyRole: 'DELEGATE',
      roleKey: 'admin', // TODO use real product role
    },
  ],
  urlLogo: 'https://checkout.selfcare/institutions/ecAdminUnsigned/logo.png',
  pspData: undefined,
};

export const ecOperatorSignedDirect: Party = {
  partyId: 'ecOperatorSigned',
  externalId: '1122334456',
  originId: 'c_g922',
  origin: 'IPA',
  institutionType: 'PA',
  description: 'EC OP Signed Direct',
  fiscalCode: 'ecOperatorSigned_DIRECT',
  digitalAddress: 'email-ec@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'Via degli Enti Creditori 1',
  roles: [
    {
      partyRole: 'OPERATOR',
      roleKey: 'operator', // TODO use real product role
    },
  ],
  urlLogo: 'https://checkout.selfcare/institutions/ecOperatorSigned/logo.png',
  pspData: undefined,
};

export const ecOperatorSignedUndirect: Party = {
  partyId: 'ecOperatorSignedUndirect',
  externalId: '1122334456',
  originId: 'c_g922',
  origin: 'IPA',
  institutionType: 'PA',
  description: 'EC OP Signed Undirect',
  fiscalCode: 'ecOperatorSigned_UNDIRECT',
  digitalAddress: 'email-ec@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'Via degli Enti Creditori 1',
  roles: [
    {
      partyRole: 'OPERATOR',
      roleKey: 'operator', // TODO use real product role
    },
  ],
  urlLogo: 'https://checkout.selfcare/institutions/ecOperatorSignedUndirect/logo.png',
  pspData: undefined,
};

export const ecOperatorUnsigned: Party = {
  partyId: 'ecOperatorUnsigned',
  externalId: '1122334456',
  originId: 'c_g922',
  origin: 'IPA',
  institutionType: 'PA',
  description: 'EC OP unsigned',
  fiscalCode: 'ecOperatorUnsigned',
  digitalAddress: 'email-ec@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'Via degli Enti Creditori 1',
  roles: [
    {
      partyRole: 'OPERATOR',
      roleKey: 'operator', // TODO use real product role
    },
  ],
  urlLogo: 'https://checkout.selfcare/institutions/ecOperatorUnsigned/logo.png',
  pspData: undefined,
};

export const PTUnsigned: Party = {
  partyId: 'PTUnsigned',
  externalId: '1122334456',
  originId: 'c_g922',
  origin: 'IPA',
  institutionType: 'PT',
  description: 'PT unsigned',
  fiscalCode: 'PTUnsigned',
  digitalAddress: 'email-ec@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'Via degli Enti Creditori 1',
  roles: [
    {
      partyRole: 'OPERATOR',
      roleKey: 'operator', // TODO use real product role
    },
  ],
  urlLogo: 'https://checkout.selfcare/institutions/PTUnsigned/logo.png',
  pspData: undefined,
};

export const PTPSPSigned: Party = {
  partyId: 'PTPSPSigned',
  externalId: '1122334456',
  originId: 'c_g922',
  origin: 'IPA',
  institutionType: 'PT',
  description: 'PT PSP Signed',
  fiscalCode: 'PT_PSP_SIGNED_DIRECT',
  digitalAddress: 'email-ec@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'Via degli Enti Creditori 1',
  roles: [
    {
      partyRole: 'OPERATOR',
      roleKey: 'operator', // TODO use real product role
    },
  ],
  urlLogo: 'https://checkout.selfcare/institutions/PTPSPSigned/logo.png',
  pspData: undefined,
};

export const PTECSigned: Party = {
  partyId: 'PTECSigned',
  externalId: '1122334456',
  originId: 'c_g922',
  origin: 'IPA',
  institutionType: 'PT',
  description: 'PT EC Signed',
  fiscalCode: 'PT_EC_SIGNED_DIRECT',
  digitalAddress: 'email-ec@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'Via degli Enti Creditori 1',
  roles: [
    {
      partyRole: 'OPERATOR',
      roleKey: 'operator', // TODO use real product role
    },
  ],
  urlLogo: 'https://checkout.selfcare/institutions/PTECSigned/logo.png',
  pspData: undefined,
};

export const PTECPSPSigned: Party = {
  partyId: 'PTECPSPSigned',
  externalId: '1122334456',
  originId: 'c_g922',
  origin: 'IPA',
  institutionType: 'PT',
  description: 'PT ECPSP Signed',
  fiscalCode: 'PT_EC_PSP_SIGNED_DIRECT',
  digitalAddress: 'email-ec@test.dummy',
  status: 'ACTIVE',
  registeredOffice: 'Via degli Enti Creditori 1',
  roles: [
    {
      partyRole: 'OPERATOR',
      roleKey: 'operator', // TODO use real product role
    },
  ],
  urlLogo: 'https://checkout.selfcare/institutions/PTECPSPSigned/logo.png',
  pspData: undefined,
};

export const mockedParties: Array<Party> = [
  pspAdminSignedDirect,
  pspAdminSignedUndirect,
  pspAdminUnsigned,
  pspOperatorSignedDirect,
  pspOperatorSignedUndirect,
  pspOperatorUnsigned,
  ecAdminSignedDirect,
  ecAdminSignedUndirect,
  ecAdminUnsigned,
  ecOperatorSignedDirect,
  ecOperatorSignedUndirect,
  ecOperatorUnsigned,
  PTUnsigned,
  PTPSPSigned,
  PTECSigned,
  PTECPSPSigned,
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
