import { Box, Pagination } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CIBrokerStationPage } from '../../../../api/generated/portal/CIBrokerStationPage';
import { CIBrokerStationResource } from '../../../../api/generated/portal/CIBrokerStationResource';
import GenericModal from '../../../../components/Form/GenericModal';
import { CustomDataGrid } from '../../../../components/Table/CustomDataGrid';
import TableEmptyState from '../../../../components/Table/TableEmptyState';
import { useAppSelector } from '../../../../redux/hooks';
import { partiesSelectors } from '../../../../redux/slices/partiesSlice';
import { getCIBrokerStations } from '../../../../services/brokerService';
import { dissociateECfromStation } from '../../../../services/stationService';
import { LOADING_TASK_CI_DELEGATION_STATIONS_LIST } from '../../../../utils/constants';
import { DelegationStationDetailsDrawer } from '../DelegationStationDetailsDrawer';
import { buildColumnDefs } from './DelegationStationsTableColumns';

type Props = {
  ciTaxCode: string;
  filterByStationCode: string;
};

const rowHeight = 64;
const headerHeight = 56;
const pageLimit = 5;

const emptyDelegationLStationist: CIBrokerStationPage = {
  ci_broker_stations: [],
  page_info: {
    items_found: 0,
    limit: 0,
    page: 0,
    total_pages: 0,
  },
};

const DelegationStationsTable = ({ ciTaxCode, filterByStationCode }: Props) => {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoading = useLoading(LOADING_TASK_CI_DELEGATION_STATIONS_LIST);
  const [drawerValue, setDrawerValue] = useState<CIBrokerStationResource>({});
  const [showDisassociateStationModal, setShowDisassociateStationModal] = useState<string>();
  const columns: Array<GridColDef> = buildColumnDefs(t, setDrawerValue);
  const [delegationStationsList, setDelegationStationsList] = useState<CIBrokerStationPage>(
    emptyDelegationLStationist
  );
  const [page, setPage] = useState(0);

  const getDelegationStationsList = () => {
    setLoading(true);
    getCIBrokerStations(
      selectedParty?.fiscalCode ?? '',
      ciTaxCode ?? '',
      filterByStationCode ?? '',
      pageLimit,
      page
    )
      .then((res: CIBrokerStationPage) => {
        if (res?.ci_broker_stations && res.ci_broker_stations.length > 0) {
          setDelegationStationsList(res);
        } else {
          setDelegationStationsList(emptyDelegationLStationist);
        }
      })
      .catch((reason) => addError({
        id: 'DELEGATION_GET_CI_STATIONS',
        blocking: false,
        error: reason as Error,
        techDescription: `An error occurred while retrieving creditor institution's stations`,
        toNotify: true,
        displayableTitle: t('general.errorTitle'),
        displayableDescription: t('delegationDetailPage.retrieveStationsErrorMessage'),
        component: 'Toast',
      }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getDelegationStationsList();
  }, [page, filterByStationCode]);

  const dissociateEC = async () => {
    const stationCode = showDisassociateStationModal ?? '';

    setShowDisassociateStationModal(undefined);
    setLoading(true);

      dissociateECfromStation(ciTaxCode, stationCode)
      .catch((reason) => (
        addError({
          id: 'STATION_DELETE_RELATIONSHIP',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while deleting relationship between EC and station`,
          toNotify: true,
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t('delegationDetailPage.dissociateStationErrorMessage'),
          component: 'Toast',
        })
      )).finally(() => {
        setLoading(false);
        getDelegationStationsList();
      });
  };

  function handleChangePage(value: number) {
    const newPage = value - 1;
    setPage(newPage);
  }
  // TODO generalize table box
  return (
    <>
      <Box
        id="delegationStationsTable"
        sx={{
          position: 'relative',
          width: '100% !important',
          border: 'none',
        }}
        justifyContent="start"
      >
        {!delegationStationsList?.ci_broker_stations ||
          delegationStationsList.ci_broker_stations?.length === 0 ? (
          <TableEmptyState componentName="delegationDetailPage" />
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
                    count={delegationStationsList?.page_info?.total_pages ?? 1}
                    page={page + 1}
                    onChange={(_event: ChangeEvent<unknown>, value: number) =>
                      handleChangePage(value)
                    }
                  />
                ),
              }}
              componentsProps={{
                toolbar: {
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              getRowId={(r) => r.station_code}
              headerHeight={headerHeight}
              hideFooterSelectedRowCount={true}
              paginationMode="client"
              rowCount={delegationStationsList?.ci_broker_stations?.length}
              rowHeight={rowHeight}
              rows={delegationStationsList?.ci_broker_stations ?? []}
              sortingMode="client"
              // onSortModelChange={handleSortModelChange}
            />
          </div>
        )}
      </Box>
      <DelegationStationDetailsDrawer
        drawerValue={drawerValue}
        setDrawerValue={setDrawerValue}
        t={t}
        setShowDisassociateStationModal={setShowDisassociateStationModal}
      />
      <GenericModal
        title={t('delegationDetailPage.stationDetail.modal.title')}
        message={t('delegationDetailPage.stationDetail.modal.message')}
        openModal={showDisassociateStationModal !== undefined}
        onConfirmLabel={t('general.confirm')}
        onCloseLabel={t('general.cancel')}
        handleCloseModal={() => setShowDisassociateStationModal(undefined)}
        handleConfirm={() => dissociateEC()}
        data-testid="dissociate-station-modal"
      />
    </>
  );
};

export default DelegationStationsTable;
