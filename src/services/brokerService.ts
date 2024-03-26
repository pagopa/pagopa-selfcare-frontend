import { BackofficeApi } from "../api/BackofficeClient";
import { MyCIResource } from "../api/generated/portal/MyCIResource";
import {getCIBrokerDelegationMock} from "./__mocks__/brokerService";

export const getCIBrokerDelegation = (
    brokerTaxCode: string, brokerId: string, ciName: string, limit: number, page: number
  ): Promise<Array<MyCIResource>> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
      return getCIBrokerDelegationMock();
    } else {
      return BackofficeApi.getCIBrokerDelegation( brokerTaxCode, brokerId, ciName, limit, page);
    }
  };