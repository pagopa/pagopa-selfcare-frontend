import 'react-i18next';

declare module 'react-i18next' {
  export type TFunction<Ns = string, KPrefix = undefined> = (
    key: string,
    ...args: Array<unknown>
  ) => string;
}
