const regexReplace = require('regex-replace');

regexReplace(
  /("format": *"uri",[\s]*"type": "string")/gi,
  '"$ref": "#/definitions/STRINGWrapper"',
  'openApi/generated/portal-swagger20.json',
  { fileContentsOnly: true }
);
