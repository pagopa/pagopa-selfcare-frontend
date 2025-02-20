import {ProductEntity} from '@pagopa/mui-italia';
import {PartySwitchItem} from '@pagopa/mui-italia/dist/components/PartySwitch';

import {useTranslation} from 'react-i18next';
import {User} from '@pagopa/selfcare-common-frontend/model/User';
import {trackEvent} from '@pagopa/selfcare-common-frontend/services/analyticsService';
import {CONFIG} from '@pagopa/selfcare-common-frontend/config/env';
import {useMemo} from 'react';
import withParties, {WithPartiesProps} from '../decorators/withParties';
import {ProductModel} from '../model/Product';
import {Party} from '../model/Party';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {partiesActions, partiesSelectors} from '../redux/slices/partiesSlice';
import {useSigninData} from '../hooks/useSigninData';
import {userIsPagopaOperator} from "../hooks/useUserRole";
import {ENV} from '../utils/env';
import { fetchPartyDetails } from '../services/partyService';
import CommonHeader from './CommonHeader/CommonHeader';


type Props = WithPartiesProps & {
    onExit: (exitAction: () => void) => void;
    loggedUser?: User;
    parties: Array<Party>;
};

const pagoPAProduct: ProductEntity = {
    // TODO check if correct
    id: 'prod-pagopa',
    title: 'Piattaforma pagoPA',
    productUrl: CONFIG.HEADER.LINK.PRODUCTURL,
    linkType: 'internal',
};

const selfcareProduct: ProductModel = {
    authorized: true,
    description: '',
    id: 'prod-selfcare',
    imageUrl: '',
    roles: [],
    selfcareRole: undefined,
    status: 'ACTIVE',
    subProducts: [],
    title: 'Area Riservata',
    urlBO: ENV.URL_FE.SELFCARE,
    urlPublic: ENV.URL_FE.SELFCARE,
};


// eslint-disable-next-line sonarjs/cognitive-complexity
const roleKey2LanguageKey = (party: Party): string => {
    const roleKey = party.roles[0].roleKey;
    const roleLabel = party.roles[0].roleLabel;

    const isOperator = userIsPagopaOperator();
        if (isOperator) {
        return 'roles.pagopaOperator';
    }
    if ((party.institutionType === 'PSP' && roleKey === 'operator') || roleKey === 'operator-psp') {
        return roleLabel ?? 'roles.pspOperator';
    }
    if ((party.institutionType === 'PSP' && roleKey === 'admin') || roleKey === 'admin-psp') {
        return roleLabel ?? 'roles.pspAdmin';
    }
    if (roleKey === 'operator') {
        return roleLabel ?? 'roles.ecOperator';
    }
    if (roleKey === 'admin') {
        return roleLabel ?? 'roles.ecAdmin';
    }
    return '';
};

const Header = ({onExit, loggedUser, parties}: Props) => {
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const products = useAppSelector(partiesSelectors.selectPartySelectedProducts);
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
    // const selectPartiesList = useAppSelector(partiesSelectors.selectPartiesList);

    const updateSigninData = useSigninData();

    const parties2Show = parties.filter((party) => party.status === 'ACTIVE');
    // const parties2Show = parties.filter((party) => party.status === 'ACTIVE');
    const activeProducts: Array<ProductModel> = useMemo(
        () =>
            [
                {
                    id: pagoPAProduct.id,
                    title: pagoPAProduct.title,
                    publicUrl: pagoPAProduct.productUrl,
                } as unknown as ProductModel,
                selfcareProduct,
            ].concat(
                products?.filter(
                    (p) => p.id !== pagoPAProduct.id && p.status === 'ACTIVE' && p.authorized
                ) ?? []
            ),
        [products]
    );

    return (
        <CommonHeader
            onExit={onExit}
            withSecondHeader={true}
            selectedPartyId={selectedParty?.partyId}
            selectedProductId={pagoPAProduct.id}
            addSelfcareProduct={false} // TODO verify if returned from API
            productsList={activeProducts.map((p) => ({
                id: p.id,
                title: p.title,
                productUrl: p.urlPublic ?? '',
                linkType: 'external',
            }))}
            partyList={parties2Show.map((party) => ({
                id: party.partyId,
                name: party.description,
                productRole: t(roleKey2LanguageKey(party)),
                logoUrl: party.urlLogo,
            }))}
            loggedUser={
                loggedUser
                    ? {
                        id: loggedUser ? loggedUser.uid : '',
                        name: loggedUser?.name,
                        surname: loggedUser?.surname,
                        email: loggedUser?.email,
                    }
                    : false
            }
            assistanceEmail={ENV.ASSISTANCE.EMAIL}
            enableLogin={true}
            onSelectedProduct={(p) =>
                onExit(() =>
                    p.id === 'prod-selfcare'
                        ? window.location.assign(`${p.productUrl}${selectedParty?.partyId}`)
                        : window.location.assign(
                            `${ENV.URL_FE.TOKEN_EXCHANGE}?institutionId=${selectedParty?.partyId}&productId=${p.id}`
                        )
                )
            }
            onSelectedParty={
            // eslint-disable-next-line sonarjs/cognitive-complexity
            (selectedParty: PartySwitchItem) => {
                if (selectedParty) {
                    trackEvent('PARTY_SELECTION', {
                        party_id: selectedParty.id,
                    });
                    onExit(() => {
                        if (ENV.ENV === 'LOCAL_DEV') {
                            fetchPartyDetails(selectedParty.id).then((party) => {
                                const setParty = (party?: Party) => dispatch(partiesActions.setPartySelected(party));
                                setParty(party ? party : undefined);
                                if (party) {
    
                                    void updateSigninData(party);
                                }
                            }).catch((error) => {
                            });
                        } else {
                            window.location.assign(
                                `${ENV.URL_FE.TOKEN_EXCHANGE}?institutionId=${
                                    selectedParty.id
                                }&productId=prod-pagopa${ENV.ENV === 'uat' ? '&environment=Collaudo' : ''}`
                            );
                        }
                    });
                }
            }}
        />
    );
};
export default withParties(Header);
