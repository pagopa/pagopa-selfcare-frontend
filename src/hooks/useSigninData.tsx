import { useState } from 'react';
import { SigninData } from '../model/Node';
import { Party } from '../model/Party';
import { useAppDispatch } from '../redux/hooks';
import { partiesActions } from '../redux/slices/partiesSlice';
import {
  getBrokerAndEcDetails,
  getBrokerAndPspDetails,
  getPSPBrokerDetails,
  getPSPDetails,
  getPaymentServiceProviders,
} from '../services/nodeService';
import { PaymentServiceProvidersResource } from '../api/generated/portal/PaymentServiceProvidersResource';

/* A custom hook to retrieve the signin details of PSP, EC and PT and store them into redux. */
export const useSigninData = () => {
  const dispatch = useAppDispatch();
  const setSigninData = (signinData?: SigninData) =>
    dispatch(partiesActions.setSigninData(signinData));

  return async (party: Party) => {
    await fetchSigninData(party)
      .then((result) => {
        setSigninData(result);
      })
      .catch((error) => console.error(error));
  };
};

const fetchSigninData = async (party: Party): Promise<SigninData> => {
  try {
    if (party.institutionType === 'PT') {
      const pspBrokerDetails = await getPSPBrokerDetails(party.fiscalCode);
      const ecAndBrokerDetails = await getBrokerAndEcDetails(party.fiscalCode);
      return {
        brokerPspDetailsResource: { ...pspBrokerDetails },
        brokerDetailsResource: { ...(ecAndBrokerDetails?.brokerDetailsResource || {}) },
      };
    }

    if (party.institutionType === 'PSP') {
      const pspBrokerDetails = await getPSPBrokerDetails(party.fiscalCode);

      const pspList: PaymentServiceProvidersResource = await getPaymentServiceProviders(
        0,
        undefined,
        undefined,
        undefined,
        party.fiscalCode
      );

      const pspDetails =
        pspList &&
        pspList.payment_service_providers &&
        pspList.payment_service_providers[0] &&
        pspList.payment_service_providers[0].psp_code
          ? await getPSPDetails(pspList.payment_service_providers[0].psp_code)
          : {};

      return {
        brokerPspDetailsResource: { ...pspBrokerDetails },
        paymentServiceProviderDetailsResource: {
          ...pspDetails,
        }  as any,
      };
    } else {
      return await getBrokerAndEcDetails(party.fiscalCode);
    }
  } catch (error) {
    console.error(error);
    return {};
  }
};
