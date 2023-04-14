import { ProductsResource } from '../api/generated/portal/ProductsResource';
import { SelfcareRole, UserRole } from './Party';

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
  roles: Array<UserRole>;
  authorized?: boolean;
  status: ProductStatus;
  imageUrl: string;
  subProducts: Array<SubProduct>;
};

export type SubProduct = {
  id: string;
  title: string;
  status: ProductStatus;
};
export type ProductsMap = { [id: string]: Product };

export const productResource2Product = (resource: ProductsResource): Product => ({
  description: resource.description,
  id: resource.id,
  title: resource.title,
  urlBO: resource.urlBO,
  urlPublic: resource.urlPublic,
  selfcareRole: 'ADMIN', // TODO maybe it will be added to the API?
  roles: [],
  authorized: true,
  status: 'ACTIVE',
  imageUrl: '',
  subProducts: [],
});
