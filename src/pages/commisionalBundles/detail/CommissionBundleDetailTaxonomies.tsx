import { Paper, Typography, Divider, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/system';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useErrorDispatcher, TitleBox } from '@pagopa/selfcare-common-frontend';
import { useState, useEffect } from 'react';
import { Bundle } from '../../../api/generated/portal/Bundle';
import { Taxonomy } from '../../../api/generated/portal/Taxonomy';
import { PaddedDrawer } from '../../../components/PaddedDrawer';
import { getTaxonomies } from '../../../services/taxonomyService';

export default function CommissionBundleDetailTaxonomies({
  bundleDetail,
}: {
  bundleDetail: Bundle;
}) {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const [bundleTaxonomies, setBundleTaxonomies] = useState<Array<Taxonomy>>([]);

  useEffect(() => {
    if (bundleDetail?.transferCategoryList && bundleDetail?.transferCategoryList?.length > 0) {
      getTaxonomies()
        .then((data) => {
          const filteredTaxonomies = data?.taxonomies?.filter((el) =>
            bundleDetail.transferCategoryList?.includes(el.specific_built_in_data)
          );
          setBundleTaxonomies(filteredTaxonomies);
        })
        .catch((err) =>
          addError({
            id: 'GET_COMMISSION_BUNDLE_DETAILS_TAXONOMIES',
            blocking: false,
            error: err as Error,
            techDescription: `An error occurred while getting the taxonomies' list`,
            toNotify: true,
            displayableTitle: t('general.errorTitle'),
            displayableDescription: t(
              'commissionBundlesPage.list.error.taxonomiesErrorMessageDesc'
            ),
            component: 'Toast',
          })
        );
    }
  }, [bundleDetail]);

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
        bundleTaxonomies
          ?.filter((_, i) => i < 3)
          ?.map((el, i) =>
            i < 4 ? (
              <Box key={`taxonomy-${el.specific_built_in_data}`} mt={1} data-testid="taxonomy-column">
                <Typography variant="body1" color="text.disabled">
                  {el.service_type}
                </Typography>
                <Typography variant="body1">{el.specific_built_in_data}</Typography>
              </Box>
            ) : null
          )
      ) : (
        <Alert severity="info" variant="outlined" data-testid="alert-test" sx={{ mt: 2 }}>
          {t('commissionBundlesPage.commissionBundleDetail.noTaxonomiesAlert')}
        </Alert>
      )}
      {bundleTaxonomies?.length > 3 && (
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
            {bundleTaxonomies.map((el, index) => (
              <>
                {index !== 0 && <Divider />}
                <Box key={`taxonomies-list-${el.specific_built_in_data}`} mb={1}  data-testid="taxonomy-drawer-column">
                  <Typography variant="body1" color="text.disabled">
                    {el.macro_area_name}
                  </Typography>
                  <Typography variant="body1">{el.service_type}</Typography>
                </Box>
              </>
            ))}
          </PaddedDrawer>
        </>
      )}
    </Paper>
  );
}
