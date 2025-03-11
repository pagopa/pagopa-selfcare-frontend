import { Divider, Typography, Paper, Grid } from '@mui/material';
import { useTranslation, TFunction } from 'react-i18next';
import { Box } from '@mui/system';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useState } from 'react';
import { PaddedDrawer } from '../../../../components/PaddedDrawer';
import {
  formatBooleanValueToYesOrNo,
  formatCurrencyEur,
  formatDateToDDMMYYYY,
} from '../../../../utils/common-utils';
import { BundleResource } from '../../../../model/CommissionBundle';
import {
  CIBundleResource,
  CiBundleStatusEnum,
} from '../../../../api/generated/portal/CIBundleResource';

const bundleConfigurationFields = {
  col1: [
    ['paymentType', 'commissionBundlesPage.addEditCommissionBundle.form.paymentType'],
    ['touchpoint', 'commissionBundlesPage.addEditCommissionBundle.form.touchpoint'],
    ['paymentAmount', 'commissionBundlesPage.addEditCommissionBundle.form.commission'],
  ],
  col2: [
    ['minPaymentAmount', 'commissionBundlesPage.addEditCommissionBundle.form.minImport'],
    ['maxPaymentAmount', 'commissionBundlesPage.addEditCommissionBundle.form.maxImport'],
    ['idBrokerPsp', 'commissionBundlesPage.addEditCommissionBundle.form.brokerCode'],
    ['pspBusinessName', 'commissionBundlesPage.addEditCommissionBundle.form.pspName'],
  ],
  col3: [
    ['idChannel', 'commissionBundlesPage.addEditCommissionBundle.form.channelCode'],
    ['cart', 'commissionBundlesPage.addEditCommissionBundle.form.cart'],
    ['onUs', 'commissionBundlesPage.addEditCommissionBundle.form.onUs'],
    ['digitalStamp', 'commissionBundlesPage.addEditCommissionBundle.form.paymentWithDigitalStamp'],
    [
      'digitalStampRestriction',
      'commissionBundlesPage.addEditCommissionBundle.form.paymentOnlyDigitalStamp',
    ],
  ],
  col4: [
    ['validityDateFrom', 'commissionBundlesPage.list.headerFields.startDate'],
    ['validityDateTo', 'commissionBundlesPage.list.headerFields.endDate'],
    ['lastUpdatedDate', 'commissionBundlesPage.commissionBundleDetail.lastChange'],
  ],
};
const formatConfigValues = (value: any, t: TFunction<'translation'>) => {
  if (typeof value === 'string' && value) {
    return t(value);
  }
  if (typeof value === 'boolean') {
    return formatBooleanValueToYesOrNo(value, t);
  }
  if (typeof value === 'number') {
    return formatCurrencyEur(value);
  }
  if (typeof value === 'object') {
    return formatDateToDDMMYYYY(value);
  }
  return '-';
};

export default function CommissionBundleDetailConfiguration({
  bundleDetail,
}: {
  bundleDetail: BundleResource;
}) {
  const { t } = useTranslation();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const columns: Array<Array<Array<string>>> = new Array(bundleConfigurationFields.col1);

  const mapColumn = (col: Array<Array<string>>, isDrawer: boolean, isFirstColumn?: boolean) =>
    col.map((entry: Array<string>, index: number) => (
      <Box mt={1} key={`config-detail-${entry[0]}`} data-testid="detail-column">
        {isDrawer && (!isFirstColumn || index !== 0) && <Divider />}
        <Typography variant="body1" color="action.active">
          {t(entry[1])}
        </Typography>
        <Typography variant="body1" fontWeight={'fontWeightMedium'}>
          {formatConfigValues(bundleDetail?.[entry[0] as keyof BundleResource], t)}
        </Typography>
      </Box>
    ));

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 2,
        padding: 3,
        minHeight:
          (bundleDetail as CIBundleResource)?.ciBundleStatus !== undefined &&
          (bundleDetail as CIBundleResource)?.ciBundleStatus !== CiBundleStatusEnum.AVAILABLE &&
          (bundleDetail as CIBundleResource)?.ciBundleStatus !==
            CiBundleStatusEnum.AVAILABLE_EXPIRED &&
          bundleDetail?.bundleTaxonomies?.length > 2
            ? '370px'
            : '310px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="overline">
        {t('commissionBundlesPage.commissionBundleDetail.configuration')}
      </Typography>
      <Grid container spacing={1}>
        {columns.map((col, i) => (
          <Grid item xs={12 / columns.length} key={`config-grid-item-${i}`}>
            {mapColumn(col, false)}
          </Grid>
        ))}
      </Grid>
      <ButtonNaked
        size="large"
        component="button"
        onClick={() => setOpenDrawer(true)}
        sx={{ color: 'primary.main', mt: 'auto', justifyContent: 'start' }}
        weight="default"
        data-testid="show-more-bundle-configuration-test"
      >
        + {t('general.showMore')}
      </ButtonNaked>
      <PaddedDrawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer}>
        <>
          <TitleBox
            title={t('commissionBundlesPage.commissionBundleDetail.configuration')}
            variantTitle="h4"
          />
          {Object.values(bundleConfigurationFields).map((col, i) => mapColumn(col, true, i === 0))}
        </>
      </PaddedDrawer>
    </Paper>
  );
}
