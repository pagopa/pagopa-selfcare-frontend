import { ProductsResource } from '../api/generated/portal/ProductsResource';
import { PartyRole, SelfcareRole } from './Party';

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export type Product = {
  activationDateTime?: Date;
  description: string;
  id: string;
  logo?: string;
  title: string;
  urlBO: string;
  urlPublic?: string;
  selfcareRole?: SelfcareRole;
  roles: Array<UserProductRole>;
  // authorized?: boolean;
  // status: ProductStatus;
  // imageUrl: string;
  // subProducts: Array<SubProduct>;
};

type UserProductRole = {
  partyRole: PartyRole;
};
export type SubProduct = {
  id: string;
  title: string;
  status: ProductStatus;
};
export type ProductsMap = { [id: string]: Product };

export const productResource2Product = (resource: ProductsResource): Product => ({
  // activationDateTime: resource.activatedAt,
  description: resource.description,
  id: resource.id,
  // logo: resource.logo,
  title: resource.title,
  urlBO: resource.urlBO,
  urlPublic: resource.urlPublic,
  selfcareRole: (resource as any).selfcareRole as SelfcareRole, // TODO maybe it will be added to the API?
  roles: [
    {
      partyRole: (resource as any).partyRole as PartyRole, // TODO maybe it will be added to the API?
      // roleKey: resource.userRole as string,
    },
  ],
  // authorized: resource.authorized,
  // status: resource.status,
  // imageUrl: resource.imageUrl,
  // subProducts: resource.children?.slice() ?? [],
});
