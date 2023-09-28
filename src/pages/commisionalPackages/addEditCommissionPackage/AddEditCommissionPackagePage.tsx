import { ArrowBack } from '@mui/icons-material';
import { Grid, Stack, Breadcrumbs, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ROUTES from '../../../routes';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { CommissionPackageOnCreation, FormAction } from '../../../model/CommissionPackage';
import { getCommissionPackageDetails } from '../../../services/__mocks__/commissionPackageService';
import { LOADING_TASK_COMMISSION_PACKAGE_DETAIL } from '../../../utils/constants';
import AddEditCommissionPackageForm from './components/AddEditCommissionPackageForm';

const commissionPackageDetailsEmpty: CommissionPackageOnCreation = {
  abi: '',
  description: '',
  digitalStamp: false,
  digitalStampRestriction: false,
  idBrokerPsp: '',
  idCdi: '',
  idChannel: '',
  maxPaymentAmount: 0,
  minPaymentAmount: 0,
  name: '',
  paymentAmount: 0,
  paymentType: undefined,
  touchpoint: undefined,
  transferCategoryList: [''],
  type: undefined,
  validityDateFrom: new Date(),
  validityDateTo: new Date(),
};

const AddEditCommissionPackagePage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoading = useLoading(LOADING_TASK_COMMISSION_PACKAGE_DETAIL);
  const { nameId, actionId } = useParams<{ nameId: string; actionId: string }>();
  const formAction = actionId ?? FormAction.Create;
  const goBack = () => history.push(ROUTES.COMMISSION_PACKAGES);
  const [commissionPackageDetails, setCommissionPackageDetails] =
    useState<CommissionPackageOnCreation>(commissionPackageDetailsEmpty);

  const getDetails = async () => {
    setLoading(true);
    try {
      await getCommissionPackageDetails(nameId);
    } catch (reason) {
      addError({
        id: 'GET_COMMISSION_PACKAGE_DETAILS',
        blocking: false,
        error: reason as Error,
        techDescription: `An error occurred while getting commission package details`,
        toNotify: true,
        displayableTitle: t('commissionPackagesPage.addEditCommissionPackage.error.errorTitle'),
        displayableDescription: t(
          'commissionPackagesPage.addEditCommissionPackage.error.commissionPackageDetailsErrorMessageDesc'
        ),
        component: 'Toast',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formAction !== FormAction.Create) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getDetails();
    }
  }, []);

  return (
    <Grid container justifyContent={'center'}>
      <Grid item p={3} xs={8}>
        <Stack direction="row">
          <ButtonNaked
            size="small"
            component="button"
            onClick={() => goBack()}
            startIcon={<ArrowBack data-testid="arrow-back-test" />}
            sx={{ color: 'primary.main', mr: '20px' }}
            weight="default"
          >
            {t('general.exit')}
          </ButtonNaked>
          <Breadcrumbs>
            <Typography variant="body2">
              {t('commissionPackagesPage.addEditCommissionPackage.breadcrumb.first')}
            </Typography>
            <Typography variant="body2" fontWeight={'medium'}>
              {t('commissionPackagesPage.addEditCommissionPackage.breadcrumb.second')}
            </Typography>
          </Breadcrumbs>
        </Stack>
        <TitleBox
          title={t('commissionPackagesPage.addEditCommissionPackage.title')}
          subTitle={t('commissionPackagesPage.addEditCommissionPackage.subtitle')}
          mbTitle={2}
          mtTitle={4}
          mbSubTitle={3}
          variantTitle="h4"
          variantSubTitle="body1"
        />

        <AddEditCommissionPackageForm
          commissionPackageDetails={commissionPackageDetails}
          formAction={formAction}
        />
      </Grid>
    </Grid>
  );
};

export default AddEditCommissionPackagePage;
