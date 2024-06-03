import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { Add, ArrowBack } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { BundleResource } from '../../../../../../model/CommissionBundle';
import { useAppSelectorWithRedirect } from '../../../../../../redux/hooks';
import { bundleDetailsSelectors } from '../../../../../../redux/slices/bundleDetailsSlice';
import GenericModal from '../../../../../../components/Form/GenericModal';
import ROUTES from '../../../../../../routes';
import ECSelection from '../../../../../../components/Form/ECSelection';
import { CreditorInstitutionInfo } from '../../../../../../api/generated/portal/CreditorInstitutionInfo';
import { CreditorInstitutionInfoArray } from '../../../../../../api/generated/portal/CreditorInstitutionInfoArray';

const componentPath = 'commissionBundlesPage.commissionBundleDetail.addRecipientsPage';
export default function CommissionBundleOffersAddRecipientsPage() {
  const history = useHistory();
  const { t } = useTranslation();

  const commissionBundleDetail: BundleResource = useAppSelectorWithRedirect(
    bundleDetailsSelectors.selectBundleDetails,
    ROUTES.COMMISSION_BUNDLES
  );

  const [availableEc, setAvailableEc] = useState<CreditorInstitutionInfoArray>([
    { ci_tax_code: 'ci_tax_code', business_name: 'business_name' },
    { ci_tax_code: 'ci_tax_code2', business_name: 'business_name2' },
    { ci_tax_code: 'ci_tax_code3', business_name: 'business_name3' },
    { ci_tax_code: 'ci_tax_code4', business_name: 'business_name4' },
    { ci_tax_code: 'ci_tax_code5', business_name: 'business_name5' },
    { ci_tax_code: 'ci_tax_code6', business_name: 'business_name6' },
    { ci_tax_code: 'ci_tax_code7', business_name: 'business_name7' },
    { ci_tax_code: 'ci_tax_code8', business_name: 'business_name8' },
  ]); // TODO retrieve list
  const [selectedRecipients, setSelectedRecipients] = useState<CreditorInstitutionInfoArray>([]);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showAddRecipientInput, setShowAddRecipientInput] = useState<boolean>(true);

  function onRecipientSelection(ci: CreditorInstitutionInfo | undefined, index: number) {
    if (ci) {
      setSelectedRecipients((prev) => [...prev, ci]);
      setShowAddRecipientInput(false);
    } else {
      setSelectedRecipients((prev) => {
        const newArr = [...prev];
        // eslint-disable-next-line functional/immutable-data
        newArr.splice(index, 1);
        if(newArr.length === 0){
          setShowAddRecipientInput(true);
        }
        return newArr;
      });
    }
  }

  function handleAddRecipients() {
    // TODO
  }

  return (
    <Grid container justifyContent={'center'}>
      <Grid item p={3} xs={8}>
        <ButtonNaked
          size="small"
          component="button"
          onClick={() => history.push(ROUTES.COMMISSION_BUNDLES_DETAIL)}
          startIcon={<ArrowBack data-testid="arrow-back-test" />}
          sx={{ color: 'primary.main', mr: '20px' }}
          weight="default"
        >
          {t('general.exit')}
        </ButtonNaked>

        <TitleBox
          title={t(`${componentPath}.title`)}
          subTitle={t(`${componentPath}.subtitle`)}
          mbTitle={2}
          mtTitle={4}
          mbSubTitle={3}
          variantTitle="h4"
          variantSubTitle="body1"
        />
        <Paper elevation={3} sx={{ padding: 3 }}>
          <TitleBox
            title={t(`${componentPath}.paper.title`)}
            subTitle={t(`${componentPath}.paper.subtitle`)}
            mbTitle={2}
            mbSubTitle={3}
            variantTitle="h4"
            variantSubTitle="body1"
          />
          <Box width="50%">
            {selectedRecipients.map((el, index) => (
              <Box key={el.ci_tax_code + String(index)} pb={2}>
                <ECSelection
                  availableEC={availableEc}
                  selectedEC={el}
                  onECSelectionChange={(ci) => onRecipientSelection(ci, index)}
                />
              </Box>
            ))}
            {showAddRecipientInput && (
              <ECSelection
                availableEC={availableEc}
                selectedEC={selectedRecipients[selectedRecipients.length]}
                onECSelectionChange={(ci) => onRecipientSelection(ci, selectedRecipients.length)}
              />
            )}
          </Box>

          {selectedRecipients.length !== 0 && !showAddRecipientInput && (
            <ButtonNaked
              size="large"
              component="button"
              onClick={() => setShowAddRecipientInput(true)}
              endIcon={<Add />}
              sx={{ color: 'primary.main', mr: '20px', mt: 4 }}
              weight="default"
            >
              {t(`${componentPath}.paper.addRecipientButton`)}
            </ButtonNaked>
          )}
        </Paper>
        <Stack direction="row" justifyContent="space-between" mt={5}>
          <Stack display="flex" justifyContent="flex-start" mr={2}>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => history.goBack()}
              data-testid="back-step-button-test"
            >
              {t('general.back')}
            </Button>
          </Stack>
          <Stack display="flex" justifyContent="flex-end">
            <Button
              onClick={() => setShowConfirmModal(true)}
              color="primary"
              variant="contained"
              type="submit"
              data-testid="open-modal-button-test"
              disabled={selectedRecipients.length === 0}
            >
              {t('general.confirm')}
            </Button>
          </Stack>
        </Stack>
        <GenericModal
          title={t(`${componentPath}.modal.title`)}
          message={t(`${componentPath}.modal.message`)}
          openModal={showConfirmModal}
          onConfirmLabel={t(`${componentPath}.modal.confirmButton`)}
          onCloseLabel={t('general.turnBack')}
          handleCloseModal={() => setShowConfirmModal(false)}
          handleConfirm={() => handleAddRecipients()}
        />
      </Grid>
    </Grid>
  );
}
