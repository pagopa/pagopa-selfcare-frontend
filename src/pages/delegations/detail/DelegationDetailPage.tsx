import { Breadcrumbs, Grid, Typography } from '@mui/material';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { CIBrokerDelegationResource } from '../../../api/generated/portal/CIBrokerDelegationResource';
import { CreditorInstitutionContactsResource } from '../../../api/generated/portal/CreditorInstitutionContactsResource';
import SideMenuLayout from '../../../components/SideMenu/SideMenuLayout';
import { Party } from '../../../model/Party';
import { useAppSelector } from '../../../redux/hooks';
import { delegationDetailSelectors } from '../../../redux/slices/delegationDetailSlice';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { getCreditorInstitutionContacts } from '../../../services/creditorInstitutionService';
import { LOADING_TASK_CI_DELEGATION_CONTACTS_LIST } from '../../../utils/constants';
import DelegationDetailOperativeTable from './DelegationDetailOperativeTable';
import DelegationDetailPaymentContacts from './DelegationDetailPaymentContacts';
import DelegationStationsTable from './list/DelegationStationsTable';
import DelegationStationsTableSearchBar from './list/DelegationStationsTableSearchBar';

const DelegationDetailPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const selectedParty: Party | undefined = useAppSelector(partiesSelectors.selectPartySelected);
  const addError = useErrorDispatcher();

  const [contacts, setContacts] = useState<CreditorInstitutionContactsResource>();
  const [searchInput, setSearchInput] = useState<string>('');
  const setLoading = useLoading(LOADING_TASK_CI_DELEGATION_CONTACTS_LIST);

  const delegationDetail: CIBrokerDelegationResource =
    useAppSelector(delegationDetailSelectors.selectDelegationDetail) ?? {};

  useEffect(() => {
    setLoading(true);
    async function getContacts(): Promise<CreditorInstitutionContactsResource> {
      const ciTaxCode = delegationDetail.institution_tax_code ?? '';
      const institutionId = delegationDetail.institution_id ?? '';
      return await getCreditorInstitutionContacts(ciTaxCode, institutionId)
        .then((contacts) => contacts)
        .catch((error) => {
          addError(error);
          return [];
        });
    }

    Promise.all([getContacts()])
      .then(([contacts]) => {
        setContacts(contacts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedParty]);

  return (
      <SideMenuLayout>
        <Breadcrumbs>
          <Typography>{t('delegationsPage.title')}</Typography>
          <Typography color={'action.active'}>{delegationDetail.institution_name ?? ''}</Typography>
        </Breadcrumbs>
        <Grid container mt={1} spacing={1}>
          <Grid item xs={12}>
            <TitleBox title={delegationDetail.institution_name ?? ''} variantTitle="h3" />
          </Grid>

          <Grid item xs={6} mb={1} data-testid="payment-contacts">
            <DelegationDetailPaymentContacts paymentContacts={contacts?.ci_payment_contacts} />
          </Grid>
          <Grid item xs={6} data-testid="operative-table">
            <DelegationDetailOperativeTable operativeTable={contacts?.operative_table} />
          </Grid>
        </Grid>

        <Grid container mt={5} spacing={1}>
          <TitleBox title={t('delegationDetailPage.tableTitle')} variantTitle="h4" />
          <DelegationStationsTableSearchBar setSearchInput={setSearchInput} />
          <DelegationStationsTable
            ciTaxCode={delegationDetail.institution_tax_code ?? ''}
            filterByStationCode={searchInput}/>
        </Grid>
      </SideMenuLayout>
  );
};

export default DelegationDetailPage;
