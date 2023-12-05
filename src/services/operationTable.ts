import { BackofficeApi } from '../api/BackofficeClient';
import { TavoloOpDto } from '../api/generated/portal/TavoloOpDto';
import { TavoloOpOperations } from '../api/generated/portal/TavoloOpOperations';
import { TavoloOpResource } from '../api/generated/portal/TavoloOpResource';
import { TavoloOpResourceList } from '../api/generated/portal/TavoloOpResourceList';
import {
  getOperationTableList as getOperationTableListMocked,
  getOperationTableDetails as getOperationTableDetailsMocked,
  createOperationTable as createOperationTableMocked,
  updateOperationTable as updateOperationTableMocked,
} from './__mocks__/operationTable';

export const getOperationTableList = (): Promise<TavoloOpResourceList> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getOperationTableListMocked();
  } else {
    return BackofficeApi.getOperationTableList().then((resources) => resources);
  }
};

export const createOperationTable = (
  operationTableDto: TavoloOpDto
): Promise<TavoloOpOperations> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return createOperationTableMocked(operationTableDto);
  } else {
    return BackofficeApi.createOperationTable(operationTableDto).then((resources) => resources);
  }
};

export const updateOperationTable = (
    ecCode: string,
  operationTableDto: TavoloOpDto
): Promise<TavoloOpOperations> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return updateOperationTableMocked(operationTableDto);
  } else {
    return BackofficeApi.updateOperationTable(ecCode, operationTableDto).then((resources) => resources);
  }
};

export const getOperationTableDetails = (ecCode: string): Promise<TavoloOpResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getOperationTableDetailsMocked(ecCode);
  } else {
    return BackofficeApi.getOperationTableDetails(ecCode).then((resources) => resources);
  }
};
