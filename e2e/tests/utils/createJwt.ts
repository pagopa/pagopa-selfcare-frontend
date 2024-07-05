import fs from 'fs';
import jwt, { SignOptions } from 'jsonwebtoken';

export function createJWT(org_id: string): string {
  // eslint-disable-next-line functional/no-let
  let cert: string | Buffer | undefined = process.env.KEY_PEM;
  if (!cert) {
    console.log('read cert from file');
    cert = fs.readFileSync('./key.pem');
  }

  const payload: object = {
    iat: Date.now(),
    aud: 'api.platform.pagopa.it',
    iss: 'https://api.dev.platform.pagopa.it',
    uid: '5096e4c6-25a1-45d5-9bdf-2fb974a7c1c8',
    name: 'Anselmo',
    family_name: 'Sartori',
    email: 'furiovitale@martino.it',
    org_id,
    org_vat: '00000000000',
    org_party_role: 'MANAGER',
    org_role: 'admin',
  };

  const signOptions: SignOptions = {
    algorithm: 'RS256',
    expiresIn: '4h',
  };

  return jwt.sign(payload, cert, signOptions);
}
