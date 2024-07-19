import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { SessionModal, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { handleErrors } from '@pagopa/selfcare-common-frontend/services/errorService';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { generatePath, useHistory } from 'react-router-dom';
import ROUTES from '../../../routes';
import { StationECAssociateActionType } from '../../../model/Station';
import { CreditorInstitutionsResource } from '../../../api/generated/portal/CreditorInstitutionsResource';
import TableDataGrid from '../../../components/Table/TableDataGrid';
import { dissociateECfromStation, getECListByStationCode } from '../../../services/stationService';
import { LOADING_TASK_STATION_EC_TABLE } from '../../../utils/constants';
import { useAppDispatch } from '../../../redux/hooks';
import { stationCIActions } from '../../../redux/slices/stationCISlice';
import { CreditorInstitutionResource } from '../../../api/generated/portal/CreditorInstitutionResource';
import { buildColumnDefs } from './StationECTableColumns';

const emptyECList: CreditorInstitutionsResource = {
  creditor_institutions: [],
  page_info: {
    page: 0,
    limit: 50,
    items_found: 0,
    total_pages: 0,
  },
};

type StationECTableProps = {
  setAlertMessage: any;
  ciNameOrFiscalCodeFilter: string;
  setNoValidCi: (value: boolean) => void;
};

const componentPath = 'stationECList';
export default function StationECTable({
  setAlertMessage,
  ciNameOrFiscalCodeFilter,
  setNoValidCi
}: StationECTableProps) {
  const { t } = useTranslation();
  const setLoadingOverlay = useLoading(LOADING_TASK_STATION_EC_TABLE);
  const addError = useErrorDispatcher();
  const dispatcher = useAppDispatch();
  const history = useHistory();

  function handleOnClick(ci: CreditorInstitutionResource) {
    dispatcher(stationCIActions.setStationCIState(ci));

    history.push(
      generatePath(ROUTES.STATION_ASSOCIATE_EC, {
        stationId,
        action: StationECAssociateActionType.EDIT,
      })
    );
  }

  const [showConfirmModal, setShowConfirmModal] = useState({ show: false, data: '' });
  const [ecListPage, setECListPage] = useState<CreditorInstitutionsResource>(emptyECList);
  const [page, setPage] = useState<number>(0);
  const [selectedECCode, setSelectedECCode] = useState<string>('');
  const [pageLimit, setPageLimit] = useState<number>(5);

  const { stationId } = useParams<{ stationId: string }>();

  const onRowClick = (ecIdRow: string) => {
    setSelectedECCode(ecIdRow);
    setShowConfirmModal({
      show: true,
      data:
        ecListPage?.creditor_institutions?.find((item) => item.ciTaxCode === ecIdRow)
          ?.businessName ?? '',
    });
  };
  const columns: Array<GridColDef> = buildColumnDefs(t, onRowClick, stationId, handleOnClick);

  const dissociateEC = async () => {
    setShowConfirmModal({ show: false, data: '' });

    try {
      await dissociateECfromStation(selectedECCode, stationId);
      setAlertMessage(t(`${componentPath}.dissociateEcSuccessMessage`));
      setNoValidCi(false);
      fetchStationECs(page);
    } catch (reason) {
      addError({
        id: 'STATION_DELETE_RELATIONSHIP',
        blocking: false,
        error: reason as Error,
        techDescription: `An error occurred while deleting relationship between EC and Station`,
        toNotify: true,
        displayableTitle: t(`${componentPath}.dissociateEcErrorTitle`),
        displayableDescription: t(`${componentPath}.dissociateEcErrorMessage`),
        component: 'Toast',
      });
    } finally {
      setSelectedECCode('');
    }
  };

  const fetchStationECs = (currentPage: number) => {
    setLoadingOverlay(true);
    setPage(currentPage);

    getECListByStationCode(stationId, ciNameOrFiscalCodeFilter, currentPage)
      .then((r) => {
        setECListPage(r);
      })
      .catch((reason) => {
        handleErrors([
          {
            id: `FETCH_STATIONS_ERROR`,
            blocking: false,
            error: reason,
            techDescription: `An error occurred while fetching stations`,
            toNotify: false,
          },
        ]);
        setECListPage(emptyECList);
      })
      .finally(() => setLoadingOverlay(false));
  };

  useEffect(() => {
    fetchStationECs(0);
  }, [ciNameOrFiscalCodeFilter, pageLimit]);


  return (
    <>
      <Box
        id="StationsSearchTableBox"
      >
        <TableDataGrid
          componentPath={componentPath}
          linkToRedirect={generatePath(ROUTES.STATION_ASSOCIATE_EC, {
            stationId,
            action: StationECAssociateActionType.ASSOCIATE
          })}
          rows={[...(ecListPage?.creditor_institutions ?? [])]}
          columns={columns}
          totalPages={ecListPage?.page_info?.total_pages}
          page={page}
          handleChangePage={(newPage: number) => fetchStationECs(newPage)}
          pageLimit={pageLimit}
          setPageLimit={setPageLimit}
          getRowId={(r) => r.ciTaxCode}
        />
      </Box>
      <SessionModal
        open={showConfirmModal.show}
        title={t(`${componentPath}.dissociateModal.title`)}
        message={
          <Trans
            i18nKey="stationECList.dissociateModal.message"
            values={{ ecName: showConfirmModal.data }}
            defaults="Se dissoci {{ ecName }} sarà disattivata la sua connessione alla stazione."
          />
        }
        onConfirmLabel={t(`${componentPath}.dissociateModal.confirmButton`)}
        onCloseLabel={t(`${componentPath}.dissociateModal.cancelButton`)}
        onConfirm={dissociateEC}
        handleClose={() => {
          setShowConfirmModal({ show: false, data: '' });
        }}
      />
    </>
  );
}
