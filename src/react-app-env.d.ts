/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'uat' | 'production';

    REACT_APP_API_MOCK_BACKOFFICE: string;

    REACT_APP_API_MOCK_TOKEN: string;
  }
}
interface Window {
  Stripe: any;
}
