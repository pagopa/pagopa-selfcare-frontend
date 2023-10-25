import { PortalApi } from '../api/PortalApiClient';
import { TavoloOpDto } from '../api/generated/portal/TavoloOpDto';
import { TavoloOpOperations } from '../api/generated/portal/TavoloOpOperations';
import { TavoloOpResource } from '../api/generated/portal/TavoloOpResource';
import {
  getOperationTableList as getOperationTableListMocked,
  getOperationTableDetails as getOperationTableDetailsMocked,
  createOperationTable as createOperationTableMocked,
} from './__mocks__/operationTable';

export const getOperationTableList = (): Promise<any> => getOperationTableListMocked();
// {
/* istanbul ignore if */
/* if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getOperationTableListMocked();
  } else {
    return PortalApi.getOperationTableList().then((resources) => resources);
  } */
// };

export const createOperationTable = (
  operationTableDto: TavoloOpDto
): Promise<TavoloOpOperations> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return createOperationTableMocked(operationTableDto);
  } else {
    return PortalApi.createOperationTable(operationTableDto).then((resources) => resources);
  }
};

export const getOperationTableDetails = (ecCode: string): Promise<TavoloOpResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getOperationTableDetailsMocked(ecCode);
  } else {
    return PortalApi.getOperationTableDetails(ecCode).then((resources) => resources);
  }
};
