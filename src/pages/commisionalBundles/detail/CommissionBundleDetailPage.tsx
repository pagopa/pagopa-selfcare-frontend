/* eslint-disable complexity */
import { ArrowBack, ManageAccounts } from '@mui/icons-material';
import {
  Grid,
  Typography,
  Paper,
  Divider,
  Stack,
  Breadcrumbs,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/system';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { Link, generatePath, useHistory, useParams } from 'react-router-dom';
import { useTranslation, TFunction } from 'react-i18next';
import { useEffect, useState } from 'react';
import ROUTES from '../../../routes';
import { isOperator } from '../../components/commonFunctions';
import { getCommissionBundleDetails } from '../../../services/__mocks__/bundleService';
import { useAppSelector } from '../../../redux/hooks';
import { LOADING_TASK_COMMISSION_BUNDLE_DETAIL } from '../../../utils/constants';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { FormAction } from '../../../model/CommissionBundle';
import { Bundle, TypeEnum } from '../../../api/generated/portal/Bundle';

function getDynamicSection(bundleDetail: Bundle, t: TFunction<'translation'>) {
  const packageType: TypeEnum | undefined = bundleDetail.type;
  if (packageType === TypeEnum.PRIVATE || packageType === TypeEnum.PUBLIC) {
    const isPrivate = packageType === TypeEnum.PRIVATE;
    return (
      <>
        <Grid item xs={6} alignItems={'center'}>
          <Typography variant="sidenav">
            {' '}
            {t(
              `commissionBundlesPage.commissionBundleDetail.${
                isPrivate ? 'recipients' : 'subscriptions'
              }`
            )}
          </Typography>
        </Grid>
        <Grid
          item
          textAlign={'right'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'flex-end'}
          xs={6}
        >
          <ButtonNaked
            component={Link}
            to={generatePath('')} // TODO Add dynamic path to manage reciptients/subscriptions
            color="primary"
            endIcon={<ManageAccounts />}
            size="medium"
          >
            {t(
              `commissionBundlesPage.commissionBundleDetail.${
                isPrivate ? 'manageRecipients' : 'menageSubscriptions'
              }`
            )}
          </ButtonNaked>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body2">
            {t('commissionBundlesPage.commissionBundleDetail.activeEntities')}
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2" fontWeight={'fontWeightMedium'}>
            TODO {/* TODO retrieve number of active entities */}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body2">
            {t('commissionBundlesPage.commissionBundleDetail.waitingEntities')}
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2" fontWeight={'fontWeightMedium'}>
            TODO {/* TODO retrieve number of entities waiting */}
          </Typography>
        </Grid>
      </>
    );
  }

  return <></>;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const CommissionBundleDetailPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const setLoading = useLoading(LOADING_TASK_COMMISSION_BUNDLE_DETAIL);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const addError = useErrorDispatcher();
  const { bundleId } = useParams<{ bundleId: string }>();
  const operator = isOperator();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [commissionBundleDetail, setCommissionBundleDetail] = useState<Bundle>({} as any);

  const hidePassword = 'XXXXXXXXXXXXXX';
  const showOrHidePassword = (password?: string) => {
    if (showPassword) {
      return password;
    }
    return hidePassword;
  };

  const goBack = () => history.push(ROUTES.COMMISSION_BUNDLES);

  useEffect(() => {
    setLoading(true);
    // TODO verify if API for bundle detail is used
    getCommissionBundleDetails()
      .then((data) => {
        setCommissionBundleDetail(data);
      })
      .catch((reason) => {
        addError({
          id: 'GET_COMMISSION_BUNDLE_DETAILS',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while getting commission bundle details`,
          toNotify: true,
          displayableTitle: t('commissionBundlesPage.list.error.errorTitle'),
          displayableDescription: t(
            'commissionBundlesPage.list.error.commissionBundleDetailsErrorMessageDesc'
          ),
          component: 'Toast',
        });
      })
      .finally(() => setLoading(false));
  }, [selectedParty]);

  return (
    <Grid container justifyContent={'center'}>
      <Grid item p={3} xs={8}>
        <Stack direction="row">
          <ButtonNaked
            size="small"
            component="button"
            onClick={goBack}
            startIcon={<ArrowBack />}
            sx={{ color: 'primary.main', mr: '20px' }}
            weight="default"
          >
            {t('general.exit')}
          </ButtonNaked>
          <Breadcrumbs>
            <Typography>{t('general.Bundles')}</Typography>
            <Typography color={'text.disaled'}>{commissionBundleDetail.name}</Typography>
          </Breadcrumbs>
        </Stack>
        <Grid container mt={3}>
          <Grid item xs={6}>
            <TitleBox
              title={commissionBundleDetail.name ?? ''}
              mbTitle={2}
              variantTitle="h4"
              variantSubTitle="body1"
            />
            <Typography mb={5} color="text.secondary">
              {t('commissionBundlesPage.commissionBundleDetail.createdOn')}{' '}
              <Typography component={'span'} color="text.secondary">
                {commissionBundleDetail?.insertedDate?.toLocaleDateString('en-GB')}
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Stack spacing={2} direction="row" flexWrap={'wrap'} justifyContent={'flex-end'}>
              <Button color="error" variant="outlined" onClick={() => '' /* TODO DELETE BUTTON */}>
                {t('general.delete')}
              </Button>
              <Button
                component={Link}
                to={generatePath(ROUTES.COMMISSION_BUNDLES_EDIT, {
                  bundleId,
                  actionId: FormAction.Edit,
                })}
                variant="contained"
              >
                {t('general.modify')}
              </Button>
            </Stack>
          </Grid>
        </Grid>
        {/* TODO Add alert for packageType === Private if taxonomies not longer valid */}
        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            p: 4,
          }}
        >
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="bundle-config-content"
              id="bundle-config-header"
            >
              <Typography variant="h6">
                {t('commissionBundlesPage.addEditCommissionBundle.form.bundleConfiguration')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Divider sx={{ mt: 1 }}></Divider>
              <Box mt={5}>
                <Grid container spacing={2} alignContent="center" pb={4}>
                  <Grid item xs={12}>
                    <Typography variant="sidenav">
                      {t('commissionBundlesPage.addEditCommissionBundle.form.bundleStructure')}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2">
                      {t('commissionBundlesPage.addEditCommissionBundle.form.paymentType')}
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                      {commissionBundleDetail.paymentType}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2">
                      {t('commissionBundlesPage.addEditCommissionBundle.form.touchpoint')}
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                      {commissionBundleDetail.touchpoint}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} mt={2}>
                    <Typography variant="sidenav">
                      {t('commissionBundlesPage.addEditCommissionBundle.form.amountRange')}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2">
                      {t('commissionBundlesPage.addEditCommissionBundle.form.minImport')}
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                      {commissionBundleDetail.minPaymentAmount}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2">
                      {t('commissionBundlesPage.addEditCommissionBundle.form.maxImport')}
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                      {commissionBundleDetail.maxPaymentAmount}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} mt={2}>
                    <Typography variant="sidenav">
                      {t('commissionBundlesPage.addEditCommissionBundle.form.commission')}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2">
                      {t('commissionBundlesPage.commissionBundleDetail.appliedImport')}
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                      {commissionBundleDetail.paymentAmount}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} mt={2}>
                    <Typography variant="sidenav">
                      {t('commissionBundlesPage.commissionBundleDetail.connectionData')}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2">
                      {t('commissionBundlesPage.addEditCommissionBundle.form.brokerCode')}
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                      {commissionBundleDetail.idPsp}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2">
                      {t('commissionBundlesPage.addEditCommissionBundle.form.channelCode')}
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                      TODO {/* TODO Retrieve channelCode */}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} mt={2}>
                    <Typography variant="sidenav">
                      {t('commissionBundlesPage.addEditCommissionBundle.form.digitalStamp')}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2">
                      {t(
                        'commissionBundlesPage.addEditCommissionBundle.form.paymentWithDigitalStamp'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                      TODO {/* TODO Retrieve digitalStamp */}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2">
                      {t(
                        'commissionBundlesPage.addEditCommissionBundle.form.paymentOnlyDigitalStamp'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                      TODO {/* TODO Retrieve digitalStampRestriction */}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} mt={2}>
                    <Typography variant="sidenav">
                      {t('commissionBundlesPage.addEditCommissionBundle.form.validityPeriod')}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2">
                      {t('commissionBundlesPage.addEditCommissionBundle.form.from')}
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                      {commissionBundleDetail.validityDateFrom?.toLocaleDateString('en-GB')}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2">
                      {t('commissionBundlesPage.addEditCommissionBundle.form.to')}
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                      {commissionBundleDetail.validityDateTo?.toLocaleDateString('en-GB')}
                    </Typography>
                  </Grid>

                  {getDynamicSection(commissionBundleDetail, t)}

                  <Grid item xs={12} mt={2}>
                    <Typography variant="sidenav">
                      {t('commissionBundlesPage.commissionBundleDetail.changes')}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2">
                      {t('commissionBundlesPage.commissionBundleDetail.lastChange')}
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                      {commissionBundleDetail.lastUpdatedDate?.toLocaleDateString('en-GB')}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2">
                      {t('commissionBundlesPage.commissionBundleDetail.operatedBy')}
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                      TODO {/* TODO retrieve change operator */}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Paper>
        <Paper
          elevation={8}
          sx={{
            mt: 2,
            borderRadius: 4,
            p: 4,
          }}
        >
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="taxonomies-service-content"
              id="taxonomies-service-header"
            >
              <Typography variant="h6">
                {t('commissionBundlesPage.commissionBundleDetail.taxonomiesService')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Divider sx={{ mt: 1 }}></Divider>
              <Box mt={5}>
                <Grid container spacing={2} alignContent="center" pb={4}>
                  <Grid item xs={12} mt={2}>
                    <Typography variant="sidenav">
                      TODO GENERAL GROUP{' '}
                      {/* TODO Retrieve Taxonomies and loop them grouped by general type */}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2">TODO SINGLE ITEM TYPE</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                      TODO SINGLE ITEM VALUE
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CommissionBundleDetailPage;
