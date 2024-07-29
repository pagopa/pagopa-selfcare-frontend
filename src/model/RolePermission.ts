export enum ROLE {
    UNKNOWN = 'UNKNOWN',
    PAGOPA_OPERATOR = 'PAGOPA_OPERATOR',
    PSP_ADMIN = 'PSP_ADMIN',
    PSP_OPERATOR = 'PSP_OPERATOR',
    PSP_DIRECT_ADMIN = 'PSP_DIRECT_ADMIN',
    PSP_DIRECT_OPERATOR = 'PSP_DIRECT_OPERATOR',
    EC_ADMIN = 'EC_ADMIN',
    EC_OPERATOR = 'EC_OPERATOR',
    EC_DIRECT_ADMIN = 'EC_DIRECT_ADMIN',
    EC_DIRECT_OPERATOR = 'EC_DIRECT_OPERATOR',
    PT_UNSIGNED = 'PT_UNSIGNED',
    PT_EC_OPERATOR = 'PT_EC_OPERATOR',
    PT_PSP_OPERATOR = 'PT_PSP_OPERATOR',
    PT_PSPEC_OPERATOR = 'PT_PSPEC_OPERATOR',
}

export const permissions = {
    'node-signin': [
        ROLE.EC_ADMIN,
        ROLE.EC_DIRECT_ADMIN,
        ROLE.PSP_ADMIN,
        ROLE.PSP_DIRECT_ADMIN,
        ROLE.PT_UNSIGNED,
        ROLE.PT_EC_OPERATOR,
        ROLE.PT_PSP_OPERATOR,
        ROLE.PT_PSPEC_OPERATOR,
        ROLE.PAGOPA_OPERATOR,
    ],
    apikey: [
        ROLE.EC_DIRECT_ADMIN,
        ROLE.EC_DIRECT_OPERATOR,
        ROLE.PSP_DIRECT_ADMIN,
        ROLE.PSP_DIRECT_OPERATOR,
        ROLE.PT_EC_OPERATOR,
        ROLE.PT_PSP_OPERATOR,
        ROLE.PT_PSPEC_OPERATOR,
        ROLE.PAGOPA_OPERATOR,
    ],
    stations: [
        ROLE.EC_DIRECT_OPERATOR,
        ROLE.EC_DIRECT_ADMIN,
        ROLE.PT_EC_OPERATOR,
        ROLE.PT_PSPEC_OPERATOR,
        ROLE.PAGOPA_OPERATOR,
    ],
    channels: [
        ROLE.PSP_DIRECT_ADMIN,
        ROLE.PSP_DIRECT_OPERATOR,
        ROLE.PT_PSP_OPERATOR,
        ROLE.PT_PSPEC_OPERATOR,
        ROLE.PAGOPA_OPERATOR,
    ],
    iban: [
        ROLE.EC_DIRECT_ADMIN,
        ROLE.EC_ADMIN,
        ROLE.PAGOPA_OPERATOR
    ],
    'commission-bundles-list': [
        ROLE.PSP_DIRECT_ADMIN,
        ROLE.PSP_ADMIN,
        ROLE.EC_ADMIN,
        ROLE.EC_DIRECT_ADMIN,
        ROLE.PAGOPA_OPERATOR,
    ],
    'commission-bundles-add-recipient': [
        ROLE.PSP_DIRECT_ADMIN,
        ROLE.PSP_ADMIN,
        ROLE.PAGOPA_OPERATOR,
    ],
    'commission-bundles-addedit': [
        ROLE.PSP_DIRECT_ADMIN,
        ROLE.PSP_ADMIN,
        ROLE.PAGOPA_OPERATOR,
    ],
    'commission-bundles-activate': [
        ROLE.EC_DIRECT_ADMIN,
        ROLE.EC_ADMIN,
        ROLE.PAGOPA_OPERATOR,
    ],
    'operation-table-read-write': [
        ROLE.EC_DIRECT_ADMIN,
        ROLE.EC_DIRECT_OPERATOR,
        ROLE.PSP_DIRECT_ADMIN,
        ROLE.PSP_DIRECT_OPERATOR,
        ROLE.PT_EC_OPERATOR,
        ROLE.PT_PSP_OPERATOR,
        ROLE.PT_PSPEC_OPERATOR,
        ROLE.PAGOPA_OPERATOR,
    ],
    'operation-table-list': [
        ROLE.PAGOPA_OPERATOR
    ],
    'download-iban': [
        ROLE.PT_EC_OPERATOR,
        ROLE.PT_PSPEC_OPERATOR,
        ROLE.EC_DIRECT_ADMIN,
        ROLE.EC_DIRECT_OPERATOR,
        ROLE.PAGOPA_OPERATOR,
    ],
    'download-creditor-institutions': [
        ROLE.PT_EC_OPERATOR,
        ROLE.PT_PSPEC_OPERATOR,
        ROLE.EC_DIRECT_ADMIN,
        ROLE.EC_DIRECT_OPERATOR,
        ROLE.PAGOPA_OPERATOR,
    ],
    'delegations-list': [
        ROLE.EC_DIRECT_OPERATOR,
        ROLE.EC_DIRECT_ADMIN,
        ROLE.PT_EC_OPERATOR,
        ROLE.PT_PSPEC_OPERATOR,
        ROLE.PAGOPA_OPERATOR,
    ],
    "payments-receipts": [
        ROLE.EC_ADMIN,
        ROLE.EC_DIRECT_ADMIN,
        ROLE.PAGOPA_OPERATOR,
    ],
    "payment-notices": [
        ROLE.EC_DIRECT_ADMIN,
        ROLE.EC_DIRECT_OPERATOR,
        ROLE.PT_EC_OPERATOR,
        ROLE.PT_PSPEC_OPERATOR,
        ROLE.PAGOPA_OPERATOR,
    ],
    "payment-notices-addedit": [
        ROLE.EC_DIRECT_ADMIN,
        ROLE.EC_DIRECT_OPERATOR,
        ROLE.PT_EC_OPERATOR,
        ROLE.PT_PSPEC_OPERATOR,
        ROLE.PAGOPA_OPERATOR,
    ],
    "station-maintenances": [
        ROLE.EC_DIRECT_OPERATOR,
        ROLE.EC_DIRECT_ADMIN,
        ROLE.PT_EC_OPERATOR,
        ROLE.PT_PSPEC_OPERATOR,
        ROLE.PAGOPA_OPERATOR,
    ]
};

export type PermissionName = keyof typeof permissions;
