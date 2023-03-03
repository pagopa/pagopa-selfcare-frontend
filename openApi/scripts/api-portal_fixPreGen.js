const regexReplace = require('regex-replace');

regexReplace(
  /\,[\s]*\{[\s]*"name": "X-Request-Id"\,[\s]*"in": "header"\,[\s]*"description": "internal request trace id"\,[\s]*"required": false\,[\s]*"schema": \{[\s]*"type": "string"[\s]*\}[\s]*\}|[\s]*\{[\s]*"name": "X-Request-Id"\,[\s]*"in": "header"\,[\s]*"description": "internal request trace id"\,[\s]*"required": false\,[\s]*"schema": \{[\s]*"type": "string"[\s]*\}[\s]*\}/gi,
  ' ',
  'openApi/portal-api-docs.json',
  {
    fileContentsOnly: true,
  }
);
