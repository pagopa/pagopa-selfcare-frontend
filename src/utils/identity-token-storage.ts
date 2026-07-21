const SELFCARE_IDENTITY_TOKEN_KEY = 'selfcareIdentityToken';

export const identityTokenStorageOps = {
  read: (): string | undefined => window.localStorage.getItem(SELFCARE_IDENTITY_TOKEN_KEY) ?? undefined,
  write: (token: string) => window.localStorage.setItem(SELFCARE_IDENTITY_TOKEN_KEY, token),
  delete: () => window.localStorage.removeItem(SELFCARE_IDENTITY_TOKEN_KEY),
};
