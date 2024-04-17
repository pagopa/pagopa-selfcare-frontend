/* eslint-disable functional/immutable-data */
import { Box } from '@mui/system';
import { GridColDef } from '@mui/x-data-grid';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, ChangeEvent } from 'react';
import { Pagination } from '@mui/material';
import { CustomDataGrid } from '../../../components/Table/CustomDataGrid';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { LOADING_TASK_PAYMENTS_RECEIPTS } from '../../../utils/constants';
import TableEmptyState from '../../../components/Table/TableEmptyState';
import {
  getPaymentReceiptDetail,
  getPaymentsReceipts,
} from '../../../services/paymentsReceiptsService';
import { PaymentsResult } from '../../../api/generated/portal/PaymentsResult';
import { buildColumnDefs } from './PaymentsReceiptsTableColumns';

const rowHeight = 64;
const headerHeight = 56;

const emptyList: PaymentsResult = {
  results: [],
  totalPages: 0,
};

export default function PaymentsReceiptsTable({
  filterDebtorOrIuv,
  filterYear,
  searchTrigger,
}: {
  filterDebtorOrIuv: string;
  filterYear: number | null;
  searchTrigger: boolean;
}) {
  const { t } = useTranslation();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoading = useLoading(LOADING_TASK_PAYMENTS_RECEIPTS);
  const [receiptsList, setReceiptsList] = useState<PaymentsResult>(emptyList);
  const addError = useErrorDispatcher();
  const [page, setPage] = useState(0);

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

  const getReceipts = (newPage?: number) => {
    setLoading(true);
    const toPage = newPage ?? 0;
    getPaymentsReceipts({
      organizationTaxCode: selectedParty?.fiscalCode ?? '',
      debtorTaxCodeOrIuv: filterDebtorOrIuv ?? '',
      filterYear,
      page: toPage,
      pageLimit: 10,
    })
      .then((res: PaymentsResult) => {
        if (res?.results && res.results.length > 0) {
          setReceiptsList(res);
        } else {
          setReceiptsList(emptyList);
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
      .finally(() => {
        setPage(toPage);
        setLoading(false);
      });
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
      {!receiptsList?.results || receiptsList.results.length === 0 ? (
        <TableEmptyState componentName="paymentsReceiptsPage" />
      ) : (
        <div data-testid="data-grid">
          <CustomDataGrid
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            disableSelectionOnClick
            onPageChange={(newPage) => getReceipts(newPage - 1)}
            autoHeight={true}
            className="CustomDataGrid"
            components={{
              Pagination: () => (
                <>
                  <Pagination
                    color="primary"
                    count={receiptsList?.totalPages ?? 1}
                    page={page + 1}
                    onChange={(_event: ChangeEvent<unknown>, value: number) =>
                      getReceipts(value - 1)
                    }
                  />
                </>
              ),
            }}
            columnBuffer={5}
            columns={columns}
            headerHeight={headerHeight}
            hideFooterSelectedRowCount={true}
            rowCount={receiptsList?.results?.length}
            getRowId={(el) => el.iuv}
            rowHeight={rowHeight}
            rows={receiptsList.results ?? []}
          />
        </div>
      )}
    </Box>
  );
}
