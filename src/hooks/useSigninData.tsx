<<<<<<< HEAD
import {useState} from 'react';
=======
>>>>>>> 3f32cfc3 (Formatting (#542))
import {SigninData} from '../model/Node';
import {Party} from '../model/Party';
import {useAppDispatch} from '../redux/hooks';
import {partiesActions} from '../redux/slices/partiesSlice';
<<<<<<< HEAD
import {
    getBrokerAndEcDetails,
    getBrokerAndPspDetails,
    getPSPBrokerDetails,
    getPaymentServiceProviders,
} from '../services/nodeService';
import {PaymentServiceProvidersResource} from '../api/generated/portal/PaymentServiceProvidersResource';
=======
import {getBrokerAndEcDetails, getBrokerAndPspDetails, getPSPBrokerDetails,} from '../services/nodeService';
>>>>>>> 3f32cfc3 (Formatting (#542))

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
            // eslint-disable-next-line functional/no-let
            let pspBrokerDetails: any;
            try {
                pspBrokerDetails = await getPSPBrokerDetails(party.fiscalCode);
            } catch (e) {
                pspBrokerDetails = {};
            }

            // eslint-disable-next-line functional/no-let
            let ecAndBrokerDetails;
            try {
                ecAndBrokerDetails = await getBrokerAndEcDetails(party.fiscalCode);
            } catch (e) {
                ecAndBrokerDetails = undefined;
            }

            return {
                brokerPspDetailsResource: {...pspBrokerDetails},
                brokerDetailsResource: {...(ecAndBrokerDetails?.brokerDetailsResource || {})},
            };
        }

        if (party.institutionType === 'PSP') {
            // eslint-disable-next-line functional/no-let
            let pspBrokerDetails: any = {};
            try {
                pspBrokerDetails = await getPSPBrokerDetails(party.fiscalCode);
            } catch (e) {
                // not found
            }

            const pspDetails = party.fiscalCode ? await getBrokerAndPspDetails(party.fiscalCode) : {};

            return {
                brokerPspDetailsResource: {...pspBrokerDetails},
                paymentServiceProviderDetailsResource: {
                    ...pspDetails.paymentServiceProviderDetailsResource
                } as any,
            };
        } else {
            return await getBrokerAndEcDetails(party.fiscalCode);
        }
    } catch (error) {
        console.error(error);
        return {};
    }
};
