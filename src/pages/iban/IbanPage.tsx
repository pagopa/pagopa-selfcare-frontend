import {
  Box,
  Grid,
  Alert,
  Card,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Chip,
} from '@mui/material';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useTranslation, Trans } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { handleErrors } from '@pagopa/selfcare-common-frontend/services/errorService';
import { ButtonNaked } from '@pagopa/mui-italia';
import EditIcon from '@mui/icons-material/Edit';
import { useFormik } from 'formik';
import SideMenu from '../../components/SideMenu/SideMenu';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import { IbansResource } from '../../api/generated/portal/IbansResource';
import { LOADING_TASK_IBAN_STAND_IN_AND_CUP, LOADING_TASK_IBAN_TABLE } from '../../utils/constants';
// import { getIbanList } from '../../services/ibanService';
import { IbanLabel } from '../../api/generated/portal/IbanLabel';
import {
  getCreditorInstitutionIbans,
  updateIbanCup,
  updateIbanStandIn,
} from '../../services/__mocks__/ibanService';
import { IbanOnCreation } from '../../model/Iban';
import IbanTable from './list/IbanTable';
import IbanUploadModal from './components/IbanUploadModal';

const emptyIbanList: IbansResource = {
  ibanList: [],
};

const emptyIban: IbanOnCreation = {
  iban: '',
  description: '',
  validityDate: new Date(),
  dueDate: new Date(),
  creditorInstitutionCode: '',
  labels: [],
};

const IbanPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const setLoadingOverlay = useLoading(LOADING_TASK_IBAN_TABLE);
  const setLoadingStatus = (status: boolean) => {
    setLoading(status);
    setLoadingOverlay(status);
  };
  const setLoadingIban = useLoading(LOADING_TASK_IBAN_STAND_IN_AND_CUP);
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const [ibanList, setIbanList] = useState<IbansResource>(emptyIbanList);
  const [selectedIbanCup, setSelectedIbanCup] = useState<IbanOnCreation>(emptyIban);
  const [selectedIbanStandIn, setSelectedIbanStandIn] = useState<IbanOnCreation>(emptyIban);
  const [ibanStandInTriggered, setIbanStandInTriggered] = useState(false);
  const [ibanCupTriggered, setIbanCupTriggered] = useState(false);
  const [showMaganeButton, setShowMaganeButton] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (selectedParty && selectedParty.fiscalCode) {
      setLoadingStatus(true);
      getCreditorInstitutionIbans(selectedParty.fiscalCode)
        .then((r) => (r ? setIbanList(r) : setIbanList(emptyIbanList)))
        .catch((reason) => {
          handleErrors([
            {
              id: `FETCH_STATIONS_ERROR`,
              blocking: false,
              error: reason,
              techDescription: `An error occurred while fetching stations`,
              toNotify: false,
            },
          ]);
          setError(true);
          addError({
            id: 'GET_IBAN_LIST',
            blocking: false,
            error: reason,
            techDescription: `An error occurred while retrieving iban list`,
            toNotify: true,
            displayableTitle: t('ibanPage.error.listErrorTitle'),
            displayableDescription: t('ibanPage.error.listErrorDesc'),
            component: 'Toast',
          });
          setIbanList(emptyIbanList);
        })
        .finally(() => setLoadingStatus(false));
    }
  }, [selectedParty]);

  useEffect(() => {
    if (ibanList.ibanList.length > 0) {
      filterListStandInAndCup();
    }
  }, [selectedParty, ibanList]);

  const filterListStandInAndCup = () => {
    const ibanStandInFiltered = ibanList.ibanList.find(
      (e) => e.labels && e.labels.find((label) => label.name === 'STANDIN')
    );
    const ibanCupFiltered = ibanList.ibanList.find(
      (e) => e.labels && e.labels.find((label) => label.name === 'CUP')
    );

    if (ibanStandInFiltered) {
      setSelectedIbanStandIn({
        iban: ibanStandInFiltered.iban,
        description: ibanStandInFiltered.description ?? '',
        validityDate: ibanStandInFiltered.validityDate,
        dueDate: ibanStandInFiltered.dueDate,
        creditorInstitutionCode: ibanStandInFiltered.ecOwner,
        labels: ibanStandInFiltered.labels ?? [],
      });
    } else {
      setSelectedIbanStandIn(emptyIban);
    }

    if (ibanCupFiltered) {
      setSelectedIbanCup({
        iban: ibanCupFiltered.iban,
        description: ibanCupFiltered.description ?? '',
        validityDate: ibanCupFiltered.validityDate,
        dueDate: ibanCupFiltered.dueDate,
        creditorInstitutionCode: ibanCupFiltered.ecOwner,
        labels: ibanCupFiltered.labels ?? [],
      });
    } else {
      setSelectedIbanCup(emptyIban);
    }
  };

  const initialFormDataStandIn = (ibanSelected: IbanOnCreation) =>
    ibanSelected.labels && ibanSelected.labels.length > 0
      ? {
          iban: ibanSelected.iban,
          description: ibanSelected.description,
          validityDate: ibanSelected.validityDate,
          dueDate: ibanSelected.dueDate,
          creditorInstitutionCode: ibanSelected.creditorInstitutionCode,
          labels: ibanSelected.labels,
        }
      : {
          iban: ibanSelected.iban,
          description: ibanSelected.description,
          validityDate: ibanSelected.validityDate,
          dueDate: ibanSelected.dueDate,
          creditorInstitutionCode: ibanSelected.creditorInstitutionCode,
          labels: [],
        };

  // eslint-disable-next-line sonarjs/no-identical-functions
  const initialFormDataCup = (ibanSelected: IbanOnCreation) =>
    ibanSelected.labels && ibanSelected.labels.length > 0
      ? {
          iban: ibanSelected.iban,
          description: ibanSelected.description,
          validityDate: ibanSelected.validityDate,
          dueDate: ibanSelected.dueDate,
          creditorInstitutionCode: ibanSelected.creditorInstitutionCode,
          labels: ibanSelected.labels,
        }
      : {
          iban: ibanSelected.iban,
          description: ibanSelected.description,
          validityDate: ibanSelected.validityDate,
          dueDate: ibanSelected.dueDate,
          creditorInstitutionCode: ibanSelected.creditorInstitutionCode,
          labels: [],
        };

  const handleIbanStandInSelected = (event: any) => {
    setIbanStandInTriggered(true);
    const newLabel: IbanLabel = {
      description: 'The IBAN to use for STANDIN process',
      name: 'STANDIN',
    };

    const selectedIndex = ibanList.ibanList.findIndex((e) => e.iban === event.target.value);
    const selectedIban = ibanList.ibanList[selectedIndex];
    const updatedLabels = [newLabel];

    setSelectedIbanStandIn({
      iban: selectedIban.iban,
      description: selectedIban.description ?? '',
      validityDate: selectedIban.validityDate,
      dueDate: selectedIban.dueDate,
      creditorInstitutionCode: selectedIban.ecOwner,
      labels: updatedLabels,
    });
  };

  const handleIbanCupSelected = (event: any) => {
    setIbanCupTriggered(true);
    const newLabel: IbanLabel = {
      description: 'The IBAN to use for CUP payments',
      name: 'CUP',
    };

    const selectedIndex = ibanList.ibanList.findIndex((e) => e.iban === event.target.value);
    const selectedIban = ibanList.ibanList[selectedIndex];
    const updatedLabels = [newLabel];

    setSelectedIbanCup({
      iban: selectedIban.iban,
      description: selectedIban.description ?? '',
      validityDate: selectedIban.validityDate,
      dueDate: selectedIban.dueDate,
      creditorInstitutionCode: selectedIban.ecOwner,
      labels: updatedLabels,
    });
  };

  const formikStandIn = useFormik<IbanOnCreation>({
    initialValues: initialFormDataStandIn(selectedIbanStandIn),
    onSubmit: async () => {
      setShowConfirmModal(true);
      console.log('SUBMIT!');
    },
    enableReinitialize: true,
    validateOnMount: true,
  });

  const formikCup = useFormik<IbanOnCreation>({
    initialValues: initialFormDataCup(selectedIbanCup),
    onSubmit: async () => {
      setShowConfirmModal(false);
      console.log('SUBMIT!');
    },
    enableReinitialize: true,
    validateOnMount: true,
  });

  const submit = async (iban1?: IbanOnCreation, iban2?: IbanOnCreation) => {
    setLoadingIban(true);
    try {
      if (ibanStandInTriggered && ibanCupTriggered && iban1 && iban2) {
        await updateIbanStandIn(iban1);
        await updateIbanCup(iban2);
        console.log('IBAN STAND IN', iban1);
        console.log('IBAN CUP', iban2);
      }

      if (ibanStandInTriggered && !ibanCupTriggered && iban1) {
        await updateIbanStandIn(iban1);
        console.log('IBAN STAND IN', iban1);
      }

      if (!ibanStandInTriggered && ibanCupTriggered && iban2) {
        await updateIbanCup(iban2);
        console.log('IBAN CUP', iban2);
      }
    } catch (reason) {
      addError({
        id: 'UPDATE IBAN STAND IN AND IBAN CUP',
        blocking: false,
        error: reason as Error,
        techDescription: `An error occurred while updating iban stand in and cup`,
        toNotify: true,
        displayableTitle: t('ibanPage.error.upladIbanErrorTitle'),
        displayableDescription: t('ibanPage.error.upladIbanErrorDesc'),
        component: 'Toast',
      });
    } finally {
      setLoadingIban(false);
    }
  };

  const handleSubmit = () => {
    if (ibanStandInTriggered && ibanCupTriggered) {
      formikStandIn.handleSubmit();
      formikCup.handleSubmit();
    }

    if (ibanStandInTriggered && !ibanCupTriggered) {
      formikStandIn.handleSubmit();
    }

    if (!ibanStandInTriggered && ibanCupTriggered) {
      formikCup.handleSubmit();
    }
  };

  return (
    <>
      <Grid container item xs={12} sx={{ backgroundColor: 'background.paper' }}>
        <Grid item xs={2}>
          <Box>
            <SideMenu />
          </Box>
        </Grid>
        <Grid
          item
          xs={10}
          sx={{ backgroundColor: '#F5F6F7' }}
          display="flex"
          justifyContent="center"
          pb={8}
        >
          <Box width="100%" px={2}>
            <TitleBox
              title={t('ibanPage.title')}
              subTitle={t('ibanPage.subtitle')}
              mbTitle={2}
              mtTitle={4}
              mbSubTitle={3}
              variantTitle="h4"
              variantSubTitle="body1"
            />
            {history.location.state && (history.location.state as any).alertSuccessMessage && (
              <Alert severity="success" variant="outlined" sx={{ mb: 4 }}>
                {(history.location.state as any).alertSuccessMessage}
              </Alert>
            )}

            <Grid container spacing={2} mb={4}>
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ border: 0, borderRadius: 0, p: 3, mb: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} textAlign={'end'}>
                      {!showMaganeButton ? (
                        <Chip
                          label={t('ibanPage.updateInProgress')}
                          aria-label="update-in-progress"
                          size="medium"
                          sx={{
                            color: '#17324D',
                            backgroundColor: 'grey.200',
                            fontSize: '14px',
                            paddingBottom: '1px',
                            height: '32px',
                          }}
                        ></Chip>
                      ) : (
                        <></>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="overline">{t('ibanPage.standIn')}</Typography>
                      <Typography variant="subtitle1" fontWeight="regular" fontSize={16} my={1}>
                        {t('ibanPage.standInDetail')}
                      </Typography>
                      <Box display="flex" alignItems="center" mt={2}>
                        <Typography
                          variant="body2"
                          fontWeight="regular"
                          component="span"
                          fontSize="inherit"
                          mr={4}
                        >
                          IBAN
                        </Typography>

                        {showMaganeButton ? (
                          <>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              component="span"
                              fontSize="inherit"
                              mr={4}
                            >
                              {selectedIbanStandIn.iban && selectedIbanStandIn.iban.length > 0
                                ? selectedIbanStandIn.iban
                                : '-'}
                            </Typography>
                          </>
                        ) : (
                          <Typography
                            component="span"
                            fontSize={'inherit'}
                            fontWeight="fontWeightMedium"
                            sx={{ width: '-webkit-fill-available' }}
                          >
                            <FormControl sx={{ width: '60%' }}>
                              <InputLabel size="small">{t('ibanPage.selectIban')}</InputLabel>
                              <Select
                                id="ibanStandIn"
                                name="ibanStandIn"
                                label={t('ibanPage.selectIban')}
                                size="small"
                                value={formikStandIn.values.iban}
                                onChange={(e) => {
                                  formikStandIn.handleChange(e);
                                  handleIbanStandInSelected(e);
                                }}
                                error={
                                  formikStandIn.touched.iban && Boolean(formikStandIn.errors.iban)
                                }
                                inputProps={{
                                  'data-testid': 'stand-in-test',
                                }}
                              >
                                {ibanList.ibanList.map((r, i) => (
                                  <MenuItem key={i} value={r.iban}>
                                    {r.iban}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="overline">{t('ibanPage.cup')}</Typography>
                      <Typography variant="subtitle1" fontWeight="regular" fontSize={16} mt={1}>
                        {t('ibanPage.cupDetail')}
                      </Typography>
                      <Box display="flex" alignItems="center" mt={2}>
                        <Typography
                          component="span"
                          mr={4}
                          fontSize={'inherit'}
                          variant="body2"
                          fontWeight="regular"
                        >
                          IBAN
                        </Typography>
                        {showMaganeButton ? (
                          <>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              component="span"
                              fontSize="inherit"
                              mr={4}
                            >
                              {selectedIbanCup.iban && selectedIbanCup.iban.length > 0
                                ? selectedIbanCup.iban
                                : '-'}
                            </Typography>
                          </>
                        ) : (
                          <Typography
                            component="span"
                            fontSize={'inherit'}
                            fontWeight="fontWeightMedium"
                            sx={{ width: '-webkit-fill-available' }}
                          >
                            <FormControl sx={{ width: '60%' }}>
                              <InputLabel size="small">{t('ibanPage.selectIban')}</InputLabel>
                              <Select
                                id="ibanCup"
                                name="ibanCup"
                                label={t('ibanPage.selectIban')}
                                size="small"
                                value={formikCup.values.iban}
                                onChange={(e) => {
                                  formikCup.handleChange(e);
                                  handleIbanCupSelected(e);
                                }}
                                error={formikCup.touched.iban && Boolean(formikCup.errors.iban)}
                                inputProps={{
                                  'data-testid': 'cup-test',
                                }}
                              >
                                {
                                  // eslint-disable-next-line sonarjs/no-identical-functions
                                  ibanList.ibanList.map((r, i) => (
                                    <MenuItem key={i} value={r.iban}>
                                      {r.iban}
                                    </MenuItem>
                                  ))
                                }
                              </Select>
                            </FormControl>
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    <Grid container xs={12} direction="row" justifyContent="space-between" mt={3}>
                      <Grid item md={1} display="flex" justifyContent="flex-start" ml={3}>
                        {showMaganeButton ? (
                          <ButtonNaked
                            size="small"
                            component="button"
                            disabled={ibanList.ibanList.length <= 0}
                            onClick={() => setShowMaganeButton(false)}
                            endIcon={<EditIcon />}
                            sx={{ color: 'primary.main', fontWeight: 'fontWeightBold' }}
                          >
                            {t('ibanPage.manage')}
                          </ButtonNaked>
                        ) : (
                          <></>
                        )}
                      </Grid>
                      <Grid item md={1} display="flex" justifyContent="flex-end">
                        {showMaganeButton ? (
                          <></>
                        ) : (
                          <Button
                            onClick={() => setShowConfirmModal(true)}
                            color="primary"
                            variant="contained"
                            type="submit"
                          >
                            {t('ibanPage.upload')}
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Card>
                {selectedParty && (
                  <IbanTable ibanList={ibanList} error={error} loading={loading}></IbanTable>
                )}
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <IbanUploadModal
        title={t('addEditIbanPage.modal.title')}
        message={
          <Trans i18nKey="addEditIbanPage.modal.subTitle">
            Confermi i nuovi IBAN selezionati per Stand in e CUP?
            <br />
          </Trans>
        }
        openConfirmModal={showConfirmModal}
        onConfirmLabel={t('addEditIbanPage.modal.confirmButton')}
        onCloseLabel={t('addEditIbanPage.modal.backButton')}
        handleCloseConfirmModal={() => setShowConfirmModal(false)}
        handleConfrimSubmit={async () => {
          handleSubmit();
          await submit(formikStandIn.values, formikCup.values);
          setShowMaganeButton(true);
          setShowConfirmModal(false);
        }}
      />
    </>
  );
};

export default IbanPage;
