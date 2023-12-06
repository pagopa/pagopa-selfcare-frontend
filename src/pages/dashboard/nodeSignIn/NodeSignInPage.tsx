import { ArrowBack } from '@mui/icons-material';
import { Breadcrumbs, Grid, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import ROUTES from '../../../routes';
import { BrokerOrPspDetailsResource } from '../../../api/generated/portal/BrokerOrPspDetailsResource';
import { PTResource } from '../../../model/Node';
import NodeSignInPSPForm from './NodeSignInPSPForm';
import NodeSignInECForm from './NodeSignInECForm';
import NodeSignInPTForm from './NodeSignInPTForm';

const NodeSignInPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const goBack = () => history.push(ROUTES.HOME);
  const actor = useAppSelector(contextSelectors.selectDetails);

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
            <Typography>{t('general.dashboard')}</Typography>
            <Typography color={'text.disaled'}>{t(`nodeSignInPage.breadcrumb`)}</Typography>
          </Breadcrumbs>
        </Stack>
        <TitleBox
          title={t(`nodeSignInPage.title`)}
          subTitle={
            selectedParty?.institutionType === 'PSP'
              ? t(`nodeSignInPage.subtitlePSP`)
              : t(`nodeSignInPage.subtitleEC`)
          }
          mbTitle={2}
          mtTitle={4}
          mbSubTitle={3}
          variantTitle="h4"
          variantSubTitle="body1"
        />
        {selectedParty?.institutionType === 'PSP' ? (
          <NodeSignInPSPForm
            goBack={goBack}
            signInData={signInData as BrokerOrPspDetailsResource}
          />
        ) : !selectedParty?.pspData && selectedParty?.institutionType === 'PT' ? (
          <NodeSignInPTForm goBack={goBack} signInData={actor} />
        ) : (
          <NodeSignInECForm goBack={goBack} signInData={actor} />
        )}
      </Grid>
    </Grid>
  );
};

export default NodeSignInPage;
