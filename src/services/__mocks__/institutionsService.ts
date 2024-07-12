import {DelegationResource} from '../../api/generated/portal/DelegationResource';
import {Institution_typeEnum} from '../../api/generated/portal/InstitutionDetail';
import {InstitutionDetailResource} from '../../api/generated/portal/InstitutionDetailResource';
import {StatusEnum} from '../../api/generated/portal/WrapperChannelDetailsDto';
import {TypeEnum, WrapperEntities} from '../../api/generated/portal/WrapperEntities';
import {mockedPaymentTypes} from './configurationService';

export const channelWrapperMockedGet = (code: string): WrapperEntities => ({
    brokerCode: 'string',
    createdAt: new Date('2024-02-29T17:05:35.740Z'),
    createdBy: 'PSP S.p.A',
    id: 'string',
    modifiedAt: new Date('2024-02-29T17:05:35.740Z'),
    modifiedBy: 'string',
    modifiedByOpt: 'string',
    note: 'string',
    status: StatusEnum.APPROVED,
    type: TypeEnum.CHANNEL,
    entities: [
        {
            createdAt: new Date('2024-02-29T17:05:35.740Z'),
            entity: {
                broker_psp_code: '97735020584',
                broker_description: 'AgID - Agenzia per l’Italia Digitale',
                channel_code: code,
                target_path: ' /govpay/api/pagopa/PagamentiTelematiciCCPservice',
                target_port: 8081,
                target_host: ' lab.link.it',
                payment_types: mockedPaymentTypes?.payment_types?.map((e) => e.payment_type ?? '') ?? [],
                status: StatusEnum.TO_CHECK,
            },
            id: 'string',
            modifiedAt: new Date('2024-02-29T17:05:35.740Z'),
            modifiedBy: 'string',
            modifiedByOpt: 'Operatore PSP',
            note: 'string',
            status: StatusEnum.TO_CHECK,
            type: TypeEnum.CHANNEL,
        },
    ],
});

export const mockedDelegatedPSP: DelegationResource = {
    delegation_list: [
        {
            broker_id: 'idBrokerPsp',
            institution_id: '0000001',
            institution_name: 'Azienda Pubblica di Servizi alla Persona Test 1',
            broker_name: 'PSP1',
            tax_code: '800011104871',
            broker_tax_code: 'idBrokerPsp',
        },
        {
            broker_id: 'fce5332f-56a4-45b8-8fdc-7667ccdfca5e2',
            broker_name: 'PSP2',
            id: '2e76eb7f-2f55-4ec3-8f41-1743f827f7db2',
            institution_id: 'dccdade9-4ce4-444b-8b4d-ef50be064842',
            institution_name: 'Azienda Pubblica di Servizi alla Persona Test 2',
            institution_type: 'PA',
            product_id: 'prod-pagopa',
            tax_code: '800011104872',
            broker_tax_code: '800011104872',
            type: 'PT',
        },
        {
            broker_id: 'fce5332f-56a4-45b8-8fdc-7667ccdfca5e3',
            broker_name: 'PSP3',
            id: '2e76eb7f-2f55-4ec3-8f41-1743f827f7db3',
            institution_id: 'dccdade9-4ce4-444b-8b4d-ef50be0648473',
            institution_name: 'Azienda Pubblica di Servizi alla Persona Test 3',
            institution_type: 'PA',
            product_id: 'prod-pagopa',
            tax_code: '800011104873',
            broker_tax_code: '800011104873',
            type: 'PT',
        },
        {
            institution_id: '0000004',
            broker_name: 'PSP4',
            tax_code: '800011104874',
            broker_tax_code: '800011104874',
        },
        {
            institution_id: '0000005',
            broker_name: 'PSP5',
            tax_code: '800011104875',
            broker_tax_code: '800011104875',
        },
        {
            institution_id: '0000006',
            broker_name: 'PSP6',
            tax_code: '800011104876',
            broker_tax_code: '800011104876',
        },
        {
            institution_id: '0000007',
            broker_name: 'PSP76',
            tax_code: '8000111048747',
            broker_tax_code: '800011104877',
        },
    ],
};

export const mockedInstitutionDetailResource: InstitutionDetailResource = {
    institution_detail_list: [
        {
            address: '',
            external_id: '2e76eb7f-2f55-4ec3-8f41-1743f827f7db2',
            id: 'fce5332f-56a4-45b8-8fdc-7667ccdfca5e2',
            name: 'Azienda Pubblica di Servizi alla Persona Test 2',
            origin: '',
            origin_id: 'dccdade9-4ce4-444b-8b4d-ef50be064842',
            status: '',
            tax_code: '800011104872',
            user_product_roles: ['admin'],
            assistance_contacts: {},
            company_informations: {},
            dpo_data: {
                address: '',
                email: '',
                pec: '',
            },
            institution_type: Institution_typeEnum.PA,
            mail_address: '',
            psp_data: {
                abi_code: '',
                business_register_number: '',
                legal_register_name: '',
                legal_register_number: '',
                vat_number_group: false,
            },
            recipient_code: '',
        },
    ],
};

export const getBrokerDelegationMock = (): Promise<DelegationResource> =>
    Promise.resolve(mockedDelegatedPSP);
export const getInstitutionsMock = (): Promise<InstitutionDetailResource> =>
    Promise.resolve(mockedInstitutionDetailResource);
