import { identityTokenStorageOps } from '../identity-token-storage';

afterEach(() => {
  identityTokenStorageOps.delete();
});

describe('identityTokenStorageOps', () => {
  test('returns undefined when no token has been stored', () => {
    expect(identityTokenStorageOps.read()).toBeUndefined();
  });

  test('writes and reads back the token', () => {
    identityTokenStorageOps.write('a-token');
    expect(identityTokenStorageOps.read()).toBe('a-token');
  });

  test('deletes the stored token', () => {
    identityTokenStorageOps.write('a-token');
    identityTokenStorageOps.delete();
    expect(identityTokenStorageOps.read()).toBeUndefined();
  });

  test('stores the token under a dedicated localStorage key', () => {
    identityTokenStorageOps.write('identity-token-value');
    expect(window.localStorage.getItem('selfcareIdentityToken')).toBe('identity-token-value');
  });
});
