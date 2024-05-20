import { Box, Chip } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { TFunction } from 'react-i18next';
import { generatePath } from 'react-router-dom';
import GridLinkAction from '../../../components/Table/GridLinkAction';
import { FormAction } from '../../../model/Station';
import ROUTES from '../../../routes';
import { StatusEnum } from '../../../api/generated/portal/StationDetailsDto';
import { renderCell, showCustomHeader } from '../../../components/Table/TableUtils';
import { WrapperStatusEnum } from '../../../api/generated/portal/WrapperStationResource';

export function buildColumnDefs(
  t: TFunction<'translation', undefined>,
  userIsPagopaOperator: boolean
) {
  return [
    {
      field: 'stationCode',
      cellClassName: 'justifyContentBold',
      headerName: t('stationsPage.stationsTableColumns.headerFields.name'),
      align: 'left',
      headerAlign: 'left',
      minWidth: userIsPagopaOperator ? 900 : 485,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params: any) => renderCell({ value: params.row.stationCode, mainCell: true }),
      sortable: false,
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
        renderCell({ value: params.row.createdAt?.toLocaleDateString('en-GB') }),
      sortable: false,
      flex: 4,
    },
    ...(userIsPagopaOperator
      ? []
      : [
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
            renderCell: (params: any) =>
              renderCell({ value: params.row.modifiedAt?.toLocaleDateString('en-GB') }),
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
            renderCell: (params: any) =>
              renderCell({ value: params.row.activationDate?.toLocaleDateString('en-GB') }),
            sortable: false,
            flex: 4,
          },
        ]),
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
      renderCell: (params) => showStatus(params, userIsPagopaOperator),
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
        if (userIsPagopaOperator) {
          return [
            <GridLinkAction
              key="Gestisci stazione"
              label="Gestisci stazione"
              to={generatePath(`${ROUTES.STATION_DETAIL}`, {
                stationId: params.row.stationCode,
              })}
              icon={<ChevronRightIcon color="primary" />}
            />,
          ];
        }
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

        if (params.row.wrapperStatus === StatusEnum.APPROVED) {
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

// TODO check to clean
// eslint-disable-next-line sonarjs/cognitive-complexity
export function showStatus(params: GridRenderCellParams, userIsPagopaOperator: boolean) {
  return renderCell({
    value: (
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Chip
          label={
            params.row.wrapperStatus === WrapperStatusEnum.APPROVED
              ? i18n.t('stationsPage.states.active')
              : params.row.wrapperStatus === WrapperStatusEnum.TO_CHECK ||
                params.row.wrapperStatus === WrapperStatusEnum.TO_CHECK_UPDATE
              ? i18n.t(`stationsPage.states.${userIsPagopaOperator ? 'validate' : 'revision'}`)
              : i18n.t(
                  `stationsPage.states.${userIsPagopaOperator ? 'waitingUpdate' : 'needCorrection'}`
                )
          }
          aria-label="Status"
          sx={{
            fontSize: '10px',
            fontWeight: 'fontWeightRegular',
            color: params.row.wrapperStatus === WrapperStatusEnum.APPROVED ? '#FFFFFF' : '#17324D',
            backgroundColor:
              params.row.wrapperStatus === WrapperStatusEnum.APPROVED
                ? 'primary.main'
                : params.row.wrapperStatus === WrapperStatusEnum.TO_CHECK ||
                  params.row.wrapperStatus === WrapperStatusEnum.TO_CHECK_UPDATE
                ? userIsPagopaOperator
                  ? 'warning.light'
                  : '#EEEEEE'
                : userIsPagopaOperator
                ? '#EEEEEE'
                : 'warning.light',
            paddingBottom: '1px',
            height: '30px',
            marginY: 2,
            marginLeft: 2,
          }}
        />
      </Box>
    ),
    overrideStyle: {
      paddingLeft: 0,
      paddingRight: 0,
      textAlign: 'left',
    },
  });
}
