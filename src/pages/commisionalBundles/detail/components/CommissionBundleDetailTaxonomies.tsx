import React from 'react';
import { Paper, Typography, Divider, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/system';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useState } from 'react';
import { PaddedDrawer } from '../../../../components/PaddedDrawer';
import { BundleResource, BundleTaxonomy } from '../../../../model/CommissionBundle';

export default function CommissionBundleDetailTaxonomies({
  bundleDetail,
}: {
  bundleDetail: BundleResource;
}) {
  const { t } = useTranslation();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const bundleTaxonomies = bundleDetail?.bundleTaxonomies ?? [];

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 2,
        padding: 3,
        minHeight: '310px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="overline">
        {t('commissionBundlesPage.commissionBundleDetail.taxonomies')}
      </Typography>

      {bundleTaxonomies.length > 0 ? (
        bundleTaxonomies?.slice(0, 3)?.map((el: BundleTaxonomy, i: number) =>
          i < 4 ? (
            <Box key={`taxonomy-${el.specificBuiltInData}`} mt={1} data-testid="taxonomy-column">
              <Typography variant="body1" color="action.active">
                {el.serviceType}
              </Typography>
              <Typography variant="body1" fontWeight={'fontWeightMedium'}>
                {el.specificBuiltInData}
              </Typography>
            </Box>
          ) : null
        )
      ) : (
        <Alert severity="info" data-testid="alert-test" sx={{ mt: 2 }}>
          {t('commissionBundlesPage.commissionBundleDetail.noTaxonomiesAlert')}
        </Alert>
      )}
      {bundleTaxonomies.length > 3 && (
        <>
          <ButtonNaked
            size="large"
            component="button"
            onClick={() => setOpenDrawer(true)}
            sx={{ color: 'primary.main', mt: 'auto', justifyContent: 'start' }}
            weight="default"
            data-testid="show-more-bundle-taxonomies-test"
          >
            + {t('general.showMore')}
          </ButtonNaked>
          <PaddedDrawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer}>
            <TitleBox
              title={t('commissionBundlesPage.commissionBundleDetail.taxonomies')}
              variantTitle="h5"
            />
            {bundleTaxonomies.map((el: BundleTaxonomy, index: number) => (
              <React.Fragment key={`taxonomies-list-${el.specificBuiltInData}`}>
                {index !== 0 && <Divider />}
                <Box mb={1} data-testid="taxonomy-drawer-column">
                  <Typography variant="body1" color="action.active">
                    {el.serviceType}
                  </Typography>
                  <Typography variant="body1" fontWeight={'fontWeightMedium'}>
                    {el.specificBuiltInData}
                  </Typography>
                </Box>
              </React.Fragment>
            ))}
          </PaddedDrawer>
        </>
      )}
    </Paper>
  );
}
