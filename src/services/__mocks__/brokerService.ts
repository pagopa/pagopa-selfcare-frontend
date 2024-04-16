import { CIBrokerDelegationPage } from '../../api/generated/portal/CIBrokerDelegationPage';
import { CIBrokerDelegationResource } from '../../api/generated/portal/CIBrokerDelegationResource';
import { CIBrokerStationPage } from '../../api/generated/portal/CIBrokerStationPage';
import { CIBrokerStationResource } from '../../api/generated/portal/CIBrokerStationResource';

export const mockedCIDelegations: Array<CIBrokerDelegationResource> = [
  {
    broker_id: 'brokerId1',
    broker_name: 'brokerName1',
    cbill_code: 'cbillCode1',
    id: 'id1',
    institution_id: 'institutionId1',
    institution_name: 'institutionName1',
    institution_station_count: 0,
    institution_tax_code: 'institutionTaxCode1',
    institution_type: 'institutionType1',
    is_institution_signed_in: true,
  },
  {
    broker_id: 'brokerId2',
    broker_name: 'brokerName2',
    cbill_code: 'cbillCode2',
    id: 'id2',
    institution_id: 'institutionId2',
    institution_name: 'institutionName2',
    institution_station_count: 1,
    institution_tax_code: 'institutionTaxCode2',
    institution_type: 'institutionType2',
    is_institution_signed_in: true,
  },
  {
    broker_id: 'brokerId3',
    broker_name: 'brokerName3',
    cbill_code: undefined,
    id: 'id3',
    institution_id: 'institutionId3',
    institution_name: 'institutionName3',
    institution_station_count: 2,
    institution_tax_code: 'institutionTaxCode3',
    institution_type: 'institutionType3',
    is_institution_signed_in: false,
  },
];

export const mockedInstitutionStation: Array<CIBrokerStationResource> = [
  {
    activation_date:  new Date("2024-02-29T17:05:35.740Z"),
    application_code: undefined,
    aux_digit: undefined,
    broker_tax_code: "97735020584",
    creditor_institution_tax_code: "87735020533",
    last_modified_date:  new Date("2024-02-29T17:05:35.740Z"),
    segregation_code: 45,
    station_code: "97735020584_02",
    station_enabled: true
  },
  {
    activation_date:  new Date("2024-02-29T17:05:35.740Z"),
    application_code: 3,
    aux_digit: undefined,
    broker_tax_code: "97735020584",
    creditor_institution_tax_code: "87735020533",
    last_modified_date:  new Date("2024-02-29T17:05:35.740Z"),
    segregation_code: 15,
    station_code: "97735020584_03",
    station_enabled: true
  },
];

export const getCIBrokerDelegationMock = (): Promise<CIBrokerDelegationPage> =>
  Promise.resolve({
    ci_broker_delegations: mockedCIDelegations,
    page_info: {
      page: 0,
      limit: 5,
      itemsFound: mockedCIDelegations.length,
      totalPages: 1,
      totalItems: mockedCIDelegations.length,
    },
  });

export const getCIBrokerStationsMock = (): Promise<CIBrokerStationPage> =>
  Promise.resolve({
    ci_broker_stations: mockedInstitutionStation,
    page_info: {
      page: 0,
      limit: 5,
      itemsFound: mockedInstitutionStation.length,
      totalPages: 1,
      totalItems: mockedInstitutionStation.length,
    },
  });
