/* eslint-disable sonarjs/cognitive-complexity */
import { Chip, FormControl, MenuItem, Select } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { TFunction, useTranslation } from 'react-i18next';
import { generatePath } from 'react-router-dom';
import GridLinkAction from '../../../components/Table/GridLinkAction';
import ROUTES from '../../../routes';
import { bundleDetailsActions } from '../../../redux/slices/bundleDetailsSlice';
import { useAppDispatch } from '../../../redux/hooks';
import { dateDifferenceInDays, datesAreOnSameDay } from '../../../utils/common-utils';
import {
  renderCell,
  renderStatusChip,
  showCustomHeader,
} from '../../../components/Table/TableUtils';
import { BundleResource, SubscriptionStateType } from '../../../model/CommissionBundle';
import {
  CIBundleResource,
  CiBundleStatusEnum,
} from '../../../api/generated/portal/CIBundleResource';
import { TypeEnum } from '../../../api/generated/portal/PSPBundleResource';

export function buildColumnDefs(
  t: TFunction<'translation', undefined>,
  isPsp: boolean,
  isCi: boolean,
  setBundleStatus?: (value: SubscriptionStateType) => void,
  bundleStatus?: SubscriptionStateType
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
      renderHeader: (params) =>
        bundleStatus && setBundleStatus ? (
          <SelectStatusFilter setBundleStatus={setBundleStatus} bundleStatus={bundleStatus} />
        ) : (
          showCustomHeader(params)
        ),
      renderCell: (params) => getStateChip(params, t, isPsp, isCi),
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

export const getStateChip = (
  params: GridRenderCellParams,
  t: TFunction<'translation'>,
  isPsp: boolean,
  isCi: boolean
) => {
  const bundleDetails: BundleResource = params.row;
  const validityDateFrom = bundleDetails.validityDateFrom;
  const validityDateTo = bundleDetails.validityDateTo;
  const todayDate = new Date();

  if (isPsp) {
    return getGeneralStatusChip(t, todayDate, validityDateTo, validityDateFrom);
  }
  if (isCi) {
    return getCIStatusChip(
      t,
      todayDate,
      validityDateTo,
      validityDateFrom,
      bundleDetails.type,
      (bundleDetails as CIBundleResource).ciBundleStatus
    );
  }

  return '-';
};

const getGeneralStatusChip = (
  t: TFunction<'translation'>,
  todayDate: Date,
  validityDateTo: Date | undefined,
  validityDateFrom: Date | undefined
) => {
  if (validityDateTo && datesAreOnSameDay(todayDate, validityDateTo)) {
    return renderStatusChip({
      chipColor: 'error',
      chipLabel: t('commissionBundlesPage.list.states.eliminating'),
      dataTestId: 'error-state-chip',
    });
  }
  if (validityDateFrom && todayDate.getTime() < validityDateFrom.getTime()) {
    return renderStatusChip({
      chipColor: 'default',
      chipLabel: t('commissionBundlesPage.list.states.inActivation'),
      dataTestId: 'default-state-chip',
    });
  }
  if (validityDateTo && dateDifferenceInDays(todayDate, validityDateTo) <= 7) {
    return renderStatusChip({
      chipColor: 'warning',
      chipLabel: t('commissionBundlesPage.list.states.expiring'),
      dataTestId: 'warning-state-chip',
    });
  }

  return renderStatusChip({
    chipColor: 'success',
    chipLabel: t('commissionBundlesPage.list.states.active'),
    dataTestId: 'success-state-chip',
  });
};

const getCIStatusChip = (
  t: TFunction<'translation'>,
  todayDate: Date,
  validityDateTo: Date | undefined,
  validityDateFrom: Date | undefined,
  bundleType: TypeEnum | undefined,
  bundleStatus: CiBundleStatusEnum | undefined
) => {
  if (bundleStatus === CiBundleStatusEnum.AVAILABLE) {
    return (
      <Chip
        color={'default'}
        label={t('commissionBundlesPage.list.states.toBeActivated')}
        data-testid="default-state-chip"
      />
    );
  }

  if (bundleStatus === CiBundleStatusEnum.ON_REMOVAL) {
    return (
      <Chip
        color={'warning'}
        label={t('commissionBundlesPage.list.states.deactivated')}
        data-testid="error-state-chip"
      />
    );
  }

  if (bundleStatus === CiBundleStatusEnum.REQUESTED) {
    return (
      <Chip
        sx={{ backgroundColor: '#7ED5FC' }}
        label={t('commissionBundlesPage.list.states.requestInProgress')}
        data-testid="primary-state-chip"
      />
    );
  }

  if (bundleType === TypeEnum.GLOBAL || bundleStatus === CiBundleStatusEnum.ENABLED) {
    return getGeneralStatusChip(t, todayDate, validityDateTo, validityDateFrom);
  }

  return '-';
};

export const SelectStatusFilter = ({
  setBundleStatus,
  bundleStatus,
}: {
  setBundleStatus: (value: SubscriptionStateType) => void;
  bundleStatus: SubscriptionStateType;
}) => {
  const { t } = useTranslation();

  return (
    <FormControl variant="standard" sx={{ my: 1, minWidth: '110px' }}>
      <Select
        id={`bundleStatus`}
        labelId={`bundleStatusLabel`}
        name={`bundleStatus`}
        size="small"
        value={bundleStatus}
        onChange={(event) => {
          setBundleStatus(event.target.value as SubscriptionStateType);
        }}
        data-testid="bundleStatus-type-test"
        disableUnderline
        sx={{
          fontSize: '0.875rem',
          fontWeight: 'fontWeightBold',
          pt: 1,
          fontFamily: '"Titillium Web", sans-serif',
        }}
      >
        <MenuItem value={SubscriptionStateType.Accepted}>
          {t(`commissionBundlesPage.list.table.state.${SubscriptionStateType.Accepted}`)}
        </MenuItem>
        <MenuItem value={SubscriptionStateType.Waiting}>
          {t(`commissionBundlesPage.list.table.state.${SubscriptionStateType.Waiting}`)}
        </MenuItem>
      </Select>
    </FormControl>
  );
};
