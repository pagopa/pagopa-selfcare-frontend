import { ArrowBack } from '@mui/icons-material';
import { Breadcrumbs, Grid, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ChangeEvent, useState } from 'react';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import ROUTES from '../../../routes';
import { BrokerAndEcDetailsResource } from '../../../api/generated/portal/BrokerAndEcDetailsResource';
import { BrokerOrPspDetailsResource } from '../../../api/generated/portal/BrokerOrPspDetailsResource';
import { PTResource } from '../../../model/Node';
import ConfirmModal from '../../components/ConfirmModal';
import NodeSignInPSPForm from './NodeSignInPSPForm';
import NodeSignInECForm from './NodeSignInECForm';
import NodeSignInPTForm from './NodeSignInPTForm';


const NodeSignInPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const goBack = () => history.push(ROUTES.HOME);
  const signInData = useAppSelector(partiesSelectors.selectSigninData);
  const [intermediaryAvailableValue, setIntermediaryAvailableValue] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleChangeIntermediaryAvailable = (event: ChangeEvent<HTMLInputElement> | undefined) => {
    if (event?.target.value === "true") {
      setShowConfirmModal(true);
    } else {
      setIntermediaryAvailableValue(!intermediaryAvailableValue);
    }
  };

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
            handleChangeIntermediaryAvailable={handleChangeIntermediaryAvailable}
            intermediaryAvailableValue={intermediaryAvailableValue}
            setIntermediaryAvailableValue={setIntermediaryAvailableValue}
          />
        ) : !selectedParty?.pspData && selectedParty?.institutionType === 'PT' ? (
          <NodeSignInPTForm goBack={goBack} signInData={signInData as PTResource} />
        ) : (
          <NodeSignInECForm 
            goBack={goBack} 
            signInData={signInData as BrokerAndEcDetailsResource} 
            handleChangeIntermediaryAvailable={handleChangeIntermediaryAvailable} 
            intermediaryAvailableValue={intermediaryAvailableValue} 
            setIntermediaryAvailableValue={setIntermediaryAvailableValue} />
        )}
      </Grid>
      <ConfirmModal
        title={t('nodeSignInPage.confirmIntermediaryModal.title')}
        message={ t(`nodeSignInPage.confirmIntermediaryModal.${selectedParty?.institutionType === 'PSP' ? "messagePSP" : "messageEC"}`)}
        openConfirmModal={showConfirmModal}
        onConfirmLabel={t('nodeSignInPage.confirmIntermediaryModal.confirmLabel')}
        onCloseLabel={t('nodeSignInPage.confirmIntermediaryModal.closeLabel')}
        handleCloseConfirmModal={() => setShowConfirmModal(false)}
        handleConfrimSubmit={async () => {
          setIntermediaryAvailableValue(!intermediaryAvailableValue);          
          setShowConfirmModal(false);
        }}
      />
    </Grid>
  );
};

export default NodeSignInPage;
