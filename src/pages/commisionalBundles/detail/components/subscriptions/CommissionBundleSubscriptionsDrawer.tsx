import { Typography, Button, Divider, Skeleton } from '@mui/material';
import { Box } from '@mui/system';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { TFunction } from 'react-i18next';
import { PaddedDrawer } from '../../../../../components/PaddedDrawer';
import {
  PublicBundleCiSubscriptionDetailModel,
  SubscriptionStateType,
} from '../../../../../model/CommissionBundle';
import { getStatusChip } from './CommissionBundleSubscriptionsColumns';

const componentPath = 'commissionBundlesPage.commissionBundleDetail.subscriptionsTable.drawer';
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
    drawerButtons={getButtons(t, stateType, setOpenMenageSubscriptionModal)}
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
      {getStatusChip(t, stateType)}
    </Box>

    {/* TODO ADD TAXONOMIES */}
    {!selectedSubscriptionRequest?.bundle_request_id ? (
      <Skeleton animation="wave" variant="rectangular" width={'50%'} height={'1vh'} /> // TODO SKELETON COMPONENT
    ) : (
      selectedSubscriptionRequest?.ci_bundle_fee_list &&
      selectedSubscriptionRequest.ci_bundle_fee_list.length > 0 && <></>
    )}
  </PaddedDrawer>
);

function getButtons(
  t: TFunction<'translation', undefined>,
  stateType: string,
  setOpenMenageSubscriptionModal: (openModal: string) => void
) {
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

  return <></>;
}
