<<<<<<< HEAD
import { Pagination, Grid, Select, MenuItem } from '@mui/material';
import { GridColumns, GridValidRowModel } from '@mui/x-data-grid';
import React, { ChangeEvent, ReactNode } from 'react';
import { styled } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { theme } from '@pagopa/mui-italia';
=======
import {Pagination, Grid, Select, MenuItem} from '@mui/material';
import {GridColumns, GridValidRowModel} from '@mui/x-data-grid';
import React, {ChangeEvent} from 'react';
import {styled} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import {theme} from '@pagopa/mui-italia';
>>>>>>> 3f32cfc3 (Formatting (#542))
import TableEmptyState from './TableEmptyState';

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
        {outline: 'none'},
    '&.MuiDataGrid-root .MuiDataGrid-cell': {
        whiteSpace: 'normal !important',
        wordWrap: 'break-word !important',
        lineHeight: '25px !important',
    },
    '& .MuiDataGrid-columnHeaders': {borderBottom: 'none !important', padding: '24px'},
    '.justifyContentBold': {
        fontSize: '16px',
        fontWeight: '600',
        '&>div': {
            display: 'flex !important',
            alignItems: 'center',
        },
    },
    '.MuiDataGrid-columnSeparator': {display: 'none'},
    '.MuiDataGrid-cell ': {padding: '0px', borderBottom: 'none'},
    '.MuiDataGrid-columnHeaders': {borderBottom: 'none'},
    '.MuiDataGrid-row': {
        backgroundColor: 'white',
        '&.Mui-selected': {
            backgroundColor: 'transparent',
            '&:hover': {backgroundColor: 'transparent'},
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
<<<<<<< HEAD
  componentPath: string;
  translationPathSuffix?: string;
<<<<<<< HEAD
  translationArgs?: any;
=======
>>>>>>> 85e19a10 ([VAS-776] feat: Implement Private Bundle Offers table for PSP (#526))
  rows: Array<any>;
  columns: GridColumns<GridValidRowModel>;
  totalPages?: number;
  page?: number;
  handleChangePage?: (value: number) => void;
  getRowId?: (item: any) => any;
  pageLimit?: number;
  setPageLimit?: (value: number) => void;
  linkToRedirect?: string;
  emptyStateChildren?: ReactNode;
=======
    componentPath: string;
    translationPathSuffix?: string;
    rows: Array<any>;
    columns: GridColumns<GridValidRowModel>;
    totalPages?: number;
    page?: number;
    handleChangePage?: (value: number) => void;
    getRowId?: (item: any) => any;
    pageLimit?: number;
    setPageLimit?: (value: number) => void;
    linkToRedirect?: string;
>>>>>>> 3f32cfc3 (Formatting (#542))
};

const pageLimitOptions = [5, 10, 15, 20];

export default function TableDataGrid({
<<<<<<< HEAD
  componentPath,
  translationPathSuffix,
<<<<<<< HEAD
  translationArgs,
  emptyStateChildren,
=======
>>>>>>> 85e19a10 ([VAS-776] feat: Implement Private Bundle Offers table for PSP (#526))
  // Datagrid Props
  rows,
  columns,
  getRowId,
  // Pagination props
  totalPages,
  page,
  handleChangePage,
  // Page limit props
  pageLimit,
  setPageLimit,
  // Table empty state props
  linkToRedirect,
}: Readonly<Props>) {
  return (
<<<<<<< HEAD
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
            handleChangePage && rows.length > 0 ? (
              <Grid container>
                <Grid item xs={6}>
                  {pageLimit && (
                    <Select
                      id={`pageLimitSelect`}
                      labelId={`pageLimitSelect`}
                      name={`pageLimitSelect`}
                      size="small"
                      value={pageLimit}
                      onChange={(e) => setPageLimit && setPageLimit(Number(e?.target.value))}
                      data-testid="page-limit-select"
                      disabled={!setPageLimit}
                    >
                      {pageLimitOptions.map((option: any) => (
                        <MenuItem key={'pagelimit-option' + String(option)} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </Grid>
                <Grid item xs={6} display={'flex'} justifyContent={'flex-end'}>
                  <Pagination
                    color="primary"
                    count={totalPages ?? 1}
                    page={(page ?? 0) + 1}
                    onChange={(_event: ChangeEvent<unknown>, value: number) =>
                      handleChangePage(value - 1)
                    }
                  />
                </Grid>
              </Grid>
            ) : null,
          NoRowsOverlay: () => (
            <TableEmptyState
              componentName={componentPath}
              linkToRedirect={linkToRedirect}
              translationPathSuffix={translationPathSuffix}
              translationArgs={translationArgs}
              isDataGrid={true}
            >
              {emptyStateChildren}
            </TableEmptyState>
          ),
        }}
        getRowId={(r: any) => (getRowId ? getRowId(r) : r.id)}
        headerHeight={headerHeight}
        paginationMode="server"
        rowCount={rows.length}
        rowHeight={rows.length > 0 ? rowHeight : 27}
        rows={rows}
      />
    </div>
=======
    <>
      {rows?.length === 0 ? (
        <TableEmptyState componentName={componentPath} linkToRedirect={linkToRedirect} translationPathSuffix={translationPathSuffix}/>
      ) : (
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
                  <Grid container>
                    <Grid item xs={6}>
                      {pageLimit && (
                        <Select
                          id={`pageLimitSelect`}
                          labelId={`pageLimitSelect`}
                          name={`pageLimitSelect`}
                          size="small"
                          value={pageLimit}
                          onChange={(e) => setPageLimit && setPageLimit(Number(e?.target.value))}
                          data-testid="page-limit-select"
                          disabled={!setPageLimit}
                        >
                          {pageLimitOptions.map((option: any) => (
                            <MenuItem key={'pagelimit-option' + String(option)} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    </Grid>
                    <Grid item xs={6} display={'flex'} justifyContent={'flex-end'}>
                      <Pagination
                        color="primary"
                        count={totalPages ?? 1}
                        page={(page ?? 0) + 1}
                        onChange={(_event: ChangeEvent<unknown>, value: number) =>
                          handleChangePage(value - 1)
                        }
                      />
                    </Grid>
                  </Grid>
                ) : null,
            }}
            getRowId={(r: any) => (getRowId ? getRowId(r) : r.id)}
            headerHeight={headerHeight}
            paginationMode="server"
            rowCount={rows.length}
            rowHeight={rowHeight}
            rows={rows ?? []}
          />
        </div>
      )}
    </>
>>>>>>> 85e19a10 ([VAS-776] feat: Implement Private Bundle Offers table for PSP (#526))
  );
=======
                                          componentPath,
                                          translationPathSuffix,
                                          // Datagrid Props
                                          rows,
                                          columns,
                                          getRowId,
                                          // Pagination props
                                          totalPages,
                                          page,
                                          handleChangePage,
                                          // Page limit props
                                          pageLimit,
                                          setPageLimit,
                                          // Table empty state props
                                          linkToRedirect,
                                      }: Readonly<Props>) {
    return (
        <>
            {rows?.length === 0 ? (
                <TableEmptyState componentName={componentPath} linkToRedirect={linkToRedirect}
                                 translationPathSuffix={translationPathSuffix}/>
            ) : (
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
                                    <Grid container>
                                        <Grid item xs={6}>
                                            {pageLimit && (
                                                <Select
                                                    id={`pageLimitSelect`}
                                                    labelId={`pageLimitSelect`}
                                                    name={`pageLimitSelect`}
                                                    size="small"
                                                    value={pageLimit}
                                                    onChange={(e) => setPageLimit && setPageLimit(Number(e?.target.value))}
                                                    data-testid="page-limit-select"
                                                    disabled={!setPageLimit}
                                                >
                                                    {pageLimitOptions.map((option: any) => (
                                                        <MenuItem key={'pagelimit-option' + String(option)}
                                                                  value={option}>
                                                            {option}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            )}
                                        </Grid>
                                        <Grid item xs={6} display={'flex'} justifyContent={'flex-end'}>
                                            <Pagination
                                                color="primary"
                                                count={totalPages ?? 1}
                                                page={(page ?? 0) + 1}
                                                onChange={(_event: ChangeEvent<unknown>, value: number) =>
                                                    handleChangePage(value - 1)
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                ) : null,
                        }}
                        getRowId={(r: any) => (getRowId ? getRowId(r) : r.id)}
                        headerHeight={headerHeight}
                        paginationMode="server"
                        rowCount={rows.length}
                        rowHeight={rowHeight}
                        rows={rows ?? []}
                    />
                </div>
            )}
        </>
    );
>>>>>>> 3f32cfc3 (Formatting (#542))
}
