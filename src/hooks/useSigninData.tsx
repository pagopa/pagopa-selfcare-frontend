import { SigninData } from '../model/Node';
import { Party } from '../model/Party';
import { useAppDispatch } from '../redux/hooks';
import { partiesActions } from '../redux/slices/partiesSlice';
import {
  getBrokerAndEcDetails,
  getBrokerAndPspDetails,
  getPSPBrokerDetails,
} from '../services/nodeService';

/** A custom hook to retrieve the signin details of PSP, EC and PT and store them into redux */
export const useSigninData = () => {
  const dispatch = useAppDispatch();
  const setSigninData = (signinData?: SigninData) =>
    dispatch(partiesActions.setSigninData(signinData));

  return (party: Party) => {
    fetchSigninData(party)
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
        brokerDetailsResource: { ...ecAndBrokerDetails.brokerDetailsResource },
      };
    }

    if (party.institutionType === 'PSP') {
      return await getBrokerAndPspDetails(
        party.pspData?.abiCode ? `ABI${party.pspData.abiCode}` : ''
      );
    } else {
      return await getBrokerAndEcDetails(party.fiscalCode);
    }
  } catch (error) {
    console.error(error);
    return {};
  }
};
