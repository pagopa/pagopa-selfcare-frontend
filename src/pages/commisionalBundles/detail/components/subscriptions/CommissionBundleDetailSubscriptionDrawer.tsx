<<<<<<< HEAD
<<<<<<< HEAD
import { Alert, Divider, Skeleton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'react-i18next';
import {TitleBox} from '@pagopa/selfcare-common-frontend';
import {CIBundleFee} from '../../../../../api/generated/portal/CIBundleFee';
import {getSpecificBuiltInData} from '../../../../../services/bundleService';
import {formatCurrencyEur} from '../../../../../utils/common-utils';
import {PaddedDrawer} from '../../../../../components/PaddedDrawer';
import {
    BundleCiSubscriptionDetailModel,
    SubscriptionStateType,
} from '../../../../../model/CommissionBundle';
import {colorType, renderStatusChip} from '../../../../../components/Table/TableUtils';

export const CommissionBundleDrawerSkeletonComponent = () => (
    <>
        <Box pb={2} pt={3} key={`skeleton-0`} data-testid="skeleton-component">
            <Skeleton animation="wave" variant="rectangular" width={'100%'} height={'1vh'}/>
        </Box>
        {[...Array(5)].map((_, index) => (
            <React.Fragment key={`skeleton${index}-1`}>
                <Box pb={0.5}>
                    <Skeleton animation="wave" variant="rectangular" width={'100%'} height={'0.5vh'}/>
                </Box>
                <Box pb={1.5}>
                    <Skeleton animation="wave" variant="rectangular" width={'100%'} height={'1vh'}/>
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
    const {t} = useTranslation();
    const componentPath = 'commissionBundlesPage.commissionBundleDetail.requestDrawer';
    return feeList === undefined ? (
        <CommissionBundleDrawerSkeletonComponent/>
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

export const getSubscriptionStatusChip = (
    t: TFunction<'translation', undefined>,
    filterState: SubscriptionStateType,
    componentPath: string,
    onRemoval: boolean | undefined = undefined,
    size: 'small' | 'medium' | undefined = undefined
) => {
  // eslint-disable-next-line functional/no-let
  let chipColor: colorType = filterState === SubscriptionStateType.Accepted ? 'success' : 'default';
=======
import { Divider, Skeleton, Typography } from '@mui/material';
import { Box } from '@mui/system';
=======
import {Divider, Skeleton, Typography} from '@mui/material';
import {Box} from '@mui/system';
>>>>>>> 3f32cfc3 (Formatting (#542))
import React from 'react';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'react-i18next';
import {TitleBox} from '@pagopa/selfcare-common-frontend';
import {CIBundleFee} from '../../../../../api/generated/portal/CIBundleFee';
import {getSpecificBuiltInData} from '../../../../../services/bundleService';
import {formatCurrencyEur} from '../../../../../utils/common-utils';
import {PaddedDrawer} from '../../../../../components/PaddedDrawer';
import {
    BundleCiSubscriptionDetailModel,
    SubscriptionStateType,
} from '../../../../../model/CommissionBundle';
import {colorType, renderStatusChip} from '../../../../../components/Table/TableUtils';

export const CommissionBundleDrawerSkeletonComponent = () => (
    <>
        <Box pb={2} pt={3} key={`skeleton-0`} data-testid="skeleton-component">
            <Skeleton animation="wave" variant="rectangular" width={'100%'} height={'1vh'}/>
        </Box>
        {[...Array(5)].map((_, index) => (
            <React.Fragment key={`skeleton${index}-1`}>
                <Box pb={0.5}>
                    <Skeleton animation="wave" variant="rectangular" width={'100%'} height={'0.5vh'}/>
                </Box>
                <Box pb={1.5}>
                    <Skeleton animation="wave" variant="rectangular" width={'100%'} height={'1vh'}/>
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
    const {t} = useTranslation();
    const componentPath = 'commissionBundlesPage.commissionBundleDetail.requestDrawer';
    return feeList === undefined ? (
        <CommissionBundleDrawerSkeletonComponent/>
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

export const getSubscriptionStatusChip = (
    t: TFunction<'translation', undefined>,
    filterState: SubscriptionStateType,
    componentPath: string,
    onRemoval: boolean | undefined = undefined,
    size: 'small' | 'medium' | undefined = undefined
) => {
<<<<<<< HEAD
  // eslint-disable-next-line functional/no-let
  let chipColor: colorType =
    filterState === SubscriptionStateType.Accepted
      ? 'success'
      : 'default';
>>>>>>> 85e19a10 ([VAS-776] feat: Implement Private Bundle Offers table for PSP (#526))
  if (onRemoval) {
    chipColor = 'error';
  }
  return renderStatusChip({
    chipColor,
<<<<<<< HEAD
    chipLabel: t(`${componentPath}.stateChip.${onRemoval ? 'DELETING' : filterState}`),
=======
    chipLabel: t(
      `${componentPath}.stateChip.${
        onRemoval ? 'DELETING' : filterState
      }`
    ),
>>>>>>> 85e19a10 ([VAS-776] feat: Implement Private Bundle Offers table for PSP (#526))
    dataTestId: `${onRemoval ? 'DELETING' : filterState}-state-chip`,
    size,
  });
};

export const CommissionBundleDetailSubscriptionDrawer = ({
  setSelectedSubscription,
  selectedSubscription,
  stateType,
  drawerButtons,
<<<<<<< HEAD
  componentPath,
=======
  componentPath
>>>>>>> 85e19a10 ([VAS-776] feat: Implement Private Bundle Offers table for PSP (#526))
}: {
  setSelectedSubscription: (openDrawer: BundleCiSubscriptionDetailModel) => void;
  selectedSubscription: BundleCiSubscriptionDetailModel;
  stateType: SubscriptionStateType;
  drawerButtons: () => any;
  componentPath: string;
}) => {
  const { t } = useTranslation();
  const generalPath = 'commissionBundlesPage.commissionBundleDetail.subscriptionsTable';
  return (
    <PaddedDrawer
      openDrawer={selectedSubscription.creditor_institution_code !== undefined}
      setOpenDrawer={() => setSelectedSubscription({})}
      drawerButtons={drawerButtons()}
    >
      <TitleBox title={t(`${componentPath}.drawerTitle`)} variantTitle="h5" />
<<<<<<< HEAD
      {selectedSubscription.bundle_offer_id && stateType === SubscriptionStateType.Waiting && (
        <Box mt={2}>
          <Alert severity="info">{t(`${generalPath}.alert.waitingMessage`)}</Alert>
        </Box>
      )}
=======

>>>>>>> 85e19a10 ([VAS-776] feat: Implement Private Bundle Offers table for PSP (#526))
      <Box my={1}>
        <Typography variant="body1" color="action.active">
          {t(`${generalPath}.businessName`)}
        </Typography>
        <Typography variant="body1" fontWeight={'fontWeightMedium'}>
          {selectedSubscription?.business_name ?? '-'}
        </Typography>
      </Box>
      <Divider />
      <Box my={1}>
        <Typography variant="body1" color="action.active">
          {t(`${generalPath}.taxCode`)}
        </Typography>
        <Typography variant="body1" fontWeight={'fontWeightMedium'}>
          {selectedSubscription?.creditor_institution_code ?? '-'}
        </Typography>
      </Box>
      <Divider />
      <Box my={1} display="flex">
        <Typography variant="body1" color="action.active">
          {t(`${generalPath}.state`)}
        </Typography>
<<<<<<< HEAD
        {getSubscriptionStatusChip(
          t,
          stateType,
          componentPath,
          selectedSubscription.on_removal,
          'small'
        )}
      </Box>
      <CommissionBundleDrawerCommissionFeeList
        feeList={
          selectedSubscription?.ci_bundle_fee_list
            ? [...selectedSubscription.ci_bundle_fee_list]
            : undefined
        }
=======
        {getSubscriptionStatusChip(t, stateType, componentPath, selectedSubscription.on_removal, 'small')}
      </Box>
      <CommissionBundleDrawerCommissionFeeList
        feeList={selectedSubscription?.ci_bundle_fee_list ? [...selectedSubscription.ci_bundle_fee_list] : undefined}
>>>>>>> 85e19a10 ([VAS-776] feat: Implement Private Bundle Offers table for PSP (#526))
      />
    </PaddedDrawer>
  );
=======
    // eslint-disable-next-line functional/no-let
    let chipColor: colorType =
        filterState === SubscriptionStateType.Accepted
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

export const CommissionBundleDetailSubscriptionDrawer = ({
                                                             setSelectedSubscription,
                                                             selectedSubscription,
                                                             stateType,
                                                             drawerButtons,
                                                             componentPath
                                                         }: {
    setSelectedSubscription: (openDrawer: BundleCiSubscriptionDetailModel) => void;
    selectedSubscription: BundleCiSubscriptionDetailModel;
    stateType: SubscriptionStateType;
    drawerButtons: () => any;
    componentPath: string;
}) => {
    const {t} = useTranslation();
    const generalPath = 'commissionBundlesPage.commissionBundleDetail.subscriptionsTable';
    return (
        <PaddedDrawer
            openDrawer={selectedSubscription.creditor_institution_code !== undefined}
            setOpenDrawer={() => setSelectedSubscription({})}
            drawerButtons={drawerButtons()}
        >
            <TitleBox title={t(`${componentPath}.drawerTitle`)} variantTitle="h5"/>

            <Box my={1}>
                <Typography variant="body1" color="action.active">
                    {t(`${generalPath}.businessName`)}
                </Typography>
                <Typography variant="body1" fontWeight={'fontWeightMedium'}>
                    {selectedSubscription?.business_name ?? '-'}
                </Typography>
            </Box>
            <Divider/>
            <Box my={1}>
                <Typography variant="body1" color="action.active">
                    {t(`${generalPath}.taxCode`)}
                </Typography>
                <Typography variant="body1" fontWeight={'fontWeightMedium'}>
                    {selectedSubscription?.creditor_institution_code ?? '-'}
                </Typography>
            </Box>
            <Divider/>
            <Box my={1} display="flex">
                <Typography variant="body1" color="action.active">
                    {t(`${generalPath}.state`)}
                </Typography>
                {getSubscriptionStatusChip(t, stateType, componentPath, selectedSubscription.on_removal, 'small')}
            </Box>
            <CommissionBundleDrawerCommissionFeeList
                feeList={selectedSubscription?.ci_bundle_fee_list ? [...selectedSubscription.ci_bundle_fee_list] : undefined}
            />
        </PaddedDrawer>
    );
>>>>>>> 3f32cfc3 (Formatting (#542))
};
