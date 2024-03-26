import { Box, Grid, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { GridColDef, GridColumnHeaderParams, GridRenderCellParams } from '@mui/x-data-grid';
import { TFunction } from 'react-i18next';
import React, { CSSProperties, ReactNode } from 'react';
import GridLinkAction from '../../../components/Table/GridLinkAction';
import ROUTES from '../../../routes';
import { useAppDispatch } from '../../../redux/hooks';
import { CIBrokerDelegationResource } from '../../../api/generated/portal/CIBrokerDelegationResource';

export function buildColumnDefs(
  t: TFunction<'translation', undefined>
) {
  return [
    {
      field: 'companyName',
      cellClassName: 'justifyContentBold',
      headerName: t('delegationsPage.column.companyName'),
      align: 'left',
      headerAlign: 'left',
      minWidth: 400,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params: any) => showName(params),
      sortable: true,
      flex: 4,
    },
    {
      field: 'taxCode',
      cellClassName: 'justifyContentNormal',
      headerName: t('delegationsPage.column.taxCode'),
      align: 'left',
      headerAlign: 'left',
      maxWidth: 250,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell(params.row.institution_tax_code),
      sortable: true,
      flex: 4,
    },
    {
      field: 'cbill',
      cellClassName: 'justifyContentNormal',
      headerName: t('delegationsPage.column.cbill'),
      align: 'left',
      headerAlign: 'left',
      width: 150,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell(t(params.row.cbill_code)),
      sortable: true,
      flex: 4,
    },
    {
      field: 'stations',
      cellClassName: 'justifyContentNormal',
      headerName: t('delegationsPage.column.stations'),
      align: 'left',
      headerAlign: 'left',
      width: 100,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell(params.row.institution_station_count),
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
      getActions: (params: any) => [
        <GridLinkActionDelegationDetails
          key={`Gestisci intermediario-${params.row.id}`}
          delegation={params.row}
        />,
      ],
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

export const GridLinkActionDelegationDetails = ({ delegation }: { delegation: CIBrokerDelegationResource }) => {
  const dispatcher = useAppDispatch();

  return (
    <GridLinkAction
      label="Gestisci intermediario"
      onClick={() => /* TODO ADD ON CLICK DETAILS */ {}}
      to={ROUTES.DELEGATIONS_LIST}
      icon={<ChevronRightIcon color="primary" />}
    />
  );
};

export function showCustomHeader(params: GridColumnHeaderParams) {
  return (
    <Typography
      color="colorTextPrimary"
      variant="caption"
      justifyContent="center"
      sx={{ fontWeight: 'fontWeightBold', outline: 'none', paddingLeft: 2 }}
    >
      {params.colDef.headerName}
    </Typography>
  );
}

export function showName(params: GridRenderCellParams) {
  return (
    <React.Fragment>
      {renderCell(
        params,
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
              {params.row.institution_name}
            </Typography>
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
}