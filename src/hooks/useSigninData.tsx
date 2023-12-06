import {useAppDispatch} from '../redux/hooks';
import {
    createECAndBroker,
    createEcBroker,
    createECIndirect,
    getActor,
    updateCreditorInstitution,
} from '../services/nodeService';
import {contextActions} from "../redux/slices/contextSlice";
import {isEcBrokerSigned} from "../utils/rbac-utils";

const dispatch = useAppDispatch();

/* A custom hook to retrieve the signin details of PSP, EC and PT and store them into redux. */
export const dispatchSignUp = (taxCode: string) => {
    useSignUp()(taxCode);
};
export const useSignUp = () => {
    return async (taxCode: string) => {
        await getActor(taxCode)
            .then((result) => {
                dispatch(contextActions.signUp(result));
            })
            .catch((error) => console.error(error));
    }
};


export const signUpEc = async (taxCode: string, payload: any, isDirect: boolean) => {
    if (isDirect) {
        await createECAndBroker(payload);
    } else {
        await createECIndirect(payload);
    }
    const actor = await getActor(taxCode);
    dispatch(contextActions.signUp(actor));
}
export const editInfoEc = async (taxCode: string, payload: any, isDirect: boolean) => {
    if (!isEcBrokerSigned(signInData) && intermediaryAvailableValue) {
        await createEcBroker({
            broker_code: taxCode,
            description: selectedParty.description,
        });
    }

    await updateCreditorInstitution(taxCode, payload);
    const actor = await getActor(taxCode);
    dispatch(contextActions.editInfo(actor));
}
