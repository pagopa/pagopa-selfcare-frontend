import { TextField, InputAdornment, Button, Pagination } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { GridColumns, GridSearchIcon, GridValidRowModel } from '@mui/x-data-grid';
import React, { ChangeEvent, useState } from 'react';
import { ButtonNaked } from '@pagopa/mui-italia';

import { styled } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { theme } from '@pagopa/mui-italia';

const rowHeight = 64;
const headerHeight = 56;

export const CustomDataGrid = styled(DataGrid)({
  border: 'none !important',
  '& .MuiDataGrid-main': {
    background: `${theme.palette.background.default}`,
    padding: '0 24px 24px 24px',
    marginTop: '24px',
  },
  '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within, &.MuiDataGrid-root .MuiDataGrid-cell:focus-within':
    { outline: 'none' },
  '&.MuiDataGrid-root .MuiDataGrid-cell': {
    whiteSpace: 'normal !important',
    wordWrap: 'break-word !important',
    lineHeight: '25px !important',
  },
  '& .MuiDataGrid-columnHeaders': { borderBottom: 'none !important', padding: '24px' },
  '.justifyContentBold': {
    fontSize: '16px',
    fontWeight: '600',
    '&>div': {
      display: 'flex !important',
      alignItems: 'center',
    },
  },
  '.MuiDataGrid-columnSeparator': { display: 'none' },
  '.MuiDataGrid-cell ': { padding: '0px', borderBottom: 'none' },
  '.MuiDataGrid-columnHeaders': { borderBottom: 'none' },
  '.MuiDataGrid-row': {
    backgroundColor: 'white',
    '&.Mui-selected': {
      backgroundColor: 'transparent',
      '&:hover': { backgroundColor: 'transparent' },
    },
    '&:hover': {
      backgroundColor: 'rgba(23, 50, 77, 0.04)',
    },
  },
  '.justifyContentNormal': {
    fontSize: '16px',
    fontWeight: 'normal',
    '&>div': {
      display: 'flex !important',
      alignItems: 'center',
    },
  },
  '.justifyContentNormalRight': {
    fontSize: '16px',
    fontWeight: 'normal',
    '&>div': {
      display: 'flex !important',
      alignItems: 'center',
      justifyContent: 'right',
    },
  },
});

type Props = {
  rows: Array<any>;
  columns: GridColumns<GridValidRowModel>;
  totalPages?: number;
  page?: number;
  handleChangePage?: (value: number) => void;
  getRowId?: (item: any) => any;
};

export default function TableDataGrid({
  rows,
  columns,
  totalPages,
  page,
  handleChangePage,
  getRowId,
}: Readonly<Props>) {
  return (
    <div data-testid="data-grid">
      <CustomDataGrid
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        disableSelectionOnClick
        hideFooterSelectedRowCount
        autoHeight
        className="CustomDataGrid"
        columnBuffer={5}
        columns={columns}
        components={{
          Pagination: () =>
            handleChangePage ? (
              <Pagination
                color="primary"
                count={totalPages ?? 1}
                page={(page ?? 0) + 1}
                onChange={(_event: ChangeEvent<unknown>, value: number) => handleChangePage(value)}
              />
            ) : null,
        }}
        getRowId={(r: any) => (getRowId ? getRowId(r) : r.id)}
        headerHeight={headerHeight}
        paginationMode="client"
        rowCount={rows.length}
        rowHeight={rowHeight}
        rows={rows ?? []}
      />
    </div>
  );
}
