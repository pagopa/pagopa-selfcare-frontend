import { NodeOnSignInPSP } from '../../model/Node';
import { PSPDirectDTO } from '../../model/PSP';

const pspDirect = {
  abi: 'abi',
  agid_psp: true,
  bic: 'bic',
  business_name: 'business_name',
  enabled: true,
  my_bank_code: 'my_bank_code',
  psp_code: 'psp_code',
  stamp: true,
  tax_code: 'tax_code',
  transfer: true,
  vat_number: 'vat_number',
};

export const createPSPDirect = (_psp: NodeOnSignInPSP): Promise<PSPDirectDTO> =>
  new Promise((resolve) => resolve(pspDirect));
