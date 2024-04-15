/* eslint-disable functional/immutable-data */
import { Box } from '@mui/system';
import { GridColDef } from '@mui/x-data-grid';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { DateFromString } from '@pagopa/ts-commons/lib/dates';
import { CustomDataGrid } from '../../../components/Table/CustomDataGrid';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { LOADING_TASK_PAYMENTS_RECEIPTS } from '../../../utils/constants';
import TableEmptyState from '../../../components/Table/TableEmptyState';
import { ReceiptModelResponse } from '../../../api/generated/portal/ReceiptModelResponse';
import {
  getPaymentReceiptDetail,
  getPaymentsReceipts,
} from '../../../services/paymentsReceiptsService';
import { ReceiptsInfo } from '../../../api/generated/portal/ReceiptsInfo';
import { buildColumnDefs } from './PaymentsReceiptsTableColumns';

const rowHeight = 64;
const headerHeight = 56;

export default function PaymentsReceiptsTable({ filterInput, filterYear, searchTrigger }: { filterInput: string; filterYear: number | null; searchTrigger: boolean }) {
  const { t } = useTranslation();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoading = useLoading(LOADING_TASK_PAYMENTS_RECEIPTS);
  const [receiptsList, setReceiptsList] = useState<Array<ReceiptModelResponse>>([]);
  const addError = useErrorDispatcher();

  function downloadReceiptXML(iuv: string) {
    getPaymentReceiptDetail(selectedParty?.fiscalCode ?? '', iuv)
      .then((xml: string) => {
        const filename = `ricevuta_${iuv}.xml`;
        const download = document.createElement('a');
        const blob = new Blob([xml], { type: 'text/plain' });
        download.setAttribute('href', window.URL.createObjectURL(blob));
        download.setAttribute('download', filename);
        download.dataset.downloadurl = ['text/plain', download.download, download.href].join(':');
        download.click();
      })
      .catch((reason) => {
        addError({
          component: 'Toast',
          id: 'GET_RECEIPT_XML',
          displayableTitle: t('general.errorTitle'),
          techDescription: 'An error occured retrieving the receipt details',
          blocking: false,
          error: reason,
          toNotify: true,
          displayableDescription: t('paymentsReceiptsPage.table.errorMessageReceiptDetail'),
        });
      })
      .finally(() => setLoading(false));
  }

  const getReceipts = () => {
    setLoading(true);
    getPaymentsReceipts(selectedParty?.fiscalCode ?? '', filterInput ?? '', filterYear)
      .then((res: ReceiptsInfo) => {
        if (res?.receipts_list && res.receipts_list.length > 0) {
          setReceiptsList([...res.receipts_list]);
        } else {
          setReceiptsList([]);
        }
      })
      .catch((reason) => {
        addError({
          component: 'Toast',
          id: 'GET_PAYMENTS_RECEIPTS',
          displayableTitle: t('general.errorTitle'),
          techDescription: "An error occured retrieving the payments receipts' list",
          blocking: false,
          error: reason,
          toNotify: true,
          displayableDescription: t('paymentsReceiptsPage.table.errorMessageReceiptList'),
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getReceipts();
  }, [searchTrigger]);

  const columns: Array<GridColDef> = buildColumnDefs(t, downloadReceiptXML);
  // TODO generalize table box
  return (
    <Box
      id="paymentsReceiptsTable"
      sx={{
        position: 'relative',
        width: '100% !important',
        border: 'none',
      }}
      justifyContent="start"
    >
      {!receiptsList || receiptsList.length === 0 ? (
        <TableEmptyState componentName="paymentsReceiptsPage" />
      ) : (
        <div data-testid="data-grid">
          <CustomDataGrid
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            disableSelectionOnClick
            hideFooterPagination={true}
            autoHeight={true}
            className="CustomDataGrid"
            columnBuffer={5}
            columns={columns}
            headerHeight={headerHeight}
            hideFooterSelectedRowCount={true}
            rowCount={receiptsList.length}
            getRowId={(el) => el.iuv}
            rowHeight={rowHeight}
            rows={receiptsList ?? []}
          />
        </div>
      )}
    </Box>
  );
}
