import { Breadcrumbs, Grid, Typography } from '@mui/material';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { CIBrokerDelegationResource } from '../../../api/generated/portal/CIBrokerDelegationResource';
import { CIBrokerStationResource } from '../../../api/generated/portal/CIBrokerStationResource';
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
import { DelegationStationDetailsDrawer } from './DelegationStationDetailsDrawer';
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
  const [drawerValue, setDrawerValue] = useState<CIBrokerStationResource>({});

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
    <>
      <SideMenuLayout>
        <Breadcrumbs>
          <Typography>{t('delegationsPage.title')}</Typography>
          <Typography color={'action.active'}>{delegationDetail.institution_name ?? ''}</Typography>
        </Breadcrumbs>
        <Grid container mt={1} spacing={1}>
          <Grid item xs={12}>
            <TitleBox title={delegationDetail.institution_name ?? ''} variantTitle="h4" />
          </Grid>

          <Grid item xs={6} data-testid="payment-contacts">
            <DelegationDetailPaymentContacts paymentContacts={contacts?.ci_payment_contacts} />
          </Grid>
          <Grid item xs={6} data-testid="operative-table">
            <DelegationDetailOperativeTable operativeTable={contacts?.operative_table} />
          </Grid>
        </Grid>

        <Grid container mt={1} spacing={1}>
          <TitleBox title={t('delegationDetailPage.tableTitle')} variantTitle="h4" />
          <DelegationStationsTableSearchBar setSearchInput={setSearchInput} />
          <DelegationStationsTable
            ciTaxCode={delegationDetail.institution_tax_code ?? ''}
            filterByStationCode={searchInput}
            setDrawerValue={setDrawerValue}
          />
        </Grid>
        <DelegationStationDetailsDrawer
          drawerValue={drawerValue}
          setDrawerValue={setDrawerValue}
          t={t}
        />
      </SideMenuLayout>
      {/* <GenericModal
        title={t('commissionBundlesPage.commissionBundleDetail.modal.title')}
        message={t('commissionBundlesPage.commissionBundleDetail.modal.message')}
        openModal={showConfirmModal}
        onConfirmLabel={t('general.confirm')}
        onCloseLabel={t('general.cancel')}
        handleCloseModal={() => setShowConfirmModal(false)}
        handleConfirm={() => handleDeletePSP()}
        data-testid="delete-modal"
      /> */}
    </>
  );
};

export default DelegationDetailPage;
