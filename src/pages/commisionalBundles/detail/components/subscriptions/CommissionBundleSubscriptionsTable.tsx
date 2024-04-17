/* eslint-disable functional/no-let */
import { Select, MenuItem, Pagination, FormControl, InputLabel, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { GridColDef } from '@mui/x-data-grid';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useState, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GenericModal from '../../../../../components/Form/GenericModal';
import { CustomDataGrid } from '../../../../../components/Table/CustomDataGrid';
import TableEmptyState from '../../../../../components/Table/TableEmptyState';
import TableSearchBar from '../../../../../components/Table/TableSearchBar';
import { useAppSelector } from '../../../../../redux/hooks';
import { partiesSelectors } from '../../../../../redux/slices/partiesSlice';
import { LOADING_TASK_SUBSCRIPTION_LIST } from '../../../../../utils/constants';
import { buildColumnDefs } from './CommissionBundleSubscriptionsColumns';
import { CommissionBundleSubscriptionsDrawer } from './CommissionBundleSubscriptionsDrawer';

const rowHeight = 64;
const headerHeight = 56;
const pageLimit = 5;

const componentPath = 'commissionBundlesPage.commissionBundleDetail.subscriptionsTable';

const emptySubriptionList = {
  total_pages: 0,
  results: [{ business_name: 'NOME BUSINESS', ci_tax_code: 'CI_TAX_CODE' }],
}; // TODO TYPE AND CORRECT EMPTY STATE

export enum SubscriptionStateType {
  Waiting = 'waiting',
  Accepted = 'accepted',
}

const CommissionBundleSubscriptionsTable = () => {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoading = useLoading(LOADING_TASK_SUBSCRIPTION_LIST);

  const { bundleId } = useParams<{ bundleId: string }>();

  const [filterState, setFilterState] = useState<SubscriptionStateType>(
    SubscriptionStateType.Waiting
  );
  const [selectedState, setSelectedState] = useState<SubscriptionStateType>(filterState);
  const [filterCiTaxCode, setFilterCiTaxCode] = useState<string>('');
  const [page, setPage] = useState<number>(0);

  const [drawerValue, setDrawerValue] = useState<any>({}); // TODO TYPE
  const [openMenageSubscriptionModal, setOpenMenageSubscriptionModal] = useState<
    string | undefined
  >(undefined);

  const [subscriptionList, setSubscriptionList] = useState<any>(emptySubriptionList); // TODO TYPE & EMPTY STATE

  const columns: Array<GridColDef> = buildColumnDefs(t, selectedState, setDrawerValue);

  const getSubscriptionList = (newPage?: number) => {
    setLoading(true);
    setSelectedState(filterState);

    // TODO IMPLEMENT API
    const getSubRes = Promise.resolve(emptySubriptionList);
    getSubRes
      .then((res: any) => {
        if (res?.results && res.results.length > 0) {
          setSubscriptionList(res);
        } else {
          setSubscriptionList(emptySubriptionList);
        }
      })
      .catch((reason) =>
        addError({
          id: 'COMMISSION_BUNDLE_GET_SUBSCRIPTION',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while retrieving bundle's subscriptions requests`,
          toNotify: true,
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t(`${componentPath}.error.errorGetList`),
          component: 'Toast',
        })
      )
      .finally(() => setLoading(false));
  };

  const handleConfirmModal = async () => {
    const actionType = openMenageSubscriptionModal;
    setOpenMenageSubscriptionModal(undefined);

    let promise: Promise<string> = Promise.reject(new Error('Wrong action'));
    let actionId: string = 'COMMISSION_BUNDLE_SUBSCRIPTION_ACTION';
    let errorDescription = 'general.errorDescription';
    if (actionType === 'reject') {
      promise = Promise.resolve('reject'); // TODO IMPLEMENT REJECT API
      actionId = 'COMMISSION_BUNDLE_REJECT_SUBSCRIPTION';
      errorDescription = `${componentPath}.error.errorReject`;
    } else if (actionType === 'accept') {
      promise = Promise.resolve('accept'); // TODO IMPLEMENT ACCEPT API
      actionId = 'COMMISSION_BUNDLE_ACCEPT_SUBSCRIPTION';
      errorDescription = `${componentPath}.error.errorAccept`;
    } else if (actionType === 'delete') {
      promise = Promise.resolve('delete'); // TODO IMPLEMENT DELETE API
      actionId = 'COMMISSION_BUNDLE_DELETE_SUBSCRIPTION';
      errorDescription = `${componentPath}.error.errorDelete`;
    }

    setLoading(true);
    promise
      .catch((reason) =>
        addError({
          id: actionId,
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while managing the subscription request`,
          toNotify: true,
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t(`${componentPath}.error.${errorDescription}`),
          component: 'Toast',
        })
      )
      .finally(() => {
        setLoading(false);
        getSubscriptionList();
      });
  };

  function handleChangePage(value: number) {
    const newPage = value - 1;
    setPage(newPage);
    getSubscriptionList(newPage);
  }

  return (
    <>
      <Box my={2}>
        <Typography variant="h5">{t(`${componentPath}.title`)}</Typography>
      </Box>
      <TableSearchBar
        setSearchInput={setFilterCiTaxCode}
        componentName={componentPath}
        setExtraTrigger={() => getSubscriptionList(0)}
      >
        <FormControl sx={{ ml: 1, minWidth: '200px' }}>
          <InputLabel id="state-select-label">{t(`${componentPath}.state`)}</InputLabel>
          <Select
            id={'subscription-state'}
            name={'subscription-state'}
            labelId="state-select-label"
            label={t(`${componentPath}.state`)}
            size="small"
            value={filterState}
            onChange={(event) => setFilterState(event.target.value as SubscriptionStateType)}
            data-testid="subscription-state"
            sx={{ height: '48px' }}
          >
            <MenuItem value={SubscriptionStateType.Waiting}>
              {t(`${componentPath}.stateChip.waiting`)}
            </MenuItem>
            <MenuItem value={SubscriptionStateType.Accepted}>
              {t(`${componentPath}.stateChip.accepted`)}
            </MenuItem>
          </Select>
        </FormControl>
      </TableSearchBar>
      <Box
        id="subscriptionTable"
        sx={{
          position: 'relative',
          width: '100% !important',
          border: 'none',
        }}
        justifyContent="start"
      >
        {!subscriptionList?.results || subscriptionList?.results?.length === 0 ? (
          <TableEmptyState componentName={componentPath} />
        ) : (
          <div data-testid="data-grid">
            <CustomDataGrid
              disableColumnFilter
              disableColumnSelector
              disableDensitySelector
              disableSelectionOnClick
              autoHeight={true}
              className="CustomDataGrid"
              columnBuffer={5}
              columns={columns}
              components={{
                Pagination: () => (
                  <Pagination
                    color="primary"
                    count={subscriptionList?.total_pages ?? 1}
                    page={page + 1}
                    onChange={(_event: ChangeEvent<unknown>, value: number) =>
                      handleChangePage(value)
                    }
                  />
                ),
              }}
              getRowId={(r) => r.ci_tax_code}
              headerHeight={headerHeight}
              hideFooterSelectedRowCount={true}
              paginationMode="client"
              rowCount={subscriptionList?.results?.length}
              rowHeight={rowHeight}
              rows={subscriptionList?.results ?? []}
            />
          </div>
        )}
      </Box>
      <CommissionBundleSubscriptionsDrawer
        t={t}
        setDrawerValue={setDrawerValue}
        drawerValue={drawerValue}
        setOpenMenageSubscriptionModal={setOpenMenageSubscriptionModal}
        stateType={selectedState}
      />
      <GenericModal
        title={t(`${componentPath}.modal.${openMenageSubscriptionModal}.title`)}
        message={t(`${componentPath}.modal.${openMenageSubscriptionModal}.message`)}
        openModal={openMenageSubscriptionModal !== undefined}
        onConfirmLabel={t('general.confirm')}
        onCloseLabel={t('general.turnBack')}
        handleCloseModal={() => setOpenMenageSubscriptionModal(undefined)}
        handleConfirm={() => handleConfirmModal()}
        data-testid="confirm-modal"
      />
    </>
  );
};

export default CommissionBundleSubscriptionsTable;
