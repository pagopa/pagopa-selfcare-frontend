import { Typography, Button, Divider } from '@mui/material';
import { Box } from '@mui/system';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { TFunction } from 'react-i18next';
import { PaddedDrawer } from '../../../../../components/PaddedDrawer';
import { SubscriptionStateType } from './CommissionBundleSubscriptionsTable';
import { getStatusChip } from './CommissionBundleSubscriptionsColumns';

const componentPath = 'commissionBundlesPage.commissionBundleDetail.subscriptionsTable.drawer';
export const CommissionBundleSubscriptionsDrawer = ({
  t,
  setDrawerValue,
  drawerValue,
  setOpenMenageSubscriptionModal,
  stateType,
}: {
  t: TFunction<'translation', undefined>;
  setDrawerValue: (openDrawer: any) => void; // TODO TYPE
  drawerValue: any; // TODO TYPE
  setOpenMenageSubscriptionModal: (openModal: string) => void;
  stateType: SubscriptionStateType;
}) => (
  <PaddedDrawer
    openDrawer={drawerValue?.ci_tax_code !== undefined}
    setOpenDrawer={setDrawerValue}
    drawerButtons={getButtons(t, stateType, setOpenMenageSubscriptionModal)}
  >
    <TitleBox title={t(`${componentPath}.title`)} variantTitle="h5" />

    <Box my={1}>
      <Typography variant="body1" color="action.active">
        {t(`${componentPath}.businessName`)}
      </Typography>
      <Typography variant="body1" fontWeight={'fontWeightMedium'}>
        {drawerValue?.business_name ?? '-'}
      </Typography>
    </Box>
    <Divider />
    <Box my={1}>
      <Typography variant="body1" color="action.active">
        {t(`${componentPath}.taxCode`)}
      </Typography>
      <Typography variant="body1" fontWeight={'fontWeightMedium'}>
        {drawerValue?.ci_tax_code ?? '-'}
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
