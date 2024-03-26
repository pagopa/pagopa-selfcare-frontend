import { MyCIResource } from '../../api/generated/portal/MyCIResource';

const mockedCIDelegations: Array<MyCIResource> = [
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
  },
  {
    broker_id: 'brokerId3',
    broker_name: 'brokerName3',
    cbill_code: 'cbillCode3',
    id: 'id3',
    institution_id: 'institutionId3',
    institution_name: 'institutionName3',
    institution_station_count: 2,
    institution_tax_code: 'institutionTaxCode3',
    institution_type: 'institutionType3',
  },
];

export const getCIBrokerDelegationMock = (): Promise<Array<MyCIResource>> =>
  Promise.resolve(mockedCIDelegations);
