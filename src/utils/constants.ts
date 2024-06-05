import * as env from "env-var";

const IS_DEVELOP = process.env.NODE_ENV === 'development';

export const testToken: string = env.get('REACT_APP_JWT').default('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MTc0MTg3MDMsImV4cCI6MTcxNzQ0NzUwMywiYXVkIjoiYXBpLnBsYXRmb3JtLnBhZ29wYS5pdCIsImlzcyI6Imh0dHBzOi8vYXBpLmRldi5wbGF0Zm9ybS5wYWdvcGEuaXQiLCJ1aWQiOiI1MDk2ZTRjNi0yNWExLTQ1ZDUtOWJkZi0yZmI5NzRhN2MxYzgiLCJuYW1lIjoiQW5zZWxtbyIsImZhbWlseV9uYW1lIjoiU2FydG9yaSIsImVtYWlsIjoiIiwib3JnX2lkIjoiY2ViMTE0ODItMDIyZi00NjdmLTliMmYtZDMwNzJhZDcyNzY4Iiwib3JnX3ZhdCI6Ijk5OTk5MDAwMDA0Iiwib3JnX3BhcnR5X3JvbGUiOiJNQU5BR0VSIiwib3JnX3JvbGUiOiJhZG1pbiJ9.hdLjxLnFID9mDFKQ-gUfKheN3F4PT-g6UXxkiYgylbOntBjskteVat5E14NXZWf_c5v8VOw4VIoOQIdSdZg4EsK3kTC5J9CRmd8F3pzPx3452juAd131fiMnHECh4-D_Nnmy_hAe639zpm6siGYCBKRmXjdoMAHLRFGezfOO9ZNnj-uZlo0B_x3EM0VWnbZcfYPs0IAFkLeIs862II5ZkP9sUkTbjmU1Un3wKSuS4AGBX0jnsI4cqwDAwJtDeaU9fLplgNgXqFpL_dRn_AsnzqH0KgLSILm-yInnTsCXLKBox79gC9IiPyNf9DCg4_PoNMSIFRddMdMNZFyvI3emaA').asString();
export const MOCK_USER = IS_DEVELOP;
export const LOG_REDUX_ACTIONS = false;

export const LOADING_TASK_LOGIN_CHECK = 'LOGIN_CHECK';
export const LOADING_TASK_SEARCH_PARTIES = 'SEARCH_PARTIES';
export const LOADING_TASK_SEARCH_PARTY = 'SEARCH_PARTY';
export const LOADING_FEATURE_FLAGS = 'LOADING_FEATURE_FLAGS';
export const LOADING_TASK_SEARCH_PRODUCTS = 'SEARCH_PRODUCTS';
export const LOADING_TASK_API_KEY_GENERATION = 'API_KEY_GENERATION';
export const LOADING_TASK_PSP_AVAILABLE = 'PSP_AVAILABLE';
export const LOADING_TASK_CHANNELS_LIST = 'CHANNELS_LIST';
export const LOADING_TASK_CHANNEL_ADD_EDIT = 'CHANNEL_ADD_EDIT';
export const LOADING_TASK_CHANNEL_DETAIL = 'CHANNEL_DETAIL';
export const LOADING_TASK_CHANNEL_PSP_TABLE = 'CHANNEL_PSP_TABLE';
export const LOADING_TASK_STATION_ADD_EDIT = 'STATIONS_ADD_EDIT';
export const LOADING_TASK_STATION_DETAILS = 'STATION_DETAILS';
export const LOADING_TASK_STATION_DETAILS_WRAPPER = 'STATION_DETAILS_WRAPPER';
export const LOADING_TASK_STATION_DETAILS_REQUEST_EDIT = 'STATION_DETAILS_REQUEST_EDIT';
export const LOADING_TASK_STATION_EC_TABLE = 'STATION_EC_TABLE';
export const LOADING_TASK_EC_AVAILABLE = 'EC_AVAILABLE';
export const LOADING_TASK_SEGREGATION_CODES_AVAILABLE = 'EC_AVAILABLE';
export const LOADING_TASK_GENERATION_STATION_CODE = 'GENERATE_STATION_CODE';
export const LOADING_TASK_RETRIEVE_STATIONS = 'RETRIEVE_STATIONS';
export const LOADING_TASK_NODE_SIGN_IN_PSP = 'NODE_SING_IN_PSP';
export const LOADING_TASK_NODE_SIGN_IN_EC = 'NODE_SING_IN_EC';
export const LOADING_TASK_DASHBOARD_GET_EC_PSP_DETAILS = 'DASHBOARD_GET_EC_PSP_DETAILS';
export const LOADING_TASK_DASHBOARD = 'DASHBOARD';
export const LOADING_TASK_CHANNEL_WRAPPER_DETAIL = 'CHANNEL_WRAPPER_DETAIL';
export const LOADING_TASK_PAYMENT_TYPE = 'PAYMENT_TYPE';
export const LOADING_TASK_IBAN_TABLE = 'IBAN_TABLE';
export const LOADING_TASK_IBAN_STAND_IN_AND_CUP = 'IBAN_STAND_IN_AND_CUP';
export const LOADING_TASK_GET_IBAN = 'GET_IBAN';
export const LOADING_TASK_CREATE_IBAN = 'CREATE_IBAN';
export const LOADING_TASK_DELETE_IBAN = 'DELETE_IBAN';
export const LOADING_TASK_COMMISSION_BUNDLE_LIST = 'COMMISSION_BUNDLE_LIST';
export const LOADING_TASK_COMMISSION_BUNDLE_DETAIL = 'COMMISSION_BUNDLE_DETAIL';
export const LOADING_TASK_COMMISSION_BUNDLE_SELECT_DATAS = 'COMMISSION_BUNDLE_SELECT_DATAS';
export const LOADING_TASK_COMMISSION_BUNDLE_ACTIVATION = 'COMMISSION_BUNDLE_ACTIVATION';
export const LOADING_TASK_CREATING_COMMISSION_BUNDLE = 'CREATING_COMMISSION_BUNDLE';
export const LOADING_TASK_GET_CHANNELS_IDS = 'GET_CHANNELS_IDS';
export const LOADING_TASK_OPERATION_TABLE_LIST = 'OPERATION_TABLE_LIST';
export const LOADING_TASK_CREATE_OPERATION_TABLE = 'CREATE_OPERATION_TABLE';
export const LOADING_TASK_CI_DELEGATIONS_LIST = 'CI_DELEGATIONS_LIST';
export const LOADING_TASK_PAYMENTS_RECEIPTS = 'PAYMENTS_RECEIPTS';
export const LOADING_TASK_CI_DELEGATION_CONTACTS_LIST = 'CI_DELEGATION_CONTACTS_LIST';
export const LOADING_TASK_CI_DELEGATION_STATIONS_LIST = 'CI_DELEGATION_STATIONS_LIST';
export const LOADING_TASK_SUBSCRIPTION_LIST = 'SUBSCRIPTION_LIST';
export const LOADING_TASK_SUBSCRIPTION_ACTION = "SUBSCRIPTION_ACTION";
export const LOADING_TASK_OFFER_LIST = 'OFFER_LIST';
export const LOADING_TASK_OFFER_ACTION = "OFFER_ACTION";
export const LOADING_TASK_INSTITUTION_DATA_GET = "INSTITUTION_DATA_GET";
export const LOADING_TASK_INSTITUTION_DATA_ADD_EDIT = "INSTITUTION_DATA_ADD_EDIT";
export const INSTITUTIONS_PSP_TYPES = ['PSP'];
export const INSTITUTIONS_EC_TYPES = ['PA', 'GSP', 'SCP', 'PG'];
export const INSTITUTIONS_PT_TYPES = ['PT'];
export const DISALLOWED_PAYMENT_TYPES = ['PO', 'OBEP', 'JIF', 'BP', 'BBT', 'AD'];
