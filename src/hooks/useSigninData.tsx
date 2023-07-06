import { SigninData } from '../model/Node';
import { Party } from '../model/Party';
import { useAppDispatch } from '../redux/hooks';
import { partiesActions } from '../redux/slices/partiesSlice';
import { getCreditorInstitutionDetails, getPSPDetails } from '../services/nodeService';

/** A custom hook to retrieve the signin details of PSP and EC and store them into redux */
export const useSigninData = () => {
  const dispatch = useAppDispatch();
  const setSigninData = (signinData?: SigninData) =>
    dispatch(partiesActions.setSigninData(signinData));

  return (party: Party) =>
    (party.institutionType === 'PSP'
      ? getPSPDetails(party.pspData?.abiCode ?? '')
      : getCreditorInstitutionDetails(party.fiscalCode)
    )
      .then((sd) => {
        setSigninData(sd);
      })
      .catch((reason) => console.log(reason));
};
