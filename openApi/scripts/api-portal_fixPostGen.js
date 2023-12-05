const regexReplace = require('regex-replace');

regexReplace(
  'readonly "bundle-type"\\?: array;',
  'readonly "bundle-type"?: Array<string>;',
  'src/api/generated/portal/requestTypes.ts',
  { fileContentsOnly: true }
);

regexReplace(
  '"io-ts";',
  '"io-ts"; \n import { Buffer } from \'buffer\'; \n',
  'src/api/generated/portal/requestTypes.ts',
  { fileContentsOnly: true }
);
