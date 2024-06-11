/* eslint-disable complexity */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable functional/no-let */
import { Add } from '@mui/icons-material';
import { generatePath, Link } from 'react-router-dom';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Alert,
  Button,
  Box,
  Stack,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useState, useEffect } from 'react';
import { useTranslation, TFunction } from 'react-i18next';
import GenericModal from '../../../../../components/Form/GenericModal';
import TableDataGrid from '../../../../../components/Table/TableDataGrid';
import TableSearchBar from '../../../../../components/Table/TableSearchBar';
import { useAppSelector } from '../../../../../redux/hooks';
import { partiesSelectors } from '../../../../../redux/slices/partiesSlice';
import ROUTES from '../../../../../routes';
import {
  LOADING_TASK_SUBSCRIPTION_ACTION,
  LOADING_TASK_SUBSCRIPTION_LIST,
} from '../../../../../utils/constants';
import { CISubscriptionInfo } from '../../../../../api/generated/portal/CISubscriptionInfo';

import {
  BundleResource,
  BundleCiSubscriptionDetailModel,
  SubscriptionStateType,
} from '../../../../../model/CommissionBundle';
import {
  acceptBundleSubscriptionRequest,
  deleteCIBundleSubscription,
  deletePrivateBundleOffer,
  getBundleCISubscriptions,
  getBundleCISubscriptionsDetail,
  rejectPublicBundleSubscription,
} from '../../../../../services/bundleService';
import { CIBundleSubscriptionsResource } from '../../../../../api/generated/portal/CIBundleSubscriptionsResource';
import { CIBundleSubscriptionsDetail } from '../../../../../api/generated/portal/CIBundleSubscriptionsDetail';
import { TypeEnum } from '../../../../../api/generated/portal/PSPBundleResource';
import { CommissionBundleDetailSubscriptionDrawer } from './CommissionBundleDetailSubscriptionDrawer';
import { buildColumnDefs } from './CommissionBundleDetailSubscriptionTableColumns';

const pageLimit = 5;

const generalPath = 'commissionBundlesPage.commissionBundleDetail.subscriptionsTable';

const emptySubscriptionList: CIBundleSubscriptionsResource = {
  page_info: { total_pages: 0 },
  creditor_institutions_subscriptions: [],
};

export default function CommissionBundleSubscriptionsTable({
  bundleDetail,
}: {
  bundleDetail: BundleResource;
}) {
  const componentPath = `${generalPath}.${bundleDetail?.type === TypeEnum.PRIVATE ? 'offersTable' : 'requestsTable'}`;
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
  const [selectedSubscription, setSelectedSubscription] = useState<BundleCiSubscriptionDetailModel>(
    {}
  );

  const [page, setPage] = useState<number>(0);
  const [openMenageSubscriptionModal, setOpenMenageSubscriptionModal] = useState<
    string | undefined
  >(undefined);
  const [successAlert, setSuccessAlert] = useState<string>();

  const [subscriptionList, setSubscriptionList] =
    useState<CIBundleSubscriptionsResource>(emptySubscriptionList);

  function getSubscriptionDetail(selectedRequest: CISubscriptionInfo) {
    setSelectedSubscription(selectedRequest);

    getBundleCISubscriptionsDetail({
      idBundle: bundleDetail?.idBundle ?? '',
      pspTaxCode: selectedParty?.fiscalCode ?? '',
      ciTaxCode: selectedRequest.creditor_institution_code ?? '',
      status: selectedState,
      bundleType: bundleDetail.type!,
    })
      .then((res: CIBundleSubscriptionsDetail) => {
        setSelectedSubscription({ ...res, ...selectedRequest });
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

  const columns: Array<GridColDef> = buildColumnDefs(
    t,
    selectedState,
    getSubscriptionDetail,
    componentPath
  );

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
      bundleType: bundleDetail.type!,
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
          techDescription: `An error occurred while retrieving bundle's subscriptions ${bundleDetail.type === TypeEnum.PRIVATE ? 'offers' : 'requests'}`,
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
        selectedSubscription?.bundle_request_id ?? '',
        selectedSubscription?.creditor_institution_code ?? '',
        bundleDetail?.name ?? ''
      );
      actionId = 'COMMISSION_BUNDLE_REJECT_SUBSCRIPTION';
    }
    if (actionType === 'accept') {
      promise = acceptBundleSubscriptionRequest(
        selectedParty?.fiscalCode ?? '',
        selectedSubscription?.bundle_request_id ?? '',
        selectedSubscription?.creditor_institution_code ?? '',
        bundleDetail?.name ?? ''
      );
      actionId = 'COMMISSION_BUNDLE_ACCEPT_SUBSCRIPTION';
    }
    if (actionType === 'delete') {
      promise = deleteCIBundleSubscription(
        selectedSubscription?.ci_bundle_id ?? '',
        selectedSubscription?.creditor_institution_code ?? '',
        bundleDetail?.name ?? ''
      );
      actionId = 'COMMISSION_BUNDLE_DELETE_SUBSCRIPTION';
    }
    if (actionType === 'deleteOffer') {
      promise = deletePrivateBundleOffer({
        idBundle: bundleDetail?.idBundle ?? '',
        pspTaxCode: selectedParty?.fiscalCode ?? '',
        bundleOfferId: selectedSubscription?.bundle_offer_id ?? '',
        ciTaxCode: selectedSubscription?.creditor_institution_code?? '',
        bundleName: bundleDetail?.name ?? '',
      });
      actionId = 'COMMISSION_BUNDLE_DELETE_OFFER_SUBSCRIPTION';
    }
    if (promise) {
      promise
        .then(() => {
          setSelectedSubscription({});
          getSubscriptionList(0);
          setSuccessAlert(actionType);
        })
        .catch((reason) =>
          addError({
            id: actionId,
            blocking: false,
            error: reason as Error,
            techDescription: `An error occurred while managing the subscription ${bundleDetail.type === TypeEnum.PRIVATE ? 'offer' : 'request'}`,
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
      <Stack my={2} direction="row" justifyContent="space-between">
        <Typography variant="h5">{t(`${componentPath}.title`)}</Typography>
        {bundleDetail.type === TypeEnum.PRIVATE && (
          <Button
            variant="contained"
            startIcon={<Add />}
            component={Link}
            to={generatePath(ROUTES.COMMISSION_BUNDLES_ADD_RECIPIENT, {
              bundleId: bundleDetail.idBundle,
            })}
          >
            {t(`${componentPath}.inviteButton`)}
          </Button>
        )}
      </Stack>
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
            onChange={(event) => setFilterState(event.target.value as SubscriptionStateType)}
            data-testid="subscription-state"
            sx={{ height: '48px', backgroundColor: '#FFFFFF' }}
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
          {t(`${generalPath}.alert.${successAlert}`)}
        </Alert>
      )}
      <CommissionBundleDetailSubscriptionDrawer
        setSelectedSubscription={setSelectedSubscription}
        selectedSubscription={selectedSubscription}
        stateType={selectedState}
        componentPath={componentPath}
        drawerButtons={() =>
          getDrawerButtons(
            t,
            selectedState,
            setOpenMenageSubscriptionModal,
            bundleDetail,
            selectedSubscription.ci_bundle_fee_list !== undefined &&
              !selectedSubscription.on_removal
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
  bundleDetail: BundleResource,
  showButtons?: boolean
) {
  const buttonPath = 'commissionBundlesPage.commissionBundleDetail.requestDrawer';
  if (showButtons) {
    if (stateType === SubscriptionStateType.Waiting) {
      if (bundleDetail.type === TypeEnum.PRIVATE) {
        return (
          <Button
            fullWidth
            onClick={() => {
              setOpenMenageSubscriptionModal('deleteOffer');
            }}
            color="error"
            variant="outlined"
            data-testid="offer-delete-button"
          >
            {t(`${buttonPath}.deleteButton`)}
          </Button>
        );
      } else {
        return (
          <>
            <Button
              fullWidth
              onClick={() => {
                setOpenMenageSubscriptionModal('accept');
              }}
              color="primary"
              variant="contained"
              data-testid="request-accept-button"
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
              data-testid="request-reject-button"
            >
              {t(`${buttonPath}.rejectButton`)}
            </Button>
          </>
        );
      }
    }
    if (stateType === SubscriptionStateType.Accepted) {
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
