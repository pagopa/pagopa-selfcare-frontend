| **API Endpoint** | **Redux State Root Key** | **Description** |
|------------------|---------------------------|-----------------|
| `GET /institutions` | `parties.list` | Organizations/institutions list |
| `GET /institutions/{id}` | `parties.selected` | Selected institution details |
| `GET /institutions/{id}/products` | `parties.selectedProducts` | Institution products |
| `GET /creditor-institutions/{id}/full` | `parties.signinData` | Institution signin data |
| `GET /flags` | `featureFlags` | Feature toggles configuration |
| `GET /bundles/creditor-institutions` | `bundles.selected` | Commission bundle selected from the list |
| `GET /brokers/{id}/delegations` | `delegationDetail` | Delegation's detail (only after click on a delegation) |
| `GET /notice/institutions/data/{id}` | `institutionDataDetails` | Institution data configuration |
| `GET /stations/{id}/creditor-institutions` | `stationCI` | Station creditor institutions |
| `GET /brokers/{id}/station-maintenances/summary` | `stationMaintenance` | Station maintenance schedules |
| `GET /payment-receipts` | `payments.receipts` | Payment receipts |
| `GET /payment-notices` | `payments.notices` | Payment notices |
| `GET /app-info` | `appState` | Application configuration |


---

Possible candidates

 - [NO] `GET /v1/stations?status=:status&stationCode=:stationCode&brokerCode=:brokerCode&limit=:limit`
    
    **Section**: Stazioni

    Not a good candidate because:
    - it's paginated
        - user can also change the limit
    - can have a search by code: highly specific, unlikely to be repeated
    - very complex cache key: `${status}_${stationCode}_${brokerCode}_${limit}_${page}` --> hard to maintain (small simplifications can be applied)

- [YES] `GET /v1/creditor-institutions/99999000013/ibans`
    
    **Section**: IBAN

    Good candidate because:
    - few items (good fit for memory)
    - not paginated
      - search could avoid API calls and search for in-memory results

- [NO] `GET backoffice/v1/bundles/creditor-institutions`

  Not a good candidate because:
    - it's paginated
        - user can also change the limit
    - can have a search by name: highly specific, unlikely to be repeated
    - very complex cache key, hard to maintain (small simplifications can be applied)