# Context and Guidelines

The goal is to maintain a **flat structure** wherever feasible, minimizing the number of nested keys and hierarchical levels, with certain structural exceptions.

The preferred format for entities that include both a list and/or a selected entry follows this pattern *(note the plural form)*:

- `entities.list`
- `entities.selected`

This convention applies even when only one of these properties contains a value at any given moment.

---

**Key Principles:**
- **Minimize nesting**: Keep the structure as flat as possible
- **Consistent naming**: Use plural forms for entity collections
- **Future-proof design**: Maintain *logically* both `.list` and `.selected` properties regardless of current usage
- **Structural exceptions**: Allow deviations only when necessary

# Current API : State mapping
## Currently implemented
| **API Endpoint** | **Redux State Root Key** | **Description** |
|------------------|---------------------------|-----------------|
| `GET /institutions` | `parties.list` | Organizations/institutions list |
| `GET /institutions/{id}` | `parties.selected` | Selected institution details |
| `GET /institutions/{id}/products` | `parties.selectedProducts` | Institution products |
| `GET /creditor-institutions/{id}/full` | `parties.signinData` | Institution signin data |
| `GET /flags` | `featureFlags.list` | Feature toggles configuration |
| `GET /bundles/creditor-institutions` | `bundles.selected` | Commission bundle selected from the list |
| `GET /brokers/{id}/station-maintenances/summary` | `brokers.maintenance` | Station maintenance schedules |
| `GET /brokers/{id}/delegations` | `brokers.delegations.selected` | Delegation's detail (only after click on a delegation) |
| `GET /stations/{id}/creditor-institutions` | `brokers.delegations.selected.creditInstitutions.selected` | Station creditor institutions |
| `GET /notice/institutions/data/{id}` | `payments.paymentNoticeTemplate` | Institution data configuration used for the payment notie template |
| `GET /app-info` | `appState` | Application configuration |


---

Possible candidates

- [?] `GET /v1/creditor-institutions/99999000013/ibans`
    **Section**: IBAN

    Good candidate because:
    - few items (good fit for memory)
    - not paginated
      - search could avoid API calls and search for in-memory results
      - opening a single IBAN should not do perform again the request to fetch the ibans list

    Before integrating it, we have to carefully verify policies regarding info that we want/could to save in the local browsers

 - [?] `GET /v1/payments-receipts/:id`
    **Section**: Pagamenti CUP

    Verify if it contains sensitive data.
    Redux keys involved:
      - `payments.paymentsReceipts.list`
      - `payments.paymentsReceipts.selected` if needed


 - [NO] `GET /v1/stations?status=:status&stationCode=:stationCode&brokerCode=:brokerCode&limit=:limit`
    
    **Section**: Stazioni

    Not a good candidate because:
    - it's paginated
        - user can also change the limit
    - can have a search by code: highly specific, unlikely to be repeated
    - very complex cache key: `${status}_${stationCode}_${brokerCode}_${limit}_${page}` --> hard to maintain (small simplifications can be applied)

    Redux keys involved:
      - `stations.list`

- [NO] `GET backoffice/v1/bundles/creditor-institutions`

    Not a good candidate because:
      - it's paginated
          - user can also change the limit
      - can have a search by name: highly specific, unlikely to be repeated
      - very complex cache key, hard to maintain (small simplifications can be applied)

    Redux keys involved:
        - `brokers.delegations.selected.creditInstitutions.list`