import { StationDetail } from '../../model/Station';

const mockedStationsDetail: Array<StationDetail> = [
  {
    anagraphic: {
      status: 'ACTIVE',
      stationId: '97735020584_01',
      version: 'testversion01',
      primitiveVersion: 'testPrimitiveVersion01',
      password: 'XXXXXXXXXXXXXX',
      redirectUrl: 'esempiolink1.it',
      activationDate: '23/02/2023',
    },
    target: {
      address: 'lab.link1.it',
      service: '/govpay/api/pagopa/PagamentiTelematiciCCPservice1',
      port: '80',
    },
    associatesEC: {
      associates: '0',
    },
    changes: {
      lastChangesDate: '19/02/2023',
      operatedBy: 'Nome Cognome/Matricola operatore',
    },
  },
  {
    anagraphic: {
      status: 'REVIEW',
      stationId: '97735020584_02',
      version: 'testversion02',
      primitiveVersion: 'testPrimitiveVersion02',
      password: 'XXXXXXXXXXXXXX',
      redirectUrl: 'esempiolink2.it',
      activationDate: '24/02/2023',
    },
    target: {
      address: 'lab.link2.it',
      service: '/govpay/api/pagopa/PagamentiTelematiciCCPservice2',
      port: '80',
    },
    associatesEC: {
      associates: '0',
    },
    changes: {
      lastChangesDate: '20/02/2023',
      operatedBy: 'Nome Cognome/Matricola operatore',
    },
  },
  {
    anagraphic: {
      status: 'TO_EDIT',
      stationId: '97735020584_03',
      version: 'testversion03',
      primitiveVersion: 'testPrimitiveVersion03',
      password: 'XXXXXXXXXXXXXX',
      redirectUrl: 'esempiolink3.it',
      activationDate: '25/02/2023',
    },
    target: {
      address: 'lab.link3.it',
      service: '/govpay/api/pagopa/PagamentiTelematiciCCPservice2',
      port: '80',
    },
    associatesEC: {
      associates: '0',
    },
    changes: {
      lastChangesDate: '20/03/2023',
      operatedBy: 'Nome Cognome/Matricola operatore',
    },
  },
];

export const getStationDetail = (stationId: string): Promise<StationDetail> => {
  const matchedStationByStationID = mockedStationsDetail.find(
    (s) => s.anagraphic.stationId === stationId
  );
  if (matchedStationByStationID) {
    return new Promise((resolve) => resolve(matchedStationByStationID));
  } else {
    return new Promise((resolve) => resolve(mockedStationsDetail[0]));
  }
};
