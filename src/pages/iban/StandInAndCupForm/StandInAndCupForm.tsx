import {
  Grid,
  Card,
  Chip,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { Box } from '@mui/system';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useFormik } from 'formik';
import { useTranslation, Trans } from 'react-i18next';
import { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { IbanLabel } from '../../../api/generated/portal/IbanLabel';
import { Ibans } from '../../../api/generated/portal/Ibans';
import { IbanOnCreation } from '../../../model/Iban';
import { updateIbanStandIn, updateIbanCup } from '../../../services/ibanService';
import { LOADING_TASK_IBAN_STAND_IN_AND_CUP } from '../../../utils/constants';
import { emptyIban } from '../IbanPage';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import IbanTable from '../list/IbanTable';
import GenericModal from '../../../components/Form/GenericModal';

type Props = {
  ibanList: Ibans;
  error: boolean;
  loading: boolean;
};

const StandInAndCupForm = ({ ibanList, error, loading }: Props) => {
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const [selectedIbanCup, setSelectedIbanCup] = useState<IbanOnCreation>(emptyIban);
  const [selectedIbanStandIn, setSelectedIbanStandIn] = useState<IbanOnCreation>(emptyIban);
  const [ibanStandInTriggered, setIbanStandInTriggered] = useState(false);
  const [ibanCupTriggered, setIbanCupTriggered] = useState(false);
  const [showMaganeButton, setShowMaganeButton] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [ibanActiveList, setIbanActiveList] = useState<Ibans>({ ibans_enhanced: [] });
  const setLoadingIban = useLoading(LOADING_TASK_IBAN_STAND_IN_AND_CUP);
  const { t } = useTranslation();
  const ecCode = selectedParty?.fiscalCode ?? '';

  useEffect(() => {
    if (ibanList.ibans_enhanced.length > 0) {
      filterListStandInAndCup();
      const ibanListFiltered = ibanList.ibans_enhanced.filter((list) => list.is_active === true);
      setIbanActiveList({ ibans_enhanced: [...ibanListFiltered] });
    }
  }, [selectedParty, ibanList]);

  const filterListStandInAndCup = () => {
    const ibanStandInFiltered = ibanList.ibans_enhanced.find(
      (e) => e.labels && e.labels.find((label) => label.name === 'STANDIN')
    );
    const ibanCupFiltered = ibanList.ibans_enhanced.find(
      (e) => e.labels && e.labels.find((label) => label.name === '0201138TS')
    );

    if (ibanStandInFiltered) {
      setSelectedIbanStandIn({
        iban: ibanStandInFiltered.iban!,
        description: ibanStandInFiltered.description,
        validityDate: ibanStandInFiltered.validity_date!,
        dueDate: ibanStandInFiltered.due_date!,
        creditorInstitutionCode: ibanStandInFiltered.ci_owner ?? ecCode,
        labels: ibanStandInFiltered.labels,
        active: ibanStandInFiltered.is_active!,
      });
    } else {
      setSelectedIbanStandIn(emptyIban);
    }

    if (ibanCupFiltered) {
      setSelectedIbanCup({
        iban: ibanCupFiltered.iban!,
        description: ibanCupFiltered.description,
        validityDate: ibanStandInFiltered!.validity_date!,
        dueDate: ibanStandInFiltered!.due_date!,
        creditorInstitutionCode: ibanStandInFiltered?.ci_owner ?? ecCode,
        labels: ibanCupFiltered.labels,
        active: ibanStandInFiltered!.is_active!,
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
          publicationDate: ibanSelected.publicationDate,
          labels: ibanSelected.labels,
          active: ibanSelected.active,
        }
      : {
          iban: ibanSelected.iban,
          description: ibanSelected.description,
          validityDate: ibanSelected.validityDate,
          dueDate: ibanSelected.dueDate,
          creditorInstitutionCode: ibanSelected.creditorInstitutionCode,
          active: false,
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
          publicationDate: ibanSelected.publicationDate,
          active: ibanSelected.active,
        }
      : {
          iban: ibanSelected.iban,
          description: ibanSelected.description,
          validityDate: ibanSelected.validityDate,
          dueDate: ibanSelected.dueDate,
          creditorInstitutionCode: ibanSelected.creditorInstitutionCode,
          active: false,
        };

  const handleIbanStandInSelected = (event: any) => {
    setIbanStandInTriggered(true);
    const newLabel: IbanLabel = {
      description: 'The IBAN to use for STANDIN process',
      name: 'STANDIN',
    };

    const selectedIndex = ibanList.ibans_enhanced.findIndex((e: any) => e.iban === event.target.value);
    const selectedIban = ibanList.ibans_enhanced[selectedIndex];
    const updatedLabels = [newLabel];

    setSelectedIbanStandIn({
      iban: selectedIban.iban!,
      description: selectedIban.description,
      validityDate: selectedIban.validity_date!,
      dueDate: selectedIban.due_date!,
      creditorInstitutionCode: selectedIban.ci_owner ?? ecCode,
      labels: updatedLabels,
      active: selectedIban.is_active!,
    });
  };

  const handleIbanCupSelected = (event: any) => {
    setIbanCupTriggered(true);
    const newLabel: IbanLabel = {
      description: '',
      name: '0201138TS',
    };

    const selectedIndex = ibanList.ibans_enhanced.findIndex((e) => e.iban === event.target.value);
    const selectedIban = ibanList.ibans_enhanced[selectedIndex];
    const updatedLabels = [newLabel];

    setSelectedIbanCup({
      iban: selectedIban.iban!,
      description: selectedIban.description,
      validityDate: selectedIban.validity_date!,
      dueDate: selectedIban.due_date!,
      creditorInstitutionCode: selectedIban.ci_owner ?? ecCode,
      labels: updatedLabels,
      active: selectedIban.is_active!,
    });
  };

  const formikStandIn = useFormik<IbanOnCreation>({
    initialValues: initialFormDataStandIn(selectedIbanStandIn),
    onSubmit: async () => setShowConfirmModal(true),
    enableReinitialize: true,
    validateOnMount: true,
  });

  const formikCup = useFormik<IbanOnCreation>({
    initialValues: initialFormDataCup(selectedIbanCup),
    onSubmit: async () => setShowConfirmModal(false),
    enableReinitialize: true,
    validateOnMount: true,
  });

  const submit = async (iban1?: IbanOnCreation, iban2?: IbanOnCreation) => {
    setLoadingIban(true);
    try {
      if (ibanStandInTriggered && ibanCupTriggered && iban1 && iban2) {
        await updateIbanStandIn(iban1.ecOwner!, iban1);
        await updateIbanCup(iban2.ecOwner!, iban2);
      }

      if (ibanStandInTriggered && !ibanCupTriggered && iban1) {
        await updateIbanStandIn(iban1.ecOwner!, iban1);
      }

      if (!ibanStandInTriggered && ibanCupTriggered && iban2) {
        await updateIbanCup(iban2.ecOwner!, iban2);
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
    <form onSubmit={handleSubmit}>
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
                        data-testid="iban-standin-with-manage-btn-false"
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
                          error={formikStandIn.touched.iban && Boolean(formikStandIn.errors.iban)}
                          inputProps={{
                            'data-testid': 'stand-in-test',
                          }}
                          disabled
                        >
                          {ibanActiveList.ibans_enhanced.map((r: any, i: any) => (
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
                    data-testid="iban-cup-with-manage-btn-false"
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
                            ibanActiveList.ibans_enhanced.map((r: any, i: any) => (
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
              <Grid container direction="row" justifyContent="space-between" mt={3}>
                <Grid item md={1} display="flex" justifyContent="flex-start" ml={3}>
                  {showMaganeButton ? (
                    <ButtonNaked
                      size="small"
                      component="button"
                      disabled={ibanList.ibans_enhanced.length <= 0}
                      onClick={() => setShowMaganeButton(false)}
                      endIcon={<EditIcon />}
                      sx={{ color: 'primary.main', fontWeight: 'fontWeightBold' }}
                      data-testid="iban-manage-btn"
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
                    <>
                      <Button
                        size="medium"
                        onClick={() => setShowMaganeButton(true)}
                        color="primary"
                        variant="outlined"
                        sx={{ mr: 2, whiteSpace: 'nowrap', minWidth: 'auto' }}
                        data-testid="back-button-test"
                      >
                        {t('ibanPage.delete')}
                      </Button>
                      <Button
                        onClick={() => setShowConfirmModal(true)}
                        color="primary"
                        variant="contained"
                        sx={{ whiteSpace: 'nowrap', minWidth: 'auto' }}
                        data-testid="upload-iban-test"
                      >
                        {t('ibanPage.upload')}
                      </Button>
                    </>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Card>
          <Grid item xs={12}>
            {selectedParty && <IbanTable ibanList={ibanList} error={error} loading={loading} />}
          </Grid>
        </Grid>
      </Grid>

      <GenericModal
        title={t('addEditIbanPage.modal.title')}
        message={
          <Trans i18nKey="addEditIbanPage.modal.subTitle">
            Confermi i nuovi IBAN selezionati per Stand in e CUP?
            <br />
          </Trans>
        }
        openModal={showConfirmModal}
        onConfirmLabel={t('addEditIbanPage.modal.confirmButton')}
        onCloseLabel={t('addEditIbanPage.modal.backButton')}
        handleCloseModal={() => setShowConfirmModal(false)}
        handleConfirm={async () => {
          await submit(formikStandIn.values, formikCup.values);
          setShowMaganeButton(true);
          setShowConfirmModal(false);
        }}
      />
    </form>
  );
};

export default StandInAndCupForm;
