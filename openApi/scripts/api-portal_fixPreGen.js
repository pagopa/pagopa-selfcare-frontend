const regexReplace = require('regex-replace');

regexReplace(
  `\{\n "name":s"X-Request-Id",\\n "in":s"header",\\n "description": "internal request trace id",\\n "required": false,\\n "schema": {\n "type": "string"\n }\n\}`,
  'ccc',
  'openApi/portal-api-docs.json',
  { fileContentsOnly: true }
);
