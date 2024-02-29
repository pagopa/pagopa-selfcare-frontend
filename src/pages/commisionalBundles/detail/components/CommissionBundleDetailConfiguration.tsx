import { Divider, Typography, Paper, Grid } from '@mui/material';
import { useTranslation, TFunction } from 'react-i18next';
import { Box } from '@mui/system';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useState } from 'react';
import { Bundle, TypeEnum } from '../../../../api/generated/portal/Bundle';
import { PaddedDrawer } from '../../../../components/PaddedDrawer';
import {
  formatBooleanValueToYesOrNo,
  formatCurrencyEur,
  formatDateToDDMMYYYY,
} from '../../../../utils/common-utils';

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
  ],
  col3: [
    ['idChannel', 'commissionBundlesPage.addEditCommissionBundle.form.channelCode'],
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
  // TODO updatedBy/"Modificato da" (API doesn't retrieve this info)
};
const formatConfigValues = (value: any, t: TFunction<'translation'>) => {
  if (typeof value === 'string') {
    return value;
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
  bundleDetail: Bundle;
}) {
  const { t } = useTranslation();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const bundleTypeGlobal: boolean = bundleDetail?.type === TypeEnum.GLOBAL;

  const columns: Array<Array<Array<string>>> = bundleTypeGlobal
    ? Object.values(bundleConfigurationFields)
    : new Array(bundleConfigurationFields.col1);

  const mapColumn = (col: Array<Array<string>>, isDrawer: boolean, isFirstColumn?: boolean) =>
    col.map((entry: Array<string>, index: number) => (
      <Box mt={1} key={`config-detail-${entry[0]}`}>
        {isDrawer && (!isFirstColumn || index !== 0) && <Divider />}
        <Typography variant="body1" color="text.disabled">
          {t(entry[1])}
        </Typography>
        <Typography variant="body1">
          {formatConfigValues(bundleDetail?.[entry[0] as keyof Bundle], t)}
        </Typography>
      </Box>
    ));

  return (
    <Paper elevation={3} sx={{ borderRadius: 2, padding: 3, minHeight: '310px' }}>
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

      {!bundleTypeGlobal && (
        <>
          <ButtonNaked
            size="large"
            component="button"
            onClick={() => setOpenDrawer(true)}
            sx={{ color: 'primary.main', mt: 3 }}
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
              {Object.values(bundleConfigurationFields).map((col, i) =>
                mapColumn(col, true, i === 0)
              )}
            </>
          </PaddedDrawer>
        </>
      )}
    </Paper>
  );
}
