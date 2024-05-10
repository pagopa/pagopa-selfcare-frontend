import React from 'react';
import { Typography, Button, Divider, Skeleton } from '@mui/material';
import { Box } from '@mui/system';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { TFunction } from 'react-i18next';
import { PaddedDrawer } from '../../../../../components/PaddedDrawer';
import { CIBundleFee } from '../../../../../api/generated/portal/CIBundleFee';
import { formatCurrencyEur } from '../../../../../utils/common-utils';
import {
  PublicBundleCiSubscriptionDetailModel,
  SubscriptionStateType,
} from '../../../../../model/CommissionBundle';
import { getStatusChip } from './CommissionBundleSubscriptionsColumns';

const componentPath = 'commissionBundlesPage.commissionBundleDetail.subscriptionsTable.drawer';
const SkeletonComponent = () => (
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

export const CommissionBundleSubscriptionsDrawer = ({
  t,
  setSelectedSubscriptionRequest,
  selectedSubscriptionRequest,
  setOpenMenageSubscriptionModal,
  stateType,
}: {
  t: TFunction<'translation', undefined>;
  setSelectedSubscriptionRequest: (openDrawer: PublicBundleCiSubscriptionDetailModel) => void;
  selectedSubscriptionRequest: PublicBundleCiSubscriptionDetailModel;
  setOpenMenageSubscriptionModal: (openModal: string) => void;
  stateType: SubscriptionStateType;
}) => (
  <PaddedDrawer
    openDrawer={selectedSubscriptionRequest.creditor_institution_code !== undefined}
    setOpenDrawer={() => setSelectedSubscriptionRequest({})}
    drawerButtons={getButtons(
      t,
      stateType,
      setOpenMenageSubscriptionModal,
      selectedSubscriptionRequest.ci_bundle_fee_list !== undefined && !selectedSubscriptionRequest.on_removal
    )}
  >
    <TitleBox title={t(`${componentPath}.title`)} variantTitle="h5" />

    <Box my={1}>
      <Typography variant="body1" color="action.active">
        {t(`${componentPath}.businessName`)}
      </Typography>
      <Typography variant="body1" fontWeight={'fontWeightMedium'}>
        {selectedSubscriptionRequest?.business_name ?? '-'}
      </Typography>
    </Box>
    <Divider />
    <Box my={1}>
      <Typography variant="body1" color="action.active">
        {t(`${componentPath}.taxCode`)}
      </Typography>
      <Typography variant="body1" fontWeight={'fontWeightMedium'}>
        {selectedSubscriptionRequest?.creditor_institution_code ?? '-'}
      </Typography>
    </Box>
    <Divider />
    <Box my={1} display="flex">
      <Typography variant="body1" color="action.active">
        {t(`${componentPath}.state`)}
      </Typography>
      {getStatusChip(t, stateType, selectedSubscriptionRequest.on_removal, 'small')}
    </Box>
    {selectedSubscriptionRequest?.ci_bundle_fee_list === undefined ? (
      <SkeletonComponent />
    ) : (
      selectedSubscriptionRequest?.ci_bundle_fee_list.length > 0 && (
        <Box mb={3} mt={4}>
          <Box mb={2}>
            <Typography variant="overline" data-testid="bundle-fee-list">
              {t(`${componentPath}.feesTitle`)}
            </Typography>
          </Box>

          {selectedSubscriptionRequest?.ci_bundle_fee_list?.map((el: CIBundleFee) => (
            <Box mb={1} key={`taxonomies-list-${el.specificBuiltInData}`}>
              <Typography variant="body1" color="action.active">
                {el.serviceType}
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1" fontWeight={'fontWeightMedium'}>
                  {el.specificBuiltInData}
                </Typography>
                <Typography variant="body1" fontWeight={'fontWeightMedium'}>
                  {formatCurrencyEur(el.paymentAmount)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )
    )}
  </PaddedDrawer>
);

function getButtons(
  t: TFunction<'translation', undefined>,
  stateType: string,
  setOpenMenageSubscriptionModal: (openModal: string) => void,
  showButtons?: boolean
) {
  if (showButtons) {
    if (stateType === SubscriptionStateType.Waiting) {
      return (
        <>
          <Button
            fullWidth
            onClick={() => {
              setOpenMenageSubscriptionModal('accept');
            }}
            color="primary"
            variant="contained"
            data-testid="subscription-accept-button"
            sx={{ mb: 1 }}
          >
            {t(`${componentPath}.acceptButton`)}
          </Button>
          <Button
            fullWidth
            onClick={() => {
              setOpenMenageSubscriptionModal('reject');
            }}
            color="error"
            variant="outlined"
            data-testid="subscription-reject-button"
          >
            {t(`${componentPath}.rejectButton`)}
          </Button>
        </>
      );
    }
    if (stateType === SubscriptionStateType.Accepted) {
      return (
        <Button
          fullWidth
          onClick={() => {
            setOpenMenageSubscriptionModal('delete');
          }}
          color="error"
          variant="outlined"
          data-testid="subscription-delete-button"
        >
          {t(`${componentPath}.deleteButton`)}
        </Button>
      );
    }
  }

  return <></>;
}
