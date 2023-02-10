const IS_DEVELOP = process.env.NODE_ENV === 'development';

export const testToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NzU2OTA1MjIsImF1ZCI6ImFwaS5wbGF0Zm9ybS5wYWdvcGEuaXQiLCJpc3MiOiJodHRwczovL2FwaS5kZXYucGxhdGZvcm0ucGFnb3BhLml0IiwidWlkIjoiNTA5NmU0YzYtMjVhMS00NWQ1LTliZGYtMmZiOTc0YTdjMWM4IiwibmFtZSI6IkFuc2VsbW8iLCJmYW1pbHlfbmFtZSI6IlNhcnRvcmkiLCJlbWFpbCI6ImZ1cmlvdml0YWxlQG1hcnRpbm8uaXQiLCJvcmdfaWQiOiJlMTYyY2EzYi1mZTVhLTRiZmQtYTBiNy0xY2ExNTg2ZDA3OWUiLCJvcmdfdmF0IjoiMDAxMDQzMzA0OTMiLCJvcmdfcGFydHlfcm9sZSI6IkRFTEVHQVRFIiwib3JnX3JvbGUiOiJhZG1pbiJ9.BHW8m_cIkNTMd3diydLcDORcOPXQcY_LTa56xCGZ8uT5QYK5o5VEGbJrR4F8b4wUrQXTI9A67ztHxNYh4YVo-CvHtWS78wliYPyF9l_wv_1zZCbB2MzGueXNllIOeHxqWnDVSn-6D3Uq--12z3_Km34r5Nm0NNewm0tPtFZ4H2AqxyACA0JSZUh5tp4_sV9m2AZ1WUxmmhed_S6J72tAn1byis84N9vBpNTLAvhWBMbiZ2g_65T3C7p2KSYNgrilMFJ4TA6fCkzhqaFbrvb5aHFzUigF1m8G13iNpuFlb9dcvHec_uztRPZwJYq2UsD9btavcqH30B-55cI-NE_xcw';

export const MOCK_USER = IS_DEVELOP;
export const LOG_REDUX_ACTIONS = IS_DEVELOP;

export const LOADING_TASK_LOGIN_CHECK = 'LOGIN_CHECK';
export const LOADING_TASK_SEARCH_PARTIES = 'SEARCH_PARTIES';
export const LOADING_TASK_SEARCH_PARTY = 'SEARCH_PARTY';
export const LOADING_TASK_SEARCH_PRODUCTS = 'SEARCH_PRODUCTS';
export const LOADING_TASK_API_KEY_GENERATION = 'API_KEY_GENERATION';
