export type PSP = {
    broker_psp_code: string;
    description: string;
    enabled: boolean;
    extended_fault_bean: boolean;
};

export type PSPDirectDTO = {
    abi: string;
    agid_psp: boolean;
    bic: string;
    business_name: string;
    enabled: boolean;
    my_bank_code: string;
    psp_code: string;
    stamp: boolean;
    tax_code: string;
    vat_number: string;
};
