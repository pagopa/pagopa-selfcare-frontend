export enum OperationTableFormAction {
    Create = 'create',
    Edit = 'edit',
}

export type OperationTableOnCreation = {
    email: string;
    phone: string;
};
