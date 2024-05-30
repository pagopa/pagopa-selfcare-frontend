/* eslint-disable functional/no-let */
import { Select, MenuItem, FormControl, InputLabel, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { Box, Stack } from '@mui/system';
import { GridColDef } from '@mui/x-data-grid';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import GenericModal from '../../../../../components/Form/GenericModal';
import TableDataGrid from '../../../../../components/Table/TableDataGrid';
import TableSearchBar from '../../../../../components/Table/TableSearchBar';
import { useAppSelector } from '../../../../../redux/hooks';
import { partiesSelectors } from '../../../../../redux/slices/partiesSlice';
import { LOADING_TASK_OFFER_ACTION, LOADING_TASK_OFFER_LIST } from '../../../../../utils/constants';
import { PublicBundleCISubscriptionsResource } from '../../../../../api/generated/portal/PublicBundleCISubscriptionsResource';
import { BundleResource, OfferStateType } from '../../../../../model/CommissionBundle';
import { deleteCIBundleSubscription } from '../../../../../services/bundleService';
import { buildColumnDefs } from './CommissionBundleOffersColumns';
import { CommissionBundleOffersDrawer } from './CommissionBundleOffersDrawer';

const pageLimit = 5;

const componentPath = 'commissionBundlesPage.commissionBundleDetail.offersTable';

const emptySubscriptionList: PublicBundleCISubscriptionsResource = {
  // TODO type
  page_info: { total_pages: 0 },
  creditor_institutions_subscriptions: [],
};

const CommissionBundleOffersTable = ({ bundleDetail }: { bundleDetail: BundleResource }) => {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoadingList = useLoading(LOADING_TASK_OFFER_LIST);
  const setLoadingRequestAction = useLoading(LOADING_TASK_OFFER_ACTION);

  const [filterState, setFilterState] = useState<OfferStateType>(OfferStateType.Waiting);
  const [selectedState, setSelectedState] = useState<OfferStateType>(filterState);
  const [selectedTaxCode, setSelectedTaxCode] = useState<string>('');
  const [selectedOfferRequest, setSelectedOfferRequest] = useState({}); // TODO type

  const [page, setPage] = useState<number>(0);
  const [openMenageOfferModal, setOpenMenageOfferModal] = useState<boolean>(false);

  const [offersList, setOffersList] = useState(emptySubscriptionList); // TODO type

  function getOfferDetail(selectedRequest: any /* TODO type */) {
    setSelectedOfferRequest(selectedRequest);

    // TODO api get offer detail for drawer
  }

  const columns: Array<GridColDef> = buildColumnDefs(t, selectedState, getOfferDetail);

  const getOffersList = (newPage?: number, taxCodeFilter?: string, searchTriggered?: boolean) => {
    setLoadingList(true);
    if (newPage) {
      setPage(newPage);
    }

    // TODO api get offer list
    if (searchTriggered) {
      setSelectedState(filterState);
      if (taxCodeFilter !== undefined) {
        setSelectedTaxCode(taxCodeFilter);
      }
    }
    setLoadingList(false);
  };

  const handleConfirmModal = async () => {
    setLoadingRequestAction(true);

    // TODO verify if right api
    deleteCIBundleSubscription(
      /* TODO selectedOfferRequest?.ci_bundle_id ?? */ '',
      /* TODO selectedOfferRequest?.creditor_institution_code ?? */ '',
      bundleDetail?.name ?? ''
    )
      .then(() => {
        setSelectedOfferRequest({});
        getOffersList(0);
      })
      .catch((reason) =>
        addError({
          id: 'COMMISSION_BUNDLE_DELETE_OFFER',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while deleting the offer request`,
          toNotify: true,
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t(`${componentPath}.error.deleting`),
          component: 'Toast',
        })
      )
      .finally(() => {
        setOpenMenageOfferModal(false);
        setLoadingRequestAction(false);
      });
  };

  function handleChangePage(value: number) {
    const newPage = value - 1;
    setPage(newPage);
    getOffersList(newPage);
  }

  useEffect(() => {
    getOffersList();
  }, []);

  return (
    <>
      <Stack my={2} direction="row" justifyContent="space-between">
        <Typography variant="h5">{t(`${componentPath}.title`)}</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onChange={() => {
            /* TODO VAS-807 */
          }}
        >
          {t(`${componentPath}.inviteButton`)}
        </Button>
      </Stack>
      <TableSearchBar
        componentName={componentPath}
        handleSearchTrigger={(taxCodeFilter: string) => getOffersList(0, taxCodeFilter, true)}
      >
        <FormControl sx={{ ml: 1, minWidth: '200px' }}>
          <InputLabel id="state-select-label">{t(`${componentPath}.state`)}</InputLabel>
          <Select
            id={'offers-state'}
            name={'offers-state'}
            labelId="state-select-label"
            label={t(`${componentPath}.state`)}
            size="small"
            value={filterState}
            onChange={(event) => setFilterState(event.target.value as OfferStateType)}
            data-testid="offers-state"
            sx={{ height: '48px', backgroundColor: '#FFFFFF' }}
          >
            <MenuItem value={OfferStateType.Waiting}>
              {t(`${componentPath}.stateChip.${OfferStateType.Waiting}`)}
            </MenuItem>
            <MenuItem value={OfferStateType.Active}>
              {t(`${componentPath}.stateChip.${OfferStateType.Active}`)}
            </MenuItem>
          </Select>
        </FormControl>
      </TableSearchBar>
      <Box
        id="offersTable"
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
            offersList?.creditor_institutions_subscriptions
              ? [...offersList.creditor_institutions_subscriptions]
              : []
          }
          columns={columns}
          totalPages={offersList?.page_info?.total_pages}
          page={page}
          handleChangePage={(newPage: number) => handleChangePage(newPage)}
          pageLimit={pageLimit}
          getRowId={(r) => r.stationCode} // TODO get right id
        />
      </Box>
      <CommissionBundleOffersDrawer
        t={t}
        setSelectedOfferRequest={setSelectedOfferRequest}
        selectedOfferRequest={selectedOfferRequest}
        setOpenMenageOfferModal={setOpenMenageOfferModal}
        stateType={selectedState}
      />
      {openMenageOfferModal && (
        <GenericModal
          title={t(`${componentPath}.modal.${openMenageOfferModal}.title`)}
          message={t(`${componentPath}.modal.${openMenageOfferModal}.message`)}
          openModal={openMenageOfferModal}
          onConfirmLabel={t('general.confirm')}
          onCloseLabel={t('general.turnBack')}
          handleCloseModal={() => setOpenMenageOfferModal(false)}
          handleConfirm={() => handleConfirmModal()}
          data-testid="confirm-modal"
        />
      )}
    </>
  );
};

export default CommissionBundleOffersTable;
