import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Grid, Paper, Stack } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { Add, ArrowBack } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import ECSelection from '../../../components/Form/ECSelection';
import GenericModal from '../../../components/Form/GenericModal';
import { BundleResource } from '../../../model/CommissionBundle';
import { useAppSelectorWithRedirect } from '../../../redux/hooks';
import { bundleDetailsSelectors } from '../../../redux/slices/bundleDetailsSlice';
import ROUTES from '../../../routes';
import { getCreditorInstitutions } from '../../../services/creditorInstitutionService';
import { CreditorInstitutionsResource } from '../../../api/generated/portal/CreditorInstitutionsResource';
import { CreditorInstitutionResource } from '../../../api/generated/portal/CreditorInstitutionResource';
import { LOADING_TASK_ADD_RECIPIENTS } from '../../../utils/constants';
import { createCIBundleOffers } from '../../../services/bundleService';

type CreditorInstitutionWithFromFile = CreditorInstitutionResource & { fromFile?: boolean };

const availableEcEmptyState: CreditorInstitutionsResource = {
  creditor_institutions: [],
  page_info: {
    items_found: 0,
    limit: 0,
    page: 0,
    total_pages: 0,
  },
};

const componentPath = 'commissionBundlesPage.commissionBundleDetail.addRecipientsPage';
// eslint-disable-next-line sonarjs/cognitive-complexity
export default function CommissionBundleDetailOffersAddRecipientsPage() {
  const history = useHistory();
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const setLoadingAddRecipients = useLoading(LOADING_TASK_ADD_RECIPIENTS);

  const commissionBundleDetail: BundleResource = useAppSelectorWithRedirect(
    bundleDetailsSelectors.selectBundleDetails,
    ROUTES.COMMISSION_BUNDLES
  );

  const [availableEc, setAvailableEc] =
    useState<CreditorInstitutionsResource>(availableEcEmptyState);
  // const [file, setFile] = useState<File | null>(null);
  // const [alertData, setAlertData] = useState<any>();
  const [searchInput, setSearchInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [loadingCiList, setLoadingCiList] = useState<boolean>(false);
  const [selectedRecipients, setSelectedRecipients] = useState<
    Array<CreditorInstitutionWithFromFile>
  >([]);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showAddRecipientInput, setShowAddRecipientInput] = useState<boolean>(true);

  function onRecipientSelection(ci: CreditorInstitutionWithFromFile | undefined, index: number) {
    if (ci) {
      addRecipientToSelected(ci);
    } else {
      removeRecipientFromSelected(index);
    }
  }

  function addRecipientToSelected(ci: CreditorInstitutionWithFromFile) {
    if (selectedRecipients.find((el) => el.creditorInstitutionCode === ci.creditorInstitutionCode)) {
      setErrorMessage(t(`${componentPath}.errorAutocomplete`));
    } else {
      setErrorMessage(undefined);
      setSearchInput('');
      setSelectedRecipients((prev) => [...prev, ci]);
      setShowAddRecipientInput(false);
    }
  }

  function removeRecipientFromSelected(index: number) {
    setSelectedRecipients((prev) => {
      const newArr = [...prev];
      // eslint-disable-next-line functional/immutable-data
      newArr.splice(index, 1);

      /* TODO file dropzone if (!newArr.find((el) => el.fromFile)) {
        handleRemoveFile();
      } else  if (selectedRecipients[index]?.fromFile) {
        setAlertData((prev: any) => ({
          ...prev,
          message: t(`${componentPath}.alert.successMessage`, {
            count: newArr.filter((el) => el.fromFile).length,
          }),
        }));
      } */

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
    setLoadingAddRecipients(true);
    createCIBundleOffers({
      idBundle: commissionBundleDetail.idBundle ?? '',
      bundleName: commissionBundleDetail.name ?? '',
      pspTaxCode: commissionBundleDetail.idBrokerPsp ?? '',
      ciTaxCodeList: selectedRecipients.map((el) => el.creditorInstitutionCode),
    })
      .then(() => history.push(ROUTES.COMMISSION_BUNDLES_DETAIL))
      .catch((reason: Error) =>
        addError({
          id: 'ADD_RECIPIENTS',
          blocking: false,
          error: reason,
          techDescription: `An error occurred while sending the offers to the recipients`,
          toNotify: true,
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t(`${componentPath}.errorMessageSendOffer`),
          component: 'Toast',
        })
      )
      .finally(() => setLoadingAddRecipients(false));
  }

  useEffect(() => {
    setLoadingCiList(true);
    setAvailableEc(availableEcEmptyState);

    const timeout = setTimeout(() => {
      getCreditorInstitutions({
        ciName: searchInput,
        page: 0,
        limit: 5,
      })
        .then((data) => setAvailableEc(data))
        .catch((reason: Error) =>
          addError({
            id: 'CI_INSTITUTIONS_LIST',
            blocking: false,
            error: reason,
            techDescription: `An error occurred while retrieving the creditor insitutitions' list`,
            toNotify: true,
            displayableTitle: t('general.errorTitle'),
            displayableDescription: t(`${componentPath}.errorMessageRetrieveList`),
            component: 'Toast',
          })
        )
        .finally(() => setLoadingCiList(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

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
            {selectedRecipients.map((el: CreditorInstitutionResource, index) => (
              <Box key={String(el.creditorInstitutionCode) + String(index)} pb={2} data-testid="selected-recipients">
                <ECSelection
                  availableEC={
                    availableEc.creditor_institutions ? [...availableEc.creditor_institutions] : []
                  }
                  selectedEC={el}
                  onECSelectionChange={(ci) =>
                    onRecipientSelection(ci as CreditorInstitutionWithFromFile, index)
                  }
                  onChangeInput={(event) => setSearchInput(event?.target?.value ?? '')}
                  loading={loadingCiList}
                  serverSide={true}
                  errorMessage={errorMessage}
                />
              </Box>
            ))}
            {showAddRecipientInput && (
              <ECSelection
                availableEC={
                  availableEc.creditor_institutions ? [...availableEc.creditor_institutions] : []
                }
                selectedEC={selectedRecipients[selectedRecipients.length]}
                onECSelectionChange={(ci) =>
                  onRecipientSelection(
                    ci as CreditorInstitutionWithFromFile,
                    selectedRecipients.length
                  )
                }
                onChangeInput={(event) => setSearchInput(event?.target?.value ?? '')}
                loading={loadingCiList}
                serverSide={true}
                errorMessage={errorMessage}
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
              data-testid="add-recipients-button"
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
