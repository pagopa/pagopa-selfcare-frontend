export type JWTOrganizationRole = {
    partyRole: string;
    role: string;
};

export type JWTUser = {
    uid: string;
    fiscal_number?: string;
    name: string;
    family_name: string;
    email: string;
    org_id: string;
    org_party_role?: string;
    org_role?: string;
    roles?: Array<JWTOrganizationRole> | string;
    organization?: {
        id?: string;
        roles?: Array<JWTOrganizationRole> | string;
    };
};
