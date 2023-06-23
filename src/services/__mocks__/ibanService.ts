export const ibanList: any = [
  {
    ci_owner: '77777777777',
    company_name: 'Comune di Firenze',
    description: 'Riscossione Tributi',
    due_date: '2023-12-31T23:59:59.999Z',
    iban: 'IT99C0222211111000000000000',
    is_active: true,
    labels: [
      {
        description: 'The IBAN to use for CUP payments',
        name: 'CUP',
      },
    ],
    publication_date: '2023-06-01T23:59:59.999Z',
    validity_date: '2023-04-01T13:49:19.897Z',
  },
  {
    ci_owner: '77777777777',
    company_name: 'Comune di Firenze',
    description: 'Riscossione Tributi',
    due_date: '2023-12-31T23:59:59.999Z',
    iban: 'IT99C0222211111000000000001',
    is_active: true,
    labels: [
      {
        description: 'The IBAN to use for CUP payments',
        name: 'CUP',
      },
    ],
    publication_date: '2023-06-01T23:59:59.999Z',
    validity_date: '2023-04-01T13:49:19.897Z',
  },
  {
    ci_owner: '77777777777',
    company_name: 'Comune di Firenze',
    description: 'Riscossione Tributi',
    due_date: '2023-12-31T23:59:59.999Z',
    iban: 'IT99C0222211111000000000002',
    is_active: true,
    labels: [
      {
        description: 'The IBAN to use for CUP payments',
        name: 'CUP',
      },
    ],
    publication_date: '2023-06-01T23:59:59.999Z',
    validity_date: '2023-04-01T13:49:19.897Z',
  },
];

export const getIbanList = (_istitutionId: string): Promise<any> =>
  new Promise((resolve) => resolve(ibanList));

export const getIbanDetail = (_iban: string): Promise<any> =>
  new Promise((resolve) => resolve(ibanList[0]));
