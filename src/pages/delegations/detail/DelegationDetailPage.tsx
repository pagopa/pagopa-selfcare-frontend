import { ArrowBack } from '@mui/icons-material';
import { Breadcrumbs, Grid, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { CIBrokerDelegationResource } from '../../../api/generated/portal/CIBrokerDelegationResource';
import { CreditorInstitutionContactsResource } from '../../../api/generated/portal/CreditorInstitutionContactsResource';
import SideMenuLayout from '../../../components/SideMenu/SideMenuLayout';
import TableSearchBar from '../../../components/Table/TableSearchBar';
import { Party } from '../../../model/Party';
import { useAppSelector } from '../../../redux/hooks';
import { delegationDetailSelectors } from '../../../redux/slices/delegationDetailSlice';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import ROUTES from '../../../routes';
import { getCreditorInstitutionContacts } from '../../../services/creditorInstitutionService';
import { LOADING_TASK_CI_DELEGATION_CONTACTS_LIST } from '../../../utils/constants';
import DelegationDetailOperativeTable from './DelegationDetailOperativeTable';
import DelegationStationsTable from './list/DelegationStationsTable';

const DelegationDetailPage = () => {
  const { t } = useTranslation();
  const selectedParty: Party | undefined = useAppSelector(partiesSelectors.selectPartySelected);
  const addError = useErrorDispatcher();
  const history = useHistory();

  const [contacts, setContacts] = useState<CreditorInstitutionContactsResource>();
  const [searchInput, setSearchInput] = useState<string>('');
  const setLoading = useLoading(LOADING_TASK_CI_DELEGATION_CONTACTS_LIST);

  const delegationDetail: CIBrokerDelegationResource =
    useAppSelector(delegationDetailSelectors.selectDelegationDetail) ?? {};

  useEffect(() => {
    setLoading(true);
    const ciTaxCode = delegationDetail.institution_tax_code ?? '';
    const institutionId = delegationDetail.institution_id ?? '';
    getCreditorInstitutionContacts(ciTaxCode, institutionId)
      .then((contacts) => setContacts(contacts))
      .catch((reason) =>
        addError({
          id: 'DELEGATION_GET_CI_CONTACTS',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while retrieving creditor institution's contacts`,
          toNotify: true,
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t('delegationDetailPage.retrieveContacsErrorMessage'),
          component: 'Toast',
        })
      )
      .finally(() => setLoading(false));
  }, [selectedParty]);

  return (
    <SideMenuLayout>
      <Stack direction="row">
        <ButtonNaked
          size="small"
          component="button"
          onClick={() => history.push(ROUTES.DELEGATIONS_LIST)}
          startIcon={<ArrowBack />}
          sx={{ color: 'primary.main', mr: '20px' }}
          weight="default"
          data-testid="exit-btn-test"
        >
          {t('general.back')}
        </ButtonNaked>
        <Breadcrumbs>
          <Typography>{t('delegationsPage.title')}</Typography>
          <Typography color={'action.active'}>{delegationDetail.institution_name ?? ''}</Typography>
        </Breadcrumbs>
      </Stack>
      <TitleBox title={delegationDetail.institution_name ?? ''} variantTitle="h3" mtTitle={3} />

      <Grid container mt={1} spacing={1}>
        {/* <Grid item xs={6} mb={1} data-testid="payment-contacts">
          <DelegationDetailPaymentContacts paymentContacts={contacts?.ci_payment_contacts} />
        </Grid> */}
        <Grid item xs={12} data-testid="operative-table">
          <DelegationDetailOperativeTable operativeTable={contacts?.operative_table} />
        </Grid>
      </Grid>

      <TitleBox title={t('delegationDetailPage.tableTitle')} variantTitle="h4" mtTitle={5} />
      <TableSearchBar handleSearchTrigger={setSearchInput} componentName="delegationDetailPage" />
      <DelegationStationsTable
        ciTaxCode={delegationDetail.institution_tax_code ?? ''}
        filterByStationCode={searchInput}
      />
    </SideMenuLayout>
  );
};

export default DelegationDetailPage;
