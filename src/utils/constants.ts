const IS_DEVELOP = process.env.NODE_ENV === 'development';

// export const testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NzU2OTA1MjIsImF1ZCI6ImFwaS5wbGF0Zm9ybS5wYWdvcGEuaXQiLCJpc3MiOiJodHRwczovL2FwaS5kZXYucGxhdGZvcm0ucGFnb3BhLml0IiwidWlkIjoiNTA5NmU0YzYtMjVhMS00NWQ1LTliZGYtMmZiOTc0YTdjMWM4IiwibmFtZSI6IkFuc2VsbW8iLCJmYW1pbHlfbmFtZSI6IlNhcnRvcmkiLCJlbWFpbCI6ImZ1cmlvdml0YWxlQG1hcnRpbm8uaXQiLCJvcmdfaWQiOiJlMTYyY2EzYi1mZTVhLTRiZmQtYTBiNy0xY2ExNTg2ZDA3OWUiLCJvcmdfdmF0IjoiMDAxMDQzMzA0OTMiLCJvcmdfcGFydHlfcm9sZSI6IkRFTEVHQVRFIiwib3JnX3JvbGUiOiJhZG1pbiJ9.BHW8m_cIkNTMd3diydLcDORcOPXQcY_LTa56xCGZ8uT5QYK5o5VEGbJrR4F8b4wUrQXTI9A67ztHxNYh4YVo-CvHtWS78wliYPyF9l_wv_1zZCbB2MzGueXNllIOeHxqWnDVSn-6D3Uq--12z3_Km34r5Nm0NNewm0tPtFZ4H2AqxyACA0JSZUh5tp4_sV9m2AZ1WUxmmhed_S6J72tAn1byis84N9vBpNTLAvhWBMbiZ2g_65T3C7p2KSYNgrilMFJ4TA6fCkzhqaFbrvb5aHFzUigF1m8G13iNpuFlb9dcvHec_uztRPZwJYq2UsD9btavcqH30B-55cI-NE_xcw';

export const testToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2OTc0NTEyMDksImV4cCI6MTY5NzQ4MDAwOSwiYXVkIjoiYXBpLnBsYXRmb3JtLnBhZ29wYS5pdCIsImlzcyI6Imh0dHBzOi8vYXBpLmRldi5wbGF0Zm9ybS5wYWdvcGEuaXQiLCJ1aWQiOiIxZGUyOTBhNy04NzJjLTQ1MWQtYTY2MC1kNTk5MTExNzEwZGQiLCJuYW1lIjoiT3JmZW8iLCJmYW1pbHlfbmFtZSI6IlBhbG1pZXJpIiwiZW1haWwiOiJmb2xjbzQxQGZhc3R3ZWJuZXQuaXQiLCJvcmdfaWQiOiI1OTQyYjMwMy0zY2NmLTQ2MzAtYWMyNS02NzI1M2I3MzE3MDMiLCJvcmdfdmF0IjoiNzY4NDkwMTAxMDIiLCJvcmdfcGFydHlfcm9sZSI6Ik1BTkFHRVIiLCJvcmdfcm9sZSI6ImFkbWluIn0.j8AAhxYWsw4fG98c81hqZ3rkDl1Ay7OgpTzS0AqfGiwpLWavgsr71p66n-xKvmyMJ-3vgDOyE5zsw4P5oxsysHOsFsLh6B9AeEQL9NEevRozaNfF8o1DCcA7wex1mgH9fJzzSxDlQrliidqskrff7Am3--KL5apZ9S7O6gYw5qJziN7hNlSAT8lsvmdjkjxLCumNZ-1kw_SDUoj3Df0d9cAjUmd4CX8u56S4_zPzt7DwQR1RJS2IO2pg4LhF0DylOjOObFvqBJQNvxFkkpTel_E5XYEC27vjDR0dHDN_qT_ePZ6gCvqDM4wv47C7KBkk7QHrXQSiPBkBPnuvpePBBw';

export const MOCK_USER = IS_DEVELOP;
export const LOG_REDUX_ACTIONS = IS_DEVELOP;

export const LOADING_TASK_LOGIN_CHECK = 'LOGIN_CHECK';
export const LOADING_TASK_SEARCH_PARTIES = 'SEARCH_PARTIES';
export const LOADING_TASK_SEARCH_PARTY = 'SEARCH_PARTY';
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
export const LOADING_TASK_STATION_EC_TABLE = 'STATION_EC_TABLE';
export const LOADING_TASK_EC_AVAILABLE = 'EC_AVAILABLE';
export const LOADING_TASK_SEGREGATION_CODES_AVAILABLE = 'EC_AVAILABLE';
export const LOADING_TASK_GENERATION_STATION_CODE = 'GENERATE_STATION_CODE';
export const LOADING_TASK_RETRIEVE_STATIONS = 'RETRIEVE_STATIONS';
export const LOADING_TASK_NODE_SIGN_IN_PSP = 'NODE_SING_IN_PSP';
export const LOADING_TASK_NODE_SIGN_IN_EC = 'NODE_SING_IN_EC';
export const LOADING_TASK_DASHBOARD_GET_EC_PSP_DETAILS = 'DASHBOARD_GET_EC_PSP_DETAILS';
export const LOADING_TASK_CHANNEL_WRAPPER_DETAIL = 'CHANNEL_WRAPPER_DETAIL';
export const LOADING_TASK_PAYMENT_TYPE = 'LOADING_TASK_PAYMENT_TYPE';
export const LOADING_TASK_IBAN_TABLE = 'LOADING_TASK_IBAN_TABLE';
export const LOADING_TASK_IBAN_STAND_IN_AND_CUP = 'LOADING_TASK_IBAN_STAND_IN_AND_CUP';
export const LOADING_TASK_GET_IBAN = 'LOADING_TASK_GET_IBAN';
export const LOADING_TASK_CREATE_IBAN = 'LOADING_TASK_CREATE_IBAN';
export const LOADING_TASK_DELETE_IBAN = 'LOADING_TASK_DELETE_IBAN';
export const LOADING_TASK_COMMISSION_PACKAGE_DETAIL = 'LOADING_TASK_COMMISSION_PACKAGE_DETAIL';
export const LOADING_TASK_COMMISSION_PACKAGE_SELECT_DATAS =
  'LOADING_TASK_COMMISSION_PACKAGE_SELECT_DATAS';
export const LOADING_TASK_CREATING_COMMISSION_PACKAGE = 'LOADING_TASK_CREATING_COMMISSION_PACKAGE';
