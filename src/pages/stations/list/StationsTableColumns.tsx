import {Box, Chip, Grid, Typography} from '@mui/material';
import {GridColDef, GridColumnHeaderParams, GridRenderCellParams} from '@mui/x-data-grid';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import {TFunction} from 'react-i18next';
import React, {CSSProperties, ReactNode} from 'react';
import {generatePath} from 'react-router-dom';
import GridLinkAction from '../../../components/Table/GridLinkAction';
import {FormAction} from '../../../model/Station';
import ROUTES from '../../../routes';

export function buildColumnDefs(t: TFunction<'translation', undefined>) {
  return [
    {
      field: 'stationCode',
      cellClassName: 'justifyContentBold',
      headerName: t('stationsPage.stationsTableColumns.headerFields.name'),
      align: 'left',
      headerAlign: 'left',
      minWidth: 485,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params: any) => showStationID(params),
      sortable: true,
      flex: 4,
    },
    {
      field: 'createdAt',
      cellClassName: 'justifyContentNormal',
      headerName: t('stationsPage.stationsTableColumns.headerFields.creationDate'),
      align: 'left',
      headerAlign: 'left',
      maxWidth: 200,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) =>
        renderCell(params.row.createdAt?.toLocaleDateString('en-GB'), undefined),
      sortable: false,
      flex: 4,
    },
    {
      field: 'modifiedAt',
      cellClassName: 'justifyContentNormal',
      headerName: t('stationsPage.stationsTableColumns.headerFields.lastEditDate'),
      align: 'left',
      headerAlign: 'left',
      maxWidth: 200,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) =>
        renderCell(params.row.modifiedAt?.toLocaleDateString('en-GB'), undefined),
      sortable: false,
      flex: 4,
    },
    {
      field: 'activationDate',
      cellClassName: 'justifyContentNormal',
      headerName: t('stationsPage.stationsTableColumns.headerFields.activationDate'),
      align: 'left',
      headerAlign: 'left',
      maxWidth: 220,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) =>
        renderCell(params.row.activationDate?.toLocaleDateString('en-GB'), undefined),
      sortable: false,
      flex: 4,
    },
    {
      field: 'wrapperStatus',
      cellClassName: 'justifyContentNormal',
      headerName: t('stationsPage.stationsTableColumns.headerFields.status'),
      align: 'left',
      headerAlign: 'left',
      width: 145,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => showStatus(params),
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
        const manageStationAction = (
          <GridLinkAction
            key="Gestisci stazione"
            label="Gestisci stazione"
            to={generatePath(`${ROUTES.STATION_DETAIL}`, {
              stationId: params.row.stationCode,
            })}
            showInMenu={true}
          />
        );
        const editStationAction = (
          <GridLinkAction
            key="Modifica"
            label="Modifica"
            to={generatePath(`${ROUTES.STATION_EDIT}`, {
              stationId: params.row.stationCode,
              actionId: FormAction.Edit,
            })}
            showInMenu={true}
          />
        );
        const duplicateStationAction = (
          <GridLinkAction
            key="Duplica"
            label="Duplica"
            to={generatePath(`${ROUTES.STATION_EDIT}`, {
              stationId: params.row.stationCode,
              actionId: FormAction.Duplicate,
            })}
            showInMenu={true}
          />
        );
        const manageStationECAction = (
          <GridLinkAction
            key="Gestisci EC"
            label="Gestisci EC"
            to={generatePath(`${ROUTES.STATION_EC_LIST}`, { stationId: params.row.stationCode })}
            showInMenu={true}
          />
        );

        if (params.row.enabled) {
          return [manageStationAction, manageStationECAction, duplicateStationAction];
        } else {
          return [manageStationAction, editStationAction];
        }
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

export function showStationID(params: GridRenderCellParams) {
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
                {params.row.stationCode}
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
    </React.Fragment>
  );
}

export function showStatus(params: GridRenderCellParams) {
  return renderCell(
    params,
    <Box sx={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
      <Chip
        label={
          params.row.wrapperStatus === 'APPROVED'
            ? i18n.t('stationsPage.states.active')
            : params.row.wrapperStatus === 'TO_CHECK' ||
              params.row.wrapperStatus === 'TO_CHECK_UPDATE'
            ? i18n.t('stationsPage.states.revision')
            : i18n.t('stationsPage.states.needCorrection')
        }
        aria-label="Status"
        sx={{
          cursor: 'pointer',
          fontSize: '10px',
          fontWeight: 'fontWeightRegular',
          color: params.row.wrapperStatus === 'APPROVED' ? '#FFFFFF' : '#17324D',
          backgroundColor:
            params.row.wrapperStatus === 'APPROVED'
              ? 'primary.main'
              : params.row.wrapperStatus === 'TO_CHECK' ||
                params.row.wrapperStatus === 'TO_CHECK_UPDATE'
              ? '#EEEEEE'
              : 'warning.light',
          paddingBottom: '1px',
          height: '30px',
          marginY: 2,
          marginLeft: 2,
        }}
      />
    </Box>,
    {
      paddingLeft: 0,
      paddingRight: 0,
      textAlign: 'left',
    }
  );
}
