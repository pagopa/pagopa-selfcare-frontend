import { Party } from '../../model/Party';

export const mockedParties: Array<Party> = [
  {
    roles: [
      {
        partyRole: 'SUB_DELEGATE',
        roleKey: 'incaricato-ente-creditore', // TODO use real product role
      },
    ],
    description: 'Comune di Bari',
    urlLogo: 'image',
    status: 'ACTIVE',
    partyId: '1',
    digitalAddress: 'comune.bari@pec.it',
    fiscalCode: 'fiscalCodeBari',
    category: 'Comuni e loro Consorzi e Associazioni',
    registeredOffice: 'Piazza della Scala, 2 - 20121 Milano',
    typology: 'Pubblica Amministrazione',
    externalId: 'externalId1',
    originId: 'originId1',
    origin: 'IPA',
    institutionType: 'PA',
  },
  // useCase for PENDING party
  {
    roles: [
      {
        partyRole: 'DELEGATE',
        roleKey: 'incaricato-ente-creditore', // TODO use real product role
      },
    ],
    description: 'Comune di Milano',
    urlLogo: 'image',
    status: 'PENDING',
    partyId: '2',
    digitalAddress: 'comune.milano@pec.it',
    fiscalCode: 'fiscalCodeMilano',
    category: 'Comuni e loro Consorzi e Associazioni',
    registeredOffice: 'Piazza della Scala, 2 - 20121 Milano',
    typology: 'Pubblica Amministrazione',
    externalId: 'externalId2',
    originId: 'originId2',
    origin: 'IPA',
    institutionType: 'PA',
  },
  {
    roles: [
      {
        partyRole: 'SUB_DELEGATE',
        roleKey: 'incaricato-ente-creditore', // TODO use real product role
      },
    ],
    description: 'Comune di Roma',
    urlLogo: 'image',
    status: 'ACTIVE',
    partyId: '3',
    digitalAddress: 'comune.roma@pec.it',
    fiscalCode: 'fiscalCodeRoma',
    category: 'Comuni e loro Consorzi e Associazioni',
    registeredOffice: 'Piazza della Scala, 2 - 20121 Milano',
    typology: 'Pubblica Amministrazione',
    externalId: 'externalId3',
    originId: 'originId3',
    origin: 'IPA',
    institutionType: 'PA',
  },
  {
    roles: [
      {
        partyRole: 'OPERATOR',
        roleKey: 'referente-dei-pagamenti', // TODO use real product role
      },
    ],
    description: 'Comune di Napoli',
    urlLogo: 'image',
    status: 'ACTIVE',
    partyId: '4',
    digitalAddress: 'comune.napoli@pec.it',
    fiscalCode: 'fiscalCodeNapoli',
    category: 'Comuni e loro Consorzi e Associazioni',
    registeredOffice: 'Piazza della Scala, 2 - 20121 Milano',
    typology: 'Pubblica Amministrazione',
    externalId: 'externalId4',
    originId: 'originId4',
    origin: 'IPA',
    institutionType: 'PA',
  },
  // useCase of testToken
  {
    // if change these roles, change them also in testToken
    roles: [
      {
        partyRole: 'MANAGER',
        roleKey: 'referente-legale', // TODO use real product role
      },
    ],
    description: 'AGENCY ONBOARDED',
    urlLogo: 'https://selcdcheckoutsa.z6.web.core.windows.net/institutions/onboarded/logo.png',
    status: 'ACTIVE',
    partyId: 'onboarded',
    digitalAddress: 'comune.onboarded@pec.it',
    fiscalCode: 'fiscalCodeONBOARDED',
    category: 'Comuni e loro Consorzi e Associazioni',
    registeredOffice: 'Piazza della Scala, 2 - 20121 Milano',
    typology: 'Pubblica Amministrazione',
    externalId: 'externalId5',
    originId: 'originId5',
    origin: 'MOCK',
    institutionType: 'GSP',
  },
  {
    roles: [
      {
        partyRole: 'SUB_DELEGATE',
        roleKey: 'incaricato-ente-creditore', // TODO use real product role
      },
    ],
    description: `Commissario straordinario per la realizzazione di
    approdi temporanei e di interventi complementari per la
    salvaguardia di Venezia e della sua laguna e ulteriori
    interventi per la salvaguardia della laguna di Venezia`,
    urlLogo: 'image',
    status: 'ACTIVE',
    partyId: '5',
    digitalAddress: 'comune.veneto@pec.it',
    fiscalCode: 'fiscalCodeVeneto',
    category: 'Comuni e loro Consorzi e Associazioni',
    registeredOffice: 'Piazza della Scala, 2 - 20121 Milano',
    typology: 'Pubblica Amministrazione',
    externalId: 'externalId1',
    originId: 'originId1',
    origin: 'IPA',
    institutionType: 'GSP',
  },
  // Usable when not mocking the BE
  {
    partyId: 'f572bb09-b689-4785-8ea8-4c7a8b081998',
    externalId: '00856930102',
    originId: 'c_d969',
    origin: 'IPA',
    institutionType: 'PA',
    description: 'Comune di Genova',
    category: 'Comuni e loro Consorzi e Associazioni',
    fiscalCode: '00856930102',
    roles: [
      {
        partyRole: 'SUB_DELEGATE',
        roleKey: 'incaricato-ente-creditore', // TODO use real product role
      },
    ],
    status: 'ACTIVE',
    digitalAddress: 'comunegenova@postemailcertificata.it',
    urlLogo:
      'https://selcdcheckoutsa.z6.web.core.windows.net/institutions/f572bb09-b689-4785-8ea8-4c7a8b081998/logo.png',
    registeredOffice: 'Piazza della Scala, 2 - 20121 Milano',
    typology: 'Pubblica Amministrazione',
  },
  // Usable when not mocking the BE
  {
    partyId: '7784b9d3-e834-4342-a6ef-d0566b058af2',
    externalId: '00441340122',
    originId: 'c_l682',
    origin: 'IPA',
    institutionType: 'PA',
    description: 'Comune di Varese',
    category: 'Comuni e loro Consorzi e Associazioni',
    fiscalCode: '00441340122',
    roles: [
      {
        partyRole: 'SUB_DELEGATE',
        roleKey: 'incaricato-ente-creditore', // TODO use real product role
      },
    ],
    status: 'ACTIVE',
    digitalAddress: 'protocollo@comune.varese.legalmail.it',
    urlLogo:
      'https://selcdcheckoutsa.z6.web.core.windows.net/institutions/7784b9d3-e834-4342-a6ef-d0566b058af2/logo.png',
    registeredOffice: 'Piazza della Scala, 2 - 20121 Milano',
    typology: 'Pubblica Amministrazione',
  },
];

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
