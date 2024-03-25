/* eslint-disable functional/no-let */
import {Button, Card, Chip, FormControl, Grid, InputLabel, MenuItem, Select, Typography,} from '@mui/material';
import {Box} from '@mui/system';
import {ButtonNaked} from '@pagopa/mui-italia';
import {useErrorDispatcher, useLoading} from '@pagopa/selfcare-common-frontend';
import {Trans, useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';
import EditIcon from '@mui/icons-material/Edit';
import {IbanLabel} from '../../../api/generated/portal/IbanLabel';
import {Ibans} from '../../../api/generated/portal/Ibans';
import {IbanOnCreation} from '../../../model/Iban';
import {updateIban} from '../../../services/ibanService';
import {LOADING_TASK_IBAN_STAND_IN_AND_CUP} from '../../../utils/constants';
import {emptyIban} from '../IbanPage';
import {useAppSelector} from '../../../redux/hooks';
import {partiesSelectors} from '../../../redux/slices/partiesSlice';
import IbanTable from '../list/IbanTable';
import GenericModal from '../../../components/Form/GenericModal';
import {isIbanValid} from '../../../utils/common-utils';

type Props = {
    ibanList: Ibans;
    error: boolean;
    loading: boolean;
};

type IbanValues = {
    cup: IbanOnCreation;
    standIn: IbanOnCreation;
};

const cupLabel: IbanLabel = {
    description: '',
    name: '0201138TS',
};
const standInLabel: IbanLabel = {
    description: 'The IBAN to use for STANDIN process',
    name: 'ACA',
};

const StandInAndCupForm = ({ibanList, error, loading}: Props) => {
    const addError = useErrorDispatcher();
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

    const emptyIbanValues: IbanValues = {
        cup: emptyIban,
        standIn: emptyIban,
    };
    const [originalSelectedIban, setOriginalSelectedIban] = useState<IbanValues>(emptyIbanValues);
    const [newSelectedIban, setNewSelectedIban] = useState<IbanValues>(emptyIbanValues);
    const [showManageButton, setShowManageButton] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [ibanActiveList, setIbanActiveList] = useState<Ibans>({ibans_enhanced: []});
    const setLoadingIban = useLoading(LOADING_TASK_IBAN_STAND_IN_AND_CUP);
    const {t} = useTranslation();
    const creditorInstitutionCode = selectedParty?.fiscalCode ?? '';

    useEffect(() => {
        if (ibanList.ibans_enhanced.length > 0) {
            filterListStandInAndCup();
            const ibanListFiltered = ibanList.ibans_enhanced.filter((list) => isIbanValid(list) === true);
            setIbanActiveList({ibans_enhanced: [...ibanListFiltered]});
        }
    }, [selectedParty, ibanList]);

    const filterListStandInAndCup = () => {
        const ibanStandInFiltered = ibanList.ibans_enhanced.find(
            (e) => e.labels && e.labels.find((label) => label.name === 'ACA')
        );
        const ibanCupFiltered = ibanList.ibans_enhanced.find(
            (e) => e.labels && e.labels.find((label) => label.name === '0201138TS')
        );

        let ibanStandIn = emptyIban;
        if (ibanStandInFiltered) {
            ibanStandIn = {
                iban: ibanStandInFiltered.iban!,
                description: ibanStandInFiltered.description,
                validity_date: new Date(ibanStandInFiltered.validity_date!),
                due_date: new Date(ibanStandInFiltered.due_date!),
                creditor_institution_code: creditorInstitutionCode,
                labels: ibanStandInFiltered.labels,
                is_active: ibanStandInFiltered.is_active!,
            };
        }

        let ibanCup = emptyIban;
        if (ibanCupFiltered) {
            ibanCup = {
                iban: ibanCupFiltered.iban!,
                description: ibanCupFiltered.description,
                validity_date: new Date(ibanCupFiltered!.validity_date!),
                due_date: new Date(ibanCupFiltered!.due_date!),
                creditor_institution_code: creditorInstitutionCode,
                labels: ibanCupFiltered.labels,
                is_active: ibanCupFiltered!.is_active!,
            };
        }
        setOriginalSelectedIban({standIn: ibanStandIn, cup: ibanCup});
        setNewSelectedIban({standIn: ibanStandIn, cup: ibanCup});
    };

    const handleIbanSelected = (event: any, type: string) => {
        const selectedIban = ibanList.ibans_enhanced.find((e) => e.iban === event.target.value);

        setNewSelectedIban((prev) => ({
            ...prev,
            [type]: {
                iban: selectedIban!.iban!,
                description: selectedIban!.description,
                validity_date: new Date(selectedIban!.validity_date!),
                due_date: new Date(selectedIban!.due_date!),
                creditor_institution_code: creditorInstitutionCode,
                labels: selectedIban?.labels,
                is_active: selectedIban!.is_active!,
            },
        }));
    };

    const submit = async () => {
        setLoadingIban(true);
        try {
            const standInInitialized = originalSelectedIban.standIn.iban.length > 0;
            const cupInitialized = originalSelectedIban.cup.iban.length > 0;
            const standInTouched = newSelectedIban.standIn.iban !== originalSelectedIban.standIn.iban;
            const cupTouched = newSelectedIban.cup.iban !== originalSelectedIban.cup.iban;

            if (!standInTouched && !cupTouched) {
                return;
            }

            await resetOriginalIbans(standInInitialized, standInTouched, cupTouched, cupInitialized);
            await updateNewIbans(standInTouched, cupTouched);

            setOriginalSelectedIban(newSelectedIban);
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
            setShowManageButton(true);
            setShowConfirmModal(false);
        }

    };

    async function updateNewIbans(standInTouched: boolean, cupTouched: boolean) {
        if (newSelectedIban.cup.iban === newSelectedIban.standIn.iban) {
            // update both new ibans with one call
            await updateIban(newSelectedIban.cup.creditor_institution_code!, {
                ...newSelectedIban.cup,
                labels: [standInLabel, cupLabel],
            });
        } else {
            if (standInTouched || originalSelectedIban.cup.iban === originalSelectedIban.standIn.iban) {
                await updateIban(newSelectedIban.standIn.creditor_institution_code!, {
                    ...newSelectedIban.standIn,
                    labels: [standInLabel],
                });
            }
            if (cupTouched || originalSelectedIban.cup.iban === originalSelectedIban.standIn.iban) {
                await updateIban(newSelectedIban.cup.creditor_institution_code!, {
                    ...newSelectedIban.cup,
                    labels: [cupLabel],
                });
            }
        }
    }

    async function resetOriginalIbans(standInInitialized: boolean, standInTouched: boolean, cupTouched: boolean, cupInitialized: boolean) {
        if (originalSelectedIban.cup.iban === originalSelectedIban.standIn.iban) {
            // reset both original ibans with one call
            await resetStandIn(standInInitialized);
        } else {
            if (standInTouched) {
                await resetStandIn(standInInitialized);
            }
            if (cupTouched) {
                await resetCup(cupInitialized);
            }
        }
    }

    async function resetCup(cupInitialized: boolean) {
        if (cupInitialized) {
            await updateIban(originalSelectedIban.cup.creditor_institution_code!, {
                ...originalSelectedIban.cup,
                labels: [],
            });
        }
    }

    async function resetStandIn(standInInitialized: boolean) {
        if (standInInitialized) {
            await updateIban(originalSelectedIban.standIn.creditor_institution_code!, {
                ...originalSelectedIban.standIn,
                labels: [],
            });
        }
    }

    return (
        <>
            <Grid container spacing={2} mb={4}>
                <Grid item xs={12}>
                    <Card variant="outlined" sx={{border: 0, borderRadius: 0, p: 3, mb: 3}}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} textAlign={'end'}>
                                {!showManageButton ? (
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

                                    {showManageButton ? (
                                        <>
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                                component="span"
                                                fontSize="inherit"
                                                mr={4}
                                                data-testid="iban-standin-with-manage-btn-false"
                                            >
                                                {originalSelectedIban.standIn?.iban &&
                                                originalSelectedIban.standIn.iban?.length > 0
                                                    ? originalSelectedIban.standIn.iban
                                                    : '-'}
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography
                                            component="span"
                                            fontSize={'inherit'}
                                            fontWeight="fontWeightMedium"
                                            sx={{width: '-webkit-fill-available'}}
                                        >
                                            <FormControl sx={{width: '60%'}}>
                                                <InputLabel size="small">{t('ibanPage.selectIban')}</InputLabel>
                                                <Select
                                                    id="ibanStandIn"
                                                    name="ibanStandIn"
                                                    label={t('ibanPage.selectIban')}
                                                    size="small"
                                                    value={newSelectedIban.standIn.iban}
                                                    onChange={(e) => handleIbanSelected(e, 'standIn')}
                                                    inputProps={{
                                                        'data-testid': 'stand-in-test',
                                                    }}
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
                                    {showManageButton ? (
                                        <>
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                                component="span"
                                                fontSize="inherit"
                                                mr={4}
                                            >
                                                {originalSelectedIban.cup?.iban && originalSelectedIban.cup.iban?.length > 0
                                                    ? originalSelectedIban.cup.iban
                                                    : '-'}
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography
                                            component="span"
                                            fontSize={'inherit'}
                                            fontWeight="fontWeightMedium"
                                            sx={{width: '-webkit-fill-available'}}
                                        >
                                            <FormControl sx={{width: '60%'}}>
                                                <InputLabel size="small">{t('ibanPage.selectIban')}</InputLabel>
                                                <Select
                                                    id="ibanCup"
                                                    name="ibanCup"
                                                    label={t('ibanPage.selectIban')}
                                                    size="small"
                                                    value={newSelectedIban.cup.iban}
                                                    onChange={(e) => handleIbanSelected(e, 'cup')}
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
                                    {showManageButton ? (
                                        <ButtonNaked
                                            size="small"
                                            component="button"
                                            disabled={ibanList.ibans_enhanced.length <= 0}
                                            onClick={() => setShowManageButton(false)}
                                            endIcon={<EditIcon/>}
                                            sx={{color: 'primary.main', fontWeight: 'fontWeightBold'}}
                                            data-testid="iban-manage-btn"
                                        >
                                            {t('ibanPage.manage')}
                                        </ButtonNaked>
                                    ) : (
                                        <></>
                                    )}
                                </Grid>
                                <Grid item md={1} display="flex" justifyContent="flex-end">
                                    {showManageButton ? (
                                        <></>
                                    ) : (
                                        <>
                                            <Button
                                                size="medium"
                                                onClick={() => {
                                                    setNewSelectedIban(originalSelectedIban);
                                                    setShowManageButton(true);
                                                }}
                                                color="primary"
                                                variant="outlined"
                                                sx={{mr: 2, whiteSpace: 'nowrap', minWidth: 'auto'}}
                                                data-testid="back-button-test"
                                            >
                                                {t('ibanPage.delete')}
                                            </Button>
                                            <Button
                                                onClick={() => setShowConfirmModal(true)}
                                                color="primary"
                                                variant="contained"
                                                sx={{whiteSpace: 'nowrap', minWidth: 'auto'}}
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
                        {selectedParty && <IbanTable ibanList={ibanList} error={error} loading={loading}/>}
                    </Grid>
                </Grid>
            </Grid>

            <GenericModal
                title={t('addEditIbanPage.modal.title')}
                message={
                    <Trans i18nKey="addEditIbanPage.modal.subTitle">
                        Confermi i nuovi IBAN selezionati per Stand in e CUP?
                        <br/>
                    </Trans>
                }
                openModal={showConfirmModal}
                onConfirmLabel={t('addEditIbanPage.modal.confirmButton')}
                onCloseLabel={t('addEditIbanPage.modal.backButton')}
                handleCloseModal={() => setShowConfirmModal(false)}
                handleConfirm={() => submit()}
            />
        </>
    );
};

export default StandInAndCupForm;
