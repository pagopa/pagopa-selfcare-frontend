import { useState } from 'react';
import Papa from 'papaparse';
import { useTranslation } from 'react-i18next';
import { Box, Button, Grid, Paper, Stack } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { Add, ArrowBack } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { CreditorInstitutionInfo } from '../../../../../api/generated/portal/CreditorInstitutionInfo';
import ECSelection from '../../../../../components/Form/ECSelection';
import GenericModal from '../../../../../components/Form/GenericModal';
import { BundleResource } from '../../../../../model/CommissionBundle';
import { useAppSelectorWithRedirect } from '../../../../../redux/hooks';
import { bundleDetailsSelectors } from '../../../../../redux/slices/bundleDetailsSlice';
import ROUTES from '../../../../../routes';
import { CreditorInstitutionInfoResource } from '../../../../../api/generated/portal/CreditorInstitutionInfoResource';

type CreditorInstitutionInfoWithFromFile = CreditorInstitutionInfo & { fromFile?: boolean };

const componentPath = 'commissionBundlesPage.commissionBundleDetail.addRecipientsPage';
// eslint-disable-next-line sonarjs/cognitive-complexity
export default function CommissionBundleOffersAddRecipientsPage() {
  const history = useHistory();
  const { t } = useTranslation();

  const commissionBundleDetail: BundleResource = useAppSelectorWithRedirect(
    bundleDetailsSelectors.selectBundleDetails,
    ROUTES.COMMISSION_BUNDLES
  );

  const [availableEc, setAvailableEc] = useState<CreditorInstitutionInfoResource>({
    creditor_institution_info_list: [
      { ci_tax_code: 'ci_tax_code', business_name: 'business_name' },
      { ci_tax_code: 'ci_tax_code2', business_name: 'business_name2' },
      { ci_tax_code: 'ci_tax_code3', business_name: 'business_name3' },
      { ci_tax_code: 'ci_tax_code4', business_name: 'business_name4' },
      { ci_tax_code: 'ci_tax_code5', business_name: 'business_name5' },
      { ci_tax_code: 'ci_tax_code6', business_name: 'business_name6' },
      { ci_tax_code: 'ci_tax_code7', business_name: 'business_name7' },
      { ci_tax_code: 'ci_tax_code8', business_name: 'business_name8' },
    ],
  }); // TODO retrieve list
  const [file, setFile] = useState<File | null>(null);
  const [alertData, setAlertData] = useState<any>();
  const [selectedRecipients, setSelectedRecipients] = useState<
    Array<CreditorInstitutionInfoWithFromFile>
  >([]);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showAddRecipientInput, setShowAddRecipientInput] = useState<boolean>(true);

  function onRecipientSelection(
    ci: CreditorInstitutionInfoWithFromFile | undefined,
    index: number
  ) {
    if (ci) {
      addRecipientToSelected(ci);
    } else {
      removeRecipientFromSelected(index);
    }
  }

  function addRecipientToSelected(ci: CreditorInstitutionInfoWithFromFile) {
    setSelectedRecipients((prev) => [...prev, ci]);
    setShowAddRecipientInput(false);
    setAvailableEc((prev) => {
      const newArr = prev.creditor_institution_info_list
        ? [...prev.creditor_institution_info_list]
        : [];
      // eslint-disable-next-line functional/immutable-data
      newArr.splice(
        newArr.findIndex((el) => el.ci_tax_code === ci.ci_tax_code),
        1
      );

      return newArr;
    });
  }

  function removeRecipientFromSelected(index: number) {
    setAvailableEc((prev) =>
      prev.creditor_institution_info_list
        ? [...prev.creditor_institution_info_list, selectedRecipients[index]]
        : []
    );
    setSelectedRecipients((prev) => {
      const newArr = [...prev];
      // eslint-disable-next-line functional/immutable-data
      newArr.splice(index, 1);

      /* TODO file dropzone if (!newArr.find((el) => el.fromFile)) {
        handleRemoveFile();
      } else */ if (selectedRecipients[index]?.fromFile) {
        setAlertData((prev: any) => ({
          ...prev,
          message: t(`${componentPath}.alert.successMessage`, {
            count: newArr.filter((el) => el.fromFile).length,
          }),
        }));
      }

      if (newArr.length === 0) {
        setShowAddRecipientInput(true);
      }
      return newArr;
    });
  }
  /* TODO file dropzone
  const handleSelectFile = (file: File) => {
    setFile(file);
    const reader = new FileReader();
    // eslint-disable-next-line
    reader.onload = async ({ target }: any) => {
      const csv = Papa.parse(target.result, {
        header: true,
        skipEmptyLines: true,
      });
      // eslint-disable-next-line functional/no-let
      let errorParsing = 0;
      const parsedData = csv?.data
        ?.filter((el: any) => {
          if (el.ci_tax_code && availableEc.find((ci) => ci.ci_tax_code === el.ci_tax_code)) {
            return true;
          } else {
            errorParsing += 1;
            return false;
          }
        })
        ?.map((item: any) => ({ ...item, fromFile: true }));
      if (parsedData && parsedData.length > 0) {
        const enrichArr = parsedData.map((el) => ({ ...el, fromFile: true }));
        enrichArr.forEach((el) => addRecipientToSelected(el));
      }

      if (csv?.errors?.length === csv?.data?.length || errorParsing === csv?.data?.length) {
        setAlertData({
          type: 'error',
          message: t(`${componentPath}.alert.errorMessage`),
        });
      } else if (csv?.errors.length > 0 || errorParsing) {
        setAlertData({
          type: 'warning',
          message: t(`${componentPath}.alert.warningMessage`, {
            count: csv?.errors.length + errorParsing,
            total: csv?.errors.length + csv?.data.length,
          }),
        });
      } else {
        setAlertData({
          type: 'success',
          message: t(`${componentPath}.alert.successMessage`, { count: csv?.data.length }),
        });
      }
    };
    reader.readAsText(file);
  };
  const handleRemoveFile = () => {
    setFile(null);
    setSelectedRecipients((prev) => prev.filter((el) => !el.fromFile));
    setAlertData(undefined);
  }; */

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
                  availableEC={
                    availableEc.creditor_institution_info_list
                      ? [...availableEc.creditor_institution_info_list]
                      : []
                  }
                  selectedEC={el}
                  onECSelectionChange={(ci) => onRecipientSelection(ci, index)}
                />
              </Box>
            ))}
            {showAddRecipientInput && (
              <ECSelection
                availableEC={
                  availableEc.creditor_institution_info_list
                    ? [...availableEc.creditor_institution_info_list]
                    : []
                }
                selectedEC={selectedRecipients[selectedRecipients.length]}
                onECSelectionChange={(ci) => onRecipientSelection(ci, selectedRecipients.length)}
              />
            )}
          </Box>
          {/* TODO Commented while waiting for the API to check csv creditor institutions validity
          <Box mt={2}>
            {alertData && (
              <Alert
                severity={alertData.type}
                data-testid={`alert-${alertData.type}`}
                onClose={() => {
                  setAlertData(undefined);
                }}
                sx={{ mt: 1 }}
              >
                <AlertTitle>{t(`${componentPath}.alert.${alertData.type}Title`)}</AlertTitle>
                {alertData.message}
              </Alert>
            )}
            <SingleFileInput
              value={file}
              accept={['.csv']}
              onFileSelected={handleSelectFile}
              onFileRemoved={handleRemoveFile}
              dropzoneLabel={t(`${componentPath}.paper.dropFileText`)}
              rejectedLabel={t('general.rejectedFile')}
            />

            {(file === undefined || file === null) && (
              <Typography variant="body1" mb={1} mt={1}>
                {t(`${componentPath}.paper.dontKnowHow`)}
                <a
                  href={process.env.PUBLIC_URL + '/file/recipientsExample.csv'}
                  download="recipientsExample.csv"
                >
                  {t(`${componentPath}.paper.downloadExample`)}
                </a>
              </Typography>
            )}
          </Box> */}

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
