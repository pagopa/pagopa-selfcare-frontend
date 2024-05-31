import { Divider, Skeleton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'react-i18next';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { CIBundleFee } from '../../../../../api/generated/portal/CIBundleFee';
import { getSpecificBuiltInData } from '../../../../../services/bundleService';
import { formatCurrencyEur } from '../../../../../utils/common-utils';
import { PaddedDrawer } from '../../../../../components/PaddedDrawer';
import {
  OfferStateType,
  PublicBundleCiSubscriptionDetailModel,
  SubscriptionStateType,
} from '../../../../../model/CommissionBundle';
import { colorType, renderStatusChip } from '../../../../../components/Table/TableUtils';

export const CommissionBundleDrawerSkeletonComponent = () => (
  <>
    <Box pb={2} pt={3} key={`skeleton-0`} data-testid="skeleton-component">
      <Skeleton animation="wave" variant="rectangular" width={'100%'} height={'1vh'} />
    </Box>
    {[...Array(5)].map((_, index) => (
      <React.Fragment key={`skeleton${index}-1`}>
        <Box pb={0.5}>
          <Skeleton animation="wave" variant="rectangular" width={'100%'} height={'0.5vh'} />
        </Box>
        <Box pb={1.5}>
          <Skeleton animation="wave" variant="rectangular" width={'100%'} height={'1vh'} />
        </Box>
      </React.Fragment>
    ))}
  </>
);

export const CommissionBundleDrawerCommissionFeeList = ({
  feeList,
}: {
  feeList: Array<CIBundleFee> | undefined;
}) => {
  const { t } = useTranslation();
  const componentPath = 'commissionBundlesPage.commissionBundleDetail.requestDrawer';
  return feeList === undefined ? (
    <CommissionBundleDrawerSkeletonComponent />
  ) : feeList.length > 0 ? (
    <Box mb={3} mt={4}>
      <Box mb={2}>
        <Typography variant="overline" data-testid="bundle-fee-list">
          {t(`${componentPath}.feesTitle`)}
        </Typography>
      </Box>

      {feeList.map((el: CIBundleFee) => (
        <Box mb={1} key={`taxonomies-list-${el.specificBuiltInData ?? 'all'}`}>
          <Typography variant="body1" color="action.active">
            {el.serviceType}
          </Typography>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body1" fontWeight={'fontWeightMedium'}>
              {getSpecificBuiltInData(t, el.specificBuiltInData)}
            </Typography>
            <Typography variant="body1" fontWeight={'fontWeightMedium'}>
              {formatCurrencyEur(el.paymentAmount)}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  ) : null;
};

export const getRequestStatusChip = (
  t: TFunction<'translation', undefined>,
  filterState: SubscriptionStateType | OfferStateType,
  componentPath: string,
  onRemoval: boolean | undefined = undefined,
  size: 'small' | 'medium' | undefined = undefined
) => {
  // eslint-disable-next-line functional/no-let
  let chipColor: colorType =
    filterState === SubscriptionStateType.Accepted || filterState === OfferStateType.Active
      ? 'success'
      : 'default';
  if (onRemoval) {
    chipColor = 'error';
  }
  return renderStatusChip({
    chipColor,
    chipLabel: t(
      `${componentPath}.stateChip.${
        onRemoval ? 'DELETING' : filterState
      }`
    ),
    dataTestId: `${onRemoval ? 'DELETING' : filterState}-state-chip`,
    size,
  });
};

export const CommissionBundleDetailRequestDrawer = ({
  setSelectedRequest,
  selectedRequest,
  stateType,
  drawerButtons,
  componentPath
}: {
  setSelectedRequest: (openDrawer: PublicBundleCiSubscriptionDetailModel) => void; // TODO double type
  selectedRequest: PublicBundleCiSubscriptionDetailModel; // TODO double type
  stateType: SubscriptionStateType | OfferStateType;
  drawerButtons: () => any;
  componentPath: string;
}) => {
  const { t } = useTranslation();
  const generalPath = 'commissionBundlesPage.commissionBundleDetail.requestsTable';
  return (
    <PaddedDrawer
      openDrawer={selectedRequest.creditor_institution_code !== undefined}
      setOpenDrawer={() => setSelectedRequest({})}
      drawerButtons={drawerButtons()}
    >
      <TitleBox title={t(`${componentPath}.drawerTitle`)} variantTitle="h5" />

      <Box my={1}>
        <Typography variant="body1" color="action.active">
          {t(`${generalPath}.businessName`)}
        </Typography>
        <Typography variant="body1" fontWeight={'fontWeightMedium'}>
          {selectedRequest?.business_name ?? '-'}
        </Typography>
      </Box>
      <Divider />
      <Box my={1}>
        <Typography variant="body1" color="action.active">
          {t(`${generalPath}.taxCode`)}
        </Typography>
        <Typography variant="body1" fontWeight={'fontWeightMedium'}>
          {selectedRequest?.creditor_institution_code ?? '-'}
        </Typography>
      </Box>
      <Divider />
      <Box my={1} display="flex">
        <Typography variant="body1" color="action.active">
          {t(`${generalPath}.state`)}
        </Typography>
        {getRequestStatusChip(t, stateType, componentPath, selectedRequest.on_removal, 'small')}
      </Box>
      <CommissionBundleDrawerCommissionFeeList
        feeList={selectedRequest?.ci_bundle_fee_list ? [...selectedRequest.ci_bundle_fee_list] : undefined}
      />
    </PaddedDrawer>
  );
};
