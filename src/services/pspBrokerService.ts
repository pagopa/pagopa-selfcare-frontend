import { BackofficeApi } from '../api/BackofficeClient';

export const deletePSPBroker = (brokerTaxCode: string): Promise<void> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return new Promise((resolve) => resolve());
  } else {
    return BackofficeApi.deletePSPBroker(brokerTaxCode);
  }
};