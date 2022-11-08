import { ProductEntity } from '@pagopa/mui-italia';
import { PartySwitchItem } from '@pagopa/mui-italia/dist/components/PartySwitch';
import { Header as CommonHeader } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { CONFIG } from '@pagopa/selfcare-common-frontend/config/env';
import { useMemo } from 'react';
import withParties, { WithPartiesProps } from '../decorators/withParties';
import { Product } from '../model/Product';
import { useAppSelector } from '../redux/hooks';
import { partiesSelectors } from '../redux/slices/partiesSlice';
import { ENV } from './../utils/env';

type Props = WithPartiesProps & {
  onExit: (exitAction: () => void) => void;
  loggedUser?: User;
};

const pagoPAProduct: ProductEntity = {
  // TODO check if correct
  id: 'prod-pagopa',
  title: 'Piattaforma pagoPA',
  productUrl: CONFIG.HEADER.LINK.PRODUCTURL,
  linkType: 'internal',
};

const selfcareProduct: Product = {
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

const Header = ({ onExit, loggedUser, parties }: Props) => {
  const { t } = useTranslation();
  const products = useAppSelector(partiesSelectors.selectPartySelectedProducts);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  // const selectPartiesList = useAppSelector(partiesSelectors.selectPartiesList);

  const parties2Show = parties.filter((party) => party.status === 'ACTIVE');
  // const parties2Show = parties.filter((party) => party.status === 'ACTIVE');
  const activeProducts: Array<Product> = useMemo(
    () =>
      [
        {
          id: pagoPAProduct.id,
          title: pagoPAProduct.title,
          publicUrl: pagoPAProduct.productUrl,
        } as unknown as Product,
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
        linkType: 'internal',
      }))}
      partyList={parties2Show.map((party) => ({
        id: party.partyId,
        name: party.description,
        productRole: t(`roles.${party.roles[0].roleKey}`),
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
      onSelectedParty={(selectedParty: PartySwitchItem) => {
        if (selectedParty) {
          trackEvent('PARTY_SELECTION', {
            party_id: selectedParty.id,
          });
          onExit(() =>
            window.location.assign(
              `${ENV.URL_FE.TOKEN_EXCHANGE}?institutionId=${selectedParty.id}&productId=prod-pagopa`
            )
          );
        }
      }}
    />
  );
};
export default withParties(Header);
