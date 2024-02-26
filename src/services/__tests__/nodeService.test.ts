import { updatePSPInfo } from '../nodeService';
import { pspDirect } from '../__mocks__/nodeService';
import { NodeOnSignInPSP } from '../../model/Node';

const inputNodeOnSignInPSP : NodeOnSignInPSP = {
    name: '',
    businessName: '',
    fiscalCode: '',
    abiCode: '',
    pspCode: '',
    bicCode: '',
    digitalStamp: false
};

describe('Node Service test', () => {
    test('Test updatePSPInfo', async () => {
      const delegates = await updatePSPInfo("psp-tax-code", inputNodeOnSignInPSP );
      expect(delegates).toMatchObject(pspDirect);
    });
  });
  