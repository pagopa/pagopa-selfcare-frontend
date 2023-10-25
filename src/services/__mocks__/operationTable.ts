import { TavoloOpDto } from '../../api/generated/portal/TavoloOpDto';
import { TavoloOpOperations } from '../../api/generated/portal/TavoloOpOperations';
import { TavoloOpResource } from '../../api/generated/portal/TavoloOpResource';

// TODO: fix with right type
export const operationTableList: any = {
  operationTableList: [
    {
      companyName: 'AAA s.r.l',
      fiscalCode: '012345678910',
      email: 'aaa@bbb.dummy.it',
      phone: '0039012345678910',
    },
    {
      companyName: 'BBB s.r.l',
      fiscalCode: '012345678911',
      email: 'bbb@bbb.dummy.it',
      phone: '0039012345678911',
    },
    {
      companyName: 'CCC s.r.l',
      fiscalCode: '012345678912',
      email: 'ccc@bbb.dummy.it',
      phone: '0039012345678912',
    },
  ],
};

export const operationTableDetail: TavoloOpResource = {
  createdAt: new Date('10/10/2023'),
  createdBy: 'createdByValue',
  email: 'test@test.dummy.it',
  modifiedAt: new Date(),
  modifiedBy: 'modifiedByValue',
  name: 'nameValue',
  referent: 'referentValue',
  taxCode: 'taxCodeValue',
  telephone: 'phoneValue',
};

export const getOperationTableList = (): Promise<any> =>
  new Promise((resolve) => resolve(operationTableList));

export const createOperationTable = (
  _operationTableDto: TavoloOpDto
): Promise<TavoloOpOperations> => new Promise((resolve) => resolve({}));

export const getOperationTableDetails = (_ecCode: string): Promise<TavoloOpResource> =>
  new Promise((resolve) => resolve(operationTableDetail));
