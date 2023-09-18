import { Box, Grid, Typography } from '@mui/material';
import { GridColDef, GridColumnHeaderParams, GridRenderCellParams } from '@mui/x-data-grid';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { TFunction } from 'react-i18next';
import React, { CSSProperties, ReactNode } from 'react';
import { generatePath } from 'react-router-dom';
import GridLinkAction from '../../../components/Table/GridLinkAction';
import { FormAction } from '../../../model/Station';
import ROUTES from '../../../routes';

export function buildColumnDefs(t: TFunction<'translation', undefined>) {
  return [
    {
      field: 'packageName',
      cellClassName: 'justifyContentBold',
      headerName: t('commissionPackagesPage.list.headerFields.packageName'),
      align: 'left',
      headerAlign: 'left',
      minWidth: 485,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params: any) => showPackageName(params),
      sortable: true,
      flex: 4,
    },
    {
      field: 'startDate',
      cellClassName: 'justifyContentNormal',
      headerName: t('commissionPackagesPage.list.headerFields.startDate'),
      align: 'left',
      headerAlign: 'left',
      maxWidth: 200,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) =>
        renderCell(params.row.startDate?.toLocaleDateString('en-GB'), undefined),
      sortable: false,
      flex: 4,
    },
    {
      field: 'endDate',
      cellClassName: 'justifyContentNormal',
      headerName: t('commissionPackagesPage.list.headerFields.endDate'),
      align: 'left',
      headerAlign: 'left',
      maxWidth: 200,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) =>
        renderCell(params.row.endDate?.toLocaleDateString('en-GB'), undefined),
      sortable: false,
      flex: 4,
    },
    {
      field: 'Touchpoint',
      cellClassName: 'justifyContentNormal',
      headerName: t('commissionPackagesPage.list.headerFields.Touchpoint'),
      align: 'left',
      headerAlign: 'left',
      maxWidth: 220,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell(params.row.touchpoint),
      sortable: false,
      flex: 4,
    },
    {
      field: 'paymentType',
      cellClassName: 'justifyContentNormal',
      headerName: t('commissionPackagesPage.list.headerFields.paymentType'),
      align: 'left',
      headerAlign: 'left',
      width: 145,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell(params.row.touchpoint),
      sortable: false,
      flex: 4,
    },
    {
      field: 'amountRange',
      cellClassName: 'justifyContentNormal',
      headerName: t('commissionPackagesPage.list.headerFields.amountRange'),
      align: 'left',
      headerAlign: 'left',
      width: 145,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => showAmountRange(params),
      sortable: false,
      flex: 4,
    },
    {
      field: 'actions',
      cellClassName: 'justifyContentNormalRight',
      type: 'actions',
      headerName: '',
      align: 'center',
      hideSortIcons: true,
      disableColumnMenu: true,
      editable: false,

      getActions: (params: any) => {
        const managePackageAction = (
          <GridLinkAction
            key="Gestisci pacchetto"
            label="Gestisci pacchetto"
            to={generatePath('')}
            showInMenu={true}
          />
        );
        const manageRecipientsAction = (
          <GridLinkAction
            key="Gestisci destinatari"
            label="Gestisci destinatari"
            to={generatePath('')}
            showInMenu={true}
          />
        );

        return [managePackageAction, manageRecipientsAction];
      },
      sortable: false,
      flex: 1,
    },
  ] as Array<GridColDef>;
}

export function renderCell(
  params: GridRenderCellParams,
  value: ReactNode = params,
  overrideStyle: CSSProperties = {}
) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        paddingRight: '16px',
        paddingLeft: '16px',
        paddingTop: '-16px',
        paddingBottom: '-16px',
        marginLeft: '11px',
        cursor: 'pointer',
        WebkitBoxOrient: 'vertical' as const,
        ...overrideStyle,
      }}
    >
      <Box
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const,
          width: '100%',
          fontSize: '14px',
          variant: 'body2',
        }}
      >
        {value}
      </Box>
    </Box>
  );
}

export function showCustomHeader(params: GridColumnHeaderParams) {
  return (
    <React.Fragment>
      <Typography
        color="colorTextPrimary"
        variant="caption"
        sx={{ fontWeight: 'fontWeightBold', outline: 'none', paddingLeft: 5 }}
      >
        {params.colDef.headerName}
      </Typography>
    </React.Fragment>
  );
}

export function showPackageName(params: GridRenderCellParams) {
  return (
    <React.Fragment>
      {renderCell(
        params,
        <>
          <Grid container sx={{ width: '100%' }}>
            <Grid item xs={9} sx={{ width: '100%' }}>
              <Typography
                variant="body2"
                color="primary"
                sx={{
                  fontWeight: 'fontWeightBold',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical' as const,
                }}
              >
                {params.row.packageName}
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
    </React.Fragment>
  );
}

export function showAmountRange(params: GridRenderCellParams) {
  return (
    <React.Fragment>
      {renderCell(
        params,
        <>
          <Grid container sx={{ width: '100%' }}>
            <Grid item xs={9} sx={{ width: '100%' }}>
              <Typography variant="body2">
                {`${params.row.rangeAmountFrom} € - ${params.row.rangeAmountTo} €`}
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
    </React.Fragment>
  );
}
