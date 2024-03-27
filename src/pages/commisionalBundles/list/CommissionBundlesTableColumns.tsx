/* eslint-disable sonarjs/cognitive-complexity */
import { Chip, Grid, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { GridColDef, GridColumnHeaderParams, GridRenderCellParams } from '@mui/x-data-grid';
import { TFunction } from 'react-i18next';
import React from 'react';
import { generatePath } from 'react-router-dom';
import GridLinkAction from '../../../components/Table/GridLinkAction';
import ROUTES from '../../../routes';
import { bundleDetailsActions } from '../../../redux/slices/bundleDetailsSlice';
import { useAppDispatch } from '../../../redux/hooks';
import { BundleResource, TypeEnum } from '../../../api/generated/portal/BundleResource';
import { dateDifferenceInDays, datesAreOnSameDay } from '../../../utils/common-utils';
import { renderCell, showCustomHeader } from '../../../components/Table/TableUtils';

export function buildColumnDefs(
  t: TFunction<'translation', undefined>,
  isPsp: boolean,
  isEc: boolean
) {
  return [
    {
      field: 'name',
      cellClassName: 'justifyContentBold',
      headerName: t('commissionBundlesPage.list.headerFields.bundleName'),
      align: 'left',
      headerAlign: 'left',
      minWidth: 400,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params: any) => renderCell({ value: params.row.name, mainCell: true }),
      sortable: true,
      flex: 4,
    },
    ...(isPsp
      ? [
          {
            field: 'validityDateFrom',
            cellClassName: 'justifyContentNormal',
            headerName: t('commissionBundlesPage.list.headerFields.startDate'),
            align: 'left',
            headerAlign: 'left',
            maxWidth: 150,
            editable: false,
            disableColumnMenu: true,
            renderHeader: showCustomHeader,
            renderCell: (params: any) =>
              renderCell({ value: params.row.validityDateFrom?.toLocaleDateString('en-GB') }),
            sortable: false,
            flex: 4,
          },
          {
            field: 'validityDateTo',
            cellClassName: 'justifyContentNormal',
            headerName: t('commissionBundlesPage.list.headerFields.endDate'),
            align: 'left',
            headerAlign: 'left',
            maxWidth: 150,
            editable: false,
            disableColumnMenu: true,
            renderHeader: showCustomHeader,
            renderCell: (params: any) =>
              renderCell({ value: params.row.validityDateTo?.toLocaleDateString('en-GB') }),
            sortable: false,
            flex: 4,
          },
        ]
      : []),
    {
      field: 'touchpoint',
      cellClassName: 'justifyContentNormal',
      headerName: t('commissionBundlesPage.list.headerFields.touchpoint'),
      align: 'left',
      headerAlign: 'left',
      maxWidth: 220,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell({ value: t(params.row.touchpoint) }),
      sortable: false,
      flex: 4,
    },
    {
      field: 'paymentType',
      cellClassName: 'justifyContentNormal',
      headerName: t('commissionBundlesPage.list.headerFields.paymentType'),
      align: 'left',
      headerAlign: 'left',
      width: 145,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell({ value: t(params.row.paymentType) }),
      sortable: false,
      flex: 4,
    },
    {
      field: 'state',
      cellClassName: 'justifyContentNormal',
      headerName: t('commissionBundlesPage.list.headerFields.state'),
      align: 'left',
      headerAlign: 'left',
      width: 200,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => showBundleState(params, t, isPsp, isEc),
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
        <GridLinkActionBundleDetails
          key={`Gestisci pacchetto-${params.row.idBundle}`}
          bundle={params.row}
        />,
      ],
      sortable: false,
      flex: 1,
    },
  ] as Array<GridColDef>;
}

export const GridLinkActionBundleDetails = ({ bundle }: { bundle: BundleResource }) => {
  const dispatcher = useAppDispatch();

  return (
    <GridLinkAction
      label="Gestisci pacchetto"
      onClick={() => dispatcher(bundleDetailsActions.setBundleDetailsState(bundle))}
      to={generatePath(ROUTES.COMMISSION_BUNDLES_DETAIL, { bundleId: bundle.idBundle })}
      icon={<ChevronRightIcon color="primary" />}
    />
  );
};

export function showBundleState(
  params: GridRenderCellParams,
  t: TFunction<'translation'>,
  isPsp: boolean,
  isEc: boolean
) {
  return (
    <React.Fragment>{renderCell({ value: getStateChip(params, t, isPsp, isEc) })}</React.Fragment>
  );
}

const getStateChip = (
  params: GridRenderCellParams,
  t: TFunction<'translation'>,
  isPsp: boolean,
  isEc: boolean
) => {
  const validityDateFrom = params.row.validityDateFrom;
  const validityDateTo = params.row.validityDateTo;
  const todayDate = new Date();

  if (isPsp && validityDateFrom && validityDateTo) {
    if (datesAreOnSameDay(todayDate, validityDateTo)) {
      return (
        <Chip
          color={'error'}
          label={t('commissionBundlesPage.list.states.eliminating')}
          data-testid="error-state-chip"
        />
      );
    }
    if (todayDate.getTime() < validityDateFrom.getTime()) {
      return (
        <Chip
          color={'default'}
          label={t('commissionBundlesPage.list.states.inActivation')}
          data-testid="default-state-chip"
        />
      );
    }
    if (dateDifferenceInDays(todayDate, validityDateTo) <= 7) {
      return (
        <Chip
          color={'warning'}
          label={t('commissionBundlesPage.list.states.expiring')}
          data-testid="warning-state-chip"
        />
      );
    }

    return (
      <Chip
        color={'success'}
        label={t('commissionBundlesPage.list.states.active')}
        data-testid="success-state-chip"
      />
    );
  }
  if (isEc) {
    if (params.row.type === TypeEnum.PUBLIC) {
      /* TODO
    if(isEc  && bundle not activated by EC ){
            return (
        <Chip
          color={'default'}
          label={t('commissionBundlesPage.list.states.toBeActivated')}
          data-testid="default-state-chip"
        />);
    }
*/
      /* TODO
    if(isEc  && bundle deactivated by EC ){
            return (
        <Chip
          color={'error'}
          label={t('commissionBundlesPage.list.states.deactivated')}
          data-testid="error-state-chip"
        />);
    }
*/
      /* TODO
    if(isEc  && bundle activated by EC less than 24 hours ago ){
            return (
        <Chip
          color={'primary'}
          label={t('commissionBundlesPage.list.states.requestInProgress')}
          data-testid="primary-state-chip"
        />);
    }
*/
      /* TODO
    if(isEc  && bundle activated by EC ){
            return (
       <Chip
          color={'success'}
          label={t('commissionBundlesPage.list.states.active')}
          data-testid="success-state-chip"
        />);
    }
*/
    }

    if (params.row.type === TypeEnum.PRIVATE) {
      if (validityDateTo && datesAreOnSameDay(todayDate, validityDateTo)) {
        return (
          <Chip
            color={'error'}
            label={t('commissionBundlesPage.list.states.eliminating')}
            data-testid="error-state-chip"
          />
        );
      }
      if (validityDateTo && dateDifferenceInDays(todayDate, validityDateTo) <= 7) {
        return (
          <Chip
            color={'warning'}
            label={t('commissionBundlesPage.list.states.expiring')}
            data-testid="warning-state-chip"
          />
        );
      }
      /* TODO
    if(isEc  && bundle not activated by EC ){
            return (
        <Chip
          color={'default'}
          label={t('commissionBundlesPage.list.states.toBeActivated')}
          data-testid="default-state-chip"
        />);
    }
*/
      /* TODO
    if(isEc  && bundle activated by EC ){
            return (
       <Chip
          color={'success'}
          label={t('commissionBundlesPage.list.states.active')}
          data-testid="success-state-chip"
        />);
    }
*/
    }

    if (params.row.type === TypeEnum.GLOBAL) {
      return (
        <Chip
          color={'success'}
          label={t('commissionBundlesPage.list.states.active')}
          data-testid="success-state-chip"
        />
      );
    }
  }

  return '-';
};
