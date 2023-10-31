import { TavoloOpDto } from '../../api/generated/portal/TavoloOpDto';
import { TavoloOpOperations } from '../../api/generated/portal/TavoloOpOperations';
import { TavoloOpResource } from '../../api/generated/portal/TavoloOpResource';
import { TavoloOpResourceList } from '../../api/generated/portal/TavoloOpResourceList';

export const operationTableList: TavoloOpResourceList = {
  tavoloOpResourceList: [
    {
      createdAt: new Date(),
      createdBy: 'ownerUser',
      email: 'aaa@bbb.dummy.it',
      modifiedAt: new Date(),
      modifiedBy: 'modifierUser',
      name: 'AAA s.r.l',
      referent: 'referent',
      taxCode: '012345678910',
      telephone: '0039012345678910',
    },
    {
      createdAt: new Date(),
      createdBy: 'ownerUser',
      email: 'bbb@bbb.dummy.it',
      modifiedAt: new Date(),
      modifiedBy: 'modifierUser',
      name: 'BBB s.r.l',
      referent: 'referent',
      taxCode: '012345678911',
      telephone: '0039012345678911',
    },
    {
      createdAt: new Date(),
      createdBy: 'ownerUser',
      email: 'ccc@bbb.dummy.it',
      modifiedAt: new Date(),
      modifiedBy: 'modifierUser',
      name: 'CCC s.r.l',
      referent: 'referent',
      taxCode: '012345678912',
      telephone: '0039012345678912',
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

export const getOperationTableList = (): Promise<TavoloOpResourceList> =>
  new Promise((resolve) => resolve(operationTableList));

export const createOperationTable = (
  _operationTableDto: TavoloOpDto
): Promise<TavoloOpOperations> => new Promise((resolve) => resolve({}));

export const updateOperationTable = (
  _operationTableDto: TavoloOpDto
): Promise<TavoloOpOperations> => new Promise((resolve) => resolve({}));

export const getOperationTableDetails = (_ecCode: string): Promise<TavoloOpResource> =>
  new Promise((resolve) => resolve(operationTableDetail));
