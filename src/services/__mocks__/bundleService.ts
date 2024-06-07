import {BundleCreateResponse} from '../../api/generated/portal/BundleCreateResponse';
import {BundleRequest, TypeEnum} from '../../api/generated/portal/BundleRequest';
import {Touchpoints} from '../../api/generated/portal/Touchpoints';
import {mockedChannelsMerged} from './channelService';
import {CISubscriptionInfo} from '../../api/generated/portal/CISubscriptionInfo';
import {BundleCiSubscriptionDetailModel} from '../../model/CommissionBundle';
import {CIBundleFee} from '../../api/generated/portal/CIBundleFee';
import {PublicBundleRequest} from '../../api/generated/portal/PublicBundleRequest';
import {PSPBundleResource} from '../../api/generated/portal/PSPBundleResource';
import {PSPBundleTaxonomy} from '../../api/generated/portal/PSPBundleTaxonomy';
import {PSPBundlesResource} from '../../api/generated/portal/PSPBundlesResource';
import {TransferCategoryRelationEnum} from '../../api/generated/portal/CIBundleAttribute';
import {CIBundleResource, CiBundleStatusEnum} from '../../api/generated/portal/CIBundleResource';
import {CIBundlesResource} from '../../api/generated/portal/CIBundlesResource';
import {CIBundleSubscriptionsResource} from '../../api/generated/portal/CIBundleSubscriptionsResource';
import {CIBundleSubscriptionsDetail} from '../../api/generated/portal/CIBundleSubscriptionsDetail';

export const mockedTouchpoints: Touchpoints = {
    touchpoints: [
        {created_date: new Date(), id: 'tutti', name: 'Tutti'},
        {created_date: new Date(), id: 'appio', name: 'App IO'},
        {created_date: new Date(), id: 'checkout', name: 'Checkout'},
    ],
};

export const mockedPSPTaxonomyList: Array<PSPBundleTaxonomy> = [
    {
        macroAreaName: 'MINISTERO DEGLI ESTERI',
        serviceType: 'Carta di Identità Elettronica',
        specificBuiltInData: '9/0705103TS/',
        endDate: '2080-01-01T23:59:59Z',
        ecType: "PUBBLICHE AMMINISTRAZIONI CENTRALI"
    },
    {
        macroAreaName: 'MINISTERO DEGLI ESTERI',
        serviceType: 'Documento di viaggio provvisorio',
        specificBuiltInData: '9/0705102TS/',
        endDate: '2080-01-01T23:59:59Z',
        ecType: "PUBBLICHE AMMINISTRAZIONI CENTRALI"
    },
    {
        macroAreaName: 'MINISTERO DELLO SVULUPPO ECONOMICO',
        serviceType: 'Autorizzazioni satellitari',
        specificBuiltInData: '9/0712103SP/',
        endDate: '2080-01-01T23:59:59Z',
        ecType: "PUBBLICHE AMMINISTRAZIONI CENTRALI"
    },
    {
        macroAreaName: "AUTORITA' NAZIONALE ANTICORRUZIONE (ANAC)",
        serviceType: 'Contribuzione gara OE',
        specificBuiltInData: '9/1001100TS/',
        endDate: '2080-01-01T23:59:59Z',
        ecType: "AUTORITA' AMMINISTRATIVE INDIPENDENTI"
    },
    {
        macroAreaName: 'AGENZIA DELLE ENTRATE (AdE)',
        serviceType: 'Registrazione Atti',
        specificBuiltInData: '9/1201106IM/',
        endDate: '2080-01-01T23:59:59Z',
        ecType: "AGENZIE FISCALI"
    },
    {
        macroAreaName: 'MINISTERO DELLA GIUSTIZIA',
        serviceType: 'CONTRIBUTO DI SEGRETERIA TENUTA ALBO DEGLI AMMINISTRATORI GIUDIZIARI',
        specificBuiltInData: '9/0702155TS/',
        endDate: '2080-01-01T23:59:59Z',
        ecType: "PUBBLICHE AMMINISTRAZIONI CENTRALI"
    },
];

export const mockedCIBundleFeeList: Array<CIBundleFee> = [
    {
        paymentAmount: 0,
        serviceType: 'Carta di Identità Elettronica',
        specificBuiltInData: '9/0705103TS/',
    },
    {
        paymentAmount: 0,
        serviceType: 'Documento di viaggio provvisorio',
        specificBuiltInData: '9/0705102TS/',
    },
    {
        paymentAmount: 0,
        serviceType: 'Autorizzazioni satellitari',
        specificBuiltInData: '9/0712103SP/',
    },
    {
        paymentAmount: 0,
        serviceType: 'Contribuzione gara OE',
        specificBuiltInData: '9/1001100TS/',
    },
    {
        paymentAmount: 0,
        serviceType: 'Registrazione Atti',
        specificBuiltInData: '9/1201106IM/',
    },
    {
        paymentAmount: 0,
        serviceType: 'CONTRIBUTO DI SEGRETERIA TENUTA ALBO DEGLI AMMINISTRATORI GIUDIZIARI',
        specificBuiltInData: '9/0702155TS/',
    },
];

const baseCommissionBundlePspDetail: PSPBundleResource = {
    idBundle: 'idBundle',
    digitalStamp: false,
    digitalStampRestriction: true,
    idChannel: 'idChannel',
    idBrokerPsp: 'idBrokerPsp',
    name: 'Commission Bundle Name',
    description: 'Commission bundle description',
    paymentAmount: 5500,
    minPaymentAmount: 4000,
    maxPaymentAmount: 150100,
    paymentType: 'MYBK',
    touchpoint: 'PSP',
    bundleTaxonomies: mockedPSPTaxonomyList,
    validityDateFrom: new Date('2025-02-17'),
    validityDateTo: new Date('2028-02-22'),
    insertedDate: new Date('2024-02-15T09:36:04.792731104'),
    lastUpdatedDate: new Date('2024-02-17T09:36:04.792731104'),
};

export const mockedCommissionBundlePspDetailGlobal: PSPBundleResource = {
    ...baseCommissionBundlePspDetail,
    type: TypeEnum.GLOBAL,
};

export const mockedCommissionBundlePspDetailPrivate: PSPBundleResource = {
    ...baseCommissionBundlePspDetail,
    type: TypeEnum.PRIVATE,
};

export const mockedCommissionBundlePspDetailPublic: PSPBundleResource = {
    ...baseCommissionBundlePspDetail,
    type: TypeEnum.PUBLIC,
};

const baseCommissionBundleCIDetail: CIBundleResource = {
    idBundle: 'idBundle',
    digitalStamp: false,
    digitalStampRestriction: true,
    idChannel: 'idChannel',
    idBrokerPsp: 'idBrokerPsp',
    name: 'Commission Bundle Name',
    description: 'Commission bundle description',
    paymentAmount: 5500,
    minPaymentAmount: 4000,
    maxPaymentAmount: 150100,
    paymentType: 'MYBK',
    touchpoint: 'PSP',
    bundleTaxonomies: mockedCIBundleFeeList,
    validityDateFrom: new Date('2025-02-17'),
    validityDateTo: new Date('2028-02-22'),
    insertedDate: new Date('2024-02-15T09:36:04.792731104'),
    lastUpdatedDate: new Date('2024-02-17T09:36:04.792731104'),
    ciBundleId: "ciBundleId",
    ciBundleStatus: CiBundleStatusEnum.AVAILABLE,
    ciRequestId: "ciRequestId"
};

export const mockedCommissionBundleCiDetailGlobal: CIBundleResource = {
    ...baseCommissionBundleCIDetail,
    type: TypeEnum.GLOBAL,
};

export const mockedCommissionBundleCiDetailPrivate: CIBundleResource = {
    ...baseCommissionBundleCIDetail,
    type: TypeEnum.PRIVATE,
};

export const mockedCommissionBundleCiDetailPublic: CIBundleResource = {
    ...baseCommissionBundleCIDetail,
    type: TypeEnum.PUBLIC,
};

export const mockedBundleRequest: BundleRequest = {
    digitalStamp: false,
    digitalStampRestriction: true,
    idChannel: '97735020584_01',
    idBrokerPsp: 'idBrokerPsp',
    name: 'Commission Bundle Name',
    description: 'Commission bundle description',
    paymentAmount: 5556,
    minPaymentAmount: 4000,
    maxPaymentAmount: 150100,
    paymentType: 'Bonifico - SEPA',
    touchpoint: 'ANY',
    transferCategoryList: mockedPSPTaxonomyList.map((el) => el.specificBuiltInData!),
    type: TypeEnum.GLOBAL,
    validityDateFrom: new Date('2024-02-17'),
    validityDateTo: new Date('2024-02-22'),
};

export const mockedCommissionBundlePspList: PSPBundlesResource = {
    bundles: [mockedCommissionBundlePspDetailGlobal],
    pageInfo: {
        items_found: 1,
        limit: 10,
        page: 0,
        total_pages: 1,
    },
};

export const mockedCommissionBundleCiList: CIBundlesResource = {
    bundles: [mockedCommissionBundleCiDetailGlobal],
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

export const mockedCiSubscription: CISubscriptionInfo = {
    business_name: 'Business Name',
    creditor_institution_code: 'CI Tax Code',
};

export const mockedCiSubscriptionList: CIBundleSubscriptionsResource = {
    creditor_institutions_subscriptions: [mockedCiSubscription],
    page_info: {
        items_found: 1,
        limit: 10,
        page: 0,
        total_pages: 1,
    },
};

export const mockedCiBundleFee: CIBundleFee = {
    serviceType: 'service type',
    specificBuiltInData: 'specific_build_in_data',
    paymentAmount: 50,
};

export const mockedCiSubscriptionDetail: CIBundleSubscriptionsDetail = {
    ci_bundle_fee_list: [mockedCiBundleFee],
    bundle_request_id: 'bundleRequestId',
};

export const mockedCiSubscriptionIntersectDetail: BundleCiSubscriptionDetailModel = {
    ...mockedCiSubscriptionDetail,
    ...mockedCiSubscription,
};

export const mockedCIBundleRequest: PublicBundleRequest = {
    idBundleRequest: 'bundleRequestId',
    idBundle: 'idBundle',
    idPsp: 'idPsp',
    ciFiscalCode: 'ciFiscalCode',
    attributes: [
        {
            maxPaymentAmount: 500,
            transferCategory: mockedPSPTaxonomyList[0].specificBuiltInData,
            transferCategoryRelation: TransferCategoryRelationEnum.EQUAL,
        },
    ],
};

export const getChannelsId = (_page: number, _brokerCode: string): Promise<Array<string>> =>
    Promise.resolve(mockedChannelsIdList);

export const getCommissionBundlePsp = (_brokerCode: string): Promise<PSPBundlesResource> =>
    Promise.resolve(mockedCommissionBundlePspList);

export const getCommissionBundleCi = (_brokerCode: string): Promise<CIBundlesResource> =>
    Promise.resolve(mockedCommissionBundleCiList);

export const getCommissionBundleDetails = (type?: string): Promise<PSPBundleResource> =>
    Promise.resolve(
        !type || type === TypeEnum.GLOBAL
            ? mockedCommissionBundlePspDetailGlobal
            : type === TypeEnum.PRIVATE
                ? mockedCommissionBundlePspDetailPrivate
                : mockedCommissionBundlePspDetailPublic
    );

export const mockedBundleCreateResponse = {idBundle: 'mockedCommissionBundleId'};
export const createCommissionBundle = (_body: BundleRequest): Promise<BundleCreateResponse> =>
    Promise.resolve(mockedBundleCreateResponse);

export const updateCommissionBundle = (
    _name: string,
    _commissionBundle: BundleRequest
): Promise<PSPBundleResource> => Promise.resolve(mockedCommissionBundlePspDetailGlobal);

export const getTouchpoints = (): Promise<Touchpoints> => Promise.resolve(mockedTouchpoints);

export const deletePSPBundle = (): Promise<void> => new Promise((resolve) => resolve());

export const updatePSPBundle = (): Promise<void> => new Promise((resolve) => resolve());

export const getBundleCISubscriptionsMock =
    (): Promise<CIBundleSubscriptionsResource> => Promise.resolve(mockedCiSubscriptionList);

export const getBundleCISubscriptionsDetailMock =
    (): Promise<CIBundleSubscriptionsResource> => Promise.resolve(mockedCiSubscriptionDetail);
