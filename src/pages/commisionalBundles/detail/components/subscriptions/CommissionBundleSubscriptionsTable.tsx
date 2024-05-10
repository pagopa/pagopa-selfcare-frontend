/* eslint-disable functional/no-let */
import {
  Select,
  MenuItem,
  Pagination,
  FormControl,
  InputLabel,
  Typography,
  Alert,
} from '@mui/material';
import { Box } from '@mui/system';
import { GridColDef } from '@mui/x-data-grid';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useState, ChangeEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import GenericModal from '../../../../../components/Form/GenericModal';
import { CustomDataGrid } from '../../../../../components/Table/CustomDataGrid';
import TableEmptyState from '../../../../../components/Table/TableEmptyState';
import TableSearchBar from '../../../../../components/Table/TableSearchBar';
import { useAppSelector } from '../../../../../redux/hooks';
import { partiesSelectors } from '../../../../../redux/slices/partiesSlice';
import {
  LOADING_TASK_SUBSCRIPTION_ACTION,
  LOADING_TASK_SUBSCRIPTION_LIST,
} from '../../../../../utils/constants';
import { PublicBundleCISubscriptionsResource } from '../../../../../api/generated/portal/PublicBundleCISubscriptionsResource';
import { PublicBundleCISubscriptionsDetail } from '../../../../../api/generated/portal/PublicBundleCISubscriptionsDetail';
import { CISubscriptionInfo } from '../../../../../api/generated/portal/CISubscriptionInfo';
import {
  BundleResource,
  PublicBundleCiSubscriptionDetailModel,
  SubscriptionStateType,
} from '../../../../../model/CommissionBundle';
import {
  acceptBundleSubscriptionRequest,
  deleteCIBundleSubscription,
  getPublicBundleCISubscriptions,
  getPublicBundleCISubscriptionsDetail,
  rejectPublicBundleSubscription,
} from '../../../../../services/bundleService';
import { buildColumnDefs } from './CommissionBundleSubscriptionsColumns';
import { CommissionBundleSubscriptionsDrawer } from './CommissionBundleSubscriptionsDrawer';

const rowHeight = 64;
const headerHeight = 56;
const pageLimit = 5;

const componentPath = 'commissionBundlesPage.commissionBundleDetail.subscriptionsTable';

const emptySubscriptionList: PublicBundleCISubscriptionsResource = {
  page_info: { total_pages: 0 },
  creditor_institutions_subscriptions: [],
};

const CommissionBundleSubscriptionsTable = ({ bundleDetail }: { bundleDetail: BundleResource }) => {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoadingList = useLoading(LOADING_TASK_SUBSCRIPTION_LIST);
  const setLoadingRequestAction = useLoading(LOADING_TASK_SUBSCRIPTION_ACTION);

  const [filterState, setFilterState] = useState<SubscriptionStateType>(
    SubscriptionStateType.Waiting
  );
  const [selectedState, setSelectedState] = useState<SubscriptionStateType>(filterState);
  const [selectedTaxCode, setSelectedTaxCode] = useState<string>('');
  const [selectedSubscriptionRequest, setSelectedSubscriptionRequest] =
    useState<PublicBundleCiSubscriptionDetailModel>({});

  const [page, setPage] = useState<number>(0);
  const [openMenageSubscriptionModal, setOpenMenageSubscriptionModal] = useState<
    string | undefined
  >(undefined);
  const [successAlert, setSuccessAlert] = useState<string>();

  const [subscriptionList, setSubscriptionList] =
    useState<PublicBundleCISubscriptionsResource>(emptySubscriptionList);

  function getSubscriptionDetail(selectedRequest: CISubscriptionInfo) {
    setSelectedSubscriptionRequest(selectedRequest);

    getPublicBundleCISubscriptionsDetail({
      idBundle: bundleDetail?.idBundle ?? '',
      pspTaxCode: selectedParty?.fiscalCode ?? '',
      ciTaxCode: selectedRequest.creditor_institution_code ?? '',
      status: selectedState,
    })
      .then((res: PublicBundleCISubscriptionsDetail) => {
        setSelectedSubscriptionRequest({ ...res, ...selectedRequest });
      })
      .catch((reason) =>
        addError({
          id: 'COMMISSION_BUNDLE_GET_SUBSCRIPTION_DETAIL',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while retrieving the subscriptions' detail`,
          toNotify: true,
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t(`${componentPath}.error.errorGetDetail`),
          component: 'Toast',
        })
      );
  }

  const columns: Array<GridColDef> = buildColumnDefs(t, selectedState, getSubscriptionDetail);

  const getSubscriptionList = (
    newPage?: number,
    taxCodeFilter?: string,
    searchTriggered?: boolean
  ) => {
    setLoadingList(true);
    if(newPage){
      setPage(newPage);
    }

    getPublicBundleCISubscriptions({
      idBundle: bundleDetail?.idBundle ?? '',
      pspTaxCode: selectedParty?.fiscalCode ?? '',
      ciTaxCode: taxCodeFilter ?? selectedTaxCode,
      limit: pageLimit,
      page: newPage ?? 0,
      status: searchTriggered ? filterState : selectedState,
    })
      .then((res: PublicBundleCISubscriptionsResource) => {
        if (
          res?.creditor_institutions_subscriptions &&
          res.creditor_institutions_subscriptions.length > 0
        ) {
          setSubscriptionList(res);
        } else {
          setSubscriptionList(emptySubscriptionList);
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
      .finally(() => {
        if (searchTriggered) {
          setSelectedState(filterState);
          if (taxCodeFilter !== undefined) {
            setSelectedTaxCode(taxCodeFilter);
          }
        }
        setLoadingList(false);
      });
  };

  const handleConfirmModal = async () => {
    setLoadingRequestAction(true);
    const actionType = openMenageSubscriptionModal;
    setOpenMenageSubscriptionModal(undefined);

    let promise: Promise<string | void> | undefined;
    let actionId: string;

    if (actionType === 'reject') {
      promise = rejectPublicBundleSubscription(
        selectedParty?.fiscalCode ?? '',
        selectedSubscriptionRequest?.bundle_request_id ?? '',
        selectedSubscriptionRequest?.creditor_institution_code ?? '',
        bundleDetail?.name ?? ''
      );
      actionId = 'COMMISSION_BUNDLE_REJECT_SUBSCRIPTION';
    }
    if (actionType === 'accept') {
      promise = acceptBundleSubscriptionRequest(
        selectedParty?.fiscalCode ?? '',
        selectedSubscriptionRequest?.bundle_request_id ?? '',
        selectedSubscriptionRequest?.creditor_institution_code ?? '',
        bundleDetail?.name ?? ''
      );
      actionId = 'COMMISSION_BUNDLE_ACCEPT_SUBSCRIPTION';
    }
    if (actionType === 'delete') {
      promise = deleteCIBundleSubscription(
        selectedSubscriptionRequest?.ci_bundle_id ?? '',
        selectedSubscriptionRequest?.creditor_institution_code ?? '',
        bundleDetail?.name ?? ''
      );
      actionId = 'COMMISSION_BUNDLE_DELETE_SUBSCRIPTION';
    }
    if (promise) {
      promise
        .then(() => {
          setSelectedSubscriptionRequest({});
          getSubscriptionList(0);
          setSuccessAlert(actionType);
        })
        .catch((reason) =>
          addError({
            id: actionId,
            blocking: false,
            error: reason as Error,
            techDescription: `An error occurred while managing the subscription request`,
            toNotify: true,
            displayableTitle: t('general.errorTitle'),
            displayableDescription: t(`${componentPath}.error.${actionType}`),
            component: 'Toast',
          })
        )
        .finally(() => {
          setLoadingRequestAction(false);
        });
    }
  };

  function handleChangePage(value: number) {
    const newPage = value - 1;
    setPage(newPage);
    getSubscriptionList(newPage);
  }

  useEffect(() => {
    getSubscriptionList();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccessAlert(undefined);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [successAlert]);

  return (
    <>
      <Box my={2}>
        <Typography variant="h5">{t(`${componentPath}.title`)}</Typography>
      </Box>
      <TableSearchBar
        componentName={componentPath}
        handleSearchTrigger={(taxCodeFilter: string) => getSubscriptionList(0, taxCodeFilter, true)}
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
              {t(`${componentPath}.stateChip.${SubscriptionStateType.Waiting}`)}
            </MenuItem>
            <MenuItem value={SubscriptionStateType.Accepted}>
              {t(`${componentPath}.stateChip.${SubscriptionStateType.Accepted}`)}
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
        {!subscriptionList?.creditor_institutions_subscriptions ||
        subscriptionList?.creditor_institutions_subscriptions?.length === 0 ? (
          <TableEmptyState componentName={componentPath} translationPathSuffix={selectedState} />
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
                    count={subscriptionList?.page_info?.total_pages ?? 1}
                    page={page + 1}
                    onChange={(_event: ChangeEvent<unknown>, value: number) =>
                      handleChangePage(value)
                    }
                  />
                ),
              }}
              getRowId={(r) => r.creditor_institution_code}
              headerHeight={headerHeight}
              hideFooterSelectedRowCount={true}
              paginationMode="client"
              rowCount={subscriptionList?.creditor_institutions_subscriptions?.length}
              rowHeight={rowHeight}
              rows={subscriptionList?.creditor_institutions_subscriptions ?? []}
            />
          </div>
        )}
      </Box>
      {successAlert && (
        <Alert
          severity="success"
          variant="outlined"
          style={{ position: 'fixed', right: 23, bottom: 50, zIndex: 999 }}
          data-testid="success-alert"
        >
          {t(`${componentPath}.alert.${successAlert}`)}
        </Alert>
      )}
      <CommissionBundleSubscriptionsDrawer
        t={t}
        setSelectedSubscriptionRequest={setSelectedSubscriptionRequest}
        selectedSubscriptionRequest={selectedSubscriptionRequest}
        setOpenMenageSubscriptionModal={setOpenMenageSubscriptionModal}
        stateType={selectedState}
      />
      {openMenageSubscriptionModal !== undefined && (
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
      )}
    </>
  );
};

export default CommissionBundleSubscriptionsTable;
