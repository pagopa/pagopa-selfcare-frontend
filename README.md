# Selfcare Backoffice Frontend
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=pagopa_pagopa-selfcare-frontend&metric=alert_status)](https://sonarcloud.io/dashboard?id=pagopa_pagopa-selfcare-frontend)
[![Integration Tests](https://github.com/pagopa/pagopa-selfcare-frontend/actions/workflows/ci_integration_test.yml/badge.svg?branch=main)](https://github.com/pagopa/pagopa-selfcare-frontend/actions/workflows/ci_integration_test.yml)

- https://selfcare.dev.platform.pagopa.it/ui
- https://selfcare.uat.platform.pagopa.it/ui
- https://selfcare.platform.pagopa.it/ui

## Check the last report of integration test
https://pagopa.github.io/pagopa-selfcare-frontend/

## To configure the workspace execute the following commands
`yarn install`

`yarn generate`

## To execute locally a configured workspace execute the following command
- `yarn start`

## To execute locally mocking REST invocation, modify the file .env.development.local setting
- REACT_APP_API_MOCK_PORTAL=true

## To build a configured workspace execute the following command
`yarn build`

## To execute a coverage check based on unit test execute the following command
`yarn test:coverage`

## How to retrieve the test token for local run

### Token Configuration
In `constants.ts` you can set a test token with a default fallback value when the environment variable is not configured.

### Retrieving the Token
To obtain a valid test token for local development:

1. **Access Development Environment**
   - Navigate to the dev environment
   - Complete the SPID login process

2. **Select Demo Configuration**
   - Choose the demo EC/PSP account

3. **Extract Authorization Header**
   - Open browser Developer Tools
   - Monitor network requests (e.g., `/flags` endpoint)
   - Copy the `Authorization` header value

### Local Setup
Set the extracted token value in your local environment:

```bash
# File: .env.development.local
REACT_APP_JWT=your_authorization_token_here