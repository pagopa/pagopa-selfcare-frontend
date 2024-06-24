/* eslint-disable functional/immutable-data */
import {CONFIG} from '@pagopa/selfcare-common-frontend/config/env';
import {ENV} from './utils/env';
<<<<<<< HEAD
=======
import '@pagopa/selfcare-common-frontend/consentManagementConfigure';
>>>>>>> 3f32cfc3 (Formatting (#542))

CONFIG.ANALYTCS.ENABLE = ENV.ANALYTCS.ENABLE;
CONFIG.ANALYTCS.MOCK = ENV.ANALYTCS.MOCK;
CONFIG.ANALYTCS.DEBUG = ENV.ANALYTCS.DEBUG;
CONFIG.ANALYTCS.TOKEN = ENV.ANALYTCS.TOKEN;
CONFIG.ANALYTCS.API_HOST = ENV.ANALYTCS.API_HOST;
CONFIG.ANALYTCS.ADDITIONAL_PROPERTIES_IMPORTANT = {env: ENV.ENV};

