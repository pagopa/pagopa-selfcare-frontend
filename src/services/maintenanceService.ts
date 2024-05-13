import { BackofficeApi } from '../api/BackofficeClient';
import { MaintenanceMessage } from '../api/generated/portal/MaintenanceMessage';
import { mockMaintenanceMessage } from './__mocks__/maintenanceService';

export const getMaintenanceMessage = (): Promise<MaintenanceMessage> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return Promise.resolve(mockMaintenanceMessage);
  } else {
    return BackofficeApi.getMaintenanceMessage().then((data) => data);
  }
};
