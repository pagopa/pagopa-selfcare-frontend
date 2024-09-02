const regexReplace = require('regex-replace');

regexReplace(
  'readonly "bundle-type"\\?: array;',
  'readonly "bundle-type"?: Array<string>;',
  'src/api/generated/portal/requestTypes.ts',
  { fileContentsOnly: true }
);

regexReplace(
  'readonly roles\\?: array;',
  'readonly roles?: Array<string>;',
  'src/api/generated/portal/requestTypes.ts',
  { fileContentsOnly: true }
);

regexReplace(
  'readonly types\\?: array;',
  'readonly types?: Array<string>;',
  'src/api/generated/portal/requestTypes.ts',
  { fileContentsOnly: true }
);

regexReplace(
  '"io-ts";',
  '"io-ts"; \n import { Buffer } from \'buffer\'; \n',
  'src/api/generated/portal/requestTypes.ts',
  { fileContentsOnly: true }
);

regexReplace(
  'institutionsData.uri,',
  '"",',
  'src/api/generated/portal/client.ts',
  { fileContentsOnly: true }
);

regexReplace(
  'readonly bundleTypeList: array;',
  'readonly bundleTypeList: Array<TypeEnum>;',
  'src/api/generated/portal/requestTypes.ts',
  { fileContentsOnly: true }
);

regexReplace(
  'import { BundleRequest } from "./BundleRequest";',
  'import { BundleRequest, TypeEnum } from "./BundleRequest";',
  'src/api/generated/portal/requestTypes.ts',
  { fileContentsOnly: true }
);