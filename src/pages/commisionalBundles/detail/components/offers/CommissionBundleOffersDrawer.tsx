import React from 'react';
import { Typography, Button, Divider, Skeleton } from '@mui/material';
import { Box } from '@mui/system';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { TFunction } from 'react-i18next';
import { PaddedDrawer } from '../../../../../components/PaddedDrawer';
import { CIBundleFee } from '../../../../../api/generated/portal/CIBundleFee';
import { formatCurrencyEur } from '../../../../../utils/common-utils';
import { getSpecificBuiltInData } from '../../../../../services/bundleService';
import { OfferStateType } from '../../../../../model/CommissionBundle';
import { getStatusChip } from './CommissionBundleOffersColumns';

const componentPath = 'commissionBundlesPage.commissionBundleDetail.offersTable.drawer';
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

export const CommissionBundleOffersDrawer = ({
  t,
  setSelectedOfferRequest,
  selectedOfferRequest,
  setOpenMenageOfferModal,
  stateType,
}: {
  t: TFunction<'translation', undefined>;
  setSelectedOfferRequest: (openDrawer: any) => void; // TODO type
  selectedOfferRequest: any; // TODO type
  setOpenMenageOfferModal: (openModal: boolean) => void;
  stateType: OfferStateType;
}) => (
  <PaddedDrawer
    openDrawer={selectedOfferRequest.creditor_institution_code !== undefined}
    setOpenDrawer={() => setSelectedOfferRequest({})}
    drawerButtons={
      <Button
        fullWidth
        onClick={() => {
          setOpenMenageOfferModal(true);
        }}
        color="error"
        variant="outlined"
        data-testid="subscription-delete-button"
      >
        {t(`${componentPath}.deleteButton`)}
      </Button>
    }
  >
    <TitleBox title={t(`${componentPath}.title`)} variantTitle="h5" />

    <Box my={1}>
      <Typography variant="body1" color="action.active">
        {t(`${componentPath}.businessName`)}
      </Typography>
      <Typography variant="body1" fontWeight={'fontWeightMedium'}>
        {selectedOfferRequest?.business_name ?? '-'}
      </Typography>
    </Box>
    <Divider />
    <Box my={1}>
      <Typography variant="body1" color="action.active">
        {t(`${componentPath}.taxCode`)}
      </Typography>
      <Typography variant="body1" fontWeight={'fontWeightMedium'}>
        {selectedOfferRequest?.creditor_institution_code ?? '-'}
      </Typography>
    </Box>
    <Divider />
    <Box my={1} display="flex">
      <Typography variant="body1" color="action.active">
        {t(`${componentPath}.state`)}
      </Typography>
      {getStatusChip(t, stateType, selectedOfferRequest.on_removal, 'small')}
    </Box>
    {selectedOfferRequest?.ci_bundle_fee_list === undefined ? (
      <SkeletonComponent />
    ) : (
      selectedOfferRequest?.ci_bundle_fee_list.length > 0 && (
        <Box mb={3} mt={4}>
          <Box mb={2}>
            <Typography variant="overline" data-testid="bundle-fee-list">
              {t(`${componentPath}.feesTitle`)}
            </Typography>
          </Box>

          {selectedOfferRequest?.ci_bundle_fee_list?.map((el: CIBundleFee) => (
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
      )
    )}
  </PaddedDrawer>
);
