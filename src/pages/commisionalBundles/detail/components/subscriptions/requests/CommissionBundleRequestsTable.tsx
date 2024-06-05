/* eslint-disable functional/no-let */
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Alert,
  Button,
  Box,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useState, useEffect } from 'react';
import { useTranslation, TFunction } from 'react-i18next';
import GenericModal from '../../../../../../components/Form/GenericModal';
import TableDataGrid from '../../../../../../components/Table/TableDataGrid';
import TableSearchBar from '../../../../../../components/Table/TableSearchBar';
import { useAppSelector } from '../../../../../../redux/hooks';
import { partiesSelectors } from '../../../../../../redux/slices/partiesSlice';
import {
  LOADING_TASK_SUBSCRIPTION_ACTION,
  LOADING_TASK_SUBSCRIPTION_LIST,
} from '../../../../../../utils/constants';
import { CISubscriptionInfo } from '../../../../../../api/generated/portal/CISubscriptionInfo';
import { CommissionBundleDetailSubscriptionDrawer } from '../CommissionBundleDetailSubscriptionDrawer';
import {
  BundleResource,
  BundleCiSubscriptionDetailModel,
  RequestStateType,
} from '../../../../../../model/CommissionBundle';
import {
  acceptBundleSubscriptionRequest,
  deleteCIBundleSubscription,
  getBundleCISubscriptions,
  getBundleCISubscriptionsDetail,
  rejectPublicBundleSubscription,
} from '../../../../../../services/bundleService';
import { buildColumnDefs } from '../CommissionBundleDetailSubscriptionTableColumns';
import { CIBundleSubscriptionsResource } from '../../../../../../api/generated/portal/CIBundleSubscriptionsResource';
import { CIBundleSubscriptionsDetail } from '../../../../../../api/generated/portal/CIBundleSubscriptionsDetail';

const pageLimit = 5;

const generalPath = 'commissionBundlesPage.commissionBundleDetail.requestsTable';
const componentPath = `${generalPath}.subscriptionsTable`;

const emptySubscriptionList: CIBundleSubscriptionsResource = {
  page_info: { total_pages: 0 },
  creditor_institutions_subscriptions: [],
};

export default function CommissionBundleRequestsTable({
  bundleDetail,
}: {
  bundleDetail: BundleResource;
}) {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoadingList = useLoading(LOADING_TASK_SUBSCRIPTION_LIST);
  const setLoadingRequestAction = useLoading(LOADING_TASK_SUBSCRIPTION_ACTION);

  const [filterState, setFilterState] = useState<RequestStateType>(
    RequestStateType.Waiting
  );
  const [selectedState, setSelectedState] = useState<RequestStateType>(filterState);
  const [selectedTaxCode, setSelectedTaxCode] = useState<string>('');
  const [selectedSubscriptionRequest, setSelectedSubscriptionRequest] =
    useState<BundleCiSubscriptionDetailModel>({});

  const [page, setPage] = useState<number>(0);
  const [openMenageSubscriptionModal, setOpenMenageSubscriptionModal] = useState<
    string | undefined
  >(undefined);
  const [successAlert, setSuccessAlert] = useState<string>();

  const [subscriptionList, setSubscriptionList] =
    useState<CIBundleSubscriptionsResource>(emptySubscriptionList);

  function getSubscriptionDetail(selectedRequest: CISubscriptionInfo) {
    setSelectedSubscriptionRequest(selectedRequest);

    getBundleCISubscriptionsDetail({
      idBundle: bundleDetail?.idBundle ?? '',
      pspTaxCode: selectedParty?.fiscalCode ?? '',
      ciTaxCode: selectedRequest.creditor_institution_code ?? '',
      status: selectedState,
    })
      .then((res: CIBundleSubscriptionsDetail) => {
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

  const columns: Array<GridColDef> = buildColumnDefs(t, selectedState, getSubscriptionDetail, componentPath);

  const getSubscriptionList = (
    newPage?: number,
    taxCodeFilter?: string,
    searchTriggered?: boolean
  ) => {
    setLoadingList(true);
    if (newPage) {
      setPage(newPage);
    }

    getBundleCISubscriptions({
      idBundle: bundleDetail?.idBundle ?? '',
      pspTaxCode: selectedParty?.fiscalCode ?? '',
      ciTaxCode: taxCodeFilter ?? selectedTaxCode,
      limit: pageLimit,
      page: newPage ?? 0,
      status: searchTriggered ? filterState : selectedState,
    })
      .then((res: CIBundleSubscriptionsResource) => {
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
        componentName={generalPath}
        handleSearchTrigger={(taxCodeFilter: string) => getSubscriptionList(0, taxCodeFilter, true)}
      >
        <FormControl sx={{ ml: 1, minWidth: '200px' }}>
          <InputLabel id="state-select-label">{t(`${generalPath}.state`)}</InputLabel>
          <Select
            id={'subscription-state'}
            name={'subscription-state'}
            labelId="state-select-label"
            label={t(`${generalPath}.state`)}
            size="small"
            value={filterState}
            onChange={(event) => setFilterState(event.target.value as RequestStateType)}
            data-testid="subscription-state"
            sx={{ height: '48px', backgroundColor: '#FFFFFF' }}
          >
            <MenuItem value={RequestStateType.Waiting}>
              {t(`${componentPath}.stateChip.${RequestStateType.Waiting}`)}
            </MenuItem>
            <MenuItem value={RequestStateType.Accepted}>
              {t(`${componentPath}.stateChip.${RequestStateType.Accepted}`)}
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
        <TableDataGrid
          componentPath={componentPath}
          translationPathSuffix={selectedState}
          rows={
            subscriptionList?.creditor_institutions_subscriptions
              ? [...subscriptionList.creditor_institutions_subscriptions]
              : []
          }
          columns={columns}
          totalPages={subscriptionList?.page_info?.total_pages}
          page={page}
          handleChangePage={(newPage: number) => handleChangePage(newPage)}
          getRowId={(r) => r.creditor_institution_code}
        />
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
      <CommissionBundleDetailSubscriptionDrawer
        setSelectedSubscription={setSelectedSubscriptionRequest}
        selectedSubscription={selectedSubscriptionRequest}
        stateType={selectedState}
        componentPath={componentPath}
        drawerButtons={() =>
          getDrawerButtons(
            t,
            selectedState,
            setOpenMenageSubscriptionModal,
            selectedSubscriptionRequest.ci_bundle_fee_list !== undefined &&
              !selectedSubscriptionRequest.on_removal
          )
        }
      />
      {openMenageSubscriptionModal !== undefined && (
        <GenericModal
          title={t(`${generalPath}.modal.${openMenageSubscriptionModal}.title`)}
          message={t(`${generalPath}.modal.${openMenageSubscriptionModal}.message`)}
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
}

function getDrawerButtons(
  t: TFunction<'translation', undefined>,
  stateType: string,
  setOpenMenageSubscriptionModal: (openModal: string) => void,
  showButtons?: boolean
) {
  const buttonPath = 'commissionBundlesPage.commissionBundleDetail.requestDrawer';
  if (showButtons) {
    if (stateType === RequestStateType.Waiting) {
      return (
        <>
          <Button
            fullWidth
            onClick={() => {
              setOpenMenageSubscriptionModal('accept');
            }}
            color="primary"
            variant="contained"
            data-testid="subscription-accept-button"
            sx={{ mb: 1 }}
          >
            {t(`${buttonPath}.acceptButton`)}
          </Button>
          <Button
            fullWidth
            onClick={() => {
              setOpenMenageSubscriptionModal('reject');
            }}
            color="error"
            variant="outlined"
            data-testid="subscription-reject-button"
          >
            {t(`${buttonPath}.rejectButton`)}
          </Button>
        </>
      );
    }
    if (stateType === RequestStateType.Accepted) {
      return (
        <Button
          fullWidth
          onClick={() => {
            setOpenMenageSubscriptionModal('delete');
          }}
          color="error"
          variant="outlined"
          data-testid="subscription-delete-button"
        >
          {t(`${buttonPath}.deleteButton`)}
        </Button>
      );
    }
  }

  return <></>;
}
