import React, {useState} from 'react';
import {Alert, Divider, Paper, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {Box} from '@mui/system';
import {ButtonNaked} from '@pagopa/mui-italia';
import {TitleBox} from '@pagopa/selfcare-common-frontend';
import {PaddedDrawer} from '../../../../components/PaddedDrawer';
import {BundleResource, BundleTaxonomy} from '../../../../model/CommissionBundle';
import {CIBundleFee} from '../../../../api/generated/portal/CIBundleFee';
import {formatCurrencyEur} from '../../../../utils/common-utils';
import {CIBundleResource, CiBundleStatusEnum,} from '../../../../api/generated/portal/CIBundleResource';
import {getSpecificBuiltInData} from '../../../../services/bundleService';

const componentPath = 'commissionBundlesPage.commissionBundleDetail';

const TaxonomyBox = ({taxonomy}: { taxonomy: BundleTaxonomy }) => {
    const {t} = useTranslation();
    return (
        <>
            <Typography variant="body1" color="action.active">
                {taxonomy.serviceType}
            </Typography>
            <Typography variant="body1" fontWeight={'fontWeightMedium'}>
                {getSpecificBuiltInData(t, taxonomy.specificBuiltInData)}
            </Typography>
            {(taxonomy as CIBundleFee).paymentAmount !== undefined && (
                <Box display="flex" justifyContent={'space-between'} mt={0.5} data-testid="ci-bundle-fee">
                    <Typography variant="body2" fontWeight={'fontWeightLight'}>
                        {t(`${componentPath}.commissions`)}:
                    </Typography>
                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                        {formatCurrencyEur((taxonomy as CIBundleFee).paymentAmount)}
                    </Typography>
                </Box>
            )}
        </>
    );
};

export default function CommissionBundleDetailTaxonomies({
                                                             bundleDetail,
                                                         }: Readonly<{
    bundleDetail: BundleResource;
}>) {
    const {t} = useTranslation();
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);

    const bundleTaxonomies = bundleDetail?.bundleTaxonomies ?? [];

    return (
        <Paper
            elevation={3}
            sx={{
                borderRadius: 2,
                padding: 3,
                minHeight:
                    (bundleDetail as CIBundleResource)?.ciBundleStatus !== undefined &&
                    (bundleDetail as CIBundleResource)?.ciBundleStatus !== CiBundleStatusEnum.AVAILABLE
                        ? '370px'
                        : '310px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Typography variant="overline">{t(`${componentPath}.taxonomies`)}</Typography>

            {bundleTaxonomies.length > 0 ? (
                bundleTaxonomies?.slice(0, 3)?.map((el: BundleTaxonomy, i: number) =>
                    i < 4 ? (
                        <Box key={`taxonomy-${el.specificBuiltInData ?? "all"}`} mt={1} data-testid="taxonomy-column">
                            <TaxonomyBox taxonomy={el}/>
                        </Box>
                    ) : null
                )
            ) : (
                <Alert severity="info" data-testid="alert-test" sx={{mt: 2}}>
                    {t('commissionBundlesPage.commissionBundleDetail.noTaxonomiesAlert')}
                </Alert>
            )}
            {bundleTaxonomies.length > 3 && (
                <>
                    <ButtonNaked
                        size="large"
                        component="button"
                        onClick={() => setOpenDrawer(true)}
                        sx={{color: 'primary.main', mt: 'auto', justifyContent: 'start'}}
                        weight="default"
                        data-testid="show-more-bundle-taxonomies-test"
                    >
                        + {t('general.showMore')}
                    </ButtonNaked>
                    <PaddedDrawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer}>
                        <TitleBox title={t(`${componentPath}.taxonomies`)} variantTitle="h5"/>
                        {bundleTaxonomies.map((el: BundleTaxonomy, index: number) => (
                            <React.Fragment key={`taxonomies-list-${el.specificBuiltInData}`}>
                                {index !== 0 && <Divider/>}
                                <Box mb={1.5} mt={index !== 0 ? 1 : 0} data-testid="taxonomy-drawer-column">
                                    <TaxonomyBox taxonomy={el}/>
                                </Box>
                            </React.Fragment>
                        ))}
                    </PaddedDrawer>
                </>
            )}
        </Paper>
    );
}
