import { BackofficeApi } from "../api/BackofficeClient";
import { CIBrokerDelegationPage } from "../api/generated/portal/CIBrokerDelegationPage";
import {getCIBrokerDelegationMock} from "./__mocks__/brokerService";

export const getCIBrokerDelegation = (
    brokerTaxCode: string, brokerId: string, ciName: string, limit: number, page: number
  ): Promise<CIBrokerDelegationPage> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
      return getCIBrokerDelegationMock();
    } else {
      return BackofficeApi.getCIBrokerDelegation( brokerTaxCode, brokerId, ciName, limit, page);
    }
  };