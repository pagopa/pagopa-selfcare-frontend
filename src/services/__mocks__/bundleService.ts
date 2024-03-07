import { BundleResource } from '../../api/generated/portal/BundleResource';
import { BundleCreateResponse } from '../../api/generated/portal/BundleCreateResponse';
import { BundleRequest, TypeEnum } from '../../api/generated/portal/BundleRequest';
import { BundlesResource } from '../../api/generated/portal/BundlesResource';
import { Touchpoints } from '../../api/generated/portal/Touchpoints';
import { mockedChannelsMerged } from './channelService';
import { mockedPaymentTypes } from './configurationService';

export const mockedTouchpoints: Touchpoints = {
  touchpoints: [
    { created_date: new Date(), id: 'tutti', name: 'Tutti' },
    { created_date: new Date(), id: 'appio', name: 'App IO' },
    { created_date: new Date(), id: 'checkout', name: 'Checkout' },
  ],
};

const baseCommissionBundlePspDetail: BundleResource = {
  idBundle: 'idBundle',
  digitalStamp: false,
  digitalStampRestriction: true,
  idChannel: 'idChannel',
  idBrokerPsp: 'idBrokerPsp',
  name: 'Commission Bundle Name',
  description: 'Commission bundle description',
  paymentAmount: 55.56,
  minPaymentAmount: 40,
  maxPaymentAmount: 150.1,
  paymentType: 'MYBK',
  touchpoint: 'PSP',
  transferCategoryList: [
        {
          "ci_type_code": "07",
          "ci_type": "PUBBLICHE AMMINISTRAZIONI CENTRALI",
          "macro_area_ci_progressive": "05",
          "macro_area_name": "MINISTERO DEGLI ESTERI",
          "macro_area_description": "Entrate a supporto del settore esteri",
          "service_type_code": "103",
          "service_type": "Carta di Identità Elettronica",
          "legal_reason_collection": "TS",
          "service_type_description": "costo per il rilascio della CIE",
          "taxonomy_version": "36",
          "specific_built_in_data": "9/0705103TS/",
          "start_date": "2021-02-01T00:00:00Z",
          "end_date": "2080-01-01T23:59:59Z"
        },
        {
          "ci_type_code": "07",
          "ci_type": "PUBBLICHE AMMINISTRAZIONI CENTRALI",
          "macro_area_ci_progressive": "05",
          "macro_area_name": "MINISTERO DEGLI ESTERI",
          "macro_area_description": "Entrate a supporto del settore esteri",
          "service_type_code": "102",
          "service_type": "Documento di viaggio provvisorio",
          "legal_reason_collection": "TS",
          "service_type_description": "costo per il rilascio del documento di viaggio provvisorio",
          "taxonomy_version": "36",
          "specific_built_in_data": "9/0705102TS/",
          "start_date": "2021-02-01T00:00:00Z",
          "end_date": "2080-01-01T23:59:59Z"
        },
        {
          "ci_type_code": "07",
          "ci_type": "PUBBLICHE AMMINISTRAZIONI CENTRALI",
          "macro_area_ci_progressive": "12",
          "macro_area_name": "MINISTERO DELLO SVULUPPO ECONOMICO",
          "macro_area_description": "Entrate a supporto del settore politica industriale, di commercio e di comunicazioni.",
          "service_type_code": "103",
          "service_type": "Autorizzazioni satellitari",
          "legal_reason_collection": "SP",
          "service_type_description": "Autorizzazioni  per collegamenti satellitari",
          "taxonomy_version": "36",
          "specific_built_in_data": "9/0712103SP/",
          "start_date": "2021-06-01T00:00:00Z",
          "end_date": "2080-01-01T23:59:59Z"
        },
        {
          "ci_type_code": "10",
          "ci_type": "AUTORITA' AMMINISTRATIVE INDIPENDENTI",
          "macro_area_ci_progressive": "01",
          "macro_area_name": "AUTORITA' NAZIONALE ANTICORRUZIONE (ANAC)",
          "macro_area_description": "Contratti pubblici Anticorruzione e Trasparenza",
          "service_type_code": "100",
          "service_type": "Contribuzione gara OE",
          "legal_reason_collection": "TS",
          "service_type_description": "Contributo da versare da parte di operatore economico (OE) che intende partecipare a procedure di scelta del contraente per l'affidamento di lavori, servizi e forniture",
          "taxonomy_version": "36",
          "specific_built_in_data": "9/1001100TS/",
          "start_date": "2021-03-01T00:00:00Z",
          "end_date": "2080-01-01T23:59:59Z"
        },
        {
          "ci_type_code": "12",
          "ci_type": "AGENZIE FISCALI",
          "macro_area_ci_progressive": "01",
          "macro_area_name": "AGENZIA DELLE ENTRATE (AdE)",
          "macro_area_description": "Agenzia fiscale della Pubblica Amministrazione Italiana, dipendente dal Ministero dell'Economia e delle Finanze, che svolge le funzioni relative ad accertamenti e controlli fiscali e alla gestione dei tributi",
          "service_type_code": "106",
          "service_type": "Registrazione Atti",
          "legal_reason_collection": "IM",
          "service_type_description": "Spese per registrazione atti",
          "taxonomy_version": "36",
          "specific_built_in_data": "9/1201106IM/",
          "start_date": "2022-01-01T00:00:00Z",
          "end_date": "2080-01-01T23:59:59Z"
        },
        {
          "ci_type_code": "07",
          "ci_type": "PUBBLICHE AMMINISTRAZIONI CENTRALI",
          "macro_area_ci_progressive": "02",
          "macro_area_name": "MINISTERO DELLA GIUSTIZIA",
          "macro_area_description": "Entrate a supporto del settore giustizia",
          "service_type_code": "155",
          "service_type": "CONTRIBUTO DI SEGRETERIA TENUTA ALBO DEGLI AMMINISTRATORI GIUDIZIARI",
          "legal_reason_collection": "TS",
          "service_type_description": "CONTRIBUTO DI SEGRETERIA TENUTA ALBO DEGLI AMMINISTRATORI GIUDIZIARI",
          "taxonomy_version": "36",
          "specific_built_in_data": "9/0702155TS/",
          "start_date": "2024-02-01T00:00:00Z",
          "end_date": "2080-01-01T23:59:59Z"
        }
  ],
  validityDateFrom: new Date('2024-02-17'),
  validityDateTo: new Date('2024-02-22'),
  insertedDate: new Date('2024-02-15T09:36:04.792731104'),
  lastUpdatedDate: new Date('2024-02-17T09:36:04.792731104'),
};

export const mockedBundleRequest: BundleRequest = {};

export const mockedCommissionBundlePspDetailGlobal: BundleResource = {
  ...baseCommissionBundlePspDetail,
  type: TypeEnum.GLOBAL,
};

export const mockedCommissionBundlePspDetailPrivate: BundleResource = {
  ...baseCommissionBundlePspDetail,
  type: TypeEnum.PRIVATE,
};

export const mockedCommissionBundlePspDetailPublic: BundleResource = {
  ...baseCommissionBundlePspDetail,
  type: TypeEnum.PUBLIC,
};

export const mockedCommissionBundlePspList: BundlesResource = {
  bundles: [mockedCommissionBundlePspDetailGlobal],
  pageInfo: {
    items_found: 1,
    limit: 10,
    page: 0,
    total_pages: 1,
  },
};

export const mockedChannelsIdList: Array<string> = mockedChannelsMerged!.channels!.map((e) =>
  typeof e.channel_code !== 'undefined' ? e.channel_code : ''
);

export const getChannelsId = (_page: number, _brokerCode: string): Promise<Array<string>> =>
  Promise.resolve(mockedChannelsIdList);

export const getCommissionBundlePsp = (_brokerCode: string): Promise<BundlesResource> =>
  Promise.resolve(mockedCommissionBundlePspList);

export const getCommissionBundleDetails = (type?: string): Promise<BundleResource> =>
  Promise.resolve(
    !type || type === TypeEnum.GLOBAL
      ? mockedCommissionBundlePspDetailGlobal
      : type === TypeEnum.PRIVATE
      ? mockedCommissionBundlePspDetailPrivate
      : mockedCommissionBundlePspDetailPublic
  );

export const mockedBundleCreateResponse = { idBundle: 'mockedCommissionBundleId' };
export const createCommissionBundle = (_body: BundleRequest): Promise<BundleCreateResponse> =>
  Promise.resolve(mockedBundleCreateResponse);

export const updateCommissionBundle = (
  _name: string,
  _commissionBundle: BundleRequest
): Promise<BundleResource> => Promise.resolve(mockedCommissionBundlePspDetailGlobal);

export const getTouchpoints = (): Promise<Touchpoints> => Promise.resolve(mockedTouchpoints);

export const deletePSPBundle = (): Promise<void> =>
  new Promise((resolve) => resolve());
